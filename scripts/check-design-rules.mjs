#!/usr/bin/env node
/**
 * Guardrails do Design System OmniChat. Roda em lint/CI.
 *
 * 1. Contraste: #FFBC00 nunca carrega tinta branca (WCAG AA com #21232C é
 *    verificado por cálculo; combinações bg-amarelo + text-white são grep).
 * 2. Whizz: roxo #532673 / tint / tokens só podem aparecer em components/whizz/.
 * 3. Card: borda e sombra juntas na mesma className é erro.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "components", "lib", "src"];
// .md puro é documentação (pode citar os hex); .mdx renderiza UI e entra no scan.
const SCAN_EXT = /\.(tsx?|jsx?|css|mdx)$/;
const IGNORE = /node_modules|\.next|\.git/;

const errors = [];

// --- 1a. Contraste por cálculo (WCAG) -------------------------------------
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const CTA = "#FFBC00";
const INK = "#21232C";
const WHITE = "#FFFFFF";

// Tinta escura sobre o CTA precisa passar AA (4.5:1 para texto normal).
if (contrast(CTA, INK) < 4.5) {
  errors.push(
    `Contraste ink sobre CTA (${CTA}/${INK}) abaixo de AA: ${contrast(CTA, INK).toFixed(2)}`
  );
}
// Sanidade: branco sobre CTA de fato reprova — se um dia passar, o token mudou.
if (contrast(CTA, WHITE) >= 4.5) {
  errors.push(
    `Inesperado: branco sobre CTA passou AA — revise os tokens de amarelo.`
  );
}

// --- Varredura de arquivos -------------------------------------------------
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (IGNORE.test(full)) continue;
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (SCAN_EXT.test(name)) yield full;
  }
}

const files = SCAN_DIRS.flatMap((d) => {
  try {
    return [...walk(join(ROOT, d))];
  } catch {
    return [];
  }
});

// O raio (--radius-oc-whizz / rounded-oc-whizz) é geometria, permitido global;
// cores e classe .oc-whizz são o sinal de IA e ficam restritas.
const WHIZZ_PATTERNS = [/#532673/i, /#EEE0FF/i, /(?<!radius-|rounded-)oc-whizz/];
const CLASSNAME_RE = /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g;

for (const file of files) {
  const rel = relative(ROOT, file);
  const content = readFileSync(file, "utf8");
  const isWhizz = rel.startsWith(join("components", "whizz"));

  // 2. Exclusividade Whizz
  if (!isWhizz) {
    for (const pattern of WHIZZ_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(
          `${rel}: token/cor Whizz (${pattern}) fora de components/whizz/ — roxo é exclusivo de momentos de IA.`
        );
      }
    }
  }

  // 1b e 3. Regras por className
  for (const match of content.matchAll(CLASSNAME_RE)) {
    const cls = match[1] ?? match[2] ?? match[3] ?? "";

    if (
      /bg-oc-(yellow-cta|yellow-mass|attention)\b/.test(cls) &&
      /text-(white|oc-surface)\b/.test(cls)
    ) {
      errors.push(
        `${rel}: tinta branca sobre amarelo ("${cls.trim()}") — #FFBC00 só carrega tinta escura.`
      );
    }

    if (
      /rounded-oc-card\b/.test(cls) &&
      /\bborder\b/.test(cls) &&
      /shadow-oc-/.test(cls)
    ) {
      errors.push(
        `${rel}: card com borda E sombra ("${cls.trim()}") — use uma ou outra (prop elevation do Card).`
      );
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} violação(ões) do design system:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ Design system OK (${files.length} arquivos verificados).`);
