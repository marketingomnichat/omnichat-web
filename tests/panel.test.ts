import { describe, expect, it } from "vitest";
import { panelElevationClass } from "../components/ui/panel";

describe("panelElevationClass", () => {
  it("border e shadow são exclusivos", () => {
    expect(panelElevationClass("border")).toContain("border");
    expect(panelElevationClass("border")).not.toContain("shadow-oc");
    expect(panelElevationClass("shadow")).toContain("shadow-oc");
    expect(panelElevationClass("shadow")).not.toContain("border-oc-divider");
  });
});
