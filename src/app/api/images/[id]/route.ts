import { findUploadUrl } from "@/lib/uploads";

// Legacy URL from the old DB-backed storage. Redirects to /uploads/{id}.{ext}
// so bookmarks and cached HTML keep working after migration.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = await findUploadUrl(id);
  if (!url) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(new URL(url, request.url), 301);
}
