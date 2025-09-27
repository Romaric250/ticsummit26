import { colors } from '@/config/colors'

/**
 * Utility to update CSS custom properties dynamically
 * This allows changing colors at runtime without rebuilding
 */
export const updateColors = (newColors: Partial<typeof colors>) => {
  const root = document.documentElement
  
  // Update primary colors
  if (newColors.primary) {
    Object.entries(newColors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })
  }
  
  // Update secondary colors
  if (newColors.secondary) {
    Object.entries(newColors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value)
    })
  }
  
  // Update text colors
  if (newColors.text) {
    Object.entries(newColors.text).forEach(([key, value]) => {
      root.style.setProperty(`--color-text-${key}`, value)
    })
  }
  
  // Update background colors
  if (newColors.background) {
    Object.entries(newColors.background).forEach(([key, value]) => {
      root.style.setProperty(`--color-bg-${key}`, value)
    })
  }
  
  // Update border colors
  if (newColors.border) {
    Object.entries(newColors.border).forEach(([key, value]) => {
      root.style.setProperty(`--color-border-${key}`, value)
    })
  }
  
  // Update accent colors
  if (newColors.accent) {
    Object.entries(newColors.accent).forEach(([key, value]) => {
      root.style.setProperty(`--color-accent-${key}`, value)
    })
  }
}

/**
 * Reset colors to default values
 */
export const resetColors = () => {
  updateColors(colors)
}

/**
 * Apply a predefined color scheme
 */
export const applyColorScheme = (scheme: 'default' | 'dark' | 'light' | 'blue' | 'green') => {
  const schemes = {
    default: colors,
    dark: {
      ...colors,
      primary: {
        ...colors.primary,
        900: '#000000',
        800: '#1a1a1a',
        700: '#333333',
      },
    },
    light: {
      ...colors,
      primary: {
        ...colors.primary,
        900: '#ffffff',
        800: '#f5f5f5',
        700: '#e5e5e5',
      },
    },
    blue: {
      ...colors,
      primary: {
        ...colors.primary,
        900: '#1e40af',
        800: '#2563eb',
        700: '#3b82f6',
      },
    },
    green: {
      ...colors,
      primary: {
        ...colors.primary,
        900: '#166534',
        800: '#16a34a',
        700: '#22c55e',
      },
    },
  }
  
  updateColors(schemes[scheme])
}

export default updateColors
