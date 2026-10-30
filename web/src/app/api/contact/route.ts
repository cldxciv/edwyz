import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { sendLeadSlackNotification } from "@/lib/slack";
import { getSlackWebhookUrl } from "@/lib/notificationSettings";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  requirements?: string;
  message?: string; // alias for requirements (used by chat ticket form)
  budget?: string;
  timeline?: string;
  source?: "contact_form" | "ai_chat" | "chat_ticket";
  website?: string; // honeypot: real visitors never fill this
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = (await request.json()) as ContactPayload;

  if (body.website?.trim()) return NextResponse.json({ ok: true });

  if (!body.name?.trim() || !body.email?.trim() || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid name and email." }, { status: 400 });
  }

  const requirements = body.requirements?.trim() || body.message?.trim();
  if (!requirements) {
    return NextResponse.json({ ok: false, error: "Please tell us about your requirements." }, { status: 400 });
  }

  const payload = await getPayloadClient();
  const leadData = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company?.trim() || undefined,
    phone: body.phone?.trim() || undefined,
    requirements,
    budget: body.budget?.trim() || undefined,
    timeline: body.timeline?.trim() || undefined,
    source: (body.source ?? "contact_form") as "contact_form" | "ai_chat" | "chat_ticket",
  };
  await payload.create({ collection: "leads", data: leadData });
  void sendLeadNotification(leadData);
  void getSlackWebhookUrl().then((url) => {
    if (url) void sendLeadSlackNotification(url, leadData);
  });

  return NextResponse.json({ ok: true });
}
