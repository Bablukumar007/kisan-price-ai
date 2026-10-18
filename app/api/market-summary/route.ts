import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { marketSeed } from '@/lib/db/seed-data'
import { db } from '@/lib/db'
import { commodities, marketLocations, priceObservations } from '@/lib/db/schema'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get('lat'))
  const lon = Number(url.searchParams.get('lon'))
  const nearest = Number.isFinite(lat) && Number.isFinite(lon)
    ? marketSeed.reduce((best, market) => {
        const distance = Math.hypot((market.latitude - lat) * 111, (market.longitude - lon) * 104)
        return distance < best.distance ? { market, distance } : best
      }, { market: marketSeed[0], distance: Number.POSITIVE_INFINITY })
    : { market: marketSeed[0], distance: 0 }

  if (!db) {
    return NextResponse.json({ available: false, reason: 'DATABASE_URL is not configured', markets: [], location: `${nearest.market.name}, ${nearest.market.district}` })
  }

  const rows = await db
    .select({
      commodity: commodities.name,
      market: marketLocations.name,
      district: marketLocations.district,
      state: marketLocations.state,
      observedOn: priceObservations.observedOn,
      modalPrice: priceObservations.modalPrice,
      unit: priceObservations.unit,
      source: priceObservations.sourceName,
      freshness: priceObservations.freshness,
      validationStatus: priceObservations.validationStatus,
    })
    .from(priceObservations)
    .innerJoin(commodities, eq(priceObservations.commodityId, commodities.id))
    .innerJoin(marketLocations, eq(priceObservations.marketId, marketLocations.id))
    .orderBy(desc(priceObservations.observedOn))
    .limit(50)

  return NextResponse.json({ available: true, location: `${nearest.market.name}, ${nearest.market.district}`, markets: rows })
}
