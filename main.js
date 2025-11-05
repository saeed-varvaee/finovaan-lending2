// main.js
// - مدیریت سال در فوتر
// - سوییچ زبان فارسی/انگلیسی (فارسی پیش‌فرض)
// - تم light/dark (ذخیره در localStorage)

(function(){
  // Fill year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;
  const themeKey = 'finovaan:theme';

  // init theme
  const savedTheme = localStorage.getItem(themeKey);
  if(savedTheme === 'light'){
    root.setAttribute('data-theme','light');
    if(themeBtn) themeBtn.textContent = '☀️';
    if(themeBtn) themeBtn.setAttribute('aria-pressed','true');
  } else {
    root.removeAttribute('data-theme');
    if(themeBtn) themeBtn.textContent = '🌙';
    if(themeBtn) themeBtn.setAttribute('aria-pressed','false');
  }

  if(themeBtn){
    themeBtn.addEventListener('click', function(){
      const isLight = root.getAttribute('data-theme') === 'light';
      if(isLight){
        root.removeAttribute('data-theme');
        localStorage.setItem(themeKey, 'dark');
        themeBtn.textContent = '🌙';
        themeBtn.setAttribute('aria-pressed','false');
      } else {
        root.setAttribute('data-theme','light');
        localStorage.setItem(themeKey, 'light');
        themeBtn.textContent = '☀️';
        themeBtn.setAttribute('aria-pressed','true');
      }
    });
  }

  // Language toggle (Persian default)
  const langBtn = document.getElementById('langBtn');
  let lang = 'fa'; // default
  // small dictionary for demonstration — extendable
  const dictionary = {
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
    },
    en: {
      title: 'Finovaan — Financial clarity, fast.',
      subtitle: 'Bite-sized lessons, practical analysis and event-friendly resources for learners and practitioners.',
      ctaChannel: 'Visit Channel',
      ctaContact: 'Contact',
      scan: 'Scan at events',
      featuresTitle: 'What we offer',
      videos: 'Short videos',
      analysis: 'Analysis',
      resources: 'Event resources',
    }
  };

  function setLanguage(to){
    lang = to;
    // update UI text nodes (simple approach: find elements and swap)
    // hero title/sub
    const heroTitle = document.getElementById('hero-title');
    if(heroTitle) heroTitle.textContent = dictionary[lang].title;
    const heroSub = document.querySelector('.hero-sub');
    if(heroSub) heroSub.textContent = dictionary[lang].subtitle;
    // CTA buttons
    const ctaPrimary = document.querySelector('.btn.primary');
    if(ctaPrimary) ctaPrimary.textContent = dictionary[lang].ctaChannel;
    const ctaContact = document.querySelector('.btn.ghost') || document.querySelectorAll('.btn')[1];
    if(ctaContact) ctaContact.textContent = dictionary[lang].ctaContact;
    // QR caption
    const qrCap = document.querySelector('.qr-caption');
    if(qrCap) qrCap.textContent = dictionary[lang].scan;
    // features title
    const fTitle = document.getElementById('features-title');
    if(fTitle) fTitle.textContent = dictionary[lang].featuresTitle;
    // features list
    const features = document.querySelectorAll('.feature h3');
    if(features && features.length >= 3){
      features[0].textContent = dictionary[lang].videos;
      features[1].textContent = dictionary[lang].analysis;
      features[2].textContent = dictionary[lang].resources;
    }

    // UI language-button text
    if(langBtn) langBtn.textContent = (lang === 'fa' ? 'فارسی' : 'EN');
    // set dir attribute
    document.documentElement.dir = (lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.lang = (lang === 'fa' ? 'fa' : 'en');
  }

  // init language (default fa)
  setLanguage('fa');

  if(langBtn){
    langBtn.addEventListener('click', function(){
      setLanguage(lang === 'fa' ? 'en' : 'fa');
      // toggle aria-pressed
      langBtn.setAttribute('aria-pressed', String(lang === 'fa' ? true : false));
    });
  }

  // header scroll effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  window.addEventListener('scroll', function(){
    const sc = window.scrollY;
    if(sc > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    lastScroll = sc;
  });

  // keyboard access improvements: make social-cards focusable
  document.querySelectorAll('.social-card').forEach((el) => {
    el.setAttribute('tabindex','0');
  });

  // small accessibility helper: focus-visible polyfill replacement
  document.addEventListener('keydown', function(e){
    if(e.key === 'Tab') document.documentElement.classList.add('using-keyboard');
  });

})();
