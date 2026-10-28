/**
 * Biblioteca de Iconografía SVG Vectorial Nítida para Comercial Nova.
 * Reemplaza los símbolos de texto Unicode por gráficos SVG profesionales.
 */

function createSvgElement(svgString) {
  const template = document.createElement('template');
  template.innerHTML = svgString.trim();
  return template.content.firstElementChild;
}

export const ICONS = {
  search(size = 18) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `);
  },

  cart(size = 20) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    `);
  },

  user(size = 18) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `);
  },

  menu(size = 22) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `);
  },

  close(size = 22) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `);
  },

  clock(size = 24) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    `);
  },

  qr(size = 24) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
        <path d="M14 14h3v3h-3z"></path>
        <path d="M17 17h4v4h-4z"></path>
        <path d="M14 20h3"></path>
        <path d="M20 14v3"></path>
      </svg>
    `);
  },

  store(size = 24) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `);
  },

  check(size = 16) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `);
  },

  badgeCheck(size = 24) {
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    `);
  },

  // Iconos temáticos de categorías de bodega
  category(name, size = 28) {
    const norm = String(name || '').toLowerCase();
    if (norm.includes('abarrote')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      `);
    }
    if (norm.includes('bebida')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 2h8"></path>
          <path d="M9 2v4a3 3 0 0 1-.88 2.12L7 9.24A4 4 0 0 0 6 12v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-7a4 4 0 0 0-1-2.76l-1.12-1.12A3 3 0 0 1 15 6V2"></path>
          <line x1="6" y1="14" x2="18" y2="14"></line>
        </svg>
      `);
    }
    if (norm.includes('lacteo') || norm.includes('lácteo')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 2h8v4H8z"></path>
          <path d="M7 6l-1 4v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10l-1-4"></path>
          <path d="M7 14h10"></path>
        </svg>
      `);
    }
    if (norm.includes('galleta') || norm.includes('golosina') || norm.includes('snack')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="8" cy="9" r="1" fill="currentColor"></circle>
          <circle cx="15" cy="8" r="1" fill="currentColor"></circle>
          <circle cx="10" cy="14" r="1" fill="currentColor"></circle>
          <circle cx="16" cy="13" r="1" fill="currentColor"></circle>
          <circle cx="13" cy="17" r="1" fill="currentColor"></circle>
        </svg>
      `);
    }
    if (norm.includes('limpieza')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2v4"></path>
          <path d="M12 18v4"></path>
          <path d="M4.93 4.93l2.83 2.83"></path>
          <path d="M16.24 16.24l2.83 2.83"></path>
          <path d="M2 12h4"></path>
          <path d="M18 12h4"></path>
          <path d="M4.93 19.07l2.83-2.83"></path>
          <path d="M16.24 7.76l2.83-2.83"></path>
        </svg>
      `);
    }
    if (norm.includes('cuidado') || norm.includes('personal') || norm.includes('higiene')) {
      return createSvgElement(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      `);
    }
    // Icono general por defecto
    return createSvgElement(`
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    `);
  }
};
