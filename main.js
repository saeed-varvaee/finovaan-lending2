// main.js — Full-featured script for Finovaan
// Features:
// - footer year auto-fill
// - theme toggle (dark/light) with localStorage + prefers-color-scheme support + smooth CSS transition toggling
// - language toggle (fa/en) with localStorage, browser-language detection, and UI swap
// - accessibility improvements (focus-visible hint, keyboard shortcuts, aria updates)
// - QR modal open/close + download + share fallback
// - subscribe form (frontend demo) with validation and localStorage persistence
// - header scroll behavior + parallax hero effect
// - smooth scroll polyfill for anchors (if needed)
// - small fake-analytics + optional service worker registration
// - helpful defensive checks so missing DOM nodes don't break execution
// - lightweight event-debounce utility where appropriate

(function () {
  'use strict';

  /* -------------------------
     Utilities
  ------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('main.js error:', e); } };
  const debounce = (fn, wait = 50) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  /* -------------------------
     Config / keys
  ------------------------- */
  const THEME_KEY = 'finovaan:theme';        // 'light' or 'dark'
  const LANG_KEY = 'finovaan:lang';          // 'fa' or 'en'
  const SUBS_KEY = 'finovaan:subs';          // array of emails
  const FAKE_COUNT_KEY = 'finovaan:fakecount';
  const DEFAULT_LANG = 'fa';

  /* -------------------------
     DOM references (may be null)
  ------------------------- */
  const yearEl = $('#year');
  const themeBtn = $('#themeBtn');
  const langBtn = $('#langBtn');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const qrModal = $('#qrModal');
  const openQrBtn = $('#openQr');
  const closeQrBtn = $('#closeQr');
  const qrImg = $('#qrImg') || document.querySelector('.qr-card img');
  const downloadQrBtns = [$('#downloadQr'), $('#downloadQrModal')].filter(Boolean);
  const shareBtn = $('#shareLink');
  const copyBtns = [$('#copyLink'), $('#copyModalLink')].filter(Boolean);
  const subscribeForm = $('#subscribeForm');
  const emailInput = $('#email');
  const subscribeMsg = $('#subscribeMsg');
  const subscribersBadge = $('#subscribersBadge');
  const socialCards = $$('.social-card');
  const viewChannel = $('#viewChannel') || $('.btn.primary');
  const featuresTitle = $('#features-title');

  /* -------------------------
     Small dictionary for UI swap
  ------------------------- */
  const DICT = {
    fa: {
      title: 'فینووان — شفافیت مالی در یک نگاه',
      subtitle: 'آموزش‌های کوتاه، تحلیل‌های کاربردی و منابع رویدادی برای دانشجویان و حرفه‌ای‌ها. همراه ما باشید.',
      ctaChannel: 'دیدن کانال',
      ctaContact: 'تماس',
      scan: 'اسکن در رویدادها',
      featuresTitle: 'آنچه ارائه می‌دهیم',
      videos: 'ویدئوهای کوتاه',
      analysis: 'تحلیل‌ها',
      resources: 'منابع رویداد',
      subscribed: 'با تشکر! ایمیل ثبت شد.',
      invalidEmail: 'ایمیل معتبر وارد کنید.',
      alreadySub: 'شما قبلاً ثبت نام کرده‌اید.',
      copyOk: 'کپی شد'
    },
    en: {
      title: 'Finovaan — Financial clarity at a glance',
      subtitle: 'Bite-sized lessons, practical analysis and event-friendly resources for learners and practitioners.',
      ctaChannel: 'Visit Channel',
      ctaContact: 'Contact',
      scan: 'Scan at events',
      featuresTitle: 'What we offer',
      videos: 'Short videos',
      analysis: 'Analysis',
      resources: 'Event resources',
      subscribed: 'Thanks — you are subscribed!',
      invalidEmail: 'Please enter a valid email.',
      alreadySub: 'You are already subscribed.',
      copyOk: 'Copied'
    }
  };

  /* -------------------------
     Init helpers
  ------------------------- */

  // Year in footer
  safe(() => {
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // Ensure keyboard focus styling class toggling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.documentElement.classList.add('using-keyboard');
  });

  /* -------------------------
     THEME MANAGEMENT
  ------------------------- */
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
  }
  function setTheme(theme) {
    // theme === 'light' or 'dark'
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
      if (themeBtn) { themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed', 'true'); }
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
      if (themeBtn) { themeBtn.textContent = '🌙'; themeBtn.setAttribute('aria-pressed', 'false'); }
    }
    // soft CSS transition: add class then remove after timeout
    document.documentElement.classList.add('theme-transitioning');
    window.clearTimeout(window._fin_theme_to);
    window._fin_theme_to = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400);
  }

  // Initialize theme using saved setting or prefers-color-scheme
  safe(() => {
    const saved = getSavedTheme();
    if (saved) {
      setTheme(saved === 'light' ? 'light' : 'dark');
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(prefersLight ? 'light' : 'dark');
    }
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isLight ? 'dark' : 'light');
      });
    }
  });

  /* -------------------------
     LANGUAGE MANAGEMENT
  ------------------------- */
  function getSavedLang() { return localStorage.getItem(LANG_KEY); }
  function saveLang(l) { localStorage.setItem(LANG_KEY, l); }

  function detectBrowserLang() {
    const nav = navigator.languages && navigator.languages[0] ? navigator.languages[0] : navigator.language || navigator.userLanguage || 'fa';
    return nav.startsWith('en') ? 'en' : 'fa';
  }

  function applyLanguage(lang) {
    const dict = DICT[lang] || DICT[DEFAULT_LANG];
    // hero title/sub
    safe(() => { const heroTitle = document.getElementById('hero-title'); if (heroTitle) heroTitle.textContent = dict.title; });
    safe(() => { const heroSub = document.querySelector('.hero-sub'); if (heroSub) heroSub.textContent = dict.subtitle; });
    // CTAs
    safe(() => { if (viewChannel) viewChannel.textContent = dict.ctaChannel; });
    // qr caption
    safe(() => { const qr = document.querySelector('.qr-caption'); if (qr) qr.textContent = dict.scan; });
    // features
    safe(() => { if (featuresTitle) featuresTitle.textContent = dict.featuresTitle; });
    safe(() => {
      const featH3 = document.querySelectorAll('.feature h3');
      if (featH3.length >= 3) {
        featH3[0].textContent = dict.videos;
        featH3[1].textContent = dict.analysis;
        featH3[2].textContent = dict.resources;
      }
    });
    // lang button UI
    if (langBtn) {
      langBtn.textContent = lang === 'fa' ? 'فارسی' : 'English';
      langBtn.setAttribute('aria-pressed', String(lang === 'fa'));
    }
    // direction/lang attributes
    document.documentElement.lang = (lang === 'fa' ? 'fa' : 'en');
    document.documentElement.dir = (lang === 'fa' ? 'rtl' : 'ltr');

    // subscriber badge (if present) keep label reactive
    updateSubscribersBadge();

    // persist
    saveLang(lang);
  }

  // init language: precedence: saved -> browser -> default
  safe(() => {
    const saved = getSavedLang();
    const initial = saved || detectBrowserLang() || DEFAULT_LANG;
    applyLanguage(initial);
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const cur = document.documentElement.lang === 'fa' ? 'fa' : 'en';
        const next = cur === 'fa' ? 'en' : 'fa';
        applyLanguage(next);
      });
    }
  });

  /* -------------------------
     HEADER SCROLL & PARALLAX
  ------------------------- */
  safe(() => {
    let lastScroll = window.scrollY || 0;
    const onScroll = debounce(() => {
      const sc = window.scrollY || 0;
      // header class toggle
      if (header) {
        if (sc > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
      // subtle hero parallax
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // move hero background or inner content slightly (if CSS supports transform on .hero-card)
        const inner = hero.querySelector('.hero-card');
        if (inner) {
          const max = 12;
          const offset = Math.max(-max, Math.min(max, -rect.top * 0.03));
          inner.style.transform = `translateY(${offset}px)`;
        }
      }
      lastScroll = sc;
    }, 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    // run once
    onScroll();
  });

  /* -------------------------
     MODAL (QR) controls + share/copy/download
  ------------------------- */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus trap simple
    const focusable = modal.querySelector('[tabindex], button, a, input') || modal.querySelector('button');
    if (focusable) focusable.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  safe(() => {
    if (openQrBtn && qrModal) {
      openQrBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(qrModal);
        if (openQrBtn) openQrBtn.setAttribute('aria-expanded', 'true');
      });
    }
    if (closeQrBtn && qrModal) {
      closeQrBtn.addEventListener('click', () => {
        closeModal(qrModal);
        if (openQrBtn) openQrBtn.setAttribute('aria-expanded', 'false');
      });
    }
    if (qrModal) {
      qrModal.addEventListener('click', (ev) => {
        if (ev.target === qrModal) closeModal(qrModal);
      });
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && qrModal && qrModal.classList.contains('open')) closeModal(qrModal);
      });
    }

    // download QR
    const downloadFn = (src) => {
      if (!src) return;
      const a = document.createElement('a');
      a.href = src;
      a.download = 'finovaan-qr.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    downloadQrBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const src = qrImg ? qrImg.src : null;
        if (src) downloadFn(src);
      });
    });

    // share fallback
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const data = { title: document.title, text: 'Finovaan', url: location.href };
        if (navigator.share) {
          try { await navigator.share(data); } catch (_) { /* user canceled */ }
        } else {
          try { await navigator.clipboard.writeText(location.href); flashText(shareBtn, getDictText('copyOk')); } catch (_) { /* ignore */ }
        }
      });
    }

    // copy buttons
    copyBtns.forEach((b) => {
      b.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(location.href);
          flashText(b, getDictText('copyOk'));
        } catch (err) {
          flashText(b, '—');
        }
      });
    });
  });

  function flashText(el, txt, timeout = 1200) {
    if (!el) return;
    const prev = el.textContent;
    el.textContent = txt;
    setTimeout(() => { el.textContent = prev; }, timeout);
  }

  function getDictText(key) {
    const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
    return (DICT[lang] && DICT[lang][key]) || '';
  }

  /* -------------------------
     SUBSCRIBE FORM (demo)
     - stores emails in localStorage
     - simple validation
  ------------------------- */
  function loadSubs() {
    try { return JSON.parse(localStorage.getItem(SUBS_KEY) || '[]'); } catch { return []; }
  }
  function saveSubs(list) {
    try { localStorage.setItem(SUBS_KEY, JSON.stringify(list)); } catch (e) { console.warn(e); }
  }
  function updateSubscribersBadge() {
    if (!subscribersBadge) return;
    const fake = localStorage.getItem(FAKE_COUNT_KEY) || 0;
    const count = Number(fake) || loadSubs().length || 0;
    const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
    subscribersBadge.textContent = (lang === 'fa' ? 'اعضا: ' : 'Subscribers: ') + count;
  }

  safe(() => {
    // ensure fake count exists
    if (!localStorage.getItem(FAKE_COUNT_KEY)) localStorage.setItem(FAKE_COUNT_KEY, String(1245));
    updateSubscribersBadge();

    if (subscribeForm && emailInput) {
      subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (emailInput.value || '').trim();
        const emailRE = /\S+@\S+\.\S+/;
        if (!emailRE.test(email)) {
          if (subscribeMsg) { subscribeMsg.textContent = getDictText('invalidEmail'); subscribeMsg.style.color = 'crimson'; }
          return;
        }
        const list = loadSubs();
        if (list.includes(email)) {
          if (subscribeMsg) { subscribeMsg.textContent = getDictText('alreadySub'); subscribeMsg.style.color = ''; }
        } else {
          list.push(email);
          saveSubs(list);
          if (subscribeMsg) { subscribeMsg.textContent = getDictText('subscribed'); subscribeMsg.style.color = 'limegreen'; }
          emailInput.value = '';
          // bump displayed count slightly (local demo)
          const fake = Number(localStorage.getItem(FAKE_COUNT_KEY) || 1245) + 1;
          localStorage.setItem(FAKE_COUNT_KEY, String(fake));
          updateSubscribersBadge();
        }
      });
    }
  });

  /* -------------------------
     Accessibility & small helpers
  ------------------------- */
  safe(() => {
    socialCards.forEach((el) => { el.setAttribute('tabindex', '0'); });
  });

  /* -------------------------
     Smooth scroll for anchor links (progressive enhancement)
  ------------------------- */
  safe(() => {
    if ('scrollBehavior' in document.documentElement.style === false) {
      // load a very small polyfill? (omitted) — fallback: instant jump (default)
    }
    // enable click behavior for in-page links
    $$('.smooth-link').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.focus({ preventScroll: true });
        }
      });
    });
  });

  /* -------------------------
     Keyboard shortcuts (t: theme, l: lang, q: qr, /: focus email)
  ------------------------- */
  safe(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 't') {
        (themeBtn && themeBtn.click()) || setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      } else if (e.key === 'l') {
        (langBtn && langBtn.click()) || applyLanguage(document.documentElement.lang === 'fa' ? 'en' : 'fa');
      } else if (e.key === 'q') {
        if (openQrBtn) openQrBtn.click();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        if (emailInput) { e.preventDefault(); emailInput.focus(); }
      }
    });
  });

  /* -------------------------
     Optional: Service Worker registration (PWA)
  ------------------------- */
  safe(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // silent success
        // console.log('sw registered', reg);
      }).catch((err) => {
        // console.warn('sw reg failed', err);
      });
    }
  });

  /* -------------------------
     Light analytics placeholder (non-blocking)
  ------------------------- */
  safe(() => {
    setTimeout(() => {
      // example: send a beacon or console log
      // navigator.sendBeacon(...) could be used with a backend
      console.log('Finovaan: page loaded — theme=', document.documentElement.getAttribute('data-theme'), 'lang=', document.documentElement.lang);
    }, 1500);
  });

  /* -------------------------
     Final init: ensure defaults
  ------------------------- */
  safe(() => {
    // If nothing saved for lang, use browser detection
    if (!getSavedLang()) applyLanguage(detectBrowserLang());
    // update badge/language dependent labels again
    updateSubscribersBadge();
  });

})();
