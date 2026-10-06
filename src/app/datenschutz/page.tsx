import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPageView from "@/components/LegalPageView";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getContent(), "datenschutz", "/datenschutz");
}

export default async function DatenschutzPage() {
  const c = await getContent();

  return (
    <>
      <Nav ctaPhone={c.hero.ctaPhone} ctaLabel={c.hero.ctaPrimaryLabel} logoUrl={c.contact.logoUrl} businessName={c.contact.businessName} showBusinessName={c.contact.showBusinessName} />
      <LegalPageView page={c.legal.datenschutz} contact={c.contact} />
      <Footer contact={c.contact} brands={c.brands} />
    </>
  );
}
