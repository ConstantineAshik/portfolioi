/**
 * Three type roles, per the audit:
 *   display — editorial headings, oversized numerals
 *   body    — neutral reading text
 *   mono    — interface chrome: nav, labels, counters, metadata
 *
 * The project uses resilient system stacks so builds stay deterministic in
 * offline and restricted deployment environments.
 */
export const fontVariables = 'font-system';
