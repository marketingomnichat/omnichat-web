import { describe, it, expect, vi } from "vitest";
import { htmlToPortableText } from "../scripts/migrate-wp/html-to-pt";

const noUpload = { uploadImage: async () => "image-fake" };

describe("htmlToPortableText", () => {
  it("converte parágrafos e headings", async () => {
    const blocks = await htmlToPortableText(
      "<h2>Título</h2><p>Texto <strong>forte</strong>.</p>",
      noUpload
    );
    expect(blocks[0]).toMatchObject({ _type: "block", style: "h2" });
    expect(blocks[1].children!.map((c: { text: string }) => c.text).join("")).toBe(
      "Texto forte."
    );
    expect(blocks[1].children![1].marks).toContain("strong");
  });

  it("converte listas e links", async () => {
    const blocks = await htmlToPortableText(
      '<ul><li><a href="https://x.y">item</a></li></ul>',
      noUpload
    );
    expect(blocks[0]).toMatchObject({ _type: "block", listItem: "bullet" });
    expect(blocks[0].markDefs![0]).toMatchObject({ _type: "link", href: "https://x.y" });
  });

  it("converte imagem chamando uploadImage", async () => {
    const up = vi.fn(async () => "image-abc");
    const blocks = await htmlToPortableText(
      '<img src="https://omni.chat/a.png" alt="x">',
      { uploadImage: up }
    );
    expect(up).toHaveBeenCalledWith("https://omni.chat/a.png", "x");
    expect(blocks[0]).toMatchObject({ _type: "image", asset: { _ref: "image-abc" } });
  });

  it("converte listas ordenadas", async () => {
    const blocks = await htmlToPortableText(
      "<ol><li>primeiro</li><li>segundo</li></ol>",
      noUpload
    );
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({ _type: "block", listItem: "number" });
    expect(blocks[1]).toMatchObject({ _type: "block", listItem: "number" });
  });

  it("converte blockquote", async () => {
    const blocks = await htmlToPortableText("<blockquote>Citação</blockquote>", noUpload);
    expect(blocks[0]).toMatchObject({ _type: "block", style: "blockquote" });
  });

  it("converte figure com figcaption", async () => {
    const up = vi.fn(async () => "image-fig");
    const blocks = await htmlToPortableText(
      '<figure><img src="https://omni.chat/fig.png" alt=""><figcaption>Caption</figcaption></figure>',
      { uploadImage: up }
    );
    expect(up).toHaveBeenCalledWith("https://omni.chat/fig.png", "Caption");
    expect(blocks[0]).toMatchObject({ _type: "image", asset: { _ref: "image-fig" } });
  });

  it("avisa sobre blocos não mapeados", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await htmlToPortableText("<video><source src='x.mp4'></video>", noUpload);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("video"));
    warnSpy.mockRestore();
  });

  it("_key é determinístico para o mesmo conteúdo", async () => {
    const blocks1 = await htmlToPortableText("<p>Olá mundo</p>", noUpload);
    const blocks2 = await htmlToPortableText("<p>Olá mundo</p>", noUpload);
    expect(blocks1[0]._key).toBe(blocks2[0]._key);
  });
});
