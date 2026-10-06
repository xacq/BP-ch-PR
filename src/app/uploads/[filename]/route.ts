import { Readable } from "node:stream";
import {
  createUploadReadStream,
  isSafeUploadFilename,
  mimeForFilename,
  statUploadedFile,
} from "@/lib/uploads";

/**
 * Serves uploaded images and videos.
 *
 * This is a public, unauthenticated route, so the strict filename check comes
 * first. The body is streamed rather than buffered, and HTTP Range requests are
 * answered with 206 — without that, videos cannot be seeked and Safari/iOS will
 * not play them at all.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!isSafeUploadFilename(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const size = await statUploadedFile(filename);
  if (size === null) {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": mimeForFilename(filename),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  const range = parseRange(request.headers.get("range"), size);

  if (range === "invalid") {
    return new Response("Range Not Satisfiable", {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  if (range) {
    const { start, end } = range;
    return new Response(toWebStream(createUploadReadStream(filename, start, end)), {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  return new Response(toWebStream(createUploadReadStream(filename)), {
    headers: { ...headers, "Content-Length": String(size) },
  });
}

/** Parses a single `bytes=start-end` range. Multi-range requests fall back to 200. */
function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | "invalid" | null {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === "" && rawEnd === "") return "invalid";

  let start: number;
  let end: number;

  if (rawStart === "") {
    // Suffix range: the last N bytes.
    const length = Number(rawEnd);
    if (length <= 0) return "invalid";
    start = Math.max(0, size - length);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd === "" ? size - 1 : Math.min(Number(rawEnd), size - 1);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
    return "invalid";
  }
  return { start, end };
}

function toWebStream(stream: Readable): ReadableStream<Uint8Array> {
  return Readable.toWeb(stream) as ReadableStream<Uint8Array>;
}
