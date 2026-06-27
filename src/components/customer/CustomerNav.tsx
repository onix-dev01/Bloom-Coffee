"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type CustomerNavProps = {
  isLoggedIn: boolean;
};

const links = (isLoggedIn: boolean) => [
  {
    href: "/",
    label: "Order",
    isActive: (pathname: string) =>
      pathname === "/" ||
      pathname === "/order" ||
      pathname.startsWith("/order/"),
  },
  {
    href: "/menu",
    label: "Menu",
    isActive: (pathname: string) => pathname.startsWith("/menu"),
  },
  ...(isLoggedIn
    ? [
        {
          href: "/orders",
          label: "My orders",
          isActive: (pathname: string) => pathname.startsWith("/orders"),
        },
      ]
    : []),
];

export function CustomerNav({ isLoggedIn }: CustomerNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-xl bg-brand-50 p-1">
      {links(isLoggedIn).map((link) => {
        const active = link.isActive(pathname);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-surface text-brand-900 shadow-sm"
                : "text-brand-700 hover:text-brand-900",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
