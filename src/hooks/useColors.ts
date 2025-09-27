import { colors, colorSchemes } from '@/config/colors'

/**
 * Hook to access color configuration
 * This provides a centralized way to access colors throughout the app
 */
export const useColors = () => {
  return {
    colors,
    colorSchemes,
    
    // Helper functions for common color patterns
    getPrimaryColor: () => colors.primary[900],
    getSecondaryColor: () => colors.secondary.white,
    getTextColor: (variant: 'primary' | 'secondary' | 'light' | 'white' = 'primary') => 
      colors.text[variant],
    getBackgroundColor: (variant: 'primary' | 'secondary' | 'light' | 'dark' = 'primary') => 
      colors.background[variant],
    
    // Predefined color combinations
    getButtonColors: (variant: 'primary' | 'secondary' = 'primary') => 
      variant === 'primary' ? colorSchemes.primaryButton : colorSchemes.secondaryButton,
    
    getHeaderColors: () => colorSchemes.header,
    getFooterColors: () => colorSchemes.footer,
    getHeroColors: () => colorSchemes.hero,
    getCardColors: () => colorSchemes.card,
  }
}

export default useColors
