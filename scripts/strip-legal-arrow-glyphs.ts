import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * One-off: removes the literal "↗" (U+2197) from the seeded legal-page content.
 *
 * That character has an emoji presentation variant, so mobile browsers rendered
 * it with the colour emoji font. The arrow on external links is now drawn by
 * the ArrowUpRight icon in src/components/RichText.tsx instead.
 *
 *   npx tsx scripts/strip-legal-arrow-glyphs.ts
 */
async function main() {
  const rows = await prisma.legalRow.findMany();
  for (const row of rows) {
    if (!row.value.includes("↗")) continue;
    const value = row.value.replace(/\s*↗/g, "");
    await prisma.legalRow.update({ where: { id: row.id }, data: { value } });
    console.log(`LegalRow ${row.id}: ${JSON.stringify(row.value)} → ${JSON.stringify(value)}`);
  }

  const sections = await prisma.legalSection.findMany();
  for (const section of sections) {
    if (!section.body.includes("↗")) continue;
    const body = section.body.replace(/\s*↗/g, "");
    await prisma.legalSection.update({ where: { id: section.id }, data: { body } });
    console.log(`LegalSection ${section.id}: arrow removed from the body.`);
  }

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
