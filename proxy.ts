// proxy.ts
import { type NextRequest, NextResponse } from "next/server";
import { isSafeRelativePath, matchRedirect, type RedirectRule } from "./lib/redirects";
import { sanityFetch } from "./lib/sanity/client";
import { REDIRECTS_QUERY } from "./lib/sanity/queries";

const LP_HOST = process.env.NEXT_PUBLIC_LP_HOST ?? "lp.omni.chat";

const REDIRECT_TTL_MS = 60_000; // 60 seconds
let redirectCache: { rules: RedirectRule[]; at: number } | null = null;

export function isFresh(at: number, now: number, ttlMs: number): boolean {
  return now - at < ttlMs;
}

// Somente para testes: reseta o cache em memória entre casos de teste.
export function __resetRedirectCacheForTest(): void {
  redirectCache = null;
}

export async function fetchRedirectRules(
  fetcher: typeof sanityFetch = sanityFetch
): Promise<RedirectRule[]> {
  const now = Date.now();

  if (redirectCache && isFresh(redirectCache.at, now, REDIRECT_TTL_MS)) {
    return redirectCache.rules;
  }

  try {
    const rules = (await fetcher<RedirectRule[]>({ query: REDIRECTS_QUERY, tags: [] })) ?? [];
    redirectCache = { rules, at: now };
    return rules;
  } catch (err) {
    console.warn("[proxy] Failed to fetch redirect rules from Sanity:", err);
    if (redirectCache) {
      console.warn("[proxy] Using stale redirect cache as fallback.");
      return redirectCache.rules;
    }
    console.warn("[proxy] No cache available — skipping redirects.");
    return [];
  }
}

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

  // 3. Redirects 301 gerenciados no Sanity (cache em memória com TTL de 60s;
  //    em caso de falha do Sanity usa cache stale ou array vazio como fallback).
  const redirects = await fetchRedirectRules();
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
