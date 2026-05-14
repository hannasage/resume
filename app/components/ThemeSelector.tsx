'use client';

import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { THEMES, type Theme, type ThemeColors } from '../lib/projection-themes';
import { useTheme } from '../context/ThemeContext';

/**
 * Same control as Projection (`ThemeSelector.tsx`): palette trigger + dropdown
 * grouped into Dark / Light with swatches and checkmark. No plan color remapping.
 */
export default function ThemeSelector() {
  const { theme: currentTheme, setTheme, colors: COLORS } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (newTheme: Theme) => {
    if (newTheme.id === currentTheme.id) {
      setOpen(false);
      return;
    }
    setTheme(newTheme);
    setOpen(false);
  };

  const darkAll = THEMES.filter((t) => t.isDark);
  const lightAll = THEMES.filter((t) => !t.isDark);
  const partyDark = darkAll.find((t) => t.id === 'party');
  const darkThemes = darkAll.filter((t) => t.id !== 'party');
  const partyLight = lightAll.find((t) => t.id === 'party-light');
  const lightThemes = lightAll.filter((t) => t.id !== 'party-light');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[12px] transition-colors cursor-pointer font-mono"
        style={{
          borderColor: COLORS.border,
          background: open ? `${COLORS.accent}26` : 'transparent',
          color: COLORS.muted,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <circle
            cx="4.5"
            cy="5.5"
            r="1.2"
            fill={currentTheme.planColors[0]?.value ?? COLORS.accent}
          />
          <circle
            cx="7"
            cy="4"
            r="1.2"
            fill={currentTheme.planColors[1]?.value ?? COLORS.blue}
          />
          <circle
            cx="9.5"
            cy="5.5"
            r="1.2"
            fill={currentTheme.planColors[2]?.value ?? COLORS.orange}
          />
          <circle
            cx="9"
            cy="8.5"
            r="1.2"
            fill={currentTheme.planColors[3]?.value ?? COLORS.purple}
          />
          <circle
            cx="5"
            cy="8.5"
            r="1.2"
            fill={currentTheme.planColors[4]?.value ?? COLORS.red}
          />
        </svg>
        <span
          className="rounded-full shrink-0"
          style={{
            width: 8,
            height: 8,
            background: currentTheme.colors.accent,
          }}
        />
      </button>

      {open && (
        <ThemeDropdownPanel
          COLORS={COLORS}
          currentTheme={currentTheme}
          partyDark={partyDark}
          darkThemes={darkThemes}
          partyLight={partyLight}
          lightThemes={lightThemes}
          onSelect={handleSelect}
          anchorRef={ref}
        />
      )}
    </div>
  );
}

function ThemeDropdownPanel({
  COLORS,
  currentTheme,
  partyDark,
  darkThemes,
  partyLight,
  lightThemes,
  onSelect,
  anchorRef,
}: {
  COLORS: ThemeColors;
  currentTheme: Theme;
  partyDark: Theme | undefined;
  darkThemes: Theme[];
  partyLight: Theme | undefined;
  lightThemes: Theme[];
  onSelect: (t: Theme) => void;
  anchorRef: RefObject<HTMLDivElement | null>;
}) {
  const [pos, setPos] = useState({ top: 60, right: 20 });

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }, [anchorRef]);

  return (
    <div
      className="fixed z-[200] overflow-y-auto rounded-lg border font-mono text-left shadow-xl"
      style={{
        top: pos.top,
        right: pos.right,
        minWidth: 220,
        maxHeight: 420,
        background: COLORS.surface,
        borderColor: COLORS.border,
        boxShadow: `0 8px 32px ${COLORS.bg}cc`,
      }}
    >
      <div
        className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] border-b"
        style={{ color: COLORS.muted, borderColor: COLORS.border }}
      >
        Dark
      </div>
      {partyDark && (
        <ThemeRow
          theme={partyDark}
          isCurrent={partyDark.id === currentTheme.id}
          onSelect={() => onSelect(partyDark)}
          COLORS={COLORS}
          isParty
        />
      )}
      {darkThemes.map((theme) => (
        <ThemeRow
          key={theme.id}
          theme={theme}
          isCurrent={theme.id === currentTheme.id}
          onSelect={() => onSelect(theme)}
          COLORS={COLORS}
        />
      ))}

      <div
        className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] border-y"
        style={{ color: COLORS.muted, borderColor: COLORS.border }}
      >
        Light
      </div>
      {partyLight && (
        <ThemeRow
          theme={partyLight}
          isCurrent={partyLight.id === currentTheme.id}
          onSelect={() => onSelect(partyLight)}
          COLORS={COLORS}
          isParty
        />
      )}
      {lightThemes.map((theme) => (
        <ThemeRow
          key={theme.id}
          theme={theme}
          isCurrent={theme.id === currentTheme.id}
          onSelect={() => onSelect(theme)}
          COLORS={COLORS}
        />
      ))}
    </div>
  );
}

function ThemeRow({
  theme,
  isCurrent,
  onSelect,
  COLORS,
  isParty = false,
}: {
  theme: Theme;
  isCurrent: boolean;
  onSelect: () => void;
  COLORS: ThemeColors;
  /** Party themes: 🥳 in the swatch column instead of accent square (moon/sun always shown). */
  isParty?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2.5 border-0 px-3 py-2.5 text-left transition-colors cursor-pointer font-mono"
      style={{
        background: isCurrent ? `${theme.colors.accent}28` : 'transparent',
        borderBottom: `1px solid ${COLORS.border}33`,
        color: COLORS.text,
      }}
    >
      <span className="text-[10px] leading-none shrink-0 w-5 text-center" aria-hidden>
        {theme.isDark ? '🌙' : '☀️'}
      </span>
      {isParty ? (
        <span
          className="text-[14px] leading-none shrink-0 h-4 w-4 flex items-center justify-center"
          aria-hidden
          title="Party"
        >
          🥳
        </span>
      ) : (
        <span
          className="h-4 w-4 shrink-0 rounded-sm border"
          style={{
            background: theme.colors.accent,
            borderColor: `${theme.colors.accent}66`,
          }}
        />
      )}
      <span
        className="min-w-0 flex-1 text-[12px]"
        style={{
          color: isCurrent ? theme.colors.accent : COLORS.text,
          fontWeight: isCurrent ? 600 : 400,
        }}
      >
        {theme.name}
      </span>
      {isCurrent && (
        <span className="text-[12px] shrink-0" style={{ color: theme.colors.accent }}>
          ✓
        </span>
      )}
    </button>
  );
}
