import type { SectionHeading, Testimonial } from "@/lib/content";

export default function Testimonials({
  heading,
  items,
}: {
  heading?: SectionHeading;
  items: Testimonial[];
}) {
  return (
    <section className="bg-white px-6 md:px-16 py-28">
      <div className="max-w-6xl mx-auto">
        {/* Centered header with pill badge */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text-mid border border-brand-cream-deep rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-sand text-[0.5rem]">●</span>
            {heading?.eyebrow}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl leading-tight text-brand-text">
            {heading?.titleLead}{" "}
            <em className="font-accent-italic text-brand-accent">{heading?.titleEm}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-brand-cream-deep/50 rounded-3xl p-8"
            >
              <div className="text-brand-sand tracking-widest mb-5">★★★★★</div>
              <p className="text-brand-text-mid leading-relaxed mb-6">„{t.text}“</p>
              <span className="block text-sm font-medium text-brand-text">{t.name}</span>
              <span className="block text-xs text-brand-text-light mt-3">{t.service}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
