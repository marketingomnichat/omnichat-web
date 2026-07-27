// proxy.ts
import { type NextRequest, NextResponse } from "next/server";
import { isSafeRelativePath, matchRedirect, type RedirectRule } from "./lib/redirects";
import { sanityFetch } from "./lib/sanity/client";
import { REDIRECTS_QUERY } from "./lib/sanity/queries";

const LP_HOST = process.env.NEXT_PUBLIC_LP_HOST ?? "lp.omni.chat";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const isLpHost = host === LP_HOST || host.startsWith("lp.localhost");

  // 1. Host das LPs: tudo vira /lp/<path>; studio e rotas /lp diretas não existem lá.
  if (isLpHost) {
    if (pathname === "/lp" || pathname.startsWith("/lp/") || pathname.startsWith("/studio")) {
      return new NextResponse(null, { status: 404 });
    }
    const url = request.nextUrl.clone();
    url.pathname = `/lp${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Host principal não serve /lp/* direto (conteúdo duplicado entre hosts).
  if (pathname === "/lp" || pathname.startsWith("/lp/")) {
    const rest = pathname.slice(3).replace(/^\/+/, "");
    return NextResponse.redirect(new URL("/" + rest, request.url), 301);
  }

  // 3. Redirects 301 gerenciados no Sanity (cacheados por tag "redirect").
  const redirects = (await sanityFetch<RedirectRule[]>({ query: REDIRECTS_QUERY, tags: ["redirect"] })) ?? [];
  const match = matchRedirect(pathname, redirects);
  if (match && isSafeRelativePath(match.to)) {
    // Preserva a query string da request; se match.to já tiver query
    // própria, os parâmetros são combinados via URLSearchParams.
    const dest = new URL(match.to, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      dest.searchParams.append(key, value);
    });
    return NextResponse.redirect(dest, match.permanent ? 301 : 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|ingest|favicon.ico|.*\\..*).*)"],
};
