'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_THEME,
  THEMES,
  type Theme,
} from '../lib/projection-themes';
import { applyVisualPalette } from '../lib/apply-visual-palette';
import { lerpThemeColors, smoothstep01 } from '../lib/lerp-theme-colors';

const STORAGE_KEY = 'resume-projection-theme-id';

function applyTheme(theme: Theme) {
  applyVisualPalette(theme.colors, theme.isDark);
}

interface ThemeContextType {
  theme: Theme;
  colors: Theme['colors'];
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useLayoutEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    const next = (id && THEMES.find((t) => t.id === id)) || DEFAULT_THEME;
    setThemeState(next);
    applyTheme(next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next.id);
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      colors: theme.colors,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <PartyThemeAnimator />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** How long each palette→palette blend takes (continuous spectrum crawl). */
const PARTY_SEGMENT_MS = 2000;

/**
 * Smoothly interpolates RGB between consecutive built-in palettes (looping)
 * while Party mode is active.
 */
function PartyThemeAnimator() {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const isPartyDark = theme.id === 'party';
    const isPartyLight = theme.id === 'party-light';
    if (!isPartyDark && !isPartyLight) return;

    const sources = isPartyDark
      ? THEMES.filter(
          (t) => t.isDark && t.id !== 'party' && t.id !== 'party-light'
        )
      : THEMES.filter(
          (t) => !t.isDark && t.id !== 'party' && t.id !== 'party-light'
        );

    if (sources.length === 0) return;

    const n = sources.length;
    const start = performance.now();
    const rafRef = { id: 0 };

    const loop = () => {
      const elapsed = performance.now() - start;
      const seg = Math.floor(elapsed / PARTY_SEGMENT_MS);
      const localT = (elapsed % PARTY_SEGMENT_MS) / PARTY_SEGMENT_MS;
      const from = sources[seg % n];
      const to = sources[(seg + 1) % n];
      const blended = lerpThemeColors(
        from.colors,
        to.colors,
        smoothstep01(localT)
      );
      applyVisualPalette(blended, isPartyDark);
      rafRef.id = requestAnimationFrame(loop);
    };

    rafRef.id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.id);
  }, [theme.id]);

  return null;
}
