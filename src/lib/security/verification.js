/**
 * ============================================
 * VERIFICATION.JS - Códigos de verificación
 * ============================================
 * - Código de 6 dígitos, guardado hasheado (bcrypt)
 * - TTL 15 minutos
 * - Cooldowns escalonados: 0 / 1:30 / 3:30 / 5:30
 * - Al 4º intento: bloqueo silencioso de 2h
 */

import bcrypt from 'bcryptjs';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { sanitizeEmail } from './sanitize';
import { sendVerificationEmail } from '@/lib/email/resend';

const CODE_TTL_MS = 15 * 60 * 1000; // 15 min

// Cooldowns en ms (índice = número de envíos ya realizados)
// [0]=1º envío automático sin cooldown previo
// [1]=2º envío → esperar 1:30
// [2]=3º envío → esperar 3:30
// [3]=4º envío → esperar 5:30
// [4+]=bloqueo 2h
const COOLDOWNS_MS = [
  0,
  90 * 1000,       // 1:30
  210 * 1000,      // 3:30
  330 * 1000,      // 5:30
];

const BLOQUEO_MS = 2 * 60 * 60 * 1000; // 2h

const MAX_INTENTOS = 4;

function generarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Verifica si un email está bloqueado (silenciosamente).
 * El usuario NO debe saber que está bloqueado.
 */
export async function isEmailBloqueado(email) {
  const clean = sanitizeEmail(email);
  const admin = createAdminSupabaseClient();

  const { data } = await admin
    .from('email_bloqueos')
    .select('bloqueado_hasta')
    .eq('email', clean)
    .maybeSingle();

  if (!data) return false;
  return new Date(data.bloqueado_hasta) > new Date();
}

/**
 * Aplica bloqueo de 2h a un email.
 */
export async function bloquearEmail(email, motivo = 'exceso_solicitudes') {
  const clean = sanitizeEmail(email);
  const admin = createAdminSupabaseClient();

  const bloqueadoHasta = new Date(Date.now() + BLOQUEO_MS).toISOString();

  await admin.from('email_bloqueos').upsert(
    { email: clean, bloqueado_hasta: bloqueadoHasta, motivo },
    { onConflict: 'email' }
  );
}

/**
 * Devuelve el estado de cooldown para un email+tipo.
 */
export async function getVerificacionPendiente(email, tipo) {
  const clean = sanitizeEmail(email);
  const admin = createAdminSupabaseClient();

  const { data } = await admin
    .from('verificaciones')
    .select('*')
    .eq('email', clean)
    .eq('tipo', tipo)
    .eq('usado', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

/**
 * Inicia o reenvía un código de verificación.
 * @returns { ok, error?, proximoEnvioEn?, segundosRestantes?, bloqueado? }
 */
export async function enviarCodigoVerificacion(email, tipo, { reenvio = false } = {}) {
  const clean = sanitizeEmail(email);

  // 1. Verificar bloqueo silencioso
  if (await isEmailBloqueado(clean)) {
    return { ok: false, error: 'Demasiadas solicitudes. Intenta más tarde.' };
  }

  const admin = createAdminSupabaseClient();
  const ahora = Date.now();

  // 2. Buscar verificación pendiente
  const existente = await getVerificacionPendiente(clean, tipo);

  let intentosPrevios = existente?.intentos_envio || 0;

  if (reenvio && existente) {
    // Verificar si puede reenviar todavía
    if (existente.proximo_envio_en && new Date(existente.proximo_envio_en) > new Date()) {
      const seg = Math.ceil((new Date(existente.proximo_envio_en) - new Date()) / 1000);
      return {
        ok: false,
        error: 'Espera antes de volver a solicitar un código.',
        proximoEnvioEn: existente.proximo_envio_en,
        segundosRestantes: seg
      };
    }

    // Si ya llegó al máximo de intentos → bloquear 2h
    if (intentosPrevios >= MAX_INTENTOS) {
      await bloquearEmail(clean);
      return { ok: false, error: 'Demasiadas solicitudes. Intenta más tarde.' };
    }
  }

  // 3. Generar nuevo código
  const codigo = generarCodigo();
  const codigoHash = await bcrypt.hash(codigo, 10);

  const nuevosIntentos = reenvio ? intentosPrevios + 1 : 1;
  const cooldownIndex = Math.min(nuevosIntentos - 1, COOLDOWNS_MS.length - 1);
  const cooldown = COOLDOWNS_MS[cooldownIndex];
  const proximoEnvioEn = new Date(ahora + cooldown).toISOString();
  const expiraEn = new Date(ahora + CODE_TTL_MS).toISOString();

  // 4. Invalidar códigos previos del mismo tipo
  if (existente) {
    await admin
      .from('verificaciones')
      .update({ usado: true })
      .eq('id', existente.id);
  }

  // 5. Insertar nuevo
  const { error: insertError } = await admin.from('verificaciones').insert({
    email: clean,
    tipo,
    codigo_hash: codigoHash,
    intentos_envio: nuevosIntentos,
    proximo_envio_en: proximoEnvioEn,
    expira_en: expiraEn,
    usado: false
  });

  if (insertError) {
    console.error('[verification] insert:', insertError);
    return { ok: false, error: 'No se pudo generar el código.' };
  }

  // 6. Enviar email
  const enviado = await sendVerificationEmail(clean, codigo, tipo);
  if (!enviado.ok) {
    return { ok: false, error: 'No se pudo enviar el correo.' };
  }

  return {
    ok: true,
    proximoEnvioEn,
    segundosRestantes: Math.ceil(cooldown / 1000),
    intentosRestantes: MAX_INTENTOS - nuevosIntentos
  };
}

/**
 * Verifica un código.
 */
export async function verificarCodigo(email, tipo, codigo) {
  const clean = sanitizeEmail(email);
  const admin = createAdminSupabaseClient();

  const { data: verif } = await admin
    .from('verificaciones')
    .select('*')
    .eq('email', clean)
    .eq('tipo', tipo)
    .eq('usado', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!verif) {
    return { ok: false, error: 'Código inválido o expirado.' };
  }

  // Verificar expiración
  if (new Date(verif.expira_en) < new Date()) {
    return { ok: false, error: 'El código ha expirado.' };
  }

  // Verificar hash
  const valido = await bcrypt.compare(String(codigo), verif.codigo_hash);
  if (!valido) {
    return { ok: false, error: 'Código incorrecto.' };
  }

  // Marcar como usado
  await admin
    .from('verificaciones')
    .update({ usado: true })
    .eq('id', verif.id);

  return { ok: true };
}