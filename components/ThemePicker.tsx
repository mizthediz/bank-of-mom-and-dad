'use client'

import { useState } from 'react'
import { THEMES, ThemeKey } from '@/lib/themes'

interface ThemePickerProps {
  accountId: number
  currentTheme: string
  onThemeChange: (theme: ThemeKey) => void
}

export default function ThemePicker({ accountId, currentTheme, onThemeChange }: ThemePickerProps) {
  const [saving, setSaving] = useState(false)

  async function handleSelect(key: ThemeKey) {
    setSaving(true)
    await fetch(`/api/accounts/${accountId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorTheme: key }),
    })
    setSaving(false)
    onThemeChange(key)
  }

  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-3">Pick your color:</p>
      <div className="flex flex-wrap gap-3">
        {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={saving}
            title={theme.name}
            className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 disabled:opacity-50 ${currentTheme === key ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: theme.hex }}
          />
        ))}
      </div>
    </div>
  )
}
