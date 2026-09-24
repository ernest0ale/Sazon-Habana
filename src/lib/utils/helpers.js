/**
 * ============================================
 * HELPERS.JS - Funciones utilitarias
 * ============================================
 */

/**
 * Une clases CSS condicionalmente.
 * Uso: cn('base', cond && 'activo', otra && 'x')
 */
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

/**
 * Agrupa un array por una función clave.
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Ordena un array por una clave.
 */
export function sortBy(arr, keyFn, dir = 'asc') {
  const sorted = [...arr].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return 0;
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Debounce.
 */
export function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Throttle.
 */
export function throttle(fn, wait = 300) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

/**
 * Deep clone simple (sin funciones).
 */
export function deepClone(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica si estamos en el cliente.
 */
export function isClient() {
  return typeof window !== 'undefined';
}

/**
 * Verifica si estamos en el servidor.
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * Genera un ID único (cliente).
 */
export function uid(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

/**
 * Promise con timeout.
 */
export function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

/**
 * Retorna un número entre min y max.
 */
export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Verifica si un objeto está vacío.
 */
export function isEmptyObject(obj) {
  return !obj || Object.keys(obj).length === 0;
}

/**
 * Elimina valores undefined/null de un objeto.
 */
export function cleanObject(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  }
  return out;
}