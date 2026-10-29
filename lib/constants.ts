import { CurrencyCode, IntakeFormData } from './schemas';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
  JPY: '¥',
  INR: '₹',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Venue & Rentals': '#4F46E5', // Indigo
  'Catering & Bar': '#059669', // Emerald
  'Decor & Floral': '#E11D48', // Rose
  'Entertainment & Music': '#D97706', // Amber
  'Photography & Video': '#7C3AED', // Violet
  'Attire & Styling': '#2563EB', // Blue
  'Stationery & Favors': '#0891B2', // Cyan
  'Contingency Buffer': '#475569', // Slate
  'Logistics & Permits': '#0D9488', // Teal
  'Marketing & Signage': '#EA580C', // Orange
  'Default': '#64748B',
};

export const COLOR_SWATCHES = [
  '#4F46E5',
  '#059669',
  '#E11D48',
  '#D97706',
  '#7C3AED',
  '#2563EB',
  '#0891B2',
  '#475569',
  '#0D9488',
  '#EA580C',
];

export const PRESET_EVENTS: {
  id: string;
  title: string;
  subtitle: string;
  data: IntakeFormData;
}[] = [
  {
    id: 'wedding-150',
    title: 'Wedding for 150',
    subtitle: 'Romantic Garden Elegance in Napa Valley',
    data: {
      eventType: 'wedding',
      eventTitle: 'Julian & Maya’s Garden Wedding',
      eventDate: '2027-06-19',
      guestCount: 150,
      totalBudget: 35000,
      currency: 'USD',
      location: 'Napa Valley, CA',
      themeVibe: 'Romantic Garden Elegance with warm candlelight & botanicals',
      culturalTraditions: 'Bilingual vows, traditional tea ceremony elements, evening sparkler send-off',
      mustHaves: 'Live acoustic trio for ceremony, farm-to-table dinner, specialty espresso cart',
      dietaryRestrictions: 'Vegetarian, Gluten-free, and Halal options required',
      accessibilityNeeds: 'Step-free wheelchair access from ceremony to reception lawn',
      venueSetting: 'outdoor',
    },
  },
  {
    id: 'birthday-kid',
    title: 'Kid’s 8th Birthday',
    subtitle: 'Dinosaur Explorer Safari for 25 adventurous kids',
    data: {
      eventType: 'birthday',
      eventTitle: 'Leo’s 8th Dino Expedition Birthday',
      eventDate: '2027-04-10',
      guestCount: 25,
      totalBudget: 1200,
      currency: 'USD',
      location: 'Austin, TX',
      themeVibe: 'Jurassic Safari Adventure with fossil dig activities and explorer vests',
      culturalTraditions: '',
      mustHaves: 'Interactive fossil excavation station, volcano cake eruption, dino scavenger hunt',
      dietaryRestrictions: 'Nut-free zone, dairy-free cupcakes for 3 guests',
      accessibilityNeeds: 'Paved paths for strollers and wheelchair accessibility at park pavilion',
      venueSetting: 'hybrid',
    },
  },
  {
    id: 'community-fundraiser',
    title: 'Community Fundraiser',
    subtitle: 'Summer Block Party & Cook-off for 200 neighbors',
    data: {
      eventType: 'community',
      eventTitle: 'Oakridge Summer Block Party & Food Drive',
      eventDate: '2027-08-14',
      guestCount: 200,
      totalBudget: 5000,
      currency: 'USD',
      location: 'Chicago, IL',
      themeVibe: 'Festive Neighborhood Street Fair with live local bands & picnic games',
      culturalTraditions: 'Multi-cultural community potluck cook-off and artisan craft tables',
      mustHaves: 'Permits for street closure, local high school jazz band, silent auction tent',
      dietaryRestrictions: 'Clear allergen labeling on all community cook-off dishes',
      accessibilityNeeds: 'Designated sensory-friendly quiet shade tent, accessible portable restrooms',
      venueSetting: 'outdoor',
    },
  },
];

export const APP_CONFIG = {
  MAX_REQUEST_PAYLOAD_BYTES: 256 * 1024, // 256KB
  API_TIMEOUT_MS: 40000, // 40s
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 25, // 25 req/min per IP
};
