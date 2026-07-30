import { escapeHtml, type SanitizedMessage } from './sanitize';

/**
 * Contact delivery.
 *
 * Provider is chosen from the environment, never from the request, and no
 * credential is ever referenced outside this server-only module:
 *
 *   CONTACT_PROVIDER=resend  + RESEND_API_KEY + CONTACT_TO_EMAIL
 *   CONTACT_PROVIDER=smtp    + SMTP_URL + CONTACT_TO_EMAIL   (requires nodemailer)
 *   CONTACT_PROVIDER=log     (default in development)
 *
 * With no provider configured, the message is logged server-side so the form is
 * fully testable locally without any account or key.
 */

export type DeliveryResult = { ok: true; via: string } | { ok: false; reason: string };

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

async function sendViaResend(message: SanitizedMessage): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { ok: false, reason: 'resend-not-configured' };
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
      // Replies go to the sender, but the envelope stays on our own domain so
      // SPF/DKIM still pass.
      reply_to: message.email,
      subject: `[portfolio] ${message.subject}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    // Log the provider's reason server-side; never surface it to the client.
    console.error('[contact] resend rejected the message', {
      status: response.status,
    });
    return { ok: false, reason: `resend-${response.status}` };
  }

  return { ok: true, via: 'resend' };
}

async function sendViaSmtp(message: SanitizedMessage): Promise<DeliveryResult> {
  const url = process.env.SMTP_URL;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!url || !to || !from) {
    return { ok: false, reason: 'smtp-not-configured' };
  }

  // nodemailer is an optional peer: SMTP users install it, everyone else does
  // not pay for it. It is imported through a variable specifier and typed
  // structurally, so the project typechecks and builds without the package
  // present — the failure surfaces at runtime only if SMTP is actually selected.
  type Transport = {
    sendMail: (options: Record<string, unknown>) => Promise<unknown>;
  };
  let createTransport: (connection: string) => Transport;
  try {
    const moduleName = 'nodemailer';
    const nodemailer = (await import(/* webpackIgnore: true */ moduleName)) as {
      createTransport: (connection: string) => Transport;
    };
    createTransport = nodemailer.createTransport;
  } catch {
    console.error('[contact] SMTP selected but nodemailer is not installed');
    return { ok: false, reason: 'smtp-missing-dependency' };
  }

  const { text, html } = renderBody(message);

  await createTransport(url).sendMail({
    from,
    to,
    replyTo: message.email,
    subject: `[portfolio] ${message.subject}`,
    text,
    html,
  });

  return { ok: true, via: 'smtp' };
}

function logMessage(message: SanitizedMessage): DeliveryResult {
  console.info(
    [
      '',
      '─── contact message (development fallback) ───',
      `name:    ${message.name}`,
      `email:   ${message.email}`,
      `subject: ${message.subject}`,
      '',
      message.message,
      '─────────────────────────────────────────────',
      '',
    ].join('\n'),
  );

  return { ok: true, via: 'log' };
}

export async function deliverContactMessage(
  message: SanitizedMessage,
): Promise<DeliveryResult> {
  const provider = (process.env.CONTACT_PROVIDER ?? 'log').toLowerCase();

  switch (provider) {
    case 'resend':
      return sendViaResend(message);
    case 'smtp':
      return sendViaSmtp(message);
    case 'log':
      return logMessage(message);
    default:
      console.error(`[contact] unknown CONTACT_PROVIDER "${provider}"`);
      return { ok: false, reason: 'unknown-provider' };
  }
}
