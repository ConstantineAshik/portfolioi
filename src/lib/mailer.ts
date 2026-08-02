import { escapeHtml, type SanitizedMessage } from './sanitize';

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'rejected' };

function renderBody(message: SanitizedMessage) {
  const text = [
    `From: ${message.name} <${message.email}>`,
    `Subject: ${message.subject}`,
    '',
    message.message,
  ].join('\n');

  const html = [
    '<div style="font-family:ui-monospace,monospace;font-size:14px;line-height:1.6">',
    `<p><strong>From:</strong> ${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</p>`,
    `<p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>`,
    '<hr />',
    `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message.message)}</pre>`,
    '</div>',
  ].join('');

  return { text, html };
}

export async function deliverContactMessage(
  message: SanitizedMessage,
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { ok: false, reason: 'not-configured' };
  }

  const { text, html } = renderBody(message);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: message.email,
      subject: `[portfolio] ${message.subject}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    console.error('[contact] Resend rejected the message', { status: response.status });
    return { ok: false, reason: 'rejected' };
  }

  return { ok: true };
}
