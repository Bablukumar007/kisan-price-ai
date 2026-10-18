/**
 * Self-contained SVG Vector Illustrations for Indian Mandi Commodities.
 * 100% offline, zero external image requests, zero broken images, crisp on all displays.
 */

export interface CropVisualTheme {
  bg1: string
  bg2: string
  icon: string
  text: string
  label: string
}

// Category fallback themes
export const categoryThemes: Record<string, CropVisualTheme> = {
  Vegetables: {
    bg1: '#166534',
    bg2: '#22c55e',
    icon: '🥬',
    text: '#f0fdf4',
    label: 'Vegetables',
  },
  Fruits: {
    bg1: '#c2410c',
    bg2: '#f97316',
    icon: '🍎',
    text: '#fff7ed',
    label: 'Fruits',
  },
  'Cereals and Grains': {
    bg1: '#b45309',
    bg2: '#f59e0b',
    icon: '🌾',
    text: '#fffbeb',
    label: 'Grains',
  },
  'Pulses and Legumes': {
    bg1: '#854d0e',
    bg2: '#d97706',
    icon: '🫘',
    text: '#fefce8',
    label: 'Pulses',
  },
  Oilseeds: {
    bg1: '#a16207',
    bg2: '#eab308',
    icon: '🌻',
    text: '#fefce8',
    label: 'Oilseeds',
  },
  'Spices and Condiments': {
    bg1: '#991b1b',
    bg2: '#ef4444',
    icon: '🌶️',
    text: '#fef2f2',
    label: 'Spices',
  },
  'Commercial Crops': {
    bg1: '#065f46',
    bg2: '#10b981',
    icon: '🎋',
    text: '#ecfdf5',
    label: 'Commercial',
  },
  'Plantation Crops': {
    bg1: '#047857',
    bg2: '#34d399',
    icon: '🌴',
    text: '#ecfdf5',
    label: 'Plantation',
  },
  'Fiber Crops': {
    bg1: '#0e7490',
    bg2: '#06b6d4',
    icon: '🧵',
    text: '#ecfeff',
    label: 'Fiber',
  },
  'Other Crops': {
    bg1: '#4338ca',
    bg2: '#6366f1',
    icon: '🌱',
    text: '#eef2ff',
    label: 'Other',
  },
}

// Specific crop visual customizations for recognizable, authentic icons and gradients
export const specificCropThemes: Record<string, Partial<CropVisualTheme>> = {
  // Key vegetables
  onion: { bg1: '#831843', bg2: '#db2777', icon: '🧅' },
  potato: { bg1: '#78350f', bg2: '#d97706', icon: '🥔' },
  tomato: { bg1: '#991b1b', bg2: '#ef4444', icon: '🍅' },
  brinjal: { bg1: '#4c1d95', bg2: '#8b5cf6', icon: '🍆' },
  okra: { bg1: '#14532d', bg2: '#16a34a', icon: '🟢' },
  'lady finger': { bg1: '#14532d', bg2: '#16a34a', icon: '🟢' },
  cauliflower: { bg1: '#3f6212', bg2: '#84cc16', icon: '🥦' },
  cabbage: { bg1: '#15803d', bg2: '#4ade80', icon: '🥬' },
  'green peas': { bg1: '#166534', bg2: '#22c55e', icon: '🫛' },
  capsicum: { bg1: '#14532d', bg2: '#22c55e', icon: '🫑' },
  cucumber: { bg1: '#166534', bg2: '#34d399', icon: '🥒' },
  carrot: { bg1: '#c2410c', bg2: '#fb923c', icon: '🥕' },
  radish: { bg1: '#9f1239', bg2: '#f43f5e', icon: '🥢' },
  spinach: { bg1: '#064e3b', bg2: '#059669', icon: '🍃' },
  mushroom: { bg1: '#713f12', bg2: '#a16207', icon: '🍄' },
  'sweet corn': { bg1: '#854d0e', bg2: '#eab308', icon: '🌽' },
  'green chilli': { bg1: '#15803d', bg2: '#16a34a', icon: '🌶️' },
  garlic: { bg1: '#475569', bg2: '#94a3b8', icon: '🧄' },
  ginger: { bg1: '#78350f', bg2: '#b45309', icon: '🫚' },

  // Key fruits
  mango: { bg1: '#b45309', bg2: '#f59e0b', icon: '🥭' },
  banana: { bg1: '#a16207', bg2: '#facc15', icon: '🍌' },
  apple: { bg1: '#991b1b', bg2: '#f43f5e', icon: '🍎' },
  grapes: { bg1: '#581c87', bg2: '#9333ea', icon: '🍇' },
  orange: { bg1: '#c2410c', bg2: '#fb923c', icon: '🍊' },
  pomegranate: { bg1: '#881337', bg2: '#e11d48', icon: '🫐' },
  guava: { bg1: '#3f6212', bg2: '#65a30d', icon: '🍈' },
  papaya: { bg1: '#ea580c', bg2: '#fbbf24', icon: '🍈' },
  watermelon: { bg1: '#991b1b', bg2: '#10b981', icon: '🍉' },
  lemon: { bg1: '#854d0e', bg2: '#facc15', icon: '🍋' },
  strawberry: { bg1: '#9f1239', bg2: '#fb7185', icon: '🍓' },
  coconut: { bg1: '#713f12', bg2: '#a16207', icon: '🥥' },
  pineapple: { bg1: '#a16207', bg2: '#f59e0b', icon: '🍍' },

  // Cereals & grains
  rice: { bg1: '#78350f', bg2: '#d97706', icon: '🍚' },
  wheat: { bg1: '#92400e', bg2: '#f59e0b', icon: '🌾' },
  maize: { bg1: '#854d0e', bg2: '#eab308', icon: '🌽' },
  jowar: { bg1: '#78350f', bg2: '#b45309', icon: '🌾' },
  bajra: { bg1: '#57534e', bg2: '#a8a29e', icon: '🌾' },

  // Pulses
  gram: { bg1: '#854d0e', bg2: '#d97706', icon: '🫘' },
  'tur dal': { bg1: '#a16207', bg2: '#f59e0b', icon: '🟡' },
  moong: { bg1: '#166534', bg2: '#22c55e', icon: '🟢' },
  urad: { bg1: '#1c1917', bg2: '#44403c', icon: '⚫' },
  soybean: { bg1: '#78350f', bg2: '#d97706', icon: '🫘' },

  // Oilseeds
  groundnut: { bg1: '#713f12', bg2: '#ca8a04', icon: '🥜' },
  mustard: { bg1: '#854d0e', bg2: '#facc15', icon: '🌻' },
  sunflower: { bg1: '#a16207', bg2: '#fbbf24', icon: '🌻' },

  // Spices
  turmeric: { bg1: '#b45309', bg2: '#eab308', icon: '🧂' },
  coriander: { bg1: '#14532d', bg2: '#16a34a', icon: '🌿' },
  cumin: { bg1: '#78350f', bg2: '#a16207', icon: '🧂' },
  'dry red chilli': { bg1: '#7f1d1d', bg2: '#dc2626', icon: '🌶️' },

  // Commercial & Fiber
  cotton: { bg1: '#0e7490', bg2: '#38bdf8', icon: '☁️' },
  sugarcane: { bg1: '#14532d', bg2: '#22c55e', icon: '🎋' },
  tea: { bg1: '#064e3b', bg2: '#059669', icon: '🍵' },
  coffee: { bg1: '#451a03', bg2: '#78350f', icon: '☕' },
  cashew: { bg1: '#713f12', bg2: '#d97706', icon: '🥜' },
}

/**
 * Generates an SVG vector graphic data URL tailored to the crop and category.
 * Fully self-contained, 100% offline-ready, crisp vector format, zero HTTP requests.
 */
export function getCropSvgDataUri(name: string, category: string = 'Vegetables'): string {
  const catTheme = categoryThemes[category] || categoryThemes['Vegetables']
  const specific = specificCropThemes[name.toLowerCase().trim()] || {}

  const bg1 = specific.bg1 || catTheme.bg1
  const bg2 = specific.bg2 || catTheme.bg2
  const icon = specific.icon || catTheme.icon
  const text = catTheme.text

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const safeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="grad-${name.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="20" fill="url(#grad-${name.replace(/[^a-zA-Z0-9]/g, '')})"/>
  <circle cx="60" cy="48" r="28" fill="#ffffff" fill-opacity="0.18"/>
  <text x="60" y="56" font-size="30" text-anchor="middle" dominant-baseline="central">${icon}</text>
  <rect x="22" y="86" width="76" height="20" rx="10" fill="#000000" fill-opacity="0.22"/>
  <text x="60" y="99" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${text}" text-anchor="middle" dominant-baseline="central" letter-spacing="1">${initials}</text>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(safeSvg)}`
}

/**
 * Returns the clean SVG vector image URL for any crop.
 */
export function getCropImageUrl(name: string, category: string = 'Vegetables'): string {
  return getCropSvgDataUri(name, category)
}
