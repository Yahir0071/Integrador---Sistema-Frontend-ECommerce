import { el, clearElement } from '../../shared/dom.js';
import { authStore } from '../../core/auth.store.js';
import { navigateTo } from '../../router.js';

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,50}$/;
const PHONE_PATTERN = /^9\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_ALIASES = Object.freeze({
  nombre: 'nombreCompleto',
  nombrecompleto: 'nombreCompleto',
  usuario: 'username',
  username: 'username',
  correo: 'email',
  email: 'email',
  celular: 'telefono',
  telefono: 'telefono',
  clave: 'password',
  contrasena: 'password',
  password: 'password'
});

function normalizeName(raw) {
  return String(raw || '').trim().replace(/\s+/g, ' ');
}

function normalizePhone(raw) {
  return String(raw || '').replace(/\s+/g, '');
}

function resolveFieldAlias(rawKey) {
  const key = String(rawKey || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
  return FIELD_ALIASES[key] || null;
}

function sanitizeContinuePath(raw) {
  const path = raw || '/';
  return /^(\/checkout|\/pedidos(?:\/\d+)?)$/.test(path) ? path : '/';
}

/**
 * Renderiza la página de Inicio de Sesión (`/ingresar`) o Registro (`/registro`).
 * Módulo de autenticación y registro de clientes con validación reactiva de formularios.
 *
 * @param {HTMLElement} container
 * @param {{ register?: boolean, queryParams: URLSearchParams }} context
 */
export function mountAuthPage(container, { register = false, queryParams }) {
  clearElement(container);

  const continueTo = sanitizeContinuePath(queryParams.get('continuar'));
  let pending = false;
  let errorText = '';
  let showPassword = false;

  const values = {
    nombreCompleto: '',
    username: '',
    email: '',
    telefono: '',
    password: ''
  };

  const touched = {
    nombreCompleto: false,
    username: false,
    email: false,
    telefono: false,
    password: false
  };

  const serverFieldErrors = {
    nombreCompleto: '',
    username: '',
    email: '',
    telefono: '',
    password: ''
  };

  function clearServerFieldErrors() {
    Object.keys(serverFieldErrors).forEach(k => {
      serverFieldErrors[k] = '';
    });
  }

  function validateField(name) {
    const raw = String(values[name] || '');
    if (name === 'username') {
      const val = raw.trim();
      if (!val) return { required: true };
      if (val.length > 50) return { maxlength: true };
      if (register && !USERNAME_PATTERN.test(val)) return { pattern: true };
      return null;
    }
    if (name === 'password') {
      if (!raw) return { required: true };
      if (register && raw.length < 8) return { minlength: true };
      if (register && raw.length > 72) return { maxlength: true };
      return null;
    }
    if (!register) return null;

    if (name === 'nombreCompleto') {
      const normalized = normalizeName(raw);
      if (!normalized) return { required: true };
      if (normalized.length > 100) return { maxlength: true };
      if (normalized.length < 2 || !NAME_PATTERN.test(normalized)) return { nameFormat: true };
      return null;
    }
    if (name === 'email') {
      const val = raw.trim();
      if (!val) return { required: true };
      if (!EMAIL_PATTERN.test(val)) return { email: true };
      if (val.length > 100) return { maxlength: true };
      return null;
    }
    if (name === 'telefono') {
      const cleanPhone = normalizePhone(raw);
      if (!cleanPhone) return { required: true };
      if (!PHONE_PATTERN.test(cleanPhone)) return { phoneFormat: true };
      return null;
    }
    return null;
  }

  function getFieldMessage(name) {
    if (serverFieldErrors[name]) return serverFieldErrors[name];
    const e = validateField(name);
    if (!e) return '';
    if (e.required) return 'Completa este campo.';
    if (e.email) return 'Ingresa un correo válido.';
    if (e.minlength) return 'Usa al menos 8 caracteres.';
    if (e.maxlength) return 'El texto es demasiado largo.';
    if (e.nameFormat) return 'Ingresa un nombre válido usando solo letras y espacios.';
    if (e.phoneFormat) return 'Ingresa un celular peruano válido de 9 dígitos que inicie con 9.';
    return name === 'username'
      ? 'Usa de 3 a 50 letras, números, puntos, guiones o guiones bajos.'
      : 'Revisa el formato de este campo.';
  }

  function isInvalid(name) {
    return Boolean(serverFieldErrors[name] || (touched[name] && validateField(name)));
  }

  function getActiveFields() {
    return register
      ? ['nombreCompleto', 'username', 'email', 'telefono', 'password']
      : ['username', 'password'];
  }

  function getFirstInvalidField() {
    return getActiveFields().find(f => Boolean(serverFieldErrors[f] || validateField(f))) || null;
  }

  const intro = el(
    'div',
    { className: 'auth-intro' },
    el('span', { className: 'eyebrow', text: 'TU COMPRA, CERCA DE TI' }),
    el('h1', {
      text: register ? 'Tu primera compra empieza aquí.' : 'Qué bueno tenerte de vuelta.'
    }),
    el('p', {
      text:
        continueTo === '/checkout'
          ? 'Tu carrito está guardado. Ingresa o crea tu cuenta para continuar.'
          : 'Explora tu bodega y encuentra lo que necesitas para cada día.'
    }),
    el('img', {
      src: '/assets/figma/hero-desktop.svg',
      alt: 'Canasta de productos',
      width: '620',
      height: '390'
    })
  );

  const form = el('form', { novalidate: 'novalidate' });
  const panel = el(
    'div',
    { className: 'auth-panel panel' },
    el('a', {
      href: '/carrito',
      dataset: { nav: 'true' },
      className: 'text-button back-cart',
      text: '← Volver al carrito'
    }),
    el('h2', { text: register ? 'Crea tu cuenta' : 'Inicia sesión' }),
    el('p', {
      className: 'section-description',
      text: register
        ? 'Solo necesitamos unos datos para conocerte.'
        : 'Ingresa con tu usuario y contraseña.'
    }),
    form,
    el(
      'p',
      { className: 'auth-switch' },
      register ? '¿Ya tienes una cuenta? ' : '¿Todavía no tienes cuenta? ',
      el('a', {
        href: `${register ? '/ingresar' : '/registro'}?continuar=${encodeURIComponent(continueTo)}`,
        dataset: { nav: 'true' },
        text: register ? 'Inicia sesión' : 'Regístrate'
      })
    )
  );

  const section = el('section', { className: 'auth-page container' }, intro, panel);
  container.appendChild(section);

  // Build form controls with live validation updates
  const errorRefs = {};
  const inputRefs = {};

  function createFieldBlock({
    id,
    name,
    label,
    type = 'text',
    autocomplete,
    placeholder,
    maxlength,
    required = true,
    errorId
  }) {
    const labelEl = el('label', { for: id, text: label });
    const inputEl = el('input', {
      id,
      name,
      type,
      autocomplete,
      placeholder,
      required,
      maxlength,
      value: values[name],
      'aria-invalid': isInvalid(name) ? 'true' : 'false',
      'aria-describedby': errorId,
      onInput: e => {
        values[name] = e.target.value;
        serverFieldErrors[name] = '';
        updateFieldError(name);
      },
      onBlur: () => {
        touched[name] = true;
        updateFieldError(name);
      }
    });
    const errorEl = el('small', {
      className: 'field-error',
      id: errorId,
      hidden: !isInvalid(name),
      text: isInvalid(name) ? getFieldMessage(name) : ''
    });
    inputRefs[name] = inputEl;
    errorRefs[name] = { errorEl, errorId };
    return [labelEl, inputEl, errorEl];
  }

  function updateFieldError(name) {
    const inputEl = inputRefs[name];
    const ref = errorRefs[name];
    if (!inputEl || !ref) return;
    const invalid = isInvalid(name);
    inputEl.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    ref.errorEl.hidden = !invalid;
    ref.errorEl.textContent = invalid ? getFieldMessage(name) : '';
  }

  function updateAllFieldErrors() {
    Object.keys(inputRefs).forEach(updateFieldError);
  }

  function applyBackendErrors(err) {
    const detalles = err?.error?.detalles;
    const backendMsg = err?.error?.mensaje || err?.message || '';
    const unmappedNotes = [];
    let firstMapped = null;

    const assignFieldError = (rawKey, rawMsg) => {
      const target = resolveFieldAlias(rawKey);
      const msgText = String(rawMsg || '').trim();
      if (!msgText) return false;
      if (target && inputRefs[target]) {
        serverFieldErrors[target] = msgText;
        touched[target] = true;
        if (!firstMapped) firstMapped = target;
        return true;
      }
      return false;
    };

    if (Array.isArray(detalles)) {
      for (const item of detalles) {
        if (item && typeof item === 'object') {
          const key = item.campo || item.field || item.nombre || '';
          const msg = item.mensaje || item.message || item.error || '';
          if (!assignFieldError(key, msg) && msg) {
            unmappedNotes.push(String(msg));
          }
        } else if (typeof item === 'string') {
          const colonIdx = item.indexOf(':');
          if (colonIdx > 0) {
            const key = item.slice(0, colonIdx);
            const msg = item.slice(colonIdx + 1);
            if (!assignFieldError(key, msg)) {
              unmappedNotes.push(item);
            }
          } else if (item.trim()) {
            unmappedNotes.push(item.trim());
          }
        }
      }
    } else if (detalles && typeof detalles === 'object') {
      for (const [key, val] of Object.entries(detalles)) {
        if (!assignFieldError(key, val) && val) {
          unmappedNotes.push(String(val));
        }
      }
    }

    // Respaldo para conflictos 409 conocidos sin objeto `detalles` explícito
    if (!firstMapped && register && Number(err?.status) === 409 && backendMsg) {
      const lower = backendMsg.toLowerCase();
      if (lower.includes('usuario') || lower.includes('username')) {
        assignFieldError('username', backendMsg);
      } else if (lower.includes('correo') || lower.includes('email')) {
        assignFieldError('email', backendMsg);
      } else if (lower.includes('celular') || lower.includes('teléfono') || lower.includes('telefono')) {
        assignFieldError('telefono', backendMsg);
      }
    }

    updateAllFieldErrors();

    if (firstMapped) {
      inputRefs[firstMapped].focus();
      setError(unmappedNotes.join(' '));
    } else {
      setError(
        unmappedNotes.join(' ') ||
          backendMsg ||
          'No pudimos completar la solicitud. Revisa tus datos.'
      );
    }
  }

  if (register) {
    form.append(
      ...createFieldBlock({
        id: 'nombreCompleto',
        name: 'nombreCompleto',
        label: 'Nombre completo',
        autocomplete: 'name',
        placeholder: 'Tu nombre y apellido',
        maxlength: 100,
        required: true,
        errorId: 'nombre-error'
      })
    );
  }

  form.append(
    ...createFieldBlock({
      id: 'username',
      name: 'username',
      label: 'Usuario',
      autocomplete: 'username',
      placeholder: 'Tu nombre de usuario',
      maxlength: 50,
      required: true,
      errorId: 'usuario-error'
    })
  );

  if (register) {
    form.append(
      ...createFieldBlock({
        id: 'email',
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        autocomplete: 'email',
        placeholder: 'correo@ejemplo.com',
        maxlength: 100,
        required: true,
        errorId: 'email-error'
      }),
      ...createFieldBlock({
        id: 'telefono',
        name: 'telefono',
        label: 'Celular',
        type: 'tel',
        autocomplete: 'tel',
        placeholder: '999 999 999',
        maxlength: 15,
        required: true,
        errorId: 'telefono-error'
      })
    );
  }

  // Password field with Mostrar/Ocultar button
  const pwLabel = el('label', { for: 'password', text: 'Contraseña' });
  const pwInput = el('input', {
    id: 'password',
    name: 'password',
    type: showPassword ? 'text' : 'password',
    autocomplete: register ? 'new-password' : 'current-password',
    placeholder: register ? 'Al menos 8 caracteres' : 'Tu contraseña',
    required: true,
    maxlength: 72,
    minlength: register ? 8 : undefined,
    value: values.password,
    'aria-invalid': isInvalid('password') ? 'true' : 'false',
    'aria-describedby': 'password-error',
    onInput: e => {
      values.password = e.target.value;
      serverFieldErrors.password = '';
      updateFieldError('password');
    },
    onBlur: () => {
      touched.password = true;
      updateFieldError('password');
    }
  });
  const togglePwBtn = el('button', {
    type: 'button',
    text: showPassword ? 'Ocultar' : 'Mostrar',
    onClick: () => {
      showPassword = !showPassword;
      pwInput.type = showPassword ? 'text' : 'password';
      togglePwBtn.textContent = showPassword ? 'Ocultar' : 'Mostrar';
    }
  });
  const pwError = el('small', {
    className: 'field-error',
    id: 'password-error',
    hidden: !isInvalid('password'),
    text: isInvalid('password') ? getFieldMessage('password') : ''
  });
  inputRefs.password = pwInput;
  errorRefs.password = { errorEl: pwError, errorId: 'password-error' };

  const formErrorPara = el('p', {
    className: 'form-error',
    role: 'alert',
    hidden: true
  });

  const submitBtn = el('button', {
    className: 'button button-orange submit',
    type: 'submit',
    text: register ? 'Crear mi cuenta' : 'Ingresar'
  });

  form.append(
    pwLabel,
    el('div', { className: 'password-field' }, pwInput, togglePwBtn),
    pwError,
    formErrorPara,
    submitBtn
  );

  function setError(msg) {
    errorText = msg || '';
    formErrorPara.hidden = !errorText;
    formErrorPara.textContent = errorText;
  }

  function setPendingState(isPending) {
    pending = isPending;
    submitBtn.disabled = pending;
    submitBtn.textContent = pending ? 'Un momento…' : register ? 'Crear mi cuenta' : 'Ingresar';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    setError('');
    clearServerFieldErrors();
    Object.keys(touched).forEach(k => {
      touched[k] = true;
    });
    updateAllFieldErrors();

    const firstInvalid = getFirstInvalidField();
    if (firstInvalid || pending) {
      if (firstInvalid && inputRefs[firstInvalid]) {
        inputRefs[firstInvalid].focus();
      }
      return;
    }

    if (register && new TextEncoder().encode(values.password).length > 72) {
      serverFieldErrors.password = 'La contraseña no debe superar 72 bytes. Usa menos caracteres.';
      updateFieldError('password');
      inputRefs.password?.focus();
      return;
    }

    setPendingState(true);
    try {
      if (register) {
        const cleanName = normalizeName(values.nombreCompleto);
        const cleanPhone = normalizePhone(values.telefono);
        const cleanUsername = values.username.trim();
        const cleanEmail = values.email.trim();
        await authStore.register({
          username: cleanUsername,
          password: values.password,
          nombreCompleto: cleanName,
          email: cleanEmail,
          telefono: cleanPhone
        });
      } else {
        await authStore.login(values.username.trim(), values.password);
      }
      navigateTo(continueTo);
    } catch (err) {
      if (err?.status === 0) {
        setError('No pudimos conectar con la tienda. Inténtalo nuevamente.');
      } else {
        applyBackendErrors(err);
      }
    } finally {
      setPendingState(false);
    }
  });

  return () => {};
}
