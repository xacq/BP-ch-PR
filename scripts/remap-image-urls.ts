import "dotenv/config";
import { readdir } from "node:fs/promises";
import { prisma } from "../src/lib/prisma";
import { remapLegacyImageUrl, UPLOADS_DIR } from "../src/lib/uploads";

async function buildUrlMap(): Promise<Map<string, string>> {
  const urlById = new Map<string, string>();
  const files = await readdir(UPLOADS_DIR).catch(() => [] as string[]);
  for (const file of files) {
    const match = file.match(/^([0-9a-f-]{36})\.[a-z0-9]+$/i);
    if (match) urlById.set(match[1]!, `/uploads/${file}`);
  }
  return urlById;
}

async function main() {
  const urlById = await buildUrlMap();
  console.log(`Found ${urlById.size} uploaded file(s).`);

  const hero = await prisma.hero.findFirst();
  if (hero) {
    await prisma.hero.update({
      where: { id: hero.id },
      data: { imageUrl: remapLegacyImageUrl(hero.imageUrl, urlById) },
    });
  }

  const about = await prisma.about.findFirst();
  if (about) {
    await prisma.about.update({
      where: { id: about.id },
      data: { imageUrl: remapLegacyImageUrl(about.imageUrl, urlById) },
    });
  }

  const aboutPage = await prisma.aboutPage.findFirst();
  if (aboutPage) {
    await prisma.aboutPage.update({
      where: { id: aboutPage.id },
      data: { imageUrl: remapLegacyImageUrl(aboutPage.imageUrl, urlById) },
    });
  }

  for (const service of await prisma.service.findMany()) {
    await prisma.service.update({
      where: { id: service.id },
      data: { imageUrl: remapLegacyImageUrl(service.imageUrl, urlById) },
    });
  }

  const contact = await prisma.contact.findFirst();
  if (contact) {
    await prisma.contact.update({
      where: { id: contact.id },
      data: {
        logoUrl: remapLegacyImageUrl(contact.logoUrl, urlById),
        logoWhiteUrl: remapLegacyImageUrl(contact.logoWhiteUrl, urlById),
      },
    });
  }

  const seo = await prisma.seoSettings.findFirst();
  if (seo) {
    await prisma.seoSettings.update({
      where: { id: seo.id },
      data: { ogImageUrl: remapLegacyImageUrl(seo.ogImageUrl, urlById) },
    });
  }

  console.log("Image URLs remapped to /uploads/…");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
