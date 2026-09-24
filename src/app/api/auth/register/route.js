import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { hashPassword } from '@/lib/security/password';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/security/session';
import { validateRegisterForm } from '@/lib/validators/auth.validator';
import { sanitizeEmail, sanitizeName, sanitizePhone, sanitizeText } from '@/lib/security/sanitize';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function POST(request) {
  try {
    const { result: rl } = applyRateLimit(request, 'register', {
      max: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || '3', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_REGISTER_WINDOW_MS || '3600000', 10)
    });

    if (!rl.ok) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Demasiados registros. Intenta más tarde.' },
          { status: 429 }
        )
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    // 1. Validar
    const v = validateRegisterForm(body);
    if (!v.ok) return errorResponse(v.errors[0], 400);

    // 2. Sanitizar
    const cleanData = {
      nombre: sanitizeName(body.nombre, { maxLength: 120 }),
      email: sanitizeEmail(body.email),
      telefono: body.telefono ? sanitizePhone(body.telefono) : null,
      rol: ['casual', 'gestor', 'admin'].includes(body.rol) ? body.rol : 'casual',
      preferencias: Array.isArray(body.preferencias)
        ? body.preferencias.filter((p) => typeof p === 'string').slice(0, 10)
        : []
    };

    // 3. Verificar duplicados
    const admin = createAdminSupabaseClient();
    const orConditions = [`email.eq.${cleanData.email}`];
    if (cleanData.telefono) orConditions.push(`telefono.eq.${cleanData.telefono}`);

    const { data: existente } = await admin
      .from('usuarios')
      .select('id')
      .or(orConditions.join(','))
      .maybeSingle();

    if (existente) {
      return errorResponse('El correo o teléfono ya está registrado.', 409);
    }

    // 4. Hashear password
    const passwordHash = await hashPassword(body.password);

    // 5. Insertar
    const { data: nuevo, error } = await admin
      .from('usuarios')
      .insert({
        nombre: cleanData.nombre,
        email: cleanData.email,
        telefono: cleanData.telefono,
        password_hash: passwordHash,
        rol: cleanData.rol,
        estado: 'activo',
        preferencias: cleanData.preferencias,
        color_primario: '#5B8A72'
      })
      .select()
      .single();

    if (error) {
      console.error('[register]', error);
      return errorResponse('No se pudo crear la cuenta.', 500);
    }

    // 6. Crear sesión
    const token = await createSessionToken({
      userId: nuevo.id,
      rol: nuevo.rol
    });

    const res = NextResponse.json({
      ok: true,
      usuario: {
        id: nuevo.id,
        nombre: nuevo.nombre,
        email: nuevo.email,
        rol: nuevo.rol
      }
    });

    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      ...SESSION_COOKIE_OPTIONS
    });

    return applySecurityHeaders(res);
  } catch (err) {
    console.error('[register]', err);
    return errorResponse('Error interno.', 500);
  }
}