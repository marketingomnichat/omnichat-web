// lib/redirects.ts
export type RedirectRule = { from: string; to: string; permanent: boolean };

const strip = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

// Aceita apenas caminhos relativos seguros: "/x" sim; "//evil.com",
// "https://evil.com" e "/\evil.com" não (previne open redirect).
export const isSafeRelativePath = (p: string) => /^\/(?![/\\])/.test(p);

export function matchRedirect(
  pathname: string,
  redirects: RedirectRule[]
): { to: string; permanent: boolean } | null {
  const path = strip(pathname);
  for (const r of redirects) {
    // Nunca redirecionar para o próprio path atual (evita loop infinito,
    // ex.: regra {from:"/precos/", to:"/precos"} com request em "/precos").
    if (strip(r.from) === path && strip(r.to) !== path) {
      return { to: r.to, permanent: r.permanent };
    }
  }
  return null;
}
