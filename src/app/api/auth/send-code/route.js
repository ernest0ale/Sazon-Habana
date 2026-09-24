import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { enviarCodigoVerificacion } from '@/lib/security/verification';
import { validateEmail } from '@/lib/security/validators';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function POST(request) {
  try {
    const { result: rl } = applyRateLimit(request, 'send-code', {
      max: 10,
      windowMs: 60 * 60 * 1000
    });
    if (!rl.ok) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Demasiadas solicitudes. Intenta más tarde.' },
          { status: 429 }
        )
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const { email, tipo, reenvio } = body;

    const vEmail = validateEmail(email);
    if (!vEmail.ok) return errorResponse(vEmail.errors[0], 400);

    const tiposValidos = ['registro', 'recuperar_password', 'reactivar_cuenta'];
    if (!tiposValidos.includes(tipo)) {
      return errorResponse('Tipo de verificación inválido.', 400);
    }

    const result = await enviarCodigoVerificacion(email, tipo, {
      reenvio: !!reenvio
    });

    if (!result.ok) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            error: result.error,
            proximoEnvioEn: result.proximoEnvioEn,
            segundosRestantes: result.segundosRestantes
          },
          { status: 400 }
        )
      );
    }

    return applySecurityHeaders(
      NextResponse.json({
        ok: true,
        proximoEnvioEn: result.proximoEnvioEn,
        segundosRestantes: result.segundosRestantes,
        intentosRestantes: result.intentosRestantes
      })
    );
  } catch (err) {
    console.error('[send-code]', err);
    return errorResponse('Error interno.', 500);
  }
}