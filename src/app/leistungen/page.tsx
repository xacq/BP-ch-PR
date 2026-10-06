import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicesCatalog from "@/components/ServicesCatalog";
import Gallery from "@/components/Gallery";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getContent(), "leistungen", "/leistungen");
}

export default async function ServicesPage() {
  const c = await getContent();
  const intro = c.servicesIntro;

  return (
    <>
      <Nav ctaPhone={c.hero.ctaPhone} ctaLabel={c.hero.ctaPrimaryLabel} logoUrl={c.contact.logoUrl} businessName={c.contact.businessName} showBusinessName={c.contact.showBusinessName} />

      {/* HERO — text on the left, editable image on the right */}
      <section className="bg-white px-6 md:px-16 pt-40 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-mid border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-sand text-[0.5rem]">●</span>
              {intro.eyebrow}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-brand-text mb-6">
              {intro.titleLead}
              <br />
              <em className="font-accent-italic text-brand-accent">{intro.titleEm}</em>
            </h1>
            <p className="text-brand-text-mid max-w-md mb-8 leading-relaxed">{intro.description}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={`tel:${c.hero.ctaPhone}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-dark text-brand-white pl-6 pr-2 py-2.5 text-sm tracking-wide hover:bg-brand-brown transition-colors"
              >
                Termin vereinbaren
                <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-white/15">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
              <a
                href="#preise"
                className="inline-flex items-center gap-2 rounded-full border border-brand-cream-deep text-brand-text px-6 py-2.5 text-sm tracking-wide hover:border-brand-sand transition-colors"
              >
                Preise ansehen
              </a>
            </div>
          </div>
          <div className="relative h-[320px] md:h-[420px] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand">
            {intro.imageUrl && (
              <Image
                src={intro.imageUrl}
                alt={`${intro.titleLead} ${intro.titleEm}`.trim()}
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </section>

      <ServicesCatalog groups={c.priceGroups} />

      {/* GALLERY — same shared photo set as the home page. White, because the
          footer below is now cream-soft. */}
      <Gallery images={c.gallery} heading={c.headings.gallery} tone="white" />

      <Footer contact={c.contact} brands={c.brands} />
    </>
  );
}
