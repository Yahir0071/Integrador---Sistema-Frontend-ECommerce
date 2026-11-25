import { el, clearElement } from '../../shared/dom.js';
import { formatMoney } from '../../shared/format.js';
import { catalogStore } from '../../core/catalog.store.js';
import { cartStore } from '../../core/cart.store.js';
import { createProductArt } from '../../shared/product-art.js';
import { createQuantityControl } from '../../shared/quantity.js';

/**
 * Renderiza la página de Detalle de Producto (`/productos/:id`).
 * Módulo de producto individual: galería, ficha técnica, selector de cantidades y productos relacionados.
 *
 * @param {HTMLElement} container
 * @param {{ params: { id: string } }} context
 */
export function mountDetailPage(container, { params }) {
  clearElement(container);

  const productId = Number(params.id);
  let amount = 1;
  let activeTab = 'front';

  const page = el('div', { className: 'container detail-page' });
  container.appendChild(page);

  function render() {
    const activeElementId = document.activeElement?.id || '';
    clearElement(page);
    const product = catalogStore.products.find(p => p.id === productId);

    const breadcrumb = el(
      'nav',
      { className: 'breadcrumb', 'aria-label': 'Ruta del producto' },
      el('a', { href: '/', dataset: { nav: 'true' }, text: 'Inicio' }),
      ' / ',
      el('a', { href: '/productos', dataset: { nav: 'true' }, text: 'Productos' })
    );

    if (product) {
      breadcrumb.append(
        ' / ',
        el('a', {
          href: `/productos?categoria=${encodeURIComponent(product.categoriaId)}`,
          dataset: { nav: 'true' },
          text: product.categoriaNombre
        }),
        ` / ${product.nombre}`
      );
    }
    page.appendChild(breadcrumb);

    if (catalogStore.loading) {
      page.appendChild(el('p', { className: 'state', role: 'status', text: 'Cargando producto…' }));
      return;
    }

    if (catalogStore.error) {
      page.appendChild(
        el(
          'div',
          { className: 'state', role: 'alert' },
          el('p', { text: catalogStore.error }),
          el('button', {
            type: 'button',
            className: 'button',
            text: 'Reintentar',
            onClick: () => catalogStore.refresh()
          })
        )
      );
      return;
    }

    if (!product) {
      page.appendChild(
        el(
          'div',
          { className: 'state' },
          el('h1', { text: 'Producto no disponible' }),
          el('p', { text: 'Este producto ya no forma parte del catálogo.' }),
          el('a', {
            className: 'button',
            href: '/productos',
            dataset: { nav: 'true' },
            text: 'Volver al catálogo'
          })
        )
      );
      return;
    }

    if (amount > product.disponible && product.disponible > 0) {
      amount = product.disponible;
    }

    // Gallery con pestañas accesibles (preserva foco y estado ARIA)
    const tabSpecs = [
      { key: 'front', id: 'tab-front', label: 'Vista frontal' },
      { key: 'unit', id: 'tab-unit', label: 'Presentación' },
      { key: 'info', id: 'tab-info', label: 'Información' }
    ];

    const galleryPanel = el('div', {
      id: 'product-gallery-panel',
      role: 'tabpanel',
      'aria-labelledby': `tab-${activeTab}`
    });

    function buildPanelContent(tabKey) {
      if (tabKey === 'front') {
        return createProductArt(product, false);
      }
      return el(
        'div',
        { className: 'gallery-info panel' },
        el('h2', { text: tabKey === 'unit' ? 'Presentación' : 'Información' }),
        el('p', {
          text:
            tabKey === 'unit'
              ? product.nombre
              : product.descripcion ||
                'Consulta la presentación y las indicaciones del producto en tienda.'
        }),
        el('p', { text: `${product.marca || ''} · ${product.unidadMedida}` })
      );
    }

    const tabButtons = {};

    function selectTab(nextKey, moveFocus = false) {
      activeTab = nextKey;
      clearElement(galleryPanel);
      galleryPanel.setAttribute('aria-labelledby', `tab-${activeTab}`);
      galleryPanel.appendChild(buildPanelContent(activeTab));

      for (const spec of tabSpecs) {
        const btn = tabButtons[spec.key];
        if (!btn) continue;
        const selected = spec.key === activeTab;
        btn.className = selected ? 'active' : '';
        btn.setAttribute('aria-selected', String(selected));
        btn.setAttribute('tabindex', selected ? '0' : '-1');
      }

      if (moveFocus && tabButtons[activeTab]) {
        tabButtons[activeTab].focus();
      }
    }

    const galleryTabs = el('div', {
      className: 'gallery-tabs',
      role: 'tablist',
      'aria-label': 'Información del producto',
      onKeydown: event => {
        const idx = tabSpecs.findIndex(t => t.key === activeTab);
        if (idx === -1) return;
        let nextIdx = null;
        if (event.key === 'ArrowRight') {
          nextIdx = (idx + 1) % tabSpecs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + tabSpecs.length) % tabSpecs.length;
        } else if (event.key === 'Home') {
          nextIdx = 0;
        } else if (event.key === 'End') {
          nextIdx = tabSpecs.length - 1;
        }
        if (nextIdx !== null) {
          event.preventDefault();
          selectTab(tabSpecs[nextIdx].key, true);
        }
      }
    });

    for (const spec of tabSpecs) {
      const selected = activeTab === spec.key;
      const btn = el('button', {
        id: spec.id,
        type: 'button',
        role: 'tab',
        'aria-selected': String(selected),
        'aria-controls': 'product-gallery-panel',
        tabindex: selected ? '0' : '-1',
        className: selected ? 'active' : '',
        text: spec.label,
        onClick: () => selectTab(spec.key, false)
      });
      tabButtons[spec.key] = btn;
      galleryTabs.appendChild(btn);
    }

    galleryPanel.appendChild(buildPanelContent(activeTab));

    const gallery = el(
      'div',
      { className: 'gallery' },
      galleryPanel,
      galleryTabs,
      el('small', { className: 'art-caption', text: 'Imagen referencial del producto.' })
    );

    // Detail copy
    const detailCopy = el(
      'div',
      { className: 'detail-copy' },
      el('span', { className: 'eyebrow', text: `${product.categoriaNombre} / ${product.marca || ''}` }),
      el('h1', { text: product.nombre }),
      el('p', { text: product.descripcion || 'Un básico para tu compra de todos los días.' }),
      el('strong', { className: 'detail-price', text: formatMoney(product.precioVenta) }),
      el('small', { text: 'Precio de venta del catálogo de la tienda' }),
      el('p', {
        className: 'availability',
        text:
          product.disponible > 0
            ? `Disponible: ${product.disponible} ${product.disponible === 1 ? 'unidad' : 'unidades'}`
            : 'Agotado por el momento'
      })
    );

    if (product.disponible > 0) {
      const qtyControl = createQuantityControl({
        value: amount,
        max: product.disponible,
        label: product.nombre,
        onChange: nextVal => {
          amount = nextVal;
        }
      });

      const addBtn = el('button', {
        type: 'button',
        className: 'button button-orange',
        disabled: cartStore.quantity(product.id) >= product.disponible,
        text: 'Añadir al carrito',
        onClick: () => {
          cartStore.add(product, amount);
        }
      });

      detailCopy.append(
        el('label', { text: 'Cantidad' }),
        el('div', { className: 'detail-actions' }, qtyControl, addBtn)
      );
    }

    detailCopy.append(
      el('p', { className: 'detail-note', text: '✓ Podrás revisar cantidades y total en el carrito.' }),
      el('p', { className: 'detail-note', text: '✓ Compra para recojo en tienda.' }),
      el('small', { text: `Código: ${product.codigo} · Unidad: ${product.unidadMedida}` })
    );

    const detailGrid = el('section', { className: 'detail-grid' }, gallery, detailCopy);

    const extraInfo = el(
      'section',
      { className: 'extra-info' },
      el(
        'div',
        {},
        el('h2', { text: 'Descripción' }),
        el('p', { text: product.descripcion || `${product.nombre} de ${product.marca || 'la bodega'}.` })
      ),
      el(
        'div',
        {},
        el('h2', { text: 'Antes de confirmar' }),
        el('p', {
          text: 'Agregar productos al carrito no reserva existencias. La disponibilidad y el precio pueden cambiar antes de finalizar la compra.'
        })
      )
    );

    page.append(detailGrid, extraInfo);

    const related = catalogStore.products
      .filter(p => p.id !== product.id && p.categoriaId === product.categoriaId)
      .slice(0, 3);

    if (related.length) {
      const relatedLinks = el('div');
      related.forEach(rel => {
        relatedLinks.appendChild(
          el('a', {
            href: `/productos/${encodeURIComponent(rel.id)}`,
            dataset: { nav: 'true' },
            text: `${rel.nombre} →`
          })
        );
      });
      page.appendChild(
        el('section', { className: 'related' }, el('h2', { text: 'También te puede interesar' }), relatedLinks)
      );
    }

    if (activeElementId && activeElementId.startsWith('tab-')) {
      document.getElementById(activeElementId)?.focus();
    }
  }

  render();
  const unsubCatalog = catalogStore.subscribe(render);
  const unsubCart = cartStore.subscribe(render);

  return () => {
    unsubCatalog();
    unsubCart();
  };
}
