// Global color configuration for the TIC Summit website
// Change these values to update colors across the entire application

export const colors = {
  // Primary color (main brand color)
  primary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827', // Main primary color
  },
  
  // Secondary color (white)
  secondary: {
    white: '#ffffff',
    offWhite: '#f9fafb',
  },
  
  // Accent colors (for highlights and special elements)
  accent: {
    success: '#10b981', // green-500
    warning: '#f59e0b', // yellow-500
    error: '#ef4444',   // red-500
    info: '#3b82f6',    // blue-500
  },
  
  // Text colors
  text: {
    primary: '#111827',    // gray-900
    secondary: '#6b7280',  // gray-500
    light: '#9ca3af',      // gray-400
    white: '#ffffff',
  },
  
  // Background colors
  background: {
    primary: '#111827',    // gray-900
    secondary: '#ffffff',  // white
    light: '#f9fafb',      // gray-50
    dark: '#1f2937',       // gray-800
  },
  
  // Border colors
  border: {
    primary: '#111827',    // gray-900
    secondary: '#e5e7eb',  // gray-200
    light: '#f3f4f6',      // gray-100
  }
} as const

// Helper function to get color values
export const getColor = (path: string): string => {
  const keys = path.split('.')
  let value: any = colors
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`)
      return '#000000' // fallback to black
    }
  }
  
  return value
}

// Predefined color combinations for common use cases
export const colorSchemes = {
  // Primary button
  primaryButton: {
    bg: colors.primary[900],
    text: colors.secondary.white,
    hover: colors.primary[800],
  },
  
  // Secondary button
  secondaryButton: {
    bg: colors.secondary.white,
    text: colors.primary[900],
    hover: colors.primary[50],
    border: colors.primary[900],
  },
  
  // Header
  header: {
    bg: colors.primary[900],
    text: colors.secondary.white,
    logo: {
      bg: colors.secondary.white,
      text: colors.primary[900],
    }
  },
  
  // Footer
  footer: {
    bg: colors.primary[900],
    text: colors.secondary.white,
    links: colors.secondary.white,
  },
  
  // Hero section
  hero: {
    bg: colors.primary[900],
    text: colors.secondary.white,
    accent: colors.primary[300],
  },
  
  // Cards
  card: {
    bg: colors.secondary.white,
    text: colors.text.primary,
    border: colors.border.secondary,
  }
} as const

export default colors
