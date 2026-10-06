import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

// Social icons. The URLs are CMS fields (Kontakt & Zeiten); an empty URL means
// the icon is not rendered, so the footer never shows a link that goes nowhere.
const socialIcons = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.35-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.15v2.35H7.8V13h2.7v8z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16.5 3c.3 2.1 1.6 3.5 3.5 3.7V9c-1.3 0-2.5-.4-3.5-1.1v5.9c0 3.1-2.5 5.4-5.4 5-2.3-.3-4-2.2-4-4.5 0-2.6 2.1-4.7 4.7-4.6v2.5c-.4-.1-.8-.1-1.2 0-1 .3-1.6 1.3-1.4 2.3.2 1 1.2 1.7 2.2 1.5.9-.1 1.6-1 1.6-2V3z" />
    </svg>
  ),
} as const;

export default function Footer({ contact, brands }: Pick<SiteContent, "contact" | "brands">) {
  const socials = (
    [
      { label: "Instagram", href: contact.instagramUrl },
      { label: "Facebook", href: contact.facebookUrl },
      { label: "TikTok", href: contact.tiktokUrl },
    ] as const
  ).filter((s) => s.href);

  return (
    <footer className="bg-brand-cream-soft text-brand-text px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Top: name + description on the left, social icons on the right */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={contact.businessName}>
              {contact.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={contact.logoUrl} alt="" className="h-10 w-auto" />
              )}
              {(contact.showBusinessName || !contact.logoUrl) && (
                <span className="font-heading text-2xl text-brand-text">{contact.businessName}</span>
              )}
            </Link>
            <p className="text-sm text-brand-text-mid leading-relaxed mt-4">
              Schönheit, Wohlbefinden und Selbstbewusstsein fördern – das ist unsere Leidenschaft.
              Besuchen Sie uns in Visp, Wallis.
            </p>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid place-items-center h-10 w-10 rounded-full border border-brand-cream-deep text-brand-text-mid hover:text-brand-text hover:border-brand-sand transition-colors"
                >
                  {socialIcons[s.label]}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-brand-cream-deep/60 my-12" />

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <div>
            <span className="block font-heading text-lg text-brand-text mb-5">Seiten</span>
            <ul className="flex flex-col gap-2.5 list-none text-sm">
              <li><Link href="/" className="text-brand-text-mid hover:text-brand-text transition-colors">Home</Link></li>
              <li><Link href="/leistungen" className="text-brand-text-mid hover:text-brand-text transition-colors">Leistungen & Preise</Link></li>
              <li><Link href="/ueber-andrea" className="text-brand-text-mid hover:text-brand-text transition-colors">Über Andrea</Link></li>
            </ul>
          </div>

          <div>
            <span className="block font-heading text-lg text-brand-text mb-5">Kontakt</span>
            <p className="text-sm text-brand-text-mid leading-relaxed">
              {contact.addressLine1}
              <br />
              {contact.addressLine2}
            </p>
            <a href={`tel:${contact.phone}`} className="block text-sm text-brand-text-mid hover:text-brand-text transition-colors mt-4">
              {contact.phoneDisplay}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-dark text-brand-white pl-6 pr-2 py-2.5 text-sm mt-6 hover:bg-brand-brown transition-colors"
            >
              Kontakt aufnehmen
              <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-white/15">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          <div>
            <span className="block font-heading text-lg text-brand-text mb-5">Marken</span>
            <p className="text-sm text-brand-text-mid leading-relaxed">{brands.join(" ")}</p>
            <span className="block font-heading text-lg text-brand-text mt-8 mb-4">Öffnungszeiten</span>
            <ul className="flex flex-col gap-1 list-none text-sm text-brand-text-mid">
              {contact.hours.map((h, i) => (
                <li key={i}>
                  {h.days} {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-brand-cream-deep/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-brand-text-light">
          <span>© {new Date().getFullYear()} {contact.businessName} · Visp, Wallis</span>
          <div className="flex items-center gap-5">
            <Link href="/impressum" className="hover:text-brand-text transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-brand-text transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
