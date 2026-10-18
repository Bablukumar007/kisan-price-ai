import DashboardClient from '@/components/dashboard-client'
import { getDashboardMarkets } from '@/lib/data/dashboard'

export default async function Page() {
  const observations = await getDashboardMarkets()
  return <DashboardClient observations={observations} />
}
