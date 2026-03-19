export const THEMES = {
  sky:      { name: 'Sky Blue',     hex: '#38BDF8', dark: false },
  coral:    { name: 'Coral',        hex: '#FB7185', dark: true },
  mint:     { name: 'Mint',         hex: '#34D399', dark: false },
  lavender: { name: 'Lavender',     hex: '#A78BFA', dark: true },
  sunny:    { name: 'Sunny Yellow', hex: '#FCD34D', dark: false },
  peach:    { name: 'Peach',        hex: '#FDBA74', dark: false },
  teal:     { name: 'Teal',         hex: '#2DD4BF', dark: false },
  lilac:    { name: 'Lilac',        hex: '#E879F9', dark: true },
} as const

export type ThemeKey = keyof typeof THEMES

export function getTheme(key: string) {
  return THEMES[key as ThemeKey] ?? THEMES.sky
}
