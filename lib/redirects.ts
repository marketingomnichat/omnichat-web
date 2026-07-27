// lib/redirects.ts
export type RedirectRule = { from: string; to: string; permanent: boolean };

const strip = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

export function matchRedirect(
  pathname: string,
  redirects: RedirectRule[]
): { to: string; permanent: boolean } | null {
  const path = strip(pathname);
  for (const r of redirects) {
    if (strip(r.from) === path && r.to !== r.from) {
      return { to: r.to, permanent: r.permanent };
    }
  }
  return null;
}
