import type { Metadata } from "next";
import type { SiteContent, SeoPageKey } from "./content";

/** Turns a possibly-bare site URL into a URL object, or undefined if unusable. */
export function siteUrlToBase(siteUrl: string): URL | undefined {
  if (!siteUrl) return undefined;
  const normalized = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
  try {
    return new URL(normalized);
  } catch {
    return undefined;
  }
}

/** Root-level metadata (defaults, template, verification, tracking base). */
export function rootMetadata(content: SiteContent): Metadata {
  const { seo, contact } = content;
  const base = siteUrlToBase(seo.siteUrl);
  return {
    metadataBase: base,
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription,
    applicationName: contact.businessName || "Beauty Palast",
    openGraph: {
      siteName: contact.businessName || "Beauty Palast",
      locale: "de_CH",
      type: "website",
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    icons: contact.logoUrl
      ? {
          icon: [{ url: contact.logoUrl, type: "image/png" }],
          apple: [{ url: contact.logoUrl, type: "image/png" }],
          shortcut: contact.logoUrl,
        }
      : undefined,
    verification: seo.googleSiteVerification
      ? { google: seo.googleSiteVerification }
      : undefined,
  };
}

/** Per-page metadata (title/description override, canonical, OG/Twitter). */
export function pageMetadata(content: SiteContent, page: SeoPageKey, path: string): Metadata {
  const { seo, contact } = content;
  const ps = content.pageSeo[page];
  const images = seo.ogImageUrl ? [seo.ogImageUrl] : undefined;
  // Apply the title template ourselves rather than relying on Next's
  // parent-template inheritance — that doesn't reach the root "/" page (same
  // segment as the layout), which would leave the home tab without the brand.
  const fullTitle = seo.titleTemplate.includes("%s")
    ? seo.titleTemplate.replace("%s", ps.title)
    : ps.title || seo.defaultTitle;
  return {
    title: { absolute: fullTitle },
    description: ps.description,
    alternates: { canonical: path },
    openGraph: {
      title: ps.title,
      description: ps.description,
      url: path,
      siteName: contact.businessName || "Beauty Palast",
      images,
      locale: "de_CH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ps.title,
      description: ps.description,
      images,
    },
  };
}

/** BeautySalon LocalBusiness structured data (JSON-LD) for local SEO. */
export function localBusinessJsonLd(content: SiteContent): string {
  const { contact, seo } = content;
  const base = siteUrlToBase(seo.siteUrl);
  const absoluteOg =
    seo.ogImageUrl && base ? new URL(seo.ogImageUrl, base).toString() : undefined;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: contact.businessName || "Beauty Palast",
    description: seo.defaultDescription || undefined,
    url: base?.toString() || undefined,
    telephone: contact.phone || undefined,
    image: absoluteOg,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine1 || undefined,
      addressLocality: contact.addressLine2 || undefined,
      addressCountry: "CH",
    },
    areaServed: "Visp, Wallis",
  };

  // Drop empty keys for a clean payload.
  return JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v));
}
