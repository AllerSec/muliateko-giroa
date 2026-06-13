/* ==========================================================================
   Muliateko Giroa — Shared footer injector
   Keeps the footer (incl. © unaxaller.com) identical across all inner pages.
   Inner pages place <div data-footer></div> where the footer should render.
   Paths are relative to site root; pages in /legal/ pass data-root="../".
   ========================================================================== */
(() => {
  "use strict";
  const mount = document.querySelector("[data-footer]");
  if (!mount) return;
  const root = mount.getAttribute("data-root") || "";
  const year = new Date().getFullYear();

  mount.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <span class="footer-brand"><img class="brand-logo" src="${root}assets/img/logo-mark.png" width="40" height="40" alt="" aria-hidden="true"> Muliateko Giroa</span>
          <p style="color:rgba(255,255,255,.72);max-width:34ch">Cafetería, panadería pastelería y restaurante en el barrio de Muliate, Hondarribia. Producto de la huerta y elaboración propia.</p>
          <div class="footer-social" style="margin-top:1.25rem">
            <a href="https://www.instagram.com/muliatekogiroa/" target="_blank" rel="noopener" aria-label="Instagram de Muliateko Giroa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://www.facebook.com/muliatekogiroa" target="_blank" rel="noopener" aria-label="Facebook de Muliateko Giroa"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1Z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Navegación</h4>
          <nav class="footer-links" aria-label="Enlaces de pie">
            <a href="${root}index.html">Inicio</a>
            <a href="${root}carta.html">Carta</a>
            <a href="${root}nosotros.html">Nosotros</a>
            <a href="${root}galeria.html">Galería</a>
            <a href="${root}contacto.html">Contacto</a>
          </nav>
        </div>
        <div>
          <h4>Legal</h4>
          <nav class="footer-links" aria-label="Enlaces legales">
            <a href="${root}legal/aviso-legal.html">Aviso legal</a>
            <a href="${root}legal/privacidad.html">Privacidad</a>
            <a href="${root}legal/cookies.html">Cookies</a>
          </nav>
        </div>
        <div>
          <h4>Contacto</h4>
          <div class="footer-links">
            <a href="https://maps.google.com/?q=Plaza+Muliate+10+Hondarribia" target="_blank" rel="noopener">Plaza Muliate, 10 · 20280 Hondarribia</a>
            <a href="tel:+34943122128">943 12 21 28</a>
            <a href="mailto:muliatekogiroa@gmail.com">muliatekogiroa@gmail.com</a>
            <span style="color:rgba(255,255,255,.72)">Lun–Jue 7:00–22:30 · Vie 7:00–23:00<br>Sáb 8:00–23:00 · Dom 8:00–16:00</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Muliateko Giroa · Hondarribia</span>
        <span>Diseñado por <a href="https://unaxaller.com" target="_blank" rel="noopener">unaxaller.com</a></span>
      </div>
    </div>
  </footer>`;
})();
