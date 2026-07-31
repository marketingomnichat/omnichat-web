import { describe, expect, it } from "vitest";
import { resolveHeaderAppearance } from "../components/site/header-appearance";

describe("resolveHeaderAppearance", () => {
  it("hero home no topo fica overlay escuro", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: true, scrolled: false })).toBe("darkOverlay");
  });

  it("após scroll vira sólido claro mesmo na home", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: true, scrolled: true })).toBe("lightSolid");
  });

  it("blog sempre sólido claro", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: false, scrolled: false })).toBe("lightSolid");
  });
});
