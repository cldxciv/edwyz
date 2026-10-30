import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/privacy", {
    title: "Privacy Policy",
    description:
      "How Edwyz collects, uses, stores and protects personal data, including data from contact forms, careers applications and LinkedIn advertising.",
  });
}

const EFFECTIVE_DATE = "September 20, 2026";
const COMPANY = "Edwyz Technologies Private Limited";
const WEBSITE = "https://edwyz.com";
const EMAIL = "hello@edwyz.com";
const ADDRESS = "India";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="py-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Legal</p>
          <h1 className="font-display text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted">
            Effective date: <strong className="text-foreground">{EFFECTIVE_DATE}</strong>
            &nbsp;&nbsp;·&nbsp;&nbsp;Last updated: <strong className="text-foreground">{EFFECTIVE_DATE}</strong>
          </p>
        </div>

        <div className="prose-policy space-y-10 text-[15px] leading-[1.8] text-muted [&_a]:text-cyan [&_a]:underline-offset-2 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:mt-2 [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-muted [&_strong]:text-foreground [&_p]:text-muted">

          {/* 1 */}
          <section>
            <h2>1. Who We Are</h2>
            <p>
              {COMPANY} (&ldquo;Edwyz&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the
              website at <a href={WEBSITE}>{WEBSITE}</a> and provides technology consulting services including cloud
              infrastructure, AI/LLM engineering, and digital transformation. Our registered address is in {ADDRESS}.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, store, and protect personal information when you
              interact with our website, contact forms, AI chat assistant, job application portal, and any advertising
              campaigns we run — including campaigns on LinkedIn.
            </p>
            <p>
              By using our website or submitting your information through any of our forms or advertisements, you agree
              to the practices described in this policy.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li>
                <strong>Contact &amp; Enquiry Forms:</strong> name, email address, company name, phone number, budget
                range, project requirements, and timeline.
              </li>
              <li>
                <strong>LinkedIn Lead Generation Forms:</strong> when you respond to one of our LinkedIn advertisements,
                LinkedIn may pre-fill and transmit your name, email address, job title, company name, and LinkedIn
                profile data to us via LinkedIn&rsquo;s Lead Gen Forms feature, subject to your LinkedIn privacy
                settings.
              </li>
              <li>
                <strong>AI Chat Assistant:</strong> messages and information you voluntarily share during a conversation
                with our on-site AI chat. Conversations may be stored to improve service quality and to follow up on
                business enquiries.
              </li>
              <li>
                <strong>Job Applications:</strong> name, email address, phone number, cover message, and any details
                you choose to include when applying for a role listed on our Careers page.
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li>
                <strong>Usage Data:</strong> IP address, browser type and version, operating system, referring URL,
                pages visited, and timestamps of visits.
              </li>
              <li>
                <strong>Cookies &amp; Similar Technologies:</strong> see Section 9 (Cookies) for details.
              </li>
              <li>
                <strong>LinkedIn Insight Tag:</strong> if you visit our website via a LinkedIn advertisement, the
                LinkedIn Insight Tag may collect data about your visit. See Section 8 (LinkedIn Advertising).
              </li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>
              We may receive information about you from LinkedIn (via Lead Gen Forms or matched audiences), referral
              partners, or public sources such as company websites or LinkedIn profiles, where we have a legitimate
              business reason to do so.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your enquiries and provide the services or information you requested.</li>
              <li>
                Qualify and manage sales leads — our team may contact you by email or phone to discuss your
                requirements.
              </li>
              <li>Process and evaluate job applications.</li>
              <li>Send service-related communications (e.g., proposal follow-ups, project updates).</li>
              <li>
                Improve our website, content, and advertising based on aggregated analytics and feedback.
              </li>
              <li>Comply with applicable legal obligations.</li>
              <li>
                Protect against fraud, abuse, or security threats to our systems.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data to third parties. We do not use your data for automated
              decision-making that produces legal or similarly significant effects without human review.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2>4. Legal Basis for Processing (GDPR / UK GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA) or the United Kingdom, we process your personal
              data under one or more of the following legal bases:
            </p>
            <ul>
              <li>
                <strong>Legitimate Interests:</strong> to respond to business enquiries, manage leads, and operate our
                sales process — we balance this against your privacy rights.
              </li>
              <li>
                <strong>Performance of a Contract:</strong> where processing is necessary to provide services you have
                engaged us for or are considering engaging us for.
              </li>
              <li>
                <strong>Consent:</strong> where you have explicitly consented, for example by submitting a LinkedIn
                Lead Gen Form with your details.
              </li>
              <li>
                <strong>Legal Obligation:</strong> where we are required by law to retain or process certain data.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2>5. Confidentiality &amp; Non-Disclosure</h2>
            <p>
              We understand that business enquiries often involve sensitive or proprietary information. Any information
              you share with us in the course of a sales enquiry, project discussion, or consultation is treated with
              strict confidentiality by our team.
            </p>
            <p>
              Where a formal Non-Disclosure Agreement (NDA) is required before detailed discussions proceed — for
              instance, when sharing product roadmaps, proprietary processes, or intellectual property — we are happy
              to execute a mutual NDA prior to any technical scoping calls. Please request this via{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
            <p>
              Unless an NDA specifies otherwise, our standard confidentiality obligations include:
            </p>
            <ul>
              <li>Not disclosing your business details, project requirements, or commercial terms to third parties.</li>
              <li>
                Restricting access to your information to only those team members who need it to respond to your
                enquiry.
              </li>
              <li>Not using your confidential information for any purpose other than evaluating or delivering the
                services discussed.</li>
            </ul>
            <p>
              These obligations survive the termination of any engagement or the deletion of your data from our
              systems.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2>6. Data Sharing &amp; Third-Party Processors</h2>
            <p>
              We share personal data only where necessary and under appropriate safeguards. Current third-party
              processors include:
            </p>
            <ul>
              <li>
                <strong>LinkedIn Ireland Unlimited Company</strong> — advertising platform and lead form provider.
                Governed by LinkedIn&rsquo;s own Privacy Policy.
              </li>
              <li>
                <strong>Anthropic, PBC</strong> — the AI model powering our on-site chat assistant. Conversations may
                be processed by Anthropic&rsquo;s API under their data processing terms.
              </li>
              <li>
                <strong>Cloud Infrastructure Providers</strong> — our CMS and website are hosted on a Virtual Private
                Server. Server providers process data only as instructed by us.
              </li>
            </ul>
            <p>
              All processors are bound by data processing agreements and are prohibited from using your data for their
              own purposes.
            </p>
            <p>
              We may disclose your information to law enforcement or regulatory authorities where required by law, or
              to protect the rights, property, or safety of Edwyz, its clients, or the public.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2>7. Data Retention</h2>
            <ul>
              <li>
                <strong>Sales Leads &amp; Enquiries:</strong> retained for up to <strong>3 years</strong> from the
                date of last contact, after which they are permanently deleted from our CRM unless an active
                engagement exists.
              </li>
              <li>
                <strong>Job Applications:</strong> retained for <strong>12 months</strong> from the date of
                application, after which unsuccessful applications are deleted.
              </li>
              <li>
                <strong>AI Chat Transcripts:</strong> retained for up to <strong>90 days</strong> for quality and
                follow-up purposes, then deleted.
              </li>
              <li>
                <strong>Website Analytics Logs:</strong> retained for up to <strong>13 months</strong> in aggregated
                or anonymised form.
              </li>
            </ul>
            <p>
              We may retain data for longer periods where required by law or where a contractual relationship exists.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2>8. LinkedIn Advertising</h2>
            <p>
              We run paid advertising campaigns on LinkedIn. By interacting with our LinkedIn ads or submitting a
              LinkedIn Lead Gen Form, the following applies:
            </p>
            <ul>
              <li>
                LinkedIn may share your profile data with us as described in their{" "}
                <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                .
              </li>
              <li>
                We may install the <strong>LinkedIn Insight Tag</strong> on our website, which allows LinkedIn to
                collect data about visitors for conversion tracking and retargeting. You can opt out via your{" "}
                <a
                  href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn advertising settings
                </a>
                .
              </li>
              <li>
                Data received via LinkedIn Lead Gen Forms is stored in our CRM and is used solely to follow up on your
                enquiry. You may withdraw your consent at any time by emailing{" "}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2>9. Cookies</h2>
            <p>
              Our website uses cookies and similar tracking technologies. The types we use include:
            </p>
            <ul>
              <li>
                <strong>Strictly Necessary Cookies:</strong> required for the website to function (e.g., session
                management). Cannot be disabled.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> help us understand how visitors interact with our website
                (page views, session duration, referral sources). Collected in aggregated or anonymised form.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> placed by LinkedIn and potentially other advertising platforms to
                measure campaign effectiveness.
              </li>
            </ul>
            <p>
              You can control or disable non-essential cookies via your browser settings. Disabling cookies may affect
              some functionality of the website.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2>10. International Data Transfers</h2>
            <p>
              Edwyz is based in India. If you are located in the EEA, UK, or another jurisdiction with data transfer
              restrictions, your personal data may be transferred to and processed in India or other countries where
              our third-party processors operate.
            </p>
            <p>
              Where required, we rely on appropriate safeguards such as Standard Contractual Clauses (SCCs) or the
              processor&rsquo;s own adequacy mechanisms to protect your data during international transfers.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2>11. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul>
              <li>
                <strong>Access:</strong> request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Rectification:</strong> ask us to correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erasure:</strong> request deletion of your personal data (&ldquo;right to be
                forgotten&rdquo;), subject to legal retention obligations.
              </li>
              <li>
                <strong>Restriction:</strong> ask us to temporarily stop processing your data in certain circumstances.
              </li>
              <li>
                <strong>Portability:</strong> receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Objection:</strong> object to processing based on legitimate interests, including direct
                marketing.
              </li>
              <li>
                <strong>Withdraw Consent:</strong> where processing is based on consent, withdraw it at any time
                without affecting the lawfulness of prior processing.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will respond
              within 30 days. We may ask you to verify your identity before acting on a request.
            </p>
            <p>
              If you are in the EEA, you also have the right to lodge a complaint with your local data protection
              supervisory authority.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2>12. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against
              accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access. These measures
              include:
            </p>
            <ul>
              <li>TLS encryption for all data in transit.</li>
              <li>Access controls limiting data access to authorised personnel only.</li>
              <li>Regular security reviews of our systems and third-party processors.</li>
            </ul>
            <p>
              No method of transmission over the internet or method of electronic storage is 100% secure. In the
              event of a data breach that poses a risk to your rights or freedoms, we will notify you and relevant
              authorities as required by applicable law.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2>13. Children&rsquo;s Privacy</h2>
            <p>
              Our website and services are directed at business professionals and are not intended for individuals
              under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has
              submitted data to us, please contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will promptly
              delete it.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2>14. Links to Third-Party Websites</h2>
            <p>
              Our website may contain links to third-party websites (including LinkedIn, GitHub, and client case
              studies). We are not responsible for the privacy practices of those sites and encourage you to review
              their privacy policies independently.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2>15. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or
              legal requirements. We will post the updated policy on this page with a revised effective date. For
              material changes, we will provide additional notice where appropriate (e.g., by email or a prominent
              notice on our website).
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2>16. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your data rights, or want to
              request an NDA before a project discussion, please contact us:
            </p>
            <div className="mt-4 rounded-xl border border-border bg-surface p-6">
              <p className="font-semibold text-foreground">{COMPANY}</p>
              <p className="mt-1">{ADDRESS}</p>
              <p className="mt-1">
                Email:{" "}
                <a href={`mailto:${EMAIL}`} className="text-cyan">
                  {EMAIL}
                </a>
              </p>
              <p className="mt-1">
                Website:{" "}
                <a href={WEBSITE} className="text-cyan">
                  {WEBSITE}
                </a>
              </p>
            </div>
            <p className="mt-6 text-sm text-muted">
              We aim to respond to all privacy-related requests within <strong>5 business days</strong>.
            </p>
          </section>

        </div>
      </Container>
    </div>
  );
}
