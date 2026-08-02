import { describe, expect, it } from 'vitest';

import { escapeHtml, sanitizeContactInput, sanitizeText } from './sanitize';

describe('contact sanitization', () => {
  it('removes controls, normalizes whitespace, and protects header fields', () => {
    expect(sanitizeText('  hello\r\n\tworld  ', { singleLine: true })).toBe('hello world');
    expect(sanitizeText('a\n\n\n\nb')).toBe('a\n\nb');
  });

  it('escapes HTML email content', () => {
    expect(escapeHtml(`<a title="x">Tom & 'Sam'</a>`)).toBe(
      '&lt;a title=&quot;x&quot;&gt;Tom &amp; &#39;Sam&#39;&lt;/a&gt;',
    );
  });

  it('normalizes a validated contact message', () => {
    expect(sanitizeContactInput({
      name: ' Ashik\nMiah ',
      email: ' USER@EXAMPLE.COM ',
      subject: ' Hello\r\nthere ',
      message: 'Line one\r\n\r\n\r\nLine two',
      company: '',
    })).toEqual({
      name: 'Ashik Miah',
      email: 'user@example.com',
      subject: 'Hello there',
      message: 'Line one\n\nLine two',
    });
  });
});
