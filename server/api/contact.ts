/**
 * /api/contact — handler serverless (Vercel / Netlify / Nitro).
 * Adaptar la firma según el runtime; la lógica es la misma.
 *
 * ENV requeridas:
 *   RESEND_API_KEY        → key de Resend
 *   CONTACT_TO_EMAIL      → destino (ej: hola@arteslodge.com)
 *   CONTACT_FROM_EMAIL    → remitente verificado en Resend
 */
import { Resend } from 'resend';

interface Body { name: string; email: string; message: string; }

function bad(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  let body: Body;
  try { body = await req.json(); } catch { return bad(400, 'JSON inválido'); }

  const { name, email, message } = body ?? {};
  if (!name || !email || !message)        return bad(400, 'Faltan campos');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(400, 'Email inválido');
  if (message.length > 4000)              return bad(400, 'Mensaje muy largo');

  const apiKey = process.env.RESEND_API_KEY;
  const to     = process.env.CONTACT_TO_EMAIL;
  const from   = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return bad(500, 'Server mal configurado');

  const resend = new Resend(apiKey);
  const safe = (s: string) => s.replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]!));

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `[Artes Lodge] Nuevo contacto — ${safe(name)}`,
    html: `
      <h2>Nuevo mensaje desde el sitio</h2>
      <p><strong>Nombre:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${safe(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) return bad(502, error.message ?? 'Resend error');
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}
