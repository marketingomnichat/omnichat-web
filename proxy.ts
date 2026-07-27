// proxy.ts
import { type NextRequest, NextResponse } from "next/server";
import { matchRedirect, type RedirectRule } from "./lib/redirects";
import { sanityFetch } from "./lib/sanity/client";
import { REDIRECTS_QUERY } from "./lib/sanity/queries";

const LP_HOST = process.env.NEXT_PUBLIC_LP_HOST ?? "lp.omni.chat";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const isLpHost = host === LP_HOST || host.startsWith("lp.localhost");

  // 1. Host das LPs: tudo vira /lp/<path>; studio e rotas do site não existem lá.
  if (isLpHost) {
    if (pathname.startsWith("/lp/") || pathname.startsWith("/studio")) {
      return NextResponse.redirect(new URL(`https://${LP_HOST}/`, request.url), 308);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/lp${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Host principal não serve /lp/* direto (conteúdo duplicado entre hosts).
  if (pathname.startsWith("/lp")) {
    return NextResponse.redirect(new URL(pathname.replace(/^\/lp\/?/, "/"), request.url), 308);
  }

  // 3. Redirects 301 gerenciados no Sanity (cacheados por tag "redirect").
  const redirects = (await sanityFetch<RedirectRule[]>({ query: REDIRECTS_QUERY, tags: ["redirect"] })) ?? [];
  const match = matchRedirect(pathname, redirects);
  if (match) {
    const dest = new URL(match.to + search, request.url); // preserva query string
    return NextResponse.redirect(dest, match.permanent ? 308 : 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|ingest|favicon.ico|.*\\..*).*)"],
};
