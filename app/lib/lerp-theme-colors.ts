import type { ThemeColors } from './projection-themes';

function parseHex(hex: string): { r: number; g: number; b: number } {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function clamp255(x: number): number {
  return Math.min(255, Math.max(0, Math.round(x)));
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((c) => clamp255(c).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Linear RGB interpolation between two #RRGGBB colors. */
export function lerpHex(from: string, to: string, t: number): string {
  const u = Math.min(1, Math.max(0, t));
  const a = parseHex(from);
  const b = parseHex(to);
  return toHex(
    a.r + (b.r - a.r) * u,
    a.g + (b.g - a.g) * u,
    a.b + (b.b - a.b) * u
  );
}

/** Perceptual-ish ease: slow in, slow out (apply once at segment level). */
export function smoothstep01(t: number): number {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

/** Full palette blend; `t` is typically 0→1 linear or pre-eased. */
export function lerpThemeColors(
  from: ThemeColors,
  to: ThemeColors,
  t: number
): ThemeColors {
  const u = Math.min(1, Math.max(0, t));
  return {
    bg: lerpHex(from.bg, to.bg, u),
    surface: lerpHex(from.surface, to.surface, u),
    faint: lerpHex(from.faint, to.faint, u),
    border: lerpHex(from.border, to.border, u),
    text: lerpHex(from.text, to.text, u),
    muted: lerpHex(from.muted, to.muted, u),
    accent: lerpHex(from.accent, to.accent, u),
    dim: lerpHex(from.dim, to.dim, u),
    blue: lerpHex(from.blue, to.blue, u),
    orange: lerpHex(from.orange, to.orange, u),
    red: lerpHex(from.red, to.red, u),
    purple: lerpHex(from.purple, to.purple, u),
    textOnAccent: lerpHex(from.textOnAccent, to.textOnAccent, u),
  };
}
