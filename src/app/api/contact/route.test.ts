import { beforeEach, describe, expect, it, vi } from 'vitest';

import { __resetRateLimit } from '@/lib/rate-limit';

const { deliverContactMessage } = vi.hoisted(() => ({
  deliverContactMessage: vi.fn(),
}));
vi.mock('@/lib/mailer', () => ({ deliverContactMessage }));

import { POST } from './route';

const valid = {
  name: 'Ashik Miah',
  email: 'sender@example.com',
  subject: 'Portfolio inquiry',
  message: 'This is a sufficiently long contact message.',
  company: '',
};

function request(body: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body,
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    __resetRateLimit();
    deliverContactMessage.mockReset();
  });

  it('rejects unsupported content and malformed JSON', async () => {
    const unsupported = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: '{}',
    });
    expect((await POST(unsupported)).status).toBe(400);
    expect((await POST(request('{'))).status).toBe(400);
  });

  it('enforces the actual body size without relying on Content-Length', async () => {
    const response = await POST(request(JSON.stringify({ ...valid, padding: 'x'.repeat(17_000) })));
    expect(response.status).toBe(413);
  });

  it('returns field errors for invalid input', async () => {
    const response = await POST(request(JSON.stringify({ ...valid, email: 'bad' })));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ ok: false, fieldErrors: { email: 'emailInvalid' } });
  });

  it('silently accepts honeypot submissions without delivery', async () => {
    const response = await POST(request(JSON.stringify({ ...valid, company: 'bot' })));
    expect(response.status).toBe(200);
    expect(deliverContactMessage).not.toHaveBeenCalled();
  });

  it('distinguishes configuration and provider failures', async () => {
    deliverContactMessage.mockResolvedValueOnce({ ok: false, reason: 'not-configured' });
    expect((await POST(request(JSON.stringify(valid)))).status).toBe(503);
    __resetRateLimit();
    deliverContactMessage.mockResolvedValueOnce({ ok: false, reason: 'rejected' });
    expect((await POST(request(JSON.stringify(valid)))).status).toBe(502);
  });

  it('returns success after delivery and rate-limits repeated requests', async () => {
    deliverContactMessage.mockResolvedValue({ ok: true });
    expect((await POST(request(JSON.stringify(valid)))).status).toBe(200);
    for (let index = 0; index < 4; index += 1) {
      await POST(request(JSON.stringify(valid)));
    }
    const blocked = await POST(request(JSON.stringify(valid)));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).toBeTruthy();
  });
});
