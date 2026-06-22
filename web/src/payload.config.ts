import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "dev-only-insecure-secret-change-me",
  admin: {
    user: "users",
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [],
    },
    {
      slug: "media",
      access: { read: () => true },
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
      access: { read: () => true },
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
      access: { read: () => true },
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
      access: { read: () => true },
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
      access: { read: () => true },
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "slug", type: "text", required: true, unique: true, index: true },
        { name: "department", type: "text", required: true, localized: true },
        { name: "location", type: "text", required: true, defaultValue: "Remote", localized: true },
        { name: "type", type: "text", required: true, defaultValue: "Full-time", localized: true },
        { name: "isOpen", type: "checkbox", required: true, defaultValue: true },
      ],
    },
  ],
  globals: [
    {
      slug: "settings",
      label: "AI Settings",
      access: {
        read: ({ req }) => Boolean(req.user),
      },
      fields: [
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
