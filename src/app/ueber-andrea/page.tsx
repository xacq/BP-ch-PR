import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import DiplomaIcon from "@/components/icons/DiplomaIcon";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getContent(), "ueber-andrea", "/ueber-andrea");
}

export default async function AboutPage() {
  const c = await getContent();
  const a = c.aboutPage;

  return (
    <>
      <Nav ctaPhone={c.hero.ctaPhone} ctaLabel={c.hero.ctaPrimaryLabel} logoUrl={c.contact.logoUrl} businessName={c.contact.businessName} showBusinessName={c.contact.showBusinessName} />

      {/* HERO */}
      <section className="bg-brand-cream-soft px-6 md:px-16 pt-40 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <Reveal on="load" className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand">
            {a.imageUrl && (
              <Image src={a.imageUrl} alt={`${a.name} ${a.nameEm}`.trim()} fill unoptimized priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            )}
          </Reveal>
          <div>
            <Reveal on="load">
              <span className="block text-xs uppercase tracking-widest text-brand-text-light mb-4">
                {a.eyebrow}
              </span>
            </Reveal>
            <Reveal on="load" delay={0.1}>
              <h1 className="font-heading text-5xl md:text-6xl leading-[1.1] text-brand-text mb-2">
                {a.name} <em className="font-accent-italic text-brand-accent">{a.nameEm}</em>
              </h1>
            </Reveal>
            <Reveal on="load" delay={0.18}>
              <p className="text-sm uppercase tracking-widest text-brand-text-light mb-8">{a.role}</p>
            </Reveal>
            <Reveal on="load" delay={0.26}>
              <p className="text-brand-text-mid leading-relaxed mb-6">{a.bio1}</p>
            </Reveal>
            <Reveal on="load" delay={0.34}>
              <p className="text-brand-text-mid leading-relaxed mb-8">{a.bio2}</p>
            </Reveal>
            <Reveal on="load" delay={0.42}>
              <blockquote className="border-l-2 border-brand-sand pl-6 mb-8">
                <p className="font-accent-italic text-lg text-brand-text leading-relaxed">
                  „{a.quote}“
                </p>
              </blockquote>
            </Reveal>
            <Reveal on="load" delay={0.5} className="flex flex-wrap gap-4">
              <a
                href={`tel:${c.contact.phone}`}
                className="rounded-full bg-brand-dark text-brand-white px-7 py-3 text-sm hover:bg-brand-brown transition-colors"
              >
                Termin buchen
              </a>
              <Link
                href="/leistungen"
                className="rounded-full border border-brand-cream-deep text-brand-text px-7 py-3 text-sm hover:border-brand-sand transition-colors"
              >
                Leistungen & Preise
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DIPLOMAS */}
      <section className="bg-brand-white px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto">
          <SectionTitle heading={c.headings.about_diplomas} className="mb-14" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.diplomas.map((d, i) => (
              <Reveal
                key={d.title}
                delay={Math.min(i, 3) * 0.08}
                className="border border-brand-cream-deep rounded-2xl p-8 flex flex-col gap-4 hover:border-brand-sand transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-brand-cream-dark flex items-center justify-center text-brand-accent">
                  <DiplomaIcon name={d.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg text-brand-text">{d.title}</h3>
                <p className="text-xs text-brand-text-light">{d.school}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto">
          <SectionTitle heading={c.headings.about_values} className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.values.map((v, i) => (
              <Reveal key={v.num} delay={i * 0.09} className="bg-brand-white rounded-2xl p-8">
                <span className="block font-accent-italic text-3xl text-brand-cream-deep mb-4">
                  {v.num}
                </span>
                <h3 className="font-heading text-lg text-brand-text mb-3">{v.title}</h3>
                <p className="text-sm text-brand-text-mid leading-relaxed">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — right after "Unsere Werte", breaking up two white bands */}
      <Gallery images={c.gallery} heading={c.headings.gallery} tone="cream-soft" />

      <Testimonials heading={c.headings.about_testimonials} items={c.testimonialsAbout} />

      <ContactSection contact={c.contact} heading={c.headings.about_contact} />

      <Footer contact={c.contact} brands={c.brands} />
    </>
  );
}
