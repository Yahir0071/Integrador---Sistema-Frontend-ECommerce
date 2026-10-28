import { el, clearElement } from '../../shared/dom.js';
import { cartStore } from '../../core/cart.store.js';

/**
 * Componente / Fragmento de Notificaciones Toast (ToastComponent).
 * Muestra avisos temporales de confirmación, errores o alertas del carrito.
 */
export class ToastComponent {
  constructor() {
    this.container = null;
    this.toastEl = null;
    this.toastTextEl = null;
    this.closeBtn = null;
  }

  mount(target) {
    this.container = target;
    clearElement(this.container);

    this.toastTextEl = el('span', { id: 'toast-text' });
    this.closeBtn = el('button', {
      id: 'toast-close',
      type: 'button',
      'aria-label': 'Cerrar aviso',
      text: '×'
    });

    this.toastEl = el(
      'div',
      { id: 'toast', className: 'toast', role: 'status', hidden: true },
      this.toastTextEl,
      this.closeBtn
    );

    this.closeBtn.addEventListener('click', () => {
      cartStore.setMessage('');
    });

    this.container.appendChild(this.toastEl);
    this.render();
  }

  render() {
    if (!this.toastEl || !this.toastTextEl) return;
    const msg = cartStore.message;
    if (msg) {
      this.toastTextEl.textContent = msg;
      this.toastEl.hidden = false;
    } else {
      this.toastTextEl.textContent = '';
      this.toastEl.hidden = true;
    }
  }
}
