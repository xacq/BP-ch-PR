import { randomUUID } from "node:crypto";
import { ALLOWED_VIDEO_MIMES, MAX_VIDEO_BYTES, saveUploadedFile } from "@/lib/uploads";

// Protected by middleware (path is under /api/admin). Kept separate from the
// image endpoint so the two size caps and MIME allow-lists can never blur
// together — a 90 MB image or a 5 MB-capped video would both be wrong.
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Keine Datei gefunden." }, { status: 400 });
  }
  if (!ALLOWED_VIDEO_MIMES.includes(file.type)) {
    return Response.json({ error: "Nur Videodateien (MP4 oder WebM)." }, { status: 400 });
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return Response.json({ error: "Das Video ist zu gross (max. 90 MB)." }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();
  const url = await saveUploadedFile(id, bytes, file.type);
  return Response.json({ url });
}
