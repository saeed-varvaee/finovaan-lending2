// main.js (همین فایل را در پروژه ذخیره کن)
// نسخهٔ کامل و هماهنگ با index.html و style.css
(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('main.js error:', e); } };
  const debounce = (fn, wait = 50) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };

  /* ---------- Keys & Config ---------- */
  const THEME_KEY = 'finovaan:theme';
  const LANG_KEY = 'finovaan:lang';
  const SUBS_KEY = 'finovaan:subs';
  const FAKE_COUNT_KEY = 'finovaan:fakecount';
  const DEFAULT_LANG = 'fa';

  /* ---------- DOM refs ---------- */
  const yearEl = $('#year');
  const themeBtn = $('#themeBtn');
  const langBtn = $('#langBtn');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const qrModal = $('#qrModal');
  const openQrBtn = $('#openQr');
  const closeQrBtn = $('#closeQr');
  const qrImg = $('#qrImg');
  const downloadQrModalBtn = $('#downloadQrModal');
  const shareBtn = $('#shareLink');
  const copyLinkBtn = $('#copyLink');
  const copyModalLinkBtn = $('#copyModalLink');
  const subscribeForm = $('#subscribeForm');
  const emailInput = $('#email');
  const subscribeMsg = $('#subscribeMsg');
  const subscribersBadge = $('#subscribersBadge');
  const viewChannel = $('#viewChannel');
  const featuresTitle = $('#features-title');

  /* ---------- small dictionary ---------- */
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

  /* ---------- Init basics ---------- */
  safe(() => { if (yearEl) yearEl.textContent = new Date().getFullYear(); });

  // keyboard nav hint
  document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.documentElement.classList.add('using-keyboard'); });

  /* ---------- THEME ---------- */
  function getSavedTheme() { return localStorage.getItem(THEME_KEY); }
  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
      if (themeBtn) { themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed', 'true'); }
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
      if (themeBtn) { themeBtn.textContent = '🌙'; themeBtn.setAttribute('aria-pressed', 'false'); }
    }
    // soft transition class
    document.documentElement.classList.add('theme-transitioning');
    clearTimeout(window._fin_theme_to);
    window._fin_theme_to = setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 420);
  }

  safe(() => {
    const saved = getSavedTheme();
    if (saved) setTheme(saved === 'light' ? 'light' : 'dark');
    else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      setTheme(prefersLight ? 'light' : 'dark');
    }
    if (themeBtn) themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  });

  /* ---------- LANGUAGE ---------- */
  function getSavedLang() { return localStorage.getItem(LANG_KEY); }
  function saveLang(l) { localStorage.setItem(LANG_KEY, l); }
  function detectBrowserLang() {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'fa';
    return nav.startsWith('en') ? 'en' : 'fa';
  }
  function applyLanguage(lang) {
    const dict = DICT[lang] || DICT[DEFAULT_LANG];
    safe(() => { if ($('#hero-title')) $('#hero-title').textContent = dict.title; });
    safe(() => { if ($('.hero-sub')) $('.hero-sub').textContent = dict.subtitle; });
    safe(() => { if (viewChannel) viewChannel.textContent = dict.ctaChannel; });
    safe(() => { const qr = document.querySelector('.qr-caption'); if (qr) qr.textContent = dict.scan; });
    safe(() => { if (featuresTitle) featuresTitle.textContent = dict.featuresTitle; });
    safe(() => {
      const featH3 = document.querySelectorAll('.feature h3');
      if (featH3.length >= 3) {
        featH3[0].textContent = dict.videos;
        featH3[1].textContent = dict.analysis;
        featH3[2].textContent = dict.resources;
      }
    });
    if (langBtn) { langBtn.textContent = lang === 'fa' ? 'فارسی' : 'English'; langBtn.setAttribute('aria-pressed', String(lang === 'fa')); }
    document.documentElement.lang = (lang === 'fa' ? 'fa' : 'en');
    document.documentElement.dir = (lang === 'fa' ? 'rtl' : 'ltr');
    saveLang(lang);
    updateSubscribersBadge();
  }

  safe(() => {
    const saved = getSavedLang();
    const initial = saved || detectBrowserLang() || DEFAULT_LANG;
    applyLanguage(initial);
    if (langBtn) langBtn.addEventListener('click', () => {
      const cur = document.documentElement.lang === 'fa' ? 'fa' : 'en';
      const next = cur === 'fa' ? 'en' : 'fa';
      applyLanguage(next);
    });
  });

  /* ---------- Header scroll & parallax ---------- */
  safe(() => {
    const onScroll = debounce(() => {
      const sc = window.scrollY || 0;
      if (header) sc > 20 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
      if (hero) {
        const inner = hero.querySelector('.hero-card');
        if (inner) { const rect = hero.getBoundingClientRect(); const max = 12; const offset = Math.max(-max, Math.min(max, -rect.top * 0.03)); inner.style.transform = `translateY(${offset}px)`; }
      }
    }, 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ---------- Modal (QR) ---------- */
  function openModal(modal) { if (!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; const focusable = modal.querySelector('button, [href], input, select, textarea'); if (focusable) focusable.focus(); }
  function closeModal(modal) { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  safe(() => {
    if (openQrBtn && qrModal) openQrBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(qrModal); if (openQrBtn) openQrBtn.setAttribute('aria-expanded', 'true'); });
    if (closeQrBtn && qrModal) closeQrBtn.addEventListener('click', () => { closeModal(qrModal); if (openQrBtn) openQrBtn.setAttribute('aria-expanded', 'false'); });
    if (qrModal) { qrModal.addEventListener('click', (ev) => { if (ev.target === qrModal) closeModal(qrModal); }); document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && qrModal.classList.contains('open')) closeModal(qrModal); }); }
  });

  safe(() => {
    if (downloadQrModalBtn) downloadQrModalBtn.addEventListener('click', (e) => { e.preventDefault(); const src = qrImg ? qrImg.src : null; if (src) { const a = document.createElement('a'); a.href = src; a.download = 'finovaan-qr.png'; document.body.appendChild(a); a.click(); a.remove(); } });
    if (shareBtn) shareBtn.addEventListener('click', async (e) => { e.preventDefault(); const data = { title: document.title, text: 'Finovaan', url: location.href }; if (navigator.share) try { await navigator.share(data); } catch (_) {} else try { await navigator.clipboard.writeText(location.href); flashText(shareBtn, getDict('copyOk')); } catch (_) {} });
    if (copyLinkBtn) copyLinkBtn.addEventListener('click', async (e) => { e.preventDefault(); try { await navigator.clipboard.writeText(location.href); flashText(copyLinkBtn, getDict('copyOk')); } catch (_) { flashText(copyLinkBtn, '—'); } });
    if (copyModalLinkBtn) copyModalLinkBtn.addEventListener('click', async (e) => { e.preventDefault(); try { await navigator.clipboard.writeText(location.href); flashText(copyModalLinkBtn, getDict('copyOk')); } catch (_) { flashText(copyModalLinkBtn, '—'); } });
  });

  function flashText(el, txt, t = 1200) { if (!el) return; const prev = el.textContent; el.textContent = txt; setTimeout(() => el.textContent = prev, t); }
  function getDict(k) { const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en'; return (DICT[lang] && DICT[lang][k]) || ''; }

  /* ---------- Subscribe demo ---------- */
  function loadSubs() { try { return JSON.parse(localStorage.getItem(SUBS_KEY) || '[]'); } catch { return []; } }
  function saveSubs(list) { try { localStorage.setItem(SUBS_KEY, JSON.stringify(list)); } catch (e) { console.warn(e); } }
  function updateSubscribersBadge() { if (!subscribersBadge) return; const fake = localStorage.getItem(FAKE_COUNT_KEY) || 0; const count = Number(fake) || loadSubs().length || 0; const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en'; subscribersBadge.textContent = (lang === 'fa' ? 'اعضا: ' : 'Subscribers: ') + count; }

  safe(() => {
    if (!localStorage.getItem(FAKE_COUNT_KEY)) localStorage.setItem(FAKE_COUNT_KEY, String(1245));
    updateSubscribersBadge();
    if (subscribeForm && emailInput) {
      subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (emailInput.value || '').trim();
        const re = /\S+@\S+\.\S+/;
        if (!re.test(email)) { if (subscribeMsg) { subscribeMsg.textContent = getDict('invalidEmail'); subscribeMsg.style.color = 'crimson'; } return; }
        const list = loadSubs();
        if (list.includes(email)) { if (subscribeMsg) { subscribeMsg.textContent = getDict('alreadySub'); subscribeMsg.style.color = ''; } } else {
          list.push(email); saveSubs(list);
          if (subscribeMsg) { subscribeMsg.textContent = getDict('subscribed'); subscribeMsg.style.color = 'limegreen'; }
          emailInput.value = '';
          const fake = Number(localStorage.getItem(FAKE_COUNT_KEY) || 1245) + 1;
          localStorage.setItem(FAKE_COUNT_KEY, String(fake));
          updateSubscribersBadge();
        }
      });
    }
  });

  /* ---------- Accessibility small fixes ---------- */
  safe(() => { $$('.social-card').forEach(el => el.setAttribute('tabindex', '0')); });

  /* ---------- Keyboard shortcuts ---------- */
  safe(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 't') { (themeBtn && themeBtn.click()) || setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); }
      else if (e.key === 'l') { (langBtn && langBtn.click()) || applyLanguage(document.documentElement.lang === 'fa' ? 'en' : 'fa'); }
      else if (e.key === 'q') { if (openQrBtn) openQrBtn.click(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === '/') { if (emailInput) { e.preventDefault(); emailInput.focus(); } }
    });
  });

  /* ---------- Service worker (optional) ---------- */
  safe(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {}); });

  /* ---------- final init ---------- */
  safe(() => { if (!getSavedLang()) applyLanguage(detectBrowserLang()); updateSubscribersBadge(); });

})();
