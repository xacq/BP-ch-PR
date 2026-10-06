import type { LegalPage, LegalSection, SiteContent } from "@/lib/content";
import RichText from "@/components/RichText";
import Reveal from "@/components/motion/Reveal";
import ArrowUpRight from "@/components/icons/ArrowUpRight";

/**
 * Shared layout for the two legal pages (/impressum and /datenschutz). The
 * whole page — header, table of contents, numbered sections and the closing
 * call-to-action — comes from the CMS, so both routes are the same view with
 * a different slug.
 */
export default function LegalPageView({
  page,
  contact,
}: {
  page: LegalPage;
  contact: SiteContent["contact"];
}) {
  // Sections referenced by the table of contents need an anchor; the position
  // is stable enough (and stays valid when the client renumbers a section).
  const anchorFor = (index: number) => `abschnitt-${index + 1}`;
  const tocEntries = page.sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.variant !== "note" && section.title);

  return (
    // One continuous white band: no separate hero, the heading simply opens the
    // page above its own content.
    <section className="bg-white px-6 md:px-16 pt-36 md:pt-44 pb-14 md:pb-20">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-14">
          {page.eyebrow && (
            <Reveal on="load">
              <span className="block text-xs uppercase tracking-widest text-brand-text-light mb-4">
                {page.eyebrow}
              </span>
            </Reveal>
          )}
          <Reveal on="load" delay={0.08}>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-brand-text mb-6">
              {page.title}
              {page.titleEm && (
                <>
                  {/* No space when the title ends in a hyphen, so a split word
                      like "Datenschutz-" + "erklärung" stays one word. */}
                  {!page.title.endsWith("-") && " "}
                  <em className="font-accent-italic text-brand-accent">{page.titleEm}</em>
                </>
              )}
            </h1>
          </Reveal>
          {page.intro && (
            <Reveal on="load" delay={0.16}>
              <RichText text={page.intro} className="text-brand-text-mid leading-relaxed max-w-2xl" />
            </Reveal>
          )}
          {page.stand && (
            <Reveal on="load" delay={0.24}>
              <p className="text-xs text-brand-text-light mt-5">{page.stand}</p>
            </Reveal>
          )}
        </div>

        {/* BODY */}
        {page.showToc && tocEntries.length > 0 && (
          <Reveal className="rounded-2xl border border-brand-cream-deep bg-brand-cream-soft/60 p-6 md:p-8 mb-14">
            <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-brand-text-light mb-4">
              {page.tocTitle || "Inhalt"}
            </span>
            <ul className="list-none flex flex-col gap-2.5">
              {tocEntries.map(({ section, index }) => (
                <li key={index}>
                  <a
                    href={`#${anchorFor(index)}`}
                    className="group flex items-baseline gap-3 text-sm text-brand-text-mid hover:text-brand-accent transition-colors"
                  >
                    <span className="font-accent-italic text-xs text-brand-sand min-w-6">
                      {section.num}
                    </span>
                    <span className="group-hover:underline underline-offset-2">{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <div className="flex flex-col">
          {page.sections.map((section, index) => (
            <Section key={index} section={section} anchor={anchorFor(index)} />
          ))}
        </div>

        {page.ctaText && (
          <Reveal className="mt-14 rounded-3xl bg-brand-dark text-brand-white p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {page.ctaTitle && (
                <h2 className="font-accent-italic text-xl mb-3">{page.ctaTitle}</h2>
              )}
              <RichText text={page.ctaText} tone="dark" className="text-sm text-white/75 leading-relaxed" />
            </div>
            {page.ctaLabel && (
              <a
                href={`tel:${contact.phone}`}
                className="shrink-0 self-start md:self-auto inline-flex items-center gap-2 rounded-full bg-brand-white text-brand-dark pl-6 pr-2 py-2.5 text-sm hover:bg-brand-cream transition-colors"
              >
                {page.ctaLabel}
                <span className="grid place-items-center h-7 w-7 rounded-full bg-brand-dark/10">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Section({ section, anchor }: { section: LegalSection; anchor: string }) {
  // The info-box variant is a standalone highlight, not a numbered chapter.
  if (section.variant === "note") {
    return (
      <Reveal className="rounded-2xl border border-brand-cream-deep bg-brand-cream-soft/60 p-6 md:p-8 mb-12 last:mb-0">
        {section.title && (
          <h2 className="font-heading text-lg text-brand-text mb-3">{section.title}</h2>
        )}
        <RichText text={section.body} className="text-sm text-brand-text-mid leading-[1.85]" />
      </Reveal>
    );
  }

  return (
    <Reveal className="pb-10 mb-10 border-b border-brand-cream-deep last:border-b-0 last:pb-0 last:mb-0">
      {/* scroll-mt keeps the anchor target clear of the floating nav bar. */}
      <div id={anchor} className="scroll-mt-28">
        {section.num && (
          <span className="block font-accent-italic text-sm text-brand-text-light mb-2">
            {section.num}
          </span>
        )}
        {section.title && (
          <h2 className="font-heading text-xl md:text-2xl text-brand-text mb-5">
            {section.title}
            {section.titleNote && (
              <span className="ml-2 text-xs text-brand-text-light">{section.titleNote}</span>
            )}
          </h2>
        )}

        <RichText text={section.body} className="text-sm text-brand-text-mid leading-[1.85]" />

        {section.rows.length > 0 &&
          (section.variant === "card" ? (
            <div className="mt-5 rounded-2xl border border-brand-cream-deep bg-brand-cream-soft/50 p-6 md:p-8">
              {section.cardBadge && (
                <div className="h-11 w-11 rounded-xl bg-brand-dark text-brand-white flex items-center justify-center font-accent-italic mb-4">
                  {section.cardBadge}
                </div>
              )}
              {section.cardTitle && (
                <p className="font-heading text-lg text-brand-text">{section.cardTitle}</p>
              )}
              {section.cardSubtitle && (
                <p className="text-xs text-brand-text-light mb-5">{section.cardSubtitle}</p>
              )}
              <Rows rows={section.rows} style={section.rowStyle} />
            </div>
          ) : (
            <div className="mt-5">
              <Rows rows={section.rows} style={section.rowStyle} />
            </div>
          ))}
      </div>
    </Reveal>
  );
}

function Rows({
  rows,
  style,
}: {
  rows: LegalSection["rows"];
  style: string;
}) {
  if (style === "cards") {
    return (
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border border-brand-cream-deep bg-white p-5">
            {row.label && (
              <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-brand-accent mb-2">
                {row.label}
              </span>
            )}
            <RichText text={row.value} className="text-sm text-brand-text-mid leading-[1.85]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    // `display: contents` on the wrapper lets every dt/dd sit directly on the
    // two-column grid, so labels and values stay aligned across rows.
    <dl className="grid grid-cols-[110px_1fr] sm:grid-cols-[180px_1fr]">
      {rows.map((row, i) => {
        // The divider is skipped on the last row, and `last:` cannot see past
        // the `contents` wrapper — hence the explicit index check.
        const divider = i === rows.length - 1 ? "" : "border-b border-brand-cream-deep";
        return (
          <div key={i} className="contents">
            <dt className={`text-xs text-brand-text-light py-2.5 pr-4 ${divider}`}>{row.label}</dt>
            <dd className={`text-sm text-brand-text py-2.5 ${divider}`}>
              <RichText text={row.value} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
