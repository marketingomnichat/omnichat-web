import { parse, NodeType, HTMLElement, TextNode } from "node-html-parser";
import { createHash } from "crypto";

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: PortableTextMarkDef[];
  children?: PortableTextSpan[];
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
}

interface ConvertOpts {
  uploadImage: (url: string, alt: string) => Promise<string>;
}

function shortKey(content: string, idx: number): string {
  const hash = createHash("sha1")
    .update(content + idx)
    .digest("hex")
    .slice(0, 8);
  return hash;
}

function isHTMLElement(node: ReturnType<typeof parse> | HTMLElement | TextNode): node is HTMLElement {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

function collectInlineChildren(
  node: HTMLElement,
  activeMarks: string[],
  markDefs: PortableTextMarkDef[],
  idx: { n: number }
): PortableTextSpan[] {
  const spans: PortableTextSpan[] = [];

  for (const child of node.childNodes) {
    if (child.nodeType === NodeType.TEXT_NODE) {
      const text = (child as TextNode).text;
      if (text) {
        spans.push({
          _type: "span",
          _key: shortKey(text + activeMarks.join(","), idx.n++),
          text,
          marks: [...activeMarks],
        });
      }
    } else if (child.nodeType === NodeType.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName?.toLowerCase() ?? "";

      if (tag === "ul" || tag === "ol") {
        // Nested lists become their own blocks (handled by processList) — skip inline
        continue;
      } else if (tag === "strong" || tag === "b") {
        spans.push(...collectInlineChildren(el, [...activeMarks, "strong"], markDefs, idx));
      } else if (tag === "em" || tag === "i") {
        spans.push(...collectInlineChildren(el, [...activeMarks, "em"], markDefs, idx));
      } else if (tag === "a") {
        const href = el.getAttribute("href") ?? "";
        const defKey = shortKey("link" + href, markDefs.length);
        markDefs.push({ _key: defKey, _type: "link", href });
        spans.push(...collectInlineChildren(el, [...activeMarks, defKey], markDefs, idx));
      } else {
        // Unknown inline — treat as plain text
        const text = el.text;
        if (text) {
          spans.push({
            _type: "span",
            _key: shortKey(text, idx.n++),
            text,
            marks: [...activeMarks],
          });
        }
      }
    }
  }

  return spans;
}

function makeTextBlock(
  style: string,
  el: HTMLElement,
  blockIdx: number,
  listItem?: string,
  level?: number
): PortableTextBlock {
  const markDefs: PortableTextMarkDef[] = [];
  const idx = { n: 0 };
  const children = collectInlineChildren(el, [], markDefs, idx);

  const content = el.text + style + blockIdx;
  const block: PortableTextBlock = {
    _type: "block",
    _key: shortKey(content, blockIdx),
    style,
    markDefs,
    children,
  };

  if (listItem) {
    block.listItem = listItem;
    block.level = level ?? 1;
  }

  return block;
}

function processList(
  listEl: HTMLElement,
  blocks: PortableTextBlock[],
  level: number
): void {
  const listItem = listEl.tagName?.toLowerCase() === "ol" ? "number" : "bullet";
  for (const child of listEl.childNodes) {
    if (isHTMLElement(child as HTMLElement)) {
      const liEl = child as HTMLElement;
      if (liEl.tagName?.toLowerCase() === "li") {
        blocks.push(makeTextBlock("normal", liEl, blocks.length, listItem, level));
        // Nested ul/ol inside the li become blocks at level + 1
        for (const liChild of liEl.childNodes) {
          if (isHTMLElement(liChild as HTMLElement)) {
            const nestedTag = (liChild as HTMLElement).tagName?.toLowerCase();
            if (nestedTag === "ul" || nestedTag === "ol") {
              processList(liChild as HTMLElement, blocks, level + 1);
            }
          }
        }
      }
    }
  }
}

async function processNode(
  node: HTMLElement | TextNode | ReturnType<typeof parse>,
  opts: ConvertOpts,
  blocks: PortableTextBlock[],
  listContext: { listItem?: string; level: number }
): Promise<void> {
  if (node.nodeType === NodeType.TEXT_NODE) {
    // Loose text node (e.g. text directly at root level) → normal block
    const text = (node as TextNode).text.trim();
    if (text) {
      blocks.push({
        _type: "block",
        _key: shortKey(text + "normal", blocks.length),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: shortKey(text, 0),
            text,
            marks: [],
          },
        ],
      });
    }
    return;
  }

  if (!isHTMLElement(node as HTMLElement)) return;

  const el = node as HTMLElement;
  const tag = el.tagName?.toLowerCase() ?? "";

  switch (tag) {
    case "p": {
      const text = el.text.trim();
      if (text) {
        blocks.push(makeTextBlock("normal", el, blocks.length));
      }
      break;
    }
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6": {
      blocks.push(makeTextBlock(tag, el, blocks.length));
      break;
    }
    case "blockquote": {
      blocks.push(makeTextBlock("blockquote", el, blocks.length));
      break;
    }
    case "ul":
    case "ol": {
      processList(el, blocks, listContext.level);
      break;
    }
    case "figure": {
      // Look for img inside figure; use figcaption as alt/caption
      const imgEl = el.querySelector("img");
      const captionEl = el.querySelector("figcaption");
      if (imgEl) {
        const src = imgEl.getAttribute("src") ?? "";
        const imgAlt = imgEl.getAttribute("alt") ?? "";
        const alt = imgAlt || captionEl?.text?.trim() || "";
        if (src) {
          const ref = await opts.uploadImage(src, alt);
          if (ref) {
            const block: PortableTextBlock = {
              _type: "image",
              _key: shortKey(src, blocks.length),
              asset: { _ref: ref },
              alt,
            };
            if (captionEl?.text) block.caption = captionEl.text;
            blocks.push(block);
          }
        }
      }
      break;
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      if (src) {
        const ref = await opts.uploadImage(src, alt);
        if (ref) {
          blocks.push({
            _type: "image",
            _key: shortKey(src, blocks.length),
            asset: { _ref: ref },
            alt,
          });
        }
      }
      break;
    }
    case "picture": {
      // <picture> wraps <source> variants + <img> fallback — use the <img>
      const imgEl = el.querySelector("img");
      if (imgEl) {
        const src = imgEl.getAttribute("src") ?? "";
        const alt = imgEl.getAttribute("alt") ?? "";
        if (src) {
          const ref = await opts.uploadImage(src, alt);
          if (ref) {
            blocks.push({
              _type: "image",
              _key: shortKey(src, blocks.length),
              asset: { _ref: ref },
              alt,
            });
          }
        }
      }
      break;
    }
    case "h1": {
      // WP sometimes uses h1 in body — map to h2 to avoid duplicate page-title semantics
      blocks.push(makeTextBlock("h2", el, blocks.length));
      break;
    }
    case "pre":
    case "code": {
      const text = el.text.trim();
      if (text) {
        blocks.push(makeTextBlock("normal", el, blocks.length));
      }
      break;
    }
    case "hr": {
      // Horizontal rules have no Sanity PT equivalent — skip silently
      break;
    }
    case "iframe":
    case "video":
    case "audio": {
      // Embeds cannot be represented in Portable Text — skip silently
      break;
    }
    case "table": {
      // Tables: extract plain text as a normal block — no PT table type
      const text = el.text.trim();
      if (text) {
        blocks.push(makeTextBlock("normal", el, blocks.length));
      }
      break;
    }
    default: {
      // Recurse into container-like unknowns (div, section, article…)
      const containerTags = new Set(["div", "section", "article", "main", "header", "footer", "aside", "nav", "span"]);
      if (containerTags.has(tag)) {
        for (const child of el.childNodes) {
          await processNode(child as HTMLElement, opts, blocks, listContext);
        }
      } else if (tag !== "script" && tag !== "style" && tag !== "" && tag !== "noscript") {
        console.warn(`[migrate] bloco não mapeado: <${tag}>`);
        const text = el.text.trim();
        if (text) {
          blocks.push(makeTextBlock("normal", el, blocks.length));
        }
      }
      break;
    }
  }
}

export async function htmlToPortableText(
  html: string,
  opts: ConvertOpts
): Promise<PortableTextBlock[]> {
  const root = parse(html, { lowerCaseTagName: true });
  const blocks: PortableTextBlock[] = [];

  for (const child of root.childNodes) {
    await processNode(child as HTMLElement, opts, blocks, { level: 1 });
  }

  return blocks;
}
