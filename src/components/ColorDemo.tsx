"use client"

import { useState } from 'react'
import { useColors } from '@/hooks/useColors'
import { applyColorScheme } from '@/utils/colorUpdater'
import { Button } from '@/components/ui/Button'

const ColorDemo = () => {
  const { colors, colorSchemes } = useColors()
  const [currentScheme, setCurrentScheme] = useState('default')

  const handleSchemeChange = (scheme: 'default' | 'dark' | 'light' | 'blue' | 'green') => {
    applyColorScheme(scheme)
    setCurrentScheme(scheme)
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Color System Demo</h2>
      
      {/* Color Scheme Switcher */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Color Schemes</h3>
        <div className="flex gap-2 flex-wrap">
          {(['default', 'dark', 'light', 'blue', 'green'] as const).map((scheme) => (
            <Button
              key={scheme}
              onClick={() => handleSchemeChange(scheme)}
              className={`px-4 py-2 rounded-lg ${
                currentScheme === scheme 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Palette Display */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Primary Color Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(colors.primary).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg border border-gray-200 mb-2"
                style={{ backgroundColor: value }}
              />
              <div className="text-xs text-gray-600">{key}</div>
              <div className="text-xs text-gray-500 font-mono">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Component Examples</h3>
        
        {/* Buttons */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Buttons</h4>
          <div className="flex gap-2">
            <Button className="bg-gray-900 text-white hover:bg-gray-800">
              Primary Button
            </Button>
            <Button variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-50">
              Secondary Button
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Cards</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Card Title</h5>
              <p className="text-gray-600">This is a sample card with the current color scheme.</p>
            </div>
            <div className="bg-gray-900 text-white rounded-lg p-4">
              <h5 className="font-semibold mb-2">Dark Card</h5>
              <p className="text-gray-300">This card uses the primary background color.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">How to Use</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>1. <strong>Change colors globally:</strong> Edit <code className="bg-gray-200 px-1 rounded">src/config/colors.ts</code></p>
          <p>2. <strong>Use in components:</strong> Import <code className="bg-gray-200 px-1 rounded">useColors()</code> hook</p>
          <p>3. <strong>Apply schemes dynamically:</strong> Use <code className="bg-gray-200 px-1 rounded">applyColorScheme()</code> function</p>
          <p>4. <strong>Use Tailwind classes:</strong> <code className="bg-gray-200 px-1 rounded">bg-brand-primary-900</code>, <code className="bg-gray-200 px-1 rounded">text-brand-secondary-white</code></p>
        </div>
      </div>
    </div>
  )
}

export default ColorDemo
