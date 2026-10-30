import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";
import { createAnthropicClient, CHAT_MODEL } from "@/lib/ai/client";
import { getAiSettings } from "@/lib/ai/settings";
import { retrieveRelevantChunks } from "@/lib/ai/knowledge";
import { getPayloadClient } from "@/lib/payload";
import { sendLeadNotification } from "@/lib/email";
import { sendLeadSlackNotification } from "@/lib/slack";
import { getSlackWebhookUrl } from "@/lib/notificationSettings";
import { siteConfig } from "@/lib/nav";

type ChatMessage = { role: "user" | "assistant"; content: string };

const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: "capture_lead",
  description:
    "Save the visitor's contact details and project needs as a sales lead. Call this once you have at least their name, email, and a description of what they need — don't wait for budget/timeline if the visitor hasn't volunteered them.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's full name" },
      email: { type: "string", description: "Visitor's email address" },
      company: { type: "string", description: "Visitor's company, if mentioned" },
      requirements: { type: "string", description: "Summary of what the visitor needs" },
      budget: { type: "string", description: "Budget range, if mentioned" },
      timeline: { type: "string", description: "Timeline, if mentioned" },
    },
    required: ["name", "email", "requirements"],
    additionalProperties: false,
  },
};

function buildSystemPrompt(contextText: string) {
  return `You are the AI assistant for ${siteConfig.name}, an AI/software/data engineering company. ${siteConfig.description}

Answer questions about Edwyz's services, industries, case studies, and blog using the context below. Be concise and helpful. If a question is unrelated to Edwyz or technology consulting, politely redirect to what you can help with.

Format replies for a small chat window. Keep them short: one or two brief paragraphs, or a short list. You may use **bold** for key terms, "- " bullets for lists of up to five items, numbered lists for steps, and [link text](/services) style links using only site paths such as /services, /industries, /case-studies, /blog, /about, /contact, /faq or /team (never invent URLs and never use other domains). Do not use tables, code blocks, images or headings. Lead with the answer.

End every reply, except when you are asking for the visitor's contact details, with one final line in exactly this form offering two or three short follow-up options the visitor might tap, each under 40 characters:
<<suggest: First option | Second option | Third option>>
Never mention or explain this line.

If the visitor expresses interest in working with Edwyz, naturally ask for their name, email, and what they need, then call the capture_lead tool once you have that information. Don't be pushy about it.

Context from the Edwyz website:
${contextText}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`chat:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ ok: false, error: "No messages provided." }, { status: 400 });
  }

  const { apiKeys, chatEnabled } = await getAiSettings();

  if (!chatEnabled) {
    return NextResponse.json(
      { ok: false, error: "The AI assistant is currently disabled." },
      { status: 503 },
    );
  }

  if (apiKeys.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The AI assistant isn't configured yet. An admin needs to add an Anthropic API key in /admin under AI Settings.",
      },
      { status: 503 },
    );
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const relevantChunks = await retrieveRelevantChunks(lastUserMessage?.content ?? "", 5);
  const contextText = relevantChunks
    .map((c) => `### ${c.title} (${c.url})\n${c.text}`)
    .join("\n\n");

  // The admin-panel key is tried first, then the server's ANTHROPIC_API_KEY, if the first is rejected or out of credit.
  let keyIndex = 0;
  const createMessage = async (params: Anthropic.MessageCreateParamsNonStreaming) => {
    for (;;) {
      try {
        return await createAnthropicClient(apiKeys[keyIndex]).messages.create(params);
      } catch (e) {
        const status = (e as { status?: number }).status;
        const message = e instanceof Error ? e.message : "";
        const keyProblem = status === 401 || status === 403 || (status === 400 && /credit balance/i.test(message));
        if (keyProblem && keyIndex < apiKeys.length - 1) {
          console.warn(`[chat] API key ${keyIndex + 1} was rejected (${status}); trying the next key`);
          keyIndex++;
          continue;
        }
        throw e;
      }
    }
  };

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let iteration = 0; iteration < 4; iteration++) {
      const response = await createMessage({
        model: CHAT_MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(contextText),
        tools: [CAPTURE_LEAD_TOOL],
        messages: anthropicMessages,
      });

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
      );

      if (toolUseBlocks.length === 0) {
        const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
        return NextResponse.json({ ok: true, reply: textBlock?.text ?? "" });
      }

      anthropicMessages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        if (toolUse.name === "capture_lead") {
          const input = toolUse.input as {
            name: string;
            email: string;
            company?: string;
            requirements: string;
            budget?: string;
            timeline?: string;
          };
          const leadData = {
            name: input.name,
            email: input.email,
            company: input.company ?? undefined,
            requirements: input.requirements,
            budget: input.budget ?? undefined,
            timeline: input.timeline ?? undefined,
            source: "ai_chat" as const,
          };
          const payload = await getPayloadClient();
          await payload.create({ collection: "leads", data: leadData });
          void sendLeadNotification(leadData);
          void getSlackWebhookUrl().then((url) => {
            if (url) void sendLeadSlackNotification(url, leadData);
          });
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: "Lead captured. Thank the visitor and let them know the team will follow up.",
          });
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: "Unknown tool.",
            is_error: true,
          });
        }
      }

      anthropicMessages.push({ role: "user", content: toolResults });
    }

    return NextResponse.json({ ok: true, reply: "Let me get a member of our team to follow up with you directly." });
  } catch (error) {
    console.error("[chat] error:", error);

    // Auto-create a support ticket so the team can follow up
    void (async () => {
      try {
        const emailMatch = messages
          .map((m) => m.content)
          .join(" ")
          .match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
        const transcript = messages
          .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
          .join("\n\n");
        const payload = await getPayloadClient();
        await payload.create({
          collection: "leads",
          data: {
            name: "Chat Error — Auto Ticket",
            email: emailMatch?.[0] ?? "noreply+chaterror@edwyz.com",
            requirements: `Visitor hit a chat error and may need manual follow-up.\n\nTranscript:\n${transcript}`,
            source: "ai_chat" as const,
          },
        });
      } catch (e) {
        console.error("[chat] failed to create error ticket:", e);
      }
    })();

    return NextResponse.json(
      { ok: false, error: "The AI assistant hit an error. Please try again or use the contact form." },
      { status: 502 },
    );
  }
}
