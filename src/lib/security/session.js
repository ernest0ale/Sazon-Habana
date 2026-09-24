/**
 * ============================================
 * SESSION.JS - Firma y verificación de JWT
 * ============================================
 * Implementación propia con Web Crypto API (HMAC-SHA256).
 * Sin dependencias externas.
 *
 * Formato: header.payload.signature (base64url)
 */

const ALG = 'HS256';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET no configurado o demasiado corto (mínimo 32 caracteres).');
    }
    return 'dev_session_secret_no_usar_en_produccion_1234567890';
  }
  return secret;
}

function base64UrlEncode(bytes) {
  let str = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (const b of arr) str += String.fromCharCode(b);
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

function encodeJSON(obj) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

function decodeJSON(str) {
  const bytes = base64UrlDecode(str);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function sign(message) {
  const key = await getKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return base64UrlEncode(new Uint8Array(sig));
}

async function verify(message, signature) {
  const key = await getKey();
  const sigBytes = base64UrlDecode(signature);
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(message));
}

/**
 * Crea un JWT firmado.
 * @param {object} payload - { userId, rol, ... }
 * @returns {Promise<string>}
 */
export async function createSessionToken(payload) {
  const header = { alg: ALG, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + Math.floor(TTL_MS / 1000),
    iss: 'sazon-habana'
  };

  const encodedHeader = encodeJSON(header);
  const encodedPayload = encodeJSON(fullPayload);
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(message);

  return `${message}.${signature}`;
}

/**
 * Verifica y decodifica un JWT.
 * @returns {Promise<object|null>}
 */
export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const header = decodeJSON(encodedHeader);
    if (header.alg !== ALG) return null;

    const valid = await verify(`${encodedHeader}.${encodedPayload}`, signature);
    if (!valid) return null;

    const payload = decodeJSON(encodedPayload);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = 'sh_session';
export const SESSION_TTL_SECONDS = Math.floor(TTL_MS / 1000);

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_TTL_SECONDS
};