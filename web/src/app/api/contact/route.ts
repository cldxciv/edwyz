import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  await prisma.lead.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim(),
      company: body.company?.trim() || null,
      phone: body.phone?.trim() || null,
      requirements: body.requirements.trim(),
      budget: body.budget?.trim() || null,
      timeline: body.timeline?.trim() || null,
      source: "contact_form",
    },
  });

  return NextResponse.json({ ok: true });
}
