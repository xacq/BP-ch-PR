import type { PrismaClient } from "../src/generated/prisma/client";

// ---------------------------------------------------------------------------
// Legal pages ("Impressum" / "Datenschutzerklärung")
//
// Content as delivered by the client. `body` uses the light rich-text format
// read by src/components/RichText.tsx:
//   blank line → paragraph · "- " → bullet · "> " → small note
//   **bold** · *italic* · [label](href)
// Everything here is editable afterwards in /admin → "Rechtliches".
// ---------------------------------------------------------------------------

const PHONE = "tel:+41794697791";

type SeedRow = { label: string; value: string };

type SeedSection = {
  num?: string;
  title?: string;
  titleNote?: string;
  body?: string;
  variant?: "default" | "card" | "note";
  rowStyle?: "table" | "cards";
  cardBadge?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  rows?: SeedRow[];
};

type SeedPage = {
  slug: string;
  eyebrow: string;
  title: string;
  titleEm?: string;
  intro: string;
  stand: string;
  showToc: boolean;
  tocTitle?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaLabel?: string;
  sections: SeedSection[];
};

export const LEGAL_SEED: SeedPage[] = [
  // -------------------------------------------------------------------------
  // IMPRESSUM
  // -------------------------------------------------------------------------
  {
    slug: "impressum",
    eyebrow: "Beauty Palast · Andrea Teles · Visp",
    title: "Impressum",
    titleEm: "",
    intro:
      "Angaben gemäss Art. 3 Abs. 1 lit. s des Bundesgesetzes gegen den unlauteren Wettbewerb (UWG) sowie ergänzende Informationen zur Transparenz und zum Datenschutz.",
    stand: "Stand: 2025",
    showToc: true,
    tocTitle: "Inhalt",
    sections: [
      {
        num: "01",
        title: "Betreiberin der Website",
        rows: [
          { label: "Name", value: "**Beauty Palast**" },
          { label: "Inhaberin", value: "Andrea Teles" },
          { label: "Unternehmensform", value: "Einzelunternehmen" },
          { label: "Tätigkeitsbereich", value: "Kosmetik, Wellness und Körperpflege" },
          {
            label: "Adresse",
            value: "Brückenweg 3, 3. Obergeschoss\n3930 Visp, Kanton Wallis\nSchweiz",
          },
          { label: "Telefon", value: `[+41 79 469 77 91](${PHONE})` },
          { label: "Öffnungszeiten", value: "Mo–Fr: 09:00–12:00 / 13:30–18:30 Uhr" },
          {
            label: "Mehrwertsteuer",
            value: "Nicht MWST-pflichtig gemäss Art. 10 Abs. 2 MWSTG",
          },
        ],
      },
      {
        num: "02",
        title: "Verantwortlich für den Inhalt",
        body: "Verantwortlich für den Inhalt dieser Website im Sinne von Art. 322 StGB:",
        rows: [
          { label: "Person", value: "**Andrea Teles**" },
          { label: "Funktion", value: "Inhaberin, Beauty Palast" },
          { label: "Adresse", value: "Brückenweg 3, 3. OG · 3930 Visp" },
          { label: "Telefon", value: `[+41 79 469 77 91](${PHONE})` },
        ],
      },
      {
        num: "03",
        title: "Konzeption, Gestaltung und technische Umsetzung",
        body: "Diese Website wurde konzipiert, gestaltet und technisch realisiert durch:",
        variant: "card",
        cardBadge: "AK",
        cardTitle: "Alpine Künstliche Intelligenz AG",
        cardSubtitle: "Aktiengesellschaft nach Schweizer Recht",
        rows: [
          { label: "Adresse", value: "Pappelweg 5\n3945 Gampel\nKanton Wallis, Schweiz" },
          { label: "Ansprechpartnerin", value: "Mery Paola Ruffiner" },
          { label: "Telefon", value: "[+41 79 527 64 43](tel:+41795276443)" },
          { label: "E-Mail", value: "[paola@alpine-ki.ch](mailto:paola@alpine-ki.ch)" },
          { label: "Web", value: "[www.alpine-ki.ch](https://www.alpine-ki.ch)" },
          { label: "Handelsregister", value: "Handelsregisteramt Kanton Wallis" },
          { label: "UID", value: "CHE-390.652.968" },
        ],
      },
      {
        num: "04",
        title: "Haftungsausschluss",
        body: "Die Betreiberin erstellt und pflegt die Inhalte dieser Website mit grösster Sorgfalt und bemüht sich um korrekte, aktuelle und vollständige Informationen. Eine Haftung oder Garantie für die Aktualität, Richtigkeit und Vollständigkeit der zur Verfügung gestellten Informationen ist jedoch ausgeschlossen.\n\nPreisangaben, Behandlungsbeschreibungen und Verfügbarkeiten dienen der allgemeinen Information und stellen kein rechtlich verbindliches Angebot dar. Verbindlich sind ausschliesslich die im Rahmen eines konkreten Termins oder Vertragsverhältnisses mündlich oder schriftlich vereinbarten Bedingungen.",
      },
      {
        num: "05",
        title: "Externe Links",
        body: "Diese Website enthält Verweise auf Websites Dritter (externe Links), die ausserhalb des Verantwortungsbereichs der Betreiberin liegen. Für die Inhalte dieser Websites ist ausschliesslich der jeweilige Anbieter oder Betreiber verantwortlich. Die Betreiberin hat keinen Einfluss auf die aktuelle und künftige Gestaltung, den Inhalt oder die Urheberschaft der verlinkten Seiten und übernimmt keine Verantwortung für deren Inhalte, Datenschutzpraktiken oder Verfügbarkeit.",
      },
      {
        num: "06",
        title: "Urheberrecht und Nutzungsrechte",
        body: "Sämtliche Inhalte dieser Website — insbesondere Texte, Bilder, Grafiken, Logos, Layout, Quellcode und weitere Werke — sind urheberrechtlich geschützt und Eigentum der Beauty Palast – Andrea Teles bzw. der jeweils genannten Rechteinhaber.\n\nJede Vervielfältigung, Bearbeitung, Verbreitung oder anderweitige Verwertung, ganz oder auszugsweise, bedarf der vorherigen schriftlichen Zustimmung der Betreiberin. Der Download einzelner Inhalte zum privaten, nicht kommerziellen Gebrauch ist gestattet.",
      },
      {
        num: "07",
        title: "Bildnachweise",
        body: `Alle auf dieser Website verwendeten Bildmaterialien sind Eigentum der Beauty Palast – Andrea Teles oder ordnungsgemäss lizenziert. Detaillierte Bildnachweise sind auf schriftliche Anfrage über [+41 79 469 77 91](${PHONE}) erhältlich.`,
      },
      {
        num: "08",
        title: "Datenschutz",
        body: "Informationen zur Erhebung, Verarbeitung und Nutzung personenbezogener Daten im Rahmen des Besuchs dieser Website entnehmen Sie bitte unserer Datenschutzerklärung.\n\n[Datenschutzerklärung ansehen →](/datenschutz)",
      },
      {
        num: "09",
        title: "Anwendbares Recht und Gerichtsstand",
        body: "Für sämtliche Rechtsbeziehungen aus oder im Zusammenhang mit dieser Website gilt ausschliesslich Schweizer Recht unter Ausschluss internationaler Kollisionsnormen.\n\nAusschliesslicher Gerichtsstand ist Visp, Kanton Wallis, Schweiz — vorbehaltlich zwingender gesetzlicher Vorschriften zugunsten von Konsumentinnen und Konsumenten.",
      },
      {
        num: "10",
        title: "Änderungen des Impressums",
        body: "Die Betreiberin behält sich das Recht vor, die Angaben in diesem Impressum bei Bedarf jederzeit anzupassen und dem geltenden Recht anzugleichen. Die jeweils aktuelle Version ist stets auf dieser Seite abrufbar.\n\n> Stand: 2025 · Beauty Palast – Andrea Teles · Visp · Oberwallis",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // DATENSCHUTZERKLÄRUNG
  // -------------------------------------------------------------------------
  {
    slug: "datenschutz",
    eyebrow: "Rechtliches · Beauty Palast",
    // The title is split mid-word on purpose: "Datenschutz-" + italic
    // "erklärung" renders as one word (see LegalPageView).
    title: "Datenschutz-",
    titleEm: "erklärung",
    intro:
      "**Gemäss Schweizer Datenschutzgesetz (DSG, in Kraft seit 1. September 2023) und DSGVO**",
    stand: "Stand: 2025 · Beauty Palast – Andrea Teles · Brückenweg 3, 3930 Visp",
    showToc: false,
    tocTitle: "Inhalt",
    ctaTitle: "Fragen zum Datenschutz?",
    ctaText: `Wenden Sie sich direkt an uns:\nBeauty Palast – Andrea Teles\nBrückenweg 3, 3. OG · 3930 Visp\n[+41 79 469 77 91](${PHONE})`,
    ctaLabel: "Jetzt anrufen",
    sections: [
      {
        num: "01",
        title: "Verantwortliche Stelle",
        titleNote: "(Art. 19 DSG)",
        body: `Verantwortlich für die Bearbeitung von Personendaten auf dieser Website ist:\n\n**Beauty Palast – Andrea Teles**\nBrückenweg 3, 3. Obergeschoss\n3930 Visp, Wallis, Schweiz\nTelefon: [+41 79 469 77 91](${PHONE})\n\nEs wird kein Datenschutzbeauftragter benannt, da dies für Einzelunternehmen dieser Grösse gesetzlich nicht verpflichtend ist. Bei datenschutzrelevanten Anliegen wenden Sie sich direkt an die oben genannte Kontaktperson.`,
      },
      {
        num: "02",
        title: "Welche Personendaten wir bearbeiten",
        body: "Wir bearbeiten nur Daten, die für die Erbringung unserer Dienstleistungen erforderlich sind. Je nach Kontaktart erfassen wir folgende Kategorien:",
        rowStyle: "cards",
        rows: [
          {
            label: "Bei telefonischer Terminvereinbarung",
            value: "Name, Telefonnummer, gewünschte Behandlung, Termindatum und -uhrzeit.",
          },
          {
            label: "Bei der Behandlung (besonders schützenswerte Daten)",
            value:
              "Gesundheitliche Informationen (z. B. Hauttyp, Allergien, Vorbehandlungen), die für eine sichere und individuelle Behandlung notwendig sind. Diese Daten werden vertraulich behandelt und ausschliesslich intern verwendet.",
          },
          {
            label: "Beim Besuch dieser Website (technische Daten)",
            value:
              "IP-Adresse (anonymisiert), Browsertyp, Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs. Diese Daten dienen dem technischen Betrieb und werden nicht zur Identifikation einzelner Personen verwendet.",
          },
        ],
      },
      {
        num: "03",
        title: "Zweck und Rechtsgrundlage der Datenbearbeitung",
        body: "Ihre Daten werden ausschliesslich für folgende Zwecke bearbeitet:\n\n- Vereinbarung, Verwaltung und Durchführung von Behandlungsterminen *(Vertragserfüllung – Art. 6 Abs. 1 lit. b DSGVO)*\n- Individuelle Behandlungsplanung und Sicherheit der Kunden *(Vertragserfüllung / berechtigtes Interesse – Art. 6 Abs. 1 lit. f DSGVO)*\n- Einhaltung gesetzlicher Aufbewahrungspflichten *(gesetzliche Verpflichtung – Art. 6 Abs. 1 lit. c DSGVO)*\n- Technischer Betrieb und Sicherheit der Website *(berechtigtes Interesse – Art. 6 Abs. 1 lit. f DSGVO)*\n\nBesonders schützenswerte Gesundheitsdaten werden gestützt auf Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie mit ausdrücklicher Einwilligung der betroffenen Person bearbeitet. Rechtsgrundlage im Schweizer Recht: Art. 4 und Art. 19 DSG.",
      },
      {
        num: "04",
        title: "Weitergabe von Personendaten",
        body: "Ihre Personendaten werden grundsätzlich nicht an Dritte weitergegeben, verkauft oder vermietet. Eine Weitergabe erfolgt ausnahmsweise nur in folgenden Fällen:\n\n- An Behörden, soweit wir gesetzlich dazu verpflichtet sind\n- An Hosting-Dienstleister, die im Rahmen einer Auftragsverarbeitung technische Infrastruktur bereitstellen – ausschliesslich auf Basis schriftlicher Vereinbarungen\n\nEine Datenübermittlung in Länder ausserhalb der Schweiz oder der EU findet nicht statt, soweit nicht im Einzelfall anders angegeben (z. B. bei Nutzung des Google-Maps-Links, vgl. Abschnitt 08).",
      },
      {
        num: "05",
        title: "Speicherdauer",
        body: "Personendaten werden nur so lange aufbewahrt, wie es für den jeweiligen Zweck notwendig ist oder gesetzliche Aufbewahrungsfristen bestehen:\n\n- Behandlungsdokumentation: gemäss kantonalen und bundesrechtlichen Vorgaben *(in der Regel 10 Jahre)*\n- Terminbuchungen und Kontaktdaten: bis zum Ablauf der Geschäftsbeziehung, längstens nach Ablauf gesetzlicher Fristen\n- Server-Logfiles: in der Regel 30 Tage, danach automatische Löschung\n\nNach Ablauf der Aufbewahrungsfristen werden Daten sicher und unwiederbringlich gelöscht oder anonymisiert.",
      },
      {
        num: "06",
        title: "Ihre Rechte als betroffene Person",
        titleNote: "(Art. 25 DSG / Art. 15–22 DSGVO)",
        body: `Sie haben jederzeit folgende Rechte in Bezug auf Ihre Personendaten:\n\n- **Auskunft** – Welche Daten wir über Sie gespeichert haben *(Art. 25 DSG / Art. 15 DSGVO)*\n- **Berichtigung** – Unrichtige oder unvollständige Daten korrigieren lassen *(Art. 32 DSG / Art. 16 DSGVO)*\n- **Löschung** – Löschung Ihrer Daten verlangen, sofern keine gesetzliche Aufbewahrungspflicht besteht *(Art. 32 DSG / Art. 17 DSGVO)*\n- **Einschränkung** – Verarbeitung einschränken lassen *(Art. 18 DSGVO)*\n- **Widerspruch** – Der Datenverarbeitung widersprechen, soweit diese auf berechtigtem Interesse beruht *(Art. 21 DSGVO)*\n- **Datenübertragbarkeit** – Ihre Daten in einem gängigen Format erhalten *(Art. 20 DSGVO)*\n- **Widerruf der Einwilligung** – Eine erteilte Einwilligung jederzeit ohne Angabe von Gründen widerrufen\n\nZur Ausübung Ihrer Rechte wenden Sie sich an: [+41 79 469 77 91](${PHONE}) oder Beauty Palast – Andrea Teles, Brückenweg 3, 3930 Visp.\n\n> Zur Identitätsprüfung behalten wir uns vor, bei Auskunftsersuchen einen Identitätsnachweis zu verlangen.`,
      },
      {
        num: "07",
        title: "Cookies und Website-Technologien",
        body: "Diese Website verwendet **keine Tracking-Cookies**, keine Analyse-Tools von Drittanbietern (z. B. Google Analytics) und keine Social-Media-Plugins. Es werden ausschliesslich technisch notwendige Funktionen eingesetzt. Es werden keine Nutzerprofile erstellt und keine Daten an Werbenetzwerke übermittelt.\n\nEin Cookie-Banner ist aus diesem Grund nicht erforderlich.",
      },
      {
        num: "08",
        title: "Externer Link zu Google Maps",
        body: "Diese Website enthält einen externen Link zu Google Maps ([maps.google.com](https://maps.google.com)). Beim Anklicken verlassen Sie unsere Website und werden auf den Dienst von Google LLC, USA, weitergeleitet. Google kann dabei Ihre personenbezogenen Daten gemäss den eigenen Datenschutzbestimmungen verarbeiten.\n\nGoogle Maps wird nicht eingebettet – es handelt sich ausschliesslich um einen externen Verweislink. Wir haben keinen Einfluss auf die Datenverarbeitung durch Google. Weitere Informationen: [policies.google.com/privacy](https://policies.google.com/privacy)",
      },
      {
        num: "09",
        title: "Hosting und technischer Betrieb",
        body: "Diese Website wird über einen externen Hosting-Anbieter betrieben. Im Rahmen des technischen Betriebs werden automatisch Server-Logfiles erzeugt, die technische Zugriffsdaten enthalten (IP-Adresse, Zeitstempel, aufgerufene Seiten). Diese Daten dienen ausschliesslich der Betriebssicherheit und werden nicht personenbezogen ausgewertet.",
      },
      {
        num: "10",
        title: "Datensicherheit",
        titleNote: "(Art. 8 DSG)",
        body: "Wir treffen angemessene technische und organisatorische Massnahmen zum Schutz Ihrer Personendaten vor unbefugtem Zugriff, Verlust, Missbrauch oder Verfälschung. Die Datenübertragung auf dieser Website erfolgt verschlüsselt (HTTPS/TLS). Zugang zu Kundendaten haben ausschliesslich Personen, die diese für die Behandlung benötigen.",
      },
      {
        num: "11",
        title: "Automatisierte Entscheidungsfindung / Profiling",
        body: "Wir führen keine automatisierte Entscheidungsfindung und kein Profiling im Sinne von Art. 22 DSGVO bzw. Art. 21 DSG durch. Alle Entscheidungen im Rahmen der Behandlung erfolgen durch qualifiziertes Personal.",
      },
      {
        num: "12",
        title: "Beschwerderecht bei der Aufsichtsbehörde",
        body: "Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Bearbeitung Ihrer Personendaten gegen das anwendbare Datenschutzrecht verstösst.\n\n**Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)**\nFeldeggweg 1 · 3003 Bern, Schweiz\n[www.edoeb.admin.ch](https://www.edoeb.admin.ch)\n\nSofern Sie in der EU ansässig sind, steht Ihnen auch die zuständige Datenschutzbehörde Ihres Wohnsitzlandes offen.",
      },
      {
        num: "13",
        title: "Änderungen dieser Datenschutzerklärung",
        body: "Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen – etwa bei Änderungen der Rechtslage, der eingesetzten Technologien oder unseres Leistungsangebots. Die jeweils aktuelle Fassung mit Stand-Datum ist stets auf dieser Seite abrufbar.",
      },
      {
        variant: "note",
        body: "**Rechtsgrundlagen:** Diese Datenschutzerklärung basiert auf dem schweizerischen Bundesgesetz über den Datenschutz (DSG, revidierte Fassung in Kraft seit 1. September 2023) sowie auf der Europäischen Datenschutz-Grundverordnung (DSGVO, EU 2016/679), soweit diese anwendbar ist.",
      },
    ],
  },
];

/**
 * Inserts the legal pages if they are missing. Runs before the main seed's
 * "already seeded" early return, so an existing production database picks the
 * two new pages up on the next deploy — and never overwrites CMS edits.
 */
export async function seedLegalPages(prisma: PrismaClient) {
  for (const page of LEGAL_SEED) {
    if ((await prisma.legalPage.count({ where: { slug: page.slug } })) > 0) continue;

    await prisma.legalPage.create({
      data: {
        slug: page.slug,
        eyebrow: page.eyebrow,
        title: page.title,
        titleEm: page.titleEm ?? "",
        intro: page.intro,
        stand: page.stand,
        showToc: page.showToc,
        tocTitle: page.tocTitle ?? "Inhalt",
        ctaTitle: page.ctaTitle ?? "",
        ctaText: page.ctaText ?? "",
        ctaLabel: page.ctaLabel ?? "",
      },
    });

    for (let position = 0; position < page.sections.length; position++) {
      const section = page.sections[position];
      const created = await prisma.legalSection.create({
        data: {
          pageSlug: page.slug,
          num: section.num ?? "",
          title: section.title ?? "",
          titleNote: section.titleNote ?? "",
          body: section.body ?? "",
          variant: section.variant ?? "default",
          rowStyle: section.rowStyle ?? "table",
          cardBadge: section.cardBadge ?? "",
          cardTitle: section.cardTitle ?? "",
          cardSubtitle: section.cardSubtitle ?? "",
          position,
        },
      });

      if (section.rows?.length) {
        await prisma.legalRow.createMany({
          data: section.rows.map((row, rowPosition) => ({
            sectionId: created.id,
            label: row.label,
            value: row.value,
            position: rowPosition,
          })),
        });
      }
    }

    console.log(`Seeded legal page "${page.slug}".`);
  }
}
