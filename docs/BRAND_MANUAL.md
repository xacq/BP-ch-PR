# Beauty Palast — Brand Manual

> Kosmetiksalon · Andrea Teles · Visp, Wallis
> beautypalast@gmail.com · 079 104 30 19 · beauty-palast.ch

## 1. Einleitung (Brand Overview)

Beauty Palast steht für verfeinerte Schönheit und Expertenpräzision. Die Marke verbindet klinische Fachkompetenz mit einer warmen, einladenden Ästhetik — Wohlbefinden, Selbstbewusstsein und natürliche Schönheit stehen im Mittelpunkt jeder Behandlung.

**Positioning:** Premium, aber herzlich und persönlich — kein steriles Klinik-Feeling, sondern ein "Palast" der Ruhe und Pflege.

## 2. Logo

- Primäres Logo: Schriftzug **"Beauty Palast"** in kursiver Skript-Schrift, mit **"Kosmetiksalon"** als Unterzeile in Versalien (Großbuchstaben), getrennt durch dekorative Ornament-Linien (florale Verzierung).
- Farbvarianten:
  - **Dunkelbraun** (`#58463D`) auf hellem Hintergrund (Standard/Print)
  - **Weiß** (`#FDFAF5` / `#FFFFFF`) auf dunklem oder Foto-Hintergrund (Hero-Bilder, dunkle Sektionen)
- Das Logo sollte immer mit ausreichend Weißraum (Clear Space) freigestellt werden — keine Verzerrung, Rotation oder Farbänderung außerhalb der definierten Varianten.
- Die Ornament-Elemente (Schnörkel) können als eigenständiges dekoratives Motiv (Divider, Icon-Akzent) wiederverwendet werden, aber nicht als Ersatz für das Logo.

## 3. Farbpalette

| Name | Hex | RGB | CMYK | Verwendung |
|---|---|---|---|---|
| **Dunkelbraun** | `#58463D` | 88, 70, 61 | 0, 20, 31, 65 | Primärtext, Logo, Buttons (dark), Footer/Kontakt-Sektion |
| **Warmes Beige** | `#DDD4C7` | 221, 212, 199 | 0, 4, 10, 13 | Sekundärhintergrund, Karten, sanfte Trennflächen |
| **Taupe Braun** | `#BDA08A` | 189, 160, 138 | 0, 15, 27, 26 | Akzentfarbe, Icons, Hover-Zustände, Sterne/Highlights |
| **Elfenbein** | `#F1E3D3` | 241, 227, 211 | 0, 6, 12, 5 | Haupthintergrund (helle Sektionen) |

**Erweiterte Web-Palette** (Design-Tokens in `src/app/globals.css` — die 4 offiziellen Farben plus daraus abgeleitete Zwischentöne):

| Token | Hex | Herkunft |
|---|---|---|
| Cream (Haupthintergrund) | `#F1E3D3` | **= Elfenbein (offiziell)** |
| Cream Dark (Sekundärflächen) | `#DDD4C7` | **= Warmes Beige (offiziell)** |
| Cream Deep (Borders/Divider) | `#D3C4B1` | abgeleitet aus Warmes Beige |
| Sand (Sterne, Deko, Hover) | `#BDA08A` | **= Taupe Braun (offiziell)** |
| Sand Dark (Verläufe) | `#A68B74` | abgeleitet aus Taupe |
| Dark (Footer, Kontakt, Buttons) | `#58463D` | **= Dunkelbraun (offiziell)** |
| Text (Primärtext) | `#58463D` | **= Dunkelbraun (offiziell)** |
| Text Mid (Sekundärtext) | `#6F5D4F` | abgeleitet (Kontrast ≥ 4.5:1 auf Elfenbein) |
| Text Light (Labels/Eyebrows) | `#8F7B69` | abgeleitet |
| Brown (Button-Hover) | `#6C5849` | abgeleitet aus Dunkelbraun |
| White | `#FDFAF5` | Warmweiß (Logo-Weiß-Variante) |
| Accent (kursive `<em>`-Akzente) | `#8B6B4A` | abgedunkeltes Taupe — lesbar auf Elfenbein (≥ 3.8:1). Das offizielle Taupe `#BDA08A` hat auf Elfenbein nur ~1.9:1 Kontrast und ist daher **nur dekorativ** einzusetzen, nie für Text. |

**Regel:** Kontraste immer warm halten — keine kalten Grau- oder Blautöne einführen. Dunkelbraun für Text, Footer und Buttons, Beige/Elfenbein für Flächen, Taupe/Sand als Akzent- und Hover-Farbe (dekorativ, nicht für Fließtext).

## 4. Typografie

> **Update:** Die Schriftentscheidung wurde vom Kunden final auf **Figtree** + **Source Serif 4** festgelegt (beide frei über Google Fonts verfügbar). Die vorherige Planung mit **Tan Variety** (kostenpflichtig, Logo-Schrift) und **Playfair Display** (Web-Fallback) wurde verworfen — Tan Variety wird nicht mehr verfolgt.

### Titel & Fließtext — **Figtree**
Moderne, klare serifenlose Schrift für Headlines und Body-Text.
- `h1`, `h2`, `h3` und `.font-heading` (Section-Titles, Nav, Footer): **Figtree Light (300)**.
- Fließtext (Body): **Figtree Regular (400)**.

### Palabras clave / Akzentwörter — **Source Serif 4**
Elegante Serifenschrift für hervorgehobene Schlüsselwörter, Zitate/Testimonials und den Logo-Schriftzug-Fallback.
- Verwendung: `<em>`-Akzente in Überschriften, Testimonial-Zitate, Eyebrow-Akzente.
- Gewicht/Stil: **Light Italic (300 italic)**.

**Einbindung:** Beide Schriften werden über `next/font/google` geladen (`src/app/fonts.ts`) — Next.js lädt sie zur Build-Zeit automatisch und hostet sie selbst (keine externen Aufrufe an Google zur Laufzeit, keine manuelle Verwaltung von `.woff2`-Dateien in `public/fonts/`).

| Element | Font | Weight/Style |
|---|---|---|
| Logo-Text (Fallback) / H1 / H2 / H3 | Figtree | 300 (Light) |
| Akzentwörter (`<em>`), Zitate/Testimonials | Source Serif 4 | 300 italic (Light Italic) |
| Body/Paragraph | Figtree | 400 (Regular) |
| Navigation/Labels/Buttons | Figtree | 400, oft letter-spacing erhöht |
| Eyebrow/Overline (Kleinschrift, Uppercase) | Figtree | 400, letter-spacing 0.15–0.2em |

## 5. Bildsprache (Photography Guidelines)

Die Bildsprache steht für **Natürlichkeit, Eleganz und Wohlbefinden**.

- Warme Lichtstimmungen, sanfte Hauttöne, authentische Details.
- Ruhige, hochwertige Ästhetik ohne übermäßige Retusche.
- Motive: Nahaufnahmen von Hautpflege-Momenten, Gesichtsbehandlungen, Hände/Textur-Details (Cremes, Seren), entspannte/natürliche Porträts mit geschlossenen Augen oder sanftem Lächeln.
- Vermeiden: kalte/klinische Beleuchtung, künstlich wirkende Studio-Härte, übertriebene Filter oder Retusche, gestellte "Stock-Photo"-Posen.
- Bilder sollten echte Schönheit natürlich hervorheben — im Einklang mit dem Markenversprechen "verfeinerte Schönheit, Expertenpräzision".

## 6. Ton & Sprache (Voice & Tone)

- Sprache: Deutsch (Schweizer Kontext, Wallis).
- Tonalität: warm, persönlich, professionell, nie aufdringlich — wie eine vertraute Expertin, nicht wie ein anonymer Konzern.
- Typische Formulierungsmuster: kurze, einladende Sätze mit kursiv hervorgehobenen Schlüsselwörtern (z. B. *"Expertenpräzision."*, *"klinischer Expertise"*).
- Eyebrows/Overlines in Kleinschrift-Großbuchstaben mit weitem Letter-Spacing, um Eleganz zu unterstreichen.

## 7. Anwendung in der React-Landingpage

Diese Richtlinien sollen 1:1 als Design-Tokens in die React-Umsetzung übernommen werden:

- CSS-Variablen/Theme-Datei mit obiger Farbpalette definieren.
- Google Fonts einbinden: `Figtree` (Titel Light / Body Regular) + `Source Serif 4` (Akzentwörter, Light Italic).
- Runde Buttons (`border-radius: 100px`), großzügiger Weißraum, dekorative Ornament-Divider als Signature-Element für Section-Übergänge.
- Bildauswahl gemäß Abschnitt 5 für Hero, Highlight- und Testimonial-Sektionen.
