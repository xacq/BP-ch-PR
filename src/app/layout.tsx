import type { Metadata } from "next";
import { figtree, sourceSerif4 } from "./fonts";
import { getContent } from "@/lib/content";
import { rootMetadata, localBusinessJsonLd } from "@/lib/seo";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

// Content is DB-driven (and edited via the CMS), so nothing is statically
// prerendered — this also keeps the build from hitting the DB (e.g. for the
// auto-generated /_not-found page) when no database is available.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return rootMetadata(content);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html
      lang="de"
      className={`${figtree.variable} ${sourceSerif4.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: localBusinessJsonLd(content) }}
        />
        {/* Motion renders its `initial` state (opacity: 0) into the server HTML,
            so without JavaScript the revealed sections would never appear. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <TrackingScripts seo={content.seo} />
        {children}
      </body>
    </html>
  );
}
