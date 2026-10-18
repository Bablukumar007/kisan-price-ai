import { NextResponse } from 'next/server'
import { catalogSeed } from '@/lib/db/seed-data'
import { getReferenceRate } from '@/lib/data/rates'
import { getCropImageUrl } from '@/lib/data/crop-images'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const categoryFilter = url.searchParams.get('category')
  const searchFilter = url.searchParams.get('search') || ''

  let list = catalogSeed.map((item, index) => {
    const basePrice = getReferenceRate(item.name)
    const isUp = index % 3 !== 0
    const changePct = isUp ? +4.8 : -2.1

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      defaultUnit: item.defaultUnit,
      basePrice,
      isUp,
      changePct,
      imageUrl: getCropImageUrl(item.name, item.category),
    }
  })

  if (categoryFilter && categoryFilter !== 'All Crops') {
    list = list.filter((item) => item.category === categoryFilter)
  }

  if (searchFilter) {
    list = list.filter((item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()),
    )
  }

  const categories = ['All Crops', ...Array.from(new Set(catalogSeed.map((c) => c.category)))]

  return NextResponse.json({
    totalCount: list.length,
    categories,
    crops: list,
  })
}
