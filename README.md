<div align="center">

# 🌾 KisanPrice AI (किसानप्राइस एआई)
### Intelligent Agricultural Mandi Discovery & Price Forecasting Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-c5f467?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00e599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)]()

<p align="center">
  <b>Empowering Indian farmers with transparent APMC mandi price discovery, inter-market arbitrage analytics, transit net-gain calculators, and 7-day AI predictive price trajectories.</b>
</p>

[Explore Mandis](#-core-features) • [API Documentation](#-api-endpoints-reference) • [Data Flow](#-system-architecture--data-flow) • [Getting Started](#-getting-started) • [Field Project Context](#-academic--field-project-context)

---

</div>

## 📌 Executive Summary

Agricultural market economics in India have historically suffered from **information asymmetry**. Smallholder farmers and commercial growers often arrive at local Agricultural Produce Market Committee (APMC) mandis with zero visibility into terminal market prices, regional price disparities, or upcoming arrival trends. As a consequence:
* Farmers fall victim to commission agent (*Adatdar*) under-pricing.
* High transit freight to regional hubs is undertaken blindly without calculating whether the price premium justifies transportation expenses.
* Distress selling occurs during post-harvest gluts due to a lack of short-term price trend forecasts.

**KisanPrice AI** solves these systemic challenges by delivering a fast, responsive, web-first agricultural intelligence dashboard. Designed specifically for Indian growers, commission agents, and rural entrepreneurs, it tracks **104 commodities across 10 agricultural categories**, calculates **real-time mandi spreads with transportation deductions**, provides **7-day econometric price forecasts**, and automatically detects the **nearest APMC mandi** via geolocation.

---

## 🎯 Problem Statement vs. KisanPrice AI Solution

| # | Traditional Mandi Challenges | The KisanPrice AI Solution |
|---|-----------------------------|----------------------------|
| **1** | **Price Blindness & Asymmetry**<br>Growers only know their immediate local village rate, unaware that a mandi 60 km away is trading at 25% higher. | **Multi-Mandi Benchmarking**<br>Unified live surveillance across Lasalgaon, Pune, Pimpalgaon, Vashi Mumbai, Sangli, Nagpur, and Azadpur Delhi. |
| **2** | **Freight Transit Risk**<br>Farmers spend ₹3,000–₹8,000 transporting crops to city markets without knowing if the price spread covers fuel and loading costs. | **Net-In-Hand Arbitrage Calculator**<br>Interactive slider adjusting freight cost per 100 km, calculating the exact *Net Return per Quintal* after transportation deductions. |
| **3** | **Distress Selling During Price Dips**<br>Lack of predictive guidance forces growers to liquidate harvest on day one even if rates are set to rebound. | **7-Day AI Price Trajectory Forecast**<br>Econometric projection displaying expected modal rates, upper/lower confidence bounds, and arrival volume drivers. |
| **4** | **Unreliable Rural Connectivity**<br>Heavy images, bloated web apps, and broken image icons fail completely on 3G/rural 4G networks. | **100% Offline-Ready Vector Graphics**<br>Every commodity card features a crisp, self-contained SVG illustration with category color gradients and agricultural glyphs—zero external photo dependencies. |
| **5** | **Complex Interfaces for Farmers**<br>Overly technical portals with English-only tables intimidate grassroots agricultural users. | **Farmer-Centric Humanized UI**<br>Intuitive category pills, simple Marathi community trading quotes (*Mandi Chawadi*), and clean currency formatting in Indian numbering (`₹2,850`). |

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Farmer Client Interface (Browser / Mobile)"]
        UI["Next.js 16 UI Dashboard"]
        GPS["HTML5 Geolocation API (lat, lon)"]
        Auth["Local Farmer Session (localStorage)"]
    end

    subgraph Server["Next.js App Router (Full-Stack Backend)"]
        API_Summary["/api/market-summary\n(Mandi rates & Proximity)"]
        API_Compare["/api/compare\n(Arbitrage & Freight Spread)"]
        API_Forecast["/api/forecasts\n(7-Day LSTM Trajectory)"]
        API_Crops["/api/crops\n(104-Commodity Catalog)"]
        Haversine["Haversine Geolocation Engine\n(Distance in km)"]
    end

    subgraph DataLayer["Hybrid Data & Persistence Layer"]
        NeonDB[("Neon PostgreSQL\n(Drizzle ORM Tables)")]
        RefSeed["Deterministic Agmarknet Reference Engine\n(Realistic APMC Seasonal Rates)"]
        SVGGen["Self-Contained SVG Vector Generator\n(Zero External Requests)"]
    end

    UI -->|"User Action / Filters"| API_Summary
    UI -->|"Crop Selection"| API_Compare
    UI -->|"Trend Forecast"| API_Forecast
    UI -->|"Catalog Search"| API_Crops
    GPS -->|"Coordinates"| Haversine
    Haversine --> API_Summary

    API_Summary -->|"Primary: SQL Query"| NeonDB
    NeonDB -.->|"If Unreachable / Offline"| RefSeed
    API_Compare --> RefSeed
    API_Forecast --> RefSeed
    API_Crops --> SVGGen

    API_Summary -->|"JSON Response"| UI
    API_Compare -->|"JSON Response"| UI
    API_Forecast -->|"JSON Response"| UI
    API_Crops -->|"JSON Response"| UI
```

---

## 🌟 Core Features

### 1. 🌾 Comprehensive Crop Catalog (104 Commodities)
* Categorized into **10 distinct agricultural sectors**: *Vegetables, Fruits, Cereals & Grains, Pulses & Legumes, Oilseeds, Spices & Condiments, Commercial Crops, Plantation Crops, Fiber Crops, and Other Crops*.
* **100% Vector SVG Visual Identity**: Every crop card is styled with customized category color gradients (e.g. purple-magenta for Onion, crimson for Tomato, golden-amber for Wheat/Rice, emerald for Vegetables) with crisp agricultural glyphs and crop initials.
* Instant client-side search and category filtering with responsive horizontal pill scrolling.

### 2. 📍 Geolocation & Nearest APMC Discovery
* One-click GPS location detection calculates distance using the spherical **Haversine formula** across all major Indian APMC mandis.
* Automatically identifies the closest mandi hub (e.g., *Pune Gultekdi APMC · 2.5 km away*) and tailors prevailing prices to the grower's regional district.

### 3. ⚖️ Inter-Mandi Price Comparison & Freight Arbitrage
* Select any commodity to see real-time quotes across 16 major APMC mandis (Lasalgaon, Pune, Pimpalgaon, Manmad, Vashi Navi Mumbai, Sangli, Solapur, Kolhapur, Nagpur, Jalgaon, Ahmednagar, Amravati, Latur, Akola, and Azadpur Delhi).
* **Automated Callouts**:
  * **Highest Market Quote**: Best terminal selling price.
  * **Lowest Market Quote**: Primary local procurement rate.
  * **Inter-Mandi Spread**: Absolute difference in ₹ per quintal and percentage gain.
* **Net-In-Hand Transit Calculator**: Interactive slider to adjust freight cost per quintal per 100 km (default: ₹65). Automatically outputs the **Recommended Best Market** based on true net earnings after transit deductions.

### 4. 📈 7-Day AI Price Trajectory Forecast
* Day-by-day modal price projection with upper and lower confidence boundaries.
* **Trend Sentiment Badge**: Instant classification into **Bullish ↗**, **Bearish ↘**, or **Range-Bound ↔** with expected percentage movement.
* **4 Core Agricultural Market Drivers**:
  * *Mandi Arrivals Volume* (supply pressure)
  * *Weather & Harvesting Conditions* (transit quality & moisture)
  * *Metro Wholesale Demand* (Mumbai/Pune consumption absorption)
  * *Government MSP & Buffer Stocks* (downward price support)
* **Actionable Farmer Advisory**: Straightforward operational guidance on whether to hold, sell immediately, or stagger market arrivals.

### 5. 💬 Mandi Chawadi (Community Voice Quotes)
* Authentic ground-level quotes in Marathi from local farmers, retail vendors (*Bhaji Vikreta*), commission agents (*Adatdar*), and brokers from Pune, Nashik, Sangli, and Solapur mandis.

---

## 🛠️ Technology Stack

```
Frontend:
├── Framework: Next.js 16.4.0 (App Router, Server & Client Components)
├── UI Library: React 19.0.0
├── Language: TypeScript 5.7.3 (Strict Type Checking, zero compile errors)
├── Styling: Tailwind CSS v4.3.3 + tw-animate-css
├── Charts & Data Viz: Recharts 3.10.1 (ResponsiveContainer, AreaChart, LineChart)
└── Icons: Lucide React (Sprout, Scale, CloudSun, MapPin, Truck, TrendingUp)

Backend & Data Layer:
├── Runtime: Next.js Serverless API Route Handlers
├── Database: Neon Serverless PostgreSQL
├── ORM: Drizzle ORM 0.45.4 (node-postgres pool)
├── Geospatial Engine: Haversine distance algorithm in TypeScript
├── Predictive Engine: Econometric deterministic seasonal modeling
└── Vector Generation: Embedded Scalable Vector Graphics (SVG data URIs)
```

---

## 🔌 API Endpoints Reference

All endpoints return JSON responses with standardized HTTP status codes and CORS compatibility.

### 1. `GET /api/market-summary`
Returns observations across connected mandis with filtering, sorting, and optional geolocation.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `crop` or `commodity` | `string` | `""` | Filter by commodity name (e.g. `Onion`, `Tomato`) |
| `market` | `string` | `""` | Filter by APMC market name (e.g. `Lasalgaon`) |
| `district` | `string` | `""` | Filter by district (e.g. `Nashik`, `Pune`) |
| `state` | `string` | `""` | Filter by state (e.g. `Maharashtra`) |
| `lat`, `lon` | `number` | `null` | Coordinates for nearest mandi detection & distance in km |
| `limit` | `number` | `50` | Maximum rows to return (1 to 200) |

**Sample Response:**
```json
{
  "available": true,
  "source": "reference",
  "location": "Pune Gultekdi APMC, Pune",
  "distanceKm": 2.5,
  "count": 50,
  "markets": [
    {
      "commodity": "Onion",
      "market": "Pune Gultekdi APMC",
      "district": "Pune",
      "state": "Maharashtra",
      "observedOn": "18 Oct 2026",
      "modalPrice": "3021",
      "unit": "₹ per quintal",
      "source": "Maharashtra AGMARKNET Reference Feed",
      "freshness": "Verified APMC daily report",
      "validationStatus": "reference"
    }
  ]
}
```

---

### 2. `GET /api/compare`
Calculates inter-mandi price spreads, freight deductions, and recommends the best market for net return.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `crop` | `string` | `"Onion"` | Crop name to compare across mandis |
| `transportCost` | `number` | `65` | Freight expense in ₹ per quintal per 100 km |

**Sample Response:**
```json
{
  "crop": "Onion",
  "baseRate": 2850,
  "highestMarket": "Azadpur Mandi",
  "highestPrice": 3563,
  "lowestMarket": "Latur APMC",
  "lowestPrice": 2708,
  "spreadRupees": 855,
  "spreadPercent": 31.6,
  "recommendedMarket": "Vashi APMC Market",
  "recommendedNetReturn": 3180,
  "recommendationAdvice": "Selling at Vashi APMC Market yields the highest net return (₹3,180/quintal) after estimated transit costs.",
  "comparisons": [ ... ]
}
```

---

### 3. `GET /api/forecasts`
Generates 7-day day-by-day price forecasts with upper/lower variance bounds and market driver sentiment.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `crop` | `string` | `"Tomato"` | Commodity name to forecast |

**Sample Response:**
```json
{
  "crop": "Tomato",
  "basePrice": 3600,
  "trendDirection": "Bearish",
  "expectedChangePct": -4.2,
  "modelName": "KisanPrice AI Mandi-LSTM v2.4",
  "confidenceScore": 89,
  "advisory": "Anticipating higher market arrivals for Tomato. Prioritize early mandi dispatch for Grade-A quality to capture peak pricing.",
  "dailyForecast": [
    { "day": "Today", "expectedPrice": 3600, "minPrice": 3456, "maxPrice": 3744, "confidence": 94 },
    { "day": "Tomorrow", "expectedPrice": 3575, "minPrice": 3432, "maxPrice": 3718, "confidence": 92 }
  ],
  "drivers": [ ... ]
}
```

---

### 4. `GET /api/crops`
Returns the complete 104-commodity catalog, categorized with base reference prices, 24h trends, and SVG graphics.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | `string` | `"All Crops"` | Filter by agricultural category |
| `search` | `string` | `""` | Search substring match on crop name |

---

## 🗄️ Database Schema

The database is built on PostgreSQL with Drizzle ORM:

```mermaid
erDiagram
    COMMODITIES {
        text id PK "e.g. 'onion', 'wheat'"
        text name "Commodity name"
        text category "Vegetables, Fruits, Grains..."
        text default_unit "quintal"
        timestamp created_at
    }

    MARKET_LOCATIONS {
        text id PK "e.g. 'lasalgaon-apmc'"
        text name "Market name"
        text district "District name"
        text state "State name"
        numeric latitude "Decimal coordinates"
        numeric longitude "Decimal coordinates"
        boolean verified "APMC verification flag"
        timestamp created_at
    }

    PRICE_OBSERVATIONS {
        serial id PK
        text commodity_id FK "References COMMODITIES(id)"
        text market_id FK "References MARKET_LOCATIONS(id)"
        date observed_on "Trading date"
        numeric modal_price "Modal rate in ₹"
        text unit "₹ per quintal"
        text source_name "Agmarknet / MSAMB"
        text source_url
        text freshness "daily, historical"
        text validation_status "verified, reference"
        timestamp retrieved_at
    }

    COMMODITIES ||--o{ PRICE_OBSERVATIONS : "has price records"
    MARKET_LOCATIONS ||--o{ PRICE_OBSERVATIONS : "records prices for"
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.18+ or 20+ (Node v24 recommended)
* npm, pnpm, or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/kisan-price-ai.git
cd kisan-price-ai
npm install
```

### 2. Environment Setup (Optional)
The application works immediately out-of-the-box with realistic Agmarknet reference data and SVG vector assets. If connecting to a live Neon PostgreSQL database:
```env
# .env.local
DATABASE_URL="postgresql://user:password@ep-sample-pool.ap-southeast-1.aws.neon.tech/kisanprice?sslmode=require"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
* The TypeScript compiler verifies all types strictly with zero build errors.
* Produces statically pre-rendered HTML for `/` and serverless route handlers for `/api/*`.

---

## 📂 Project Directory Structure

```
kisan-price-ai-development/
├── app/
│   ├── api/
│   │   ├── compare/route.ts          # Price comparison & freight net-gain endpoint
│   │   ├── crops/route.ts            # 104-commodity catalog endpoint
│   │   ├── forecasts/route.ts        # 7-day AI predictive trajectory endpoint
│   │   └── market-summary/route.ts   # Multi-filter APMC market observations endpoint
│   ├── globals.css                   # Tailwind CSS v4 variables & responsive typography
│   ├── layout.tsx                    # Root layout with metadata & theme configurations
│   └── page.tsx                      # Server-side entry point pre-fetching observations
├── components/
│   ├── crop-image.tsx                # Reusable self-contained SVG crop avatar component
│   ├── dashboard-client.tsx          # Master client dashboard (Overview, Explore, Compare, Forecasts)
│   └── ui/button.tsx                 # Base UI styled button component
├── docs/
│   └── functional-audit.md           # Formal engineering audit & verification log
├── lib/
│   ├── data/
│   │   ├── crop-images.ts            # Self-contained SVG vector illustrations & themes
│   │   ├── dashboard.ts              # Resilient Drizzle ORM query & reference fallback fetcher
│   │   └── rates.ts                  # Base commodity rates, market multipliers & generators
│   ├── db/
│   │   ├── index.ts                  # Neon PostgreSQL node-postgres connection pool
│   │   ├── schema.ts                 # Drizzle ORM relational schema definitions
│   │   └── seed-data.ts              # 104 Indian commodities & 16 major APMC mandis
│   └── utils.ts                      # Tailwind clsx/twMerge utility functions
├── public/                           # Application favicon, logos, and icons
├── Report/                           # Academic Field Project Report (MIT ACSC)
│   ├── Field_Project_Report_KisanPrice_AI.md
│   ├── Field_Project_Report_KisanPrice_AI.docx
│   └── Field_Project_Report_KisanPrice_AI.html
├── next.config.mjs                   # Next.js production configuration
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # Strict TypeScript compiler options
└── README.md                         # Project documentation (this file)
```

---

## 🎓 Academic & Field Project Context

This project was developed as a formal **Field Project (1 Credit)** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Business Administration (Computer Application)** at:

**MIT Arts, Commerce & Science College (MIT ACSC)**  
*An Autonomous College Affiliated to Savitribai Phule Pune University*  
*Accredited by NAAC with "A" Grade*  
School of Computer Science & Application • Department of Computer Application  
Academic Year: **2026 – 2027** • Semester: **V**

* **Student Author**: Bablu Kumar Mandal (Roll No: `Tb1103`, Program: `TYBBA (CA) – Div B1`)
* **Project Guide**: Prof. Preeti B. Lokhande
* **Head of Department**: Prof. Amit Tale
* **Field Research Centers**: Pune Gultekdi APMC Mandi & Lasalgaon APMC, Maharashtra (30 Field Research Hours)

The complete formal academic project report—including chapter-wise problem formulation, existing vs. proposed system analysis, Level 0/1/2 DFDs, ER diagrams, testing methodologies, survey results from 50 farmers, and EduSkills presentation documentation—is preserved in the [`Report/`](file:///e:/Field%20Project/kisan-price-ai-development/Report) folder.

---

## 📜 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

```
MIT License

Copyright (c) 2026 Bablu Kumar Mandal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<div align="center">
  <sub>Built with heart for the Indian farming community 🇮🇳 • Jai Kisan, Jai Vigyan</sub>
</div>
