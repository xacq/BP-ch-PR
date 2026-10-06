import type { SectionHeading } from "@/lib/content";

/** Renders an eyebrow + "lead <em>accent</em>" title from a SectionHeading. */
export default function SectionTitle({
  heading,
  className = "",
  light = false,
}: {
  heading?: SectionHeading;
  className?: string;
  light?: boolean;
}) {
  if (!heading) return null;
  return (
    <div className={className}>
      <span
        className={`block text-xs uppercase tracking-widest mb-3 ${
          light ? "text-white/40" : "text-brand-text-light"
        }`}
      >
        {heading.eyebrow}
      </span>
      <h2
        className={`font-heading text-3xl md:text-4xl leading-tight ${
          light ? "text-brand-white" : "text-brand-text"
        }`}
      >
        {heading.titleLead}{" "}
        <em className="font-accent-italic text-brand-accent">{heading.titleEm}</em>
      </h2>
    </div>
  );
}
