import type { ThemeColors } from './projection-themes';

/**
 * Applies Projection-style CSS variables to the document (same mapping as ThemeContext).
 * Used by ThemeProvider and Party theme animator.
 */
export function applyVisualPalette(colors: ThemeColors, isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const c = colors;

  document.body.style.background = c.bg;
  root.style.setProperty('--plan-accent', c.accent);
  root.dataset.colorScheme = isDark ? 'dark' : 'light';
  root.style.colorScheme = isDark ? 'dark' : 'light';
  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');

  const set = (key: string, value: string) => root.style.setProperty(key, value);

  set('--theme-bg', c.bg);
  set('--theme-surface', c.surface);
  set('--theme-faint', c.faint);
  set('--theme-border', c.border);
  set('--theme-text', c.text);
  set('--theme-muted', c.muted);
  set('--theme-accent', c.accent);
  set('--theme-dim', c.dim);

  set('--color-bg', c.bg);
  set('--color-bg-elevated', c.faint);
  set('--color-panel', c.surface);
  set('--color-text', c.text);
  set('--color-text-dim', c.muted);
  set('--color-text-muted', c.dim);
  set('--color-border', c.border);
  set('--color-accent', c.accent);
  set('--color-accent-text', c.textOnAccent);
  set('--color-accent-vibrant', c.accent);
  set('--color-danger', c.red);

  set('--color-cta-secondary', c.blue);
  set(
    '--color-cta-gradient',
    `linear-gradient(135deg, ${c.accent} 0%, ${c.blue} 100%)`
  );
  set(
    '--color-cta-glow',
    `color-mix(in srgb, ${c.blue} 45%, transparent)`
  );

  set('--color-primary', c.text);
  set('--color-secondary', c.muted);
  set('--color-background', c.bg);
  set('--color-text-primary', c.text);
  set('--color-text-secondary', c.muted);

  set(
    '--color-background-translucent',
    isDark ? 'rgba(7, 9, 12, 0.78)' : 'rgba(255, 255, 255, 0.88)'
  );

  set(
    '--color-accent-gradient',
    `linear-gradient(135deg, ${c.accent}, ${c.dim})`
  );
}
