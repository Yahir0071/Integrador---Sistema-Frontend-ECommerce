import { el, clearElement } from '../../shared/dom.js';
import { authStore } from '../../core/auth.store.js';
import { cartStore } from '../../core/cart.store.js';
import { navigateTo } from '../../router.js';

/**
 * Componente / Fragmento de Cabecera (HeaderComponent).
 * Encapsula la barra superior (topbar), marca, menú principal,
 * buscador global, opciones de cuenta y contador del carrito.
 */
export class HeaderComponent {
  constructor() {
    this.container = null;
    this.menuOpen = false;
    this.searchingOpen = false;

    // Elementos del DOM del componente
    this.topbar = null;
    this.mainNav = null;
    this.navHome = null;
    this.navProductos = null;
    this.mobileAccount = null;
    this.desktopAccount = null;
    this.siteSearch = null;
    this.globalSearchInput = null;
    this.mobileSearchBtn = null;
    this.desktopCartText = null;
    this.mobileCartText = null;
    this.menuBtn = null;
  }

  mount(target) {
    this.container = target;
    clearElement(this.container);

    this.topbar = el('div', {
      id: 'topbar',
      className: 'topbar',
      text: 'Tu compra del día, ahora también en línea · Recojo en tienda'
    });

    const brand = el(
      'a',
      { className: 'brand', href: '/', dataset: { nav: 'true' } },
      el('strong', { text: 'la bodega.' }),
      el('span', { text: 'CERCA DE TI' })
    );

    this.navHome = el('a', { id: 'nav-home', href: '/', dataset: { nav: 'true' }, text: 'Inicio' });
    this.navProductos = el('a', { id: 'nav-productos', href: '/productos', dataset: { nav: 'true' }, text: 'Productos' });
    const navCategorias = el('a', { id: 'nav-categorias', href: '/#categorias', dataset: { nav: 'true' }, text: 'Categorías' });
    const navNosotros = el('a', { id: 'nav-nosotros', className: 'desktop-link', href: '/#nosotros', dataset: { nav: 'true' }, text: 'Nosotros' });
    this.mobileAccount = el('div', { id: 'mobile-account', className: 'mobile-account' });

    this.mainNav = el(
      'nav',
      { id: 'main-nav', className: 'main-nav', 'aria-label': 'Navegación principal' },
      this.navHome,
      this.navProductos,
      navCategorias,
      navNosotros,
      this.mobileAccount
    );

    this.globalSearchInput = el('input', {
      id: 'global-search-input',
      type: 'search',
      placeholder: '⌕ ¿Qué necesitas hoy?',
      'aria-label': 'Buscar en la tienda'
    });

    this.siteSearch = el(
      'form',
      { id: 'site-search', className: 'site-search', role: 'search' },
      this.globalSearchInput,
      el('button', { type: 'submit', className: 'visually-hidden', text: 'Buscar' })
    );

    this.mobileSearchBtn = el('button', {
      id: 'mobile-search-btn',
      className: 'mobile-search-button',
      type: 'button',
      'aria-label': 'Abrir buscador',
      text: '⌕'
    });

    this.desktopAccount = el('div', { id: 'desktop-account', className: 'desktop-account' });

    this.desktopCartText = el('span', { id: 'desktop-cart-text', className: 'desktop-cart', text: 'Mi carrito · 0' });
    this.mobileCartText = el('span', { id: 'mobile-cart-text', className: 'mobile-cart', text: 'Bolsa 0' });

    const cartLink = el(
      'a',
      { id: 'cart-link', className: 'cart-link', href: '/carrito', dataset: { nav: 'true' } },
      this.desktopCartText,
      this.mobileCartText
    );

    this.menuBtn = el('button', {
      id: 'menu-btn',
      className: 'menu-button',
      type: 'button',
      'aria-expanded': 'false',
      'aria-label': 'Abrir menú',
      text: '☰'
    });

    const headerInner = el(
      'div',
      { className: 'container header-inner' },
      brand,
      this.mainNav,
      this.siteSearch,
      this.mobileSearchBtn,
      this.desktopAccount,
      cartLink,
      this.menuBtn
    );

    const siteHeader = el('header', { className: 'site-header' }, headerInner);

    this.container.append(this.topbar, siteHeader);

    this.bindEvents();
    this.renderAccount();
    this.renderCart();
  }

  bindEvents() {
    this.menuBtn.addEventListener('click', () => this.toggleMenu());
    this.mobileSearchBtn.addEventListener('click', () => this.toggleSearch());

    this.siteSearch.addEventListener('submit', event => {
      event.preventDefault();
      const val = this.globalSearchInput.value.trim();
      this.setSearch(false);
      this.setMenu(false);
      const target = val ? `/productos?buscar=${encodeURIComponent(val)}` : '/productos';
      navigateTo(target);
    });
  }

  setMenu(open) {
    this.menuOpen = Boolean(open);
    this.mainNav.classList.toggle('open', this.menuOpen);
    this.menuBtn.setAttribute('aria-expanded', String(this.menuOpen));
    this.menuBtn.textContent = this.menuOpen ? '×' : '☰';
  }

  toggleMenu() {
    this.setMenu(!this.menuOpen);
  }

  setSearch(open) {
    this.searchingOpen = Boolean(open);
    this.siteSearch.classList.toggle('expanded', this.searchingOpen);
    if (this.searchingOpen) {
      this.globalSearchInput.focus();
    }
  }

  toggleSearch() {
    this.setSearch(!this.searchingOpen);
  }

  handleLogout() {
    authStore.logout();
    this.setMenu(false);
    navigateTo('/');
  }

  renderAccount() {
    if (!this.mobileAccount || !this.desktopAccount) return;

    clearElement(this.mobileAccount);
    clearElement(this.desktopAccount);

    if (authStore.authenticated) {
      const userName = authStore.firstName;

      this.mobileAccount.append(
        el('a', {
          href: '/pedidos',
          dataset: { nav: 'true' },
          text: 'Mis pedidos',
          onClick: () => this.setMenu(false)
        }),
        el('span', { text: `Hola, ${userName}` }),
        el('button', {
          type: 'button',
          className: 'text-button',
          text: 'Cerrar sesión',
          onClick: () => this.handleLogout()
        })
      );

      this.desktopAccount.append(
        el('a', {
          href: '/pedidos',
          dataset: { nav: 'true' },
          text: 'Mis pedidos',
          onClick: () => this.setMenu(false)
        }),
        el('span', { text: `Hola, ${userName}` }),
        el('button', {
          type: 'button',
          text: 'Salir',
          onClick: () => this.handleLogout()
        })
      );
    } else {
      this.mobileAccount.append(
        el('a', {
          href: '/ingresar',
          dataset: { nav: 'true' },
          text: 'Iniciar sesión',
          onClick: () => this.setMenu(false)
        }),
        el('a', {
          href: '/registro',
          dataset: { nav: 'true' },
          text: 'Crear mi cuenta',
          onClick: () => this.setMenu(false)
        })
      );

      this.desktopAccount.appendChild(
        el('a', {
          href: '/ingresar',
          dataset: { nav: 'true' },
          text: 'Ingresar'
        })
      );
    }
  }

  renderCart() {
    if (!this.desktopCartText || !this.mobileCartText) return;
    const count = cartStore.count;
    this.desktopCartText.textContent = `Mi carrito · ${count}`;
    this.mobileCartText.textContent = `Bolsa ${count}`;
  }

  updateForRoute(pathname) {
    const isHome = pathname === '/';
    if (this.topbar) {
      this.topbar.hidden = !isHome;
    }
    if (this.navHome) {
      this.navHome.classList.toggle('active', isHome);
    }
    if (this.navProductos) {
      this.navProductos.classList.toggle('active', pathname.startsWith('/productos'));
    }
    this.setMenu(false);
    this.setSearch(false);
  }
}
