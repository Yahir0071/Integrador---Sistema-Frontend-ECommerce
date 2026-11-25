import { el, clearElement } from '../../shared/dom.js';

/**
 * Renderiza una pantalla 404 comprensible cuando el usuario navega a una ruta inexistente.
 *
 * @param {HTMLElement} container
 * @param {{ pathname?: string }} [context]
 */
export function mountNotFoundPage(container, { pathname = '' } = {}) {
  clearElement(container);

  const page = el(
    'section',
    { className: 'container not-found-page' },
    el(
      'div',
      { className: 'panel state not-found-card' },
      el('span', { className: 'eyebrow', text: 'ERROR 404 · PÁGINA NO ENCONTRADA' }),
      el('h1', { text: 'No encontramos la página que buscas' }),
      el('p', {
        text: pathname
          ? `La ruta "${pathname}" no existe o fue movida en nuestra tienda.`
          : 'La dirección solicitada no existe o ya no está disponible en la tienda.'
      }),
      el(
        'div',
        { className: 'not-found-actions' },
        el('a', {
          className: 'button button-orange',
          href: '/productos',
          dataset: { nav: 'true' },
          text: 'Explorar catálogo'
        }),
        el('a', {
          className: 'button',
          href: '/',
          dataset: { nav: 'true' },
          text: 'Volver al inicio'
        })
      )
    )
  );

  container.appendChild(page);
  return () => {};
}
