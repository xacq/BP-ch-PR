import { cache } from "react";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SectionHeading = { eyebrow: string; titleLead: string; titleEm: string };

export type Stat = { num: string; label: string };
export type Service = { title: string; description: string; popular: boolean; imageUrl: string };
export type ProcessStep = { stepLabel: string; title: string; titleEm: string; text: string };
export type Testimonial = { text: string; name: string; service: string };
export type FaqItem = { question: string; answer: string };
export type Diploma = { icon: string; title: string; school: string };
export type Value = { num: string; title: string; text: string };
export type ContactHour = { days: string; time: string };
export type GalleryImage = { imageUrl: string; alt: string; caption: string };
export type ContactVideo = { title: string; videoUrl: string; posterUrl: string };

/** A label/value pair inside a legal section (e.g. "Telefon" → "+41 …"). */
export type LegalRow = { label: string; value: string };

/**
 * A numbered block of a legal page. `body` uses the light rich-text format
 * documented in `@/components/RichText` (paragraphs, "- " lists, "> " notes,
 * **bold**, *italic* and [label](href) links).
 */
export type LegalSection = {
  num: string;
  title: string;
  titleNote: string;
  body: string;
  /** "default" · "card" (rows in a bordered card) · "note" (highlight box). */
  variant: string;
  /** "table" (label/value grid) or "cards". */
  rowStyle: string;
  cardBadge: string;
  cardTitle: string;
  cardSubtitle: string;
  rows: LegalRow[];
};

export type LegalPage = {
  eyebrow: string;
  title: string;
  titleEm: string;
  intro: string;
  stand: string;
  showToc: boolean;
  tocTitle: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  sections: LegalSection[];
};

/** Route slugs of the legal pages, in the order they appear in the footer. */
export const LEGAL_PAGES = ["impressum", "datenschutz"] as const;
export type LegalPageKey = (typeof LEGAL_PAGES)[number];

/** Empty page, used when the row does not exist yet (fresh, unseeded DB). */
const EMPTY_LEGAL_PAGE: LegalPage = {
  eyebrow: "",
  title: "",
  titleEm: "",
  intro: "",
  stand: "",
  showToc: true,
  tocTitle: "Inhalt",
  ctaTitle: "",
  ctaText: "",
  ctaLabel: "",
  sections: [],
};

export type SeoSettings = {
  siteUrl: string;
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImageUrl: string;
  gaMeasurementId: string;
  gtmContainerId: string;
  metaPixelId: string;
  googleSiteVerification: string;
};

export type PageSeo = { title: string; description: string };

/** Route paths that have editable per-page SEO overrides. */
export const SEO_PAGES = ["home", "leistungen", "ueber-andrea", "impressum", "datenschutz"] as const;
export type SeoPageKey = (typeof SEO_PAGES)[number];

// Sensible defaults so the site has good SEO out of the box, before the user
// touches anything (and for the already-seeded DB where no row exists yet).
const DEFAULT_SEO: SeoSettings = {
  siteUrl: process.env.SITE_URL ?? "",
  titleTemplate: "%s · Beauty Palast",
  defaultTitle: "Beauty Palast · Andrea Teles | Kosmetiksalon Visp",
  defaultDescription:
    "Beauty Palast in Visp, Wallis – Kosmetiksalon von Andrea Teles. Gesichtsbehandlungen, Haarentfernung, Massage, Nail Art und Permanent Make-up.",
  ogImageUrl: "",
  gaMeasurementId: "",
  gtmContainerId: "",
  metaPixelId: "",
  googleSiteVerification: "",
};

const DEFAULT_PAGE_SEO: Record<SeoPageKey, PageSeo> = {
  home: {
    title: "Kosmetiksalon in Visp",
    description:
      "Verfeinerte Schönheit und Expertenpräzision im Beauty Palast Visp. Gesichtsbehandlungen, Haarentfernung, Massage, Nail Art und mehr.",
  },
  leistungen: {
    title: "Leistungen & Preise",
    description:
      "Alle Behandlungen und transparente Preise im Beauty Palast Visp – Kosmetik, Massage, Nail Art, Haarentfernung und mehr.",
  },
  "ueber-andrea": {
    title: "Über Andrea",
    description:
      "Andrea Teles – zertifizierte Kosmetikerin im Beauty Palast Visp. Ausbildung, Qualifikationen und Werte.",
  },
  impressum: {
    title: "Impressum",
    description:
      "Impressum von Beauty Palast – Andrea Teles, Brückenweg 3, 3930 Visp: Betreiberin, Verantwortliche, Haftung und Urheberrecht.",
  },
  datenschutz: {
    title: "Datenschutzerklärung",
    description:
      "Datenschutzerklärung von Beauty Palast – Andrea Teles in Visp: Welche Personendaten wir bearbeiten, wie lange und welche Rechte Sie haben (DSG & DSGVO).",
  },
};

export type PriceItem = { category: string; label: string; price: string };
export type PriceGroup = {
  title: string;
  titleEm: string;
  description: string;
  note: string;
  imageUrl: string;
  items: PriceItem[];
};

export type SiteContent = {
  headings: Record<string, SectionHeading>;
  hero: {
    tag: string;
    titleLine: string;
    titleEm: string;
    subtitle: string;
    ctaPhone: string;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    badges: string[];
    stats: Stat[];
    imageUrl: string;
  };
  stats: Stat[];
  brands: string[];
  about: {
    tag: string;
    titlePrefix: string;
    titleEm1: string;
    titleMid: string;
    titleEm2: string;
    text: string;
    features: string[];
    imageUrl: string;
  };
  services: Service[];
  process: ProcessStep[];
  testimonialsHome: Testimonial[];
  faq: FaqItem[];
  /** One shared photo set, rendered on all three public pages. */
  gallery: GalleryImage[];
  aboutPage: {
    eyebrow: string;
    name: string;
    nameEm: string;
    role: string;
    bio1: string;
    bio2: string;
    quote: string;
    imageUrl: string;
  };
  diplomas: Diploma[];
  values: Value[];
  testimonialsAbout: Testimonial[];
  servicesIntro: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    description: string;
    imageUrl: string;
  };
  priceGroups: PriceGroup[];
  contact: {
    businessName: string;
    phone: string;
    phoneDisplay: string;
    addressLine1: string;
    addressLine2: string;
    mapUrl: string;
    logoUrl: string;
    logoWhiteUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    showBusinessName: boolean;
    hours: ContactHour[];
    /** Clips shown in the "So finden Sie uns" block; the layout holds two. */
    videos: ContactVideo[];
  };
  /** "Impressum" and "Datenschutzerklärung" — one entry per legal route. */
  legal: Record<LegalPageKey, LegalPage>;
  seo: SeoSettings;
  pageSeo: Record<SeoPageKey, PageSeo>;
};

const SINGLETON_ID = 1;

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export const getContent = cache(async (): Promise<SiteContent> => {
  const [
    seoRow,
    pageSeoRows,
    headingRows,
    hero,
    heroBadges,
    heroStats,
    stats,
    brands,
    about,
    aboutFeatures,
    services,
    process,
    testimonials,
    faq,
    aboutPage,
    diplomas,
    values,
    servicesIntro,
    priceGroups,
    contact,
    contactHours,
    galleryImages,
    contactVideos,
    legalPages,
  ] = await Promise.all([
    prisma.seoSettings.findUnique({ where: { id: SINGLETON_ID } }),
    prisma.pageSeo.findMany(),
    prisma.sectionHeading.findMany(),
    prisma.hero.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
    prisma.heroBadge.findMany({ orderBy: { position: "asc" } }),
    prisma.heroStat.findMany({ orderBy: { position: "asc" } }),
    prisma.stat.findMany({ orderBy: { position: "asc" } }),
    prisma.brand.findMany({ orderBy: { position: "asc" } }),
    prisma.about.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
    prisma.aboutFeature.findMany({ orderBy: { position: "asc" } }),
    prisma.service.findMany({ orderBy: { position: "asc" } }),
    prisma.processStep.findMany({ orderBy: { position: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { position: "asc" } }),
    prisma.faqItem.findMany({ orderBy: { position: "asc" } }),
    prisma.aboutPage.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
    prisma.diploma.findMany({ orderBy: { position: "asc" } }),
    prisma.value.findMany({ orderBy: { position: "asc" } }),
    prisma.servicesIntro.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
    prisma.priceGroup.findMany({
      orderBy: { position: "asc" },
      include: { items: { orderBy: { position: "asc" } } },
    }),
    prisma.contact.findUniqueOrThrow({ where: { id: SINGLETON_ID } }),
    prisma.contactHour.findMany({ orderBy: { position: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: { position: "asc" } }),
    prisma.contactVideo.findMany({ orderBy: { position: "asc" } }),
    prisma.legalPage.findMany({
      include: {
        sections: {
          orderBy: { position: "asc" },
          include: { rows: { orderBy: { position: "asc" } } },
        },
      },
    }),
  ]);

  const headings: Record<string, SectionHeading> = {};
  for (const h of headingRows) {
    headings[h.key] = { eyebrow: h.eyebrow, titleLead: h.titleLead, titleEm: h.titleEm };
  }

  const seo = toSeoSettings(seoRow);

  const legal = {} as Record<LegalPageKey, LegalPage>;
  for (const key of LEGAL_PAGES) {
    const row = legalPages.find((l) => l.slug === key);
    legal[key] = row
      ? {
          eyebrow: row.eyebrow,
          title: row.title,
          titleEm: row.titleEm,
          intro: row.intro,
          stand: row.stand,
          showToc: row.showToc,
          tocTitle: row.tocTitle,
          ctaTitle: row.ctaTitle,
          ctaText: row.ctaText,
          ctaLabel: row.ctaLabel,
          sections: row.sections.map((sec) => ({
            num: sec.num,
            title: sec.title,
            titleNote: sec.titleNote,
            body: sec.body,
            variant: sec.variant,
            rowStyle: sec.rowStyle,
            cardBadge: sec.cardBadge,
            cardTitle: sec.cardTitle,
            cardSubtitle: sec.cardSubtitle,
            rows: sec.rows.map((r) => ({ label: r.label, value: r.value })),
          })),
        }
      : { ...EMPTY_LEGAL_PAGE };
  }

  const pageSeo = {} as Record<SeoPageKey, PageSeo>;
  for (const key of SEO_PAGES) {
    const row = pageSeoRows.find((p) => p.path === key);
    pageSeo[key] = {
      title: row?.title || DEFAULT_PAGE_SEO[key].title,
      description: row?.description || DEFAULT_PAGE_SEO[key].description,
    };
  }

  return {
    headings,
    hero: {
      tag: hero.tag,
      titleLine: hero.titleLine,
      titleEm: hero.titleEm,
      subtitle: hero.subtitle,
      ctaPhone: hero.ctaPhone,
      ctaPrimaryLabel: hero.ctaPrimaryLabel,
      ctaSecondaryLabel: hero.ctaSecondaryLabel,
      badges: heroBadges.map((b) => b.text),
      stats: heroStats.map((s) => ({ num: s.num, label: s.label })),
      imageUrl: hero.imageUrl,
    },
    stats: stats.map((s) => ({ num: s.num, label: s.label })),
    brands: brands.map((b) => b.name),
    about: {
      tag: about.tag,
      titlePrefix: about.titlePrefix,
      titleEm1: about.titleEm1,
      titleMid: about.titleMid,
      titleEm2: about.titleEm2,
      text: about.text,
      features: aboutFeatures.map((f) => f.text),
      imageUrl: about.imageUrl,
    },
    services: services.map((s) => ({
      title: s.title,
      description: s.description,
      popular: s.popular,
      imageUrl: s.imageUrl,
    })),
    process: process.map((p) => ({
      stepLabel: p.stepLabel,
      title: p.title,
      titleEm: p.titleEm,
      text: p.text,
    })),
    testimonialsHome: testimonials
      .filter((t) => t.page === "home")
      .map((t) => ({ text: t.text, name: t.name, service: t.service })),
    faq: faq.map((f) => ({ question: f.question, answer: f.answer })),
    gallery: galleryImages.map((g) => ({
      imageUrl: g.imageUrl,
      alt: g.alt,
      caption: g.caption,
    })),
    aboutPage: {
      eyebrow: aboutPage.eyebrow,
      name: aboutPage.name,
      nameEm: aboutPage.nameEm,
      role: aboutPage.role,
      bio1: aboutPage.bio1,
      bio2: aboutPage.bio2,
      quote: aboutPage.quote,
      imageUrl: aboutPage.imageUrl,
    },
    diplomas: diplomas.map((d) => ({ icon: d.icon, title: d.title, school: d.school })),
    values: values.map((v) => ({ num: v.num, title: v.title, text: v.text })),
    testimonialsAbout: testimonials
      .filter((t) => t.page === "about")
      .map((t) => ({ text: t.text, name: t.name, service: t.service })),
    servicesIntro: {
      eyebrow: servicesIntro.eyebrow,
      titleLead: servicesIntro.titleLead,
      titleEm: servicesIntro.titleEm,
      description: servicesIntro.description,
      imageUrl: servicesIntro.imageUrl,
    },
    priceGroups: priceGroups.map((g) => ({
      title: g.title,
      titleEm: g.titleEm,
      description: g.description,
      note: g.note ?? "",
      imageUrl: g.imageUrl,
      items: g.items.map((i) => ({
        category: i.category ?? "",
        label: i.label,
        price: i.price,
      })),
    })),
    contact: {
      businessName: contact.businessName,
      phone: contact.phone,
      phoneDisplay: contact.phoneDisplay,
      addressLine1: contact.addressLine1,
      addressLine2: contact.addressLine2,
      mapUrl: contact.mapUrl,
      logoUrl: contact.logoUrl,
      logoWhiteUrl: contact.logoWhiteUrl,
      instagramUrl: contact.instagramUrl,
      facebookUrl: contact.facebookUrl,
      tiktokUrl: contact.tiktokUrl,
      showBusinessName: contact.showBusinessName,
      hours: contactHours.map((h) => ({ days: h.days, time: h.time })),
      videos: contactVideos.map((v) => ({
        title: v.title,
        videoUrl: v.videoUrl,
        posterUrl: v.posterUrl,
      })),
    },
    legal,
    seo,
    pageSeo,
  };
});

/** Maps a SeoSettings DB row (or its absence) to the typed settings + defaults. */
function toSeoSettings(
  row: {
    siteUrl: string;
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImageUrl: string;
    gaMeasurementId: string;
    gtmContainerId: string;
    metaPixelId: string;
    googleSiteVerification: string;
  } | null,
): SeoSettings {
  if (!row) return { ...DEFAULT_SEO };
  return {
    siteUrl: row.siteUrl || process.env.SITE_URL || "",
    titleTemplate: row.titleTemplate,
    defaultTitle: row.defaultTitle || DEFAULT_SEO.defaultTitle,
    defaultDescription: row.defaultDescription || DEFAULT_SEO.defaultDescription,
    ogImageUrl: row.ogImageUrl,
    gaMeasurementId: row.gaMeasurementId,
    gtmContainerId: row.gtmContainerId,
    metaPixelId: row.metaPixelId,
    googleSiteVerification: row.googleSiteVerification,
  };
}

/**
 * Lightweight SEO-only fetch for robots.ts / sitemap.ts — reads a single row
 * instead of loading all site content just to get the site URL. Cached per
 * request like getContent().
 */
export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  const row = await prisma.seoSettings.findUnique({ where: { id: SINGLETON_ID } });
  return toSeoSettings(row);
});

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function saveContent(content: SiteContent): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Section headings (upsert each key)
    for (const [key, h] of Object.entries(content.headings)) {
      await tx.sectionHeading.upsert({
        where: { key },
        create: { key, ...h },
        update: { ...h },
      });
    }

    // Singletons
    await tx.hero.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        tag: content.hero.tag,
        titleLine: content.hero.titleLine,
        titleEm: content.hero.titleEm,
        subtitle: content.hero.subtitle,
        ctaPhone: content.hero.ctaPhone,
        ctaPrimaryLabel: content.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: content.hero.ctaSecondaryLabel,
        imageUrl: content.hero.imageUrl,
      },
      update: {
        tag: content.hero.tag,
        titleLine: content.hero.titleLine,
        titleEm: content.hero.titleEm,
        subtitle: content.hero.subtitle,
        ctaPhone: content.hero.ctaPhone,
        ctaPrimaryLabel: content.hero.ctaPrimaryLabel,
        ctaSecondaryLabel: content.hero.ctaSecondaryLabel,
        imageUrl: content.hero.imageUrl,
      },
    });

    await tx.about.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        tag: content.about.tag,
        titlePrefix: content.about.titlePrefix,
        titleEm1: content.about.titleEm1,
        titleMid: content.about.titleMid,
        titleEm2: content.about.titleEm2,
        text: content.about.text,
        imageUrl: content.about.imageUrl,
      },
      update: {
        tag: content.about.tag,
        titlePrefix: content.about.titlePrefix,
        titleEm1: content.about.titleEm1,
        titleMid: content.about.titleMid,
        titleEm2: content.about.titleEm2,
        text: content.about.text,
        imageUrl: content.about.imageUrl,
      },
    });

    await tx.aboutPage.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...content.aboutPage },
      update: { ...content.aboutPage },
    });

    await tx.servicesIntro.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...content.servicesIntro },
      update: { ...content.servicesIntro },
    });

    await tx.seoSettings.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...content.seo },
      update: { ...content.seo },
    });

    for (const path of SEO_PAGES) {
      const p = content.pageSeo[path];
      await tx.pageSeo.upsert({
        where: { path },
        create: { path, title: p.title, description: p.description },
        update: { title: p.title, description: p.description },
      });
    }

    await tx.contact.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        businessName: content.contact.businessName,
        phone: content.contact.phone,
        phoneDisplay: content.contact.phoneDisplay,
        addressLine1: content.contact.addressLine1,
        addressLine2: content.contact.addressLine2,
        mapUrl: content.contact.mapUrl,
        logoUrl: content.contact.logoUrl,
        logoWhiteUrl: content.contact.logoWhiteUrl,
        instagramUrl: content.contact.instagramUrl ?? "",
        facebookUrl: content.contact.facebookUrl ?? "",
        tiktokUrl: content.contact.tiktokUrl ?? "",
        showBusinessName: content.contact.showBusinessName,
      },
      update: {
        businessName: content.contact.businessName,
        phone: content.contact.phone,
        phoneDisplay: content.contact.phoneDisplay,
        addressLine1: content.contact.addressLine1,
        addressLine2: content.contact.addressLine2,
        mapUrl: content.contact.mapUrl,
        logoUrl: content.contact.logoUrl,
        logoWhiteUrl: content.contact.logoWhiteUrl,
        instagramUrl: content.contact.instagramUrl ?? "",
        facebookUrl: content.contact.facebookUrl ?? "",
        tiktokUrl: content.contact.tiktokUrl ?? "",
        showBusinessName: content.contact.showBusinessName,
      },
    });

    // Flat lists — replace wholesale
    await tx.heroBadge.deleteMany({});
    await tx.heroBadge.createMany({
      data: content.hero.badges.map((text, position) => ({ text, position })),
    });

    await tx.heroStat.deleteMany({});
    await tx.heroStat.createMany({
      data: content.hero.stats.map((s, position) => ({ ...s, position })),
    });

    await tx.stat.deleteMany({});
    await tx.stat.createMany({
      data: content.stats.map((s, position) => ({ ...s, position })),
    });

    await tx.brand.deleteMany({});
    await tx.brand.createMany({
      data: content.brands.map((name, position) => ({ name, position })),
    });

    await tx.aboutFeature.deleteMany({});
    await tx.aboutFeature.createMany({
      data: content.about.features.map((text, position) => ({ text, position })),
    });

    await tx.service.deleteMany({});
    await tx.service.createMany({
      data: content.services.map((s, position) => ({ ...s, position })),
    });

    await tx.processStep.deleteMany({});
    await tx.processStep.createMany({
      data: content.process.map((p, position) => ({ ...p, position })),
    });

    await tx.faqItem.deleteMany({});
    await tx.faqItem.createMany({
      data: content.faq.map((f, position) => ({ ...f, position })),
    });

    // `?? []` guards against an /admin tab that was opened before this feature
    // shipped: the PUT endpoint does no validation, so its payload would arrive
    // without the key and take the whole save down.
    await tx.galleryImage.deleteMany({});
    await tx.galleryImage.createMany({
      data: (content.gallery ?? []).map((g, position) => ({ ...g, position })),
    });

    await tx.diploma.deleteMany({});
    await tx.diploma.createMany({
      data: content.diplomas.map((d, position) => ({ ...d, position })),
    });

    await tx.value.deleteMany({});
    await tx.value.createMany({
      data: content.values.map((v, position) => ({ ...v, position })),
    });

    await tx.contactHour.deleteMany({});
    await tx.contactHour.createMany({
      data: content.contact.hours.map((h, position) => ({ ...h, position })),
    });

    await tx.contactVideo.deleteMany({});
    await tx.contactVideo.createMany({
      data: (content.contact.videos ?? []).map((v, position) => ({ ...v, position })),
    });

    // Testimonials (home + about)
    await tx.testimonial.deleteMany({});
    await tx.testimonial.createMany({
      data: [
        ...content.testimonialsHome.map((t, position) => ({ ...t, page: "home", position })),
        ...content.testimonialsAbout.map((t, position) => ({ ...t, page: "about", position })),
      ],
    });

    // Legal pages — the page row is upserted, its sections (and the rows that
    // cascade from them) are replaced wholesale like every other list here.
    // `?? EMPTY` guards an /admin tab opened before this feature shipped.
    for (const slug of LEGAL_PAGES) {
      const page = content.legal?.[slug] ?? EMPTY_LEGAL_PAGE;
      const fields = {
        eyebrow: page.eyebrow,
        title: page.title,
        titleEm: page.titleEm,
        intro: page.intro,
        stand: page.stand,
        showToc: page.showToc,
        tocTitle: page.tocTitle,
        ctaTitle: page.ctaTitle,
        ctaText: page.ctaText,
        ctaLabel: page.ctaLabel,
      };
      await tx.legalPage.upsert({
        where: { slug },
        create: { slug, ...fields },
        update: fields,
      });
      await tx.legalSection.deleteMany({ where: { pageSlug: slug } });
      for (let position = 0; position < page.sections.length; position++) {
        const sec = page.sections[position];
        const created = await tx.legalSection.create({
          data: {
            pageSlug: slug,
            num: sec.num,
            title: sec.title,
            titleNote: sec.titleNote,
            body: sec.body,
            variant: sec.variant,
            rowStyle: sec.rowStyle,
            cardBadge: sec.cardBadge,
            cardTitle: sec.cardTitle,
            cardSubtitle: sec.cardSubtitle,
            position,
          },
        });
        if (sec.rows.length > 0) {
          await tx.legalRow.createMany({
            data: sec.rows.map((r, rowPos) => ({
              sectionId: created.id,
              label: r.label,
              value: r.value,
              position: rowPos,
            })),
          });
        }
      }
    }

    // Price groups + items (relational — recreate groups then items)
    await tx.priceItem.deleteMany({});
    await tx.priceGroup.deleteMany({});
    for (let position = 0; position < content.priceGroups.length; position++) {
      const g = content.priceGroups[position];
      const created = await tx.priceGroup.create({
        data: {
          title: g.title,
          titleEm: g.titleEm,
          description: g.description,
          note: g.note ? g.note : null,
          imageUrl: g.imageUrl ?? "",
          position,
        },
      });
      if (g.items.length > 0) {
        await tx.priceItem.createMany({
          data: g.items.map((i, itemPos) => ({
            groupId: created.id,
            category: i.category ? i.category : null,
            label: i.label,
            price: i.price,
            position: itemPos,
          })),
        });
      }
    }
  });
}
