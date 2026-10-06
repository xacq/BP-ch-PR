"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { SiteContent, SeoPageKey, LegalPage } from "@/lib/content";
import { type Lang, type TFn, makeTranslator, LANG_STORAGE_KEY } from "./i18n";
import DiplomaIcon, { DIPLOMA_ICONS, DIPLOMA_ICON_NAMES } from "@/components/icons/DiplomaIcon";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

// Local copy of the SEO page keys — importing the value from "@/lib/content"
// would drag the Prisma/DB module into this client bundle.
const SEO_PAGES: SeoPageKey[] = ["home", "leistungen", "ueber-andrea", "impressum", "datenschutz"];

type Status = { type: "idle" | "saving" | "saved" | "error"; message?: string };

// German source strings; translated at render time via t(). See ./i18n.ts.
const HEADING_LABELS: Record<string, string> = {
  home_services: "Startseite · Leistungen",
  home_process: "Startseite · Ablauf",
  home_testimonials: "Startseite · Kundenstimmen",
  home_faq: "Startseite · Häufige Fragen",
  gallery: "Alle Seiten · Galerie",
  home_contact: "Startseite · Kontakt",
  about_diplomas: "Über Andrea · Diplome",
  about_values: "Über Andrea · Werte",
  about_testimonials: "Über Andrea · Kundenstimmen",
  about_contact: "Über Andrea · Kontakt",
  services_contact: "Leistungen · Kontakt",
};

// The sidebar mirrors the live website: each group is a real page, each item
// is a content block that appears on that page (in top-to-bottom order).
// Labels/descriptions are the German source; t() localizes them.
type SectionId =
  | "hero" | "stats" | "brands" | "about" | "services" | "process"
  | "testimonialsHome" | "faq"
  | "servicesIntro" | "priceGroups"
  | "aboutPage" | "diplomas" | "values" | "testimonialsAbout"
  | "legalImpressum" | "legalDatenschutz"
  | "contact" | "contactVideos" | "gallery" | "headings" | "seo";

type NavGroup = {
  title: string;
  href?: string;
  // A section may point at its own page (the two legal pages do); otherwise the
  // "view on the website" link falls back to the group's href.
  sections: { id: SectionId; label: string; desc: string; href?: string }[];
};

const NAV: NavGroup[] = [
  {
    title: "Startseite",
    href: "/",
    sections: [
      { id: "hero", label: "Hero", desc: "Der grosse Bereich ganz oben – Titel, Untertitel und Telefonnummer." },
      { id: "stats", label: "Statistik-Leiste", desc: "Die dunkle Zahlen-Leiste direkt unter dem Hero." },
      { id: "brands", label: "Marken", desc: "Die Zeile mit den Markennamen." },
      { id: "about", label: "Über-uns-Block", desc: "Der Highlight-Abschnitt „Die perfekte Balance …“ mit den Merkmalen." },
      { id: "services", label: "Leistungen", desc: "Die sechs Behandlungs-Karten in der Vorschau." },
      { id: "process", label: "Ablauf", desc: "Die drei Schritte, wie ein Termin abläuft." },
      { id: "testimonialsHome", label: "Kundenstimmen", desc: "Die Bewertungen auf der Startseite." },
      { id: "faq", label: "Häufige Fragen", desc: "Die aufklappbaren Fragen und Antworten." },
    ],
  },
  {
    title: "Leistungen & Preise",
    href: "/leistungen",
    sections: [
      { id: "servicesIntro", label: "Einleitung", desc: "Titel und Text ganz oben auf der Preisseite." },
      { id: "priceGroups", label: "Preise", desc: "Alle Behandlungen mit Kategorien und Preisen." },
    ],
  },
  {
    title: "Über Andrea",
    href: "/ueber-andrea",
    sections: [
      { id: "aboutPage", label: "Vorstellung", desc: "Name, Rolle, Biografie und das Zitat." },
      { id: "diplomas", label: "Diplome", desc: "Zertifikate und Ausbildungen." },
      { id: "values", label: "Werte", desc: "Die drei Grundwerte." },
      { id: "testimonialsAbout", label: "Kundenstimmen", desc: "Die Bewertungen auf der Über-Andrea-Seite." },
    ],
  },
  {
    title: "Rechtliches",
    sections: [
      { id: "legalImpressum", label: "Impressum", desc: "Die Impressum-Seite – Betreiberin, Verantwortliche, Haftung und Urheberrecht.", href: "/impressum" },
      { id: "legalDatenschutz", label: "Datenschutzerklärung", desc: "Die Datenschutz-Seite – welche Daten bearbeitet werden, wie lange und welche Rechte Besucher haben.", href: "/datenschutz" },
    ],
  },
  {
    title: "Allgemein",
    sections: [
      { id: "contact", label: "Kontakt & Zeiten", desc: "Adresse, Telefon und Öffnungszeiten – erscheint im Footer und im Kontaktbereich." },
      { id: "contactVideos", label: "Videos (Anfahrt)", desc: "Zwei kurze Videos im Bereich „So finden Sie uns“ – erscheinen auf der Startseite und auf „Über Andrea“." },
      { id: "gallery", label: "Galerie", desc: "Fotos vom Studio – dieselben Bilder erscheinen auf der Startseite, auf „Leistungen & Preise“ und auf „Über Andrea“." },
      { id: "seo", label: "SEO & Marketing", desc: "Meta-Titel, Beschreibungen, Vorschaubild und Tracking-Codes (Google, Facebook)." },
      { id: "headings", label: "Abschnitt-Titel", desc: "Die kleinen Überschriften (Eyebrow + Titel) über jedem Bereich." },
    ],
  },
];

// Human labels for the per-page SEO overrides (German source; localized via t).
const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  home: "Startseite",
  leistungen: "Leistungen & Preise",
  "ueber-andrea": "Über Andrea",
  impressum: "Impressum",
  datenschutz: "Datenschutzerklärung",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [active, setActive] = useState<SectionId>("hero");
  const [dirty, setDirty] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("de");

  const t = makeTranslator(lang);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then(setContent)
      .catch(() => setStatus({ type: "error", message: "Inhalt konnte nicht geladen werden." }));
  }, []);

  // Restore the language preference on mount, and persist it on change.
  // Reading localStorage happens post-hydration (it isn't available during SSR),
  // so this one-time sync from an external store is intentional.
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "de" || saved === "en") setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const activeMeta = (() => {
    for (const group of NAV) {
      const section = group.sections.find((s) => s.id === active);
      if (section) return { group, section };
    }
    return { group: NAV[0], section: NAV[0].sections[0] };
  })();

  async function handleSave() {
    if (!content) return;
    setStatus({ type: "saving" });
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setDirty(false);
      setStatus({ type: "saved" });
      setTimeout(() => setStatus((s) => (s.type === "saved" ? { type: "idle" } : s)), 3000);
    } else {
      setStatus({ type: "error", message: "Speichern fehlgeschlagen." });
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function patch(updater: (draft: SiteContent) => SiteContent) {
    setDirty(true);
    setContent((prev) => (prev ? updater(structuredClone(prev)) : prev));
  }

  function goTo(id: SectionId) {
    setActive(id);
    setSidebarOpen(false);
    document.getElementById("cms-scroll")?.scrollTo({ top: 0 });
  }

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 rounded-full border-2 border-brand-sand border-t-transparent animate-spin" />
          <p className="text-brand-text-mid text-sm">{t("Inhalte werden geladen …")}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream text-brand-text">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 shrink-0 bg-brand-dark text-brand-white flex flex-col transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-heading text-lg leading-none">Beauty Palast</p>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-brand-sand mt-1.5">{t("Verwaltung")}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
          {NAV.map((group) => (
            <div key={group.title}>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
                  {t(group.title)}
                </span>
                {group.href && (
                  <a
                    href={group.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[0.65rem] text-white/40 hover:text-brand-sand transition-colors"
                  >
                    {t("ansehen")}
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <ul className="flex flex-col gap-0.5">
                {group.sections.map((section) => {
                  const isActive = section.id === active;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => goTo(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-brand-sand text-brand-dark font-medium"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t(section.label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
          <LangToggle lang={lang} onChange={setLang} />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            {t("Website ansehen")}
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            {t("Abmelden")}
          </button>
        </div>
      </aside>

      {/* RIGHT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="shrink-0 bg-brand-white/85 backdrop-blur border-b border-brand-cream-deep px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden shrink-0 h-9 w-9 rounded-lg border border-brand-cream-deep flex items-center justify-center text-brand-text"
              aria-label={t("Menü öffnen")}
            >
              ☰
            </button>
            <div className="min-w-0">
              <p className="text-[0.7rem] uppercase tracking-widest text-brand-text-light truncate">
                {t(activeMeta.group.title)}
              </p>
              <p className="text-sm font-medium text-brand-text truncate">{t(activeMeta.section.label)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <SaveState status={status} dirty={dirty} t={t} />
            <button
              onClick={handleSave}
              disabled={status.type === "saving" || !dirty}
              className="rounded-full bg-brand-dark text-brand-white px-5 py-2 text-sm hover:bg-brand-brown transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status.type === "saving" ? t("Speichern …") : t("Speichern")}
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div id="cms-scroll" className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-10">
            <div className="mb-6">
              <h1 className="font-heading text-2xl md:text-3xl text-brand-text">{t(activeMeta.section.label)}</h1>
              <p className="text-sm text-brand-text-mid mt-1.5 max-w-xl">{t(activeMeta.section.desc)}</p>
              {(activeMeta.section.href ?? activeMeta.group.href) && (
                <a
                  href={activeMeta.section.href ?? activeMeta.group.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline mt-2"
                >
                  {t("Auf der Website ansehen")}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="bg-brand-white rounded-2xl border border-brand-cream-deep shadow-sm p-5 md:p-7 flex flex-col gap-5">
              {renderSection(active, content, patch, t)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section forms
// ---------------------------------------------------------------------------

function renderSection(
  id: SectionId,
  content: SiteContent,
  patch: (updater: (draft: SiteContent) => SiteContent) => void,
  t: TFn,
) {
  switch (id) {
    case "hero":
      return (
        <>
          <Field label={t("Hero-Bild")}>
            <ImageField value={content.hero.imageUrl} onChange={(url) => patch((d) => { d.hero.imageUrl = url; return d; })} t={t} />
          </Field>
          <Field label={t("Tag (kleines Badge oben)")}>
            <TextInput value={content.hero.tag} onChange={(v) => patch((d) => { d.hero.tag = v; return d; })} />
          </Field>
          <Field label={t("Titel (Zeile 1)")}>
            <TextInput value={content.hero.titleLine} onChange={(v) => patch((d) => { d.hero.titleLine = v; return d; })} />
          </Field>
          <Field label={t("Titel (Akzent, kursiv hervorgehoben)")}>
            <TextInput value={content.hero.titleEm} onChange={(v) => patch((d) => { d.hero.titleEm = v; return d; })} />
          </Field>
          <Field label={t("Untertitel")}>
            <TextArea value={content.hero.subtitle} onChange={(v) => patch((d) => { d.hero.subtitle = v; return d; })} />
          </Field>
          <Field label={t("Telefonnummer (für den Anruf-Button)")}>
            <TextInput value={content.hero.ctaPhone} onChange={(v) => patch((d) => { d.hero.ctaPhone = v; return d; })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("Button 1 (Text)")}>
              <TextInput value={content.hero.ctaPrimaryLabel} onChange={(v) => patch((d) => { d.hero.ctaPrimaryLabel = v; return d; })} />
            </Field>
            <Field label={t("Button 2 (Text)")}>
              <TextInput value={content.hero.ctaSecondaryLabel} onChange={(v) => patch((d) => { d.hero.ctaSecondaryLabel = v; return d; })} />
            </Field>
          </div>
          <Field label={t("Badges (Stichworte unter den Buttons)")}>
            <ListEditor
              t={t}
              items={content.hero.badges.map((value) => ({ value }))}
              onChange={(items) => patch((d) => { d.hero.badges = items.map((i) => i.value); return d; })}
              newItem={() => ({ value: "" })}
              addLabel={t("Badge hinzufügen")}
              renderItem={(item, onChange) => (
                <TextInput placeholder={t("z. B. 15+ Jahre Erfahrung")} value={item.value} onChange={(v) => onChange({ value: v })} />
              )}
            />
          </Field>
          <Field label={t("Statistik-Karte (schwebt über dem Hero-Bild)")}>
            <ListEditor
              t={t}
              items={content.hero.stats}
              onChange={(stats) => patch((d) => { d.hero.stats = stats; return d; })}
              newItem={() => ({ num: "", label: "" })}
              addLabel={t("Zahl hinzufügen")}
              renderItem={(item, onChange) => (
                <div className="grid grid-cols-2 gap-3">
                  <TextInput placeholder={t("Zahl")} value={item.num} onChange={(v) => onChange({ ...item, num: v })} />
                  <TextInput placeholder={t("Beschriftung")} value={item.label} onChange={(v) => onChange({ ...item, label: v })} />
                </div>
              )}
            />
          </Field>
        </>
      );

    case "stats":
      return (
        <ListEditor
          t={t}
          items={content.stats}
          onChange={(stats) => patch((d) => { d.stats = stats; return d; })}
          newItem={() => ({ num: "", label: "" })}
          addLabel={t("Zahl hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="grid grid-cols-2 gap-3">
              <TextInput placeholder={t("Zahl")} value={item.num} onChange={(v) => onChange({ ...item, num: v })} />
              <TextInput placeholder={t("Beschriftung")} value={item.label} onChange={(v) => onChange({ ...item, label: v })} />
            </div>
          )}
        />
      );

    case "brands":
      return (
        <ListEditor
          t={t}
          items={content.brands.map((value) => ({ value }))}
          onChange={(items) => patch((d) => { d.brands = items.map((i) => i.value); return d; })}
          newItem={() => ({ value: "" })}
          addLabel={t("Marke hinzufügen")}
          renderItem={(item, onChange) => (
            <TextInput placeholder={t("Markenname")} value={item.value} onChange={(v) => onChange({ value: v })} />
          )}
        />
      );

    case "about":
      return (
        <>
          <Field label={t("Bild")}>
            <ImageField value={content.about.imageUrl} onChange={(url) => patch((d) => { d.about.imageUrl = url; return d; })} t={t} />
          </Field>
          <Field label={t("Tag (kleines Badge)")}>
            <TextInput value={content.about.tag} onChange={(v) => patch((d) => { d.about.tag = v; return d; })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("Titel-Anfang")}><TextInput value={content.about.titlePrefix} onChange={(v) => patch((d) => { d.about.titlePrefix = v; return d; })} /></Field>
            <Field label={t("Titel-Mitte")}><TextInput value={content.about.titleMid} onChange={(v) => patch((d) => { d.about.titleMid = v; return d; })} /></Field>
            <Field label={t("Akzent 1 (kursiv)")}><TextInput value={content.about.titleEm1} onChange={(v) => patch((d) => { d.about.titleEm1 = v; return d; })} /></Field>
            <Field label={t("Akzent 2 (kursiv)")}><TextInput value={content.about.titleEm2} onChange={(v) => patch((d) => { d.about.titleEm2 = v; return d; })} /></Field>
          </div>
          <Field label={t("Text")}>
            <TextArea value={content.about.text} onChange={(v) => patch((d) => { d.about.text = v; return d; })} />
          </Field>
          <Field label={t("Merkmale (Aufzählung)")}>
            <ListEditor
              t={t}
              items={content.about.features.map((value) => ({ value }))}
              onChange={(items) => patch((d) => { d.about.features = items.map((i) => i.value); return d; })}
              newItem={() => ({ value: "" })}
              addLabel={t("Merkmal hinzufügen")}
              renderItem={(item, onChange) => (
                <TextInput placeholder={t("Merkmal")} value={item.value} onChange={(v) => onChange({ value: v })} />
              )}
            />
          </Field>
        </>
      );

    case "services":
      return (
        <ListEditor
          t={t}
          items={content.services}
          onChange={(services) => patch((d) => { d.services = services; return d; })}
          newItem={() => ({ title: "", description: "", popular: false, imageUrl: "" })}
          addLabel={t("Leistung hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <ImageField value={item.imageUrl} onChange={(url) => onChange({ ...item, imageUrl: url })} t={t} />
              <TextInput placeholder={t("Titel")} value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
              <TextArea placeholder={t("Beschreibung")} value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
              <label className="flex items-center gap-2 text-sm text-brand-text-mid">
                <input type="checkbox" checked={item.popular} onChange={(e) => onChange({ ...item, popular: e.target.checked })} />
                {t("Als „Beliebteste“ markieren")}
              </label>
            </div>
          )}
        />
      );

    case "process":
      return (
        <ListEditor
          t={t}
          items={content.process}
          onChange={(process) => patch((d) => { d.process = process; return d; })}
          newItem={() => ({ stepLabel: "", title: "", titleEm: "", text: "" })}
          addLabel={t("Schritt hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <TextInput placeholder={t("Schritt-Label (z. B. Schritt 1)")} value={item.stepLabel} onChange={(v) => onChange({ ...item, stepLabel: v })} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput placeholder={t("Titel")} value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
                <TextInput placeholder={t("Akzent (kursiv)")} value={item.titleEm} onChange={(v) => onChange({ ...item, titleEm: v })} />
              </div>
              <TextArea placeholder={t("Text")} value={item.text} onChange={(v) => onChange({ ...item, text: v })} />
            </div>
          )}
        />
      );

    case "testimonialsHome":
      return (
        <TestimonialEditor
          t={t}
          items={content.testimonialsHome}
          onChange={(items) => patch((d) => { d.testimonialsHome = items; return d; })}
        />
      );

    case "faq":
      return (
        <ListEditor
          t={t}
          items={content.faq}
          onChange={(faq) => patch((d) => { d.faq = faq; return d; })}
          newItem={() => ({ question: "", answer: "" })}
          addLabel={t("Frage hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <TextInput placeholder={t("Frage")} value={item.question} onChange={(v) => onChange({ ...item, question: v })} />
              <TextArea placeholder={t("Antwort")} value={item.answer} onChange={(v) => onChange({ ...item, answer: v })} />
            </div>
          )}
        />
      );

    case "servicesIntro":
      return (
        <>
          <Field label={t("Eyebrow (kleine Überschrift)")}><TextInput value={content.servicesIntro.eyebrow} onChange={(v) => patch((d) => { d.servicesIntro.eyebrow = v; return d; })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("Titel")}><TextInput value={content.servicesIntro.titleLead} onChange={(v) => patch((d) => { d.servicesIntro.titleLead = v; return d; })} /></Field>
            <Field label={t("Titel (Akzent, kursiv)")}><TextInput value={content.servicesIntro.titleEm} onChange={(v) => patch((d) => { d.servicesIntro.titleEm = v; return d; })} /></Field>
          </div>
          <Field label={t("Beschreibung")}><TextArea value={content.servicesIntro.description} onChange={(v) => patch((d) => { d.servicesIntro.description = v; return d; })} /></Field>
          <Field label={t("Bild (Hero)")}>
            <ImageField value={content.servicesIntro.imageUrl} onChange={(url) => patch((d) => { d.servicesIntro.imageUrl = url; return d; })} t={t} />
          </Field>
        </>
      );

    case "priceGroups":
      return (
        <ListEditor
          t={t}
          items={content.priceGroups}
          onChange={(groups) => patch((d) => { d.priceGroups = groups; return d; })}
          newItem={() => ({ title: "", titleEm: "", description: "", note: "", imageUrl: "", items: [] })}
          addLabel={t("Preisgruppe hinzufügen")}
          renderItem={(group, onChange) => (
            <div className="flex flex-col gap-3">
              <ImageField value={group.imageUrl} onChange={(url) => onChange({ ...group, imageUrl: url })} t={t} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput placeholder={t("Titel (z. B. Kosmetik)")} value={group.title} onChange={(v) => onChange({ ...group, title: v })} />
                <TextInput placeholder={t("Titel-Akzent (kursiv)")} value={group.titleEm} onChange={(v) => onChange({ ...group, titleEm: v })} />
              </div>
              <TextArea placeholder={t("Beschreibung")} value={group.description} onChange={(v) => onChange({ ...group, description: v })} />
              <TextInput placeholder={t("Hinweis (optional, z. B. Angebot)")} value={group.note} onChange={(v) => onChange({ ...group, note: v })} />
              <div className="mt-1 rounded-xl bg-brand-cream/60 border border-brand-cream-deep p-3">
                <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-brand-text-light mb-2">
                  {t("Preis-Positionen")}
                </span>
                <ListEditor
                  t={t}
                  items={group.items}
                  onChange={(items) => onChange({ ...group, items })}
                  newItem={() => ({ category: "", label: "", price: "" })}
                  addLabel={t("Position hinzufügen")}
                  tone="white"
                  renderItem={(item, onItem) => (
                    <div className="flex flex-col gap-2">
                      <TextInput placeholder={t("Kategorie (optional)")} value={item.category} onChange={(v) => onItem({ ...item, category: v })} />
                      <div className="grid grid-cols-[1fr_110px] gap-3">
                        <TextInput placeholder={t("Bezeichnung")} value={item.label} onChange={(v) => onItem({ ...item, label: v })} />
                        <TextInput placeholder={t("Preis")} value={item.price} onChange={(v) => onItem({ ...item, price: v })} />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
      );

    case "aboutPage":
      return (
        <>
          <Field label={t("Porträtfoto")}>
            <ImageField value={content.aboutPage.imageUrl} onChange={(url) => patch((d) => { d.aboutPage.imageUrl = url; return d; })} t={t} />
          </Field>
          <Field label={t("Eyebrow (kleine Überschrift)")}><TextInput value={content.aboutPage.eyebrow} onChange={(v) => patch((d) => { d.aboutPage.eyebrow = v; return d; })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("Name")}><TextInput value={content.aboutPage.name} onChange={(v) => patch((d) => { d.aboutPage.name = v; return d; })} /></Field>
            <Field label={t("Name (Akzent, kursiv)")}><TextInput value={content.aboutPage.nameEm} onChange={(v) => patch((d) => { d.aboutPage.nameEm = v; return d; })} /></Field>
          </div>
          <Field label={t("Rolle")}><TextInput value={content.aboutPage.role} onChange={(v) => patch((d) => { d.aboutPage.role = v; return d; })} /></Field>
          <Field label={t("Biografie – Absatz 1")}><TextArea value={content.aboutPage.bio1} onChange={(v) => patch((d) => { d.aboutPage.bio1 = v; return d; })} /></Field>
          <Field label={t("Biografie – Absatz 2")}><TextArea value={content.aboutPage.bio2} onChange={(v) => patch((d) => { d.aboutPage.bio2 = v; return d; })} /></Field>
          <Field label={t("Zitat")}><TextArea value={content.aboutPage.quote} onChange={(v) => patch((d) => { d.aboutPage.quote = v; return d; })} /></Field>
        </>
      );

    case "diplomas":
      return (
        <ListEditor
          t={t}
          items={content.diplomas}
          onChange={(diplomas) => patch((d) => { d.diplomas = diplomas; return d; })}
          newItem={() => ({ icon: "sparkle", title: "", school: "" })}
          addLabel={t("Diplom hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <Field label={t("Symbol")}>
                <IconPicker value={item.icon} onChange={(icon) => onChange({ ...item, icon })} t={t} />
              </Field>
              <TextInput placeholder={t("Titel")} value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
              <TextInput placeholder={t("Schule / Institut")} value={item.school} onChange={(v) => onChange({ ...item, school: v })} />
            </div>
          )}
        />
      );

    case "contactVideos":
      return (
        <ListEditor
          t={t}
          items={content.contact.videos}
          onChange={(videos) => patch((d) => { d.contact.videos = videos; return d; })}
          newItem={() => ({ title: "", videoUrl: "", posterUrl: "" })}
          addLabel={t("Video hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-3">
              <TextInput placeholder={t("Titel (z. B. Anfahrt mit dem Auto)")} value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
              <Field label={t("Video")}>
                <VideoField value={item.videoUrl} onChange={(url) => onChange({ ...item, videoUrl: url })} t={t} />
              </Field>
              <Field label={t("Vorschaubild (optional)")}>
                <ImageField value={item.posterUrl} onChange={(url) => onChange({ ...item, posterUrl: url })} t={t} />
              </Field>
            </div>
          )}
        />
      );

    case "gallery":
      return (
        <ListEditor
          t={t}
          items={content.gallery}
          onChange={(gallery) => patch((d) => { d.gallery = gallery; return d; })}
          newItem={() => ({ imageUrl: "", alt: "", caption: "" })}
          addLabel={t("Bild hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <ImageField value={item.imageUrl} onChange={(url) => onChange({ ...item, imageUrl: url })} t={t} />
              <TextInput placeholder={t("Bildbeschreibung (für Google & Screenreader)")} value={item.alt} onChange={(v) => onChange({ ...item, alt: v })} />
              <TextInput placeholder={t("Bildunterschrift (optional)")} value={item.caption} onChange={(v) => onChange({ ...item, caption: v })} />
            </div>
          )}
        />
      );

    case "values":
      return (
        <ListEditor
          t={t}
          items={content.values}
          onChange={(values) => patch((d) => { d.values = values; return d; })}
          newItem={() => ({ num: "", title: "", text: "" })}
          addLabel={t("Wert hinzufügen")}
          renderItem={(item, onChange) => (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <TextInput placeholder={t("Nr.")} value={item.num} onChange={(v) => onChange({ ...item, num: v })} />
                <TextInput placeholder={t("Titel")} value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
              </div>
              <TextArea placeholder={t("Text")} value={item.text} onChange={(v) => onChange({ ...item, text: v })} />
            </div>
          )}
        />
      );

    case "testimonialsAbout":
      return (
        <TestimonialEditor
          t={t}
          items={content.testimonialsAbout}
          onChange={(items) => patch((d) => { d.testimonialsAbout = items; return d; })}
        />
      );

    case "legalImpressum":
      return (
        <LegalEditor
          t={t}
          page={content.legal.impressum}
          onChange={(page) => patch((d) => { d.legal.impressum = page; return d; })}
        />
      );

    case "legalDatenschutz":
      return (
        <LegalEditor
          t={t}
          page={content.legal.datenschutz}
          onChange={(page) => patch((d) => { d.legal.datenschutz = page; return d; })}
        />
      );

    case "contact":
      return (
        <>
          <Field label={t("Logo")}>
            <ImageField value={content.contact.logoUrl} onChange={(url) => patch((d) => { d.contact.logoUrl = url; return d; })} t={t} />
            <p className="text-xs text-brand-text-light mt-1.5">{t("Erscheint oben im Menü (heller Hintergrund). Ohne Logo wird der Firmenname als Text angezeigt.")}</p>
          </Field>
          <Field label={t("Logo (weiss, für dunklen Hintergrund)")}>
            <ImageField value={content.contact.logoWhiteUrl} onChange={(url) => patch((d) => { d.contact.logoWhiteUrl = url; return d; })} t={t} />
            <p className="text-xs text-brand-text-light mt-1.5">{t("Erscheint im Footer (dunkler Hintergrund). Ohne weisses Logo wird dort der Firmenname als Text angezeigt.")}</p>
          </Field>
          <label className="flex items-center gap-2 text-sm text-brand-text-mid">
            <input
              type="checkbox"
              checked={content.contact.showBusinessName}
              onChange={(e) => patch((d) => { d.contact.showBusinessName = e.target.checked; return d; })}
            />
            {t("Firmenname neben dem Logo anzeigen")}
          </label>
          <Field label={t("Firmenname")}><TextInput value={content.contact.businessName} onChange={(v) => patch((d) => { d.contact.businessName = v; return d; })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("Telefon (zum Anrufen)")}><TextInput value={content.contact.phone} onChange={(v) => patch((d) => { d.contact.phone = v; return d; })} /></Field>
            <Field label={t("Telefon (angezeigt)")}><TextInput value={content.contact.phoneDisplay} onChange={(v) => patch((d) => { d.contact.phoneDisplay = v; return d; })} /></Field>
          </div>
          <Field label={t("Adresse – Zeile 1")}><TextInput value={content.contact.addressLine1} onChange={(v) => patch((d) => { d.contact.addressLine1 = v; return d; })} /></Field>
          <Field label={t("Adresse – Zeile 2")}><TextInput value={content.contact.addressLine2} onChange={(v) => patch((d) => { d.contact.addressLine2 = v; return d; })} /></Field>
          <Field label={t("Google-Maps-Link")}><TextInput value={content.contact.mapUrl} onChange={(v) => patch((d) => { d.contact.mapUrl = v; return d; })} /></Field>
          <SubHeader>{t("Soziale Netzwerke")}</SubHeader>
          <p className="text-xs text-brand-text-light -mt-1">
            {t("Leer lassen, wenn es kein Profil gibt – dann wird das Symbol im Footer nicht angezeigt.")}
          </p>
          <Field label="Instagram"><TextInput placeholder="https://www.instagram.com/…" value={content.contact.instagramUrl} onChange={(v) => patch((d) => { d.contact.instagramUrl = v; return d; })} /></Field>
          <Field label="Facebook"><TextInput placeholder="https://www.facebook.com/…" value={content.contact.facebookUrl} onChange={(v) => patch((d) => { d.contact.facebookUrl = v; return d; })} /></Field>
          <Field label="TikTok"><TextInput placeholder="https://www.tiktok.com/@…" value={content.contact.tiktokUrl} onChange={(v) => patch((d) => { d.contact.tiktokUrl = v; return d; })} /></Field>
          <Field label={t("Öffnungszeiten")}>
            <ListEditor
              t={t}
              items={content.contact.hours}
              onChange={(hours) => patch((d) => { d.contact.hours = hours; return d; })}
              newItem={() => ({ days: "", time: "" })}
              addLabel={t("Zeit hinzufügen")}
              renderItem={(item, onChange) => (
                <div className="grid grid-cols-2 gap-3">
                  <TextInput placeholder={t("Tage (z. B. Mo–Fr)")} value={item.days} onChange={(v) => onChange({ ...item, days: v })} />
                  <TextInput placeholder={t("Uhrzeit")} value={item.time} onChange={(v) => onChange({ ...item, time: v })} />
                </div>
              )}
            />
          </Field>
        </>
      );

    case "seo":
      return (
        <>
          <SubHeader>{t("Grundeinstellungen")}</SubHeader>
          <Field label={t("Website-URL")}>
            <TextInput placeholder={t("z. B. https://beauty-palast.ch")} value={content.seo.siteUrl} onChange={(v) => patch((d) => { d.seo.siteUrl = v; return d; })} />
          </Field>
          <Field label={t("Standard-Titel (Fallback)")}>
            <TextInput value={content.seo.defaultTitle} onChange={(v) => patch((d) => { d.seo.defaultTitle = v; return d; })} />
          </Field>
          <Field label={t("Titel-Vorlage (%s = Seitentitel)")}>
            <TextInput value={content.seo.titleTemplate} onChange={(v) => patch((d) => { d.seo.titleTemplate = v; return d; })} />
          </Field>
          <Field label={t("Standard-Beschreibung")}>
            <TextArea value={content.seo.defaultDescription} onChange={(v) => patch((d) => { d.seo.defaultDescription = v; return d; })} />
          </Field>
          <Field label={t("Vorschaubild (Social Media / Open Graph)")}>
            <ImageField value={content.seo.ogImageUrl} onChange={(url) => patch((d) => { d.seo.ogImageUrl = url; return d; })} t={t} />
            <p className="text-xs text-brand-text-light mt-1.5">{t("Wird als OG-Bild geteilt, wenn ein Link auf WhatsApp, Facebook oder Instagram gepostet wird.")}</p>
          </Field>

          <SubHeader>{t("Seiten-Titel & Beschreibung")}</SubHeader>
          <p className="text-xs text-brand-text-light -mt-2">{t("Erscheint im Browser-Tab und als Titel in den Google-Suchergebnissen.")}</p>
          {SEO_PAGES.map((page) => (
            <div key={page} className="rounded-xl bg-brand-cream/60 border border-brand-cream-deep p-4">
              <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-brand-text-light mb-2.5">
                {t(SEO_PAGE_LABELS[page])}
              </span>
              <div className="flex flex-col gap-2.5">
                <TextInput placeholder={t("Meta-Titel")} value={content.pageSeo[page].title} onChange={(v) => patch((d) => { d.pageSeo[page].title = v; return d; })} />
                <TextArea placeholder={t("Meta-Beschreibung")} value={content.pageSeo[page].description} onChange={(v) => patch((d) => { d.pageSeo[page].description = v; return d; })} />
              </div>
            </div>
          ))}

          <SubHeader>{t("Tracking & Verifizierung")}</SubHeader>
          <Field label={t("Google Analytics ID (G-XXXXXXX)")}>
            <TextInput placeholder="G-XXXXXXX" value={content.seo.gaMeasurementId} onChange={(v) => patch((d) => { d.seo.gaMeasurementId = v; return d; })} />
          </Field>
          <Field label={t("Google Tag Manager ID (GTM-XXXXXX)")}>
            <TextInput placeholder="GTM-XXXXXX" value={content.seo.gtmContainerId} onChange={(v) => patch((d) => { d.seo.gtmContainerId = v; return d; })} />
          </Field>
          <Field label={t("Meta / Facebook Pixel ID")}>
            <TextInput value={content.seo.metaPixelId} onChange={(v) => patch((d) => { d.seo.metaPixelId = v; return d; })} />
          </Field>
          <Field label={t("Google Search Console Bestätigungs-Code")}>
            <TextInput value={content.seo.googleSiteVerification} onChange={(v) => patch((d) => { d.seo.googleSiteVerification = v; return d; })} />
          </Field>
        </>
      );

    case "headings":
      return (
        <div className="flex flex-col gap-3">
          {Object.entries(content.headings).map(([key, h]) => (
            <div key={key} className="rounded-xl bg-brand-cream/60 border border-brand-cream-deep p-4">
              <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-brand-text-light mb-2.5">
                {t(HEADING_LABELS[key] ?? key)}
              </span>
              <div className="flex flex-col gap-2.5">
                <TextInput placeholder={t("Eyebrow")} value={h.eyebrow} onChange={(v) => patch((d) => { d.headings[key].eyebrow = v; return d; })} />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput placeholder={t("Titel")} value={h.titleLead} onChange={(v) => patch((d) => { d.headings[key].titleLead = v; return d; })} />
                  <TextInput placeholder={t("Akzent (kursiv)")} value={h.titleEm} onChange={(v) => patch((d) => { d.headings[key].titleEm = v; return d; })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Legal pages (Impressum / Datenschutzerklärung)
// ---------------------------------------------------------------------------

const LEGAL_VARIANTS = [
  { value: "default", label: "Normaler Abschnitt" },
  { value: "card", label: "Abschnitt mit Karte (z. B. Agentur)" },
  { value: "note", label: "Hinweis-Box (ohne Nummer)" },
];

const LEGAL_ROW_STYLES = [
  { value: "table", label: "Tabelle (Bezeichnung / Wert)" },
  { value: "cards", label: "Karten (Titel + Text)" },
];

/**
 * Editor for one legal page. Both pages share the same shape, so the sidebar
 * simply points this at content.legal.impressum or content.legal.datenschutz.
 */
function LegalEditor({
  page,
  onChange,
  t,
}: {
  page: LegalPage;
  onChange: (page: LegalPage) => void;
  t: TFn;
}) {
  const set = (changes: Partial<LegalPage>) => onChange({ ...page, ...changes });

  return (
    <>
      <SubHeader>{t("Kopfbereich")}</SubHeader>
      <Field label={t("Eyebrow (kleine Überschrift)")}>
        <TextInput value={page.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("Titel")}>
          <TextInput value={page.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field label={t("Titel (Akzent, kursiv)")}>
          <TextInput value={page.titleEm} onChange={(v) => set({ titleEm: v })} />
        </Field>
      </div>
      <Field label={t("Einleitung")}>
        <TextArea value={page.intro} onChange={(v) => set({ intro: v })} />
        <FormatHint t={t} />
      </Field>
      <Field label={t("Stand / Datum")}>
        <TextInput placeholder={t("z. B. Stand: 2025")} value={page.stand} onChange={(v) => set({ stand: v })} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-brand-text-mid">
        <input
          type="checkbox"
          checked={page.showToc}
          onChange={(e) => set({ showToc: e.target.checked })}
        />
        {t("Inhaltsverzeichnis oben anzeigen")}
      </label>
      {page.showToc && (
        <Field label={t("Überschrift des Inhaltsverzeichnisses")}>
          <TextInput value={page.tocTitle} onChange={(v) => set({ tocTitle: v })} />
        </Field>
      )}

      <SubHeader>{t("Abschnitte")}</SubHeader>
      <ListEditor
        t={t}
        items={page.sections}
        onChange={(sections) => set({ sections })}
        newItem={() => ({
          num: "",
          title: "",
          titleNote: "",
          body: "",
          variant: "default",
          rowStyle: "table",
          cardBadge: "",
          cardTitle: "",
          cardSubtitle: "",
          rows: [],
        })}
        addLabel={t("Abschnitt hinzufügen")}
        renderItem={(section, onSection) => (
          <div className="flex flex-col gap-3">
            <Field label={t("Art des Abschnitts")}>
              <SelectInput
                value={section.variant}
                options={LEGAL_VARIANTS}
                onChange={(v) => onSection({ ...section, variant: v })}
                t={t}
              />
            </Field>
            {section.variant !== "note" && (
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <TextInput placeholder={t("Nr.")} value={section.num} onChange={(v) => onSection({ ...section, num: v })} />
                <TextInput placeholder={t("Titel")} value={section.title} onChange={(v) => onSection({ ...section, title: v })} />
              </div>
            )}
            {section.variant === "note" && (
              <TextInput placeholder={t("Titel (optional)")} value={section.title} onChange={(v) => onSection({ ...section, title: v })} />
            )}
            {section.variant !== "note" && (
              <TextInput
                placeholder={t("Zusatz neben dem Titel (z. B. (Art. 19 DSG))")}
                value={section.titleNote}
                onChange={(v) => onSection({ ...section, titleNote: v })}
              />
            )}
            <TextArea
              placeholder={t("Text")}
              rows={6}
              value={section.body}
              onChange={(v) => onSection({ ...section, body: v })}
            />
            <FormatHint t={t} />

            {section.variant === "card" && (
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <TextInput placeholder={t("Kürzel")} value={section.cardBadge} onChange={(v) => onSection({ ...section, cardBadge: v })} />
                <div className="flex flex-col gap-3">
                  <TextInput placeholder={t("Name auf der Karte")} value={section.cardTitle} onChange={(v) => onSection({ ...section, cardTitle: v })} />
                  <TextInput placeholder={t("Untertitel der Karte")} value={section.cardSubtitle} onChange={(v) => onSection({ ...section, cardSubtitle: v })} />
                </div>
              </div>
            )}

            {section.variant !== "note" && (
              <div className="mt-1 rounded-xl bg-brand-white border border-brand-cream-deep p-3">
                <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-brand-text-light mb-2">
                  {t("Angaben (Bezeichnung / Wert)")}
                </span>
                <div className="mb-3">
                  <SelectInput
                    value={section.rowStyle}
                    options={LEGAL_ROW_STYLES}
                    onChange={(v) => onSection({ ...section, rowStyle: v })}
                    t={t}
                  />
                </div>
                <ListEditor
                  t={t}
                  items={section.rows}
                  onChange={(rows) => onSection({ ...section, rows })}
                  newItem={() => ({ label: "", value: "" })}
                  addLabel={t("Angabe hinzufügen")}
                  renderItem={(row, onRow) => (
                    <div className="flex flex-col gap-2">
                      <TextInput placeholder={t("Bezeichnung (z. B. Adresse)")} value={row.label} onChange={(v) => onRow({ ...row, label: v })} />
                      <TextArea placeholder={t("Wert")} rows={2} value={row.value} onChange={(v) => onRow({ ...row, value: v })} />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}
      />

      <SubHeader>{t("Kontakt-Box am Seitenende")}</SubHeader>
      <p className="text-xs text-brand-text-light -mt-2">
        {t("Bleibt der Text leer, wird die Box nicht angezeigt. Der Button ruft die Telefonnummer aus „Kontakt & Zeiten“ an.")}
      </p>
      <Field label={t("Titel")}>
        <TextInput value={page.ctaTitle} onChange={(v) => set({ ctaTitle: v })} />
      </Field>
      <Field label={t("Text")}>
        <TextArea value={page.ctaText} onChange={(v) => set({ ctaText: v })} />
        <FormatHint t={t} />
      </Field>
      <Field label={t("Button-Text")}>
        <TextInput value={page.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
      </Field>
    </>
  );
}

/** Cheat sheet for the light text format the legal pages accept. */
function FormatHint({ t }: { t: TFn }) {
  return (
    <p className="text-xs text-brand-text-light mt-1.5 leading-relaxed">
      {t("Formatierung: Leerzeile = neuer Absatz · „- “ am Zeilenanfang = Aufzählung · „> “ = kleiner Hinweis · **fett** · *kursiv* · [Text](https://… oder tel:+41…)")}
    </p>
  );
}

function SelectInput({
  value,
  options,
  onChange,
  t,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  t: TFn;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-brand-cream-deep bg-brand-white px-3.5 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/25"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.label)}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
      {(["de", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`flex-1 py-1.5 rounded-md text-xs uppercase tracking-wider transition-colors ${
            lang === l ? "bg-brand-sand text-brand-dark font-medium" : "text-white/60 hover:bg-white/10"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function SaveState({ status, dirty, t }: { status: Status; dirty: boolean; t: TFn }) {
  if (status.type === "error") {
    return <span className="text-xs text-red-600">{t(status.message ?? "Speichern fehlgeschlagen.")}</span>;
  }
  if (status.type === "saved") {
    return (
      <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> {t("Gespeichert")}
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="hidden sm:flex items-center gap-1.5 text-xs text-brand-text-mid">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-sand-dark" /> {t("Nicht gespeichert")}
      </span>
    );
  }
  return (
    <span className="hidden sm:flex items-center gap-1.5 text-xs text-brand-text-light">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-cream-deep" /> {t("Aktuell")}
    </span>
  );
}

// Picks the icon for a diploma card. A visual grid beats a <select> here: the
// client recognises the glyph, not the key we store in the database.
function IconPicker({ value, onChange, t }: { value: string; onChange: (v: string) => void; t: TFn }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DIPLOMA_ICON_NAMES.map((name) => {
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-pressed={selected}
            title={t(DIPLOMA_ICONS[name].label)}
            className={`h-10 w-10 rounded-full border flex items-center justify-center transition-colors ${
              selected
                ? "border-brand-sand bg-brand-sand/15 text-brand-accent"
                : "border-brand-cream-deep text-brand-text-mid hover:border-brand-sand"
            }`}
          >
            <DiplomaIcon name={name} className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}

function TestimonialEditor({
  items,
  onChange,
  t,
}: {
  items: { text: string; name: string; service: string }[];
  onChange: (items: { text: string; name: string; service: string }[]) => void;
  t: TFn;
}) {
  return (
    <ListEditor
      t={t}
      items={items}
      onChange={onChange}
      newItem={() => ({ text: "", name: "", service: "" })}
      addLabel={t("Kundenstimme hinzufügen")}
      renderItem={(item, onItem) => (
        <div className="flex flex-col gap-2.5">
          <TextArea placeholder={t("Zitat")} value={item.text} onChange={(v) => onItem({ ...item, text: v })} />
          <div className="grid grid-cols-2 gap-3">
            <TextInput placeholder={t("Name")} value={item.name} onChange={(v) => onItem({ ...item, name: v })} />
            <TextInput placeholder={t("Leistung")} value={item.service} onChange={(v) => onItem({ ...item, service: v })} />
          </div>
        </div>
      )}
    />
  );
}

function ImageField({
  value,
  onChange,
  t,
}: {
  value: string;
  onChange: (url: string) => void;
  t: TFn;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? t("Bild konnte nicht hochgeladen werden."));
      }
    } catch {
      setError(t("Bild konnte nicht hochgeladen werden."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-brand-cream-deep bg-brand-cream">
          <Image src={value} alt="" fill unoptimized className="object-cover" sizes="80px" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-20 w-20 shrink-0 rounded-lg border border-dashed border-brand-sand text-brand-accent flex items-center justify-center text-2xl hover:bg-brand-sand/10 transition-colors"
          aria-label={t("Bild hochladen")}
        >
          +
        </button>
      )}

      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-brand-cream-deep px-4 py-1.5 text-sm text-brand-text hover:border-brand-sand transition-colors disabled:opacity-50"
          >
            {uploading ? t("Wird hochgeladen …") : value ? t("Bild ändern") : t("Bild hochladen")}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full px-3 py-1.5 text-sm text-brand-text-light hover:text-red-600 transition-colors"
            >
              {t("Bild entfernen")}
            </button>
          )}
        </div>
        {error ? (
          <span className="text-xs text-red-600">{error}</span>
        ) : (
          <span className="text-xs text-brand-text-light">{t("JPG, PNG, WebP oder GIF · max. 5 MB")}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Video counterpart to ImageField. Uses XMLHttpRequest instead of fetch purely
 * for `upload.onprogress`: a 90 MB MP4 takes long enough that a silent spinner
 * reads as a frozen page.
 */
function VideoField({
  value,
  onChange,
  t,
}: {
  value: string;
  onChange: (url: string) => void;
  t: TFn;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setProgress(0);

    const body = new FormData();
    body.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/videos");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      setProgress(null);
      if (request.status >= 200 && request.status < 300) {
        try {
          onChange(JSON.parse(request.responseText).url);
          return;
        } catch {
          /* falls through to the generic error below */
        }
      }
      let message = t("Video konnte nicht hochgeladen werden.");
      try {
        message = JSON.parse(request.responseText).error ?? message;
      } catch {
        /* keep the generic message */
      }
      setError(message);
    };
    request.onerror = () => {
      setProgress(null);
      setError(t("Video konnte nicht hochgeladen werden."));
    };
    request.send(body);
  }

  const uploading = progress !== null;

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {value && (
        <video
          src={value}
          controls
          preload="metadata"
          className="w-full max-w-sm rounded-lg border border-brand-cream-deep bg-black"
        />
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-brand-cream-deep px-4 py-1.5 text-sm text-brand-text hover:border-brand-sand transition-colors disabled:opacity-50"
        >
          {uploading
            ? `${t("Wird hochgeladen …")} ${progress}%`
            : value
              ? t("Video ändern")
              : t("Video hochladen")}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full px-3 py-1.5 text-sm text-brand-text-light hover:text-red-600 transition-colors"
          >
            {t("Video entfernen")}
          </button>
        )}
      </div>

      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : (
        <span className="text-xs text-brand-text-light">
          {t("MP4 oder WebM · max. 90 MB · der Upload kann einige Minuten dauern")}
        </span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-brand-text-mid mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2 first:pt-0">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-brand-accent">
        {children}
      </span>
      <span className="flex-1 h-px bg-brand-cream-deep" />
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-brand-cream-deep bg-brand-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-text-light/60 outline-none transition-colors focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/25"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-brand-cream-deep bg-brand-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-text-light/60 outline-none transition-colors focus:border-brand-sand focus:ring-2 focus:ring-brand-sand/25 resize-y leading-relaxed"
    />
  );
}

function ListEditor<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
  tone = "cream",
  t,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, onChange: (updated: T) => void) => React.ReactNode;
  newItem: () => T;
  addLabel?: string;
  tone?: "cream" | "white";
  t: TFn;
}) {
  const itemBg = tone === "white" ? "bg-brand-white" : "bg-brand-cream/60";
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={`group relative rounded-xl ${itemBg} border border-brand-cream-deep p-4 pr-11`}
        >
          <span className="absolute top-3 left-4 text-[0.6rem] font-medium uppercase tracking-widest text-brand-text-light/70">
            {index + 1}
          </span>
          <div className="pt-4">
            {renderItem(item, (updated) => {
              const next = [...items];
              next[index] = updated;
              onChange(next);
            })}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full flex items-center justify-center text-brand-text-light hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label={t("Eintrag entfernen")}
            title={t("Entfernen")}
          >
            ✕
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-brand-text-light italic px-1">{t("Noch keine Einträge.")}</p>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="self-start inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-sand text-brand-accent px-4 py-2 text-sm hover:bg-brand-sand/10 transition-colors"
      >
        <span className="text-base leading-none">+</span> {addLabel ?? t("Hinzufügen")}
      </button>
    </div>
  );
}
