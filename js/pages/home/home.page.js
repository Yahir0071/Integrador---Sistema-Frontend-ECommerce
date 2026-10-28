import { el, clearElement } from '../../shared/dom.js';
import { catalogStore } from '../../core/catalog.store.js';
import { cartStore } from '../../core/cart.store.js';
import { createProductCard } from '../../components/product-card/product-card.component.js';
import { STORE_INFO, createStoreMapLink } from '../../shared/store-info.js';
import { ICONS } from '../../shared/icons.js';

function normalizeText(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getHomeCategories() {
  const all = catalogStore.categories;
  const terms = ['abarrote', 'bebida', 'lácteo', 'galleta', 'limpieza', 'cuidado'];
  const matches = terms.flatMap(term => {
    const c = all.find(cat => normalizeText(cat.nombre).includes(normalizeText(term)));
    return c ? [c] : [];
  });
  return [...matches, ...all.filter(c => !matches.includes(c))].slice(0, 6);
}

function getFeaturedProducts() {
  const all = catalogStore.products;
  const terms = ['arroz extra', 'aceite vegetal', 'leche evaporada', 'galletas oreo', 'fideos', 'atún'];
  const matches = terms.flatMap(term => {
    const p = all.find(prod => String(prod.nombre || '').toLowerCase().includes(term));
    return p ? [p] : [];
  });
  return [...matches, ...all.filter(p => !matches.includes(p))].slice(0, 4);
}

function getTopBrands() {
  const all = catalogStore.products;
  const brandCounts = {};
  all.forEach(p => {
    if (p.marca && p.marca.trim()) {
      const m = p.marca.trim();
      brandCounts[m] = (brandCounts[m] || 0) + 1;
    }
  });
  return Object.keys(brandCounts)
    .sort((a, b) => brandCounts[b] - brandCounts[a])
    .slice(0, 8);
}

/**
 * Renderiza la página de Inicio (`/`).
 * Módulo de portada renovado con identidad de Comercial Nova:
 * Hero principal, beneficios BOPIS con SVG, categorías, marcas aliadas y pasos de recojo.
 * @param {HTMLElement} container
 */
export function mountHomePage(container) {
  clearElement(container);

  // 1. Hero Section
  const hero = el(
    'section',
    { className: 'hero' },
    el(
      'div',
      { className: 'container hero-grid' },
      el(
        'div',
        { className: 'hero-copy' },
        el('div', { className: 'hero-badge' },
          ICONS.store(16),
          el('span', { text: 'COMERCIAL NOVA · RECOJO EN TIENDA FÍSICA' })
        ),
        el(
          'h1',
          {},
          'Tu compra del día,',
          el('br', { className: 'desktop-break' }),
          ' lista para recoger.'
        ),
        el('p', {
          className: 'desktop-copy',
          text: 'Explora más de 50 productos de primera necesidad. Realiza tu pedido desde casa, asegura tus productos con 10 minutos de reserva garantizada y recoge en tienda física sin hacer colas.'
        }),
        el('p', {
          className: 'mobile-copy',
          text: 'Pide abarrotes y bebidas desde casa con recojo rápido en tienda.'
        }),
        el(
          'div',
          { className: 'hero-actions' },
          el('a', { className: 'button hero-btn-primary', href: '/productos', dataset: { nav: 'true' }, text: 'Explorar catálogo completo' }),
          el('a', {
            className: 'button button-white secondary-action',
            href: '/#pasos',
            dataset: { nav: 'true' },
            text: '¿Cómo funciona?'
          })
        ),
        el('div', { className: 'hero-trust-row' },
          el('span', { className: 'trust-item' }, ICONS.check(14), ' Stock en tiempo real'),
          el('span', { className: 'trust-item' }, ICONS.check(14), ' Pago seguro con Yape'),
          el('span', { className: 'trust-item' }, ICONS.check(14), ' Pase de recojo con QR')
        )
      ),
      el('img', {
        className: 'hero-desktop',
        src: '/assets/figma/hero-desktop.svg',
        alt: 'Canasta con productos de Comercial Nova',
        width: '620',
        height: '390'
      }),
      el('img', {
        className: 'hero-mobile',
        src: '/assets/figma/hero-mobile.svg',
        alt: 'Canasta con productos de Comercial Nova',
        width: '350',
        height: '175'
      })
    )
  );

  // 2. Benefits Section con Iconos SVG
  const benefits = el(
    'section',
    { className: 'benefits' },
    el(
      'div',
      { className: 'container benefits-grid' },
      el(
        'div',
        { className: 'benefit-card' },
        el('div', { className: 'benefit-icon-wrapper' }, ICONS.clock(28)),
        el('div', { className: 'benefit-text' },
          el('strong', { text: 'Reserva de 10 minutos' }),
          el('small', { text: 'Tus existencias quedan separadas al confirmar el pedido.' })
        )
      ),
      el(
        'div',
        { className: 'benefit-card' },
        el('div', { className: 'benefit-icon-wrapper' }, ICONS.badgeCheck(28)),
        el('div', { className: 'benefit-text' },
          el('strong', { text: 'Abono fácil con Yape' }),
          el('small', { text: 'Paga con transferencia directa y sube tu comprobante.' })
        )
      ),
      el(
        'div',
        { className: 'benefit-card' },
        el('div', { className: 'benefit-icon-wrapper' }, ICONS.qr(28)),
        el('div', { className: 'benefit-text' },
          el('strong', { text: 'Entrega rápida con QR' }),
          el('small', { text: 'Muestra tu pase digital en tienda y retira en minutos.' })
        )
      )
    )
  );

  // 3. Categories Section con Iconos SVG Temáticos
  const categoryGrid = el('div', { className: 'category-grid' });
  const categoriesSection = el(
    'section',
    { className: 'categories-section container', id: 'categorias' },
    el(
      'div',
      { className: 'section-heading' },
      el('div', {},
        el('span', { className: 'eyebrow', text: 'EXPLORA NUESTROS PASILLOS' }),
        el('h2', { text: 'Compra por categoría' })
      ),
      el('a', { className: 'view-all-link', href: '/productos', dataset: { nav: 'true' }, text: 'Ver todo el catálogo →' })
    ),
    categoryGrid
  );

  // 4. Featured Section (Productos del día a día)
  const featuredContent = el('div');
  const featuredSection = el(
    'section',
    { className: 'featured container' },
    el(
      'div',
      { className: 'section-heading' },
      el('div', {},
        el('span', { className: 'eyebrow', text: 'SELECCIÓN DE LA TIENDA' }),
        el('h2', { text: 'Para tu día a día' })
      ),
      el('a', { className: 'view-all-link', href: '/productos', dataset: { nav: 'true' }, text: 'Explorar productos →' })
    ),
    el('p', {
      className: 'section-description',
      text: 'Productos cotidianos de primera necesidad en Comercial Nova. Stock obtenido en tiempo real desde el inventario central.'
    }),
    featuredContent,
    el('a', {
      className: 'button mobile-catalog',
      href: '/productos',
      dataset: { nav: 'true' },
      text: 'Ver todo el catálogo'
    })
  );

  // 5. Brands Section (Marcas de Confianza del Inventario Real)
  const brandsGrid = el('div', { className: 'brands-grid' });
  const brandsSection = el(
    'section',
    { className: 'brands-section container' },
    el(
      'div',
      { className: 'section-heading' },
      el('div', {},
        el('span', { className: 'eyebrow', text: 'CALIDAD GARANTIZADA' }),
        el('h2', { text: 'Nuestras marcas de confianza' })
      )
    ),
    el('p', {
      className: 'section-description',
      text: 'Encuentra las marcas preferidas por los hogares peruanos disponibles en la tienda.'
    }),
    brandsGrid
  );

  // 6. Steps Section (Modelo BOPIS en 3 Pasos)
  const stepsSection = el(
    'section',
    { className: 'steps-section', id: 'pasos' },
    el(
      'div',
      { className: 'container' },
      el('div', { className: 'steps-header' },
        el('span', { className: 'eyebrow', text: 'PROCESO FÁCIL Y SEGURO' }),
        el('h2', { text: '¿Cómo comprar para recojo en tienda?' }),
        el('p', {
          className: 'section-description',
          text: 'Un recorrido rápido y transparente para que tus compras sean más ágiles.'
        })
      ),
      el(
        'div',
        { className: 'steps-grid' },
        el(
          'div',
          { className: 'step-card' },
          el('span', { className: 'step-number', text: '01' }),
          el('h3', { text: 'Elige tus productos' }),
          el('p', { text: 'Encuentra lo que necesitas en el catálogo web y agrégalo a tu carrito.' })
        ),
        el(
          'div',
          { className: 'step-card' },
          el('span', { className: 'step-number', text: '02' }),
          el('h3', { text: 'Reserva y paga con Yape' }),
          el('p', { text: 'Al confirmar, tus productos se reservan 10 minutos. Transfiere por Yape y adjunta tu comprobante.' })
        ),
        el(
          'div',
          { className: 'step-card' },
          el('span', { className: 'step-number', text: '03' }),
          el('h3', { text: 'Retira con tu Código QR' }),
          el('p', { text: 'El personal alista tu pedido. Muestra tu pase digital en tienda y retíralo sin hacer colas.' })
        )
      )
    )
  );

  // 7. Store Section (Información Física y Mapa)
  const storeSection = el(
    'section',
    { className: 'store-section', id: 'nosotros' },
    el(
      'div',
      { className: 'container store-grid' },
      el(
        'div',
        { className: 'store-info-block' },
        el('span', { className: 'eyebrow', text: 'PUNTO DE RECOJO OFICIAL' }),
        el('h2', { text: 'Comercial Nova en Ate, Lima' }),
        el('p', {
          className: 'store-desc',
          text: 'Tu bodega de barrio de toda la vida, ahora modernizada con atención digital para tu comodidad.'
        }),
        el('div', { className: 'store-details' },
          el('p', {}, el('strong', { text: 'Dirección: ' }), STORE_INFO.direccion),
          el('p', {}, el('strong', { text: 'Referencia: ' }), STORE_INFO.referencia),
          el('p', {}, el('strong', { text: 'Horario: ' }), STORE_INFO.horario)
        ),
        createStoreMapLink(),
        el('div', { className: 'store-action' },
          el('a', { className: 'button', href: '/productos', dataset: { nav: 'true' }, text: 'Ver productos disponibles' })
        )
      ),
      el(
        'figure',
        { className: 'store-figure' },
        el('iframe', {
          src: STORE_INFO.mapaEmbedUrl,
          title: 'Ubicación de la bodega en Ate, Lima',
          className: 'store-map',
          loading: 'lazy',
          referrerpolicy: 'no-referrer-when-downgrade',
          width: '510',
          height: '240'
        }),
        el('figcaption', {}, createStoreMapLink(undefined, 'Abrir ubicación en Google Maps'))
      )
    )
  );

  container.append(hero, benefits, categoriesSection, featuredSection, brandsSection, stepsSection, storeSection);

  function renderDynamic() {
    // Categorías con Iconos SVG
    clearElement(categoryGrid);
    const categories = getHomeCategories();
    categories.forEach((category, i) => {
      const tile = el(
        'a',
        {
          className: `category-tile category-${i}`,
          href: `/productos?categoria=${encodeURIComponent(category.id)}`,
          dataset: { nav: 'true' }
        },
        el('div', { className: 'category-icon-box' }, ICONS.category(category.nombre, 32)),
        el('strong', { className: 'category-name', text: category.nombre })
      );
      categoryGrid.appendChild(tile);
    });

    // Marcas de Confianza
    clearElement(brandsGrid);
    const brands = getTopBrands();
    brands.forEach(brand => {
      const brandChip = el(
        'a',
        {
          className: 'brand-chip',
          href: `/productos?buscar=${encodeURIComponent(brand)}`,
          dataset: { nav: 'true' },
          title: `Ver productos de ${brand}`
        },
        el('span', { className: 'brand-chip-name', text: brand })
      );
      brandsGrid.appendChild(brandChip);
    });

    // Productos destacados
    clearElement(featuredContent);
    if (catalogStore.loading) {
      featuredContent.appendChild(el('p', { className: 'state', role: 'status', text: 'Cargando productos…' }));
    } else if (catalogStore.error) {
      featuredContent.appendChild(
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
    } else {
      const grid = el('div', { className: 'featured-grid' });
      getFeaturedProducts().forEach(product => {
        grid.appendChild(createProductCard(product, false));
      });
      featuredContent.appendChild(grid);
    }
  }

  renderDynamic();
  const unsubCatalog = catalogStore.subscribe(renderDynamic);
  const unsubCart = cartStore.subscribe(renderDynamic);

  return () => {
    unsubCatalog();
    unsubCart();
  };
}
