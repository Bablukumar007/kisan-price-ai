export type CropCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Cereals and Grains'
  | 'Pulses and Legumes'
  | 'Oilseeds'
  | 'Spices and Condiments'
  | 'Commercial Crops'
  | 'Plantation Crops'
  | 'Fiber Crops'
  | 'Other Crops'

const groups: Array<[CropCategory, string[]]> = [
  ['Vegetables', ['Onion', 'Potato', 'Tomato', 'Brinjal', 'Okra', 'Cauliflower', 'Cabbage', 'Green Peas', 'Capsicum', 'Cucumber', 'Carrot', 'Radish', 'Spinach', 'Bottle Gourd', 'Bitter Gourd', 'Pumpkin', 'French Beans', 'Cluster Beans', 'Drumstick', 'Beetroot', 'Sweet Corn', 'Mushroom', 'Lady Finger', 'Turnip', 'Green Chilli', 'Garlic', 'Ginger']],
  ['Fruits', ['Mango', 'Banana', 'Apple', 'Grapes', 'Orange', 'Pomegranate', 'Guava', 'Papaya', 'Watermelon', 'Muskmelon', 'Pineapple', 'Lemon', 'Litchi', 'Sapota', 'Jackfruit', 'Custard Apple', 'Strawberry', 'Coconut', 'Tamarind', 'Ber']],
  ['Cereals and Grains', ['Rice', 'Wheat', 'Maize', 'Jowar', 'Bajra', 'Ragi', 'Barley', 'Oats', 'Sorghum', 'Foxtail Millet', 'Kodo Millet', 'Little Millet', 'Quinoa']],
  ['Pulses and Legumes', ['Gram', 'Tur Dal', 'Moong', 'Urad', 'Masoor', 'Matar', 'Rajma', 'Lobia', 'Horse Gram', 'Cowpea', 'Chickpea']],
  ['Oilseeds', ['Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Sesame', 'Safflower', 'Castor Seed', 'Linseed', 'Niger Seed']],
  ['Spices and Condiments', ['Turmeric', 'Coriander', 'Cumin', 'Black Pepper', 'Cardamom', 'Clove', 'Fenugreek', 'Fennel', 'Ajwain', 'Dry Red Chilli', 'Nutmeg']],
  ['Commercial Crops', ['Sugarcane', 'Tobacco', 'Tea', 'Coffee', 'Rubber', 'Arecanut', 'Cocoa']],
  ['Plantation Crops', ['Cashew', 'Betel Leaf', 'Vanilla', 'Pineapple Plantation']],
  ['Fiber Crops', ['Cotton', 'Jute', 'Mesta', 'Sunhemp', 'Flax']],
  ['Other Crops', ['Fodder Maize', 'Fodder Sorghum', 'Marigold', 'Rose', 'Jasmine', 'Aloe Vera']],
]

export const catalogSeed = groups.flatMap(([category, names]) => names.map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  category,
  defaultUnit: 'quintal',
})))

export const marketSeed = [
  { id: 'lasalgaon-apmc', name: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', latitude: 20.1428, longitude: 74.2367 },
  { id: 'pimpalgaon-baswant', name: 'Pimpalgaon Baswant', district: 'Nashik', state: 'Maharashtra', latitude: 20.1687, longitude: 73.9928 },
  { id: 'manmad-apmc', name: 'Manmad APMC', district: 'Nashik', state: 'Maharashtra', latitude: 20.2537, longitude: 74.4378 },
]
