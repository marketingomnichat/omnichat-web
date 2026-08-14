const SEO_FIELDS = `seo{metaTitle, metaDescription, canonical, "ogImage": ogImage.asset->url, noIndex}`;

export const COVER_IMAGE_FIELDS = `coverImage{alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}`;

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
  title, "slug": slug.current, excerpt, body, publishedAt, ${SEO_FIELDS}, ${COVER_IMAGE_FIELDS},
  "author": author->{name, role}, "categories": categories[]->{title, "slug": slug.current},
  faq[]{question, answer}
}`;

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, publishedAt, ${COVER_IMAGE_FIELDS},
  "categories": categories[]->{title, "slug": slug.current}
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`;

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName, nav[]{label, href, children[]{label, href, iconUrl, iconAlt}}, footerText,
  footerColumns[]{title, links[]{label, href}},
  social[]{platform, url},
  appStoreLinks{appStoreUrl, googlePlayUrl},
  footerBadges[]{imageUrl, alt, href},
  organization{name, legalName, url, logoUrl, sameAs}
}`;

export const LANDING_PAGE_QUERY = `*[_type == "landingPage" && slug.current == $slug][0]{
  title, "slug": slug.current, ${SEO_FIELDS},
  sections[]{..., _type, _key}
}`;

export const LANDING_PAGE_SLUGS_QUERY = `*[_type == "landingPage" && defined(slug.current)].slug.current`;

export const REDIRECTS_QUERY = `*[_type == "redirect"]{ "from": from, "to": to, "permanent": permanent }`;

export const LLMS_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{title, "slug": slug.current},
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){title, "slug": slug.current, excerpt}
}`;
