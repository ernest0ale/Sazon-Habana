/**
 * ============================================
 * CSRF.JS - Protección contra Cross-Site Request Forgery
 * ============================================
 * Patrón: double-submit cookie + token firmado.
 * Sin dependencias externas (solo Web Crypto API).
 */

const CSRF_COOKIE = 'sh_csrf';
const CSRF_HEADER = 'x-csrf-token';
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 horas

function getSecret() {
  const secret = process.env.CSRF_SECRET;
  if (!secret || secret.length < 32) {
    // En dev permitimos, en prod lanzamos error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CSRF_SECRET no está configurado o es demasiado corto.');
    }
    return 'dev_csrf_secret_no_usar_en_produccion_1234567890';
  }
  return secret;
}

function base64UrlEncode(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return base64UrlEncode(new Uint8Array(sig));
}

function randomBytes(n) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/**
 * Genera un token CSRF firmado.
 * Formato: <random>.<timestamp>.<firma>
 */
export async function generateCsrfToken() {
  const nonce = randomBytes(16);
  const ts = Date.now().toString(36);
  const payload = `${nonce}.${ts}`;
  const sig = await hmacSha256(payload, getSecret());
  return `${payload}.${sig}`;
}

/**
 * Verifica un token CSRF.
 */
export async function verifyCsrfToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [nonce, ts, sig] = parts;
  const payload = `${nonce}.${ts}`;
  const expected = await hmacSha256(payload, getSecret());

  // Comparación en tiempo constante
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return false;

  // Verificar expiración
  const issued = parseInt(ts, 36);
  if (isNaN(issued)) return false;
  if (Date.now() - issued > TOKEN_TTL_MS) return false;

  return true;
}

/**
 * Nombre de la cookie CSRF.
 */
export const CSRF_COOKIE_NAME = CSRF_COOKIE;
export const CSRF_HEADER_NAME = CSRF_HEADER;

/**
 * Verifica el CSRF a partir de la request.
 * Compara cookie vs header.
 */
export async function verifyCsrfFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const cookieToken = cookies[CSRF_COOKIE];
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;
  if (cookieToken !== headerToken) return false;
  return verifyCsrfToken(headerToken);
}