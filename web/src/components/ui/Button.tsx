import { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({ children, href, variant = "primary", className, type = "button", onClick }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap";
  const variants = {
    primary:
      "bg-gradient-to-r from-electric to-cyan text-black hover:shadow-[0_0_30px_rgba(34,226,245,0.4)] hover:-translate-y-0.5",
    secondary:
      "border border-border text-foreground hover:border-cyan/60 hover:text-cyan",
    ghost: "text-muted hover:text-foreground",
  };
  const classes = clsx(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
