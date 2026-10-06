"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

const links = [
  { href: "/", label: "Home" },
  { href: "/leistungen", label: "Leistungen & Preise" },
  { href: "/ueber-andrea", label: "Über Andrea" },
];

export default function Nav({
  ctaPhone,
  ctaLabel = "Termin buchen",
  logoUrl = "",
  businessName = "Beauty Palast",
  showBusinessName = true,
}: {
  ctaPhone: string;
  ctaLabel?: string;
  logoUrl?: string;
  businessName?: string;
  showBusinessName?: boolean;
}) {
  const pathname = usePathname();
  // Show the name when the toggle is on, or as a fallback when there is no logo.
  const showName = showBusinessName || !logoUrl;

  return (
    // Floating rounded "pill" bar, same light style on every page (see the hero
    // redesign). It floats with a margin from the top/sides over the content.
    <div className="fixed top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 z-50">
      <nav className="flex items-center justify-between gap-6 rounded-2xl bg-white border border-brand-cream-deep/50 shadow-sm shadow-brand-dark/5 pl-6 pr-3 md:pl-8 md:pr-3 py-2.5">
        <Link href="/" className="flex items-center gap-3" aria-label={businessName}>
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-9 w-auto" />
          )}
          {showName && (
            <span className="font-accent-italic text-xl text-brand-text">{businessName}</span>
          )}
        </Link>
        <div className="flex items-center gap-6 md:gap-10">
          <ul className="hidden md:flex gap-10 list-none">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm tracking-wide transition-colors ${
                      active ? "text-brand-text" : "text-brand-text-mid hover:text-brand-text"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a
            href={`tel:${ctaPhone}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-dark text-brand-white pl-2 pr-5 py-2 text-sm tracking-wide hover:bg-brand-brown transition-colors"
          >
            <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-white/15">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            {ctaLabel}
          </a>
        </div>
      </nav>
    </div>
  );
}
