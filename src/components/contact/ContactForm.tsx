'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { contactSchema, type ContactInput, type ContactResponse } from '@/lib/contact-schema';
import type { ContactFormState } from '@/types';

import styles from './ContactForm.module.css';

const FIELDS = ['name', 'email', 'subject', 'message'] as const;

export function ContactForm() {
  const t = useTranslations('contact');
  const tv = useTranslations('validation');

  const [state, setState] = useState<ContactFormState>('ready');
  const [formError, setFormError] = useState<string | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', subject: '', message: '', company: '' },
  });

  /**
   * Validation messages travel as keys, so translate defensively: an unknown key
   * must not throw and blank the form.
   */
  function translateError(key: string | undefined) {
    if (!key) return undefined;
    try {
      return tv(key as Parameters<typeof tv>[0]);
    } catch {
      return tv('serverError');
    }
  }

  async function onSubmit(values: ContactInput) {
    // `isSubmitting` already blocks the button; this guards programmatic calls.
    if (state === 'sending') return;

    setState('sending');
    setFormError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok && result?.ok) {
        setState('sent');
        reset();
        return;
      }

      // Recoverable failure: keep every entered value so nothing is retyped.
      if (result && !result.ok) {
        if (result.fieldErrors) {
          for (const [field, key] of Object.entries(result.fieldErrors)) {
            if ((FIELDS as readonly string[]).includes(field)) {
              setError(field as (typeof FIELDS)[number], {
                type: 'server',
                message: key,
              });
            }
          }
        }
        setFormError(result.error);
      } else {
        setFormError('serverError');
      }

      setState('error');
    } catch {
      // Network failure — the values stay in the form.
      setFormError('serverError');
      setState('error');
    }
  }

  const statusKey =
    state === 'sending'
      ? 'statusSending'
      : state === 'sent'
        ? 'statusSent'
        : state === 'error'
          ? 'statusError'
          : 'statusReady';

  if (state === 'sent') {
    return (
      <div className={styles.success}>
        <p className={styles.successLine}>
          <span className={styles.prompt} aria-hidden="true">
            ~${' '}
          </span>
          {t('sent')}
        </p>
        <p className={styles.successDetail}>{t('sentDetail')}</p>
        <button type="button" className={styles.submit} onClick={() => setState('ready')}>
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {FIELDS.map((field) => {
        const message = translateError(errors[field]?.message);
        const isTextarea = field === 'message';

        return (
          <div key={field} className={styles.field}>
            <label className={styles.label} htmlFor={`contact-${field}`}>
              <span className={styles.labelPrompt} aria-hidden="true">
                {'>'}
              </span>
              {t(`${field}Label`)}
            </label>

            {isTextarea ? (
              <textarea
                id={`contact-${field}`}
                className={styles.textarea}
                rows={6}
                placeholder={t(`${field}Placeholder`)}
                aria-invalid={message ? true : undefined}
                aria-describedby={message ? `contact-${field}-error` : undefined}
                {...register(field)}
              />
            ) : (
              <input
                id={`contact-${field}`}
                className={styles.input}
                type={field === 'email' ? 'email' : 'text'}
                autoComplete={
                  field === 'name' ? 'name' : field === 'email' ? 'email' : 'off'
                }
                placeholder={t(`${field}Placeholder`)}
                aria-invalid={message ? true : undefined}
                aria-describedby={message ? `contact-${field}-error` : undefined}
                {...register(field)}
              />
            )}

            {/* Errors are announced as they appear, and marked with a glyph as
                well as colour. */}
            {message ? (
              <p id={`contact-${field}-error`} className={styles.error} role="alert">
                <span aria-hidden="true">! </span>
                {message}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot. Hidden from sighted users via CSS, from assistive tech via
          aria-hidden, and from autofill via tabIndex -1. A real visitor cannot
          reach it; a naive bot fills it and gets silently dropped. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-company">{t('companyLabel')}</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <div className={styles.footer}>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {state === 'sending' ? t('sending') : t('send')}
          <span className={styles.submitCaret} aria-hidden="true">
            {state === 'sending' ? '…' : '↵'}
          </span>
        </button>

        <p ref={statusRef} className={styles.status} role="status" aria-live="polite">
          <span className={styles.statusDot} data-state={state} aria-hidden="true" />
          {t(statusKey)}
        </p>
      </div>

      {formError ? (
        <div className={styles.formError} role="alert">
          <p className={styles.formErrorHeading}>{t('errorHeading')}</p>
          <p className={styles.formErrorDetail}>
            {formError === 'rateLimited' ? tv('rateLimited') : t('errorDetail')}
          </p>
        </div>
      ) : null}
    </form>
  );
}
