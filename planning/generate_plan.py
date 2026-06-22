import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

HEADER_FILL = PatternFill(start_color="111111", end_color="111111", fill_type="solid")
HEADER_FONT = Font(color="FFFFFF", bold=True, size=11)
PHASE_FILL = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
PHASE_FONT = Font(color="FFFFFF", bold=True, size=12)
MILESTONE_FILL = PatternFill(start_color="DCEEFB", end_color="DCEEFB", fill_type="solid")
MILESTONE_FONT = Font(bold=True)
THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")

def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical="center")
        cell.border = BORDER

def autosize(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

# ---------------- SHEET 1: OVERVIEW ----------------
ov = wb.active
ov.title = "Overview"
ov_headers = ["Phase", "Goal", "Key Deliverables", "Duration (weeks)", "Status"]
ov.append(ov_headers)
style_header(ov, 1, len(ov_headers))

overview_rows = [
    ["Phase 1 - Marketing Site (MVP)", "Ship a real, fast, good-looking public website with no backend complexity", "Next.js site live on Vercel: Home, About, Services, Industries, Case Studies, Blog (MDX), Contact form, SEO basics, GA4/Clarity", "2-3", "Not Started"],
    ["Phase 2 - CMS + Lead Capture", "Let non-devs edit content; capture and store leads properly", "Headless CMS (Sanity/Payload) wired to Blog/Case Studies/Testimonials/Careers, Postgres leads table, email notifications", "2-3", "Not Started"],
    ["Phase 3 - Claude AI Integration", "Ship the AI differentiator: chatbot + lead qualification", "Claude-powered chat widget with RAG over site content, lead capture via chat, pgvector store", "2", "Not Started"],
    ["Phase 4 - Admin Panel + CRM", "Replace ad-hoc tooling with a real internal product", "Auth + RBAC admin app, lead pipeline/CRM, analytics dashboard, SEO controls, AI usage analytics", "3-4", "Not Started"],
    ["Phase 5 - Scale-out Features", "Add growth/hardening features only as justified by real usage", "Social auto-posting, multi-language, WAF/rate-limiting/MFA, marketing automation", "Ongoing", "Not Started"],
]
for r in overview_rows:
    ov.append(r)

for row in range(2, ov.max_row + 1):
    ov.cell(row=row, column=1).font = Font(bold=True)
    for col in range(1, 6):
        ov.cell(row=row, column=col).alignment = WRAP
        ov.cell(row=row, column=col).border = BORDER

autosize(ov, [30, 45, 60, 16, 14])
ov.freeze_panes = "A2"

# ---------------- DATA FOR PHASE SHEETS ----------------
# Each row: Milestone, Task, Description, Deliverable, Est. Days, Priority, Dependencies, Status

phase1 = {
    "title": "Phase 1 - Marketing Site (MVP)",
    "milestones": [
        ("M1.1 Project Setup", [
            ["Initialize repo & tooling", "Next.js 15 (App Router) + TypeScript + Tailwind + ESLint/Prettier setup", "Running local dev environment", 1, "High", "-", "Not Started"],
            ["Design system foundation", "Define color tokens, typography (Inter/Space Grotesk/Sora), spacing scale, dark theme base", "Tailwind config + base UI components", 2, "High", "Project Setup", "Not Started"],
            ["Set up Framer Motion + React Three Fiber", "Install and configure animation/3D libraries with a basic test scene", "Working animation/3D pipeline", 1, "Medium", "Design system", "Not Started"],
        ]),
        ("M1.2 Core Pages", [
            ["Build Home page hero", "One signature 3D/WebGL hero element, animated headline, CTA buttons", "Live hero section", 3, "High", "M1.1", "Not Started"],
            ["Build Home page sections", "About snippet, Services preview, Tech stack wall, Industries grid, Testimonials, Blog preview, Contact CTA", "Fully assembled homepage", 4, "High", "Hero", "Not Started"],
            ["Build About Us page", "Story, vision, mission, leadership, culture, animated counters", "Live About page", 2, "Medium", "M1.1", "Not Started"],
            ["Build Services template + content", "One reusable service-detail template driven by data, populated for all listed services", "All service pages live", 3, "High", "M1.1", "Not Started"],
            ["Build Industries page", "Interactive industry cards grid", "Live Industries page", 1, "Medium", "M1.1", "Not Started"],
            ["Build Case Studies (static/MDX)", "Filterable case study list + detail template", "Live Case Studies section", 3, "Medium", "M1.1", "Not Started"],
            ["Build Blog (MDX-based)", "Blog index + post template, categories/tags, reading time", "Live Blog (no CMS yet)", 2, "Medium", "M1.1", "Not Started"],
            ["Build Contact page", "Contact form (name/email/company/phone/requirements/budget/timeline), map embed", "Working contact form -> email", 2, "High", "M1.1", "Not Started"],
        ]),
        ("M1.3 SEO & Analytics", [
            ["Technical SEO baseline", "Metadata API, sitemap.xml, robots.txt, canonical URLs, JSON-LD schema", "Passing SEO audit", 2, "High", "Core pages", "Not Started"],
            ["OG/social previews", "Open Graph + Twitter Card images per page", "Correct link previews", 1, "Medium", "Core pages", "Not Started"],
            ["Analytics integration", "GA4 + Microsoft Clarity wired in", "Live analytics tracking", 1, "Medium", "Core pages", "Not Started"],
        ]),
        ("M1.4 Launch", [
            ["Performance pass", "Optimize images, fonts, bundle size; target Lighthouse 95+", "Lighthouse report >=95 perf/SEO/best practices", 2, "High", "All pages", "Not Started"],
            ["Responsive QA", "Test across desktop/laptop/tablet/mobile/ultra-wide", "Verified responsive layouts", 2, "High", "All pages", "Not Started"],
            ["Deploy to production", "Connect Vercel, custom domain, HTTPS, env vars", "Live production site", 1, "High", "Performance pass", "Not Started"],
        ]),
    ],
}

phase2 = {
    "title": "Phase 2 - CMS + Lead Capture",
    "milestones": [
        ("M2.1 CMS Setup", [
            ["Select & install headless CMS", "Stand up Sanity (or Payload) project, define schemas for Blog/Case Studies/Testimonials/Careers", "Working CMS studio", 2, "High", "Phase 1 live", "Not Started"],
            ["Migrate MDX content to CMS", "Move existing blog/case study content into CMS entries", "Content fully in CMS", 1, "Medium", "CMS setup", "Not Started"],
            ["Wire frontend to CMS API", "Replace MDX data fetching with CMS queries (ISR/SSG)", "Pages render from CMS", 3, "High", "CMS setup", "Not Started"],
        ]),
        ("M2.2 Lead Capture Backend", [
            ["Provision Postgres database", "Set up managed Postgres (e.g. Supabase/RDS/Neon)", "Live DB instance", 1, "High", "-", "Not Started"],
            ["Build leads schema + API route", "Leads table, validation, Next.js API route/server action for form submission", "Working lead storage", 2, "High", "Postgres", "Not Started"],
            ["Email notifications", "Send notification email on new lead via Resend/SendGrid", "Email alerts on submit", 1, "Medium", "Leads API", "Not Started"],
        ]),
        ("M2.3 Careers Module", [
            ["Careers listing page", "Job listings pulled from CMS", "Live Careers page", 2, "Medium", "CMS setup", "Not Started"],
            ["Application form", "Resume upload + application capture into leads/applicants table", "Working application flow", 2, "Medium", "Lead capture backend", "Not Started"],
        ]),
    ],
}

phase3 = {
    "title": "Phase 3 - Claude AI Integration",
    "milestones": [
        ("M3.1 Knowledge Base", [
            ["Set up vector store", "Enable pgvector on Postgres (or provision Pinecone)", "Working vector store", 1, "High", "Phase 2 DB", "Not Started"],
            ["Build content ingestion pipeline", "Chunk + embed services, case studies, FAQs, blog content", "Indexed knowledge base", 3, "High", "Vector store", "Not Started"],
        ]),
        ("M3.2 Chat Widget", [
            ["Integrate Claude API", "Server-side route calling Claude with RAG-retrieved context", "Working chat backend", 3, "High", "Knowledge base", "Not Started"],
            ["Build chat UI widget", "Floating assistant widget with streaming responses, site-wide", "Live chatbot on site", 3, "High", "Claude API integration", "Not Started"],
            ["Lead qualification flow", "Bot collects name/email/need and writes to leads table", "Chat-sourced leads in DB", 2, "Medium", "Chat UI + leads API", "Not Started"],
        ]),
        ("M3.3 QA & Guardrails", [
            ["Prompt tuning & guardrails", "System prompt scoped to company info, refusal handling, rate limiting", "Stable, on-topic assistant", 2, "Medium", "Chat widget", "Not Started"],
        ]),
    ],
}

phase4 = {
    "title": "Phase 4 - Admin Panel + CRM",
    "milestones": [
        ("M4.1 Admin Foundation", [
            ["Set up admin app/auth", "Next.js admin route group or app, auth via Clerk/NextAuth", "Working login-gated admin shell", 3, "High", "Phase 2 DB", "Not Started"],
            ["Implement RBAC", "Roles: Super Admin/Admin/Editor/Content/Marketing/HR with permission checks", "Working role-based access", 3, "High", "Admin auth", "Not Started"],
        ]),
        ("M4.2 CRM / Lead Pipeline", [
            ["Lead pipeline UI", "Kanban/list view of leads with status (new/contacted/qualified/won/lost)", "Working lead pipeline", 3, "High", "Admin foundation", "Not Started"],
            ["Assignment & follow-up reminders", "Assign leads to team members, due-date reminders/notifications", "Working assignment + reminders", 2, "Medium", "Lead pipeline UI", "Not Started"],
        ]),
        ("M4.3 Dashboard & SEO Controls", [
            ["Analytics dashboard", "Pull GA4 API + DB metrics (traffic, leads, conversions) into admin dashboard", "Live metrics dashboard", 3, "Medium", "Admin foundation", "Not Started"],
            ["SEO control panel", "Per-page meta title/description/OG/canonical/redirects editable from admin", "Admin-editable SEO fields", 3, "Medium", "Admin foundation", "Not Started"],
            ["AI usage & conversation analytics", "Track chat volume, qualified leads from chat, token usage", "AI analytics view in admin", 2, "Low", "Phase 3 chat", "Not Started"],
        ]),
    ],
}

phase5 = {
    "title": "Phase 5 - Scale-out Features",
    "milestones": [
        ("M5.1 Growth Features", [
            ["Social media integrations", "Auto-posting to LinkedIn/X/Instagram, social feed embeds, share buttons", "Working social integrations", 4, "Low", "Phase 4", "Not Started"],
            ["Marketing automation", "Email drip sequences for leads, campaign tracking", "Automated lead nurture flows", 4, "Low", "Phase 4 CRM", "Not Started"],
            ["Multi-language support", "next-intl setup, translated content for priority languages", "Live i18n site", 5, "Low", "Phase 1-2", "Not Started"],
        ]),
        ("M5.2 Hardening", [
            ["Security hardening", "WAF (Cloudflare), rate limiting, CAPTCHA on forms, MFA for admin, audit logs", "Hardened production environment", 3, "High", "Phase 4 live", "Not Started"],
            ["CI/CD pipeline", "GitHub Actions for lint/test/build/deploy across environments", "Automated deploy pipeline", 2, "Medium", "-", "Not Started"],
        ]),
    ],
}

phases = [phase1, phase2, phase3, phase4, phase5]
task_headers = ["Milestone", "Task", "Description", "Deliverable", "Est. Days", "Priority", "Dependencies", "Status"]

for ph in phases:
    sheet_name = ph["title"].split(" - ")[0].replace("Phase ", "P")
    ws = wb.create_sheet(title=sheet_name)
    ws.append([ph["title"]])
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(task_headers))
    cell = ws.cell(row=1, column=1)
    cell.fill = PHASE_FILL
    cell.font = PHASE_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 24

    ws.append(task_headers)
    style_header(ws, 2, len(task_headers))

    row_idx = 3
    for milestone_name, tasks in ph["milestones"]:
        ws.cell(row=row_idx, column=1, value=milestone_name)
        ws.merge_cells(start_row=row_idx, start_column=1, end_row=row_idx, end_column=len(task_headers))
        mcell = ws.cell(row=row_idx, column=1)
        mcell.fill = MILESTONE_FILL
        mcell.font = MILESTONE_FONT
        row_idx += 1
        for t in tasks:
            ws.cell(row=row_idx, column=2, value=t[0])
            ws.cell(row=row_idx, column=3, value=t[1])
            ws.cell(row=row_idx, column=4, value=t[2])
            ws.cell(row=row_idx, column=5, value=t[3])
            ws.cell(row=row_idx, column=6, value=t[4])
            ws.cell(row=row_idx, column=7, value=t[5])
            ws.cell(row=row_idx, column=8, value=t[6])
            for c in range(1, len(task_headers) + 1):
                ws.cell(row=row_idx, column=c).border = BORDER
                ws.cell(row=row_idx, column=c).alignment = WRAP
            row_idx += 1

    autosize(ws, [22, 30, 55, 30, 10, 10, 22, 14])
    ws.freeze_panes = "A3"

out_path = r"c:\Users\ADMIN\projects\edwyz\planning\Edwyz_Project_Plan.xlsx"
wb.save(out_path)
print("Saved:", out_path)
