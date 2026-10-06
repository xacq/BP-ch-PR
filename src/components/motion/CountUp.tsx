"use client";

import { useEffect, useRef, useState } from "react";

/** "10+" → ["", "10", "+"] · "100%" → ["", "100", "%"] · "CHF 120" → ["CHF ", "120", ""]. */
const PARTS = /^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/;

/**
 * Counts a CMS stat up to its value the first time it scrolls into view.
 *
 * The value is CMS free text, so anything without a leading number is passed
 * through untouched. Server render and first client render both show the FINAL
 * string — no hydration mismatch, and crawlers/no-JS visitors read the real
 * number.
 */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const match = value.match(PARTS);
    const el = ref.current;
    if (!match || !el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, rawNumber, suffix] = match;
    const separator = rawNumber.includes(",") ? "," : ".";
    const decimals = rawNumber.split(/[.,]/)[1]?.length ?? 0;
    const target = Number(rawNumber.replace(",", "."));
    const format = (n: number) =>
      prefix + n.toFixed(decimals).replace(".", separator) + suffix;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          if (progress < 1) {
            setDisplay(format(target * eased));
            frame = requestAnimationFrame(step);
          } else {
            setDisplay(value); // land on the exact source string
          }
        };

        setDisplay(format(0));
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  // The ticking text is hidden from assistive tech; the label pins the real value.
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
