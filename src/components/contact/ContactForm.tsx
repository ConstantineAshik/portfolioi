'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { type FieldErrors, type UseFormRegister, useForm } from 'react-hook-form';

import {
  contactSchema,
  type ContactInput,
  type ContactResponse,
} from '@/lib/contact-schema';
import type { ContactFormState } from '@/types';

import styles from './ContactForm.module.css';

const FIELDS = ['name', 'email', 'subject', 'message'] as const;
type ContactFieldName = (typeof FIELDS)[number];
const FIELD_NAMES = new Set<string>(FIELDS);

export function ContactForm() {
  const t = useTranslations('contact');
  const validation = useTranslations('validation');
  const [state, setState] = useState<ContactFormState>('ready');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', subject: '', message: '', company: '' },
  });

  function errorMessage(key: string | undefined) {
    if (!key) return undefined;
    try {
      return validation(key as Parameters<typeof validation>[0]);
    } catch {
      return validation('serverError');
    }
  }

  function focusFirstError(fieldErrors: FieldErrors<ContactInput>) {
    const field = FIELDS.find((name) => fieldErrors[name]);
    if (field) setFocus(field);
  }

  async function onSubmit(values: ContactInput) {
    setFormError(null);
    setState('ready');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok && result?.ok) {
        reset();
        setState('sent');
        return;
      }

      let firstServerField: ContactFieldName | undefined;
      if (result && !result.ok) {
        for (const [field, key] of Object.entries(result.fieldErrors ?? {})) {
          if (!FIELD_NAMES.has(field)) continue;
          const name = field as ContactFieldName;
          firstServerField ??= name;
          setError(name, { type: 'server', message: key });
        }
        setFormError(result.error);
      } else {
        setFormError('serverError');
      }

      setState('error');
      if (firstServerField) setFocus(firstServerField);
    } catch {
      setFormError('serverError');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successLine}>
          <span className={styles.prompt} aria-hidden="true">~$ </span>
          {t('sent')}
        </p>
        <p className={styles.successDetail}>{t('sentDetail')}</p>
        <button type="button" className={styles.submit} onClick={() => setState('ready')}>
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  const statusKey = isSubmitting
    ? 'statusSending'
    : state === 'error'
      ? 'statusError'
      : 'statusReady';

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit, focusFirstError)}
      noValidate
    >
      {FIELDS.map((field) => (
        <ContactField
          key={field}
          field={field}
          label={t(`${field}Label`)}
          placeholder={t(`${field}Placeholder`)}
          message={errorMessage(errors[field]?.message)}
          register={register}
        />
      ))}

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
          {isSubmitting ? t('sending') : t('send')}
          <span className={styles.submitCaret} aria-hidden="true">
            {isSubmitting ? '…' : '↵'}
          </span>
        </button>
        <p className={styles.status} role="status" aria-live="polite">
          <span
            className={styles.statusDot}
            data-state={isSubmitting ? 'sending' : state}
            aria-hidden="true"
          />
          {t(statusKey)}
        </p>
      </div>

      {formError ? (
        <div className={styles.formError} role="alert">
          <p className={styles.formErrorHeading}>{t('errorHeading')}</p>
          <p className={styles.formErrorDetail}>
            {formError === 'rateLimited' ? validation('rateLimited') : t('errorDetail')}
          </p>
        </div>
      ) : null}
    </form>
  );
}

function ContactField({
  field,
  label,
  message,
  placeholder,
  register,
}: {
  field: ContactFieldName;
  label: string;
  message?: string;
  placeholder: string;
  register: UseFormRegister<ContactInput>;
}) {
  const id = `contact-${field}`;
  const describedBy = message ? `${id}-error` : undefined;
  const shared = {
    id,
    placeholder,
    'aria-invalid': message ? true : undefined,
    'aria-describedby': describedBy,
    ...register(field),
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        <span className={styles.labelPrompt} aria-hidden="true">{'>'}</span>
        {label}
      </label>
      {field === 'message' ? (
        <textarea className={styles.textarea} rows={6} {...shared} />
      ) : (
        <input
          className={styles.input}
          type={field === 'email' ? 'email' : 'text'}
          autoComplete={field === 'name' ? 'name' : field === 'email' ? 'email' : 'off'}
          spellCheck={field === 'email' ? false : undefined}
          {...shared}
        />
      )}
      {message ? (
        <p id={describedBy} className={styles.error} role="alert">
          <span aria-hidden="true">! </span>{message}
        </p>
      ) : null}
    </div>
  );
}
