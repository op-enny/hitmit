"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0a0a0a] dark:bg-white rounded-xl flex items-center justify-center group-hover:bg-[#f14011] dark:group-hover:bg-[#f14011] transition-colors duration-300">
              <span className="text-white dark:text-[#0a0a0a] group-hover:text-white font-display text-lg tracking-wider">H</span>
            </div>
            <span className="font-display text-2xl tracking-wide text-[#0a0a0a] dark:text-[#ededed]">HITMIT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-[#f14011]"
                      : "text-[#525252] dark:text-[#a3a3a3] hover:text-[#f14011]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/#submit"
              className="btn btn-primary btn-md"
            >
              Auto einreichen
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#0a0a0a] dark:text-[#ededed]"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white dark:bg-[#141414] border-t border-[#e5e5e5] dark:border-[#2a2a2a] shadow-xl animate-fade-in-down">
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block font-medium text-lg transition-colors ${
                      isActive
                        ? "text-[#f14011]"
                        : "text-[#525252] dark:text-[#a3a3a3] hover:text-[#f14011]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
                <Link
                  href="/#submit"
                  className="btn btn-primary btn-lg w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Auto einreichen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
