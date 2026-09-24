import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifyPassword } from '@/lib/security/password';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/security/session';
import { validateLoginForm } from '@/lib/validators/auth.validator';
import { sanitizeEmail, sanitizePhone } from '@/lib/security/sanitize';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function POST(request) {
  try {
    const { result: rl } = applyRateLimit(request, 'login', {
      max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || '900000', 10)
    });

    if (!rl.ok) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Demasiados intentos. Intenta más tarde.' },
          { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
        )
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const { identificador, password } = body;

    const v = validateLoginForm({ identificador, password });
    if (!v.ok) return errorResponse(v.errors[0], 400);

    const identRaw = String(identificador).trim();
    const isEmail = identRaw.includes('@');
    const ident = isEmail ? sanitizeEmail(identRaw) : sanitizePhone(identRaw);

    const admin = createAdminSupabaseClient();
    const { data: usuario } = await admin
      .from('usuarios')
      .select('*')
      .or(`email.eq.${ident},telefono.eq.${ident}`)
      .maybeSingle();

    await admin.rpc('registrar_intento_login', {
      p_identificador: ident,
      p_ip: request.headers.get('x-forwarded-for') || 'unknown',
      p_exitoso: !!usuario
    });

    if (!usuario) {
      return errorResponse('Credenciales incorrectas.', 401);
    }

    const { data: bloqueado } = await admin.rpc('verificar_bloqueo_login', {
      p_identificador: ident,
      p_max_intentos: 5,
      p_ventana_minutos: 15
    });

    if (bloqueado) {
      return errorResponse('Cuenta temporalmente bloqueada. Intenta en 15 minutos.', 429);
    }

    const valid = await verifyPassword(password, usuario.password_hash);
    if (!valid) {
      return errorResponse('Credenciales incorrectas.', 401);
    }

    // M3: Verificar cuenta en período de gracia
    if (usuario.estado === 'eliminado_pendiente' && usuario.eliminacion_programada_en) {
      const ahora = new Date();
      const eliminacion = new Date(usuario.eliminacion_programada_en);
      const msRestantes = eliminacion - ahora;

      if (msRestantes > 0) {
        const diasRestantes = Math.ceil(msRestantes / (24 * 60 * 60 * 1000));
        return applySecurityHeaders(
          NextResponse.json({
            ok: false,
            disabled: true,
            diasRestantes,
            usuario: {
              id: usuario.id,
              nombre: usuario.nombre,
              email: usuario.email
            }
          }, { status: 403 })
        );
      }
      return errorResponse('Credenciales incorrectas.', 401);
    }

    if (usuario.estado !== 'activo') {
      return errorResponse('Tu cuenta no está activa.', 403);
    }

    const token = await createSessionToken({
      userId: usuario.id,
      rol: usuario.rol,
      tokenVersion: usuario.token_version || 0
    });

    const res = NextResponse.json({
      ok: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        color_primario: usuario.color_primario,
        restaurante_id: usuario.restaurante_id
      }
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      ...SESSION_COOKIE_OPTIONS
    });

    return applySecurityHeaders(res);
  } catch (err) {
    console.error('[login]', err);
    return errorResponse('Error interno.', 500);
  }
}