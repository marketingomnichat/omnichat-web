import { describe, expect, it } from "vitest";
import { Panel, panelElevationClass } from "../components/ui/panel";

describe("panelElevationClass", () => {
  it("border e shadow são exclusivos", () => {
    expect(panelElevationClass("border")).toContain("border");
    expect(panelElevationClass("border")).not.toContain("shadow-oc");
    expect(panelElevationClass("shadow")).toContain("shadow-oc");
    expect(panelElevationClass("shadow")).not.toContain("border-oc-divider");
  });

  it("usa superfície escura quando solicitada", () => {
    const panel = Panel({ surface: "dark", children: "Conteúdo" });

    expect(panel.props.className).toContain("bg-oc-dark");
    expect(panel.props.className).not.toContain("hover:shadow-oc-panel");
  });
});
