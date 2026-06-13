/* ==========================================================================
   Muliateko Giroa — Interactions
   GSAP + ScrollTrigger. Progressive enhancement, reduced-motion aware.
   ========================================================================== */
(() => {
  "use strict";
  document.documentElement.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------------------------------------------------------------
     1) PAGE LOADER — only on first visit of the session
  --------------------------------------------------------------------- */
  function handleLoader() {
    const loader = $(".loader");
    if (!loader) return;
    const seen = sessionStorage.getItem("mg_visited");
    if (seen) {
      // Not first visit: remove loader instantly, no animation.
      loader.remove();
      document.body.classList.add("loaded");
      return;
    }
    sessionStorage.setItem("mg_visited", "1");
    const finish = () => {
      document.body.classList.add("loaded");
      window.setTimeout(() => loader && loader.remove(), 700);
    };
    // Give the hero art a brief, intentional reveal moment.
    window.addEventListener("load", () => window.setTimeout(finish, prefersReduced ? 100 : 900), { once: true });
    // Safety net.
    window.setTimeout(finish, 4000);
  }
  handleLoader();

  /* ---------------------------------------------------------------------
     2) HEADER scroll state + mobile nav
  --------------------------------------------------------------------- */
  function handleHeader() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");
    if (!header) return;

    if (!header.classList.contains("is-solid")) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && links) {
      const close = () => {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.style.overflow = "";
      };
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        links.classList.toggle("is-open", !open);
        document.body.style.overflow = !open ? "hidden" : "";
      });
      $$(".nav-link", links).forEach((a) => a.addEventListener("click", close));
      window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
  }
  handleHeader();

  /* ---------------------------------------------------------------------
     3) Footer year
  --------------------------------------------------------------------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------------------------------------------------------------------
     4) HERO slideshow (Ken Burns crossfade) — pure CSS/JS, no library dep
  --------------------------------------------------------------------- */
  function handleHero() {
    const slides = $$(".hero-bg .slide");
    if (slides.length < 2) return;
    let i = 0;
    slides[0].classList.add("is-active");
    if (prefersReduced) return; // keep first frame static
    window.setInterval(() => {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 5500);
  }
  handleHero();

  /* ---------------------------------------------------------------------
     5) GALLERY lightbox
  --------------------------------------------------------------------- */
  function handleGallery() {
    const items = $$(".gallery-item");
    if (!items.length) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Imagen ampliada");
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Cerrar imagen">&times;</button>' +
      '<img alt="">';
    box.hidden = true;
    document.body.appendChild(box);
    const img = $("img", box);
    const closeBtn = $(".lightbox-close", box);
    let lastFocus = null;

    const open = (src, alt) => {
      lastFocus = document.activeElement;
      img.src = src; img.alt = alt || "";
      box.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => box.classList.add("is-open"));
      closeBtn.focus();
    };
    const close = () => {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(() => { box.hidden = true; img.src = ""; }, 300);
      if (lastFocus) lastFocus.focus();
    };
    items.forEach((it) => {
      const im = $("img", it);
      it.setAttribute("tabindex", "0");
      it.setAttribute("role", "button");
      const trigger = () => open(im.dataset.full || im.currentSrc || im.src, im.alt);
      it.addEventListener("click", trigger);
      it.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(); } });
    });
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) close(); });
  }
  handleGallery();

  /* ---------------------------------------------------------------------
     5b) Highlight today's row in the hours table
  --------------------------------------------------------------------- */
  (function highlightToday() {
    const wrap = $("[data-hours]");
    if (!wrap) return;
    const today = new Date().getDay(); // 0=Sun..6=Sat
    const row = $(`[data-day="${today}"]`, wrap);
    if (row) {
      row.classList.add("is-today");
      const tag = document.createElement("span");
      tag.className = "pill";
      tag.textContent = "Hoy";
      row.querySelector(".day")?.appendChild(document.createTextNode(" "));
      row.querySelector(".day")?.appendChild(tag);
    }
  })();

  /* ---------------------------------------------------------------------
     6b) Animated number counters (data-count on .stat .num)
  --------------------------------------------------------------------- */
  function runCounters(instant) {
    $$("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const end = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const fmt = (v) => prefix + v.toFixed(decimals).replace(".", ",") + suffix;
      if (instant || typeof gsap === "undefined") { el.textContent = fmt(end); return; }
      const obj = { v: 0 };
      gsap.to(obj, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = fmt(obj.v); } });
    });
  }

  /* ---------------------------------------------------------------------
     7) GSAP animations (loaded async; gate everything on availability)
  --------------------------------------------------------------------- */
  function initGsap() {
    if (typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.9 });

    const mm = gsap.matchMedia();

    mm.add({
      reduce: "(prefers-reduced-motion: reduce)",
      ok: "(prefers-reduced-motion: no-preference)"
    }, (ctx) => {
      const { reduce } = ctx.conditions;
      if (reduce) {
        gsap.set(".reveal, .reveal-l, .reveal-r", { autoAlpha: 1, x: 0, y: 0 });
        runCounters(true);
        return;
      }

      // Hero entrance
      const heroTl = gsap.timeline({ delay: sessionStorage.getItem("mg_visited") ? 0.1 : 0.2 });
      heroTl
        .from(".hero-badge", { autoAlpha: 0, y: 20, duration: 0.6 })
        .from(".hero h1", { autoAlpha: 0, y: 40, duration: 1 }, "-=0.3")
        .from(".hero p.lead", { autoAlpha: 0, y: 28 }, "-=0.6")
        .from(".hero-actions > *", { autoAlpha: 0, y: 24, stagger: 0.12 }, "-=0.5")
        .from(".hero-rating", { autoAlpha: 0, y: 16 }, "-=0.5");

      // Scroll reveals (batched)
      if (typeof ScrollTrigger !== "undefined") {
        gsap.set(".reveal", { autoAlpha: 0, y: 30 });
        ScrollTrigger.batch(".reveal", {
          start: "top 88%",
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8, overwrite: true }),
          once: true
        });
        gsap.set(".reveal-l", { autoAlpha: 0, x: -36 });
        ScrollTrigger.batch(".reveal-l", { start: "top 85%", once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, x: 0, duration: 0.9, overwrite: true }) });
        gsap.set(".reveal-r", { autoAlpha: 0, x: 36 });
        ScrollTrigger.batch(".reveal-r", { start: "top 85%", once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, x: 0, duration: 0.9, overwrite: true }) });

        // Subtle parallax on flagged media
        $$("[data-parallax]").forEach((el) => {
          gsap.to(el, { yPercent: -12, ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // Animated counters when the stats row enters
        const statsWrap = $(".stats");
        if (statsWrap) {
          ScrollTrigger.create({ trigger: statsWrap, start: "top 85%", once: true, onEnter: () => runCounters(false) });
        } else {
          runCounters(false);
        }

        ScrollTrigger.refresh();
      }
      return () => {};
    });
  }

  /* ---------------------------------------------------------------------
     8) Mouse-reactive elements (desktop, pointer:fine only)
  --------------------------------------------------------------------- */
  function initMouseReactive() {
    if (prefersReduced) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const targets = $$("[data-mouse]");
    if (!targets.length) return;
    let raf = null, mx = 0, my = 0;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = null;
      targets.forEach((t) => {
        const depth = parseFloat(t.dataset.mouse) || 12;
        t.style.transform = `translate3d(${(-mx * depth).toFixed(1)}px, ${(-my * depth).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
  }

  // Init GSAP once its script is present (it's loaded with defer before this file's logic block via window load fallback)
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initGsap(); initMouseReactive();
  } else {
    window.addEventListener("DOMContentLoaded", () => { initGsap(); initMouseReactive(); });
  }
})();
