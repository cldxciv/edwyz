"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" required placeholder={t("fullName")} className={fieldClass} />
        <input name="email" type="email" required placeholder={t("email")} className={fieldClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="company" placeholder={t("company")} className={fieldClass} />
        <input name="phone" placeholder={t("phone")} className={fieldClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <select name="budget" defaultValue="" className={fieldClass}>
          <option value="" disabled>{t("budgetRange")}</option>
          <option value="<25k">{t("budgetUnder25k")}</option>
          <option value="25k-100k">{t("budget25to100k")}</option>
          <option value="100k-500k">{t("budget100to500k")}</option>
          <option value="500k+">{t("budgetOver500k")}</option>
        </select>
        <select name="timeline" defaultValue="" className={fieldClass}>
          <option value="" disabled>{t("timeline")}</option>
          <option value="immediate">{t("timelineImmediate")}</option>
          <option value="1-3-months">{t("timeline1to3")}</option>
          <option value="3-6-months">{t("timeline3to6")}</option>
          <option value="exploring">{t("timelineExploring")}</option>
        </select>
      </div>
      <textarea
        name="requirements"
        required
        rows={5}
        placeholder={t("requirements")}
        className={fieldClass}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        {status === "submitting" ? t("sending") : t("sendMessage")}
      </Button>
    </form>
  );
}
