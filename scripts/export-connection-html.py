#!/usr/bin/env python3
"""
Exporta a rota /connection como página HTML estática autocontida.

Uso: python3 scripts/export-connection-html.py
Saída: dist/connection-html/index.html + dist/connection-html/assets/*

Pipeline:
1. Parte do HTML pré-renderizado do build (.next/server/app/connection.html).
2. Inline do CSS compilado (chunks do Tailwind + connection.css).
3. Substitui o next/font (Lato hasheado) por Google Fonts.
4. Troca URLs do next/image (/_next/image?url=...) pelos assets diretos.
5. Copia os assets de public/connection para dist/connection-html/assets/.
6. Remove os scripts do Next e injeta JS vanilla com os mesmos comportamentos:
   reveal on scroll, contadores animados, tabs com auto-rotate, guard do vídeo.
"""

import re
import shutil
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_HTML = ROOT / ".next/server/app/connection.html"
OUT_DIR = ROOT / "dist/connection-html"
ASSETS_DIR = OUT_DIR / "assets"

html = SRC_HTML.read_text(encoding="utf-8")

# ── 1. CSS: inline dos chunks ────────────────────────────────────────────────
css_hrefs = re.findall(r'href="(/_next/static/[^"]+\.css)"', html)
css_parts = []
for href in dict.fromkeys(css_hrefs):
    css_file = ROOT / ".next" / href.replace("/_next/", "")
    css_parts.append(css_file.read_text(encoding="utf-8"))
css = "\n".join(css_parts)

# next/font: o CSS compilado declara @font-face com src /_next/static/media/*.
# Removemos esses @font-face e apontamos a família hasheada para Lato (Google Fonts).
css = re.sub(r"@font-face\s*\{[^}]*/_next/static/media/[^}]*\}", "", css)
lato_hashed = set(re.findall(r"font-family:\s*['\"](__Lato[^'\"]*)['\"]", css))
for name in lato_hashed:
    css = css.replace(f"'{name}'", "'Lato'").replace(f'"{name}"', '"Lato"')
css = re.sub(r"font-family:\s*__Lato[^;,}]*", "font-family: 'Lato'", css)

# ── 2. Remove <link> de CSS do Next e scripts ────────────────────────────────
html = re.sub(r'<link[^>]+href="/_next/static/[^"]+\.css"[^>]*/?>', "", html)
html = re.sub(r'<link[^>]+rel="preload"[^>]*/_next/[^>]*/?>', "", html)
html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)

# ── 3. next/image → asset direto ─────────────────────────────────────────────
def unwrap_next_image(match: re.Match) -> str:
    query = urllib.parse.parse_qs(urllib.parse.urlparse(match.group(1)).query)
    return query["url"][0]

html = re.sub(r'srcSet="[^"]*"', "", html)
html = re.sub(r'srcset="[^"]*"', "", html)
html = re.sub(r'"(/_next/image\?[^"]+)"', lambda m: f'"{unwrap_next_image(m)}"', html)

# ── 4a. Mídias já hospedadas no HubSpot (mesmas da LP antiga) ────────────────
HUBSPOT = "https://20121735.fs1.hubspotusercontent-na1.net/hubfs/20121735/Connection%20-%20set%202026"
HUBSPOT_MEDIA = {
    "connection-logo-negative.svg": f"{HUBSPOT}/connection-logo-negative.svg",
    "connection-gradient-2026.svg": f"{HUBSPOT}/grafismo-connection-gradient.svg",  # arquivo idêntico
    "speaker-ricardo-amorim.jpg": f"{HUBSPOT}/Ricardo%20Amorim.png",
    "speaker-ana-beatris-mori.jpg": f"{HUBSPOT}/Bia%20Mori.png",
    "speaker-carla-fiorito.jpg": f"{HUBSPOT}/Carla%20Fiorito.png",
    "speaker-enio-garbin.jpg": f"{HUBSPOT}/Enio%20Garbin.png",
    "speaker-mauricio-trezub.png": f"{HUBSPOT}/Trezub.png",
}
for local, remote in HUBSPOT_MEDIA.items():
    html = html.replace(f'"/connection/{local}"', f'"{remote}"')
    css = css.replace(f"url(/connection/{local})", f"url({remote})")

# ── 4b. Demais assets locais ─────────────────────────────────────────────────
html = html.replace('"/connection/', '"assets/')
css = css.replace("url(/connection/", "url(assets/")

# ── 5. Fonte + CSS inline no <head> ─────────────────────────────────────────
fonts = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet">'
)
override = "<style>.connection-root{font-family:'Lato',sans-serif}</style>"
html = html.replace("</head>", f"{fonts}<style>{css}</style>{override}</head>")

# ── 6. JS vanilla com os comportamentos da página ────────────────────────────
BEHAVIOR_JS = r"""
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll (mesma lógica de scroll-effects.tsx) */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.connection-main > section, .connection-main > footer')
  );
  if (!reduced && 'IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    sections.forEach(function (section, index) {
      if (index === 0) { section.setAttribute('data-reveal', 'in'); return; }
      section.setAttribute('data-reveal', '');
      revealIO.observe(section);
    });
  } else {
    sections.forEach(function (s) { s.setAttribute('data-reveal', 'in'); });
  }

  /* Contadores animados (stat-counter.tsx) */
  var WEAK = [255, 238, 192], FULL = [255, 188, 0];
  var statConfigs = [
    { value: 10, prefix: '+', suffix: ' anos' },
    { value: 500, prefix: '', suffix: '', small: '+' },
    { value: 1, prefix: '+', suffix: ' bi' }
  ];
  var statEls = document.querySelectorAll('[data-node-id="217:23"] > div > p:first-child');
  function lerpColor(p) {
    return 'rgb(' + WEAK.map(function (w, i) { return Math.round(w + (FULL[i] - w) * p); }).join(',') + ')';
  }
  function renderStat(el, cfg, value, progress) {
    el.style.color = lerpColor(progress);
    el.innerHTML = cfg.prefix + value.toLocaleString('pt-BR') + cfg.suffix +
      (cfg.small ? '<span class="text-[clamp(32px,2.6vw,50px)] leading-[1.1]">' + cfg.small + '</span>' : '');
  }
  statEls.forEach(function (el, i) {
    var cfg = statConfigs[i];
    if (!cfg) return;
    renderStat(el, cfg, 0, 0);
    if (reduced || !('IntersectionObserver' in window)) { renderStat(el, cfg, cfg.value, 1); return; }
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      io.disconnect();
      var t0 = performance.now(), duration = 2200;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        renderStat(el, cfg, Math.round(eased * cfg.value), eased);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.4 });
    io.observe(el);
  });

  /* Tabs com auto-rotate + linha de progresso (feature-tab.tsx) */
  var TABS = [
    { eyebrow: 'Trilha 01 · Atrair e qualificar', headingLarge: 'Campanhas ', headingSmall: 'que viram conversas qualificadas.', body: 'Sem perda de intenção e com contexto para o lead avançar. Como a IA acelera o funil desde o clique no anúncio até a conversa no WhatsApp.' },
    { eyebrow: 'Trilha 02 · Converter e fechar', headingLarge: 'Negociação ', headingSmall: 'e fechamento onde a conversa começou.', body: 'Negociação, carrinho e fechamento no mesmo lugar onde a conversa começou. Como o WhatsApp virou infraestrutura de receita.' },
    { eyebrow: 'Trilha 03 · Reter e expandir', headingLarge: 'Menos carga ', headingSmall: 'operacional, mais presença.', body: 'Como a IA transforma suporte reativo em relacionamento ativo e incentiva a recompra. Do primeiro \u201coi\u201d à recompra.' }
  ];
  var tablist = document.querySelector('[role="tablist"][aria-label="Trilhas do evento"]');
  if (tablist) {
    var buttons = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panel = document.querySelector('[role="tabpanel"]');
    var eyebrowEl = panel.querySelector('[data-node-id="138:132"] > span:first-child');
    var headingLargeEl = panel.querySelector('.lp-italic');
    var headingSmallEl = headingLargeEl.nextElementSibling;
    var bodyEl = panel.querySelector('[data-node-id="169:4"]');
    var active = 0, progress = 0, paused = false, raf = 0;

    function fillFor(button) { return button.querySelector('span[aria-hidden] > span'); }
    function setActive(index) {
      active = index; progress = 0;
      var tab = TABS[index];
      eyebrowEl.textContent = tab.eyebrow;
      headingLargeEl.textContent = tab.headingLarge;
      headingSmallEl.textContent = tab.headingSmall;
      bodyEl.textContent = tab.body;
      buttons.forEach(function (button, i) {
        button.setAttribute('aria-selected', String(i === index));
        button.classList.toggle('text-(--lp-accent)', i === index);
        button.classList.toggle('text-white', i !== index);
        var track = button.querySelector('span[aria-hidden]');
        var fill = fillFor(button);
        if (i === index && !fill) {
          fill = document.createElement('span');
          fill.className = 'absolute inset-y-0 left-0 rounded-full bg-(--lp-accent)';
          track.appendChild(fill);
        } else if (i !== index && fill) {
          fill.remove();
        }
      });
    }
    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () { setActive(i); });
    });
    tablist.addEventListener('mouseenter', function () { paused = true; });
    tablist.addEventListener('mouseleave', function () { paused = false; });

    if (!reduced) {
      var DURATION = 6000, last = performance.now(), elapsed = 0;
      (function tick(t) {
        var dt = t - last; last = t;
        if (!paused) {
          elapsed += dt;
          if (elapsed >= DURATION) { elapsed = 0; setActive((active + 1) % TABS.length); }
          var fill = fillFor(buttons[active]);
          if (fill) fill.style.width = (elapsed / DURATION) * 100 + '%';
        }
        raf = requestAnimationFrame(tick);
      })(last);
    }
  }

  /* Guard do vídeo do hero (hero-video-guard.tsx) */
  var iframe = document.getElementById('connection-hero-video');
  if (iframe) {
    window.onYouTubeIframeAPIReady = function () {
      new YT.Player('connection-hero-video', {
        events: {
          onReady: function (e) { e.target.mute(); e.target.playVideo(); },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) e.target.playVideo();
          }
        }
      });
    };
    var script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  }
})();
"""

html = html.replace("</body>", f"<script>{BEHAVIOR_JS}</script></body>")

# ── 7. Grava saída e copia assets ───────────────────────────────────────────
if OUT_DIR.exists():
    shutil.rmtree(OUT_DIR)
ASSETS_DIR.mkdir(parents=True)
for asset in (ROOT / "public/connection").iterdir():
    if asset.is_file():
        shutil.copy2(asset, ASSETS_DIR / asset.name)

(OUT_DIR / "index.html").write_text(html, encoding="utf-8")
print(f"OK: {OUT_DIR / 'index.html'} ({(OUT_DIR / 'index.html').stat().st_size // 1024}K)")
print(f"Assets: {len(list(ASSETS_DIR.iterdir()))} arquivos")

# ── 8. Versão standalone (arquivo único, assets em base64) ──────────────────
import base64
import mimetypes

mimetypes.add_type("image/svg+xml", ".svg")

def to_data_uri(match: re.Match) -> str:
    name = match.group(1)
    path = ASSETS_DIR / urllib.parse.unquote(name)
    if not path.is_file():
        return match.group(0)
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f'"data:{mime};base64,{data}"'

standalone = re.sub(r'"assets/([^"]+)"', to_data_uri, html)
standalone = standalone.replace("url(assets/", "url(data:").replace(
    "url(data:", "url(assets/", 0
)  # no-op guard; css url() tratado abaixo

def css_to_data_uri(match: re.Match) -> str:
    name = match.group(1)
    path = ASSETS_DIR / urllib.parse.unquote(name)
    if not path.is_file():
        return match.group(0)
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"url(data:{mime};base64,{data})"

standalone = re.sub(r"url\(assets/([^)]+)\)", css_to_data_uri, standalone)

standalone_path = ROOT / "dist/connection-2026-standalone.html"
standalone_path.write_text(standalone, encoding="utf-8")
print(f"Standalone: {standalone_path} ({standalone_path.stat().st_size // 1024 // 1024}.{standalone_path.stat().st_size // 1024 % 1024:03d}MB aprox)")

# ── 9. Template HubSpot CMS (custom coded page) ──────────────────────────────
# Diferente do standalone: usa as URLs que já existem no File Manager da LP
# antiga, inclui os hooks HubL obrigatórios e mantém apenas assets pequenos/sem
# URL pública como data URI. As duas imagens de fundo locais mais pesadas são
# substituídas por gradientes CSS para manter o template leve.
hubspot = html

# A versão compilada do Next inclui @font-face apontando para ../media/*.woff2.
# No HubSpot usamos o Google Fonts já presente no <head>, então removemos todos
# os blocos locais para não deixar URLs quebradas no template.
hubspot = re.sub(r"@font-face\s*\{[^{}]*\}", "", hubspot)
hubspot = re.sub(r'<meta name="next-size-adjust"[^>]*>', "", hubspot)
hubspot = re.sub(
    r'<link rel="icon"[^>]*>',
    '<link rel="icon" type="image/svg+xml" href="https://20121735.fs1.hubspotusercontent-na1.net/hubfs/20121735/MKT%20-%20Webinar%20FARM%20RIO%202026/favicon.svg">',
    hubspot,
)

hubspot_remote_assets = {
    "logo-google-ink.svg": f"{HUBSPOT}/Google%20logo.svg",
    "logo-google-negative.svg": f"{HUBSPOT}/Google%20logo.svg",
    "logo-meta-ink.svg": f"{HUBSPOT}/meta.svg",
    "logo-omnichat-negative.svg": f"{HUBSPOT}/Logo%20OmniChat%20(1).svg",
}
for local, remote in hubspot_remote_assets.items():
    hubspot = hubspot.replace(f'"assets/{local}"', f'"{remote}"')
    hubspot = hubspot.replace(f"url(assets/{local})", f"url({remote})")

# Os fundos abaixo não existem no File Manager da LP antiga. Removemos os JPGs
# grandes e recriamos o tratamento visual com os tokens oficiais da marca.
for background in ("feature-tab-bg-gradient.jpg", "footer-bg.jpg"):
    hubspot = re.sub(
        rf'<img\b[^>]*src="assets/{re.escape(background)}"[^>]*>',
        "",
        hubspot,
        flags=re.I,
    )

hubspot_fallback_styles = """
<style>
  [data-node-id="214:172"] {
    background: radial-gradient(circle at 100% 0%, rgba(255,208,77,.20) 0%, rgba(255,188,0,.08) 28%, transparent 62%);
  }
  footer [data-name="bg"] {
    background: radial-gradient(circle at 78% 10%, rgba(83,38,115,.58) 0%, rgba(110,51,153,.18) 28%, transparent 62%), #000006;
  }
</style>
"""
hubspot = hubspot.replace("</head>", f"{hubspot_fallback_styles}{{{{ standard_header_includes }}}}</head>")

# Assets restantes (ícones e omnichat-support.png) ficam dentro do template.
# Isso evita qualquer caminho local e não exige upload adicional no File Manager.
hubspot = re.sub(r'"assets/([^"]+)"', to_data_uri, hubspot)
hubspot = re.sub(r"url\(assets/([^)]+)\)", css_to_data_uri, hubspot)

hubspot_metadata = """<!--
  templateType: "page"
  isAvailableForNewContent: true
  label: "OmniChat Connection 2026"
-->
"""
hubspot = hubspot_metadata + hubspot
hubspot = hubspot.replace(
    "</body>",
    "{{ standard_footer_includes }}\n</body>",
)

hubspot_path = ROOT / "lps-from-hubspot/connection-2026.html"
hubspot_path.write_text(hubspot, encoding="utf-8")
print(f"HubSpot CMS: {hubspot_path} ({hubspot_path.stat().st_size // 1024}K)")
