import { el, clearElement } from '../../shared/dom.js';
import { STORE_INFO } from '../../shared/store-info.js';
import { authStore } from '../../core/auth.store.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^9\d{8}$/;

/**
 * Renderiza la vista del Libro de Reclamaciones Virtual (`/libro-de-reclamaciones`).
 * Incluye aviso institucional acorde al alcance académico universitario (UTP)
 * y formulario de registro referencial conforme a la Ley N° 29571.
 *
 * @param {HTMLElement} container
 */
export function mountComplaintsPage(container) {
  clearElement(container);

  const user = authStore.user;
  let submittedCode = '';

  const values = {
    tipo: 'RECLAMO',
    nombre: user?.nombreCompleto || '',
    documento: '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    pedido: '',
    detalle: ''
  };

  const touched = {
    nombre: false,
    documento: false,
    email: false,
    telefono: false,
    detalle: false
  };

  const page = el('div', { className: 'container order-page complaints-page' });
  container.appendChild(page);

  function validateField(name) {
    const raw = String(values[name] || '');
    const trimmed = raw.trim();
    if (name === 'nombre') {
      if (!trimmed) return 'Ingresa tu nombre completo.';
      if (trimmed.length < 3) return 'Ingresa al menos 3 caracteres.';
      return '';
    }
    if (name === 'documento') {
      if (!trimmed) return 'Ingresa tu DNI o documento de identidad.';
      if (!/^[A-Za-z0-9]{8,12}$/.test(trimmed)) return 'Usa entre 8 y 12 caracteres alfanuméricos.';
      return '';
    }
    if (name === 'email') {
      if (!trimmed) return 'Ingresa tu correo electrónico.';
      if (!EMAIL_PATTERN.test(trimmed)) return 'Ingresa un correo válido.';
      return '';
    }
    if (name === 'telefono') {
      const clean = raw.replace(/\s+/g, '');
      if (!clean) return 'Ingresa tu número de celular.';
      if (!PHONE_PATTERN.test(clean)) return 'Ingresa un celular peruano válido de 9 dígitos que inicie con 9.';
      return '';
    }
    if (name === 'detalle') {
      if (!trimmed) return 'Describe tu reclamo o queja.';
      if (trimmed.length < 15) return 'Detalla tu solicitud con al menos 15 caracteres.';
      return '';
    }
    return '';
  }

  function render() {
    clearElement(page);

    page.appendChild(
      el(
        'header',
        { className: 'page-heading' },
        el('a', {
          className: 'eyebrow',
          href: '/',
          dataset: { nav: 'true' },
          text: '← VOLVER AL INICIO'
        }),
        el('h1', { text: 'Libro de Reclamaciones Virtual' }),
        el('p', {
          text: 'Canal referencial de atención al consumidor conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571).'
        })
      )
    );

    page.appendChild(
      el(
        'aside',
        { className: 'demo-banner', role: 'note' },
        el('strong', { text: 'Alcance académico universitario (UTP)' }),
        el('p', {
          text: 'Este módulo forma parte de la demostración académica del Proyecto Integrador (UTP). Los registros enviados aquí sirven únicamente para validar el flujo de atención y no generan un expediente legal ni ante INDECOPI.'
        })
      )
    );

    const storeCard = el(
      'section',
      { className: 'panel complaints-store-card' },
      el('h2', { text: 'Datos del proveedor' }),
      el('p', {}, el('strong', { text: 'Razón social referencial: ' }), 'Comercial Nova · La Bodega'),
      el('p', {}, el('strong', { text: 'Dirección: ' }), STORE_INFO.direccion),
      el('p', {}, el('strong', { text: 'Horario de atención: ' }), STORE_INFO.horario)
    );

    if (submittedCode) {
      page.appendChild(
        el(
          'div',
          { className: 'complaints-layout' },
          el(
            'section',
            { className: 'panel complaints-confirmation', role: 'status' },
            el('span', { className: 'status-pill', text: 'Constancia de demostración' }),
            el('h2', { text: `Registro referencial ${submittedCode}` }),
            el('p', {
              text: 'Tu hoja de reclamación simulada se registró localmente para fines académicos. En la versión oficial en producción se emitirá copia al correo ingresado.'
            }),
            el(
              'div',
              { className: 'complaints-actions' },
              el('button', {
                type: 'button',
                className: 'button button-orange',
                text: 'Registrar otra consulta',
                onClick: () => {
                  submittedCode = '';
                  values.detalle = '';
                  values.pedido = '';
                  Object.keys(touched).forEach(k => {
                    touched[k] = false;
                  });
                  render();
                }
              }),
              el('a', {
                className: 'button',
                href: '/productos',
                dataset: { nav: 'true' },
                text: 'Ir al catálogo'
              })
            )
          ),
          storeCard
        )
      );
      return;
    }

    const inputRefs = {};
    const errorRefs = {};

    function updateField(name) {
      const inputEl = inputRefs[name];
      const errEl = errorRefs[name];
      if (!inputEl || !errEl) return;
      const msg = touched[name] ? validateField(name) : '';
      inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
      errEl.hidden = !msg;
      errEl.textContent = msg;
    }

    function makeField({ id, name, label, type = 'text', placeholder, maxlength, required = true }) {
      const errId = `${id}-error`;
      const inputEl = el('input', {
        id,
        name,
        type,
        placeholder,
        maxlength,
        required,
        value: values[name],
        'aria-invalid': 'false',
        'aria-describedby': errId,
        onInput: e => {
          values[name] = e.target.value;
          updateField(name);
        },
        onBlur: () => {
          touched[name] = true;
          updateField(name);
        }
      });
      const errEl = el('small', { id: errId, className: 'field-error', hidden: true });
      inputRefs[name] = inputEl;
      errorRefs[name] = errEl;
      return el('div', { className: 'complaints-field' }, el('label', { for: id, text: label }), inputEl, errEl);
    }

    const tipoSelect = el(
      'select',
      {
        id: 'claim-type',
        name: 'tipo',
        onChange: e => {
          values.tipo = e.target.value;
        }
      },
      el('option', { value: 'RECLAMO', text: 'Reclamo (disconformidad relacionada a los productos)' }),
      el('option', { value: 'QUEJA', text: 'Queja (malestar respecto a la atención al público)' })
    );
    tipoSelect.value = values.tipo;

    const detalleInput = el('textarea', {
      id: 'claim-detail',
      name: 'detalle',
      rows: '4',
      maxlength: 1000,
      required: true,
      placeholder: 'Describe lo sucedido, fecha aproximada y lo que solicitas.',
      value: values.detalle,
      'aria-invalid': 'false',
      'aria-describedby': 'claim-detail-error',
      onInput: e => {
        values.detalle = e.target.value;
        updateField('detalle');
      },
      onBlur: () => {
        touched.detalle = true;
        updateField('detalle');
      }
    });
    const detalleErr = el('small', { id: 'claim-detail-error', className: 'field-error', hidden: true });
    inputRefs.detalle = detalleInput;
    errorRefs.detalle = detalleErr;

    const form = el(
      'form',
      {
        className: 'panel complaints-form',
        novalidate: 'novalidate',
        onSubmit: e => {
          e.preventDefault();
          const requiredFields = ['nombre', 'documento', 'email', 'telefono', 'detalle'];
          requiredFields.forEach(k => {
            touched[k] = true;
            updateField(k);
          });
          const firstInvalid = requiredFields.find(k => Boolean(validateField(k)));
          if (firstInvalid) {
            inputRefs[firstInvalid]?.focus();
            return;
          }
          submittedCode = `LR-DEMO-${String(Date.now()).slice(-6)}`;
          render();
        }
      },
      el('h2', { text: 'Hoja de reclamación referencial' }),
      el('div', { className: 'complaints-field' }, el('label', { for: 'claim-type', text: 'Tipo de registro' }), tipoSelect),
      makeField({
        id: 'claim-name',
        name: 'nombre',
        label: 'Nombre completo',
        placeholder: 'Tu nombre y apellido',
        maxlength: 100
      }),
      makeField({
        id: 'claim-doc',
        name: 'documento',
        label: 'DNI / CE',
        placeholder: 'Ej. 71234567',
        maxlength: 12
      }),
      makeField({
        id: 'claim-email',
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        placeholder: 'correo@ejemplo.com',
        maxlength: 100
      }),
      makeField({
        id: 'claim-phone',
        name: 'telefono',
        label: 'Celular',
        type: 'tel',
        placeholder: '999 999 999',
        maxlength: 15
      }),
      makeField({
        id: 'claim-order',
        name: 'pedido',
        label: 'Código de pedido (opcional)',
        placeholder: 'Ej. NV-000123',
        maxlength: 40,
        required: false
      }),
      el(
        'div',
        { className: 'complaints-field' },
        el('label', { for: 'claim-detail', text: 'Detalle del reclamo o queja' }),
        detalleInput,
        detalleErr
      ),
      el('button', {
        type: 'submit',
        className: 'button button-orange',
        text: 'Registrar constancia referencial'
      })
    );

    page.appendChild(el('div', { className: 'complaints-layout' }, form, storeCard));
  }

  render();
  return () => {};
}
