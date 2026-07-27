import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("acessibilidade", () => {
  for (const path of ["/", "/styleguide", "/blog"]) {
    test(`${path} sem violações críticas de a11y`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      expect(critical, critical.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
    });
  }
});
