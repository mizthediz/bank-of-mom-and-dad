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
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pick your color</p>
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            disabled={saving}
            title={theme.name}
            className={`relative w-full aspect-square rounded-2xl disabled:opacity-50 hover:scale-105 transition-transform`}
            style={{ backgroundColor: theme.hex }}
          >
            {currentTheme === key && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center mt-3 font-medium">
        {THEMES[currentTheme as ThemeKey]?.name ?? 'Sky Blue'}
      </p>
    </div>
  )
}
