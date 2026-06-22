"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-cyan/60 focus:outline-none";

export function ContactForm() {
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
        <h3 className="font-heading text-lg font-semibold text-foreground">Thanks — message received.</h3>
        <p className="mt-2 text-sm text-muted">Our team will get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className={fieldClass} />
        <input name="email" type="email" required placeholder="Email address" className={fieldClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="company" placeholder="Company" className={fieldClass} />
        <input name="phone" placeholder="Phone number" className={fieldClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <select name="budget" defaultValue="" className={fieldClass}>
          <option value="" disabled>Budget range</option>
          <option value="<25k">Under $25k</option>
          <option value="25k-100k">$25k – $100k</option>
          <option value="100k-500k">$100k – $500k</option>
          <option value="500k+">$500k+</option>
        </select>
        <select name="timeline" defaultValue="" className={fieldClass}>
          <option value="" disabled>Timeline</option>
          <option value="immediate">Immediate</option>
          <option value="1-3-months">1–3 months</option>
          <option value="3-6-months">3–6 months</option>
          <option value="exploring">Just exploring</option>
        </select>
      </div>
      <textarea
        name="requirements"
        required
        rows={5}
        placeholder="Tell us about your project requirements"
        className={fieldClass}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" variant="primary" className="w-full sm:w-auto">
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
