import { boolean, date, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const commodities = pgTable('commodities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  defaultUnit: text('default_unit').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const marketLocations = pgTable('market_locations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  district: text('district').notNull(),
  state: text('state').notNull(),
  latitude: numeric('latitude', { precision: 9, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 9, scale: 6 }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const priceObservations = pgTable('price_observations', {
  id: serial('id').primaryKey(),
  commodityId: text('commodity_id').notNull(),
  marketId: text('market_id').notNull(),
  observedOn: date('observed_on').notNull(),
  modalPrice: numeric('modal_price', { precision: 12, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  sourceName: text('source_name').notNull(),
  sourceUrl: text('source_url'),
  freshness: text('freshness').default('historical').notNull(),
  validationStatus: text('validation_status').default('demo').notNull(),
  retrievedAt: timestamp('retrieved_at', { withTimezone: true }).defaultNow().notNull(),
})
