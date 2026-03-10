"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/suchen", label: "Suchen" },
  { href: "/inserate", label: "Inserate" },
  { href: "/haendler", label: "Händler" },
  { href: "/gespeichert", label: "Gespeichert" },
  { href: "/", label: "Startseite" },
];

export function SubpageHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/hitmit-logo.png" alt="HITMIT" width={40} height={40} className="rounded-lg" />
          <span className="font-display text-2xl tracking-wider text-gray-900 dark:text-gray-100">HITMIT</span>
        </Link>
        <div className="flex items-center gap-4">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#f14011]"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#f14011]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
