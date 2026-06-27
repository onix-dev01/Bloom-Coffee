"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  {
    href: "/admin/orders",
    label: "Orders",
    isActive: (pathname: string) => pathname.startsWith("/admin/orders"),
  },
  {
    href: "/admin/drinks",
    label: "Drinks",
    isActive: (pathname: string) => pathname.startsWith("/admin/drinks"),
  },
  {
    href: "/admin/add-ons",
    label: "Add-ons",
    isActive: (pathname: string) => pathname.startsWith("/admin/add-ons"),
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.isActive(pathname);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-700 text-white"
                : "bg-surface text-brand-800 hover:bg-brand-50",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
