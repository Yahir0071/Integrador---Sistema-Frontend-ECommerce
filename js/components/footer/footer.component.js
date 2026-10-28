import { el, clearElement } from '../../shared/dom.js';
import { STORE_INFO, createStoreMapLink } from '../../shared/store-info.js';

/**
 * Componente / Fragmento de Pie de Página (FooterComponent).
 * Encapsula la marca institucional, enlaces de navegación,
 * información de contacto físico, mapa y sellos de confianza / Libro de Reclamaciones.
 */
export class FooterComponent {
  constructor() {
    this.container = null;
    this.footerElement = null;
  }

  mount(target) {
    this.container = target;
    clearElement(this.container);

    const brandCol = el(
      'div',
      { className: 'footer-brand' },
      el('a', { href: '/', dataset: { nav: 'true' }, text: 'la bodega.' }),
      el('p', { text: 'Tu tienda de productos cotidianos, ahora con compras en línea y recojo programado.' }),
      el('small', { text: 'Comercial Nova · Recojo en tienda física' })
    );

    const exploreCol = el(
      'div',
      { className: 'footer-column' },
      el('h3', { text: 'EXPLORA' }),
      el('a', { href: '/', dataset: { nav: 'true' }, text: 'Inicio' }),
      el('a', { href: '/productos', dataset: { nav: 'true' }, text: 'Productos' }),
      el('a', { href: '/carrito', dataset: { nav: 'true' }, text: 'Carrito' })
    );

    const infoCol = el(
      'div',
      { className: 'footer-column' },
      el('h3', { text: 'INFORMACIÓN' }),
      el('a', { href: '/#nosotros', dataset: { nav: 'true' }, text: 'Nosotros y Ubicación' }),
      el('span', { text: 'Recojo en tienda' }),
      el('a', {
        href: '#',
        onClick: e => {
          e.preventDefault();
          alert('Libro de Reclamaciones Virtual disponible conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571). Comunícate con atención al cliente.');
        },
        text: 'Libro de Reclamaciones'
      })
    );

    const contactCol = el(
      'div',
      { className: 'footer-column footer-contact', id: 'store-contact' },
      el('h3', { text: 'CONTACTO' }),
      el('span', { text: STORE_INFO.direccion }),
      el('span', { text: `Referencia: ${STORE_INFO.referencia}` }),
      el('span', { text: STORE_INFO.horario }),
      createStoreMapLink()
    );

    const footerInner = el(
      'div',
      { className: 'container footer-inner' },
      brandCol,
      exploreCol,
      infoCol,
      contactCol
    );

    this.footerElement = el('footer', { id: 'site-footer', className: 'site-footer' }, footerInner);
    this.container.appendChild(this.footerElement);
  }

  updateForRoute(pathname) {
    if (this.footerElement) {
      const isHome = pathname === '/';
      this.footerElement.classList.toggle('compact', !isHome);
    }
  }
}
