/**
 * ============================================
 * HEADERS.JS - Cabeceras de seguridad HTTP
 * ============================================
 * Complementa las definidas en next.config.js.
 * Útil para APIs y respuestas dinámicas.
 */

/**
 * Aplica headers de seguridad a una NextResponse.
 */
export function applySecurityHeaders(response) {
  const h = response.headers;

  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'DENY');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  h.set('Cross-Origin-Opener-Policy', 'same-origin');
  h.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

/**
 * Devuelve un objeto con los headers estándar de una respuesta JSON.
 */
export function jsonHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    ...extra
  };
}

/**
 * Respuesta JSON segura.
 */
export function jsonResponse(data, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders(headers)
  });
}

/**
 * Respuesta de error genérica (no filtra detalles internos).
 */
export function errorResponse(message = 'Error interno', status = 500, extra = {}) {
  return jsonResponse({ error: message, ...extra }, { status });
}

/**
 * Cookie segura por defecto.
 */
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 7 días
};