import type { SectionHeading, SiteContent } from "@/lib/content";
import SectionTitle from "@/components/SectionTitle";

export default function ContactSection({
  contact,
  heading,
}: {
  contact: SiteContent["contact"];
  heading?: SectionHeading;
}) {
  return (
    <section className="bg-brand-dark text-brand-white px-6 md:px-16 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionTitle heading={heading} light className="mb-14" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
            <h3 className="font-accent-italic text-xl mb-8">{contact.businessName}</h3>
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">Telefon</span>
              <a href={`tel:${contact.phone}`} className="text-brand-sand">{contact.phoneDisplay}</a>
            </div>
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">Adresse</span>
              <p className="text-white/85 leading-relaxed">
                {contact.addressLine1}
                <br />
                {contact.addressLine2}
              </p>
            </div>
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest text-white/40 mb-1.5">Öffnungszeiten</span>
              <table className="w-full text-sm">
                <tbody>
                  {contact.hours.map((hour, i) => (
                    <tr key={i}>
                      <td className="py-1 text-white/70">{hour.days}</td>
                      <td className="py-1 text-right text-white">{hour.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a
              href={`tel:${contact.phone}`}
              className="inline-block rounded-full bg-brand-white text-brand-dark px-6 py-3 text-sm hover:bg-brand-cream transition-colors"
            >
              Jetzt anrufen
            </a>
          </div>

          {/* Directions box */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col gap-6">
            <h3 className="font-accent-italic text-xl">So finden Sie uns</h3>
            <DirStep num={1} title="Adresse">
              {contact.addressLine1}, {contact.addressLine2} – im 3. Obergeschoss.
            </DirStep>
            <div className="h-px bg-white/10" />
            <DirStep num={2} title="Mit dem Zug">
              Visp Bahnhof ist in wenigen Gehminuten erreichbar.
            </DirStep>
            <div className="h-px bg-white/10" />
            <DirStep num={3} title="Mit dem Auto">
              Parkplätze sind in unmittelbarer Nähe vorhanden.
            </DirStep>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-brand-sand hover:border-brand-sand transition-colors mt-1"
            >
              → Route in Google Maps öffnen
            </a>
          </div>
        </div>

        {/* Directions videos. Full width below the two boxes — a 16:9 clip inside
            one half-width column would be far too small for two of them. */}
        {contact.videos.length > 0 && (
          <div className="mt-8">
            <h3 className="font-accent-italic text-xl mb-5">So finden Sie uns – im Video</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contact.videos
                .filter((video) => video.videoUrl)
                .map((video, i) => (
                  <figure key={`${video.videoUrl}-${i}`}>
                    {/* Fixed aspect ratio reserves the space before the metadata
                        loads, so nothing shifts. */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                      <video
                        controls
                        preload="metadata"
                        playsInline
                        poster={video.posterUrl || undefined}
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={video.videoUrl} />
                      </video>
                    </div>
                    {video.title && (
                      <figcaption className="text-xs uppercase tracking-widest text-white/40 mt-3">
                        {video.title}
                      </figcaption>
                    )}
                  </figure>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DirStep({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-8 h-8 rounded-full border border-brand-sand/30 flex items-center justify-center text-sm text-brand-sand shrink-0 font-heading">
        {num}
      </div>
      <div className="text-sm text-white/70 leading-relaxed pt-1">
        <strong className="block text-white font-medium mb-0.5">{title}</strong>
        {children}
      </div>
    </div>
  );
}
