import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { sendApplicationNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { sendApplicationSlackNotification } from "@/lib/slack";
import { getSlackWebhookUrl } from "@/lib/notificationSettings";

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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`applications:${ip}`, 3, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = (await request.json()) as ApplicationPayload;

  const roleSlug = body.roleSlug?.trim() || "general";
  const payload = await getPayloadClient();

  if (roleSlug !== "general") {
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

  const appData = {
    roleSlug,
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone?.trim() || undefined,
    message: body.message?.trim() || undefined,
  };
  await payload.create({ collection: "job-applications", data: appData });
  void sendApplicationNotification(appData);
  void getSlackWebhookUrl().then((url) => {
    if (url) void sendApplicationSlackNotification(url, appData);
  });

  return NextResponse.json({ ok: true });
}
