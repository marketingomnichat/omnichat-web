import { PortableText, type PortableTextBlock } from "next-sanity";

export function RichText({ content }: { content?: PortableTextBlock[] }) {
  if (!content?.length) return null;
  return (
    <section className="mx-auto max-w-[720px] px-6 py-14">
      <div className="oc-body flex flex-col gap-4 [&_h2]:oc-h2 [&_h3]:oc-h3 [&_a]:underline">
        <PortableText value={content} />
      </div>
    </section>
  );
}
