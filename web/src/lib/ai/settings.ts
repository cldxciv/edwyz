import { getPayloadClient } from "@/lib/payload";

export async function getAiSettings() {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "settings" });

  return {
    apiKey: settings.anthropicApiKey?.trim() || process.env.ANTHROPIC_API_KEY || "",
    chatEnabled: settings.chatEnabled ?? true,
  };
}
