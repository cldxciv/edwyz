async function postToSlack(webhookUrl: string, text: string, blocks?: unknown[]) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
    });
  } catch (err) {
    console.error("[slack] failed to send notification:", err);
  }
}

export async function sendLeadSlackNotification(
  webhookUrl: string,
  data: { name: string; email: string; company?: string; requirements: string; budget?: string; timeline?: string; source: string }
) {
  const sourceLabel = data.source === "ai_chat" ? "AI Chat" : "Contact Form";
  const fields = [
    { type: "mrkdwn", text: `*Name:*\n${data.name}` },
    { type: "mrkdwn", text: `*Email:*\n${data.email}` },
    ...(data.company ? [{ type: "mrkdwn", text: `*Company:*\n${data.company}` }] : []),
    ...(data.budget ? [{ type: "mrkdwn", text: `*Budget:*\n${data.budget}` }] : []),
    ...(data.timeline ? [{ type: "mrkdwn", text: `*Timeline:*\n${data.timeline}` }] : []),
  ];

  await postToSlack(webhookUrl, `New inquiry from ${data.name} via ${sourceLabel}`, [
    {
      type: "header",
      text: { type: "plain_text", text: "🎯 New Website Inquiry", emoji: true },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Source:* ${sourceLabel}` },
    },
    { type: "section", fields },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Requirements:*\n${data.requirements}` },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View in Admin" },
          url: "https://edwyz.com/admin/collections/leads",
          style: "primary",
        },
      ],
    },
  ]);
}

export async function sendApplicationSlackNotification(
  webhookUrl: string,
  data: { name: string; email: string; roleSlug: string; phone?: string; message?: string }
) {
  await postToSlack(webhookUrl, `New job application from ${data.name} for ${data.roleSlug}`, [
    {
      type: "header",
      text: { type: "plain_text", text: "📋 New Job Application", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name:*\n${data.name}` },
        { type: "mrkdwn", text: `*Email:*\n${data.email}` },
        { type: "mrkdwn", text: `*Role:*\n${data.roleSlug}` },
        ...(data.phone ? [{ type: "mrkdwn", text: `*Phone:*\n${data.phone}` }] : []),
      ],
    },
    ...(data.message
      ? [{ type: "section", text: { type: "mrkdwn", text: `*Message:*\n${data.message}` } }]
      : []),
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View in Admin" },
          url: "https://edwyz.com/admin/collections/job-applications",
          style: "primary",
        },
      ],
    },
  ]);
}
