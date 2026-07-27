/**
 * extract-wp-tokens.mjs
 * Extrai design tokens visuais do site omni.chat via Playwright.
 * Run: node scripts/extract-wp-tokens.mjs
 */

import { chromium } from 'playwright';

const PAGES = ['/', '/empresa/', '/planos/', '/chat-commerce-report/'];
const BASE = 'https://omni.chat';
const VIEWPORT = { width: 1280, height: 900 };

async function scrollFull(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

function rgb2hex(rgb) {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return 'transparent';
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return rgb;
  const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
  if (a === 0) return 'transparent';
  const hex = '#' + [m[1], m[2], m[3]].map(v => parseInt(v).toString(16).padStart(2, '0')).join('');
  return a < 1 ? `${hex} / alpha ${a}` : hex;
}

async function getComputedStyles(page, selector, props) {
  return page.evaluate(({ sel, props }) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    const result = { selector: sel };
    for (const p of props) result[p] = cs.getPropertyValue(p);
    return result;
  }, { sel: selector, props });
}

async function extractPageTokens(page, url) {
  console.log(`\nFetching ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await scrollFull(page);

  // ---- Fonts loaded ----
  const fontInfo = await page.evaluate(() => {
    const links = [...document.querySelectorAll('link[href*="fonts.google"], link[href*="fonts.gstatic"]')]
      .map(l => l.href);
    const styles = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .filter(l => l.href.includes('font'))
      .map(l => l.href);
    let fontFaces = [];
    try {
      fontFaces = [...document.fonts].map(f => ({
        family: f.family,
        style: f.style,
        weight: f.weight,
        status: f.status,
      }));
    } catch(e) {}
    return { googleFontLinks: [...links, ...styles], fontFaces };
  });

  // ---- Typographic elements ----
  const typoSelectors = [
    'h1', 'h2', 'h3', 'h4', 'p',
    'nav a', 'button', '.wp-block-button__link',
    '.elementor-button', 'a.btn', 'a.button',
    '.nav-link', 'header a',
  ];
  const typoProps = ['font-family','font-size','font-weight','line-height','letter-spacing','color','text-transform'];
  const typoTokens = {};
  for (const sel of typoSelectors) {
    const res = await getComputedStyles(page, sel, typoProps);
    if (res) typoTokens[sel] = res;
  }

  // ---- Colors ----
  const colorSelectors = [
    'body', 'header', '#masthead', '.site-header', '.header-global', '.elementor-location-header',
    'footer', '#colophon', '.site-footer', '.elementor-location-footer',
    'main', '#main',
  ];
  const colorProps = ['background-color', 'color', 'border-color'];
  const colorTokens = {};
  for (const sel of colorSelectors) {
    const res = await getComputedStyles(page, sel, colorProps);
    if (res) colorTokens[sel] = res;
  }

  // ---- Sections in order ----
  const sectionData = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('section, .elementor-section, .wp-block-group, [class*="section"], [class*="hero"]')];
    return sections.slice(0, 20).map((s, i) => {
      const cs = window.getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      return {
        index: i,
        tag: s.tagName,
        classes: s.className.substring(0, 120),
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        backgroundImage: cs.backgroundImage.substring(0, 200),
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        minHeight: cs.minHeight,
        approxTop: Math.round(rect.top + window.scrollY),
      };
    });
  });

  // ---- Buttons detail ----
  const buttonData = await page.evaluate(() => {
    const btns = [
      ...document.querySelectorAll('a.wp-block-button__link, .elementor-button, a.btn, button, a.button, [class*="btn-"]'),
    ];
    return btns.slice(0, 10).map(b => {
      const cs = window.getComputedStyle(b);
      return {
        text: b.textContent.trim().substring(0, 60),
        classes: b.className.substring(0, 120),
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        borderRadius: cs.borderRadius,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        textTransform: cs.textTransform,
        boxShadow: cs.boxShadow,
        border: cs.border,
        letterSpacing: cs.letterSpacing,
      };
    });
  });

  // ---- Header detail ----
  const headerData = await page.evaluate(() => {
    const hdr = document.querySelector('header, #masthead, .site-header, .elementor-location-header, [class*="header"]');
    if (!hdr) return null;
    const cs = window.getComputedStyle(hdr);
    const logo = document.querySelector('header img, .site-branding img, .elementor-widget-theme-site-logo img, #masthead img');
    const navItems = [...document.querySelectorAll('header nav a, header .menu a, header .nav-menu a, .elementor-nav-menu a')]
      .slice(0, 15).map(a => ({ text: a.textContent.trim(), href: a.href }));
    return {
      tag: hdr.tagName,
      classes: hdr.className.substring(0, 200),
      height: hdr.getBoundingClientRect().height,
      backgroundColor: cs.backgroundColor,
      position: cs.position,
      zIndex: cs.zIndex,
      boxShadow: cs.boxShadow,
      logoSrc: logo ? logo.src : null,
      logoWidth: logo ? logo.width : null,
      logoHeight: logo ? logo.height : null,
      navItems,
    };
  });

  // ---- Footer detail ----
  const footerData = await page.evaluate(() => {
    const ftr = document.querySelector('footer, #colophon, .site-footer, .elementor-location-footer');
    if (!ftr) return null;
    const cs = window.getComputedStyle(ftr);
    const cols = [...ftr.querySelectorAll('.elementor-column, .wp-block-column, .widget, [class*="col-"]')];
    return {
      tag: ftr.tagName,
      classes: ftr.className.substring(0, 200),
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      columnCount: cols.length,
      linkColor: (() => {
        const a = ftr.querySelector('a');
        return a ? window.getComputedStyle(a).color : null;
      })(),
    };
  });

  // ---- Container/layout ----
  const layoutData = await page.evaluate(() => {
    const containers = [...document.querySelectorAll('.container, .wp-block-group__inner-container, .elementor-container, .e-con-inner, [class*="container"]')];
    return containers.slice(0, 5).map(c => {
      const cs = window.getComputedStyle(c);
      return {
        classes: c.className.substring(0, 120),
        maxWidth: cs.maxWidth,
        width: c.getBoundingClientRect().width,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
      };
    });
  });

  // ---- Cards / testimonials ----
  const cardData = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('[class*="card"], [class*="testimonial"], [class*="depoimento"], [class*="review"], .elementor-widget-testimonial, [class*="feature"]')];
    return cards.slice(0, 8).map(c => {
      const cs = window.getComputedStyle(c);
      return {
        classes: c.className.substring(0, 120),
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        border: cs.border,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
      };
    });
  });

  // ---- Stats / numbers sections ----
  const statsData = await page.evaluate(() => {
    const statsEls = [...document.querySelectorAll('[class*="stat"], [class*="number"], [class*="count"], [class*="kpi"], [class*="metric"]')];
    return statsEls.slice(0, 6).map(s => {
      const cs = window.getComputedStyle(s);
      return {
        classes: s.className.substring(0, 120),
        text: s.textContent.trim().substring(0, 80),
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });
  });

  return {
    url,
    fontInfo,
    typoTokens,
    colorTokens,
    sectionData,
    buttonData,
    headerData,
    footerData,
    layoutData,
    cardData,
    statsData,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  const results = {};
  for (const path of PAGES) {
    try {
      results[path] = await extractPageTokens(page, BASE + path);
    } catch (e) {
      console.error(`Error on ${path}:`, e.message);
      results[path] = { error: e.message };
    }
  }

  await browser.close();

  // Output JSON for processing
  const out = JSON.stringify(results, null, 2);
  process.stdout.write(out);
}

main().catch(e => { console.error(e); process.exit(1); });
