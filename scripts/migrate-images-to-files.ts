import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { remapLegacyImageUrl, saveUploadedFile } from "../src/lib/uploads";

async function main() {
  const images = await prisma.image.findMany();
  const urlById = new Map<string, string>();

  for (const image of images) {
    const url = await saveUploadedFile(
      image.id,
      Buffer.from(image.data),
      image.mimeType,
    );
    urlById.set(image.id, url);
    console.log(`Exported ${image.id} -> ${url}`);
  }

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

  const deleted = await prisma.image.deleteMany();
  console.log(`Removed ${deleted.count} blob row(s) from Image table.`);
  console.log(`Done. ${urlById.size} file(s) in docker/uploads/.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
