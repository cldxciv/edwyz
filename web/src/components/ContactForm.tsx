"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/company";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-cyan/60 focus:outline-none";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? t("genericError"));
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError(t("genericError"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-8 text-center">
        <h3 className="font-heading text-lg font-semibold text-foreground">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-muted">{t("successBody")}</p>
        <a
          href={COMPANY.booking}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-cyan underline underline-offset-2 hover:text-foreground"
        >
          {t("bookCall")}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className="text-xs font-medium text-muted">{t("fullName")}</label>
          <input id="cf-name" name="name" required autoComplete="name" placeholder={t("fullName")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className="text-xs font-medium text-muted">{t("email")}</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder={t("email")} className={fieldClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-requirements" className="text-xs font-medium text-muted">{t("requirements")}</label>
        <textarea
          id="cf-requirements"
          name="requirements"
          required
          rows={5}
          placeholder={t("requirements")}
          className={fieldClass}
        />
      </div>

      <details className="group rounded-lg border border-border bg-surface-2/40 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-muted">{t("moreDetail")}</summary>
        <div className="mt-4 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-company" className="text-xs font-medium text-muted">{t("company")}</label>
          <input id="cf-company" name="company" autoComplete="organization" placeholder={t("company")} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-phone" className="text-xs font-medium text-muted">{t("phone")}</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder={t("phone")} className={fieldClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-budget" className="text-xs font-medium text-muted">{t("budgetRange")}</label>
          <select id="cf-budget" name="budget" defaultValue="" className={fieldClass}>
            <option value="" disabled>{t("budgetRange")}</option>
            <option value="<25k">{t("budgetUnder25k")}</option>
            <option value="25k-100k">{t("budget25to100k")}</option>
            <option value="100k-500k">{t("budget100to500k")}</option>
            <option value="500k+">{t("budgetOver500k")}</option>
            <option value="unsure">{t("notSure")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-timeline" className="text-xs font-medium text-muted">{t("timeline")}</label>
          <select id="cf-timeline" name="timeline" defaultValue="" className={fieldClass}>
            <option value="" disabled>{t("timeline")}</option>
            <option value="immediate">{t("timelineImmediate")}</option>
            <option value="1-3-months">{t("timeline1to3")}</option>
            <option value="3-6-months">{t("timeline3to6")}</option>
            <option value="exploring">{t("timelineExploring")}</option>
            <option value="unsure">{t("notSure")}</option>
          </select>
        </div>
      </div>
        </div>
      </details>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        {status === "submitting" ? t("sending") : t("sendMessage")}
      </Button>

      <p className="text-xs leading-relaxed text-muted">
        {t("privacyNote")}{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          {t("privacyLink")}
        </Link>
        .{" "}
        <a href={COMPANY.booking} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan underline underline-offset-2 hover:text-foreground">
          {t("bookCall")}
        </a>
      </p>
    </form>
  );
}
