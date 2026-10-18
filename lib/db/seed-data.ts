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
  { id: 'pune-apmc', name: 'Pune Gultekdi APMC', district: 'Pune', state: 'Maharashtra', latitude: 18.4988, longitude: 73.8643 },
  { id: 'mumbai-vashi-apmc', name: 'Vashi APMC Market', district: 'Thane', state: 'Maharashtra', latitude: 19.0748, longitude: 73.0031 },
  { id: 'sangli-apmc', name: 'Sangli APMC', district: 'Sangli', state: 'Maharashtra', latitude: 16.8524, longitude: 74.5815 },
  { id: 'solapur-apmc', name: 'Solapur APMC', district: 'Solapur', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064 },
  { id: 'kolhapur-apmc', name: 'Kolhapur APMC', district: 'Kolhapur', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433 },
  { id: 'nagpur-apmc', name: 'Kalamna APMC Nagpur', district: 'Nagpur', state: 'Maharashtra', latitude: 21.1714, longitude: 79.1388 },
  { id: 'jalgaon-apmc', name: 'Jalgaon APMC', district: 'Jalgaon', state: 'Maharashtra', latitude: 21.0077, longitude: 75.5626 },
  { id: 'ahmednagar-apmc', name: 'Ahmednagar APMC', district: 'Ahmednagar', state: 'Maharashtra', latitude: 19.0948, longitude: 74.7480 },
  { id: 'amravati-apmc', name: 'Amravati APMC', district: 'Amravati', state: 'Maharashtra', latitude: 20.9374, longitude: 77.7796 },
  { id: 'latur-apmc', name: 'Latur APMC', district: 'Latur', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604 },
  { id: 'akola-apmc', name: 'Akola APMC', district: 'Akola', state: 'Maharashtra', latitude: 20.7002, longitude: 77.0082 },
  { id: 'nashik-apmc', name: 'Nashik APMC Panchavati', district: 'Nashik', state: 'Maharashtra', latitude: 20.0059, longitude: 73.7901 },
  { id: 'azadpur-mandi', name: 'Azadpur Mandi', district: 'North Delhi', state: 'Delhi', latitude: 28.7061, longitude: 77.1772 },
]

