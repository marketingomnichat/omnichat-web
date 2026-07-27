// URLs vindas do CMS podem ser editadas por qualquer conta do Studio —
// nunca renderizar esquemas executáveis (javascript:, data:) nem
// protocol-relative (//host, vira open redirect).
const SAFE_HREF = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;

export function safeHref(href: string | undefined | null): string {
  if (!href) return "#";
  return SAFE_HREF.test(href) ? href : "#";
}
