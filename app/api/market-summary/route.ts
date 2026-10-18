import { NextResponse } from 'next/server'
import { and, desc, eq, ilike } from 'drizzle-orm'
import { marketSeed } from '@/lib/db/seed-data'
import { db } from '@/lib/db'
import { commodities, marketLocations, priceObservations } from '@/lib/db/schema'
import { generateReferenceObservations } from '@/lib/data/rates'

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = Number(url.searchParams.get('lat'))
  const lon = Number(url.searchParams.get('lon'))
  const cropFilter = url.searchParams.get('crop') || url.searchParams.get('commodity') || ''
  const marketFilter = url.searchParams.get('market') || ''
  const districtFilter = url.searchParams.get('district') || ''
  const stateFilter = url.searchParams.get('state') || ''
  const limitParam = Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 200)

  // Find nearest market if geolocation coordinates are provided
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon)
  let nearestMarket = marketSeed[0]
  let distanceKm = 0

  if (hasCoords) {
    let minDistance = Number.POSITIVE_INFINITY
    for (const m of marketSeed) {
      const dist = getDistanceKm(lat, lon, m.latitude, m.longitude)
      if (dist < minDistance) {
        minDistance = dist
        nearestMarket = m
      }
    }
    distanceKm = minDistance
  }

  const locationLabel = `${nearestMarket.name}, ${nearestMarket.district}`

  // Query database if available
  if (db) {
    try {
      const conditions = []
      if (cropFilter) {
        conditions.push(ilike(commodities.name, `%${cropFilter}%`))
      }
      if (marketFilter) {
        conditions.push(ilike(marketLocations.name, `%${marketFilter}%`))
      }
      if (districtFilter) {
        conditions.push(ilike(marketLocations.district, `%${districtFilter}%`))
      }
      if (stateFilter) {
        conditions.push(ilike(marketLocations.state, `%${stateFilter}%`))
      }

      let query = db
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
        .limit(limitParam)

      if (conditions.length > 0) {
        // @ts-expect-error dynamic condition typing
        query = query.where(and(...conditions))
      }

      const rows = await query
      if (rows && rows.length > 0) {
        return NextResponse.json({
          available: true,
          source: 'database',
          location: locationLabel,
          distanceKm: hasCoords ? distanceKm : undefined,
          count: rows.length,
          markets: rows,
        })
      }
    } catch (error) {
      console.warn('Database query failed in market-summary route, falling back to reference:', error)
    }
  }

  // Graceful fallback to verified reference observations
  let refData = generateReferenceObservations()

  if (cropFilter) {
    refData = refData.filter((r) =>
      r.commodity.toLowerCase().includes(cropFilter.toLowerCase()),
    )
  }
  if (marketFilter) {
    refData = refData.filter((r) =>
      r.market.toLowerCase().includes(marketFilter.toLowerCase()),
    )
  }
  if (districtFilter) {
    refData = refData.filter((r) =>
      r.district.toLowerCase().includes(districtFilter.toLowerCase()),
    )
  }
  if (stateFilter) {
    refData = refData.filter((r) =>
      r.state.toLowerCase().includes(stateFilter.toLowerCase()),
    )
  }

  const sliced = refData.slice(0, limitParam)

  return NextResponse.json({
    available: true,
    source: 'reference',
    location: locationLabel,
    distanceKm: hasCoords ? distanceKm : undefined,
    count: sliced.length,
    markets: sliced,
  })
}
