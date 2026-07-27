const SEO_FIELDS = `seo{metaTitle, metaDescription, canonical, "ogImage": ogImage.asset->url, noIndex}`;

export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title, "slug": slug.current, ${SEO_FIELDS},
  sections[]{..., _type, _key}
}`;

export const HOME_QUERY = `*[_type == "page" && slug.current == "home"][0]{
  title, "slug": slug.current, ${SEO_FIELDS},
  sections[]{..., _type, _key}
}`;

export const PAGE_SLUGS_QUERY = `*[_type == "page" && defined(slug.current) && slug.current != "home"].slug.current`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title, "slug": slug.current, excerpt, body, publishedAt, ${SEO_FIELDS},
  "author": author->{name, role}, "categories": categories[]->{title, "slug": slug.current},
  faq[]{question, answer}
}`;

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, publishedAt,
  "categories": categories[]->{title, "slug": slug.current}
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`;

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName, nav[]{label, href}, footerText,
  social[]{platform, url},
  organization{name, legalName, url, logoUrl, sameAs}
}`;

export const REDIRECTS_QUERY = `*[_type == "redirect"]{ "from": from, "to": to, "permanent": permanent }`;

export const LLMS_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{title, "slug": slug.current},
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){title, "slug": slug.current, excerpt}
}`;
