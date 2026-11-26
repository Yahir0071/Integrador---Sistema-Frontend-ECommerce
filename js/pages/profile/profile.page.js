import { el, clearElement } from '../../shared/dom.js';
import { authStore } from '../../core/auth.store.js';

const PHONE_PATTERN = /^(?=(?:.*\d){7,15})[0-9+ ()-]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Página de Mi Perfil (`/perfil`) para que el cliente consulte y actualice sus datos.
 * @param {HTMLElement} container
 */
export function mountProfilePage(container) {
  clearElement(container);

  const user = authStore.user || {};
  let pending = false;

  const nombreInput = el('input', {
    id: 'perfil-nombre',
    name: 'nombreCompleto',
    type: 'text',
    value: user.nombreCompleto || '',
    required: true,
    maxLength: 100
  });
  const emailInput = el('input', {
    id: 'perfil-email',
    name: 'email',
    type: 'email',
    value: user.email || '',
    required: true,
    maxLength: 100
  });
  const telefonoInput = el('input', {
    id: 'perfil-telefono',
    name: 'telefono',
    type: 'tel',
    value: user.telefono || '',
    required: true,
    maxLength: 15
  });

  const statusMsg = el('p', { className: 'state', role: 'status', hidden: true });
  const errorMsg = el('p', { className: 'form-error', role: 'alert', hidden: true });
  const submitBtn = el('button', { type: 'submit', className: 'button', text: 'Guardar cambios' });

  const form = el(
    'form',
    { className: 'auth-form', noValidate: true },
    el('label', { htmlFor: 'perfil-username', text: 'Usuario (no editable)' }),
    el('input', { id: 'perfil-username', type: 'text', value: user.username || '', disabled: true }),
    el('label', { htmlFor: 'perfil-nombre', text: 'Nombre completo' }),
    nombreInput,
    el('label', { htmlFor: 'perfil-email', text: 'Correo electrónico' }),
    emailInput,
    el('label', { htmlFor: 'perfil-telefono', text: 'Teléfono' }),
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
      await authStore.updateProfile({ nombreCompleto, email, telefono });
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

  const section = el(
    'section',
    { className: 'container page-section' },
    el('div', { className: 'page-heading' },
      el('span', { className: 'eyebrow', text: 'TU CUENTA' }),
      el('h1', { text: 'Mi perfil' }),
      el('p', { text: 'Actualiza tu nombre, correo electrónico o teléfono de contacto.' })
    ),
    el('div', { className: 'panel', style: 'max-width: 560px;' },
      form,
      el('p', { style: 'margin-top: 16px;' },
        el('a', { href: '/pedidos', dataset: { nav: 'true' }, text: '← Ver mis pedidos' })
      )
    )
  );

  container.appendChild(section);
  return () => {};
}
