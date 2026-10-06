import { randomUUID } from "node:crypto";
import {
  ALLOWED_IMAGE_MIMES,
  MAX_UPLOAD_BYTES,
  saveUploadedFile,
} from "@/lib/uploads";

// Protected by middleware (path is under /api/admin). Accepts a single image
// file via multipart/form-data (field name "file"), stores it on disk and
// returns the public URL to reference from content.
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Keine Datei gefunden." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return Response.json({ error: "Nur Bilddateien (JPG, PNG, WebP, GIF, AVIF)." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "Das Bild ist zu gross (max. 5 MB)." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();
  const url = await saveUploadedFile(id, bytes, file.type);

  return Response.json({ url });
}
