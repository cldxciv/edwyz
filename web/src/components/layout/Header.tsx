"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/img/logo-edwyz-light.png"
            alt={siteConfig.name}
            width={160}
            height={51}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="primary">
            Schedule Consultation
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/contact" variant="primary" className="mt-2 w-fit">
              Schedule Consultation
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
