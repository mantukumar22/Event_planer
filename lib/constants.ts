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
  'Venue & Grounds': '#6D28D9', // Royal purple
  'Venue & Rentals': '#6D28D9',
  'Catering & Craft Bar': '#22E5FF', // Cyan
  'Catering & Bar': '#22E5FF',
  'Decor & Royal Florals': '#E879F9', // Magenta
  'Decor & Floral': '#E879F9',
  'Entertainment & Music': '#F5C451', // Gold
  'Music & Audio Experience': '#F5C451',
  'Photography & Cinema': '#A78BFA', // Lavender
  'Photography & Video': '#A78BFA',
  'Attire, Styling & Favors': '#38BDF8', // Sky
  'Attire & Styling': '#38BDF8',
  'Stationery & Favors': '#C084FC',
  'Contingency Reserve': '#94A3B8', // Slate
  'Contingency Buffer': '#94A3B8',
  'Logistics & Permits': '#34D399', // Emerald
  'Marketing & Signage': '#FB923C', // Amber
  'Default': '#6D28D9',
};

export const COLOR_SWATCHES = [
  '#6D28D9', // Royal purple
  '#22E5FF', // Cyan
  '#E879F9', // Magenta
  '#F5C451', // Gold
  '#A78BFA', // Lavender
  '#38BDF8', // Sky
  '#34D399', // Mint
  '#F472B6', // Rose
  '#FB923C', // Orange
  '#94A3B8', // Slate
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
