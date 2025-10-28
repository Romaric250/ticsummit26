export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
    white: '#ffffff',
  },
  accent: '#d946ef',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    light: '#64748b',
    white: '#ffffff',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    light: '#f1f5f9',
    dark: '#0f172a',
  },
  border: '#e2e8f0',
}

export const colorSchemes = {
  primaryButton: {
    bg: colors.primary[600],
    hover: colors.primary[700],
    text: '#ffffff',
  },
  secondaryButton: {
    bg: colors.secondary[200],
    hover: colors.secondary[300],
    text: colors.text.primary,
  },
  header: {
    bg: '#ffffff',
    text: colors.text.primary,
    border: colors.border,
  },
  footer: {
    bg: colors.primary[900],
    text: '#ffffff',
    textLight: colors.primary[300],
  },
  hero: {
    gradient: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 50%, ${colors.primary[900]} 100%)`,
    text: '#ffffff',
  },
  card: {
    bg: '#ffffff',
    border: colors.border,
    shadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
}