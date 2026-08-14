/**
 * OmniChat — popup de demonstração com teste A/B (PostHog) para o site WordPress.
 *
 * Variante "popup": esconde a seção #formulario (Contact Form 7) e abre um popup
 * com form (HubSpot API) + painel de cases em todo clique em a[href$="#formulario"].
 * Variante "control" ou timeout: nada muda; conversão do CF7 é rastreada.
 *
 * Autocontido: sem dependências. Colar via WPCode no footer e excluir do
 * delay-JS/minificação do WP Rocket. Fonte: repo web-omnichat,
 * scripts/wp-demo-popup/ — spec em docs/superpowers/specs/2026-08-07-wp-demo-popup-ab-design.md
 */
(function () {
  'use strict';

  if (window.__ocdpLoaded) return;
  window.__ocdpLoaded = true;

  var FLAG_KEY = 'demo-popup-ab';
  var FLAG_TIMEOUT_MS = 2000;
  // Form HubSpot "MKT | Site - Popup Demonstração" (campos: email, firstname,
  // company, phone, cargo, segmentorevisado, qual_o_nmero_de_atendentesvendedores_da_empesa)
  var FORM_GUID = '0d0d61df-8014-4b0d-b2e9-aafb5f71a595';
  var FORM_ACTION =
    'https://api.hsforms.com/submissions/v3/integration/submit/20121735/' + FORM_GUID;
  var FIELD_SEGMENTO = 'segmentorevisado';
  var FIELD_ATENDENTES = 'qual_o_nmero_de_atendentesvendedores_da_empesa';
  var LOGO_URL =
    'https://storage.googleapis.com/omnichat-cdn-assets/logos/omnichat/colorida/omnichat.svg';
  var PRIVACY_URL = 'https://omni.chat/politicas-de-privacidade/';

  /* Recortes fiéis aos artigos publicados no blog omni.chat (2026-08-07).
     Cases sem citação de pessoa não têm bloco de depoimento.
     Logos: só do CDN OmniChat. Karsten sem logo no CDN (2026-08-07) — fica
     com iniciais até o time de growth subir o arquivo. */
  var LOGO_BASE = 'https://storage.googleapis.com/omnichat-cdn-assets/logos/cases/';
  var CASES = {
    iplace: {
      company: 'iPlace · Grupo Herval',
      metric: '281x',
      result:
        'de ROAS na campanha de lançamento do iPhone 15, a melhor em vendas dos últimos 10 anos.',
      quote:
        'Saímos de um canal limitante, sem conversação, como o SMS e migramos para o principal canal e queridinho do brasileiro, o WhatsApp com apoio da tecnologia OmniChat.',
      name: 'Paulo Rosa',
      role: 'Gerente de CRM',
      initials: 'PR',
      logo: LOGO_BASE + 'varejo/cinza/iplace.svg'
    },
    hering: {
      company: 'Cia Hering',
      metric: '123x',
      result:
        'de ROAS em campanhas de carrinho abandonado, com 20% de taxa de conversão.',
      text:
        'Com campanhas de carrinho abandonado no WhatsApp, a Hering elevou a taxa de conversão de 2% para 20% e multiplicou o retorno sobre o investimento em mídia.',
      logo: LOGO_BASE + 'varejo/cinza/hering.svg'
    },
    asics: {
      company: 'ASICS Brasil',
      metric: '4x',
      result:
        'mais conversão que o e-commerce tradicional; o WhatsApp responde por mais de 60% das vendas omnichannel.',
      quote:
        'O Whizz Copilot já ajuda até nas vendas dentro da loja física. Ele compara produtos e responde mais rápido.',
      name: 'Gustavo Reis',
      role: 'CRM | CX | SAC Manager',
      initials: 'GR',
      logo: LOGO_BASE + 'varejo/cinza/asics.svg'
    },
    karsten: {
      company: 'Karsten',
      metric: '+215%',
      result:
        'no ticket médio, com ROAS superior a 440x em carrinho abandonado.',
      quote:
        'Nós tínhamos receio de fazer a comunicação no WhatsApp e parecermos invasivos, mas aos poucos começamos a entender o quanto o cliente já está habituado com o uso do canal.',
      name: 'Valéria Bitencourt',
      role: 'Head de E-commerce e Transformação Digital',
      initials: 'VB'
    },
    decathlon: {
      company: 'Decathlon',
      metric: '12%',
      result:
        'do GMV influenciado pelo WhatsApp entre loja física e e-commerce.',
      quote:
        'Com a contratação da Omnichat, e já com todos os canais integrados, foi possível centralizar tudo em uma única ferramenta',
      name: 'Any Zamaro',
      role: 'Coordenadora de CRM',
      initials: 'AZ',
      logo: LOGO_BASE + 'varejo/cinza/decathlon.svg'
    },
    gavinho: {
      company: 'Grupo Gavinho · UniCesumar',
      metric: '100%',
      result:
        'dos leads de matrícula qualificados pela IA antes da transferência ao time humano.',
      text:
        'Durante o recesso, sem nenhum consultor ativo, a IA qualificou todos os leads da campanha de matrículas com informações completas.',
      logo: LOGO_BASE + 'educacional/cinza/unicesumar.svg'
    }
  };

  var PAGES = {
    '/': ['iplace', 'hering', 'asics'],
    '/produto/marketing-studio': ['hering', 'karsten', 'iplace'],
    '/produto/sales-studio': ['asics', 'decathlon', 'iplace'],
    '/solucao/varejo': ['iplace', 'asics', 'decathlon'],
    '/solucao/educacional': ['gavinho', 'iplace', 'asics']
  };

  function normalizePath(p) {
    var n = String(p || '').replace(/\/+$/, '');
    return n === '' ? '/' : n;
  }

  // __OCDP_FORCE_PATH__ existe só para harness local e testes automatizados.
  var path = normalizePath(window.__OCDP_FORCE_PATH__ || location.pathname);
  if (!Object.prototype.hasOwnProperty.call(PAGES, path)) return;

  // listeners de document registrados por aqui, para o teardown de teste
  var docListeners = [];
  function onDoc(type, fn, opts) {
    document.addEventListener(type, fn, opts);
    docListeners.push([type, fn, opts]);
  }

  var caseList = PAGES[path].map(function (key) {
    return CASES[key];
  });

  /* ------------------------------------------------------------------ */
  /* Anti-flicker: esconde a seção do form até a variante resolver.      */
  /* ------------------------------------------------------------------ */
  var hideStyle = document.createElement('style');
  hideStyle.textContent = '#formulario{visibility:hidden !important}';
  (document.head || document.documentElement).appendChild(hideStyle);

  function showInlineForm() {
    if (hideStyle.parentNode) hideStyle.parentNode.removeChild(hideStyle);
  }

  /* QA: ?ocdp-variant=popup|control força a variante neste navegador (persiste
     na aba via sessionStorage; ?ocdp-variant=off desliga). Em modo QA nenhum
     evento é capturado, para não contaminar o experimento. */
  var qaVariant = null;
  try {
    var qaMatch = location.search.match(/[?&]ocdp-variant=(popup|control|off)(?:&|$)/);
    if (qaMatch) {
      if (qaMatch[1] === 'off') sessionStorage.removeItem('ocdp-variant');
      else sessionStorage.setItem('ocdp-variant', qaMatch[1]);
    }
    qaVariant = sessionStorage.getItem('ocdp-variant');
  } catch (e) {
    /* sessionStorage indisponível: segue fluxo normal */
  }

  function capture(name, props) {
    if (qaVariant) return;
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        props = props || {};
        props.page_path = path;
        window.posthog.capture(name, props);
      }
    } catch (e) {
      /* tracking nunca pode quebrar a página */
    }
  }

  /* ------------------------------------------------------------------ */
  /* Resolução da variante                                               */
  /* ------------------------------------------------------------------ */
  var resolved = false;

  function resolveVariant(kind) {
    if (resolved) return;
    resolved = true;

    if (kind === 'popup') {
      hideStyle.textContent = '#formulario{display:none !important}';
      bindPopupVariant();
      return;
    }

    showInlineForm();
    if (kind === 'control') bindControlTracking();
    // timeout: fail-open sem eventos — usuário fora do experimento
  }

  if (qaVariant) {
    resolveVariant(qaVariant);
  } else {
    setTimeout(function () {
      resolveVariant('timeout');
    }, FLAG_TIMEOUT_MS);
  }

  (function pollPosthog() {
    if (resolved) return;
    var ph = window.posthog;
    if (ph && typeof ph.onFeatureFlags === 'function') {
      try {
        ph.onFeatureFlags(function () {
          var v;
          try {
            v = ph.getFeatureFlag(FLAG_KEY);
          } catch (e) {
            v = undefined;
          }
          resolveVariant(v === 'popup' ? 'popup' : 'control');
        });
      } catch (e) {
        resolveVariant('timeout');
      }
      return;
    }
    setTimeout(pollPosthog, 50);
  })();

  /* ------------------------------------------------------------------ */
  /* Controle: rastreia conversão do Contact Form 7                      */
  /* ------------------------------------------------------------------ */
  function bindControlTracking() {
    onDoc('wpcf7mailsent', function () {
      capture('demo_form_submitted', { variant: 'control', method: 'cf7' });
    });
    onDoc('wpcf7mailfailed', function () {
      capture('demo_form_error', { variant: 'control', reason: 'mailfailed' });
    });
    onDoc('wpcf7invalid', function () {
      capture('demo_form_error', { variant: 'control', reason: 'invalid' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Popup                                                               */
  /* ------------------------------------------------------------------ */
  var SVG = {
    close:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    right:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    up:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 7"/></svg>'
  };

  var CHEVRON_BG =
    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23414658' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

  var CSS =
    '.ocdp-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(11,12,14,.48);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);padding:12px;' +
    "font-family:'Roboto',system-ui,-apple-system,'Segoe UI',sans-serif;box-sizing:border-box}" +
    '.ocdp-overlay *,.ocdp-overlay *::before,.ocdp-overlay *::after{box-sizing:border-box;margin:0;padding:0}' +
    '.ocdp-dialog{position:relative;width:100%;max-width:1080px;max-height:calc(100vh - 24px);overflow-y:auto;' +
    'background:#fff;border-radius:24px;box-shadow:0 24px 64px rgba(11,12,14,.32)}' +
    '.ocdp-close{position:absolute;top:16px;right:16px;z-index:10;display:flex;align-items:center;justify-content:center;' +
    'width:40px;height:40px;border:0;border-radius:8px;background:#fff;color:#212529;cursor:pointer;' +
    'box-shadow:0 2px 8px rgba(11,12,14,.16);transition:background-color .15s}' +
    '.ocdp-close:hover{background:#F6F7F8}' +
    '.ocdp-grid{display:grid}' +
    '@media (min-width:1024px){.ocdp-grid{grid-template-columns:minmax(0,1fr) 384px}}' +
    '@media (max-width:1023.98px){.ocdp-overlay{padding:12px 8px;align-items:flex-start}.ocdp-dialog{max-height:calc(100vh - 16px)}}' +
    /* coluna do form */
    '.ocdp-form-col{background:#F6F7F8;padding:40px 24px}' +
    '@media (min-width:768px){.ocdp-form-col{padding:40px 40px}}' +
    '@media (min-width:1024px){.ocdp-form-col{padding:56px 48px}}' +
    '.ocdp-head{text-align:center}' +
    '.ocdp-title{font-size:32px;line-height:40px;font-weight:700;color:#212529}' +
    '@media (max-width:767.98px){.ocdp-title{font-size:26px;line-height:32px}}' +
    '.ocdp-sub{max-width:570px;margin:8px auto 0;font-size:16px;line-height:24px;color:#414658}' +
    '.ocdp-form{display:grid;gap:12px;margin-top:28px}' +
    '.ocdp-hp{position:absolute;left:-9999px;opacity:0;pointer-events:none}' +
    '.ocdp-input,.ocdp-select{height:48px;width:100%;border-radius:8px;border:1px solid #ABAEBA;background:#fff;' +
    'padding:0 16px;font-size:16px;font-family:inherit;color:#212529;outline:none}' +
    '.ocdp-input::placeholder{color:#414658}' +
    '.ocdp-input:focus,.ocdp-select:focus{border-color:#21232C;box-shadow:0 0 0 2px rgba(255,188,0,.3)}' +
    '.ocdp-input:disabled,.ocdp-select:disabled{opacity:.6}' +
    '.ocdp-select{appearance:none;-webkit-appearance:none;padding-right:40px;background-image:' + CHEVRON_BG + ';' +
    'background-repeat:no-repeat;background-position:right 12px center;background-size:18px 18px;cursor:pointer}' +
    '.ocdp-select.ocdp-placeholder{color:#414658}' +
    '.ocdp-phone{display:flex}' +
    '.ocdp-ddi{width:auto;flex-shrink:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:0;' +
    'font-size:14px;font-weight:700;padding:0 32px 0 12px;background-position:right 8px center;background-size:16px 16px}' +
    '.ocdp-ddi:focus{position:relative;z-index:1}' +
    '.ocdp-phone .ocdp-input{border-top-left-radius:0;border-bottom-left-radius:0;min-width:0;flex:1}' +
    '.ocdp-fieldset{border:1px solid #ABAEBA;border-radius:8px;background:#fff;padding:12px}' +
    '.ocdp-legend{padding:0 4px;font-size:14px;color:#414658}' +
    '.ocdp-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}' +
    '.ocdp-pill input{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.ocdp-pill span{display:block;border:1px solid #DCDEE5;border-radius:8px;padding:6px 12px;font-size:13px;' +
    'color:#414658;cursor:pointer;transition:background-color .15s,border-color .15s}' +
    '.ocdp-pill input:checked+span{border-color:#212529;background:#FFBC00;color:#212529;font-weight:700}' +
    '.ocdp-pill input:focus-visible+span{box-shadow:0 0 0 2px rgba(255,188,0,.5)}' +
    '.ocdp-error{font-size:14px;color:#CC3628}' +
    '.ocdp-submit{height:48px;width:100%;margin-top:4px;border:0;border-radius:8px;background:#FFBC00;color:#212529;' +
    'font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;transition:background-color .15s}' +
    '.ocdp-submit:hover{background:#F0B000}.ocdp-submit:active{background:#E0A500}' +
    '.ocdp-submit:disabled{cursor:not-allowed;opacity:.6}' +
    '.ocdp-privacy{text-align:center;font-size:12px;line-height:18px;color:#414658}' +
    '.ocdp-privacy a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
    /* sucesso */
    '.ocdp-success{display:flex;min-height:520px;flex-direction:column;align-items:center;justify-content:center;' +
    'padding:64px 32px;text-align:center}' +
    '.ocdp-success-icon{display:flex;width:56px;height:56px;align-items:center;justify-content:center;' +
    'border-radius:12px;background:#E0F7D4;color:#176A40}' +
    '.ocdp-success h2{margin-top:24px;font-size:32px;line-height:40px;font-weight:700;color:#212529}' +
    '.ocdp-success p{margin-top:12px;max-width:430px;font-size:16px;line-height:24px;color:#414658}' +
    /* painel de case */
    '.ocdp-case{display:flex;flex-direction:column;justify-content:space-between;background:#0B0C0E;color:#fff;' +
    'padding:40px 32px}' +
    '@media (min-width:1024px){.ocdp-case{padding:56px 48px}}' +
    '.ocdp-logo{height:80px;width:160px;object-fit:contain;object-position:left}' +
    '.ocdp-overline{margin-top:24px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#FFD04D}' +
    '.ocdp-case h3{margin-top:8px;font-size:24px;line-height:30px;font-weight:700;color:#fff}' +
    '.ocdp-case-src{margin-top:8px;font-size:12px;color:#C4C8D4}' +
    '.ocdp-quote{margin-top:32px;font-size:18px;line-height:28px;color:#fff}' +
    '.ocdp-person{display:flex;align-items:center;gap:12px;margin-top:24px}' +
    '.ocdp-avatar{display:flex;width:48px;height:48px;flex-shrink:0;align-items:center;justify-content:center;' +
    'border-radius:50%;background:#FFBC00;color:#212529;font-size:14px;font-weight:900}' +
    '.ocdp-brand-chip{display:flex;width:96px;height:48px;flex-shrink:0;align-items:center;justify-content:center}' +
    '.ocdp-brand-chip img{max-width:100%;max-height:100%;object-fit:contain}' +
    '.ocdp-person-name{font-size:14px;line-height:20px;font-weight:700;color:#fff}' +
    '.ocdp-person-role{font-size:13px;line-height:19px;color:#C4C8D4}' +
    '.ocdp-metric{display:flex;align-items:flex-start;gap:12px;margin-top:32px;border-radius:12px;' +
    'background:rgba(255,255,255,.1);padding:16px}' +
    '.ocdp-metric svg{flex-shrink:0;margin-top:2px;color:#FFD04D}' +
    '.ocdp-metric p{font-size:14px;line-height:22px;color:#fff}' +
    '.ocdp-metric strong{font-weight:900;color:#FFD04D}' +
    '.ocdp-case-nav{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:40px}' +
    '.ocdp-arrows{display:flex;gap:8px}' +
    '.ocdp-arrow{display:flex;width:40px;height:40px;align-items:center;justify-content:center;border-radius:8px;' +
    'border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;cursor:pointer;transition:background-color .15s}' +
    '.ocdp-arrow:hover{background:rgba(255,255,255,.1)}' +
    '.ocdp-dots{display:flex;align-items:center;gap:8px}' +
    '.ocdp-dot{height:6px;width:6px;border:0;border-radius:999px;background:rgba(255,255,255,.4);cursor:pointer;' +
    'padding:0;transition:width .2s,background-color .2s}' +
    '.ocdp-dot[aria-current="true"]{width:20px;background:#FFBC00}' +
    '.ocdp-lock{overflow:hidden !important}';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getHutk() {
    var m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
    return m ? m[1] : undefined;
  }

  function buildPayload(formData) {
    var fields = [];
    formData.forEach(function (value, name) {
      if (name.charAt(0) === '_' || typeof value !== 'string') return;
      fields.push({ name: name, value: String(value) });
    });
    var context = { pageUri: location.href, pageName: document.title };
    var hutk = getHutk();
    if (hutk) context.hutk = hutk;
    return { fields: fields, context: context };
  }

  var overlay = null;
  var openerEl = null;
  var activeCase = 0;

  function caseHtml(index) {
    var c = caseList[index];
    // logo cinza do CDN direto no painel escuro; sem logo, iniciais
    var badge = c.logo
      ? '<div class="ocdp-brand-chip"><img src="' + esc(c.logo) + '" alt="' + esc(c.company) + '" loading="lazy"></div>'
      : '<div class="ocdp-avatar">' + esc(c.initials || '') + '</div>';
    var body = c.quote
      ? '<blockquote class="ocdp-quote">&ldquo;' + esc(c.quote) + '&rdquo;</blockquote>' +
        '<div class="ocdp-person">' + badge +
        '<div><p class="ocdp-person-name">' + esc(c.name) + '</p>' +
        '<p class="ocdp-person-role">' + esc(c.role) + ' · ' + esc(c.company) + '</p></div>' +
        '</div>'
      : '<p class="ocdp-quote">' + esc(c.text) + '</p>' +
        '<div class="ocdp-person">' + badge +
        '<div><p class="ocdp-person-name">' + esc(c.company) + '</p>' +
        '<p class="ocdp-person-role">Case publicado no blog da OmniChat</p>' +
        '</div></div>';

    return (
      body +
      '<div class="ocdp-metric">' + SVG.up +
      '<p><strong>' + esc(c.metric) + '</strong> ' + esc(c.result) + '</p></div>'
    );
  }

  function renderCase() {
    var slot = overlay.querySelector('.ocdp-case-slot');
    if (slot) slot.innerHTML = caseHtml(activeCase);
    var dots = overlay.querySelectorAll('.ocdp-dot');
    for (var i = 0; i < dots.length; i++) {
      dots[i].setAttribute('aria-current', i === activeCase ? 'true' : 'false');
    }
  }

  function goToCase(index) {
    activeCase = ((index % caseList.length) + caseList.length) % caseList.length;
    renderCase();
  }

  function dialogHtml() {
    var dots = caseList
      .map(function (c, i) {
        return (
          '<button type="button" class="ocdp-dot" data-ocdp-dot="' + i +
          '" aria-label="Ir para o case ' + (i + 1) + '"></button>'
        );
      })
      .join('');

    return (
      '<div class="ocdp-dialog" role="dialog" aria-modal="true" aria-labelledby="ocdp-title">' +
      '<button type="button" class="ocdp-close" aria-label="Fechar formulário">' + SVG.close + '</button>' +
      '<div class="ocdp-grid">' +
      '<div class="ocdp-form-col">' +
      '<div class="ocdp-head">' +
      '<h2 class="ocdp-title" id="ocdp-title">Solicite sua demonstração</h2>' +
      '<p class="ocdp-sub">Preencha os campos para falar com um especialista e entender como a OmniChat pode transformar conversas em vendas no WhatsApp.</p>' +
      '</div>' +
      '<form class="ocdp-form" method="post" action="' + FORM_ACTION + '" novalidate="false">' +
      '<div class="ocdp-hp"><label for="ocdp-hp">Não preencher</label>' +
      '<input id="ocdp-hp" name="_hp_field" type="text" tabindex="-1" autocomplete="new-password"></div>' +
      '<input class="ocdp-input" name="firstname" type="text" required autocomplete="name" placeholder="Nome completo" aria-label="Nome completo">' +
      '<input class="ocdp-input" name="email" type="email" required autocomplete="email" placeholder="E-mail corporativo" aria-label="E-mail corporativo">' +
      '<input class="ocdp-input" name="company" type="text" required autocomplete="organization" placeholder="Empresa" aria-label="Empresa">' +
      '<div class="ocdp-phone">' +
      '<select class="ocdp-select ocdp-ddi" name="pais" aria-label="País">' +
      '<option value="+55" selected>BR +55</option><option value="+351">PT +351</option>' +
      '<option value="+1">US +1</option><option value="+244">AO +244</option><option value="+258">MZ +258</option>' +
      '</select>' +
      '<input class="ocdp-input" name="phone" type="tel" required autocomplete="tel" placeholder="WhatsApp" aria-label="WhatsApp">' +
      '</div>' +
      // valores = valores internos da propriedade "cargo" no CRM
      '<select class="ocdp-select ocdp-placeholder" name="cargo" required aria-label="Cargo">' +
      '<option value="" disabled selected>Cargo</option>' +
      '<option value="CEO">CEO</option><option value="Sócio/Dono">Sócio/Dono</option>' +
      '<option value="Diretor/VP">Diretor/VP</option><option value="Gerente/Head">Gerente/Head</option>' +
      '<option value="Coordenador/Supervisor">Coordenador/Supervisor</option><option value="Analista">Analista</option>' +
      '<option value="Outro">Outro</option>' +
      '</select>' +
      // valores = valores internos da propriedade "segmentorevisado" no CRM
      '<select class="ocdp-select ocdp-placeholder" name="' + FIELD_SEGMENTO + '" required aria-label="Segmento">' +
      '<option value="" disabled selected>Segmento</option>' +
      '<option value="Varejo">Varejo</option><option value="Educação">Educação</option>' +
      '<option value="Serviços">Serviços</option><option value="Indústria">Indústria</option>' +
      '<option value="Outros Segmento">Outros Segmentos</option>' +
      '</select>' +
      '<fieldset class="ocdp-fieldset">' +
      '<legend class="ocdp-legend">Quantas pessoas vendem pelo WhatsApp?</legend>' +
      '<div class="ocdp-pills">' +
      ['Até 10', '11–50', '51–200', '201+']
        .map(function (opt) {
          return (
            '<label class="ocdp-pill"><input type="radio" name="' + FIELD_ATENDENTES + '" value="' + esc(opt) +
            '" required><span>' + esc(opt) + '</span></label>'
          );
        })
        .join('') +
      '</div></fieldset>' +
      '<p class="ocdp-error" role="alert" hidden>Não foi possível enviar. Revise os dados e tente novamente.</p>' +
      '<button type="submit" class="ocdp-submit">Solicitar demonstração</button>' +
      '<p class="ocdp-privacy">Ao enviar, você concorda com a <a href="' + PRIVACY_URL + '" target="_blank" rel="noopener">Política de Privacidade</a> da OmniChat.</p>' +
      '</form>' +
      '</div>' +
      '<aside class="ocdp-case">' +
      '<div>' +
      '<img class="ocdp-logo" src="' + LOGO_URL + '" alt="OmniChat" width="160" height="80">' +
      '<p class="ocdp-overline">Case OmniChat</p>' +
      '<h3>Resultado construído com conversas</h3>' +
      '<p class="ocdp-case-src">Resultados publicados no blog da OmniChat</p>' +
      '<div class="ocdp-case-slot"></div>' +
      '</div>' +
      '<div class="ocdp-case-nav">' +
      '<div class="ocdp-arrows">' +
      '<button type="button" class="ocdp-arrow" data-ocdp-prev aria-label="Case anterior">' + SVG.left + '</button>' +
      '<button type="button" class="ocdp-arrow" data-ocdp-next aria-label="Próximo case">' + SVG.right + '</button>' +
      '</div>' +
      '<div class="ocdp-dots">' + dots + '</div>' +
      '</div>' +
      '</aside>' +
      '</div></div>'
    );
  }

  function focusables() {
    if (!overlay) return [];
    return Array.prototype.slice.call(
      overlay.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), select:not([disabled])'
      )
    );
  }

  function onKeydown(ev) {
    if (ev.key === 'Escape') {
      closePopup();
      return;
    }
    if (ev.key !== 'Tab') return;
    var els = focusables();
    if (!els.length) return;
    var first = els[0];
    var last = els[els.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  function closePopup() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKeydown);
    document.documentElement.classList.remove('ocdp-lock');
    document.body.classList.remove('ocdp-lock');
    overlay.parentNode && overlay.parentNode.removeChild(overlay);
    overlay = null;
    if (openerEl && typeof openerEl.focus === 'function') {
      var el = openerEl;
      setTimeout(function () {
        el.focus();
      }, 0);
    }
  }

  function submitHandler(ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    if (form.getAttribute('data-loading') === '1') return;

    var formData = new FormData(form);
    if (formData.get('_hp_field')) return;

    var ddi = String(formData.get('pais') || '');
    var phone = String(formData.get('phone') || '');
    formData.set('phone', (ddi + ' ' + phone).trim());
    formData.delete('pais');

    var errorEl = form.querySelector('.ocdp-error');
    var submitBtn = form.querySelector('.ocdp-submit');
    errorEl.hidden = true;
    form.setAttribute('data-loading', '1');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    function fail(reason) {
      form.removeAttribute('data-loading');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar demonstração';
      errorEl.hidden = false;
      capture('demo_form_error', { variant: 'popup', reason: reason });
    }

    fetch(FORM_ACTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(formData))
    })
      .then(function (response) {
        if (!response.ok) {
          fail('http_' + response.status);
          return;
        }
        capture('demo_form_submitted', { variant: 'popup', method: 'hubspot' });
        var col = overlay && overlay.querySelector('.ocdp-form-col');
        if (col) {
          col.innerHTML =
            '<div class="ocdp-success" role="status">' +
            '<span class="ocdp-success-icon">' + SVG.check + '</span>' +
            '<h2 id="ocdp-title">Recebemos seu contato</h2>' +
            '<p>Em breve, um especialista da OmniChat entrará em contato para entender sua operação.</p>' +
            '</div>';
        }
      })
      .catch(function () {
        fail('network');
      });
  }

  function openPopup(trigger) {
    if (overlay) return;
    openerEl = trigger || null;
    activeCase = 0;

    overlay = document.createElement('div');
    overlay.className = 'ocdp-overlay';
    overlay.innerHTML = dialogHtml();
    document.body.appendChild(overlay);
    document.documentElement.classList.add('ocdp-lock');
    document.body.classList.add('ocdp-lock');

    renderCase();

    overlay.addEventListener('mousedown', function (ev) {
      if (ev.target === overlay) closePopup();
    });
    overlay.querySelector('.ocdp-close').addEventListener('click', closePopup);
    overlay.querySelector('[data-ocdp-prev]').addEventListener('click', function () {
      goToCase(activeCase - 1);
    });
    overlay.querySelector('[data-ocdp-next]').addEventListener('click', function () {
      goToCase(activeCase + 1);
    });
    Array.prototype.forEach.call(overlay.querySelectorAll('.ocdp-dot'), function (dot) {
      dot.addEventListener('click', function () {
        goToCase(Number(dot.getAttribute('data-ocdp-dot')));
      });
    });

    var form = overlay.querySelector('.ocdp-form');
    form.addEventListener('submit', submitHandler);

    // selects começam cinza (placeholder) e escurecem ao escolher
    Array.prototype.forEach.call(overlay.querySelectorAll('select.ocdp-placeholder'), function (sel) {
      sel.addEventListener('change', function () {
        sel.classList.toggle('ocdp-placeholder', sel.value === '');
      });
    });

    onDoc('keydown', onKeydown);
    setTimeout(function () {
      var els = focusables();
      if (els.length) els[0].focus();
    }, 0);

    capture('demo_popup_opened', { variant: 'popup' });
  }

  var popupStyle = null;

  function bindPopupVariant() {
    popupStyle = document.createElement('style');
    popupStyle.textContent = CSS;
    document.head.appendChild(popupStyle);

    onDoc(
      'click',
      function (ev) {
        var t = ev.target;
        if (!(t instanceof Element)) return;
        var trigger = t.closest('a[href$="#formulario"], [data-demo-modal-trigger]');
        if (!trigger) return;
        ev.preventDefault();
        ev.stopPropagation();
        openPopup(trigger);
      },
      true
    );

    if (location.hash === '#formulario') openPopup(null);
  }

  // hook exclusivo para testes automatizados; inofensivo em produção
  window.__ocdpTeardown = function () {
    docListeners.forEach(function (l) {
      document.removeEventListener(l[0], l[1], l[2]);
    });
    docListeners = [];
    if (overlay) closePopup();
    showInlineForm();
    if (popupStyle && popupStyle.parentNode) {
      popupStyle.parentNode.removeChild(popupStyle);
    }
    window.__ocdpLoaded = false;
  };
})();
