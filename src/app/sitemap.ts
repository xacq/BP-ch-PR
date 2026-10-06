import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/content";
import { siteUrlToBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoSettings();
  const origin = siteUrlToBase(seo.siteUrl)?.origin ?? "";
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/leistungen", priority: 0.8 },
    { path: "/ueber-andrea", priority: 0.8 },
    { path: "/impressum", priority: 0.3 },
    { path: "/datenschutz", priority: 0.3 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${origin}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }));
}
