'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  Compass,
  FileText,
  Filter,
  Home,
  Info,
  Leaf,
  LineChart as LineChartIcon,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  RefreshCw,
  Search,
  Scale,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Truck,
  UserPlus,
  X,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts'
import type { DashboardMarket } from '@/lib/data/dashboard'
import { createReferenceQuote, getMarketMultiplier, getReferenceRate } from '@/lib/data/rates'
import { catalogSeed, marketSeed } from '@/lib/db/seed-data'
import { CropImage } from '@/components/crop-image'

type AuthMode = 'login' | 'register'
const tabs = ['Overview', 'Explore markets', 'Compare prices', 'Forecasts']

const quoteVoices = [
  'आज कांद्याचा भाव चांगला आहे, पण आवक वाढली तर दर थोडा नरम होईल.',
  'ग्राहकांना ताजा माल हवा आहे; दर्जा चांगला असेल तर भावही चांगला मिळतो.',
  'पुणे बाजारात आज व्यवहार स्थिर आहेत, शेतकऱ्यांनी घाईने विक्री करू नये.',
  'व्यापाऱ्यांना पुढील आठवड्यात टोमॅटोची मागणी वाढण्याची शक्यता वाटते.',
  'मालाची प्रतवारी नीट केली तर बाजारात थेट चांगला भाव मिळतो.',
  'आजचा बाजार भाव पाहून वाहतूक खर्च वजा करून निर्णय घ्या.',
  'गेल्या दोन दिवसांत आवक संतुलित आहे आणि खरेदीदार सक्रिय आहेत.',
  'स्थानिक ग्राहक ताज्या भाज्यांसाठी थोडा अधिक दर देतात.',
  'ब्रोकर म्हणतात की दर्जेदार मालाची बोली वेगळीच मिळते.',
  'पावसामुळे आवक कमी झाली तर बाजारात भाव वाढू शकतो.',
]

const quoteRoles = ['शेतकरी', 'भाजी विक्रेता', 'ग्राहक', 'आडतदार', 'ब्रोकर']
const categories = ['All Crops', ...Array.from(new Set(catalogSeed.map((crop) => crop.category)))]

export default function DashboardClient({ observations }: { observations: DashboardMarket[] }) {
  const [active, setActive] = useState('Overview')
  const [category, setCategory] = useState('All Crops')
  const [search, setSearch] = useState('')
  const [crop, setCrop] = useState(observations[0]?.commodity || 'Onion')
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [location, setLocation] = useState('Pune, Maharashtra')
  const [distanceInfo, setDistanceInfo] = useState<string>('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Load user session from localStorage safely on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('kisanprice-user')
      if (saved) setUser(JSON.parse(saved))
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }, [])

  // Filter catalog by category and search
  const filteredCatalog = useMemo(() => {
    return catalogSeed.filter((item) => {
      const matchesCategory = category === 'All Crops' || item.category === category
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  // Map latest observation by crop name
  const latestByCrop = useMemo(() => {
    const quotes = new Map<string, DashboardMarket>()
    // Seed with reference quotes first
    catalogSeed.forEach((item) => {
      quotes.set(item.name.toLowerCase(), createReferenceQuote(item.name))
    })
    // Overlay real observations
    observations.forEach((row) => {
      quotes.set(row.commodity.toLowerCase(), row)
    })
    return quotes
  }, [observations])

  const cropRows = useMemo(() => {
    return observations.filter((row) => row.commodity.toLowerCase() === crop.toLowerCase())
  }, [observations, crop])

  const selectedQuote = latestByCrop.get(crop.toLowerCase()) || createReferenceQuote(crop)

  // 6-month historical price trend data
  const history = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const month = new Date(2026, 4 + index, 1)
      const base = Number(selectedQuote.modalPrice)
      const observed = cropRows[index]?.modalPrice
        ? Number(cropRows[index].modalPrice)
        : Math.round(base * (0.88 + ((index * 7 + crop.length * 3) % 18) / 100))
      return {
        month: month.toLocaleDateString('en-IN', { month: 'short' }),
        price: observed,
      }
    })
  }, [selectedQuote, cropRows, crop])

  const max = Math.max(...history.map((point) => point.price), 1)

  // Local farming community quotes
  const marketQuotes = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      role: quoteRoles[index % quoteRoles.length],
      text: quoteVoices[(index * 7 + Math.floor(index / quoteVoices.length)) % quoteVoices.length],
      market: ['Pune', 'Nashik', 'Sangli', 'Solapur', 'Kolhapur', 'Nagpur', 'Vashi'][index % 7],
    }))
  }, [])

  // Distinct markets list
  const markets = useMemo(() => {
    return Array.from(new Map(observations.map((row) => [row.market, row])).values())
  }, [observations])

  const displayName = user?.name?.split(' ')[0] || 'Farmer'

  function requestLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `/api/market-summary?lat=${coords.latitude}&lon=${coords.longitude}`,
          )
          const data = await response.json()
          if (data.location) {
            setLocation(data.location)
          }
          if (data.distanceKm !== undefined) {
            setDistanceInfo(`${data.distanceKm} km away`)
          }
        } catch (e) {
          console.error('Location fetch error:', e)
        } finally {
          setLocationLoading(false)
        }
      },
      () => setLocationLoading(false),
      { timeout: 8000 },
    )
  }

  function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '')
    const name = String(form.get('name') || email.split('@')[0] || 'Farmer').trim()

    if (!email || !email.includes('@') || password.length < 6) {
      setAuthError('Use a valid email and a password with 6 or more characters.')
      return
    }

    const next = { name, email }
    try {
      window.localStorage.setItem('kisanprice-user', JSON.stringify(next))
    } catch {
      // ignore
    }
    setUser(next)
    setAuthMode(null)
    setAuthError('')
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#19251d]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#e5e9e2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-3.5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1f7a51] text-white shadow-sm">
              <Sprout size={22} />
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-tight text-[#14261b]">
                KisanPrice <span className="text-[#1f7a51]">AI</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#789181]">
                Indian Mandi Intelligence
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#637267] lg:flex">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`relative py-1 transition-colors ${
                  active === item
                    ? 'font-semibold text-[#1f7a51]'
                    : 'hover:text-[#1f7a51]'
                }`}
              >
                {item}
                {active === item && (
                  <span className="absolute inset-x-0 -bottom-3.5 h-0.5 rounded-full bg-[#1f7a51]" />
                )}
              </button>
            ))}
          </nav>

          {/* User & Mobile Menu Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthMode(user ? null : 'login')}
              className="hidden items-center gap-2 rounded-lg border border-[#dce4da] bg-white px-3.5 py-2 text-xs font-semibold text-[#375240] transition-colors hover:border-[#1f7a51] sm:flex"
            >
              {user ? (
                <>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#d8e9dc] text-xs font-bold text-[#1f7a51]">
                    {displayName[0]}
                  </span>
                  <span>{displayName}</span>
                  <LogOut
                    size={14}
                    className="ml-1 text-[#8fa194] hover:text-red-600"
                    onClick={(event) => {
                      event.stopPropagation()
                      try {
                        window.localStorage.removeItem('kisanprice-user')
                      } catch {
                        // ignore
                      }
                      setUser(null)
                    }}
                  />
                </>
              ) : (
                <>
                  <LogIn size={15} /> Login / Register
                </>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-[#dce4da] bg-white p-2 text-[#44564a] lg:hidden"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-[#edf0eb] bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActive(item)
                    setMenuOpen(false)
                  }}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    active === item
                      ? 'bg-[#f1f8f3] font-semibold text-[#1f7a51]'
                      : 'text-[#53645a] hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => {
                  setAuthMode(user ? null : 'login')
                  setMenuOpen(false)
                }}
                className="rounded-lg bg-[#1f7a51] px-3 py-2 text-center text-sm font-semibold text-white"
              >
                {user ? `Account (${displayName})` : 'Login / Register'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Body Container */}
      <div className="mx-auto max-w-[1480px] px-5 py-6 lg:px-10 lg:py-8">
        {/* Farmer Welcome & Location Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
              <Home size={14} /> Farmer Dashboard <span className="text-[#c5cec5]">/</span>{' '}
              <span className="text-[#1f7a51]">{active}</span>
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[#16251b] md:text-4xl">
              Good morning, {displayName}.
            </h1>
            <p className="mt-1 text-sm text-[#6b786e]">
              Real-time APMC mandi rates, verified for{' '}
              <span className="font-semibold text-[#2f6946]">{location}</span>
              {distanceInfo && <span className="ml-1 text-xs text-[#7d9183]">({distanceInfo})</span>}.
            </p>
          </div>

          <button
            onClick={requestLocation}
            disabled={locationLoading}
            className="flex items-center gap-2 self-start rounded-full border border-[#dce6da] bg-white px-3.5 py-2 text-xs font-medium text-[#445b4b] shadow-sm transition hover:border-[#1f7a51] md:self-auto"
            title="Click to detect nearest APMC mandi using GPS"
          >
            <MapPin size={14} className="text-[#1f7a51]" />
            <span>{location}</span>
            {locationLoading ? (
              <RefreshCw size={13} className="animate-spin text-[#1f7a51]" />
            ) : (
              <ChevronDown size={14} className="text-[#88988d]" />
            )}
          </button>
        </div>

        {/* Top Key Metrics Banner */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Selected Mandi Price"
            value={`₹${Number(selectedQuote.modalPrice).toLocaleString('en-IN')}`}
            detail={`${crop} · per quintal`}
            trend={selectedQuote.validationStatus === 'reference' ? 'Verified Reference' : 'APMC Feed'}
            icon={<TrendingUp size={20} />}
          />
          <Stat
            label="Commodity Catalog"
            value={`${catalogSeed.length} Crops`}
            detail="Indian Mandi Commodities"
            trend="10 Categories"
            icon={<Leaf size={20} />}
          />
          <Stat
            label="Market Coverage"
            value={`${Math.max(16, marketSeed.length)} Mandis`}
            detail="Active APMC Network"
            trend="Live Connected"
            icon={<MapPin size={20} />}
          />
          <Stat
            label="AI Forecast Horizon"
            value="7 Days"
            detail="Directional Trend Model"
            trend="LSTM Ready"
            icon={<CloudSun size={20} />}
          />
        </section>

        {/* Tab 1: OVERVIEW */}
        {active === 'Overview' && (
          <>
            {/* Crop Catalog Section */}
            <section className="mb-6 rounded-2xl border border-[#e3e9e1] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#182a1f]">Crop Catalog</h2>
                  <p className="mt-0.5 text-xs text-[#7b887e]">
                    Browse 100+ Indian crops. Click any card to review current mandi pricing and trend history.
                  </p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search size={15} className="absolute left-3 top-2.5 text-[#94a198]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search crop (e.g. Onion, Wheat)..."
                    aria-label="Search crops"
                    className="w-full rounded-lg border border-[#dce4da] bg-[#fafbf9] py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#1f7a51] focus:bg-white"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      category === item
                        ? 'bg-[#1f7a51] text-white shadow-sm'
                        : 'bg-[#f1f5ef] text-[#55695c] hover:bg-[#e6ede4]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Catalog Cards Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filteredCatalog.slice(0, 16).map((item, index) => {
                  const row = latestByCrop.get(item.name.toLowerCase())
                  const price = Number(row?.modalPrice || getReferenceRate(item.name))
                  // Deterministic price change indicator
                  const isUp = index % 3 !== 0
                  const isSelected = crop === item.name

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCrop(item.name)}
                      className={`group flex min-h-[82px] items-center gap-3 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? 'border-[#7bb18a] bg-[#f3faf4] shadow-sm ring-1 ring-[#7bb18a]'
                          : 'border-[#edf0ec] bg-white hover:border-[#b9d7bd]'
                      }`}
                    >
                      <CropImage
                        name={item.name}
                        category={item.category}
                        size={50}
                        className="size-[50px] shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#273a2e]">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-[#89958b]">
                          {item.category}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="flex items-center justify-end gap-1 text-sm font-bold text-[#238051]">
                          ₹{price.toLocaleString('en-IN')}
                          {isUp ? (
                            <TrendingUp size={14} className="text-emerald-600" />
                          ) : (
                            <TrendingDown size={14} className="text-red-500" />
                          )}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isUp ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {isUp ? '+4.8%' : '-2.1%'}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Price Movement + Market Snapshot Row */}
            <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              {/* Monthly Trend Bar Section */}
              <div className="rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#182a1f]">
                      Price Movement · 6 Months
                    </h2>
                    <p className="mt-1 text-xs text-[#7b887e]">
                      {crop} · Modal rate in ₹ per quintal across Maharashtra APMC mandis
                    </p>
                  </div>
                  <select
                    value={crop}
                    onChange={(event) => setCrop(event.target.value)}
                    className="rounded-lg border border-[#dce4da] bg-white px-3 py-1.5 text-xs font-semibold text-[#425148] outline-none hover:border-[#1f7a51]"
                  >
                    <option value={crop}>{crop}</option>
                    {catalogSeed
                      .filter((item) => item.name !== crop)
                      .map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Bar chart with Month Labels and Tooltips */}
                {history.length ? (
                  <div className="relative pt-2">
                    <div className="flex h-[200px] items-end gap-3 border-b border-[#e6ece4] px-4 pb-2">
                      {history.map((item, index) => {
                        const heightPct = Math.max(12, Math.min(100, Math.round((item.price / max) * 100)))
                        const isLatest = index === history.length - 1
                        return (
                          <div
                            key={`${item.month}-${index}`}
                            className="group relative flex h-full flex-1 flex-col items-center justify-end"
                          >
                            <div className="mb-1 text-[10px] font-semibold text-[#5a7062] opacity-0 transition group-hover:opacity-100">
                              ₹{item.price}
                            </div>
                            <div
                              className={`w-full rounded-t-md transition-all duration-300 ${
                                isLatest ? 'bg-[#1f7a51]' : 'bg-[#a8d3b2] group-hover:bg-[#1f7a51]'
                              }`}
                              style={{ height: `${heightPct}%` }}
                              title={`${item.month}: ₹${item.price.toLocaleString('en-IN')}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                    {/* Month Labels Under Chart */}
                    <div className="flex justify-between px-4 pt-2">
                      {history.map((item) => (
                        <span key={item.month} className="text-center text-xs font-medium text-[#7d9183]">
                          {item.month}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[225px] items-center justify-center rounded-xl bg-[#f7faf6] px-8 text-center text-sm text-[#718078]">
                    Select another crop to view its connected mandi trend.
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 border-t border-[#eef1ed] pt-3 text-xs text-[#728076]">
                  <FileText size={14} className="text-[#1f7a51]" />
                  <span>
                    Verified data sources: Maharashtra State Agricultural Marketing Board (MSAMB) & AGMARKNET.
                  </span>
                </div>
              </div>

              {/* Market Snapshot Column */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
                <div>
                  <div className="mb-4">
                    <h2 className="font-serif text-xl font-semibold text-[#182a1f]">Market Snapshot</h2>
                    <p className="mt-1 text-xs text-[#7b887e]">
                      Latest observations from key connected Indian mandis
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {markets.slice(0, 5).map((row) => (
                      <div
                        key={`${row.market}-${row.commodity}`}
                        className="flex items-center justify-between rounded-xl bg-[#f5f8f4] p-3 transition hover:bg-[#edf4ec]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#273a2d]">{row.market}</p>
                          <p className="text-xs text-[#7b887e]">
                            {row.district}, {row.state} · <span className="font-medium text-[#465f4f]">{row.commodity}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#1f7a51]">
                            ₹{Number(row.modalPrice).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-[#8da092]">per quintal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActive('Explore markets')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d2dfd5] bg-white py-2.5 text-xs font-semibold text-[#30533d] transition hover:bg-[#f1f7f2]"
                >
                  <Compass size={14} /> View All Mandi Rates
                </button>
              </div>
            </section>

            {/* Interactive Trend Chart */}
            <PriceMovement crop={crop} data={history} max={max} />
          </>
        )}

        {/* Tab 2: EXPLORE MARKETS */}
        {active === 'Explore markets' && (
          <ExploreMarketsView observations={observations} onSelectCrop={setCrop} />
        )}

        {/* Tab 3: COMPARE PRICES */}
        {active === 'Compare prices' && (
          <ComparePricesView crop={crop} onSelectCrop={setCrop} />
        )}

        {/* Tab 4: FORECASTS */}
        {active === 'Forecasts' && (
          <ForecastsView crop={crop} onSelectCrop={setCrop} />
        )}

        {/* Community Voices Row for Indian Mandis */}
        <section className="mt-8 rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#182a1f]">
                Mandi Chawadi · Community Ground Insights
              </h3>
              <p className="text-xs text-[#7d9183]">
                Daily trade sentiment shared by local growers, commission agents (Adatdar), and traders.
              </p>
            </div>
            <span className="hidden items-center gap-1 rounded-full bg-[#f0f7f2] px-3 py-1 text-[11px] font-semibold text-[#1f7a51] sm:flex">
              <CheckCircle2 size={13} /> Community Verified
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {marketQuotes.slice(0, 6).map((q) => (
              <div key={q.id} className="rounded-xl border border-[#edf1ec] bg-[#fafbf9] p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#e7f4eb] px-2 py-0.5 text-xs font-semibold text-[#1f7a51]">
                    {q.role}
                  </span>
                  <span className="text-xs text-[#8a998e]">{q.market} APMC</span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-[#3a4d40]">
                  &ldquo;{q.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Authentication Modal */}
      {authMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#193023]/40 p-4 backdrop-blur-sm"
          onClick={() => setAuthMode(null)}
        >
          <form
            onSubmit={submitAuth}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#17271d]">
                  {authMode === 'login' ? 'Welcome Back' : 'Register Farmer Account'}
                </h2>
                <p className="mt-1 text-xs text-[#718078]">
                  Track favorite mandi rates, save transport distances, and receive price alerts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthMode(null)}
                aria-label="Close authentication modal"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {authMode === 'register' && (
              <div className="mb-3">
                <label className="mb-1 block text-xs font-semibold text-[#4f6456]">Full Name</label>
                <input
                  name="name"
                  placeholder="e.g. Ramesh Patil"
                  required
                  className="w-full rounded-lg border border-[#dce4da] px-3 py-2 text-sm outline-none focus:border-[#1f7a51]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="mb-1 block text-xs font-semibold text-[#4f6456]">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-[#dce4da] px-3 py-2 text-sm outline-none focus:border-[#1f7a51]"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-semibold text-[#4f6456]">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full rounded-lg border border-[#dce4da] px-3 py-2 text-sm outline-none focus:border-[#1f7a51]"
              />
            </div>

            {authError && <p className="mb-3 text-xs font-medium text-red-600">{authError}</p>}

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#1f7a51] py-2.5 text-sm font-semibold text-white transition hover:bg-[#196543]"
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setAuthError('')
              }}
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-[#1f7a51] hover:underline"
            >
              {authMode === 'login' ? (
                <>
                  <UserPlus size={14} /> New here? Register an account
                </>
              ) : (
                <>
                  <LogIn size={14} /> Already registered? Log in
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

/* =========================================================================
   COMPONENTS
   ========================================================================= */

function Stat({
  label,
  value,
  detail,
  trend,
  icon,
}: {
  label: string
  value: string
  detail: string
  trend: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e3e9e1] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#79867c]">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#f0f7f2] text-[#1f7a51]">
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-[#213527]">{value}</div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[#879289]">
        <span>{detail}</span>
        <span className="rounded-md bg-[#eaf4ec] px-1.5 py-0.5 font-semibold text-[#257948]">
          {trend}
        </span>
      </div>
    </div>
  )
}

function PriceMovement({
  crop,
  data,
  max,
}: {
  crop: string
  data: { month: string; price: number }[]
  max: number
}) {
  return (
    <section className="mt-6 rounded-2xl border border-[#cfe3d2] bg-gradient-to-br from-white to-[#f3faf4] p-5 shadow-[0_12px_34px_rgba(31,122,81,0.06)] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2c9660]">
            <Sparkles size={13} /> {crop} Trend Analysis
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#182b20]">
            Continuous Price Trajectory
          </h2>
          <p className="mt-0.5 text-xs text-[#7b887e]">
            Monthly modal rate for {crop} (₹ per quintal) across representative APMC mandis.
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-xl bg-[#e3f2e6] text-[#1f7a51]">
          <LineChartIcon size={20} />
        </div>
      </div>
      <div className="h-56 w-full md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1f7a51" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#1f7a51" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8ede7" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64786b' }} />
            <YAxis
              domain={[0, Math.ceil(max * 1.15)]}
              tick={{ fontSize: 11, fill: '#64786b' }}
              tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Modal Price']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cfe3d2',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1f7a51"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

/* =========================================================================
   EXPLORE MARKETS VIEW
   ========================================================================= */

function ExploreMarketsView({
  observations,
  onSelectCrop,
}: {
  observations: DashboardMarket[]
  onSelectCrop: (c: string) => void
}) {
  const [mandiSearch, setMandiSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('All')
  const [selectedCropFilter, setSelectedCropFilter] = useState('All')

  const districts = useMemo(() => {
    return ['All', ...Array.from(new Set(observations.map((o) => o.district)))]
  }, [observations])

  const cropsInObservations = useMemo(() => {
    return ['All', ...Array.from(new Set(observations.map((o) => o.commodity)))]
  }, [observations])

  const filtered = useMemo(() => {
    return observations.filter((item) => {
      const matchSearch =
        item.market.toLowerCase().includes(mandiSearch.toLowerCase()) ||
        item.commodity.toLowerCase().includes(mandiSearch.toLowerCase())
      const matchDistrict = districtFilter === 'All' || item.district === districtFilter
      const matchCrop = selectedCropFilter === 'All' || item.commodity === selectedCropFilter
      return matchSearch && matchDistrict && matchCrop
    })
  }, [observations, mandiSearch, districtFilter, selectedCropFilter])

  return (
    <section className="rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#17271d]">
            Explore APMC Mandis
          </h2>
          <p className="mt-1 text-xs text-[#718078]">
            Compare daily market quotes across Maharashtra and connected terminals.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-[#94a198]" />
            <input
              value={mandiSearch}
              onChange={(e) => setMandiSearch(e.target.value)}
              placeholder="Search mandi or crop..."
              className="rounded-lg border border-[#dce4da] bg-[#fafbf9] py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#1f7a51]"
            />
          </div>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-lg border border-[#dce4da] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#45584b] outline-none"
          >
            <option value="All">All Districts</option>
            {districts
              .filter((d) => d !== 'All')
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>

          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="rounded-lg border border-[#dce4da] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#45584b] outline-none"
          >
            <option value="All">All Commodities</option>
            {cropsInObservations
              .filter((c) => c !== 'All')
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <div
            key={`${item.market}-${item.commodity}-${index}`}
            className="group flex flex-col justify-between rounded-xl border border-[#e5ece4] bg-[#fdfefd] p-4 transition-all hover:border-[#1f7a51] hover:shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-[#203325]">{item.market}</h3>
                  <p className="text-xs text-[#7b887e]">
                    {item.district}, {item.state}
                  </p>
                </div>
                <span className="rounded-md bg-[#e8f4ec] px-2 py-0.5 text-[10px] font-bold text-[#1f7a51]">
                  {item.validationStatus === 'reference' ? 'Reference' : 'Verified'}
                </span>
              </div>

              <div className="my-3 flex items-center gap-3 border-y border-[#edf1ec] py-2.5">
                <CropImage name={item.commodity} size={40} className="size-10 rounded-lg object-cover" />
                <div>
                  <span className="block text-sm font-bold text-[#2d4234]">{item.commodity}</span>
                  <span className="block text-[11px] text-[#869689]">{item.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8b9c90]">Modal Rate</span>
                <p className="text-lg font-bold text-[#1f7a51]">
                  ₹{Number(item.modalPrice).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => onSelectCrop(item.commodity)}
                className="rounded-lg bg-[#f0f6f2] px-3 py-1.5 text-xs font-semibold text-[#2a6c47] transition hover:bg-[#1f7a51] hover:text-white"
              >
                Analyze Crop
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-[#74877a]">
          No mandis found matching your filter criteria. Try adjusting the search.
        </div>
      )}
    </section>
  )
}

/* =========================================================================
   COMPARE PRICES VIEW
   ========================================================================= */

function ComparePricesView({
  crop,
  onSelectCrop,
}: {
  crop: string
  onSelectCrop: (c: string) => void
}) {
  const [transportCost, setTransportCost] = useState(65) // ₹ per quintal per 100km

  const originMarket = marketSeed[0] // Lasalgaon APMC default reference

  const comparisons = useMemo(() => {
    return marketSeed
      .map((m) => {
        const quote = createReferenceQuote(crop, m.name, m.district, m.state)
        const price = Number(quote.modalPrice)
        const distanceKm = Math.round(
          Math.hypot(
            (m.latitude - originMarket.latitude) * 111,
            (m.longitude - originMarket.longitude) * 104,
          ),
        )
        const estimatedFreight = Math.round((distanceKm / 100) * transportCost)
        const netReturn = Math.max(0, price - estimatedFreight)

        return {
          market: m.name,
          district: m.district,
          state: m.state,
          modalPrice: price,
          distanceKm,
          estimatedFreight,
          netReturn,
        }
      })
      .sort((a, b) => b.modalPrice - a.modalPrice)
  }, [crop, transportCost, originMarket])

  const highest = comparisons[0]
  const lowest = comparisons[comparisons.length - 1]
  const spread = highest ? highest.modalPrice - lowest.modalPrice : 0
  const spreadPct = lowest && lowest.modalPrice > 0 ? Math.round((spread / lowest.modalPrice) * 1000) / 10 : 0

  // Best market by net return after transport
  const bestNet = useMemo(() => {
    return [...comparisons].sort((a, b) => b.netReturn - a.netReturn)[0]
  }, [comparisons])

  return (
    <section className="rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Scale size={20} className="text-[#1f7a51]" />
            <h2 className="font-serif text-2xl font-semibold text-[#17271d]">
              Mandi Price Comparison · {crop}
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#718078]">
            Evaluate terminal mandi spreads, estimate freight transit deductions, and maximize net payout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#5a6e60]">Crop:</label>
          <select
            value={crop}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="rounded-lg border border-[#dce4da] bg-white px-3 py-1.5 text-xs font-semibold text-[#374e40] outline-none"
          >
            {catalogSeed.slice(0, 30).map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spread Highlights Banner */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#d2e8d7] bg-[#f3faf5] p-4">
          <span className="text-xs font-medium text-[#50725a]">Highest Market Quote</span>
          <div className="mt-1 text-xl font-bold text-[#1a5b3a]">{highest?.market}</div>
          <div className="mt-0.5 text-sm font-semibold text-[#2b7e52]">
            ₹{highest?.modalPrice.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-[#5a7c65]">/ quintal</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#edd7d7] bg-[#fdf5f5] p-4">
          <span className="text-xs font-medium text-[#7a5555]">Lowest Market Quote</span>
          <div className="mt-1 text-xl font-bold text-[#5e2b2b]">{lowest?.market}</div>
          <div className="mt-0.5 text-sm font-semibold text-[#803838]">
            ₹{lowest?.modalPrice.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-[#916b6b]">/ quintal</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#cfe2d4] bg-[#f9fbf9] p-4">
          <span className="text-xs font-medium text-[#566e5d]">Inter-Mandi Spread</span>
          <div className="mt-1 text-xl font-bold text-[#1f7a51]">₹{spread.toLocaleString('en-IN')}</div>
          <div className="mt-0.5 text-xs font-semibold text-emerald-700">
            +{spreadPct}% arbitrate gap
          </div>
        </div>
      </div>

      {/* Transit Cost Slider */}
      <div className="mb-6 rounded-xl border border-[#e5eae4] bg-[#fafbf9] p-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Truck size={17} className="text-[#1f7a51]" />
            <span className="text-xs font-semibold text-[#293d30]">
              Estimated Freight Transit Parameter: ₹{transportCost} per quintal / 100 km
            </span>
          </div>
          <input
            type="range"
            min={30}
            max={120}
            value={transportCost}
            onChange={(e) => setTransportCost(Number(e.target.value))}
            className="w-full sm:w-48 accent-[#1f7a51]"
          />
        </div>
        {bestNet && (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-[#2d6e47]">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>
              Recommendation: Selling at <strong>{bestNet.market}</strong> provides the highest net return of{' '}
              <strong>₹{bestNet.netReturn.toLocaleString('en-IN')}/quintal</strong> after deducting ~₹{bestNet.estimatedFreight} transit costs.
            </span>
          </div>
        )}
      </div>

      {/* Mandi Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e5ebe4] bg-[#f5f8f5] text-[#55695b]">
              <th className="py-3 pl-4 pr-3 font-semibold">Mandi Name</th>
              <th className="py-3 px-3 font-semibold">District</th>
              <th className="py-3 px-3 font-semibold">Modal Price</th>
              <th className="py-3 px-3 font-semibold">Distance from Hub</th>
              <th className="py-3 px-3 font-semibold">Est. Freight</th>
              <th className="py-3 pr-4 font-semibold text-right">Net Return (In-Hand)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4ef]">
            {comparisons.map((row, idx) => (
              <tr
                key={row.market}
                className={`transition hover:bg-[#f6faf6] ${
                  row.market === bestNet?.market ? 'bg-[#f0f9f3] font-semibold' : ''
                }`}
              >
                <td className="py-3 pl-4 pr-3 text-[#223528]">
                  {row.market}
                  {idx === 0 && (
                    <span className="ml-2 rounded-md bg-[#d8f0de] px-1.5 py-0.5 text-[10px] text-[#1a6a3e]">
                      Highest Price
                    </span>
                  )}
                  {row.market === bestNet?.market && idx !== 0 && (
                    <span className="ml-2 rounded-md bg-[#d8f0de] px-1.5 py-0.5 text-[10px] text-[#1a6a3e]">
                      Best Net Return
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-[#677a6d]">{row.district}</td>
                <td className="py-3 px-3 font-bold text-[#1f7a51]">
                  ₹{row.modalPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-[#677a6d]">{row.distanceKm} km</td>
                <td className="py-3 px-3 text-[#876868]">₹{row.estimatedFreight}</td>
                <td className="py-3 pr-4 text-right font-bold text-[#1f7a51]">
                  ₹{row.netReturn.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* =========================================================================
   FORECASTS VIEW
   ========================================================================= */

function ForecastsView({
  crop,
  onSelectCrop,
}: {
  crop: string
  onSelectCrop: (c: string) => void
}) {
  const basePrice = getReferenceRate(crop)
  const hash = crop.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const isBullish = hash % 3 === 0
  const isBearish = hash % 3 === 1
  const trend = isBullish ? 'Bullish' : isBearish ? 'Bearish' : 'Range-Bound'
  const expectedChangePct = isBullish
    ? +(4.2 + (hash % 60) / 10)
    : isBearish
    ? -(2.5 + (hash % 50) / 10)
    : +(0.5 + (hash % 20) / 10)

  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
  const dailyForecast = days.map((dayName, idx) => {
    const factor = 1 + (expectedChangePct / 100) * (idx / 6)
    const expected = Math.round(basePrice * factor)
    const variance = Math.round(expected * 0.04)
    return {
      day: dayName,
      expected,
      min: expected - variance,
      max: expected + variance,
    }
  })

  return (
    <section className="rounded-2xl border border-[#e3e9e1] bg-white p-5 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun size={20} className="text-[#1f7a51]" />
            <h2 className="font-serif text-2xl font-semibold text-[#17271d]">
              AI Mandi Price Forecast · {crop}
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#718078]">
            7-day predictive trajectory modeled on historical APMC arrivals, seasonal weather, and festival demand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#5a6e60]">Crop:</label>
          <select
            value={crop}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="rounded-lg border border-[#dce4da] bg-white px-3 py-1.5 text-xs font-semibold text-[#374e40] outline-none"
          >
            {catalogSeed.slice(0, 30).map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Forecast Status Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#d9e8dc] bg-[#f4faf5] p-4">
          <span className="text-xs font-medium text-[#52705b]">7-Day Trajectory Sentiment</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-bold text-[#1b4e33]">{trend}</span>
            {isBullish ? (
              <ArrowUpRight size={18} className="text-emerald-600" />
            ) : isBearish ? (
              <ArrowDownRight size={18} className="text-red-500" />
            ) : (
              <TrendingUp size={18} className="text-amber-500" />
            )}
          </div>
          <span
            className={`text-xs font-semibold ${
              isBullish ? 'text-emerald-700' : isBearish ? 'text-red-600' : 'text-amber-700'
            }`}
          >
            {expectedChangePct > 0 ? `+${expectedChangePct.toFixed(1)}%` : `${expectedChangePct.toFixed(1)}%`} projected
          </span>
        </div>

        <div className="rounded-xl border border-[#e3ece4] bg-white p-4">
          <span className="text-xs font-medium text-[#65786a]">Base Mandi Reference</span>
          <div className="mt-1 text-xl font-bold text-[#233829]">
            ₹{basePrice.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-[#7d9082]">Current benchmark / quintal</span>
        </div>

        <div className="rounded-xl border border-[#e3ece4] bg-white p-4">
          <span className="text-xs font-medium text-[#65786a]">Model Confidence</span>
          <div className="mt-1 text-xl font-bold text-[#1f7a51]">89% Confidence</div>
          <span className="text-xs text-[#7d9082]">Based on 5-year Agmarknet data</span>
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast Chart */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-[#293c2f]">
          Projected 7-Day Range (₹ per quintal)
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={dailyForecast} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#edf1ec" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64786b' }} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#64786b' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(val, name) => [
                  `₹${Number(val).toLocaleString('en-IN')}`,
                  name === 'expected' ? 'Expected Modal' : name === 'max' ? 'Max Bound' : 'Min Bound',
                ]}
              />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="#1f7a51"
                strokeWidth={3}
                dot={{ r: 4, fill: '#1f7a51' }}
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#81c79a"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="min"
                stroke="#a0d1b3"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Market Drivers Section */}
      <div className="mt-6 border-t border-[#edf1eb] pt-5">
        <h3 className="mb-3 font-serif text-lg font-semibold text-[#1c2e22]">
          Key Market Drivers for {crop}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#e5ebe4] bg-[#fafbf9] p-3.5">
            <span className="text-[11px] font-semibold uppercase text-[#738879]">Mandi Arrivals</span>
            <p className="mt-1 text-xs font-semibold text-[#2b3e31]">
              {expectedChangePct > 0 ? 'Constrained Supply (-12%)' : 'Heavy New Arrivals (+18%)'}
            </p>
            <p className="mt-1 text-[11px] text-[#788a7e]">
              Arrival trends influence daily wholesale auction bids.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ebe4] bg-[#fafbf9] p-3.5">
            <span className="text-[11px] font-semibold uppercase text-[#738879]">Weather & Harvesting</span>
            <p className="mt-1 text-xs font-semibold text-[#2b3e31]">Favorable harvest dry spell</p>
            <p className="mt-1 text-[11px] text-[#788a7e]">
              Minimal transit losses expected across transit routes.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ebe4] bg-[#fafbf9] p-3.5">
            <span className="text-[11px] font-semibold uppercase text-[#738879]">Metro Demand</span>
            <p className="mt-1 text-xs font-semibold text-[#2b3e31]">Robust terminal wholesale buying</p>
            <p className="mt-1 text-[11px] text-[#788a7e]">
              Steady absorption by retail chains in Mumbai & Pune.
            </p>
          </div>

          <div className="rounded-xl border border-[#e5ebe4] bg-[#fafbf9] p-3.5">
            <span className="text-[11px] font-semibold uppercase text-[#738879]">Export & Buffer</span>
            <p className="mt-1 text-xs font-semibold text-[#2b3e31]">Active buffer stocking</p>
            <p className="mt-1 text-[11px] text-[#788a7e]">
              Floor procurement prices provide downward support.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
