import { describe, expect, it } from "vitest";
import { buildMetadata } from "../lib/seo";

describe("buildMetadata", () => {
  it("usa metaTitle do seo quando existe, senão title", () => {
    expect(buildMetadata({ seo: { metaTitle: "X" }, title: "Y", path: "/a" }).title).toBe("X");
    expect(buildMetadata({ seo: null, title: "Y", path: "/a" }).title).toBe("Y");
  });
  it("canonical self-referencing por padrão", () => {
    const m = buildMetadata({ seo: null, title: "T", path: "/precos" });
    expect(m.alternates?.canonical).toBe("https://omni.chat/precos");
  });
  it("respeita canonical custom e noIndex", () => {
    const m = buildMetadata({ seo: { canonical: "https://omni.chat/outro", noIndex: true }, title: "T", path: "/a" });
    expect(m.alternates?.canonical).toBe("https://omni.chat/outro");
    expect(m.robots).toEqual({ index: false, follow: false });
  });
});
