export function isSvgUrl(url: string) {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".svg");
  } catch {
    return url.split(/[?#]/, 1)[0].toLowerCase().endsWith(".svg");
  }
}
