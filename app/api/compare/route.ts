import { NextResponse } from 'next/server'
import { marketSeed } from '@/lib/db/seed-data'
import { createReferenceQuote, getReferenceRate } from '@/lib/data/rates'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const crop = url.searchParams.get('crop') || 'Onion'
  const transportCostPer100Km = Number(url.searchParams.get('transportCost')) || 65 // ₹ per quintal per 100km

  // Reference origin market (default to Lasalgaon or Pune)
  const originMarket = marketSeed.find((m) => m.id === 'lasalgaon-apmc') || marketSeed[0]

  const comparisons = marketSeed.map((m) => {
    const quote = createReferenceQuote(crop, m.name, m.district, m.state)
    const price = Number(quote.modalPrice)
    const distanceKm = Math.round(
      Math.hypot((m.latitude - originMarket.latitude) * 111, (m.longitude - originMarket.longitude) * 104),
    )
    const estimatedFreight = Math.round((distanceKm / 100) * transportCostPer100Km)
    const netReturn = Math.max(0, price - estimatedFreight)

    return {
      marketId: m.id,
      market: m.name,
      district: m.district,
      state: m.state,
      modalPrice: price,
      distanceFromOriginKm: distanceKm,
      estimatedFreightPerQuintal: estimatedFreight,
      netReturnPerQuintal: netReturn,
      observedOn: quote.observedOn,
      source: quote.source,
      freshness: quote.freshness,
    }
  })

  // Sort by modal price descending
  comparisons.sort((a, b) => b.modalPrice - a.modalPrice)

  const highest = comparisons[0]
  const lowest = comparisons[comparisons.length - 1]
  const spreadRupees = highest.modalPrice - lowest.modalPrice
  const spreadPercent = Math.round((spreadRupees / lowest.modalPrice) * 1000) / 10

  // Best net return after transport
  const byNetReturn = [...comparisons].sort((a, b) => b.netReturnPerQuintal - a.netReturnPerQuintal)
  const bestNet = byNetReturn[0]

  return NextResponse.json({
    crop,
    baseRate: getReferenceRate(crop),
    highestMarket: highest.market,
    highestPrice: highest.modalPrice,
    lowestMarket: lowest.market,
    lowestPrice: lowest.modalPrice,
    spreadRupees,
    spreadPercent,
    recommendedMarket: bestNet.market,
    recommendedNetReturn: bestNet.netReturnPerQuintal,
    recommendationAdvice: `Selling at ${bestNet.market} yields the highest net return (₹${bestNet.netReturnPerQuintal.toLocaleString('en-IN')}/quintal) after estimated transit costs.`,
    comparisons,
  })
}
