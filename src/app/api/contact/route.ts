import { NextResponse } from 'next/server';

import { contactSchema, type ContactResponse } from '@/lib/contact-schema';
import { deliverContactMessage } from '@/lib/mailer';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeContactInput } from '@/lib/sanitize';

/** Never cache a mutation endpoint. */
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;

async function readBody(request: Request) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) return body + decoder.decode();
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }
}

/**
 * Best-effort client identity for rate limiting.
 *
 * `x-forwarded-for` is spoofable in general; it is trustworthy only because a
 * platform proxy (Vercel, nginx) overwrites it. Falling back to a constant means
 * a misconfigured deployment rate-limits globally rather than not at all — the
 * safer failure direction for a contact form.
 */
function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip');
  return ip || 'unknown';
}

function fail(
  error: string,
  status: number,
  extra?: { fieldErrors?: Record<string, string>; retryAfter?: number },
) {
  const body: ContactResponse = extra?.fieldErrors
    ? { ok: false, error, fieldErrors: extra.fieldErrors }
    : { ok: false, error };

  return NextResponse.json(body, {
    status,
    headers: extra?.retryAfter ? { 'Retry-After': String(extra.retryAfter) } : undefined,
  });
}

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limit.allowed) {
    return fail('rateLimited', 429, { retryAfter: limit.retryAfter });
  }

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return fail('serverError', 400);
  }

  // Cheap early rejection. readBody also enforces the real limit for chunked
  // bodies and incorrect or missing Content-Length values.
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) {
    return fail('serverError', 413);
  }

  const body = await readBody(request);
  if (body === null) return fail('serverError', 413);

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return fail('serverError', 400);
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    // Collapse to one message per field; the keys are translated client-side.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return fail('errorSummary', 400, { fieldErrors });
  }

  // Honeypot: a filled `company` field means a bot. Answer 200 so the bot
  // records success and does not retry, but deliver nothing.
  if (parsed.data.company) {
    console.warn('[contact] honeypot triggered; message discarded');
    return NextResponse.json({ ok: true } satisfies ContactResponse);
  }

  const message = sanitizeContactInput(parsed.data);

  try {
    const result = await deliverContactMessage(message);

    if (!result.ok) {
      // The reason is for the operator's logs only.
      console.error('[contact] delivery failed', { reason: result.reason });
      return fail('serverError', result.reason === 'not-configured' ? 503 : 502);
    }

    return NextResponse.json({ ok: true } satisfies ContactResponse);
  } catch (error) {
    console.error('[contact] unexpected delivery error', error);
    return fail('serverError', 502);
  }
}

/** Anything other than POST is not meaningful here. */
export function GET() {
  return NextResponse.json({ ok: false, error: 'serverError' }, { status: 405 });
}
