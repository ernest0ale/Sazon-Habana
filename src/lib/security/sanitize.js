/**
 * ============================================
 * SANITIZE.JS - Sanitización de entradas
 * ============================================
 * Previene XSS escapando HTML y limpiando strings.
 * Sin dependencias externas.
 */

/**
 * Escapa caracteres peligrosos para HTML.
 * Uso: al renderizar texto de usuario en el DOM.
 */
export function escapeHtml(input) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.replace(/[&<>"'`=/]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '`': return '&#x60;';
      case '=': return '&#x3D;';
      case '/': return '&#x2F;';
      default: return char;
    }
  });
}

/**
 * Escapa caracteres peligrosos para uso en atributos HTML.
 */
export function escapeAttr(input) {
  return escapeHtml(input);
}

/**
 * Limpia un string genérico:
 * - Elimina tags HTML y scripts
 * - Elimina caracteres de control
 * - Normaliza espacios
 * - Recorta
 */
export function sanitizeText(input, { maxLength = 2000 } = {}) {
  if (input === null || input === undefined) return '';
  let str = String(input);

  // Eliminar tags HTML y contenido de script/style
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  str = str.replace(/<[^>]*>/g, '');

  // Eliminar caracteres de control (excepto salto de línea y tab)
  str = str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  // Decodificar entidades HTML comunes (por si vienen ya codificadas)
  str = str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Normalizar espacios múltiples
  str = str.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');

  // Recortar
  str = str.trim();

  // Limitar longitud
  if (str.length > maxLength) str = str.slice(0, maxLength);

  return str;
}

/**
 * Sanitiza un email: lowercase, trim, solo caracteres válidos.
 */
export function sanitizeEmail(input) {
  if (!input) return '';
  return String(input).toLowerCase().trim().slice(0, 254);
}

/**
 * Sanitiza un teléfono: solo dígitos.
 */
export function sanitizePhone(input) {
  if (!input) return '';
  return String(input).replace(/\D/g, '').slice(0, 15);
}

/**
 * Sanitiza una URL:
 * - Solo permite http, https, data:image
 * - Bloquea javascript:, vbscript:, file:
 */
export function sanitizeUrl(input) {
  if (!input) return '';
  const str = String(input).trim();
  const lower = str.toLowerCase();

  // Bloquear esquemas peligrosos
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('data:application')
  ) {
    return '';
  }

  // Permitir data:image
  if (lower.startsWith('data:image/')) return str;

  // Permitir http(s)
  if (lower.startsWith('http://') || lower.startsWith('https://')) return str;

  // Permitir rutas relativas seguras
  if (str.startsWith('/') && !str.startsWith('//')) return str;

  return '';
}

/**
 * Sanitiza un nombre: solo letras, espacios, guiones, apóstrofes, puntos.
 */
export function sanitizeName(input, { maxLength = 120 } = {}) {
  if (!input) return '';
  return String(input)
    .replace(/[^\p{L}\p{M}\s'.\-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Elimina cualquier intento de path traversal.
 */
export function sanitizePath(input) {
  if (!input) return '';
  return String(input)
    .replace(/\.\./g, '')
    .replace(/[<>:"|?*\u0000-\u001F]/g, '')
    .slice(0, 512);
}

/**
 * Limpia un objeto completo recursivamente.
 * Útil para sanitizar payloads de formularios.
 */
export function sanitizeObject(obj, options = {}) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeText(obj, options);
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item, options));
  if (typeof obj === 'object') {
    const clean = {};
    for (const key of Object.keys(obj)) {
      clean[key] = sanitizeObject(obj[key], options);
    }
    return clean;
  }
  return obj;
}

/**
 * Neutraliza intentos de inyección SQL.
 * NOTA: Supabase usa queries parametrizadas, así que esto es defensa extra.
 */
export function sanitizeSqlLike(input) {
  if (!input) return '';
  return String(input).replace(/['";\\]|--|\/\*|\*\//g, '');
}