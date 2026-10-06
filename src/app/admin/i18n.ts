// Admin UI internationalization.
//
// The admin interface is authored in German (the source language). This maps
// each German UI string to its English equivalent. Anything missing from the
// map falls back to the German source, so the panel never shows a blank label.
//
// NOTE: this only translates the admin's own chrome (labels, buttons, hints).
// The website content being edited stays in whatever language it was written.

export type Lang = "de" | "en";

export const EN: Record<string, string> = {
  // Sidebar chrome
  Verwaltung: "Management",
  Startseite: "Home",
  "Leistungen & Preise": "Services & Prices",
  "Über Andrea": "About Andrea",
  Allgemein: "General",
  ansehen: "view",
  "Website ansehen": "View website",
  Abmelden: "Log out",

  // Section labels
  Hero: "Hero",
  "Statistik-Leiste": "Stats bar",
  Marken: "Brands",
  "Über-uns-Block": "About block",
  Leistungen: "Services",
  Ablauf: "Process",
  Kundenstimmen: "Testimonials",
  "Häufige Fragen": "FAQ",
  Einleitung: "Intro",
  Preise: "Prices",
  Vorstellung: "Introduction",
  Diplome: "Diplomas",
  Werte: "Values",
  "Kontakt & Zeiten": "Contact & hours",
  "Abschnitt-Titel": "Section titles",

  // Section descriptions
  "Der grosse Bereich ganz oben – Titel, Untertitel und Telefonnummer.":
    "The large area at the very top – title, subtitle and phone number.",
  "Die dunkle Zahlen-Leiste direkt unter dem Hero.":
    "The dark stats bar right below the hero.",
  "Die Zeile mit den Markennamen.": "The row of brand names.",
  "Der Highlight-Abschnitt „Die perfekte Balance …“ mit den Merkmalen.":
    "The highlight section “Die perfekte Balance …” with the features.",
  "Die sechs Behandlungs-Karten in der Vorschau.":
    "The six treatment cards in the preview.",
  "Die drei Schritte, wie ein Termin abläuft.":
    "The three steps of how an appointment works.",
  "Die Bewertungen auf der Startseite.": "The reviews on the home page.",
  "Die aufklappbaren Fragen und Antworten.":
    "The expandable questions and answers.",
  "Titel und Text ganz oben auf der Preisseite.":
    "Title and text at the top of the prices page.",
  "Alle Behandlungen mit Kategorien und Preisen.":
    "All treatments with categories and prices.",
  "Name, Rolle, Biografie und das Zitat.":
    "Name, role, biography and the quote.",
  "Zertifikate und Ausbildungen.": "Certificates and qualifications.",
  "Die drei Grundwerte.": "The three core values.",
  "Die Bewertungen auf der Über-Andrea-Seite.":
    "The reviews on the About Andrea page.",
  "Adresse, Telefon und Öffnungszeiten – erscheint im Footer und im Kontaktbereich.":
    "Address, phone and opening hours – shown in the footer and contact area.",
  "Die kleinen Überschriften (Eyebrow + Titel) über jedem Bereich.":
    "The small headings (eyebrow + title) above each section.",

  // Topbar / status / global
  Speichern: "Save",
  "Speichern …": "Saving …",
  "Menü öffnen": "Open menu",
  Gespeichert: "Saved",
  "Nicht gespeichert": "Unsaved changes",
  Aktuell: "Up to date",
  "Speichern fehlgeschlagen.": "Save failed.",
  "Inhalt konnte nicht geladen werden.": "Content could not be loaded.",
  "Inhalte werden geladen …": "Loading content …",
  "Auf der Website ansehen": "View on the website",

  // Fields — shared placeholders/labels
  Titel: "Title",
  Beschreibung: "Description",
  Text: "Text",
  Name: "Name",
  Zahl: "Number",
  Beschriftung: "Label",
  "Akzent (kursiv)": "Accent (italic)",
  Eyebrow: "Eyebrow",

  // Hero
  "Tag (kleines Badge oben)": "Tag (small badge at top)",
  "Titel (Zeile 1)": "Title (line 1)",
  "Titel (Akzent, kursiv hervorgehoben)": "Title (accent, italic)",
  Untertitel: "Subtitle",
  "Telefonnummer (für den Anruf-Button)": "Phone number (for the call button)",
  "Button 1 (Text)": "Button 1 (text)",
  "Button 2 (Text)": "Button 2 (text)",
  "Badges (Stichworte unter den Buttons)": "Badges (keywords below the buttons)",
  "Badge hinzufügen": "Add badge",
  "z. B. 15+ Jahre Erfahrung": "e.g. 15+ years of experience",
  "Statistik-Karte (schwebt über dem Hero-Bild)":
    "Stats card (floats over the hero image)",
  "Zahl hinzufügen": "Add number",

  // Brands
  "Marke hinzufügen": "Add brand",
  Markenname: "Brand name",

  // About block
  "Tag (kleines Badge)": "Tag (small badge)",
  "Titel-Anfang": "Title start",
  "Titel-Mitte": "Title middle",
  "Akzent 1 (kursiv)": "Accent 1 (italic)",
  "Akzent 2 (kursiv)": "Accent 2 (italic)",
  "Merkmale (Aufzählung)": "Features (list)",
  "Merkmal hinzufügen": "Add feature",
  Merkmal: "Feature",

  // Services
  "Leistung hinzufügen": "Add service",
  "Als „Beliebteste“ markieren": "Mark as “Most popular”",

  // Process
  "Schritt hinzufügen": "Add step",
  "Schritt-Label (z. B. Schritt 1)": "Step label (e.g. Step 1)",

  // Testimonials
  "Kundenstimme hinzufügen": "Add testimonial",
  Zitat: "Quote",
  Leistung: "Service",

  // FAQ
  "Frage hinzufügen": "Add question",
  Frage: "Question",
  Antwort: "Answer",

  // Services intro
  "Eyebrow (kleine Überschrift)": "Eyebrow (small heading)",
  "Titel (Akzent, kursiv)": "Title (accent, italic)",

  // Prices
  "Preisgruppe hinzufügen": "Add price group",
  "Titel (z. B. Kosmetik)": "Title (e.g. Cosmetics)",
  "Titel-Akzent (kursiv)": "Title accent (italic)",
  "Hinweis (optional, z. B. Angebot)": "Note (optional, e.g. offer)",
  "Preis-Positionen": "Price items",
  "Position hinzufügen": "Add item",
  "Kategorie (optional)": "Category (optional)",
  Bezeichnung: "Name",
  Preis: "Price",

  // About page
  "Name (Akzent, kursiv)": "Name (accent, italic)",
  Rolle: "Role",
  "Biografie – Absatz 1": "Biography – paragraph 1",
  "Biografie – Absatz 2": "Biography – paragraph 2",

  // Diplomas
  "Diplom hinzufügen": "Add diploma",
  Symbol: "Symbol",
  "Schule / Institut": "School / institute",
  // Icon picker labels (src/components/icons/DiplomaIcon.tsx)
  Kosmetik: "Cosmetics",
  "Permanent Make-up": "Permanent make-up",
  Massage: "Massage",
  Bambus: "Bamboo",
  "Hot Stone": "Hot stone",
  Nagelpflege: "Nail care",
  "Bienen / Honig": "Bees / honey",

  // Values
  "Wert hinzufügen": "Add value",
  "Nr.": "No.",

  // Contact
  Firmenname: "Business name",
  "Telefon (zum Anrufen)": "Phone (for calling)",
  "Telefon (angezeigt)": "Phone (displayed)",
  "Adresse – Zeile 1": "Address – line 1",
  "Adresse – Zeile 2": "Address – line 2",
  "Google-Maps-Link": "Google Maps link",
  Öffnungszeiten: "Opening hours",
  "Zeit hinzufügen": "Add time",
  "Tage (z. B. Mo–Fr)": "Days (e.g. Mon–Fri)",
  Uhrzeit: "Time",

  // Heading labels
  "Startseite · Leistungen": "Home · Services",
  "Startseite · Ablauf": "Home · Process",
  "Startseite · Kundenstimmen": "Home · Testimonials",
  "Startseite · Häufige Fragen": "Home · FAQ",
  "Startseite · Kontakt": "Home · Contact",
  "Über Andrea · Diplome": "About Andrea · Diplomas",
  "Über Andrea · Werte": "About Andrea · Values",
  "Über Andrea · Kundenstimmen": "About Andrea · Testimonials",
  "Über Andrea · Kontakt": "About Andrea · Contact",
  "Leistungen · Kontakt": "Services · Contact",

  // ListEditor internals
  "Noch keine Einträge.": "No entries yet.",
  "Eintrag entfernen": "Remove entry",
  Entfernen: "Remove",
  Hinzufügen: "Add",

  // Contact videos
  "Videos (Anfahrt)": "Videos (directions)",
  "Zwei kurze Videos im Bereich „So finden Sie uns“ – erscheinen auf der Startseite und auf „Über Andrea“.":
    "Two short videos in the “How to find us” section – shown on the home page and on “About Andrea”.",
  "Video hinzufügen": "Add video",
  "Titel (z. B. Anfahrt mit dem Auto)": "Title (e.g. arriving by car)",
  Video: "Video",
  "Vorschaubild (optional)": "Preview image (optional)",
  "Video hochladen": "Upload video",
  "Video ändern": "Change video",
  "Video entfernen": "Remove video",
  "Video konnte nicht hochgeladen werden.": "Video could not be uploaded.",
  "MP4 oder WebM · max. 90 MB · der Upload kann einige Minuten dauern":
    "MP4 or WebM · max 90 MB · the upload can take a few minutes",

  // Gallery
  Galerie: "Gallery",
  "Fotos vom Studio – dieselben Bilder erscheinen auf der Startseite, auf „Leistungen & Preise“ und auf „Über Andrea“.":
    "Photos of the studio – the same images appear on the home page, on “Services & prices” and on “About Andrea”.",
  "Bild hinzufügen": "Add image",
  "Bildbeschreibung (für Google & Screenreader)": "Image description (for Google & screen readers)",
  "Bildunterschrift (optional)": "Caption (optional)",
  "Alle Seiten · Galerie": "All pages · Gallery",

  // Social links
  "Soziale Netzwerke": "Social networks",
  "Leer lassen, wenn es kein Profil gibt – dann wird das Symbol im Footer nicht angezeigt.":
    "Leave empty if there is no profile – the icon is then hidden in the footer.",

  // Image upload
  "Hero-Bild": "Hero image",
  Bild: "Image",
  Porträtfoto: "Portrait photo",
  "Bild hochladen": "Upload image",
  "Bild ändern": "Change image",
  "Bild entfernen": "Remove image",
  "Wird hochgeladen …": "Uploading …",
  "JPG, PNG, WebP oder GIF · max. 5 MB": "JPG, PNG, WebP or GIF · max 5 MB",
  "Bild konnte nicht hochgeladen werden.": "Image could not be uploaded.",
  Logo: "Logo",
  "Logo (weiss, für dunklen Hintergrund)": "Logo (white, for dark background)",
  "Erscheint oben im Menü (heller Hintergrund). Ohne Logo wird der Firmenname als Text angezeigt.":
    "Shown at the top in the menu (light background). Without a logo, the business name is shown as text.",
  "Erscheint im Footer (dunkler Hintergrund). Ohne weisses Logo wird dort der Firmenname als Text angezeigt.":
    "Shown in the footer (dark background). Without a white logo, the business name is shown there as text.",
  "Firmenname neben dem Logo anzeigen": "Show business name next to the logo",

  // Legal pages (Impressum / Datenschutz)
  Rechtliches: "Legal",
  Impressum: "Legal notice",
  Datenschutzerklärung: "Privacy policy",
  "Die Impressum-Seite – Betreiberin, Verantwortliche, Haftung und Urheberrecht.":
    "The legal notice page – operator, responsible person, liability and copyright.",
  "Die Datenschutz-Seite – welche Daten bearbeitet werden, wie lange und welche Rechte Besucher haben.":
    "The privacy page – which data is processed, for how long and what rights visitors have.",
  Kopfbereich: "Header",
  "Stand / Datum": "Last updated / date",
  "z. B. Stand: 2025": "e.g. Stand: 2025",
  "Inhaltsverzeichnis oben anzeigen": "Show table of contents at the top",
  "Überschrift des Inhaltsverzeichnisses": "Table of contents heading",
  Abschnitte: "Sections",
  "Abschnitt hinzufügen": "Add section",
  "Art des Abschnitts": "Section type",
  "Normaler Abschnitt": "Standard section",
  "Abschnitt mit Karte (z. B. Agentur)": "Section with a card (e.g. agency)",
  "Hinweis-Box (ohne Nummer)": "Highlight box (no number)",
  "Titel (optional)": "Title (optional)",
  "Zusatz neben dem Titel (z. B. (Art. 19 DSG))":
    "Addition next to the title (e.g. (Art. 19 DSG))",
  Kürzel: "Initials",
  "Name auf der Karte": "Name on the card",
  "Untertitel der Karte": "Card subtitle",
  "Angaben (Bezeichnung / Wert)": "Details (label / value)",
  "Tabelle (Bezeichnung / Wert)": "Table (label / value)",
  "Karten (Titel + Text)": "Cards (title + text)",
  "Angabe hinzufügen": "Add detail",
  "Bezeichnung (z. B. Adresse)": "Label (e.g. address)",
  Wert: "Value",
  "Kontakt-Box am Seitenende": "Contact box at the end of the page",
  "Bleibt der Text leer, wird die Box nicht angezeigt. Der Button ruft die Telefonnummer aus „Kontakt & Zeiten“ an.":
    "If the text is empty the box is hidden. The button calls the phone number from “Contact & hours”.",
  "Button-Text": "Button label",
  "Formatierung: Leerzeile = neuer Absatz · „- “ am Zeilenanfang = Aufzählung · „> “ = kleiner Hinweis · **fett** · *kursiv* · [Text](https://… oder tel:+41…)":
    "Formatting: blank line = new paragraph · “- ” at the start of a line = bullet · “> ” = small note · **bold** · *italic* · [text](https://… or tel:+41…)",

  // SEO & Marketing
  "SEO & Marketing": "SEO & Marketing",
  "Meta-Titel, Beschreibungen, Vorschaubild und Tracking-Codes (Google, Facebook).":
    "Meta titles, descriptions, preview image and tracking codes (Google, Facebook).",
  Grundeinstellungen: "General settings",
  "Seiten-Titel & Beschreibung": "Page titles & descriptions",
  "Tracking & Verifizierung": "Tracking & verification",
  "Website-URL": "Website URL",
  "z. B. https://beauty-palast.ch": "e.g. https://beauty-palast.ch",
  "Titel-Vorlage (%s = Seitentitel)": "Title template (%s = page title)",
  "Standard-Titel (Fallback)": "Default title (fallback)",
  "Standard-Beschreibung": "Default description",
  "Vorschaubild (Social Media / Open Graph)": "Preview image (social media / Open Graph)",
  "Meta-Titel": "Meta title",
  "Meta-Beschreibung": "Meta description",
  "Google Analytics ID (G-XXXXXXX)": "Google Analytics ID (G-XXXXXXX)",
  "Google Tag Manager ID (GTM-XXXXXX)": "Google Tag Manager ID (GTM-XXXXXX)",
  "Meta / Facebook Pixel ID": "Meta / Facebook Pixel ID",
  "Google Search Console Bestätigungs-Code": "Google Search Console verification code",
  "Erscheint im Browser-Tab und als Titel in den Google-Suchergebnissen.":
    "Shown in the browser tab and as the title in Google search results.",
  "Wird als OG-Bild geteilt, wenn ein Link auf WhatsApp, Facebook oder Instagram gepostet wird.":
    "Shared as the OG image when a link is posted on WhatsApp, Facebook or Instagram.",
};

export type TFn = (s: string) => string;

export function makeTranslator(lang: Lang): TFn {
  return (s: string) => (lang === "en" ? EN[s] ?? s : s);
}

export const LANG_STORAGE_KEY = "bp-admin-lang";
