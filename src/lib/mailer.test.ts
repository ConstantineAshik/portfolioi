import { afterEach, describe, expect, it, vi } from 'vitest';

import { deliverContactMessage } from './mailer';

const message = {
  name: 'Ashik',
  email: 'sender@example.com',
  subject: 'Portfolio inquiry',
  message: 'This is a sufficiently long test message.',
};

describe('deliverContactMessage', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('fails safely when Resend is not configured', async () => {
    expect(await deliverContactMessage(message)).toEqual({
      ok: false,
      reason: 'not-configured',
    });
  });

  it('sends escaped content through Resend', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@example.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'portfolio@example.com');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    expect(await deliverContactMessage(message)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      to: ['owner@example.com'],
      reply_to: 'sender@example.com',
    });
  });
});
