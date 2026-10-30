import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

type Role = "super-admin" | "admin" | "editor" | "marketing" | "hr";

function hasRole(...roles: Role[]) {
  return ({ req }: { req: { user?: unknown } }): boolean => {
    const user = req.user as { role?: Role } | undefined;
    return Boolean(user?.role && roles.includes(user.role));
  };
}

const isContentEditor = hasRole("super-admin", "admin", "editor");
const isLeadManager = hasRole("super-admin", "admin", "marketing");
const isHrManager = hasRole("super-admin", "admin", "hr");
const isAdmin = hasRole("super-admin", "admin");
const isOpsReviewer = hasRole("super-admin", "admin", "marketing", "editor");

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "dev-only-insecure-secret-change-me",
  email: nodemailerAdapter({
    defaultFromName: "Edwyz",
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS ?? "noreply@edwyz.com",
    transportOptions: {
      host: process.env.EMAIL_SMTP_HOST ?? "127.0.0.1",
      port: Number(process.env.EMAIL_SMTP_PORT ?? 25),
      secure: false,
      ...(process.env.EMAIL_SMTP_USER
        ? { auth: { user: process.env.EMAIL_SMTP_USER, pass: process.env.EMAIL_SMTP_PASS ?? "" } }
        : {}),
    },
  }),
  admin: {
    user: "users",
    components: {
      afterDashboard: ["@/components/admin/DashboardStats"],
    },
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email", defaultColumns: ["email", "role"] },
      access: {
        read: ({ req }) => Boolean(req.user),
        create: isAdmin,
        update: ({ req, id }) => {
          if (!req.user) return false;
          const role = (req.user as { role?: Role }).role;
          return req.user.id === id || Boolean(role && (role === "super-admin" || role === "admin"));
        },
        delete: hasRole("super-admin"),
      },
      fields: [
        {
          name: "role",
          type: "select",
          required: true,
          defaultValue: "editor",
          options: [
            { label: "Super Admin", value: "super-admin" },
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Marketing", value: "marketing" },
            { label: "HR", value: "hr" },
          ],
          access: {
            update: isAdmin,
          },
        },
      ],
    },
    {
      slug: "media",
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      upload: {
        staticDir: path.resolve(dirname, "../public/media"),
      },
      fields: [
        { name: "alt", type: "text", required: true },
      ],
    },
    {
      slug: "posts",
      admin: { useAsTitle: "title", defaultColumns: ["title", "category", "publishedAt"] },
      versions: { drafts: true },
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        { name: "excerpt", type: "textarea", required: true, localized: true },
        { name: "category", type: "text", required: true, localized: true },
        { name: "author", type: "text", required: true, defaultValue: "Edwyz Research Team" },
        { name: "readingTime", type: "text", required: true, defaultValue: "5 min read", localized: true },
        { name: "publishedAt", type: "date", required: true },
        { name: "content", type: "richText", editor: lexicalEditor({}), required: true, localized: true },
      ],
    },
    {
      slug: "case-studies",
      admin: { useAsTitle: "title" },
      versions: { drafts: true },
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        { name: "client", type: "text", required: true },
        { name: "industry", type: "text", required: true, localized: true },
        { name: "summary", type: "textarea", required: true, localized: true },
        { name: "challenge", type: "textarea", required: true, localized: true },
        { name: "solution", type: "textarea", required: true, localized: true },
        {
          name: "results",
          type: "array",
          minRows: 1,
          localized: true,
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
      ],
    },
    {
      slug: "testimonials",
      admin: { useAsTitle: "author" },
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      fields: [
        { name: "quote", type: "textarea", required: true, localized: true },
        { name: "author", type: "text", required: true },
        { name: "role", type: "text", required: true, localized: true },
        { name: "company", type: "text", required: true },
        { name: "rating", type: "number", required: true, min: 1, max: 5, defaultValue: 5 },
      ],
    },
    {
      slug: "job-listings",
      admin: { useAsTitle: "title", defaultColumns: ["title", "department", "location", "isOpen"] },
      access: { read: () => true, create: isHrManager, update: isHrManager, delete: isHrManager },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        { name: "department", type: "text", required: true, localized: true },
        { name: "location", type: "text", required: true, defaultValue: "Remote", localized: true },
        { name: "type", type: "text", required: true, defaultValue: "Full-time", localized: true },
        { name: "isOpen", type: "checkbox", required: true, defaultValue: true },
      ],
    },
    {
      slug: "leads",
      admin: {
        useAsTitle: "email",
        defaultColumns: ["name", "email", "company", "source", "status", "createdAt"],
        group: "CRM",
      },
      access: {
        read: isLeadManager,
        create: () => true,
        update: isLeadManager,
        delete: isLeadManager,
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "text", required: true },
        { name: "company", type: "text" },
        { name: "phone", type: "text" },
        { name: "requirements", type: "textarea", required: true },
        { name: "budget", type: "text" },
        { name: "timeline", type: "text" },
        {
          name: "source",
          type: "select",
          required: true,
          defaultValue: "contact_form",
          options: [
            { label: "Contact Form", value: "contact_form" },
            { label: "AI Chat", value: "ai_chat" },
            { label: "Chat Ticket", value: "chat_ticket" },
          ],
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "new",
          options: [
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Qualified", value: "qualified" },
            { label: "Won", value: "won" },
            { label: "Lost", value: "lost" },
          ],
        },
        { name: "assignedTo", type: "relationship", relationTo: "users" },
        { name: "notes", type: "textarea" },
      ],
    },
    {
      slug: "ops-proposals",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "agent", "kind", "priority", "status", "createdAt"],
        group: "Operations",
        description:
          "Work proposed by the AI agents. Nothing here is sent, published or changed until you act on it. Approve, reject or ask for more information.",
      },
      access: {
        read: isOpsReviewer,
        create: () => false,
        update: isOpsReviewer,
        delete: isAdmin,
      },
      fields: [
        { name: "title", type: "text", required: true, index: true },
        { name: "agent", type: "text", required: true, index: true },
        { name: "kind", type: "text", required: true },
        {
          name: "priority",
          type: "select",
          required: true,
          defaultValue: "medium",
          options: [
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ],
        },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "pending",
          index: true,
          options: [
            { label: "Pending review", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Applied", value: "applied" },
            { label: "Needs more info", value: "needs_info" },
            { label: "Rejected", value: "rejected" },
          ],
        },
        { name: "summary", type: "textarea", required: true },
        { name: "details", type: "textarea", admin: { description: "Full draft or exact change, in Markdown." } },
        { name: "reviewerNote", type: "textarea", admin: { description: "Your decision notes. Visible to agents so they learn from them." } },
        { name: "runId", type: "text", admin: { readOnly: true } },
      ],
    },
    {
      slug: "job-applications",
      admin: {
        useAsTitle: "email",
        defaultColumns: ["name", "email", "roleSlug", "status", "createdAt"],
        group: "CRM",
      },
      access: {
        read: isHrManager,
        create: () => true,
        update: isHrManager,
        delete: isHrManager,
      },
      fields: [
        { name: "roleSlug", type: "text", required: true, defaultValue: "general" },
        { name: "name", type: "text", required: true },
        { name: "email", type: "text", required: true },
        { name: "phone", type: "text" },
        { name: "message", type: "textarea" },
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "new",
          options: [
            { label: "New", value: "new" },
            { label: "Reviewing", value: "reviewing" },
            { label: "Interview", value: "interview" },
            { label: "Rejected", value: "rejected" },
            { label: "Hired", value: "hired" },
          ],
        },
        { name: "assignedTo", type: "relationship", relationTo: "users" },
      ],
    },
    {
      slug: "faqs",
      admin: { useAsTitle: "question", defaultColumns: ["question", "category", "order"] },
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      fields: [
        { name: "question", type: "text", required: true, localized: true },
        { name: "answer", type: "textarea", required: true, localized: true },
        { name: "category", type: "text", defaultValue: "General", localized: true },
        { name: "order", type: "number", defaultValue: 0, admin: { description: "Lower numbers appear first." } },
      ],
    },
    {
      slug: "team",
      admin: { useAsTitle: "name", defaultColumns: ["name", "role", "order"] },
      access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", required: true, localized: true },
        { name: "bio", type: "textarea", localized: true },
        { name: "photo", type: "upload", relationTo: "media" },
        { name: "linkedinUrl", type: "text", admin: { description: "Full LinkedIn profile URL" } },
        { name: "order", type: "number", defaultValue: 0, admin: { description: "Lower numbers appear first." } },
      ],
    },
    {
      slug: "seo-pages",
      admin: {
        useAsTitle: "path",
        defaultColumns: ["path", "metaTitle", "noIndex"],
        group: "SEO",
      },
      access: {
        read: () => true,
        create: isContentEditor,
        update: isContentEditor,
        delete: isContentEditor,
      },
      fields: [
        { name: "path", type: "text", required: true, unique: true, index: true, admin: { description: "e.g. /about, /contact, / for the homepage" } },
        { name: "metaTitle", type: "text", localized: true },
        { name: "metaDescription", type: "textarea", localized: true },
        { name: "ogImage", type: "upload", relationTo: "media" },
        { name: "canonicalPath", type: "text", admin: { description: "Optional override, e.g. /about (defaults to the page's own path)" } },
        { name: "noIndex", type: "checkbox", defaultValue: false },
      ],
    },
  ],
  globals: [
    {
      slug: "settings",
      label: "Site Settings",
      access: {
        read: ({ req }) => Boolean(req.user),
        update: isAdmin,
      },
      fields: [
        {
          name: "notificationEmail",
          type: "text",
          label: "Notification Email",
          admin: {
            description:
              "Email address that receives alerts for new leads and job applications. Defaults to hello@edwyz.com. Requires EMAIL_SMTP_* environment variables to be configured on the server.",
          },
        },
        {
          name: "whatsappNumber",
          type: "text",
          label: "WhatsApp Number",
          admin: {
            description:
              "Phone number with country code (e.g. +919876543210). When set, a WhatsApp chat button appears on the site. Leave blank to hide.",
          },
        },
        {
          name: "anthropicApiKey",
          type: "text",
          label: "Anthropic API Key",
          admin: {
            description:
              "Used by the website's AI chat assistant. Falls back to the ANTHROPIC_API_KEY environment variable if left blank. Get a key at console.anthropic.com.",
          },
        },
        {
          name: "chatEnabled",
          type: "checkbox",
          label: "Enable AI chat assistant on the site",
          defaultValue: true,
        },
        {
          name: "calendlyUrl",
          type: "text",
          label: "Calendly URL",
          admin: {
            description:
              "Your Calendly scheduling link (e.g. https://calendly.com/yourname/30min). When set, a booking widget appears on the Contact page.",
          },
        },
        {
          name: "slackWebhookUrl",
          type: "text",
          label: "Slack Webhook URL",
          admin: {
            description:
              "Incoming webhook URL for Slack notifications on new leads and applications. Get it from api.slack.com/apps → Incoming Webhooks.",
          },
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  localization: {
    locales: ["en", "es", "fr", "de"],
    defaultLocale: "en",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    schemaName: "payload",
  }),
  typescript: {
    outputFile: path.resolve(dirname, "generated/payload-types.ts"),
  },
});
