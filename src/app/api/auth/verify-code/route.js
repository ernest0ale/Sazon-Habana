import { NextResponse } from 'next/server';
import { verificarCodigo } from '@/lib/security/verification';
import { validateEmail } from '@/lib/security/validators';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const { email, tipo, codigo } = body;

    const vEmail = validateEmail(email);
    if (!vEmail.ok) return errorResponse(vEmail.errors[0], 400);

    if (!codigo || String(codigo).length !== 6) {
      return errorResponse('El código debe tener 6 dígitos.', 400);
    }

    const result = await verificarCodigo(email, tipo, codigo);
    if (!result.ok) return errorResponse(result.error, 400);

    return applySecurityHeaders(NextResponse.json({ ok: true }));
  } catch (err) {
    console.error('[verify-code]', err);
    return errorResponse('Error interno.', 500);
  }
}