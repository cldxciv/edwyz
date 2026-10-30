# Edwyz growth and operations strategy (v1)

Status: working draft for the owner. Items marked **hypothesis** are untested and are there for the agents and you to validate. Nothing here is a market statistic.

## 1. Where Edwyz stands today

**In place:** four-language website with 20 services and 9 industries, blog and case studies from a CMS, privacy policy and NDA language, technical SEO and structured data in good shape, an AI chat assistant that captures leads, a mail server with valid SPF/DKIM record/DMARC, and now an MCP endpoint plus eleven agents.

**Gaps that cap growth (fix these before spending on reach):**

1. **No proof.** No named authors, a team page with no real people, case-study metrics that are not independently verified, no testimonials. Buyers, and search and AI systems that weigh trust, have little to rely on.
2. **No measurement.** Search Console and web analytics are not connected, so nobody can see what works.
3. **Outbound not started.** The first three council emails are drafted but unsent; DKIM signing is unconfirmed and the sending IP has no warm-up history.
4. **Thin social presence.** Profiles exist; there is no posting rhythm.

## 2. Who to sell to (hypotheses, ranked)

| # | Segment | Why it might fit | What would prove it |
|---|---|---|---|
| 1 | Australian local councils | Published contact points, recurring IT, cloud, data and web needs, a no-risk "passive security-posture review" opener | Replies to the first batch; tender sources found by the Market Intel agent |
| 2 | Mid-market firms needing AI automation or data engineering | Matches the core services and the blog and LinkedIn content | Inbound enquiries from content and LinkedIn; call bookings |
| 3 | Brands needing AI visibility (the new service) | Few competitors are offering it; strongest content asset exists | Enquiries from the AEO article and service page |
| 4 | Agencies and consultancies as partners | Can resell engineering capacity | Partner conversations from LinkedIn |

Rule: pick one segment to push hard for 30 days (recommendation: councils plus segment 2), then compare results.

## 3. How the agents work

Agents never act on the outside world. They read the site and public information, then submit **proposals** into the admin panel under *Operations*. You approve, reject or ask for more information. A developer session (Claude Code) or you applies the approved change.

| Agent | Cadence | Output you get |
|---|---|---|
| SEO | weekly | Specific technical and on-page fixes with URLs |
| AEO and GEO | weekly | Entity consistency, buyer-question coverage, honest AI-visibility actions |
| Content | weekly | One full article draft with sources, plus a topic backlog |
| Social media | weekly | Two-week LinkedIn-first calendar with tracked links |
| UX and conversion | monthly | Up to five testable experiments |
| Outbound lead generation | weekly | Segment research, email drafts, follow-ups, compliance checklist |
| Lead triage and follow-up | daily | Reply drafts and follow-up nudges for inbound leads |
| Analytics and reporting | weekly | One-page report and the list of missing data connections |
| Email deliverability | weekly | DNS findings and exact records to apply, owner checklist |
| Market intelligence | monthly | Competitor gaps, tender and RFP sources, events |
| Chief of staff | weekly, last | One brief: top five decisions, risks, focus |

**Guardrails built into the tools:** no tool can send, post, publish, deploy or change DNS. Leads reach agents without name, email or phone. A claims list (`brand_facts`) forbids invented clients, results, statistics and people. Agents treat page, lead and web text as untrusted data. Each agent has a daily proposal cap and a per-run token budget.

**Costs (measured on the first full cycle, 2026-10-26):** the eleven agents together used roughly 1.5M input and 100k output tokens (input is mostly re-read page text and is partly cached). Per agent, input and output tokens: Email deliverability 17k/5k, Analytics 15k/4k, Lead triage 57k/5k, Chief of Staff 53k/5k, Social 56k/10k, Content 133k/10k, UX 134k/11k, SEO 99k/10k, Market intel 240k/10k, AEO and GEO 309k/16k, Outbound 354k/17k. The first SEO and AEO runs wasted about 500k input tokens because of a runner bug (output cut off mid-proposal), now fixed. Convert to money with the current price list for Sonnet 5.5, Haiku 5.5 and Opus 5.5 before scheduling anything.

## 4. First 90 days

**Days 1 to 30: earn trust and start measuring**
- Add real named authors and real team members (or remove the placeholder). Gather at least one verifiable proof point you are allowed to publish.
- Verify the site in Google Search Console and add privacy-respecting analytics. Connect them to the agents later.
- Confirm DKIM signing, run a mail-tester score, then warm up the mailbox with real contacts before the council send.
- Approve and send the first three council emails yourself, from your mailbox, after the deliverability checks pass.
- Publish two articles from the Content agent after your edits. Post on LinkedIn three times a week.

**Days 31 to 60: learn what converts**
- Review lead sources and replies; double down on the one segment that responds.
- Run two UX experiments. Add FAQs and service-page proof from real questions.
- Move DMARC to `p=quarantine` if two to four weeks of reports are clean.

**Days 61 to 90: scale what works**
- Expand outbound only to segments with replies. Start the tender watch.
- Translate the best-performing content with human review, not bulk machine translation.
- Decide which agents to schedule and their budget.

## 5. Measures

Track weekly and set targets only after four weeks of baseline: inbound enquiries, qualified enquiries, calls booked, proposals sent, wins; organic clicks and impressions (Search Console); outbound reply rate; proposal approval rate per agent (a low rate means the agent needs better instructions).

## 6. What I need from you

1. Names, roles, short bios and LinkedIn links for authors and team (or confirmation that there are none yet).
2. One or more publishable proof points, or confirmation that the case-study numbers are real.
3. Search Console and analytics access, and which LinkedIn and Metricool accounts agents may draft for.
4. The outreach list you want worked, and where `email_noosa.html`, `email_leeton.html` and the target spreadsheet are.
5. A monthly budget cap for model usage before any schedule is turned on.
6. Approval to finish the production deployment (see the note on the production database change).

## 7. Running it

- List agents: `npm run agents:list`
- Run one: `npm run agents -- seo` (add `--note "extra context"` or `--dry` to preview)
- Run a full cycle: `npm run agents -- all`
- Needs `ANTHROPIC_API_KEY`, `OPS_MCP_TOKEN` and optionally `OPS_SITE_URL` in `web/.env`.
- Connect another MCP client (for example Claude Code): add an HTTP server at `https://www.edwyz.com/api/mcp` with the header `Authorization: Bearer <OPS_MCP_TOKEN>`.
