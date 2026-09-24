/**
 * ============================================
 * RATE-LIMIT.JS - Limitador de peticiones
 * ============================================
 * Implementación en memoria (suficiente para 1 instancia / MVP).
 * Si escalas a múltiples instancias, migrar a Redis/Upstash.
 */

const buckets = new Map();

// Limpieza periódica cada 5 min para no crecer indefinidamente
let cleanupInterval = null;
if (typeof setInterval !== 'undefined') {
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of buckets.entries()) {
      if (value.resetAt < now) buckets.delete(key);
    }
  }, 5 * 60 * 1000);
  if (cleanupInterval.unref) cleanupInterval.unref();
}

/**
 * Extrae la IP del cliente desde los headers.
 */
export function getClientIp(request) {
  if (!request) return 'unknown';
  const headers = request.headers;
  if (!headers) return 'unknown';

  const get = (k) => (typeof headers.get === 'function' ? headers.get(k) : headers[k]);

  const xff = get('x-forwarded-for');
  if (xff) return String(xff).split(',')[0].trim();

  const real = get('x-real-ip');
  if (real) return String(real).trim();

  const cf = get('cf-connecting-ip');
  if (cf) return String(cf).trim();

  return 'unknown';
}

/**
 * Verifica si una key está limitada.
 * @returns {{ ok: boolean, remaining: number, resetAt: number, retryAfterSec: number }}
 */
export function checkRateLimit(key, { max = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  if (bucket.count >= max) {
    return {
      ok: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000)
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: max - bucket.count,
    resetAt: bucket.resetAt,
    retryAfterSec: 0
  };
}

/**
 * Resetea el bucket (útil al login exitoso).
 */
export function resetRateLimit(key) {
  buckets.delete(key);
}

/**
 * Helper para aplicar rate limit a un endpoint concreto.
 */
export function applyRateLimit(request, action, opts = {}) {
  const ip = getClientIp(request);
  const key = `${action}:${ip}`;
  return { key, result: checkRateLimit(key, opts) };
}