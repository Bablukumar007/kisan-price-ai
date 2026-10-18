import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { commodities, marketLocations, priceObservations } from '@/lib/db/schema'

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
  if (!db) return []

  return db
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
}
