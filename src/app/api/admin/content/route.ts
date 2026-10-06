import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent, type SiteContent } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as SiteContent | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });
  }

  await saveContent(body);
  return NextResponse.json({ ok: true });
}
