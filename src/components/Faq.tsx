"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={i}
            className="border border-brand-cream-deep rounded-2xl px-6 py-5 cursor-pointer hover:border-brand-sand transition-colors"
            onClick={() => setOpenIndex(open ? -1 : i)}
          >
            <div className="flex justify-between items-center gap-4">
              <p className="text-brand-text">{item.question}</p>
              <span
                className={`text-xl text-brand-text-light shrink-0 transition-transform ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </div>
            {open && (
              <p className="text-sm text-brand-text-mid leading-relaxed mt-3">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
