"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-cyan/60 focus:outline-none";

export function ApplicationForm({ roleSlug, roleTitle }: { roleSlug: string; roleTitle: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, roleSlug }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-8 text-center">
        <h3 className="font-heading text-lg font-semibold text-foreground">Application received.</h3>
        <p className="mt-2 text-sm text-muted">
          Thanks for applying to {roleTitle === "General Application" ? "Edwyz" : roleTitle}. Our team will review and follow up soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className={fieldClass} />
        <input name="email" type="email" required placeholder="Email address" className={fieldClass} />
      </div>
      <input name="phone" placeholder="Phone number" className={fieldClass} />
      <textarea
        name="message"
        rows={5}
        placeholder="Tell us a bit about yourself and why you're a good fit (link to resume/portfolio welcome)"
        className={fieldClass}
      />
      <p className="text-xs text-muted">
        Resume upload isn&apos;t wired up yet — for now, paste a link to your resume or LinkedIn above.
      </p>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
