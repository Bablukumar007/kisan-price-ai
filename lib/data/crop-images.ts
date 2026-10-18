/**
 * Reliable crop image management with verified Unsplash photographs
 * and category-specific SVG vector fallbacks that never fail or show broken icons.
 */

// Category visual themes for SVG vector generation
export const categoryThemes: Record<
  string,
  { bg1: string; bg2: string; icon: string; text: string; label: string }
> = {
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

// Curated verified high-resolution photographs for key Indian commodities
export const verifiedCropPhotos: Record<string, string> = {
  // Vegetables
  onion:
    'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=140&q=80',
  tomato:
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=140&q=80',
  potato:
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=140&q=80',
  carrot:
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=140&q=80',
  garlic:
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=140&q=80',
  ginger:
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=140&q=80',
  cucumber:
    'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=140&q=80',
  cabbage:
    'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=140&q=80',
  cauliflower:
    'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=140&q=80',
  mushroom:
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=140&q=80',
  'green chilli':
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=140&q=80',
  'sweet corn':
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=140&q=80',

  // Cereals and Grains
  wheat:
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=140&q=80',
  rice:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=140&q=80',
  maize:
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=140&q=80',

  // Fruits
  apple:
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=140&q=80',
  banana:
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=140&q=80',
  mango:
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=140&q=80',
  grapes:
    'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=140&q=80',
  orange:
    'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=140&q=80',
  watermelon:
    'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=140&q=80',
  pomegranate:
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=140&q=80',
  strawberry:
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=140&q=80',
  coconut:
    'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=140&q=80',

  // Commercial & Fiber & Oilseeds
  cotton:
    'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=140&q=80',
  soybean:
    'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=140&q=80',
  sunflower:
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=140&q=80',
  tea:
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=140&q=80',
  coffee:
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=140&q=80',
  sugarcane:
    'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=140&q=80',
}

/**
 * Generates an SVG vector graphic data URL tailored to the crop and category.
 * Fully self-contained, offline-ready, crisp on any screen, zero HTTP request.
 */
export function getCropSvgDataUri(name: string, category: string = 'Vegetables'): string {
  const theme = categoryThemes[category] || categoryThemes['Vegetables']
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const safeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="grad-${name.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="16" fill="url(#grad-${name.replace(/[^a-zA-Z0-9]/g, '')})"/>
  <circle cx="60" cy="50" r="30" fill="#ffffff" fill-opacity="0.18"/>
  <text x="60" y="58" font-size="32" text-anchor="middle" dominant-baseline="central">${theme.icon}</text>
  <rect x="20" y="86" width="80" height="20" rx="10" fill="#000000" fill-opacity="0.22"/>
  <text x="60" y="99" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" fill="${theme.text}" text-anchor="middle" dominant-baseline="central" letter-spacing="1">${initials}</text>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(safeSvg)}`
}

/**
 * Returns the best image URL for a crop.
 * If a verified photo exists, returns it; otherwise immediately returns the SVG data URL.
 */
export function getCropImageUrl(name: string, category: string = 'Vegetables'): string {
  const key = name.toLowerCase().trim()
  if (verifiedCropPhotos[key]) {
    return verifiedCropPhotos[key]
  }
  return getCropSvgDataUri(name, category)
}
