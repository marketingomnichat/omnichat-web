/**
 * Visual comparison tool: captures full-page screenshots from WP live site
 * and local Next.js server side by side for owner approval.
 *
 * Usage: npx tsx scripts/visual-compare.ts
 * Requires: local server running on http://localhost:3000
 *           (run: npm run build && npm start)
 *
 * Output: docs/superpowers/visual-review/{pagina}-{wp|novo}.png
 */

import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUT_DIR = path.resolve("docs/superpowers/visual-review");

const PAGES: Array<{ slug: string; wpPath: string; localPath: string }> = [
  { slug: "home", wpPath: "/", localPath: "/" },
  { slug: "empresa", wpPath: "/empresa/", localPath: "/empresa" },
  { slug: "planos", wpPath: "/planos/", localPath: "/planos" },
  { slug: "chat-commerce-report", wpPath: "/chat-commerce-report/", localPath: "/chat-commerce-report" },
];

const WP_BASE = "https://omni.chat";
const LOCAL_BASE = "http://localhost:3000";
const VIEWPORT_WIDTH = 1280;

async function captureScreenshot(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>>,
  url: string,
  outputPath: string,
): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`  saved: ${outputPath}`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: VIEWPORT_WIDTH, height: 900 },
    });
    const page = await context.newPage();

    const generated: string[] = [];

    for (const { slug, wpPath, localPath } of PAGES) {
      console.log(`\nCapturing: ${slug}`);

      const wpUrl = `${WP_BASE}${wpPath}`;
      const localUrl = `${LOCAL_BASE}${localPath}`;

      const wpOut = path.join(OUT_DIR, `${slug}-wp.png`);
      const novoOut = path.join(OUT_DIR, `${slug}-novo.png`);

      console.log(`  WP:    ${wpUrl}`);
      await captureScreenshot(page, wpUrl, wpOut);

      console.log(`  Local: ${localUrl}`);
      await captureScreenshot(page, localUrl, novoOut);

      generated.push(wpOut, novoOut);
    }

    console.log("\n--- Screenshots gerados ---");
    for (const p of generated) {
      console.log(p);
    }
    console.log(`\nTotal: ${generated.length} screenshots em ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
