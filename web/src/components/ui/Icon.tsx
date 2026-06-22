import { createElement } from "react";
import { getIcon } from "@/lib/icons";

export function Icon({ id, size = 20, className }: { id: string; size?: number; className?: string }) {
  return createElement(getIcon(id), { size, className });
}
