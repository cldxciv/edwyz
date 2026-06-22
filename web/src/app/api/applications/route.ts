import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPayloadClient } from "@/lib/payload";

type ApplicationPayload = {
  roleSlug?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ApplicationPayload;

  const roleSlug = body.roleSlug?.trim() || "general";

  if (roleSlug !== "general") {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "job-listings",
      where: { slug: { equals: roleSlug } },
      limit: 1,
    });
    if (docs.length === 0) {
      return NextResponse.json({ ok: false, error: "Unknown role." }, { status: 400 });
    }
  }

  if (!body.name?.trim() || !body.email?.trim() || !isValidEmail(body.email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid name and email." }, { status: 400 });
  }

  await prisma.jobApplication.create({
    data: {
      roleSlug,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      message: body.message?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
