import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAnthropicClient, CHAT_MODEL } from "@/lib/ai/client";
import { getAiSettings } from "@/lib/ai/settings";
import { retrieveRelevantChunks } from "@/lib/ai/knowledge";
import { prisma } from "@/lib/db";
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

If the visitor expresses interest in working with Edwyz, naturally ask for their name, email, and what they need, then call the capture_lead tool once you have that information. Don't be pushy about it.

Context from the Edwyz website:
${contextText}`;
}

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ ok: false, error: "No messages provided." }, { status: 400 });
  }

  const { apiKey, chatEnabled } = await getAiSettings();

  if (!chatEnabled) {
    return NextResponse.json(
      { ok: false, error: "The AI assistant is currently disabled." },
      { status: 503 },
    );
  }

  if (!apiKey) {
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

  const client = createAnthropicClient(apiKey);

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let iteration = 0; iteration < 4; iteration++) {
      const response = await client.messages.create({
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
          await prisma.lead.create({
            data: {
              name: input.name,
              email: input.email,
              company: input.company ?? null,
              requirements: input.requirements,
              budget: input.budget ?? null,
              timeline: input.timeline ?? null,
              source: "ai_chat",
            },
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
    return NextResponse.json(
      { ok: false, error: "The AI assistant hit an error. Please try again or use the contact form." },
      { status: 502 },
    );
  }
}
