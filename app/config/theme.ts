export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  backgroundTranslucent: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accentVibrant: string;
  accentGradient: string;
}

export const lightTheme: ThemeColors = {
  primary: '#1F2937',
  secondary: '#4B5563',
  background: '#FAF7F0',
  backgroundTranslucent: 'rgba(250, 247, 240, 0.8)',
  accent: '#F5F1E8',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  border: '#E8E2D4',
  accentVibrant: '#EA580C',
  accentGradient: 'linear-gradient(135deg, #EA580C, #F97316)',
};

export const darkTheme: ThemeColors = {
  primary: '#F1F5F9',
  secondary: '#CBD5E1',
  background: '#1F2937',
  backgroundTranslucent: 'rgba(31, 41, 55, 0.8)',
  accent: '#374151',
  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  border: '#4B5563',
  accentVibrant: '#F59E0B',
  accentGradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '5rem',
} as const;

export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;