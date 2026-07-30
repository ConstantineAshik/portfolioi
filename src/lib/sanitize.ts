import type { ContactInput } from './contact-schema';

// Built from char codes so no literal control bytes end up in this source file.
const CONTROL_CHARS = new RegExp(
  `[${'\\u0000-\\u0008'}${'\\u000B-\\u001F'}${'\\u007F-\\u009F'}]`,
  'g',
);

/**
 * Strips control characters and collapses runaway whitespace.
 *
 * The values are only ever inserted into an email as *escaped* HTML or as plain
 * text, so this is defence in depth rather than the primary protection: it
 * removes header-injection vectors (CR/LF) and invisible control bytes before
 * the string reaches any transport.
 *
 * Tab (U+0009) and newline (U+000A) are preserved for the message body and
 * stripped separately when `singleLine` is set.
 */
export function sanitizeText(value: string, { singleLine = false } = {}) {
  let output = value.replace(CONTROL_CHARS, '').trim();

  if (singleLine) {
    output = output.replace(/[\r\n\t]+/g, ' ');
  } else {
    // Normalise line endings and cap consecutive blank lines.
    output = output.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n');
  }

  return output.replace(/[ \t]{2,}/g, ' ');
}

/** Escapes the five characters that matter inside an HTML email body. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type SanitizedMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function sanitizeContactInput(input: ContactInput): SanitizedMessage {
  return {
    // Header-bearing fields must never contain newlines.
    name: sanitizeText(input.name, { singleLine: true }),
    email: sanitizeText(input.email, { singleLine: true }).toLowerCase(),
    subject: sanitizeText(input.subject, { singleLine: true }),
    message: sanitizeText(input.message),
  };
}
