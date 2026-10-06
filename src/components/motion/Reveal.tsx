"use client";

import { motion } from "motion/react";

/**
 * Generic entrance-animation wrapper that server components can nest children
 * into (every public page here is an RSC, so the client boundary has to live in
 * a small leaf like this one).
 *
 * Only `opacity` and `transform` are animated and children are *always*
 * rendered — the text stays in the server HTML for crawlers.
 *
 * Reduced motion and the no-JS case are handled in CSS via the `data-reveal`
 * attribute (see the `@media (prefers-reduced-motion: reduce)` block in
 * globals.css and the <noscript> style in layout.tsx), which keeps this
 * component free of any client/server branching.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  on = "view",
}: {
  children: React.ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  className?: string;
  /** "load" for above-the-fold content, "view" to trigger on scroll. */
  on?: "load" | "view";
}) {
  const from = { opacity: 0, y };
  const to = { opacity: 1, y: 0 };
  const transition = { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (on === "load") {
    return (
      <motion.div data-reveal className={className} initial={from} animate={to} transition={transition}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      data-reveal
      className={className}
      initial={from}
      whileInView={to}
      viewport={{ once: true, amount: 0.25 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
