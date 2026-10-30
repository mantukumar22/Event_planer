import { EventPlan } from './schemas';

export const SAMPLE_EVENT_PLAN: EventPlan = {
  id: 'royal-gala-sample',
  createdAt: '2027-01-15T18:00:00.000Z',
  updatedAt: '2027-01-15T18:00:00.000Z',
  intake: {
    eventType: 'wedding',
    eventTitle: 'Julian & Maya’s Royal Garden Wedding',
    eventDate: '2027-06-19',
    guestCount: 150,
    totalBudget: 35000,
    currency: 'USD',
    location: 'Napa Valley, CA',
    themeVibe: 'Romantic Royal Garden Elegance with glowing lanterns and deep purple accents',
    culturalTraditions: 'Bilingual vows, traditional tea ceremony elements, evening sparkler send-off',
    mustHaves: 'Live acoustic strings for ceremony, farm-to-table dinner, specialty espresso & champagne cart',
    dietaryRestrictions: 'Vegetarian, Gluten-free, and Halal options required',
    accessibilityNeeds: 'Step-free wheelchair access from ceremony lawn to dining pavilion',
    venueSetting: 'outdoor',
  },
  executiveSummary:
    'A high-end 150-guest celebration in Napa Valley balancing farm-to-table culinary courses, live ceremony strings, and illuminated lavender florals with a verified 6% contingency buffer.',
  budget: {
    totalBudget: 35000,
    currency: 'USD',
    contingencyAmount: 2100,
    summary:
      'Mathematically balanced across 7 core pillars with $2,100 contingency reserve for weather contingencies and sound overtime.',
    items: [
      {
        id: 'cat-venue',
        category: 'Venue & Grounds',
        allocatedAmount: 11200,
        percentage: 32,
        notes: 'Private estate lawn, historic arbor, bridal suite, lighting setup & clean-up fee',
        color: '#6D28D9',
      },
      {
        id: 'cat-catering',
        category: 'Catering & Craft Bar',
        allocatedAmount: 10500,
        percentage: 30,
        notes: 'Plated 3-course dinner, artisanal mocktails/cocktails, late-night gourmet snacks & service staff',
        color: '#22E5FF',
      },
      {
        id: 'cat-photo',
        category: 'Photography & Cinema',
        allocatedAmount: 4200,
        percentage: 12,
        notes: 'Full-day coverage, drone aerials, highlight reel, and raw gallery archive',
        color: '#A78BFA',
      },
      {
        id: 'cat-decor',
        category: 'Decor & Royal Florals',
        allocatedAmount: 3500,
        percentage: 10,
        notes: 'Floral arch, hanging greenery, lavender taper candles, table runners, and custom welcome signage',
        color: '#E879F9',
      },
      {
        id: 'cat-music',
        category: 'Music & Audio Experience',
        allocatedAmount: 2450,
        percentage: 7,
        notes: 'Ceremony string quartet and reception live DJ with wireless lavalier audio',
        color: '#F5C451',
      },
      {
        id: 'cat-attire',
        category: 'Attire, Styling & Favors',
        allocatedAmount: 1050,
        percentage: 3,
        notes: 'Foil-stamped invitations, digital RSVP hub, and custom artisanal honey jars',
        color: '#38BDF8',
      },
      {
        id: 'cat-contingency',
        category: 'Contingency Reserve',
        allocatedAmount: 2100,
        percentage: 6,
        notes: 'Emergency weather tent deposit, last-minute guest additions, overtime tip fund',
        color: '#94A3B8',
      },
    ],
  },
  timeline: {
    phases: [
      '10-12 Months Before',
      '4-6 Months Before',
      '2-3 Weeks Before',
      'Day-of Event',
    ],
    tasks: [
      {
        id: 'task-1',
        phase: '10-12 Months Before',
        timeOffset: '12 Months Before',
        title: 'Lock In Primary Estate Venue',
        description: 'Finalize contracts for Napa outdoor venue with rain contingency tent clause.',
        owner: 'Couple',
        priority: 'High',
        completed: true,
      },
      {
        id: 'task-2',
        phase: '10-12 Months Before',
        timeOffset: '10 Months Before',
        title: 'Book Lead Photographer & Videographer',
        description: 'Secure date with golden-hour portrait portfolio review.',
        owner: 'Couple',
        priority: 'High',
        completed: true,
      },
      {
        id: 'task-3',
        phase: '4-6 Months Before',
        timeOffset: '6 Months Before',
        title: 'Send Digital & Foil Save-the-Dates',
        description: 'Include travel recommendations and accessibility request fields.',
        owner: 'Couple',
        priority: 'Medium',
        completed: true,
      },
      {
        id: 'task-4',
        phase: '4-6 Months Before',
        timeOffset: '5 Months Before',
        title: 'Menu Tasting & Allergen Customization',
        description: 'Finalize plated courses ensuring gluten-free, vegan, and halal options are verified.',
        owner: 'Caterer',
        priority: 'High',
        completed: false,
      },
      {
        id: 'task-5',
        phase: '4-6 Months Before',
        timeOffset: '4 Months Before',
        title: 'Reserve Sound & Acoustic Strings',
        description: 'Confirm ceremony mic check and reception dance setlist with do-not-play list.',
        owner: 'Entertainment',
        priority: 'Medium',
        completed: false,
      },
      {
        id: 'task-6',
        phase: '2-3 Weeks Before',
        timeOffset: '3 Weeks Before',
        title: 'Submit Final Headcount & Seating Chart',
        description: 'Transmit verified dietary tags and table escort layout to venue lead.',
        owner: 'Couple',
        priority: 'High',
        completed: false,
      },
      {
        id: 'task-7',
        phase: 'Day-of Event',
        timeOffset: '8:00 AM',
        title: 'Bridal Suite & Morning Load-in',
        description: 'Champagne breakfast delivery and hair/makeup schedule kickoff.',
        owner: 'Coordinator',
        priority: 'High',
        completed: false,
      },
      {
        id: 'task-8',
        phase: 'Day-of Event',
        timeOffset: '4:30 PM',
        title: 'Ceremony Vows & String Prelude',
        description: 'Guests seated with chilled sparkling lavender water.',
        owner: 'Officiant',
        priority: 'High',
        completed: false,
      },
    ],
  },
  vendors: {
    vendors: [
      {
        id: 'v-1',
        category: 'Venue',
        vendorRole: 'Estate Venue & Grounds Lead',
        estimatedCostRange: '$10,000 - $12,500',
        questionsToAsk: [
          'What is the sound curfew for outdoor acoustic and amplified music?',
          'Is on-site liability insurance required for third-party bar staff?',
          'What is the backup tent plan in the event of unexpected heat or rain?',
        ],
        comparisonCriteria: [
          'Hours of load-in and teardown included',
          'Bridal suite access and private prep rooms',
          'Table and chair inventory included vs. rental surcharge',
        ],
        booked: true,
      },
      {
        id: 'v-2',
        category: 'Catering',
        vendorRole: 'Farm-to-Table Catering Lead',
        estimatedCostRange: '$9,500 - $11,500',
        questionsToAsk: [
          'Can you source 100% certified halal beef and gluten-free pastries?',
          'What is your server-to-guest ratio for a 150-person plated dinner?',
          'Are corkage and cake-cutting fees included in the baseline proposal?',
        ],
        comparisonCriteria: [
          'Fresh seasonal ingredient sourcing',
          'Included tableware, glassware, and linen tiers',
          'Tasting session availability prior to deposit',
        ],
        booked: false,
      },
      {
        id: 'v-3',
        category: 'Photography',
        vendorRole: 'Fine Art Photographer & Cinema Team',
        estimatedCostRange: '$3,800 - $4,800',
        questionsToAsk: [
          'Do you provide full print release rights and unwatermarked RAW or high-res files?',
          'Will you have a designated second shooter for simultaneous prep coverage?',
          'What is the expected turnaround time for sneak peeks vs. complete gallery?',
        ],
        comparisonCriteria: [
          'Natural lighting mastery during golden hour',
          'Backup gear protocol on-site',
          'Drone aerial permit capabilities',
        ],
        booked: false,
      },
      {
        id: 'v-4',
        category: 'Floral & Decor',
        vendorRole: 'Bespoke Florals & Installations Designer',
        estimatedCostRange: '$3,000 - $4,000',
        questionsToAsk: [
          'Can ceremony florals be repurposed for the sweetheart table and reception bar?',
          'How do you keep outdoor blooms fresh in direct sunlight throughout the day?',
          'Do you handle breakdown and post-event floral donation delivery?',
        ],
        comparisonCriteria: [
          'Eco-friendly foam-free installation techniques',
          'Vase rental package pricing',
          'Mockup centerpiece review prior to bulk floral order',
        ],
        booked: false,
      },
    ],
  },
  ideas: {
    themeDetails: {
      concept:
        'Deep royal violet and velvet plum linens accented by brushed champagne gold cutlery, floating warm fairy lights, and live olive branches.',
      colorPalette: ['#6D28D9', '#E879F9', '#F5C451', '#22E5FF', '#A78BFA'],
      decorElements: [
        'Curved neon glowing welcome arch with eucalyptus and orchids',
        'Full-length gilded Baroque mirror handwritten seating chart',
        'Smokeless 36-inch gold sparkler send-off corridor',
      ],
    },
    activities: [
      {
        title: 'Golden Hour Champagne Tower & Live Strings',
        description:
          'Synchronized transition from cocktail hour to reception marked by a five-tier coupe glass pour with live quartet anthems.',
        targetAudience: 'All Guests',
      },
      {
        title: 'Audio Guestbook in Vintage Telephone',
        description:
          'Guests leave heartfelt voice messages inside a retro phone booth illuminated by glowing warm neon backlighting.',
        targetAudience: 'Friends & Family',
      },
      {
        title: 'Evening Firepit S’mores & Artisan Coffee Bar',
        description:
          'Cozy late-night dessert lounge with handcrafted marshmallows, gourmet syrups, and oat milk cortados.',
        targetAudience: 'Late Night Crowd',
      },
    ],
    customMenu: {
      signatureCocktailMocktail:
        'The Royal Spark (Elderflower liqueur, sparkling prosecco, butterfly pea blossom syrup & gold leaf lemon wheel)',
      appetizers: [
        'Heirloom Tomato & Burrata Crostini with aged balsamic glaze',
        'Wild Mushroom Tartlets with thyme & truffle cream',
        'Prosciutto-Wrapped Mission Figs with goat cheese',
      ],
      mains: [
        'Rosemary Infused Braised Short Ribs over truffled celery root puree',
        'Pan-Seared Pacific Halibut with lemon-caper beurre blanc',
        'Herb-Roasted King Oyster Mushroom Steaks (Vegan & Halal)',
      ],
      dessert:
        'Two-tier Earl Grey lavender naked cake paired with seasonal berry pavlovas',
      dietaryNotes:
        '100% segregated prep for celiac guests; certified halal beef sourced from Sonoma Valley purveyor.',
    },
    moneySavingHacks: [
      {
        tip: 'Repurpose Ceremony Greenery at Reception',
        estimatedSavings: '$850',
        implementation:
          'Move the ground floral meadow arches behind the sweetheart table and bandstand after vows conclude.',
      },
      {
        tip: 'Tiered Display Cake + Sheet Cake Slices',
        estimatedSavings: '$500',
        implementation:
          'Order a compact 2-tier show cake for the ceremonial cut and serve matching sheet cakes from the bakery kitchen.',
      },
      {
        tip: 'Curated 2-Cocktail Signature Bar',
        estimatedSavings: '$1,200',
        implementation:
          'Serve two specialty craft drinks with local wines and IPAs instead of paying premium per-head rates for a 50-bottle bar.',
      },
    ],
  },
};
