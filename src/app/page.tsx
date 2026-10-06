import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getContent(), "home", "/");
}

export default async function HomePage() {
  const c = await getContent();

  return (
    <>
      <Nav ctaPhone={c.hero.ctaPhone} ctaLabel={c.hero.ctaPrimaryLabel} logoUrl={c.contact.logoUrl} businessName={c.contact.businessName} showBusinessName={c.contact.showBusinessName} />

      {/* HERO — full-bleed background photo (editable via /admin) with the
          content overlaid on top. Text sits in the lower-left over a dark
          gradient that keeps it legible against any photo. */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-end overflow-hidden">
        {c.hero.imageUrl ? (
          <Image
            src={c.hero.imageUrl}
            alt={`${c.contact.businessName} – Kosmetiksalon Visp`}
            fill
            unoptimized
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cream-dark to-brand-sand" />
        )}
        {/* Legibility overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/45 to-brand-dark/25" />

        <div className="relative w-full px-6 md:px-16 pt-40 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <Reveal on="load">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-white/80 border border-brand-white/30 rounded-full px-4 py-1.5 mb-8">
                <span className="text-brand-sand text-[0.5rem]">●</span>
                {c.hero.tag}
              </span>
            </Reveal>
            <Reveal on="load" delay={0.12}>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-brand-white mb-6">
                {c.hero.titleLine}
                <br />
                <em className="font-accent-italic text-brand-white/95">{c.hero.titleEm}</em>
              </h1>
            </Reveal>
            <Reveal on="load" delay={0.24}>
              <p className="text-brand-white/80 max-w-md mb-10 leading-relaxed">{c.hero.subtitle}</p>
            </Reveal>
            <Reveal on="load" delay={0.36} className="flex flex-wrap gap-4 items-center">
              <a
                href={`tel:${c.hero.ctaPhone}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-white text-brand-dark pl-2 pr-6 py-2.5 text-sm tracking-wide hover:bg-brand-cream transition-colors"
              >
                <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-dark/10">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
                {c.hero.ctaPrimaryLabel}
              </a>
              <Link
                href="/leistungen"
                className="inline-flex items-center gap-2 rounded-full border border-brand-white/40 text-brand-white px-6 py-2.5 text-sm tracking-wide hover:bg-brand-white/10 transition-colors"
              >
                {c.hero.ctaSecondaryLabel}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Reveal>
            <Reveal
              on="load"
              delay={0.48}
              className="flex flex-wrap gap-6 mt-12 text-xs uppercase tracking-widest text-brand-white/60"
            >
              {c.hero.badges.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <span className="text-brand-sand">★</span>
                  {badge}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* HERO STATS — clean white row directly below the hero */}
      <div className="bg-brand-white px-6 md:px-16 py-12 flex flex-wrap justify-center md:justify-around gap-10 md:gap-8">
        {c.hero.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.12} className="text-center">
            <span className="block font-heading text-4xl md:text-5xl text-brand-text mb-1">
              <CountUp value={stat.num} />
            </span>
            <span className="text-xs uppercase tracking-widest text-brand-text-light">{stat.label}</span>
          </Reveal>
        ))}
      </div>

      {/* ABOUT / HIGHLIGHT — kept on the warm cream (#fdfaf5) by request */}
      <section className="bg-[#fdfaf5] px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand">
            {c.about.imageUrl && (
              <Image src={c.about.imageUrl} alt={`${c.about.titlePrefix} ${c.about.titleEm1}`.trim()} fill unoptimized className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            )}
          </div>
          <div>
            <span className="inline-block text-xs uppercase tracking-widest text-brand-accent border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
              {c.about.tag}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight text-brand-text mb-6">
              {c.about.titlePrefix}{" "}
              <em className="font-accent-italic text-brand-accent">{c.about.titleEm1}</em> {c.about.titleMid}{" "}
              <em className="font-accent-italic text-brand-accent">{c.about.titleEm2}</em>
            </h2>
            <p className="text-sm text-brand-text-mid leading-relaxed mb-8">{c.about.text}</p>
            <ul className="flex flex-col gap-3 mb-8 list-none">
              {c.about.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-brand-text-mid">
                  <span className="text-brand-sand shrink-0">—</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/ueber-andrea"
                className="rounded-full bg-brand-dark text-brand-white px-7 py-3 text-sm hover:bg-brand-brown transition-colors"
              >
                Mehr über Andrea
              </Link>
              <a
                href={`tel:${c.contact.phone}`}
                className="rounded-full border border-brand-cream-deep text-brand-text px-7 py-3 text-sm hover:border-brand-sand transition-colors"
              >
                Jetzt anrufen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-white px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.7fr] gap-12 md:gap-16 items-start">
          {/* Intro column */}
          <div className="md:sticky md:top-28">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-mid border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-sand text-[0.5rem]">●</span>
              {c.headings.home_services?.eyebrow}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight text-brand-text mb-5">
              {c.headings.home_services?.titleLead}{" "}
              <em className="font-accent-italic text-brand-accent">{c.headings.home_services?.titleEm}</em>
            </h2>
            <p className="text-sm text-brand-text-mid leading-relaxed mb-8 max-w-sm">
              Erleben Sie den Unterschied mit fachkundiger Pflege, die Ihr Wohlbefinden
              wiederherstellt und revitalisiert.
            </p>
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-2 rounded-full bg-brand-cream text-brand-text pl-5 pr-2 py-2 text-sm tracking-wide hover:bg-brand-cream-dark transition-colors"
            >
              Alle Leistungen &amp; Preise
              <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-white">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Cards column — horizontal cards stacked vertically */}
          <div className="flex flex-col gap-6">
            {c.services.map((service, i) => (
              // The delay is capped so later cards — which scroll into view on
              // their own anyway — don't sit invisible for half a second.
              <Reveal key={service.title} delay={Math.min(i, 3) * 0.09}>
              <div
                className="flex gap-5 md:gap-6 bg-white border border-brand-cream-deep/50 rounded-3xl p-4 md:p-5 hover:border-brand-sand transition-colors"
              >
                <div className="relative w-32 sm:w-44 md:w-52 shrink-0 min-h-[150px] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand-dark">
                  {service.imageUrl && (
                    <Image src={service.imageUrl} alt={service.title} fill unoptimized className="object-cover" sizes="(max-width: 768px) 40vw, 220px" />
                  )}
                </div>
                <div className="flex-1 flex flex-col py-2 pr-2">
                  {service.popular && (
                    <span className="self-start bg-brand-cream text-brand-text-mid text-[0.65rem] uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                      Beliebteste
                    </span>
                  )}
                  <h3 className="font-heading text-xl md:text-2xl text-brand-text mb-3">{service.title}</h3>
                  <p className="text-sm text-brand-text-light leading-relaxed mb-6">{service.description}</p>
                  <Link
                    href="/leistungen"
                    className="mt-auto inline-flex items-center gap-1.5 self-start text-sm text-brand-text border-b border-brand-cream-deep pb-1 hover:border-brand-sand transition-colors"
                  >
                    Alle Leistungen &amp; Preise <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — flat layout on warm cream: pill + title, a full-width
          divider, then three step columns each with a thin bottom rule. */}
      <section className="bg-brand-cream-soft px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-mid border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-sand text-[0.5rem]">●</span>
            {c.headings.home_process?.eyebrow}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl leading-tight text-brand-text">
            {c.headings.home_process?.titleLead}{" "}
            <em className="font-accent-italic text-brand-accent">{c.headings.home_process?.titleEm}</em>
          </h2>

          <div className="border-t border-brand-cream-deep/60 mt-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 mt-12">
            {c.process.map((step) => (
              <div key={step.title} className="border-b border-brand-cream-deep/60 pb-10">
                <span className="block text-sm text-brand-text-light mb-4">{step.stepLabel}</span>
                <h3 className="font-heading text-xl md:text-2xl text-brand-text mb-3">
                  {step.title} <em className="font-accent-italic text-brand-accent">{step.titleEm}</em>
                </h3>
                <p className="text-sm text-brand-text-mid leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials heading={c.headings.home_testimonials} items={c.testimonialsHome} />

      {/* FAQ */}
      <section className="bg-white px-6 md:px-16 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-mid border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-sand text-[0.5rem]">●</span>
              {c.headings.home_faq?.eyebrow}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl leading-tight text-brand-text mb-5">
              {c.headings.home_faq?.titleLead}{" "}
              <em className="font-accent-italic text-brand-accent">{c.headings.home_faq?.titleEm}</em>
            </h2>
            <p className="text-sm text-brand-text-mid leading-relaxed mb-6">
              Alles, was Sie vor Ihrem Termin wissen müssen.
            </p>
            <a
              href={`tel:${c.contact.phone}`}
              className="inline-flex items-center gap-1.5 text-sm text-brand-text border-b border-brand-cream-deep pb-1 hover:border-brand-sand transition-colors"
            >
              Kontakt aufnehmen <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <Faq items={c.faq} />
        </div>
      </section>

      {/* GALLERY — cream-soft separates the white FAQ above from the dark contact below */}
      <Gallery images={c.gallery} heading={c.headings.gallery} tone="cream-soft" />

      <ContactSection contact={c.contact} heading={c.headings.home_contact} />

      <Footer contact={c.contact} brands={c.brands} />
    </>
  );
}
