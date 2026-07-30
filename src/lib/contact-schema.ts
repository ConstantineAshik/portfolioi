import { z } from 'zod';

/**
 * Single source of truth for contact validation, imported by both the client
 * form and the API route so the two can never drift apart.
 *
 * Messages are translation *keys*, not prose: the client maps them through
 * next-intl, and the server returns them for the client to render. That keeps
 * validation copy localised without duplicating the rules.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'nameTooShort').max(80, 'nameTooLong'),
  // Zod 4 exposes format validators at the top level; the chained
  // `.string().email()` form still works but is deprecated.
  email: z.email('emailInvalid').trim().max(254, 'emailTooLong'),
  subject: z.string().trim().min(3, 'subjectRequired').max(120, 'subjectTooLong'),
  // 3000 to match the limit stated in the localised copy.
  message: z.string().trim().min(20, 'messageTooShort').max(3000, 'messageTooLong'),
  /**
   * Honeypot. Named `company` so an autofilling bot finds it plausible; it is
   * hidden from humans and must arrive empty. The message is a generic server
   * error key — a real bot never reads it, and a human who somehow trips it
   * should not be told how the trap works.
   */
  company: z.string().max(0, 'serverError').optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Shape returned by POST /api/contact in every case. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
