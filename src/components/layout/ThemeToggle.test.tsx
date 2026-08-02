// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it } from 'vitest';

import messages from '@/content/en.json';

import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it('persists and exposes the next theme action', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeToggle />
      </NextIntlClientProvider>,
    );
    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('portfolio-theme-v1')).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  });
});
