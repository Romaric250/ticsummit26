# Color System Documentation

This project uses a centralized color configuration system that allows you to change colors globally without editing individual components.

## 🎨 Color Configuration

### Main Configuration File
Edit `src/config/colors.ts` to change colors globally:

```typescript
export const colors = {
  primary: {
    900: '#111827', // Main brand color (currently gray-900)
    // ... other shades
  },
  secondary: {
    white: '#ffffff',
    // ... other secondary colors
  },
  // ... other color categories
}
```

## 🚀 How to Use

### 1. Using Colors in Components

```tsx
import { useColors } from '@/hooks/useColors'

const MyComponent = () => {
  const { colors, getPrimaryColor, getButtonColors } = useColors()
  
  return (
    <div style={{ backgroundColor: getPrimaryColor() }}>
      <button style={getButtonColors('primary')}>
        Click me
      </button>
    </div>
  )
}
```

### 2. Using Tailwind Classes

```tsx
// Use brand colors with Tailwind
<div className="bg-brand-primary-900 text-brand-secondary-white">
  Content
</div>

// Or use CSS custom properties
<div className="bg-primary text-white">
  Content
</div>
```

### 3. Dynamic Color Changes

```tsx
import { applyColorScheme } from '@/utils/colorUpdater'

// Change to a predefined scheme
applyColorScheme('blue') // Changes to blue theme
applyColorScheme('dark') // Changes to dark theme
applyColorScheme('default') // Resets to default

// Or update specific colors
import { updateColors } from '@/utils/colorUpdater'

updateColors({
  primary: {
    900: '#1e40af', // Change to blue
  }
})
```

## 🎯 Available Color Schemes

- **default**: Gray-based theme (current)
- **dark**: Black-based theme
- **light**: White-based theme  
- **blue**: Blue-based theme
- **green**: Green-based theme

## 📁 File Structure

```
src/
├── config/
│   ├── colors.ts          # Main color configuration
│   └── README.md          # This documentation
├── hooks/
│   └── useColors.ts       # React hook for accessing colors
├── utils/
│   └── colorUpdater.ts    # Functions to update colors dynamically
├── styles/
│   └── color-variables.css # CSS custom properties
└── components/
    └── ColorDemo.tsx      # Demo component showing color system
```

## 🔧 Quick Color Changes

### Change Primary Color
1. Open `src/config/colors.ts`
2. Update the `primary.900` value:
   ```typescript
   primary: {
     900: '#your-new-color', // e.g., '#1e40af' for blue
   }
   ```
3. Save the file - colors update automatically!

### Change to Different Theme
1. Use the ColorDemo component to test different schemes
2. Or call `applyColorScheme('blue')` in your code

## 💡 Best Practices

1. **Always use the color system** instead of hardcoded colors
2. **Test color changes** using the ColorDemo component
3. **Use semantic color names** (primary, secondary) rather than specific colors
4. **Consider accessibility** when choosing color combinations
5. **Update all related colors** when changing the primary color

## 🎨 Color Categories

- **Primary**: Main brand colors (900 is the main color)
- **Secondary**: Supporting colors (white, off-white)
- **Text**: Text colors for different contexts
- **Background**: Background colors for different sections
- **Border**: Border colors for different elements
- **Accent**: Special colors for highlights, success, warnings, etc.

## 🔄 Migration Guide

To migrate existing hardcoded colors:

1. Find hardcoded color classes like `bg-gray-900`
2. Replace with brand classes like `bg-brand-primary-900`
3. Or use the useColors hook for dynamic colors
4. Test the changes with different color schemes
