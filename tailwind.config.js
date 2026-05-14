/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.json',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        panel: 'var(--color-panel)',
        ink: 'var(--color-text)',
        'ink-dim': 'var(--color-text-dim)',
        'ink-muted': 'var(--color-text-muted)',
        hairline: 'var(--color-border)',
        'hairline-strong': 'var(--color-border-strong)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        mono: [
          'var(--font-plex-mono)',
          'IBM Plex Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        display: [
          'var(--font-syne)',
          'Syne',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          'var(--font-plex-mono)',
          'IBM Plex Mono',
          'ui-monospace',
          'monospace',
        ],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '3px',
        md: '4px',
        lg: '6px',
      },
      letterSpacing: {
        tightish: '-0.01em',
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
