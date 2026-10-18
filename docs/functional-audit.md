# KisanPrice AI functional audit

Audit date: 2026-10-18. Scope: current repository and connected Neon-backed data layer.

| Feature | Frontend location | Backend dependency | Expected behavior | Actual behavior | Root cause | Status | Required fix | Verification |
|---|---|---|---|---|---|---|---|---|
| Dashboard navigation | `components/dashboard-client.tsx` | React state | Navigation changes active section without a full reload | Controls were present and stateful | No route-specific views existed | Partially Working | Preserve stateful navigation and add route views as scope expands | Browser click and snapshot |
| Crop categories | `components/dashboard-client.tsx` | `catalogSeed` reference catalog | Category selection filters crops responsively | Previously absent | No category state or catalog UI | Working | Keep category list derived from catalog | Browser category click and count |
| 100+ crop catalog | `lib/db/seed-data.ts`, dashboard client | Neon `commodities` table seed target | At least 100 distinct commodities, no fake prices | Only four seed commodities existed | Incomplete seed catalog | Working | Apply idempotent catalog seed to Neon before production use | `catalogSeed.length`, database count |
| Crop search | Dashboard catalog | Client filtering of reviewed catalog | Search narrows visible catalog | Previously absent | No search input or filtering | Working | Add server pagination when catalog grows beyond UI page | Browser search |
| Market filters | Dashboard | `price_observations`, markets | State, district, market and date filters update observations | No filter controls or query parameters | API only returned an unfiltered limit | Not Implemented | Add validated query params and cascading selectors | API integration tests |
| Live market retrieval | `app/api/market-summary/route.ts`, `lib/data/dashboard.ts` | Neon joins across three tables | Display only returned observations and source metadata | Data was queried, but UI used fabricated fallback values | Fallback arrays and derived fake prices | Working | Keep empty/error states and remove fabricated fallbacks | DB/API response plus browser empty state |
| Price history | Dashboard chart | Neon price observations | Chart uses observations for selected crop | Chart mixed real rows with fallback history | Static history fallback | Working | Add date range and chronological ordering | Browser crop selection and API fixture |
| Data freshness and provenance | Dashboard and schema | `source_name`, `source_url`, `observed_on`, validation fields | Users can distinguish observations from estimates | Fields existed in schema but were not surfaced consistently | UI labels were generic | Partially Working | Surface source/date/status in detail views | Snapshot and API contract test |
| Authentication | No auth routes/components | Better Auth tables and secret | Register, login, logout, protected actions | No authentication implementation in repository | Auth was skipped earlier | Not Implemented | Add Better Auth only after explicit auth scope approval and schema migration | Browser auth journey |
| Authorization and saved crops | No routes/actions | User/session tables | User-owned records are scoped server-side | No user-owned tables or actions | Feature absent | Not Implemented | Add authenticated actions with per-user predicates | Integration tests |
| Market comparison | Navigation label only | Market observations | Compare selected markets using same crop/date | No comparison view | UI placeholder only | Not Implemented | Build query-backed comparison route and view | Browser flow |
| Forecasts | Navigation label only | No forecast provider configured | Clearly labeled model output based on observations | No forecast implementation | No provider/model contract | Not Implemented | Add approved provider or explicitly label unavailable | Provider contract test |
| Alerts and notifications | Notification modal | No alert persistence | Authenticated users manage thresholds | Modal text was static | No alert table or actions | Not Implemented | Add user-scoped alert schema/actions | Authenticated browser journey |
| Location / nearby markets | Static Nashik label | Market coordinates exist | Location changes supported markets | Location label was static | No permission/query flow | Partially Working | Add safe geolocation and distance query | Browser permission and API test |
| Error and empty states | Dashboard | API/database errors | Errors are visible and no fake values appear | Fallback values hid empty data | Fabricated fallbacks | Working | Keep retry UI when client fetching is introduced | Empty DB and API failure tests |
| Responsive behavior | Dashboard | None | Categories/search remain usable on mobile | Base layout was responsive | Category UI did not exist | Working | Verify horizontal category scroller at mobile width | Browser mobile screenshot |
| Accessibility | Dashboard | None | Semantic controls have labels and usable focus | Most controls had labels, but data views were limited | Incomplete controls | Partially Working | Add explicit status/live-region semantics in future async views | Accessibility snapshot |

## Evidence and limitations

- The repository uses Next.js App Router, Drizzle ORM, `pg`, and Neon environment variables.
- The market API joins `price_observations`, `commodities`, and `market_locations`; Neon is a store, not an automatic live agricultural data provider.
- Existing observations must come from an authorized import/provider. This change does not fabricate missing prices or claim that seeded reference commodities have live observations.
- Authentication was not implemented in this repair pass because the prior approved direction explicitly selected “Skip authentication”; the audit records it as not implemented rather than presenting a non-functional login surface.
