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

      if (tag === "strong" || tag === "b") {
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

async function processNode(
  node: HTMLElement | ReturnType<typeof parse>,
  opts: ConvertOpts,
  blocks: PortableTextBlock[],
  listContext: { listItem?: string; level: number }
): Promise<void> {
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
      const listItem = tag === "ul" ? "bullet" : "number";
      for (const child of el.childNodes) {
        if (isHTMLElement(child as HTMLElement)) {
          const liEl = child as HTMLElement;
          if (liEl.tagName?.toLowerCase() === "li") {
            const block = makeTextBlock("normal", liEl, blocks.length, listItem, 1);
            blocks.push(block);
          }
        }
      }
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
      break;
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      if (src) {
        const ref = await opts.uploadImage(src, alt);
        blocks.push({
          _type: "image",
          _key: shortKey(src, blocks.length),
          asset: { _ref: ref },
          alt,
        });
      }
      break;
    }
    default: {
      // Recurse into container-like unknowns (div, section, article…)
      const containerTags = new Set(["div", "section", "article", "main", "header", "footer", "aside"]);
      if (containerTags.has(tag)) {
        for (const child of el.childNodes) {
          await processNode(child as HTMLElement, opts, blocks, listContext);
        }
      } else if (tag !== "script" && tag !== "style" && tag !== "") {
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
