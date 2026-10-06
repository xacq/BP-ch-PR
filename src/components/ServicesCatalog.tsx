"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { PriceGroup } from "@/lib/content";

const groupId = (i: number) => `gruppe-${i}`;

export default function ServicesCatalog({ groups }: { groups: PriceGroup[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // Filter each group's items by the query (match item label, subcategory, or
  // the group title). Empty query shows everything; groups with no match drop.
  const filtered = useMemo(() => {
    if (!q) return groups.map((g, i) => ({ group: g, items: g.items, index: i }));
    return groups
      .map((g, i) => ({
        group: g,
        index: i,
        items: g.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            (it.category ?? "").toLowerCase().includes(q) ||
            g.title.toLowerCase().includes(q),
        ),
      }))
      .filter((x) => x.items.length > 0);
  }, [groups, q]);

  return (
    <section id="preise" className="bg-white px-6 md:px-16 py-16 md:py-20 scroll-mt-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 md:gap-14 items-start">
        {/* Sidebar: search + category nav */}
        <aside className="md:sticky md:top-28">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen …"
            aria-label="Behandlung suchen"
            className="w-full rounded-full border border-brand-cream-deep bg-white px-5 py-2.5 text-sm text-brand-text placeholder:text-brand-text-light focus:outline-none focus:border-brand-sand mb-6"
          />
          <nav className="flex flex-col">
            {groups.map((g, i) => (
              <a
                key={i}
                href={`#${groupId(i)}`}
                className="text-sm text-brand-text-mid hover:text-brand-text py-1.5 transition-colors"
              >
                {g.title}
                {g.titleEm}
              </a>
            ))}
          </nav>
        </aside>

        {/* Price list */}
        <div className="flex flex-col gap-16">
          {filtered.length === 0 && (
            <p className="text-sm text-brand-text-light">Keine Ergebnisse für „{query}“.</p>
          )}
          {filtered.map(({ group, items, index }) => (
            <div key={index} id={groupId(index)} className="scroll-mt-28">
              {/* The band always renders: without a photo it shows a labelled
                  placeholder so the slot is visible while the client is still
                  gathering the images. */}
              <div className="relative h-40 md:h-56 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand mb-6">
                {group.imageUrl ? (
                  <Image
                    src={group.imageUrl}
                    alt={`${group.title} ${group.titleEm}`.trim()}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 760px"
                  />
                ) : (
                  <div className="absolute inset-2 rounded-xl border-2 border-dashed border-brand-white/50 flex flex-col items-center justify-center gap-2 text-brand-white/90">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="h-7 w-7"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <circle cx="8.5" cy="10" r="1.5" />
                      <path d="m3 16.5 4.5-4a2 2 0 0 1 2.7 0L21 17" />
                    </svg>
                    <span className="text-[0.68rem] uppercase tracking-[0.2em]">Bild folgt</span>
                  </div>
                )}
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-brand-text mb-2">
                {group.title}
                <em className="font-accent-italic text-brand-accent">{group.titleEm}</em>
              </h2>
              {group.description && (
                <p className="text-sm text-brand-text-mid leading-relaxed mb-6 max-w-2xl">
                  {group.description}
                </p>
              )}
              <div>
                {items.map((item, idx) => {
                  const prevCategory = idx > 0 ? items[idx - 1].category : "";
                  const showCategory = Boolean(item.category) && item.category !== prevCategory;
                  return (
                    <div key={idx}>
                      {showCategory && (
                        <span className="block text-[0.68rem] uppercase tracking-widest text-brand-text-light pt-6 pb-2">
                          {item.category}
                        </span>
                      )}
                      <div className="flex justify-between items-baseline gap-4 py-3 border-b border-brand-cream-deep/50">
                        <span className="text-sm text-brand-text-mid">{item.label}</span>
                        <span className="text-sm font-medium text-brand-text whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {group.note && (
                <p className="pt-3 text-xs italic text-brand-text-light">{group.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
