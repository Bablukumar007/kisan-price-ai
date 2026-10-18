import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { commodities, marketLocations, priceObservations } from '@/lib/db/schema'
import { generateReferenceObservations } from '@/lib/data/rates'

export type DashboardMarket = {
  commodity: string
  market: string
  district: string
  state: string
  observedOn: string
  modalPrice: string
  unit: string
  source: string
  freshness: string
  validationStatus: string
}

export async function getDashboardMarkets(): Promise<DashboardMarket[]> {
  if (!db) {
    return generateReferenceObservations()
  }

  try {
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
      .limit(100)

    if (rows && rows.length > 0) {
      return rows
    }
  } catch (error) {
    console.warn('Database query failed in getDashboardMarkets, using reference observations:', error)
  }

  return generateReferenceObservations()
}
