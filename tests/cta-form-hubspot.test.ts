import { describe, expect, it } from "vitest";
import { buildHubSpotPayload, isSafeFormAction } from "../lib/hubspot-form";

describe("buildHubSpotPayload", () => {
  it("monta fields a partir do FormData", () => {
    const fd = new FormData();
    fd.set("email", "a@b.com");
    fd.set("nome", "Ana");
    expect(buildHubSpotPayload(fd, "https://omni.chat/", "Home")).toEqual({
      fields: [
        { name: "email", value: "a@b.com" },
        { name: "nome", value: "Ana" },
      ],
      context: { pageUri: "https://omni.chat/", pageName: "Home" },
    });
  });
});

describe("isSafeFormAction", () => {
  it("aceita https e path relativo de barra única", () => {
    expect(isSafeFormAction("https://api.hsforms.com/submit")).toBe(true);
    expect(isSafeFormAction("/api/hubspot-form")).toBe(true);
  });

  it("rejeita protocol-relative e esquemas inseguros", () => {
    expect(isSafeFormAction("//evil.com")).toBe(false);
    expect(isSafeFormAction("javascript:alert(1)")).toBe(false);
  });
});
