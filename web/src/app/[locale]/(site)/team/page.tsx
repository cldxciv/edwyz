import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/seo";
import { getPayloadClient } from "@/lib/payload";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/team", {
    title: "Meet the Edwyz Engineering Team",
    description:
      "Meet the engineers, data scientists and product builders behind Edwyz, a remote-first team delivering AI, data and cloud systems for enterprise clients.",
  });
}

export const revalidate = 3600;

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  linkedinUrl?: string;
  order: number;
  photo?: { url: string; alt: string } | null;
};

const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "The Edwyz team",
    role: "AI consulting and software engineering",
    bio: "Edwyz is an AI consulting and software engineering company based in Shimla, India. Individual team profiles will appear here. Until then, you can reach us at hello@edwyz.com.",
    order: 0,
    photo: null,
  },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  let members: TeamMember[] = FALLBACK_MEMBERS;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "team",
      limit: 100,
      sort: "order",
      overrideAccess: true,
    });
    if (docs.length > 0) members = docs as unknown as TeamMember[];
  } catch {}

  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Our Team"
          title="Built by people who ship"
          description="Edwyz is an AI consulting and software engineering company based in Shimla, India."
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.05}>
              <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col h-full">
                {member.photo?.url ? (
                  <div className="mb-4 w-16 h-16 rounded-full overflow-hidden border border-border">
                    <Image
                      src={member.photo.url}
                      alt={member.photo.alt || member.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div
                    className="mb-4 w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: "var(--color-accent, #6366f1)", color: "#fff" }}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}

                <p className="font-semibold text-base mb-0.5">{member.name}</p>
                <p className="text-xs text-muted mb-3">{member.role}</p>

                {member.bio && (
                  <p className="text-sm text-muted leading-relaxed flex-1">{member.bio}</p>
                )}

                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
                  >
                    <LinkedInIcon />
                    LinkedIn
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="font-semibold text-lg mb-2">Want to join the team?</p>
          <p className="text-sm text-muted mb-6">We hire curious people who care deeply about engineering quality. See what we're looking for.</p>
          <Button href="/careers">View Open Roles</Button>
        </div>
      </Container>
    </div>
  );
}
