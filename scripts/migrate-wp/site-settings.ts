/**
 * WP → Sanity migration: siteSettings singleton.
 *
 * Seeds the siteSettings document with navigation and footer data
 * extracted from the rendered HTML of https://omni.chat (2026-07-27).
 *
 * This is a seed with hardcoded literal values — not a generic HTML parser.
 * Idempotent: uses createOrReplace on the singleton `siteSettings` document.
 */

import { writeClient } from "./sanity-write";

// ── Nav items extracted from #menu-menu-principal in omni.chat header ─────────
const NAV_ITEMS = [
  {
    label: "Produtos",
    href: "#produtos",
    children: [
      { label: "Marketing Studio", href: "/produto/marketing-studio/" },
      { label: "Vendas", href: "/produto/sales-studio/" },
    ],
  },
  {
    label: "Soluções",
    href: "#solucoes",
    children: [
      { label: "Varejo", href: "/solucao/varejo/" },
      { label: "Educacional", href: "/solucao/educacional/" },
    ],
  },
  { label: "Planos", href: "/planos/" },
  { label: "Empresa", href: "/empresa/" },
  { label: "Conteúdo", href: "/blog/" },
];

// ── Footer columns extracted from omni.chat footer (2026-07-27) ───────────────
const FOOTER_COLUMNS = [
  {
    title: "Produtos",
    links: [
      { label: "Educacional", href: "https://omni.chat/solucao/educacional/" },
      { label: "Varejo", href: "https://omni.chat/solucao/varejo/" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre a OmniChat", href: "/empresa/" },
      {
        label: "Trabalhe conosco",
        href: "https://app.pipefy.com/organizations/300459300/interfaces/2a5f99f1-99bb-4230-9ac5-3cfeaf1e27a8/pages/d93181f1-ff32-4336-ae02-ee729c1ccde7",
      },
    ],
  },
  {
    title: "Planos",
    links: [
      {
        label: "Agende uma demo",
        href: "https://api.whatsapp.com/send/?phone=554137950418&text=Ol%C3%A1%2C+vim+do+site+e+quero+falar+com+o+Whizz%21&type=phone_number&app_absent=0",
      },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "OmniBlog", href: "/blog/" },
      { label: "OmniCast", href: "https://omni.chat/categoria/omnicast/" },
      { label: "Materiais gratuitos", href: "/blog/" },
      { label: "Chat Commerce Report", href: "/chat-commerce-report/" },
    ],
  },
  {
    title: "Segurança",
    links: [
      { label: "Política de privacidade", href: "/politicas-de-privacidade/" },
      { label: "Segurança da informação", href: "https://security.omni.chat/" },
      { label: "Termos de uso", href: "/termos-de-uso/" },
      {
        label: "Código de ética e conduta",
        href: "https://omni.chat/wp-content/uploads/2025/12/Codigo-de-Conduta-Omnichat.pdf",
      },
    ],
  },
  {
    title: "Ajuda",
    links: [
      {
        label: "Entre em contato",
        href: "https://api.whatsapp.com/send/?phone=554137950418&text=Ol%C3%A1%2C+vim+do+site+e+quero+falar+com+o+Whizz%21&type=phone_number&app_absent=0",
      },
    ],
  },
];

// ── Social links extracted from footer "Siga a Omni" section ──────────────────
const SOCIAL_LINKS = [
  { platform: "linkedin", url: "https://www.linkedin.com/company/omnichat" },
  { platform: "instagram", url: "https://www.instagram.com/omni.chat/" },
  { platform: "youtube", url: "https://www.youtube.com/@OmniChat" },
];

// ── App store links (footer "Baixe o aplicativo") ─────────────────────────────
const APP_STORE_LINKS = {
  appStoreUrl: "https://apps.apple.com/us/app/omniapp/id6444033217",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=chat.omni.app.omniapp&pli=1",
};

// ── Footer copyright text ──────────────────────────────────────────────────────
const FOOTER_TEXT =
  "OmniChat. Todos os direitos reservados.\nAvenida Pref. Osmar Cunha, 416 – Centro, Florianópolis/SC CEP: 88015-100";

export async function migrateSiteSettings(): Promise<void> {
  console.log("\n[migrate] Seeding siteSettings…");

  // Build nav array with _key for Sanity array items
  const nav = NAV_ITEMS.map((item, i) => ({
    _key: `nav-${i}`,
    label: item.label,
    href: item.href,
    children: item.children?.map((child, childIndex) => ({
      _key: `nav-${i}-child-${childIndex}`,
      label: child.label,
      href: child.href,
    })),
  }));

  // Build social array with _key
  const social = SOCIAL_LINKS.map((item, i) => ({
    _key: `social-${i}`,
    platform: item.platform,
    url: item.url,
  }));

  // Build footer columns as structured array for the footerColumns field
  const footerColumns = FOOTER_COLUMNS.map((col, ci) => ({
    _key: `col-${ci}`,
    title: col.title,
    links: col.links.map((l, li) => ({
      _key: `link-${ci}-${li}`,
      label: l.label,
      href: l.href,
    })),
  }));

  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "OmniChat",
    nav,
    footerText: FOOTER_TEXT,
    footerColumns,
    social,
    appStoreLinks: APP_STORE_LINKS,
    organization: {
      name: "OmniChat",
      legalName: "OmniChat Tecnologia da Informação Ltda",
      url: "https://omni.chat",
      logoUrl: "https://omni.chat/wp-content/uploads/2025/12/Conteudo.svg",
      sameAs: [
        "https://www.linkedin.com/company/omnichat",
        "https://www.instagram.com/omni.chat/",
        "https://www.youtube.com/@OmniChat",
        "https://www.facebook.com/omnichatapp",
      ],
    },
  };

  await writeClient.createOrReplace(
    doc as Parameters<typeof writeClient.createOrReplace>[0]
  );

  console.log("[migrate] ✓ siteSettings upserted.");
  console.log(`[migrate]   Nav items: ${nav.length}`);
  console.log(`[migrate]   Social links: ${social.length}`);
  console.log(`[migrate]   Footer columns: ${footerColumns.length}`);
  console.log("[migrate] siteSettings migration complete.");
}
