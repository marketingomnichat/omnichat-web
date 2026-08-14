export type HeaderAppearance = "darkOverlay" | "lightSolid";

export function resolveHeaderAppearance(input: {
  onDarkHeroRoute: boolean;
  scrolled: boolean;
}): HeaderAppearance {
  if (input.onDarkHeroRoute && !input.scrolled) return "darkOverlay";
  return "lightSolid";
}

export const HEADER_SCROLL_THRESHOLD_PX = 24;
