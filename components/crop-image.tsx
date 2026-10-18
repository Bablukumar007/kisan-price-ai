'use client'

import { useState } from 'react'
import { getCropImageUrl, getCropSvgDataUri } from '@/lib/data/crop-images'

interface CropImageProps {
  name: string
  category?: string
  className?: string
  size?: number
}

export function CropImage({
  name,
  category = 'Vegetables',
  className = 'size-[50px] shrink-0 rounded-xl object-cover ring-1 ring-black/5',
  size = 50,
}: CropImageProps) {
  const [hasError, setHasError] = useState(false)
  const initialSrc = getCropImageUrl(name, category)
  const fallbackSrc = getCropSvgDataUri(name, category)

  const currentSrc = hasError ? fallbackSrc : initialSrc

  return (
    <img
      src={currentSrc}
      alt={`${name} (${category})`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => {
        if (!hasError) {
          setHasError(true)
        }
      }}
      className={className}
    />
  )
}
