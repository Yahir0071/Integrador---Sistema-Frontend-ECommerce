import { authStore } from './core/auth.store.js';
import { cartStore } from './core/cart.store.js';
import { catalogStore } from './core/catalog.store.js';
import { HeaderComponent } from './components/header/header.component.js';
import { FooterComponent } from './components/footer/footer.component.js';
import { ToastComponent } from './components/toast/toast.component.js';
import { WhatsAppWidget } from './components/whatsapp/whatsapp.component.js';
import { navigateTo, handleCurrentRoute, setRouteChangeListener } from './router.js';

/**
 * Orquestador principal de la aplicación e-commerce.
 * Inicializa los componentes reutilizables (fragments), gestiona el enrutamiento
 * en el cliente (SPA) y sincroniza el estado global de usuario y carrito.
 */
function bootstrapApp() {
  // 1. Montaje de componentes modulares
  const header = new HeaderComponent();
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    header.mount(headerContainer);
  }

  const footer = new FooterComponent();
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footer.mount(footerContainer);
  }

  const toast = new ToastComponent();
  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toast.mount(toastContainer);
  }

  const whatsapp = new WhatsAppWidget();
  const whatsappContainer = document.getElementById('whatsapp-container');
  if (whatsappContainer) {
    whatsapp.mount(whatsappContainer);
  }

  // 2. Interceptación de enlaces para navegación SPA fluida
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.target === '_blank' ||
      anchor.hasAttribute('download')
    ) {
      return;
    }

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return;
    }

    // Permitir salto accesible al contenido sin disparar cambio de ruta
    if (href === '#contenido') {
      return;
    }

    event.preventDefault();
    header.setMenu(false);
    navigateTo(href);
  });

  // 3. Manejo de navegación del navegador (atrás/adelante)
  window.addEventListener('popstate', () => {
    void handleCurrentRoute();
  });

  // 4. Gestión de expiración de sesión en rutas protegidas
  authStore.onSessionExpired(() => {
    cartStore.setMessage('Tu sesión ha expirado. Inicia sesión nuevamente para continuar.');
    const path = window.location.pathname;
    if (/^(\/checkout|\/pedidos(?:\/\d+)?)$/.test(path)) {
      navigateTo(`/ingresar?continuar=${encodeURIComponent(path + window.location.search)}`, {
        replace: true
      });
    }
  });

  // 5. Sincronización reactiva de componentes con los estados globales
  setRouteChangeListener(pathname => {
    header.updateForRoute(pathname);
    footer.updateForRoute(pathname);
  });

  authStore.subscribe(() => {
    header.renderAccount();
  });

  cartStore.subscribe(() => {
    header.renderCart();
    toast.render();
  });

  // 6. Carga inicial del catálogo y resolución de la ruta activa
  void catalogStore.refresh();
  void handleCurrentRoute();
}

bootstrapApp();
