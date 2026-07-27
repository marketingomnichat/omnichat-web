import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { tagsFor } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json()) as { _type?: string; slug?: { current?: string } | string };
  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  const tags = tagsFor(body._type ?? "", slug);
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: tags });
}
