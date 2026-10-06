import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOADS_DIR = path.join(process.cwd(), "docker", "uploads");

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const MIME_TO_EXT: Record<string, string> = { ...IMAGE_MIME_TO_EXT, ...VIDEO_MIME_TO_EXT };

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
};

export const ALLOWED_IMAGE_MIMES = Object.keys(IMAGE_MIME_TO_EXT);
export const ALLOWED_VIDEO_MIMES = Object.keys(VIDEO_MIME_TO_EXT);
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * The site is published through a Cloudflare Tunnel, and Cloudflare rejects
 * request bodies over 100 MB on the free/pro plans — so the cap has to stay
 * below that or the client gets an opaque proxy error instead of ours.
 */
export const MAX_VIDEO_BYTES = 90 * 1024 * 1024;

export function extensionForMime(mimeType: string): string {
  return MIME_TO_EXT[mimeType] ?? "bin";
}

export function mimeForFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

export function uploadUrl(id: string, mimeType: string): string {
  return `/uploads/${id}.${extensionForMime(mimeType)}`;
}

/**
 * Path-traversal guard for the public /uploads route: a filename must be
 * exactly a UUID plus one of the extensions we ourselves write. Keep this in
 * sync with MIME_TO_EXT — an extension missing here uploads fine and then 404s.
 */
export function isSafeUploadFilename(filename: string): boolean {
  return /^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|gif|avif|mp4|webm)$/i.test(filename);
}

export async function ensureUploadsDir(): Promise<void> {
  await mkdir(UPLOADS_DIR, { recursive: true });
}

export async function saveUploadedFile(
  id: string,
  data: Buffer,
  mimeType: string,
): Promise<string> {
  await ensureUploadsDir();
  const filename = `${id}.${extensionForMime(mimeType)}`;
  await writeFile(path.join(UPLOADS_DIR, filename), data);
  return `/uploads/${filename}`;
}

/** Byte size of an uploaded file, or null when it is missing/unsafe. */
export async function statUploadedFile(filename: string): Promise<number | null> {
  if (!isSafeUploadFilename(filename)) return null;
  try {
    const info = await stat(path.join(UPLOADS_DIR, filename));
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}

/**
 * Streams a byte range of an uploaded file. Videos are tens of megabytes, so
 * they must never be buffered whole — and Safari/iOS refuses to play a source
 * that does not answer Range requests.
 */
export function createUploadReadStream(filename: string, start?: number, end?: number) {
  return createReadStream(path.join(UPLOADS_DIR, filename), { start, end });
}

export async function readUploadedFile(filename: string): Promise<Buffer | null> {
  if (!isSafeUploadFilename(filename)) return null;
  try {
    return await readFile(path.join(UPLOADS_DIR, filename));
  } catch {
    return null;
  }
}

export async function findUploadUrl(id: string): Promise<string | null> {
  await ensureUploadsDir();
  const files = await readdir(UPLOADS_DIR);
  const match = files.find((file) => file.startsWith(`${id}.`));
  return match ? `/uploads/${match}` : null;
}

export function remapLegacyImageUrl(
  value: string,
  urlById: ReadonlyMap<string, string>,
): string {
  const match = value.match(/^\/api\/images\/([0-9a-f-]{36})$/i);
  if (!match) return value;
  return urlById.get(match[1]!) ?? value;
}
