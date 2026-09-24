import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { hashPassword } from '@/lib/security/password';
import { validateSolicitudForm } from '@/lib/validators/solicitud.validator';
import {
  sanitizeText, sanitizeEmail, sanitizePhone, sanitizeName, sanitizeUrl
} from '@/lib/security/sanitize';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from('usuarios')
    .select('id, nombre, email, password_hash, rol, estado')
    .eq('id', payload.userId)
    .maybeSingle();

  if (!data || data.estado !== 'activo') return null;
  return data;
}

// GET: admin lista todas
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse('No autenticado.', 401);
    if (user.rol !== 'admin') return errorResponse('No autorizado.', 403);

    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('solicitudes')
      .select('id, nombre, nombre_gestor, email_gestor, tipo, municipio, file_legal, created_at')
      .order('created_at', { ascending: false });

    if (error) return errorResponse('Error al consultar.', 500);
    return applySecurityHeaders(NextResponse.json({ solicitudes: data || [] }));
  } catch (err) {
    console.error('[solicitudes GET]', err);
    return errorResponse('Error interno.', 500);
  }
}

// POST: crear solicitud
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const clean = {
      nombre: sanitizeText(body.nombre, { maxLength: 120 }),
      tipo: body.tipo,
      precio: body.precio,
      horario: sanitizeText(body.horario, { maxLength: 500 }),
      telefono: sanitizePhone(body.telefono),
      descripcion: sanitizeText(body.descripcion, { maxLength: 2000 }),
      img: body.img ? sanitizeUrl(body.img) : null,
      municipio: sanitizeText(body.municipio, { maxLength: 100 }),
      direccion: sanitizeText(body.direccion, { maxLength: 250 }),
      lat: parseFloat(body.lat),
      lng: parseFloat(body.lng),
      aire: !!body.aire,
      clima: !!body.clima,
      parqueo: !!body.parqueo,
      fileLegal: body.fileLegal,
      acceptedTerms: !!body.acceptedTerms,
      nombreGestor: sanitizeName(body.nombreGestor, { maxLength: 120 }),
      emailGestor: sanitizeEmail(body.emailGestor),
      passwordGestor: body.passwordGestor,
      horariosPorDia: body.horariosPorDia || {}
    };

    const v = validateSolicitudForm(clean);
    if (!v.ok) return errorResponse(v.errors[0], 400);

    const passwordHash = await hashPassword(clean.passwordGestor);

    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('solicitudes')
      .insert({
        nombre: clean.nombre,
        tipo: clean.tipo,
        precio: clean.precio,
        horario: clean.horario,
        telefono: clean.telefono,
        descripcion: clean.descripcion,
        img: clean.img,
        municipio: clean.municipio,
        direccion: clean.direccion,
        lat: clean.lat,
        lng: clean.lng,
        aire: clean.aire,
        clima: clean.clima,
        parqueo: clean.parqueo,
        file_legal: clean.fileLegal,
        nombre_gestor: clean.nombreGestor,
        email_gestor: clean.emailGestor,
        password_gestor_hash: passwordHash,
        horarios_por_dia: clean.horariosPorDia
      })
      .select()
      .single();

    if (error) return errorResponse('No se pudo enviar la solicitud.', 500);

    return applySecurityHeaders(
      NextResponse.json({ ok: true, solicitud: { id: data.id } }, { status: 201 })
    );
  } catch (err) {
    console.error('[solicitudes POST]', err);
    return errorResponse('Error interno.', 500);
  }
}