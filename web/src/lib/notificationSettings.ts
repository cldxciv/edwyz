import { getPayloadClient } from "@/lib/payload";

let cachedWebhook: string | null | undefined = undefined;
let cachedAt = 0;
const CACHE_TTL = 60_000;

export async function getSlackWebhookUrl(): Promise<string | null> {
  const now = Date.now();
  if (cachedWebhook !== undefined && now - cachedAt < CACHE_TTL) {
    return cachedWebhook;
  }
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "settings", overrideAccess: true });
    const url = (settings as { slackWebhookUrl?: string }).slackWebhookUrl ?? null;
    cachedWebhook = url;
    cachedAt = now;
    return url;
  } catch {
    return null;
  }
}
