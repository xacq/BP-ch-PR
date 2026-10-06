import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/content";
import { siteUrlToBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings();
  const base = siteUrlToBase(seo.siteUrl);
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: base ? new URL("/sitemap.xml", base).toString() : undefined,
    host: base?.host,
  };
}
