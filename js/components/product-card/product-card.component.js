import { el } from '../../shared/dom.js';
import { formatMoney } from '../../shared/format.js';
import { createProductArt } from '../../shared/product-art.js';
import { cartStore } from '../../core/cart.store.js';
import { ICONS } from '../../shared/icons.js';

/**
 * Componente / Fragmento de Tarjeta de Producto (ProductCardComponent).
 * Muestra la miniatura del producto, categoría o marca, nombre, unidad de medida,
 * precio formateado en Soles, disponibilidad real de existencias y botón de acción con SVG.
 *
 * @param {any} product
 * @param {boolean} [catalogAsset=false]
 * @returns {HTMLElement}
 */
export function createProductCard(product, catalogAsset = false) {
  const detailHref = `/productos/${encodeURIComponent(product.id)}`;

  const artLink = el(
    'a',
    {
      href: detailHref,
      dataset: { nav: 'true' },
      'aria-label': `Ver detalle de ${product.nombre}`
    },
    createProductArt(product, catalogAsset)
  );

  const eyebrow = el('div', { className: 'card-eyebrow-row' },
    el('span', {
      className: 'eyebrow',
      text: product.marca || product.categoriaNombre || 'Comercial Nova'
    }),
    product.unidadMedida ? el('span', { className: 'unit-pill', text: product.unidadMedida }) : null
  );

  const nameLink = el('a', {
    className: 'product-name',
    href: detailHref,
    dataset: { nav: 'true' },
    title: product.nombre,
    text: product.nombre
  });

  const priceRow = el(
    'div',
    { className: 'price-row' },
    el('strong', { className: 'price', text: formatMoney(product.precioVenta) })
  );

  // Badge de disponibilidad real del inventario central
  let stockBadge;
  if (product.disponible <= 0) {
    stockBadge = el('span', { className: 'stock-badge out-stock', text: 'Agotado' });
  } else if (product.disponible <= 5) {
    stockBadge = el('span', { className: 'stock-badge low-stock', text: `¡Solo ${product.disponible} un.!` });
  } else {
    stockBadge = el('span', { className: 'stock-badge in-stock', text: `Disponible (${product.disponible})` });
  }

  const inCart = cartStore.quantity(product.id);
  const isDisabled = product.disponible <= inCart;
  const buttonLabel =
    product.disponible <= 0
      ? 'Agotado'
      : product.disponible <= inCart
        ? 'Máximo alcanzado'
        : inCart > 0
          ? `Agregar más (${inCart})`
          : 'Añadir al carrito';

  const addButton = el(
    'button',
    {
      type: 'button',
      className: `add-button ${inCart > 0 ? 'in-cart' : ''}`,
      disabled: isDisabled,
      onClick: e => {
        e.preventDefault();
        cartStore.add(product);
      }
    },
    ICONS.cart(16),
    el('span', { text: buttonLabel })
  );

  const info = el(
    'div',
    { className: 'product-info' },
    eyebrow,
    nameLink,
    priceRow,
    stockBadge,
    addButton
  );

  const article = el('article', { className: 'product-card' }, artLink, info);

  return el('div', { className: 'product-card-host' }, article);
}
