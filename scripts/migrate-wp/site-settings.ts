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
import { uploadImageFromUrl } from "./media";

// ── Nav items extracted from #menu-menu-principal in omni.chat header ─────────
type SeedNavChild = {
  label: string;
  href: string;
  iconUrl?: string;
  iconAlt?: string;
};

type SeedNavItem = {
  label: string;
  href: string;
  children?: SeedNavChild[];
};

const NAV_ITEMS: SeedNavItem[] = [
  {
    label: "Produtos",
    href: "#produtos",
    children: [
      {
        label: "Marketing Studio",
        href: "/produto/marketing-studio/",
        iconUrl: "https://omni.chat/wp-content/uploads/2025/10/IA-intelligent-search.png",
        iconAlt: "Ícone de busca para Marketing Studio",
      },
      {
        label: "Vendas",
        href: "/produto/sales-studio/",
        iconUrl: "https://omni.chat/wp-content/uploads/2025/10/IA-specialist.png",
        iconAlt: "Ícone de especialista para Vendas",
      },
    ],
  },
  {
    label: "Soluções",
    href: "#solucoes",
    children: [
      {
        label: "Varejo",
        href: "/solucao/varejo/",
        iconUrl: "https://omni.chat/wp-content/uploads/2025/10/IA-shopping-cart-line.png",
        iconAlt: "Ícone de carrinho para Varejo",
      },
      {
        label: "Educacional",
        href: "/solucao/educacional/",
        iconUrl: "https://omni.chat/wp-content/uploads/2025/10/IA-improve-message.png",
        iconAlt: "Ícone de mensagem para Educacional",
      },
    ],
  },
  {
    label: "Recursos",
    href: "#recursos",
    children: [
      { label: "Blog", href: "/blog/" },
      {
        label: "Casos de Estudo",
        href: "/blog/categoria/cases-de-sucesso/",
      },
      { label: "Eventos", href: "/blog/categoria/eventos/" },
      { label: "Relatórios", href: "/chat-commerce-report/" },
    ],
  },
  {
    label: "Sobre",
    href: "#sobre",
    children: [
      { label: "Sobre nós", href: "/empresa/" },
      { label: "Carreiras", href: "/empresa/#vagas" },
      { label: "Imprensa", href: "/imprensa/" },
      {
        label: "Suporte",
        href: "https://api.whatsapp.com/send/?phone=554137950418&type=phone_number&app_absent=0",
      },
    ],
  },
  { label: "Planos", href: "/planos/" },
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

// ── Footer badges: store buttons + ISO certificates (omni.chat footer 2026-07) ─
const FOOTER_BADGE_SOURCES = [
  {
    wpImageUrl: "https://omni.chat/wp-content/uploads/2025/10/button.png",
    alt: "Logo App Store",
    href: APP_STORE_LINKS.appStoreUrl,
    kind: "store",
    width: 135,
    height: 40,
  },
  {
    wpImageUrl: "https://omni.chat/wp-content/uploads/2025/10/button-1.png",
    alt: "Logo Google Play",
    href: APP_STORE_LINKS.googlePlayUrl,
    kind: "store",
    width: 135,
    height: 40,
  },
  // Selo (PNG real do rodapé) como imagem; certificado completo como destino do link.
  {
    wpImageUrl: "https://omni.chat/wp-content/uploads/2025/11/ISO-IEC-27001-V2-1.png",
    alt: "ISO-IEC 27001",
    href: "https://omni.chat/wp-content/uploads/2025/12/ISO27001.pt.jpg",
    kind: "certificate",
    width: 89,
    height: 128,
  },
  {
    wpImageUrl: "https://omni.chat/wp-content/uploads/2025/12/ISO-IEC-27701-V3.png",
    alt: "ISO-IEC 27701",
    href: "https://omni.chat/wp-content/uploads/2025/12/ISO27701.pt.jpg",
    kind: "certificate",
    width: 95,
    height: 128,
  },
  {
    wpImageUrl: "https://omni.chat/wp-content/uploads/2025/11/ISO-IEC-27018-V2-1.png",
    alt: "ISO-IEC 27018",
    href: "https://omni.chat/wp-content/uploads/2025/12/ISO27018.pt.jpg",
    kind: "certificate",
    width: 95,
    height: 128,
  },
];

// ── Footer copyright text ──────────────────────────────────────────────────────
const FOOTER_TEXT =
  "OmniChat. Todos os direitos reservados.\nAvenida Pref. Osmar Cunha, 416 – Centro, Florianópolis/SC CEP: 88015-100";

export async function migrateSiteSettings(): Promise<void> {
  console.log("\n[migrate] Seeding siteSettings…");

  const navChildrenWithIcons = NAV_ITEMS.flatMap(
    (item) => item.children ?? []
  ).filter(
    (
      child
    ): child is SeedNavChild & Required<Pick<SeedNavChild, "iconUrl" | "iconAlt">> =>
      Boolean(child.iconUrl && child.iconAlt)
  );

  const assetUrls = await Promise.all(
    navChildrenWithIcons.map(async (child) => {
      const assetId = await uploadImageFromUrl(child.iconUrl, child.iconAlt);
      if (!assetId) {
        throw new Error(`Não foi possível enviar o ícone de menu: ${child.label}`);
      }
      const asset = await writeClient.getDocument(assetId);
      if (!asset || typeof asset.url !== "string") {
        throw new Error(`Não foi possível obter a URL Sanity do ícone: ${child.label}`);
      }
      return [child.iconUrl, asset.url] as const;
    })
  );
  const uploadedIconUrls = new Map(assetUrls);

  const badgeAssets = await Promise.all(
    FOOTER_BADGE_SOURCES.map(async (badge) => {
      const assetId = await uploadImageFromUrl(badge.wpImageUrl, badge.alt);
      if (!assetId) {
        throw new Error(`Não foi possível enviar o selo do rodapé: ${badge.alt}`);
      }
      const asset = await writeClient.getDocument(assetId);
      if (!asset || typeof asset.url !== "string") {
        throw new Error(`Não foi possível obter a URL Sanity do selo: ${badge.alt}`);
      }
      return {
        imageUrl: asset.url,
        alt: badge.alt,
        href: badge.href,
        kind: badge.kind,
        width: badge.width,
        height: badge.height,
      };
    })
  );

  const footerBadges = badgeAssets.map((badge, i) => ({
    _key: `badge-${i}`,
    ...badge,
  }));

  // Build nav array with _key for Sanity array items
  const nav = NAV_ITEMS.map((item, i) => ({
    _key: `nav-${i}`,
    label: item.label,
    href: item.href,
    children: item.children?.map((child, childIndex) => ({
      _key: `nav-${i}-child-${childIndex}`,
      label: child.label,
      href: child.href,
      iconUrl: child.iconUrl ? uploadedIconUrls.get(child.iconUrl) : undefined,
      iconAlt: child.iconAlt,
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
    footerBadges,
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
  console.log(`[migrate]   Footer badges: ${footerBadges.length}`);
  console.log("[migrate] siteSettings migration complete.");
}
