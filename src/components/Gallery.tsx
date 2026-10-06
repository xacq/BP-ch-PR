"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryImage, SectionHeading } from "@/lib/content";
import SectionTitle from "@/components/SectionTitle";

/**
 * Salon photo carousel. One shared image set (CMS section "Galerie") rendered on
 * all three public pages.
 *
 * Built on a native scroll-snap track rather than a transform carousel: touch
 * swipe, momentum and even pre-hydration scrolling come from the browser, and
 * the JS only adds the arrow buttons and their disabled states.
 */
export default function Gallery({
  images,
  heading,
  tone = "cream-soft",
}: {
  images: GalleryImage[];
  heading?: SectionHeading;
  tone?: "white" | "cream-soft";
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const slides = images.filter((image) => image.imageUrl);

  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncArrows();
    track.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      track.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
  }, [syncArrows, slides.length]);

  const scrollBySlide = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const step = first ? first.clientWidth + gap : track.clientWidth * 0.8;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: reduced ? "auto" : "smooth" });
  }, []);

  // No photos yet → the section does not exist at all. No empty band, no title.
  if (slides.length === 0) return null;

  return (
    <section
      className={`${tone === "white" ? "bg-white" : "bg-brand-cream-soft"} px-6 md:px-16 py-24`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10">
          <SectionTitle heading={heading} />
          <div className="hidden sm:flex gap-2 shrink-0">
            <ArrowButton
              label="Vorheriges Bild"
              disabled={!canPrev}
              onClick={() => scrollBySlide(-1)}
            >
              ←
            </ArrowButton>
            <ArrowButton label="Nächstes Bild" disabled={!canNext} onClick={() => scrollBySlide(1)}>
              →
            </ArrowButton>
          </div>
        </div>

        <ul
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="Karussell"
          aria-label="Fotogalerie"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollBySlide(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollBySlide(-1);
            }
          }}
          className="no-scrollbar list-none flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-2 rounded-3xl focus-visible:outline-2 focus-visible:outline-brand-sand"
        >
          {slides.map((image, index) => (
            <li
              key={`${image.imageUrl}-${index}`}
              className="snap-center shrink-0 w-[82%] sm:w-[47%] lg:w-[32%]"
            >
              <figure>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-cream-dark to-brand-sand">
                  <Image
                    src={image.imageUrl}
                    alt={image.alt}
                    fill
                    unoptimized
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 47vw, 32vw"
                  />
                </div>
                {image.caption && (
                  <figcaption className="text-xs text-brand-text-light mt-3">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="h-10 w-10 rounded-full border border-brand-cream-deep text-brand-text flex items-center justify-center hover:border-brand-sand transition-colors disabled:opacity-30 disabled:hover:border-brand-cream-deep"
    >
      {children}
    </button>
  );
}
