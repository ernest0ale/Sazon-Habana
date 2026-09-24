/**
 * ============================================
 * RESEND.JS - Envío de correos con Resend
 * ============================================
 * Requiere RESEND_API_KEY en .env.local
 */

const RESEND_API = 'https://api.resend.com/emails';
const FROM = process.env.RESEND_FROM || 'Sazón Habana <noreply@sazonhabana.com>';

const SUBJECTS = {
  registro: 'Verifica tu correo — Sazón Habana',
  recuperar_password: 'Recupera tu contraseña — Sazón Habana',
  reactivar_cuenta: 'Reactiva tu cuenta — Sazón Habana'
};

const TITULOS = {
  registro: 'Verifica tu correo',
  recuperar_password: 'Recupera tu contraseña',
  reactivar_cuenta: 'Reactiva tu cuenta'
};

const MENSAJES = {
  registro: 'Usa este código para completar tu registro.',
  recuperar_password: 'Usa este código para restablecer tu contraseña.',
  reactivar_cuenta: 'Usa este código para reactivar tu cuenta.'
};

function buildHtml(titulo, mensaje, codigo) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${titulo}</title>
    </head>
    <body style="margin:0;padding:0;background:#F5F8F2;font-family:Inter,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:16px;border:1px solid #C8D6C0;padding:32px;">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#2D3A2F;margin:0;">
                    Sazón Habana
                  </h1>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#5B8A72;margin:0 0 8px;">
                    ${titulo}
                  </h2>
                  <p style="font-size:14px;color:#2D3A2F;opacity:0.7;margin:0 0 24px;">
                    ${mensaje}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:16px 0;">
                  <div style="display:inline-block;padding:16px 32px;background:#F5F8F2;border-radius:12px;border:2px dashed #5B8A72;">
                    <span style="font-family:'Courier New',monospace;font-size:32px;font-weight:700;color:#2D3A2F;letter-spacing:8px;">
                      ${codigo}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:16px;">
                  <p style="font-size:12px;color:#2D3A2F;opacity:0.5;margin:0;">
                    Este código expira en 15 minutos. Si no solicitaste este correo, ignóralo.
                  </p>
                </td>
              </tr>
            </table>
            <p style="font-size:11px;color:#2D3A2F;opacity:0.4;margin-top:24px;">
              © 2026 Sazón Habana. Todos los derechos reservados.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function sendVerificationEmail(email, codigo, tipo) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[resend] RESEND_API_KEY no configurada');
    return { ok: false, error: 'Email no configurado.' };
  }

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: SUBJECTS[tipo] || 'Código de verificación',
        html: buildHtml(TITULOS[tipo] || 'Verificación', MENSAJES[tipo] || '', codigo)
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('[resend] error:', error);
      return { ok: false, error: 'No se pudo enviar el correo.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[resend] exception:', err);
    return { ok: false, error: 'Error al enviar el correo.' };
  }
}