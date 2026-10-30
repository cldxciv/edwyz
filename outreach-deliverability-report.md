# Edwyz outreach deliverability report

Date: 2026-10-03. Scope: edwyz.com, mail.edwyz.com, IP 69.62.76.109 only. Nothing was changed, sent, or logged into. No council systems were touched.

## Summary

| Item | Status |
|---|---|
| MX / SPF / rDNS | OK |
| DKIM DNS record | Valid, 2048-bit RSA key. Signing by the server is NOT yet confirmed (needs user test) |
| DMARC | p=none, rua to anshuman@edwyz.com. Fine for now |
| Blacklists (IP + domain) | Not listed on any list queried (see task 3) |
| mail-tester | Blocked: needs a test address from the user |
| MTA-STS / TLS-RPT | Not present. Drafts below |
| Email files | Only bega-valley found. Noosa and Leeton NOT found |
| australia_gov_outreach_targets.xlsx | Not found (search of Downloads, Desktop, Documents, projects; see task 6) |

---

## Task 1. DKIM verification

### Found
`mail._domainkey.edwyz.com` TXT (via 8.8.8.8):
`v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0B...DAQAB`

- Syntax correct (v, h, k, p tags).
- The p= value decodes as valid base64, 294 bytes, which is a standard 2048-bit RSA SubjectPublicKeyInfo. Good strength.
- SPF at edwyz.com: `v=spf1 a:mail.edwyz.com ip4:69.62.76.109 -all`. One SPF record only (the other TXT is a Google site-verification). Good.
- Whether Exim/Postfix actually signs with selector "mail" and the matching private key is unknown from DNS alone.

### Blocked on user: confirm signing
**Option A (easiest, no server access).**
1. In Roundcube (webmail), send a short plain test from anshuman@edwyz.com to a Gmail address you control.
2. In Gmail open the message, three-dot menu, "Show original".
3. Confirm the summary at the top shows: `DKIM: PASS with domain edwyz.com`, `SPF: PASS with IP 69.62.76.109`, `DMARC: PASS`.
4. In the raw headers look for `DKIM-Signature: ... d=edwyz.com; s=mail;`. If there is no DKIM-Signature header, the server is not signing.
5. If you see `dkim=neutral`/`fail (body hash did not verify)` or `signature verification failed`, the private key on the server does not match the DNS public key.

**Option B (on the server, run yourself over your own SSH session).**
```
# Which MTA?
systemctl status exim4 postfix opendkim 2>/dev/null | grep -E "Active|●"

# Exim: look for DKIM settings
grep -rniE "dkim_(domain|selector|private_key)" /etc/exim4/ /etc/exim/ 2>/dev/null

# Postfix + OpenDKIM
grep -rn "milter" /etc/postfix/main.cf
cat /etc/opendkim.conf
cat /etc/opendkim/KeyTable /etc/opendkim/SigningTable 2>/dev/null

# Private key present and matching selector
ls -l /etc/opendkim/keys/edwyz.com/ 2>/dev/null
opendkim-testkey -d edwyz.com -s mail -vvv      # expect: key OK

# Recent log evidence of signing
grep -iE "dkim" /var/log/mail.log /var/log/exim4/mainlog 2>/dev/null | tail -20
```
`opendkim-testkey` printing "key OK" proves the DNS key matches the local private key. If the server is a panel (Hestia, CloudPanel, Mailcow, Mail-in-a-Box and so on) the panel's mail-domain page usually shows DKIM state.

---

## Task 2. mail-tester.com

**Blocked: no test address supplied.** I did not invent one.

Steps for the user:
1. Open https://www.mail-tester.com. It shows a one-time address like `test-xxxxxxxx@srv1.mail-tester.com`.
2. Copy that address and paste it to Claude, or send from Roundcube yourself.
3. Send from anshuman@edwyz.com a message that looks like the real email (use `email_bega-valley-v2.html` content, with subject line and footer). Send as HTML with plain-text alternative if Roundcube allows (compose settings, "HTML" editor; Roundcube adds a text part automatically when sending HTML).
4. Click "Then check your score" within the same session. Free tier allows about 3 tests/day per IP.
5. Aim for 9/10 or above. Report any lost points (rDNS, DKIM, DMARC, HTML ratio, blacklist). Note: mail-tester may flag "DMARC policy none" lightly. That is expected.

Do not send to the councils as a "test".

---

## Task 3. Blacklist lookups (DNS only)

Method: `Resolve-DnsName <reversed-IP>.<zone>` for the IP (queried as 109.76.62.69.<zone>), and `edwyz.com.<zone>` for the domain. NXDOMAIN = not listed. An A answer in 127.0.0.x would be a listing. Queries were run from this PC's default resolver; the Spamhaus ZEN query was repeated via 8.8.8.8.

| List | Target | Result |
|---|---|---|
| zen.spamhaus.org | IP | NXDOMAIN (not listed) |
| b.barracudacentral.org | IP | NXDOMAIN (not listed) |
| bl.spamcop.net | IP | NXDOMAIN (not listed) |
| dnsbl.sorbs.net / spam.dnsbl.sorbs.net | IP | NXDOMAIN (not listed). Note SORBS was reportedly decommissioned, so this proves little |
| psbl.surriel.com | IP | NXDOMAIN (not listed) |
| dnsbl-1.uceprotect.net | IP | NXDOMAIN (not listed) |
| cbl.abuseat.org | IP | NXDOMAIN (not listed). CBL data is now folded into Spamhaus XBL |
| dnsbl.dronebl.org | IP | NXDOMAIN (not listed) |
| bl.score.senderscore.com | IP | NXDOMAIN (no bad score listing) |
| dbl.spamhaus.org | domain | NXDOMAIN (not listed) |
| multi.surbl.org | domain | NXDOMAIN (not listed) |
| multi.uribl.com | domain | NXDOMAIN (not listed) |
| dbl.nordspam.com | domain | NXDOMAIN (not listed) |

No 127.255.255.x error codes were returned, and no listings. Caveat: Spamhaus normally blocks queries from big public resolvers and returns 127.255.255.254/252; a plain NXDOMAIN is the expected "clean" answer, but to be certain, check manually at https://check.spamhaus.org (enter 69.62.76.109 and edwyz.com). Also check https://mxtoolbox.com/blacklists.aspx and https://multirbl.valli.org (free web forms, one IP at a time). Also note: this is a shared hosting-provider IP range; ranges (for example UCEPROTECT level 2/3) can be listed even when the single IP is clean. Not seen here.

Not covered by DNS: Microsoft SNDS/JMDP and Google Postmaster reputation. Councils commonly use Microsoft 365 or Google, so register edwyz.com at https://postmaster.google.com (needs a DNS TXT verification, which you apply) and https://sendersupport.olc.protection.outlook.com/snds/ for the IP.

---

## Task 4. DMARC aggregate-report plan

Current record (do not change yet): `v=DMARC1; p=none; rua=mailto:anshuman@edwyz.com`

**Where reports arrive:** anshuman@edwyz.com (Roundcube). Providers (Google, Microsoft, Yahoo) send one zipped/gzipped XML per day each, only if they received mail from you. Expect none until you actually send to those providers. Councils on Microsoft 365 will generate Microsoft reports.

**Inbox hygiene:** make a Roundcube folder "DMARC" and a filter on subject `Report Domain: edwyz.com` (Google format) and `Report-ID`. This keeps the mailbox usable and lets you review in batches.

**How to read them (pick one):**
- Easiest: a free digest service. Postmark DMARC Digests (free weekly digest; you change the rua to their address, so combine with your own, e.g. `rua=mailto:anshuman@edwyz.com,mailto:<their-address>`), dmarcian (free tier for one domain), or Valimail Monitor. This changes DNS, so only when you choose.
- Free local: unzip and open the XML, or use the open-source `parsedmarc` tool (`pip install parsedmarc`) to turn XML into CSV/JSON.
- Manual: in each XML read `<record>`: `source_ip`, `count`, `policy_evaluated` (`dkim`, `spf`), and `<auth_results>`.

**What to look for:**
1. Your IP 69.62.76.109 shows `dkim=pass` and `spf=pass` with `disposition=none`. Both should pass (alignment on edwyz.com).
2. Any other `source_ip` sending as edwyz.com (for example your website contact-form sender, Payload CMS or app SMTP, Google Workspace, newsletters). Each must be added to SPF/DKIM or stopped before enforcement.
3. Forwarders cause SPF failures but DKIM pass; that is fine.
4. Unknown IPs with high counts: spoofing attempts. Another reason to move to enforcement.

**Roadmap (propose only):**
- Weeks 0-2: monitor, p=none. Send the warm-up and first batch.
- After 2-4 weeks with at least ~95-100% of legitimate volume passing DKIM or SPF with alignment and no unknown legitimate senders: change to
  `v=DMARC1; p=quarantine; pct=25; rua=mailto:anshuman@edwyz.com; adkim=r; aspf=r`
- Then pct=50, 100 over another 2-4 weeks, later consider `p=reject`.
- Proposed (not applied) TXT at `_dmarc.edwyz.com`: the string above.

---

## Task 5. Optional hardening drafts (NOT applied)

These mostly protect inbound mail to edwyz.com; they do not affect deliverability to councils. Low priority. Only do after the mail server has a valid TLS certificate (check below).

### MTA-STS
DNS TXT, name `_mta-sts.edwyz.com`:
```
v=STSv1; id=20261003T000000
```
(Change `id` every time the policy file changes.)

DNS for `mta-sts.edwyz.com`: A record (or CNAME) to a web host that serves HTTPS with a valid certificate for exactly `mta-sts.edwyz.com`. A record would point to 69.62.76.109 if the VPS web server serves it, or to the web server you choose (needs its own cert).

Policy file at `https://mta-sts.edwyz.com/.well-known/mta-sts.txt` (content-type text/plain, CRLF line endings preferred):
```
version: STSv1
mode: testing
mx: mail.edwyz.com
max_age: 86400
```
Start with `mode: testing`. After 2-4 weeks of clean TLS-RPT reports, change to `mode: enforce`, `max_age: 604800` or longer, and bump the TXT `id`.

### TLS-RPT
DNS TXT, name `_smtp._tls.edwyz.com`:
```
v=TLSRPTv1; rua=mailto:anshuman@edwyz.com
```

### Confirm TLS
- Certificate: `openssl s_client -starttls smtp -connect mail.edwyz.com:25 -servername mail.edwyz.com` (run against our own server). Check `Verify return code: 0 (ok)`, that the cert covers mail.edwyz.com, and expiry.
- Outbound: in the Gmail "Show original" test, the Received headers show `(version=TLS1_3 ...)`. Also in Gmail, the header "Received: ... with ESMTPS" or the lock icon on the address indicates TLS in transit. On the server, grep logs: Exim logs `X=TLS1.3` on delivery lines; Postfix logs `TLS connection established to ...`.
- Exim: confirm `tls_certificate`/`tls_privatekey` set and `remote_smtp` uses `hosts_try_auth`/`tls_require_ciphers` as needed; Postfix: `smtp_tls_security_level = may` (or `encrypt` per council not recommended).

---

## Task 6. Email review

### Files located
- `C:\Users\ADMIN\Downloads\email_bega-valley.html` (modified 09:36 PM)
- `C:\Users\ADMIN\Downloads\email_bega-valley (1).html` (09:47 PM, differs from the first; this is the newer, richer version I reviewed)
- **`email_noosa.html`: NOT FOUND.** Searched `C:\Users\ADMIN\projects\edwyz`, `Downloads`, `Desktop`, and filename searches for `*noosa*` in Documents and projects.
- **`email_leeton.html`: NOT FOUND**, same search.
- **`australia_gov_outreach_targets.xlsx`: NOT FOUND** (a full user-profile search timed out; targeted searches of Downloads, Desktop, Documents and projects found nothing).

**Question for the user:** where are email_noosa.html, email_leeton.html and australia_gov_outreach_targets.xlsx? Possibly in a different download folder, a chat attachment, or never saved. I did not make up their contents; I only produced a v2 for Bega Valley.

### Spam-trigger findings (Bega Valley, newer version)
1. Heavy nested table layout (about 10 nested tables, 2x2 card grid, banner header with background colour, large coloured button). Marketing-newsletter look is a negative for a "personal" cold email and raises Microsoft/Google filtering likelihood.
2. No plain-text alternative part supplied.
3. Button text "Book a free 20-minute call" links to a `mailto:` rather than the Calendly link; "free" in button plus "free" three times in body. Reduce "free".
4. Subject line "Modern systems and a free security posture review..." reads promotional. Earlier version subject ("A free look at ...") is closer to plain.
5. Footer has placeholder **[YOUR POSTAL ADDRESS]**: must be replaced with `#2, Type 3, Parimahal, Shimla-9 (H.P.), India` (legal requirement under Australia's Spam Act 2003 too: accurate sender identification and a functional unsubscribe).
6. Calendly link absent in both originals.
7. Truthfulness issues to confirm before any send:
   - "I read the iTnews coverage of Bega Valley Shire Council's call for a broader approach to council cyber security": I cannot verify this; only keep if you actually read it and it is accurate. Removed in v2.
   - "built direct-booking websites for two Shimla hospitality businesses (one now takes 85% of reservations directly)" and "AI document-processing pipeline for an insurer that cut an underwriting cycle from 14 days to under 6 hours": these figures do not appear in the site source I searched, so I could not verify them. Removed numbers in v2; add back only with evidence.
   - "security built in" and "has spoken publicly about council cyber security": unverified; removed.
   - The first version said Edwyz "carries out security assessments"; make sure that is something you can deliver.
8. Compliance note: the Spam Act 2003 (Australia) generally requires consent for commercial electronic messages. Sending to a council's published address can fall under "inferred consent" only when the address is conspicuously published and the message is relevant to the recipient's role; sending to a generic enquiries inbox is borderline. Consider a lawyer or the ACMA guidance. This is a note, not legal advice.
9. The unsubscribe instruction ("reply with unsubscribe") is acceptable but must be honoured promptly (within 5 working days), and each recipient suppressed.

### v2 files created (originals untouched)
- `C:\Users\ADMIN\Downloads\email_bega-valley-v2.html`: single column, no nested tables, no images, one Calendly link, full footer.
- `C:\Users\ADMIN\Downloads\email_bega-valley-v2.txt`: plain-text alternative.

Sending notes: send as multipart/alternative (HTML plus text). In Roundcube, pasting HTML source is awkward; the simplest is to send the .txt version as plain text, which is entirely acceptable and best for deliverability. Keep one link only (Calendly), keep the website in the signature (a bare domain is fine). Subject suggestion: "Free passive security review offer for Bega Valley Shire Council" or the shorter "A free look at Bega Valley Shire Council's public security posture".

---

## Task 7. IP/domain warm-up plan

Mailbox anshuman@edwyz.com sends from a (probably) new or low-reputation domain/IP. Aim: build positive engagement (replies, not-spam) before the councils. Use REAL contacts who know you and will reply: friends, colleagues, clients, your own Gmail/Outlook accounts. Never buy lists. Ask each person to reply, and mark not-spam if it lands in junk.

Pre-flight (day 0): finish task 1 (DKIM pass), task 3 clean, mail-tester 9/10+, postal footer ready.

| Day | Sends | Detail |
|---|---|---|
| 1 | 3-5 | To your own Gmail, Outlook.com, Yahoo accounts and 1-2 close contacts. Short, personal, plain text. Reply from each, so conversation threads exist. |
| 2 | 5 | 3 personal contacts plus own accounts. Ask for a reply. |
| 3 | 5-8 | Mix of Gmail and Outlook recipients. Include one with a normal link (edwyz.com). |
| 4 | Rest day or replies only | Reply to anything received; check DMARC/Postmaster. |
| 5 | 8-10 | Real business contacts, plain text, each one one-to-one and different wording. |
| 6 | 10 | Same. Check bounce rate (must be 0%) and spam placement. |
| 7 | 10-12 | Include a recipient on Microsoft 365 (many councils use it) if you have one. |
| 8-9 | Weekend or light, 5 | Replies only. |
| 10 | 15 | Genuine business conversations; continue. |
| 11-12 | 15-20 | Stay low; stop immediately if bounces or spam complaints appear. |
| 13+ | Council batch: 3 emails across the day, spaced hours apart | Only after explicit user approval and all checks. Keep under 20/day for the first month. |

Rules:
- Different wording per message, no attachments, one link maximum, no tracking pixels.
- Aim for at least 30-50% of warm-up emails to get a reply.
- If a message lands in spam: move it to inbox, mark "Not spam", reply.
- Daily check: Roundcube for bounces (5xx), `anshuman@edwyz.com` DMARC reports, Google Postmaster once volume allows.
- Stop and investigate on any bounce mentioning "blocked", "blacklist", "policy", "550 5.7.x".
- Council send: personalised, 1-to-1, no CC lists, honour any "unsubscribe" reply immediately.

---

## Blocked on the user (checklist)
1. Gmail "Show original" test result (task 1).
2. A mail-tester.com test address (task 2).
3. Location of email_noosa.html, email_leeton.html and australia_gov_outreach_targets.xlsx (task 6), plus confirmation of any claims used in emails.
4. Decision on DNS changes (DMARC digest rua, MTA-STS, TLS-RPT). Nothing was applied.
5. Explicit approval before any send to a council. None was sent.
