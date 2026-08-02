// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import messages from '@/content/en.json';

import { ContactForm } from './ContactForm';

function renderForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ContactForm />
    </NextIntlClientProvider>,
  );
}

function fillValidForm() {
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Ashik Miah' } });
  fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
    target: { value: 'sender@example.com' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), {
    target: { value: 'Portfolio inquiry' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
    target: { value: 'This is a sufficiently long contact message.' },
  });
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('focuses the first invalid field', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus());
    expect(screen.getByText('That name looks too short.')).toBeVisible();
  });

  it('shows success and resets after delivery', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })),
    );
    renderForm();
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Message sent')).toBeVisible();
  });

  it('keeps values and focuses server field errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({
        ok: false,
        error: 'errorSummary',
        fieldErrors: { email: 'emailInvalid' },
      }), { status: 400, headers: { 'content-type': 'application/json' } })),
    );
    renderForm();
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus());
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue(
      'This is a sufficiently long contact message.',
    );
  });
});
