/**
 * ============================================
 * VALIDATORS.JS - Validación de entradas
 * ============================================
 * Validadores puros, sin dependencias externas.
 * Se aplican en cliente Y servidor.
 *
 * Convención: cada validador retorna { ok: boolean, errors: string[] }
 */

// ===== REGEX =====
const RE_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const RE_PHONE_CU = /^\d{8}$/;                    // Cuba: 8 dígitos
const RE_NAME = /^[\p{L}\p{M}\s'.\-]{2,120}$/u;   // Letras, espacios, guiones
const RE_URL = /^https?:\/\/[^\s<>"']+$/i;
const RE_PASSWORD_UPPER = /[A-ZÁÉÍÓÚÑ]/;
const RE_PASSWORD_LOWER = /[a-záéíóúñ]/;
const RE_PASSWORD_DIGIT = /\d/;
const RE_PASSWORD_SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/;

// ===== HELPERS =====
function isEmpty(value) {
  return value === null || value === undefined || String(value).trim() === '';
}

function isString(value) {
  return typeof value === 'string';
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// ===== VALIDADORES ATÓMICOS =====

export function validateRequired(value, fieldName = 'Campo') {
  const errors = [];
  if (isEmpty(value)) errors.push(`${fieldName} es obligatorio.`);
  return { ok: errors.length === 0, errors };
}

export function validateString(value, { min = 0, max = 1000, fieldName = 'Campo' } = {}) {
  const errors = [];
  if (!isString(value)) {
    errors.push(`${fieldName} debe ser texto.`);
    return { ok: false, errors };
  }
  const len = value.trim().length;
  if (len < min) errors.push(`${fieldName} debe tener al menos ${min} caracteres.`);
  if (len > max) errors.push(`${fieldName} no puede superar ${max} caracteres.`);
  return { ok: errors.length === 0, errors };
}

export function validateEmail(value) {
  const errors = [];
  if (isEmpty(value)) {
    errors.push('El correo es obligatorio.');
    return { ok: false, errors };
  }
  const email = String(value).trim().toLowerCase();
  if (email.length > 254) errors.push('El correo es demasiado largo.');
  if (!RE_EMAIL.test(email)) errors.push('El correo no tiene un formato válido.');
  return { ok: errors.length === 0, errors };
}

export function validatePhoneCU(value, { required = false } = {}) {
  const errors = [];
  if (isEmpty(value)) {
    if (required) errors.push('El teléfono es obligatorio.');
    return { ok: errors.length === 0, errors };
  }
  const phone = String(value).replace(/\D/g, '');
  if (!RE_PHONE_CU.test(phone)) {
    errors.push('El teléfono debe tener 8 dígitos numéricos (Cuba).');
  }
  return { ok: errors.length === 0, errors };
}

export function validateName(value, { fieldName = 'Nombre' } = {}) {
  const errors = [];
  if (isEmpty(value)) {
    errors.push(`${fieldName} es obligatorio.`);
    return { ok: false, errors };
  }
  const name = String(value).trim();
  if (!RE_NAME.test(name)) {
    errors.push(`${fieldName} solo puede contener letras, espacios, guiones y apóstrofes (2-120 caracteres).`);
  }
  return { ok: errors.length === 0, errors };
}

export function validatePassword(value, { minLength = 8 } = {}) {
  const errors = [];
  if (isEmpty(value)) {
    errors.push('La contraseña es obligatoria.');
    return { ok: false, errors };
  }
  const pass = String(value);
  if (pass.length < minLength) errors.push(`La contraseña debe tener al menos ${minLength} caracteres.`);
  if (pass.length > 128) errors.push('La contraseña no puede superar 128 caracteres.');
  if (!RE_PASSWORD_UPPER.test(pass)) errors.push('Debe incluir al menos una mayúscula.');
  if (!RE_PASSWORD_LOWER.test(pass)) errors.push('Debe incluir al menos una minúscula.');
  if (!RE_PASSWORD_DIGIT.test(pass)) errors.push('Debe incluir al menos un número.');
  if (!RE_PASSWORD_SPECIAL.test(pass)) errors.push('Debe incluir al menos un carácter especial.');
  return { ok: errors.length === 0, errors };
}

export function validatePasswordMatch(pass1, pass2) {
  const errors = [];
  if (pass1 !== pass2) errors.push('Las contraseñas no coinciden.');
  return { ok: errors.length === 0, errors };
}

export function validateUrl(value, { required = false, fieldName = 'URL' } = {}) {
  const errors = [];
  if (isEmpty(value)) {
    if (required) errors.push(`${fieldName} es obligatoria.`);
    return { ok: errors.length === 0, errors };
  }
  const url = String(value).trim();
  if (url.length > 2048) errors.push(`${fieldName} es demasiado larga.`);
  if (!RE_URL.test(url)) errors.push(`${fieldName} no tiene un formato válido (debe empezar por http:// o https://).`);
  return { ok: errors.length === 0, errors };
}

export function validateNumber(value, { min = -Infinity, max = Infinity, fieldName = 'Número' } = {}) {
  const errors = [];
  const num = Number(value);
  if (!isNumber(num)) {
    errors.push(`${fieldName} debe ser un número.`);
    return { ok: false, errors };
  }
  if (num < min) errors.push(`${fieldName} debe ser mayor o igual a ${min}.`);
  if (num > max) errors.push(`${fieldName} debe ser menor o igual a ${max}.`);
  return { ok: errors.length === 0, errors };
}

export function validateEnum(value, allowed = [], { fieldName = 'Valor', required = true } = {}) {
  const errors = [];
  if (isEmpty(value)) {
    if (required) errors.push(`${fieldName} es obligatorio.`);
    return { ok: errors.length === 0, errors };
  }
  if (!allowed.includes(value)) {
    errors.push(`${fieldName} debe ser uno de: ${allowed.join(', ')}.`);
  }
  return { ok: errors.length === 0, errors };
}

export function validateLatitude(value) {
  return validateNumber(value, { min: -90, max: 90, fieldName: 'Latitud' });
}

export function validateLongitude(value) {
  return validateNumber(value, { min: -180, max: 180, fieldName: 'Longitud' });
}

export function validateArray(value, { min = 0, max = 100, fieldName = 'Lista' } = {}) {
  const errors = [];
  if (!Array.isArray(value)) {
    errors.push(`${fieldName} debe ser una lista.`);
    return { ok: false, errors };
  }
  if (value.length < min) errors.push(`${fieldName} debe tener al menos ${min} elementos.`);
  if (value.length > max) errors.push(`${fieldName} no puede superar ${max} elementos.`);
  return { ok: errors.length === 0, errors };
}

// ===== VALIDADORES COMPUESTOS =====

/**
 * Valida el payload de login.
 */
export function validateLoginPayload({ identificador, password }) {
  const errors = [];
  if (isEmpty(identificador)) errors.push('El correo o teléfono es obligatorio.');
  if (isEmpty(password)) errors.push('La contraseña es obligatoria.');
  return { ok: errors.length === 0, errors };
}

/**
 * Valida el payload de registro completo.
 */
export function validateRegisterPayload({ nombre, email, telefono, password, confirmPassword, rol }) {
  const errors = [];

  const vName = validateName(nombre, { fieldName: 'Nombre' });
  errors.push(...vName.errors);

  const vEmail = validateEmail(email);
  errors.push(...vEmail.errors);

  if (telefono && !isEmpty(telefono)) {
    const vPhone = validatePhoneCU(telefono);
    errors.push(...vPhone.errors);
  }

  const vPass = validatePassword(password);
  errors.push(...vPass.errors);

  if (confirmPassword !== undefined) {
    const vMatch = validatePasswordMatch(password, confirmPassword);
    errors.push(...vMatch.errors);
  }

  if (rol !== undefined) {
    const vRol = validateEnum(rol, ['casual', 'gestor', 'admin'], { fieldName: 'Rol' });
    errors.push(...vRol.errors);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Valida una reseña.
 */
export function validateResenaPayload({ restauranteId, puntuacion, texto }) {
  const errors = [];

  if (isEmpty(restauranteId)) errors.push('El restaurante es obligatorio.');

  const vPunt = validateNumber(puntuacion, { min: 1, max: 5, fieldName: 'Puntuación' });
  errors.push(...vPunt.errors);

  const vTexto = validateString(texto, { min: 3, max: 1000, fieldName: 'Texto de la reseña' });
  errors.push(...vTexto.errors);

  return { ok: errors.length === 0, errors };
}

/**
 * Valida una solicitud de espacio.
 */
export function validateSolicitudPayload(payload) {
  const errors = [];
  const {
    nombre, tipo, precio, horario, telefono, descripcion,
    municipio, direccion, lat, lng, emailGestor, passwordGestor, nombreGestor
  } = payload;

  errors.push(...validateString(nombre, { min: 3, max: 120, fieldName: 'Nombre del establecimiento' }).errors);
  errors.push(...validateEnum(tipo, ['criolla','rápida','italiana','mariscos','cafetería','heladería','dulcería'], { fieldName: 'Tipo de cocina' }).errors);
  errors.push(...validateEnum(precio, ['1','2','3'], { fieldName: 'Rango de precios' }).errors);
  errors.push(...validateString(horario, { min: 3, max: 500, fieldName: 'Horario' }).errors);
  errors.push(...validatePhoneCU(telefono, { required: true }).errors);
  errors.push(...validateString(descripcion, { min: 10, max: 2000, fieldName: 'Descripción' }).errors);
  errors.push(...validateString(municipio, { min: 2, max: 100, fieldName: 'Municipio' }).errors);
  errors.push(...validateString(direccion, { min: 3, max: 250, fieldName: 'Dirección' }).errors);
  errors.push(...validateLatitude(lat).errors);
  errors.push(...validateLongitude(lng).errors);
  errors.push(...validateName(nombreGestor, { fieldName: 'Nombre del gestor' }).errors);
  errors.push(...validateEmail(emailGestor).errors);
  errors.push(...validatePassword(passwordGestor).errors);

  return { ok: errors.length === 0, errors };
}