/**
 * ============================================
 * FORMATTERS.JS - Formateo de datos
 * ============================================
 */

const DIAS_SEMANA = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

/**
 * Formatea fecha ISO a "DD/MM/YYYY".
 */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea fecha relativa ("hace 3 días").
 */
export function formatRelativeDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'hace unos segundos';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour} h`;
  if (diffDay < 30) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
  return formatDate(iso);
}

/**
 * Devuelve el nombre del día actual en español.
 */
export function getTodayName() {
  return DIAS_SEMANA[new Date().getDay()];
}

/**
 * Devuelve el nombre del día a partir de un índice 0-6 (0=Domingo).
 */
export function getDayName(index) {
  return DIAS_SEMANA[index] || '';
}

/**
 * Formatea un promedio de calificación.
 */
export function formatRating(value, decimals = 1) {
  if (value === null || value === undefined) return 'Nuevo';
  const n = Number(value);
  if (isNaN(n)) return 'Nuevo';
  return n.toFixed(decimals);
}

/**
 * Formatea un precio CUP.
 */
export function formatPrice(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' && value.includes('$')) return value;
  const n = Number(value);
  if (isNaN(n)) return String(value);
  return `$${n.toLocaleString('es-CU')} CUP`;
}

/**
 * Convierte "HH:MM" a minutos desde medianoche.
 */
export function timeToMinutes(hhmm) {
  const [h, m] = String(hhmm).split(':').map((x) => parseInt(x, 10));
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Trunca texto con elipsis.
 */
export function truncate(text, max = 100) {
  if (!text) return '';
  const str = String(text);
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trim() + '…';
}

/**
 * Capitaliza la primera letra.
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Devuelve iniciales de un nombre.
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}