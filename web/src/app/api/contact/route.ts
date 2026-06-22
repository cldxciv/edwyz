import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  if (!body.name?.trim() || !body.email?.trim() || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid name and email." }, { status: 400 });
  }

  if (!body.requirements?.trim()) {
    return NextResponse.json({ ok: false, error: "Please tell us about your requirements." }, { status: 400 });
  }

  // Phase 2 will persist this to the leads table and trigger an email notification.
  console.log("[contact] new lead:", {
    name: body.name,
    email: body.email,
    company: body.company,
    phone: body.phone,
    budget: body.budget,
    timeline: body.timeline,
    requirements: body.requirements,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
