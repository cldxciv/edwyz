import { getPayloadClient } from "@/lib/payload";

export async function getAiSettings() {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "settings" });
    const admin = (settings.anthropicApiKey as string | undefined)?.trim();
    const env = process.env.ANTHROPIC_API_KEY?.trim();
    return {
      apiKeys: [admin, env].filter((k, i, all): k is string => Boolean(k) && all.indexOf(k) === i),
      chatEnabled: (settings.chatEnabled as boolean | undefined) ?? true,
    };
  } catch {
    // Settings table may be missing columns during migration — fall back to env
    const env = process.env.ANTHROPIC_API_KEY?.trim();
    return {
      apiKeys: env ? [env] : [],
      chatEnabled: true,
    };
  }
}
