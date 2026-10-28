import { el, clearElement } from '../../shared/dom.js';
import { STORE_INFO } from '../../shared/store-info.js';

/**
 * Componente / Fragmento de Contacto WhatsApp Flotante (WhatsAppWidget).
 * Permite a los clientes comunicarse directamente con la tienda para dudas o pedidos.
 */
export class WhatsAppWidget {
  constructor() {
    this.container = null;
  }

  mount(target) {
    this.container = target;
    clearElement(this.container);

    const telefonoRaw = (STORE_INFO.telefono || '999999999').replace(/\D/g, '');
    const telefonoCompleto = telefonoRaw.startsWith('51') ? telefonoRaw : `51${telefonoRaw}`;
    const defaultMsg = encodeURIComponent('Hola Comercial Nova, deseo realizar una consulta sobre sus productos y pedidos.');
    const waUrl = `https://wa.me/${telefonoCompleto}?text=${defaultMsg}`;

    const iconSvg = `
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16 2a13.9 13.9 0 0 0-12 21l-1.9 7 7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.3 1.1 1.2-4.2-.3-.4A11.5 11.5 0 1 1 16 27.5zm6.3-8.6c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1-1.1 1.2-.4.3-.7.1a9.2 9.2 0 0 1-2.7-1.7 10.1 10.1 0 0 1-1.9-2.3c-.2-.3 0-.5.1-.7l.5-.6.3-.5a.6.6 0 0 0 0-.6c-.1-.1-.8-2-1.1-2.7s-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 .5A4.3 4.3 0 0 0 6.5 14a7.5 7.5 0 0 0 1.6 4 17.2 17.2 0 0 0 6.6 5.8c2.7 1.1 3.8 1 5.2.8a4.4 4.4 0 0 0 2.9-2 3.6 3.6 0 0 0 .2-2.1c-.1-.2-.4-.3-.7-.5z"/>
      </svg>
    `;

    const floatButton = el(
      'a',
      {
        href: waUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'whatsapp-float',
        'aria-label': 'Contactar por WhatsApp para consultas o pedidos',
        title: '¿Tienes dudas? Escríbenos por WhatsApp'
      }
    );
    floatButton.innerHTML = `${iconSvg}<span class="whatsapp-label">¿Dudas? Escríbenos</span>`;

    this.container.appendChild(floatButton);
  }
}
