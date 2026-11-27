import { el, clearElement } from '../../shared/dom.js';
import { authStore } from '../../core/auth.store.js';

const PHONE_PATTERN = /^(?=(?:.*\d){7,15})[0-9+ ()-]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitials(name) {
  const parts = String(name || 'CL').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CL';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Página de Mi Perfil (`/perfil`) para que el cliente consulte y actualice sus datos.
 * @param {HTMLElement} container
 */
export function mountProfilePage(container) {
  clearElement(container);

  const user = authStore.user || {};
  let pending = false;

  const avatarEl = el('div', { className: 'profile-avatar', text: getInitials(user.nombreCompleto) });
  const summaryNameEl = el('h2', { className: 'profile-summary-name', text: user.nombreCompleto || 'Cliente' });
  const summaryUserEl = el('p', { className: 'profile-summary-handle', text: `@${user.username || ''}` });

  const nombreInput = el('input', {
    id: 'perfil-nombre',
    name: 'nombreCompleto',
    type: 'text',
    value: user.nombreCompleto || '',
    placeholder: 'Ej. María Gómez Pérez',
    required: true,
    maxLength: 100
  });
  const emailInput = el('input', {
    id: 'perfil-email',
    name: 'email',
    type: 'email',
    value: user.email || '',
    placeholder: 'correo@ejemplo.com',
    required: true,
    maxLength: 100
  });
  const telefonoInput = el('input', {
    id: 'perfil-telefono',
    name: 'telefono',
    type: 'tel',
    value: user.telefono || '',
    placeholder: 'Ej. 987654321',
    required: true,
    maxLength: 15
  });

  const statusMsg = el('p', { className: 'profile-success', role: 'status', hidden: true });
  const errorMsg = el('p', { className: 'form-error', role: 'alert', hidden: true });
  const submitBtn = el('button', { type: 'submit', className: 'button', text: 'Guardar cambios' });

  const form = el(
    'form',
    { noValidate: true },
    el('label', { htmlFor: 'perfil-username', text: 'Usuario (identificador único)' }),
    el('input', { id: 'perfil-username', type: 'text', value: user.username || '', disabled: true }),
    el('label', { htmlFor: 'perfil-nombre', text: 'Nombre completo' }),
    nombreInput,
    el('label', { htmlFor: 'perfil-email', text: 'Correo electrónico' }),
    emailInput,
    el('label', { htmlFor: 'perfil-telefono', text: 'Teléfono de contacto' }),
    telefonoInput,
    errorMsg,
    statusMsg,
    submitBtn
  );

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (pending) return;
    errorMsg.hidden = true;
    statusMsg.hidden = true;

    const nombreCompleto = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const telefono = telefonoInput.value.trim();

    if (!nombreCompleto) {
      errorMsg.textContent = 'Ingresa tu nombre completo.';
      errorMsg.hidden = false;
      nombreInput.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      errorMsg.textContent = 'Ingresa un correo electrónico válido.';
      errorMsg.hidden = false;
      emailInput.focus();
      return;
    }
    if (!PHONE_PATTERN.test(telefono)) {
      errorMsg.textContent = 'Ingresa un teléfono válido con entre 7 y 15 dígitos.';
      errorMsg.hidden = false;
      telefonoInput.focus();
      return;
    }

    pending = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando…';
    try {
      const updated = await authStore.updateProfile({ nombreCompleto, email, telefono });
      avatarEl.textContent = getInitials(updated.nombreCompleto);
      summaryNameEl.textContent = updated.nombreCompleto || nombreCompleto;
      statusMsg.textContent = 'Tus datos fueron actualizados correctamente.';
      statusMsg.hidden = false;
    } catch (err) {
      errorMsg.textContent = err?.error?.mensaje || 'No pudimos actualizar tus datos. Inténtalo nuevamente.';
      errorMsg.hidden = false;
    } finally {
      pending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Guardar cambios';
    }
  });

  const formCard = el(
    'section',
    { className: 'panel auth-panel profile-card' },
    el('h2', { text: 'Datos personales' }),
    el('p', { className: 'section-description', text: 'Mantén actualizada tu información para coordinar tus pedidos y recojos en tienda.' }),
    form
  );

  const summaryCard = el(
    'aside',
    { className: 'panel profile-summary' },
    avatarEl,
    summaryNameEl,
    summaryUserEl,
    el('span', { className: 'status-pill', text: 'Cuenta de cliente' }),
    el('div', { className: 'profile-links' },
      el('a', { className: 'button button-secondary', href: '/pedidos', dataset: { nav: 'true' }, text: 'Ver mis pedidos' }),
      el('a', { className: 'profile-back-link', href: '/productos', dataset: { nav: 'true' }, text: 'Seguir comprando →' })
    )
  );

  const section = el(
    'div',
    { className: 'container order-page profile-page' },
    el('header', { className: 'page-heading' },
      el('a', { className: 'eyebrow', href: '/', dataset: { nav: 'true' }, text: '← VOLVER AL INICIO' }),
      el('h1', { text: 'Mi perfil' }),
      el('p', { text: 'Consulta y actualiza tus datos de contacto de forma segura.' })
    ),
    el('div', { className: 'profile-layout' }, formCard, summaryCard)
  );

  container.appendChild(section);
  return () => {};
}
