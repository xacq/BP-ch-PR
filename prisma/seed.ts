import { PrismaClient } from "../src/generated/prisma/client";
import { makeMariaDbAdapter } from "../src/lib/mariadb-adapter";
import { seedLegalPages } from "./legal-seed";

const prisma = new PrismaClient({ adapter: makeMariaDbAdapter() });

const SINGLETON_ID = 1;

async function seedIfEmpty(count: number, seed: () => Promise<unknown>) {
  if (count > 0) return;
  await seed();
}

async function main() {
  // Runs before the early return below: the legal pages shipped after the
  // first launch, so an already-seeded database still needs them.
  await seedLegalPages(prisma);

  // Idempotent: never overwrite CMS edits. A mid-seed crash can resume.
  if ((await prisma.contact.count()) > 0) {
    console.log("Database already seeded — skipping.");
    return;
  }

  // --- Section headings ---
  await prisma.sectionHeading.createMany({
    skipDuplicates: true,
    data: [
      { key: "home_services", eyebrow: "Unsere Leistungen", titleLead: "Was wir", titleEm: "anbieten." },
      { key: "home_process", eyebrow: "Ihr Weg zu strahlender Haut", titleLead: "So funktioniert", titleEm: "Ihre Behandlung." },
      { key: "home_testimonials", eyebrow: "Kundenstimmen", titleLead: "Was unsere", titleEm: "Kundinnen sagen." },
      { key: "home_faq", eyebrow: "FAQ", titleLead: "Haben Sie", titleEm: "Fragen?" },
      { key: "gallery", eyebrow: "Einblicke", titleLead: "Unser", titleEm: "Studio." },
      { key: "home_contact", eyebrow: "Kontakt & Anfahrt", titleLead: "Besuchen Sie", titleEm: "uns." },
      { key: "about_diplomas", eyebrow: "Ausbildung & Zertifikate", titleLead: "Professionelle", titleEm: "Qualifikationen." },
      { key: "about_values", eyebrow: "Unsere Werte", titleLead: "Warum Kundinnen uns", titleEm: "vertrauen." },
      { key: "about_testimonials", eyebrow: "Kundenstimmen", titleLead: "Was unsere", titleEm: "Kundinnen sagen." },
      { key: "about_contact", eyebrow: "Kontakt", titleLead: "Termin", titleEm: "vereinbaren." },
      { key: "services_contact", eyebrow: "Termin vereinbaren", titleLead: "Bereit für Ihren", titleEm: "nächsten Termin?" },
    ],
  });

  // --- Hero ---
  await prisma.hero.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      tag: "Beauty Palast · Visp, Wallis",
      titleLine: "Verfeinerte Schönheit.",
      titleEm: "Expertenpräzision.",
      subtitle:
        "Von Augenbrauen und Wimpern bis zu fortschrittlichen Gesichtsbehandlungen – wir unterstreichen Ihre natürliche Schönheit mit professioneller Pflege und Präzision.",
      ctaPhone: "+41794697791",
      ctaPrimaryLabel: "Termin buchen",
      ctaSecondaryLabel: "Leistungen entdecken",
    },
  });

  await seedIfEmpty(await prisma.heroBadge.count(), () =>
    prisma.heroBadge.createMany({
      data: [
        { text: "5 ★ Bewertungen", position: 0 },
        { text: "Zertifizierte Spezialistin", position: 1 },
        { text: "Premium Produkte", position: 2 },
      ],
    }),
  );

  await seedIfEmpty(await prisma.heroStat.count(), () =>
    prisma.heroStat.createMany({
      data: [
        { num: "10+", label: "Jahre Erfahrung", position: 0 },
        { num: "500+", label: "Zufriedene Kunden", position: 1 },
        { num: "100%", label: "Zufriedenheit", position: 2 },
      ],
    }),
  );

  // --- Stats bar ---
  await seedIfEmpty(await prisma.stat.count(), () =>
    prisma.stat.createMany({
      data: [
        { num: "10+", label: "Jahre Erfahrung", position: 0 },
        { num: "500+", label: "Zufriedene Kunden", position: 1 },
        { num: "20+", label: "Behandlungsoptionen", position: 2 },
        { num: "100%", label: "Zufriedenheitsrate", position: 3 },
      ],
    }),
  );

  // --- Brands ---
  await seedIfEmpty(await prisma.brand.count(), () =>
    prisma.brand.createMany({
      data: [
        { name: "Gernetic International", position: 0 },
        { name: "Astrali", position: 1 },
        { name: "O.P.I.", position: 2 },
      ],
    }),
  );

  // --- About (home highlight) ---
  await prisma.about.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      tag: "Zertifizierte Kosmetikerin",
      titlePrefix: "Die perfekte Balance zwischen",
      titleEm1: "klinischer Expertise",
      titleMid: "und",
      titleEm2: "verfeinerte Schönheit.",
      text: "Als Kosmetikerin ist es meine Leidenschaft, Schönheit, Wohlbefinden und Selbstbewusstsein zu fördern. Mit professionellen Behandlungen und einer individuellen Beratung ist es mein Ziel, dass sich jede Kundin bei mir wohlfühlt und mit einem strahlenden Lächeln nach Hause geht.",
    },
  });

  await seedIfEmpty(await prisma.aboutFeature.count(), () =>
    prisma.aboutFeature.createMany({
      data: [
        { text: "Diplom Kosmetikerin – Swiss Beauty Academy", position: 0 },
        { text: "Modernste Technologien: Microneedling, Exosomen, Ultraschall", position: 1 },
        { text: "Premium-Marken: Gernetic International, Astrali, OPI", position: 2 },
        { text: "Spezialisiert in Massage, Permanent Make-up & Nail Art", position: 3 },
      ],
    }),
  );

  // --- Services (home cards) ---
  await seedIfEmpty(await prisma.service.count(), () =>
    prisma.service.createMany({
      data: [
        { title: "Gesichtsbehandlung", description: "Klassische & spezielle Behandlungen, Ultraschall, Microneedling und Exosomen-Therapie.", popular: true, position: 0 },
        { title: "Haarentfernung & Laser", description: "Professionelle Haarentfernung mit Wachs und Laser-Diode für dauerhaft glatte Haut.", popular: true, position: 1 },
        { title: "Augenbrauen & Wimpern", description: "Korrigieren, modellieren, färben, zupfen und Wimper-Lifting für einen ausdrucksstarken Blick.", popular: false, position: 2 },
        { title: "Maniküre & Pediküre", description: "Klassische und Gel-Behandlungen mit OPI-Produkten auf höchstem Niveau.", popular: false, position: 3 },
        { title: "Massage & Körperpflege", description: "Ganzkörpermassage, Bambus, Hot Stone, Reboutage und Körperpeeling.", popular: false, position: 4 },
        { title: "Presotherapie · Arosha Body", description: "Modernste Cellulite-Behandlung. 8 Einheiten – die 9. gratis!", popular: false, position: 5 },
      ],
    }),
  );

  // --- Process ---
  await seedIfEmpty(await prisma.processStep.count(), () =>
    prisma.processStep.createMany({
      data: [
        { stepLabel: "{ Schritt 1 }", title: "Persönliche", titleEm: "Analyse", text: "Wir beginnen mit einer individuellen Hautanalyse. Unsere Spezialistin nimmt sich Zeit, Ihre Bedürfnisse und Ziele zu verstehen.", position: 0 },
        { stepLabel: "{ Schritt 2 }", title: "Massgeschneiderter", titleEm: "Behandlungsplan", text: "Wir erstellen einen individuellen Plan für Ihren Hauttyp – mit modernsten Technologien und Premium-Produkten.", position: 1 },
        { stepLabel: "{ Schritt 3 }", title: "Nachhaltige", titleEm: "Ergebnisse", text: "Sichtbare Ergebnisse bereits nach der Behandlung. Wir begleiten Sie mit einem klaren Nachsorgeplan und persönlichen Pflegeempfehlungen.", position: 2 },
      ],
    }),
  );

  // --- Testimonials ---
  await seedIfEmpty(await prisma.testimonial.count(), () =>
    prisma.testimonial.createMany({
    data: [
      // home (6)
      { page: "home", text: "Ich bin sehr zufrieden! Tolle Arbeit, professionelle Beratung und eine angenehme Atmosphäre. Danke!", name: "Monika R.", service: "Gesichtsbehandlung", position: 0 },
      { page: "home", text: "Die herzliche und liebevolle Art von Andrea überzeugt mich immer wieder. Klare Empfehlung für die tolle Betreuung all die Jahre!", name: "Sabine W.", service: "Make-up & Nägel", position: 1 },
      { page: "home", text: "Die Qualität ist seit dem ersten Tag konstant auf höchstem Niveau. Für mich gibt es keine bessere Adresse für die pure Entspannung.", name: "Ursula M.", service: "Massage & Körperpflege", position: 2 },
      { page: "home", text: "Das Augenbrauenstyling und die Haarentfernung werden äusserst sauber durchgeführt. Mein Wimperlifting war wunderschön.", name: "Kathrin B.", service: "Augenbrauen & Wimpern", position: 3 },
      { page: "home", text: "Besonders mein Hochzeits-Make-up und die Nägel waren wunderschön. Ich bin seit vielen Jahren Kundin und jedes Mal zufrieden.", name: "Janine F.", service: "Make-up & Nägel", position: 4 },
      { page: "home", text: "Die Gesichtsbehandlungen haben mein Hautbild verbessert. Meine Haut wirkt frischer und gepflegter – ich freue mich immer auf den nächsten Termin.", name: "Regula T.", service: "Gesichtsbehandlung", position: 5 },
      // about (3)
      { page: "about", text: "Ich bin seit vielen Jahren eine treue Kundin. Egal ob Gesichtsbehandlung oder Laser – man wird freundlich und sehr professionell behandelt.", name: "Monika R.", service: "Stammkundin", position: 0 },
      { page: "about", text: "Ich gehe seit über 10 Jahren zu Andrea. Die herzliche und liebevolle Art und die tolle Arbeit überzeugen mich immer wieder.", name: "Janine F.", service: "Seit über 10 Jahren", position: 1 },
      { page: "about", text: "Besonders schätze ich die Zuverlässigkeit, die Professionalität und den immer freundlichen Kontakt. Für mich gibt es keine bessere Adresse.", name: "Regula T.", service: "Stammkundin", position: 2 },
    ],
    }),
  );

  // --- FAQ ---
  await seedIfEmpty(await prisma.faqItem.count(), () =>
    prisma.faqItem.createMany({
    data: [
      { question: "Brauche ich eine Beratung vor der Behandlung?", answer: "Für spezielle Behandlungen wie Microneedling oder Laser empfehlen wir eine kurze Beratung. Wir besprechen Ihre Bedürfnisse und erstellen gemeinsam den idealen Plan.", position: 0 },
      { question: "Wie bereite ich mich auf einen Termin vor?", answer: "Kommen Sie ohne Make-up für Gesichtsbehandlungen. Bei Haarentfernung sollten die Haare ca. 3–5 mm lang sein.", position: 1 },
      { question: "Gibt es Ausfallzeiten nach einer Behandlung?", answer: "Bei den meisten Behandlungen gibt es keine Ausfallzeit. Nach Microneedling kann die Haut 24–48 Stunden leicht gerötet sein.", position: 2 },
      { question: "Welche Produkte werden verwendet?", answer: "Wir arbeiten ausschliesslich mit Premium-Marken: Gernetic International, Astrali und OPI.", position: 3 },
      { question: "Kann ich mehrere Behandlungen kombinieren?", answer: "Ja, viele Kombinationen sind möglich und sehr beliebt – z. B. Gesichtsbehandlung mit Augenbrauen oder Maniküre mit Pediküre.", position: 4 },
    ],
    }),
  );

  // --- About page (Über Andrea) ---
  await prisma.aboutPage.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      eyebrow: "Über uns",
      name: "Andrea",
      nameEm: "Teles",
      role: "Kosmetikerin · Beauty Palast · Visp",
      bio1: "Als zertifizierte Kosmetikerin ist es meine Leidenschaft, Schönheit, Wohlbefinden und Selbstbewusstsein zu fördern. Mit professionellen Behandlungen und einer individuellen Beratung ist es mein Ziel, dass sich jede Kundin bei mir wohlfühlt und mit einem strahlenden Lächeln nach Hause geht.",
      bio2: "Im Beauty Palast in Visp biete ich ein breites Spektrum an Behandlungen an – von klassischer Kosmetik über moderne Technologien wie Microneedling und Exosomen bis hin zu Massage, Nail Art und Permanent Make-up.",
      quote: "Mit professionellen Behandlungen und individueller Beratung helfe ich meinen Kundinnen und Kunden, sich rundum gepflegt und wohl zu fühlen.",
    },
  });

  await seedIfEmpty(await prisma.diploma.count(), () =>
    prisma.diploma.createMany({
      data: [
        { icon: "cosmetics", title: "Diplom Kosmetikerin", school: "Swiss Beauty Academy · Fachschule für Kosmetik", position: 0 },
        { icon: "permanent", title: "Ausbildung Permanent Make-up", school: "Kosmetik Academy", position: 1 },
        { icon: "massage", title: "Diplôme Massage Classique", school: "Atlas & Bien-Être Sàrl", position: 2 },
        { icon: "bamboo", title: "Attestation Massage aux Bambous", school: "Centre Thérapeutique", position: 3 },
        { icon: "hotstone", title: "Hot Stone Therapy", school: "Centre Thérapeutique · École de Massage", position: 4 },
        { icon: "nails", title: "Nail Art", school: "RMD Art Nails · École de Styliste Onglaire", position: 5 },
        { icon: "honey", title: "Massage Apithérapie", school: "La Ruche Docteur L'Abeille", position: 6 },
      ],
    }),
  );

  await seedIfEmpty(await prisma.value.count(), () =>
    prisma.value.createMany({
      data: [
        { num: "01", title: "Qualität auf höchstem Niveau", text: "Seit der Eröffnung konstante Qualität – mit Premium-Produkten von Gernetic International, Astrali und OPI.", position: 0 },
        { num: "02", title: "Individuelle Beratung", text: "Jede Kundin ist einzigartig. Wir nehmen uns Zeit für eine persönliche Analyse und massgeschneiderte Behandlungspläne.", position: 1 },
        { num: "03", title: "Herzliche Atmosphäre", text: "Bei uns fühlen Sie sich von Anfang an wohl. Professionalität und Herzlichkeit gehen bei uns Hand in Hand.", position: 2 },
      ],
    }),
  );

  // --- Services intro ---
  await prisma.servicesIntro.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      eyebrow: "Leistungen & Preise",
      titleLead: "Alle Behandlungen.",
      titleEm: "Transparente Preise.",
      description: "Professionelle Kosmetik, Massage, Nail Art und mehr – individuell auf Sie abgestimmt. Alle Preise in CHF inkl. MwSt.",
    },
  });

  // --- Price groups ---
  const priceGroups: {
    title: string;
    titleEm: string;
    description: string;
    note?: string;
    items: { category?: string; label: string; price: string }[];
  }[] = [
    {
      title: "Make-",
      titleEm: "up",
      description: "Professionelles Make-up für jeden Anlass – von der täglichen Verschönerung bis zum unvergesslichen Hochzeits-Make-up.",
      items: [
        { label: "Make-up Tag / Abend", price: "CHF 45" },
        { label: "Make-up Hochzeit", price: "CHF 60" },
      ],
    },
    {
      title: "Kosmetik &",
      titleEm: "Gesicht",
      description: "Von der klassischen Gesichtsbehandlung bis zu modernsten Technologien wie Microneedling und Exosomen-Therapie.",
      items: [
        { category: "Augenbrauen & Wimpern", label: "Augenbrauen korrigieren / Modellieren", price: "CHF 28" },
        { category: "Augenbrauen & Wimpern", label: "Augenbrauen Färben / Zupfen", price: "CHF 42" },
        { category: "Augenbrauen & Wimpern", label: "Augenbrauen Färben", price: "CHF 20" },
        { category: "Augenbrauen & Wimpern", label: "Wimpern Färben", price: "CHF 25" },
        { category: "Augenbrauen & Wimpern", label: "Wimpern + Augenbrauen Färben / Zupfen", price: "CHF 65" },
        { category: "Augenbrauen & Wimpern", label: "Wimper Lifting", price: "CHF 60" },
        { category: "Gesichtsbehandlungen", label: "Klassische Gesichtsbehandlung", price: "CHF 140" },
        { category: "Gesichtsbehandlungen", label: "Spezielle Gesichtsbehandlung", price: "CHF 160" },
        { category: "Gesichtsbehandlungen", label: "Gesichtsmassage mit Ultraschall", price: "CHF 80" },
        { category: "Gesichtsbehandlungen", label: "Microneedling", price: "CHF 170" },
        { category: "Gesichtsbehandlungen", label: "Exosomes", price: "CHF 290" },
        { category: "Gesichtsbehandlungen", label: "BB Glow", price: "CHF 140" },
      ],
    },
    {
      title: "Maniküre &",
      titleEm: "Pediküre",
      description: "Gepflegte Nägel auf höchstem Niveau mit exklusiven OPI-Produkten – klassisch oder mit Gel.",
      items: [
        { category: "Maniküre", label: "Maniküre OPI", price: "CHF 50" },
        { category: "Maniküre", label: "Maniküre + Nagellack OPI", price: "CHF 60" },
        { category: "Maniküre", label: "Maniküre + Nagellack Gel OPI", price: "CHF 65" },
        { category: "Pediküre", label: "Pediküre OPI komplett", price: "CHF 70" },
        { category: "Pediküre", label: "Pediküre OPI + Nagellack", price: "CHF 75" },
        { category: "Pediküre", label: "Pediküre OPI + Nagellack Gel OPI", price: "CHF 85" },
        { category: "Extras", label: "Gellack entfernen", price: "CHF 35" },
        { category: "Extras", label: "Parafin Behandlung", price: "CHF 25" },
      ],
    },
    {
      title: "Körper-",
      titleEm: "peeling",
      description: "Sanftes Peeling für strahlende, gepflegte Haut am ganzen Körper oder gezielt an Teilbereichen.",
      items: [
        { label: "Ganzkörper", price: "CHF 70" },
        { label: "Teilkörper", price: "CHF 40" },
      ],
    },
    {
      title: "Haar-",
      titleEm: "entfernung",
      description: "Professionelle Haarentfernung für Gesicht und Körper – präzise, sanft und effektiv. Auch Laser Diodo verfügbar.",
      items: [
        { category: "Gesicht", label: "Gesicht", price: "CHF 45" },
        { category: "Gesicht", label: "Oberlippe", price: "CHF 12" },
        { category: "Gesicht", label: "Kinn", price: "CHF 15" },
        { category: "Gesicht", label: "Nase", price: "CHF 10" },
        { category: "Körper", label: "Achseln", price: "CHF 25" },
        { category: "Körper", label: "Unterarme", price: "CHF 30" },
        { category: "Körper", label: "Arm komplett", price: "CHF 38" },
        { category: "Körper", label: "Oberschenkel", price: "CHF 45" },
        { category: "Körper", label: "Unterschenkel", price: "CHF 35" },
        { category: "Körper", label: "Bein ganz", price: "CHF 70" },
        { category: "Körper", label: "Bikini klassisch", price: "CHF 30" },
        { category: "Körper", label: "Bikini brasilianisch", price: "CHF 50" },
        { category: "Körper", label: "Rücken", price: "CHF 65" },
        { category: "Körper", label: "Brust", price: "CHF 65" },
      ],
    },
    {
      title: "Massage &",
      titleEm: "Wellness",
      description: "Pure Entspannung für Körper und Geist – von der klassischen Ganzkörpermassage bis zur exklusiven Hot Stone Therapie.",
      items: [
        { label: "Klassische Ganzkörpermassage 60'", price: "CHF 110" },
        { label: "Bambus Massage 60'", price: "CHF 120" },
        { label: "Kombiniert mit Lavastein 60'", price: "CHF 120" },
        { label: "Hot Stone Therapie 60'", price: "CHF 130" },
        { label: "Rücken / Nacken Massage 30'", price: "CHF 60" },
        { label: "Reboutage 60'", price: "CHF 130" },
      ],
    },
    {
      title: "Presotherapie ·",
      titleEm: "Arosha Body",
      description: "Modernste Cellulite-Behandlung mit dem Arosha Body Presotherapie-Gerät. Sichtbare Ergebnisse, besonderes Angebot bei der Cure.",
      note: "★ Bei 8 Behandlungen ist die 9. gratis!",
      items: [
        { label: "Cellulite Behandlung 60'", price: "CHF 120" },
        { label: "Cellulite Behandlung Cure Arosha (8×60')", price: "CHF 960" },
      ],
    },
  ];

  if ((await prisma.priceGroup.count()) === 0) {
    for (let position = 0; position < priceGroups.length; position++) {
      const g = priceGroups[position];
      const group = await prisma.priceGroup.create({
        data: {
          title: g.title,
          titleEm: g.titleEm,
          description: g.description,
          note: g.note ?? null,
          position,
        },
      });
      await prisma.priceItem.createMany({
        data: g.items.map((i, itemPos) => ({
          groupId: group.id,
          category: i.category ?? null,
          label: i.label,
          price: i.price,
          position: itemPos,
        })),
      });
    }
  }

  // --- Contact ---
  await prisma.contact.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: {
      id: SINGLETON_ID,
      businessName: "Beauty Palast · Andrea Teles",
      phone: "+41794697791",
      phoneDisplay: "+41 79 469 77 91",
      addressLine1: "Brückenweg 3, 3. Obergeschoss",
      addressLine2: "3930 Visp, Wallis",
      mapUrl: "https://maps.google.com/?q=Brückenweg+3+3930+Visp",
    },
  });

  await seedIfEmpty(await prisma.contactHour.count(), () =>
    prisma.contactHour.createMany({
      data: [
        { days: "Montag – Freitag", time: "09:00 – 12:00 Uhr", position: 0 },
        { days: "", time: "13:30 – 18:30 Uhr", position: 1 },
        { days: "Samstag / Sonntag", time: "Geschlossen", position: 2 },
      ],
    }),
  );

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
