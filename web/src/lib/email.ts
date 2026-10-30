import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.EMAIL_SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_SMTP_PORT ?? 587),
    secure: process.env.EMAIL_SMTP_SECURE === "true",
    auth:
      process.env.EMAIL_SMTP_USER
        ? { user: process.env.EMAIL_SMTP_USER, pass: process.env.EMAIL_SMTP_PASS ?? "" }
        : undefined,
  });
}

const FROM = process.env.EMAIL_FROM ?? "Edwyz Website <noreply@edwyz.com>";
const NOTIFY_TO = process.env.EMAIL_NOTIFY_TO ?? "hello@edwyz.com";

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap">${label}</td><td style="padding:4px 0">${value}</td></tr>`;
}

export async function sendLeadNotification(data: {
  name: string;
  email: string;
  company?: string;
  requirements: string;
  budget?: string;
  timeline?: string;
  source: string;
}) {
  const transport = createTransport();
  if (!transport) return;

  const sourceLabel = data.source === "ai_chat" ? "AI Chat" : "Contact Form";
  const subject = `New inquiry from ${data.name} via ${sourceLabel}`;

  const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
  <div style="background:#4f46e5;padding:20px 24px;border-radius:8px 8px 0 0">
    <p style="color:#fff;font-weight:700;font-size:18px;margin:0">New Website Inquiry</p>
    <p style="color:#c7d2fe;font-size:13px;margin:4px 0 0">Source: ${sourceLabel}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Company", data.company)}
      ${row("Budget", data.budget)}
      ${row("Timeline", data.timeline)}
    </table>
    <div style="margin-top:16px;padding:12px;background:#f9fafb;border-radius:6px;font-size:14px">
      <p style="color:#6b7280;font-size:12px;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Requirements</p>
      <p style="margin:0">${data.requirements}</p>
    </div>
    <div style="margin-top:20px">
      <a href="https://edwyz.com/admin/collections/leads" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">View in Admin Panel</a>
    </div>
  </div>
</div>`;

  try {
    await transport.sendMail({ from: FROM, to: NOTIFY_TO, subject, html });
  } catch (err) {
    console.error("[email] failed to send lead notification:", err);
  }
}

export async function sendApplicationNotification(data: {
  name: string;
  email: string;
  roleSlug: string;
  phone?: string;
  message?: string;
}) {
  const transport = createTransport();
  if (!transport) return;

  const subject = `New job application — ${data.name} (${data.roleSlug})`;

  const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
  <div style="background:#059669;padding:20px 24px;border-radius:8px 8px 0 0">
    <p style="color:#fff;font-weight:700;font-size:18px;margin:0">New Job Application</p>
    <p style="color:#a7f3d0;font-size:13px;margin:4px 0 0">Role: ${data.roleSlug}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Role", data.roleSlug)}
    </table>
    ${data.message ? `<div style="margin-top:16px;padding:12px;background:#f9fafb;border-radius:6px;font-size:14px"><p style="color:#6b7280;font-size:12px;margin:0 0 6px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Message</p><p style="margin:0">${data.message}</p></div>` : ""}
    <div style="margin-top:20px">
      <a href="https://edwyz.com/admin/collections/job-applications" style="background:#059669;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">View in Admin Panel</a>
    </div>
  </div>
</div>`;

  try {
    await transport.sendMail({ from: FROM, to: NOTIFY_TO, subject, html });
  } catch (err) {
    console.error("[email] failed to send application notification:", err);
  }
}
