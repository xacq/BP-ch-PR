import Link from "next/link";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import type { ReactNode } from "react";

/**
 * Minimal rich-text renderer for the legal pages (Impressum / Datenschutz).
 *
 * The client edits these texts in a plain <textarea> in /admin, so the format
 * has to be typeable without any markup knowledge:
 *
 *   Blank line          → new paragraph
 *   Lines with "- "     → bullet list
 *   Line with "> "      → small muted note
 *   **bold**            → bold
 *   *italic*            → italic accent (Source Serif)
 *   [Text](https://…)   → link (also tel: and mailto:)
 *
 * Nothing is parsed as HTML — every node below is built by hand, so pasted
 * markup can never end up in the DOM.
 */
export default function RichText({
  text,
  className = "",
  tone = "light",
}: {
  text: string;
  /** Sets size/colour; the blocks below only add spacing, so they inherit it. */
  className?: string;
  /** "dark" flips links, bold and notes for use on the dark contact box. */
  tone?: "light" | "dark";
}) {
  const noteClass = tone === "dark" ? "text-white/50" : "text-brand-text-light";
  const blocks = text.trim().split(/\n\s*\n/).filter(Boolean);
  if (blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-none flex flex-col gap-2 mb-3 last:mb-0">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-brand-sand" />
                  <span>{inline(line.slice(2), tone)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines[0].startsWith("> ")) {
          return (
            <p key={i} className={`text-xs ${noteClass} mb-3 last:mb-0`}>
              {lines.map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {inline(line.replace(/^>\s?/, ""), tone)}
                </span>
              ))}
            </p>
          );
        }

        return (
          <p key={i} className="mb-3 last:mb-0">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(line, tone)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// [label](href) · **bold** · *italic* — matched in one pass so the parts that
// are not markup fall through as plain text.
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function inline(text: string, tone: "light" | "dark"): ReactNode[] {
  const nodes: ReactNode[] = [];
  const linkClass =
    tone === "dark"
      ? "text-brand-sand hover:underline underline-offset-2"
      : "text-brand-accent hover:underline underline-offset-2";
  const boldClass = tone === "dark" ? "font-medium text-white" : "font-medium text-brand-text";
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const [, linkLabel, href, bold, italic] = match;

    if (linkLabel && href) {
      // Internal links go through next/link so a cross-reference between the
      // two legal pages navigates client-side like the rest of the site.
      if (href.startsWith("/")) {
        nodes.push(
          <Link key={key++} href={href} className={linkClass}>
            {linkLabel}
          </Link>,
        );
      } else {
        const external = /^https?:\/\//i.test(href);
        nodes.push(
          <a
            key={key++}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className={linkClass}
          >
            {linkLabel}
            {/* Marks the link as leaving the site. The icon is drawn rather
                than typed, so it never turns into an emoji on mobile. */}
            {external && <ArrowUpRight className="inline-block h-3 w-3 ml-0.5 align-[-0.08em]" />}
          </a>,
        );
      }
    } else if (bold) {
      nodes.push(
        <strong key={key++} className={boldClass}>
          {bold}
        </strong>,
      );
    } else if (italic) {
      nodes.push(
        <em key={key++} className="font-accent-italic">
          {italic}
        </em>,
      );
    }

    last = start + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
