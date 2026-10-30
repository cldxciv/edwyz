import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getServiceBySlug } from "@/lib/data/services";
import { serviceForPost } from "@/lib/data/service-links";

export async function PostCta({ postSlug }: { postSlug: string }) {
  const t = await getTranslations("BlogPostPage");
  const service = await getServiceBySlug(serviceForPost(postSlug));
  if (!service) return null;
  const campaign = encodeURIComponent(postSlug);

  return (
    <aside className="mt-12 rounded-2xl border border-border bg-surface p-6" aria-labelledby="post-cta-title">
      <h2 id="post-cta-title" className="font-heading text-lg font-semibold text-foreground">
        {t("ctaTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("ctaBody")}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href={`/contact?utm_source=blog&utm_medium=cta&utm_campaign=${campaign}`}
          className="rounded-full bg-gradient-to-r from-electric to-cyan px-5 py-2 text-sm font-semibold text-black"
        >
          {t("ctaButton", { service: service.name })}
        </Link>
        <Link href={`/services/${service.slug}`} className="text-sm font-medium text-cyan underline underline-offset-2 hover:text-foreground">
          {t("ctaLink", { service: service.name })}
        </Link>
      </div>
    </aside>
  );
}
