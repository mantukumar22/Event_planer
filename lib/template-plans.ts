/**
 * @file lib/template-plans.ts
 * @description Single responsibility: Deterministic rule-based template plans for weddings, birthdays,
 * and community gatherings when MOCK_AI=true or when Gemini API fails gracefully.
 */

import { EventPlan, IntakeFormData } from './schemas';
import { normalizeBudgetItems } from './budget-math';

export function generateTemplatePlan(intake: IntakeFormData, isFallback = false): EventPlan {
  const total = intake.totalBudget;
  const currency = intake.currency;
  const guestCount = intake.guestCount;

  if (intake.eventType === 'wedding') {
    const contingency = Math.round(total * 0.07);
    const rawItems = [
      {
        id: 'venue-grounds',
        category: 'Venue & Grounds',
        allocatedAmount: Math.round(total * 0.32),
        percentage: 32,
        notes: intake.venueSetting === 'outdoor'
          ? 'Includes rain backup tent clause and 10 hours of grounds access.'
          : 'Ballroom rental with tables, chairs, and standard setup/teardown.',
        color: '#6D28D9',
        isPerGuest: false,
      },
      {
        id: 'catering-bar',
        category: 'Catering & Craft Bar',
        allocatedAmount: Math.round(total * 0.33),
        percentage: 33,
        notes: `Plated service tailored for ${guestCount} guests (${intake.dietaryRestrictions || 'Standard menu'}).`,
        color: '#22E5FF',
        isPerGuest: true,
      },
      {
        id: 'photo-video',
        category: 'Photography & Cinema',
        allocatedAmount: Math.round(total * 0.12),
        percentage: 12,
        notes: 'Full-day documentary coverage with golden-hour portraits and raw archives.',
        color: '#A78BFA',
        isPerGuest: false,
      },
      {
        id: 'decor-floral',
        category: 'Decor & Royal Florals',
        allocatedAmount: Math.round(total * 0.09),
        percentage: 9,
        notes: `Custom floral arch, table arrangements matching vibe: ${intake.themeVibe}.`,
        color: '#E879F9',
        isPerGuest: false,
      },
      {
        id: 'music-audio',
        category: 'Music & Audio Experience',
        allocatedAmount: Math.round(total * 0.07),
        percentage: 7,
        notes: 'Ceremony acoustic strings + reception live DJ with wireless lapel audio.',
        color: '#F5C451',
        isPerGuest: false,
      },
      {
        id: 'contingency-fund',
        category: 'Contingency Reserve',
        allocatedAmount: contingency,
        percentage: 7,
        notes: 'Dedicated 7% safety net for overtime fees, weather measures, or last-minute RSVPs.',
        color: '#94A3B8',
        isPerGuest: false,
      },
    ];

    const normalized = normalizeBudgetItems(rawItems, total);

    return {
      id: `wedding-plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intake,
      isTemplateFallback: isFallback,
      executiveSummary: `An elegant royal wedding celebration in ${intake.location} for ${guestCount} guests, featuring bespoke catering, cinematic photo coverage, and verified budget allocations.`,
      assumptions: [
        `Assumed 65% of the total budget is dedicated to the core venue and catering experience for ${guestCount} guests.`,
        `Assumed a 6-hour evening event timeline with setup starting 3 hours prior to guest arrival.`,
        `Assumed standard vendor meal provisions for 4 contracted event professionals.`,
        `Allocated a 7% non-negotiable contingency buffer ($${contingency.toLocaleString()}) for weather contingencies.`,
      ],
      budget: {
        totalBudget: total,
        currency,
        contingencyAmount: contingency,
        summary: `Financially balanced wedding framework centered on memorable hospitality for ${guestCount} attendees.`,
        items: normalized,
      },
      timeline: {
        phases: [
          '9-12 Months Before (Foundation)',
          '4-6 Months Before (Vendors & Details)',
          '2-4 Weeks Before (Final Polish)',
          'Day-of Event (Run of Show)',
        ],
        tasks: [
          {
            id: 'task-1',
            phase: '9-12 Months Before (Foundation)',
            timeOffset: '12 Months Before',
            title: 'Secure Primary Ceremony & Reception Venue',
            description: `Lock in date (${intake.eventDate}) in ${intake.location} with weather contingency deposit.`,
            owner: 'Couple',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-2',
            phase: '9-12 Months Before (Foundation)',
            timeOffset: '10 Months Before',
            title: 'Book Lead Photographer & Videographer',
            description: 'Sign contract ensuring full image release rights and drone aerial footage.',
            owner: 'Couple',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-3',
            phase: '4-6 Months Before (Vendors & Details)',
            timeOffset: '5 Months Before',
            title: 'Schedule Menu Tasting & Allergen Review',
            description: `Confirm accommodations for dietary needs: ${intake.dietaryRestrictions || 'None specified'}.`,
            owner: 'Caterer',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-4',
            phase: '4-6 Months Before (Vendors & Details)',
            timeOffset: '4 Months Before',
            title: 'Finalize Entertainment & Ceremony Prelude',
            description: 'Transmit custom playlist, processional song, and do-not-play list to DJ.',
            owner: 'Entertainment',
            priority: 'Medium',
            completed: false,
          },
          {
            id: 'task-5',
            phase: '2-4 Weeks Before (Final Polish)',
            timeOffset: '3 Weeks Before',
            title: 'Submit Final Headcount & Seating Chart',
            description: `Provide verified headcount of ${guestCount} guests and escort card layout to caterer.`,
            owner: 'Couple',
            priority: 'High',
            completed: false,
          },
        ],
        dayOfSchedule: [
          { time: '09:00 AM', activity: 'Bridal Suite & Groomsmen Morning Load-in', owner: 'Wedding Party', notes: 'Light breakfast delivery and hair/makeup setup.' },
          { time: '01:30 PM', activity: 'Floral & Decor Installation', owner: 'Florist', notes: 'Arch setup and centerpiece placement.' },
          { time: '03:30 PM', activity: 'First Look & Pre-Ceremony Portraits', owner: 'Photographer', notes: 'Private moment and immediate family photos.' },
          { time: '05:00 PM', activity: 'Guest Arrival & Prelude Music', owner: 'Coordinator', notes: 'Welcome drinks served.' },
          { time: '05:30 PM', activity: 'Ceremony Vows & Exchange of Rings', owner: 'Officiant', notes: 'Live strings processional.' },
          { time: '06:15 PM', activity: 'Cocktail Hour & Passed Canapés', owner: 'Caterer', notes: 'Signature mocktail and cocktail service.' },
          { time: '07:30 PM', activity: 'Grand Entrance & Plated Dinner', owner: 'DJ / MC', notes: 'Welcome speeches and first toasts.' },
          { time: '09:00 PM', activity: 'Dance Floor Kickoff & Cake Cut', owner: 'DJ / MC', notes: 'Party open to all guests.' },
          { time: '11:00 PM', activity: 'Grand Send-Off & Teardown Load-out', owner: 'Coordinator', notes: 'Sparkler corridor and vendor departure.' },
        ],
      },
      vendors: {
        vendors: [
          {
            id: 'v-venue',
            category: 'Venue & Grounds',
            vendorRole: 'Estate Venue Coordinator',
            estimatedCostRange: `$${Math.round(total * 0.28).toLocaleString()} - $${Math.round(total * 0.35).toLocaleString()}`,
            questionsToAsk: [
              'What are the explicit sound curfew rules for amplified music?',
              'Is professional third-party day-of event insurance required?',
              'What is the rain tent backup protocol in case of inclement weather?',
            ],
            comparisonCriteria: [
              'Setup and teardown window hours included',
              'Table, chair, and linen rental packages included',
            ],
            booked: false,
          },
          {
            id: 'v-caterer',
            category: 'Catering & Bar',
            vendorRole: 'Executive Event Caterer',
            estimatedCostRange: `$${Math.round(total * 0.3).toLocaleString()} - $${Math.round(total * 0.36).toLocaleString()}`,
            questionsToAsk: [
              `How do you manage dietary allergies (${intake.dietaryRestrictions || 'None specified'}) during simultaneous plated service?`,
              'What is your staff-to-guest ratio for 100+ guests?',
              'Are cake-cutting fees and bar glassware rentals bundled?',
            ],
            comparisonCriteria: [
              'Seasonal ingredient sourcing',
              'Included bar mixer packages and tasting appointment policy',
            ],
            booked: false,
          },
          {
            id: 'v-photo',
            category: 'Photography & Cinema',
            vendorRole: 'Lead Visual Artist',
            estimatedCostRange: `$${Math.round(total * 0.1).toLocaleString()} - $${Math.round(total * 0.14).toLocaleString()}`,
            questionsToAsk: [
              'Do we receive unwatermarked high-resolution images with full reproduction rights?',
              'What backup gear and on-site dual-card recording protocols do you maintain?',
            ],
            comparisonCriteria: [
              'Golden-hour outdoor lighting mastery',
              'Turnaround timeline for highlight sneaks vs. complete album',
            ],
            booked: false,
          },
        ],
      },
      ideas: {
        themeDetails: {
          concept: `Royal Garden Elegance with glowing ambient lanterns and velvet accents inspired by ${intake.themeVibe}.`,
          colorPalette: ['#6D28D9', '#E879F9', '#F5C451', '#22E5FF', '#A78BFA'],
          decorElements: [
            'Curved glowing neon welcome arch with cascading eucalyptus',
            'Floating candles and brushed gold flatware',
            'Custom laser-cut wooden nameplates on raw linen napkins',
          ],
        },
        activities: [
          { title: 'Golden Hour Champagne Tower', description: 'Synchronized five-tier coupe pour kickstarting the reception.', targetAudience: 'All Guests' },
          { title: 'Audio Guestbook Phone', description: 'Guests record warm audio messages inside a retro payphone booth.', targetAudience: 'Friends & Family' },
        ],
        customMenu: {
          signatureCocktailMocktail: 'The Royal Velvet (Butterfly pea gin, sparkling elderflower & gold dust)',
          appetizers: ['Wild mushroom tartlets with truffle cream', 'Prosciutto wrapped mission figs'],
          mains: ['Braised prime short ribs over celery root puree', 'Pan-roasted king oyster steaks (vegan/halal)'],
          dessert: 'Earl Grey lavender two-tier cake with berry coulis',
          dietaryNotes: intake.dietaryRestrictions || 'Comprehensive allergen accommodations verified.',
        },
        moneySavingHacks: [
          { tip: 'Repurpose Ceremony Greenery', estimatedSavings: '$700', implementation: 'Relocate the ceremony floral meadow behind the sweetheart table for the reception.' },
          { tip: 'Two-Tier Show Cake + Sheet Cake', estimatedSavings: '$450', implementation: 'Display a stunning 2-tier centerpiece cake and slice identical bakery sheet cakes in the kitchen.' },
        ],
      },
    };
  }

  if (intake.eventType === 'birthday') {
    const contingency = Math.round(total * 0.08);
    const isKids = intake.birthdayAgeGroup === 'kids' || (intake.celebrantAge && intake.celebrantAge < 13);
    const rawItems = [
      {
        id: 'venue-space',
        category: 'Venue & Activity Space',
        allocatedAmount: Math.round(total * 0.35),
        percentage: 35,
        notes: isKids ? 'Indoor play park or shaded park pavilion with clean restrooms.' : 'Rooftop lounge or private dining room.',
        color: '#6D28D9',
        isPerGuest: false,
      },
      {
        id: 'catering-bites',
        category: 'Food, Drinks & Dessert',
        allocatedAmount: Math.round(total * 0.32),
        percentage: 32,
        notes: `Festive menu and custom themed birthday cake for ${guestCount} guests.`,
        color: '#22E5FF',
        isPerGuest: true,
      },
      {
        id: 'entertainment-games',
        category: 'Entertainment & Activities',
        allocatedAmount: Math.round(total * 0.15),
        percentage: 15,
        notes: isKids ? 'Interactive game host, face painter, or bounce obstacle.' : 'DJ and customized trivia host.',
        color: '#F5C451',
        isPerGuest: false,
      },
      {
        id: 'decor-favors',
        category: 'Themed Decor & Favors',
        allocatedAmount: Math.round(total * 0.1),
        percentage: 10,
        notes: `Custom balloon garland, banners, and bespoke takeaway favor packs.`,
        color: '#E879F9',
        isPerGuest: true,
      },
      {
        id: 'contingency-fund',
        category: 'Contingency Reserve',
        allocatedAmount: contingency,
        percentage: 8,
        notes: 'Buffer for extra snack replenishment or overtime fee.',
        color: '#94A3B8',
        isPerGuest: false,
      },
    ];

    const normalized = normalizeBudgetItems(rawItems, total);

    return {
      id: `birthday-plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intake,
      isTemplateFallback: isFallback,
      executiveSummary: `An unforgettable birthday celebration for ${guestCount} guests designed around high-energy entertainment, curated treats, and seamless coordination.`,
      assumptions: [
        `Assumed a 3-to-4 hour focused celebration window with concentrated guest energy.`,
        `Assumed food and dessert portions calibrated specifically for ${guestCount} attendees with ${isKids ? 'kids and adult grazing options' : 'cocktail-style small bites'}.`,
        `Assumed cleanup can be completed in 45 minutes following final activity.`,
      ],
      budget: {
        totalBudget: total,
        currency,
        contingencyAmount: contingency,
        summary: `Value-maximized birthday budget prioritizing interactive entertainment and signature food.`,
        items: normalized,
      },
      timeline: {
        phases: ['6 Weeks Before', '3 Weeks Before', 'Final Week', 'Day-of Schedule'],
        tasks: [
          {
            id: 'task-1',
            phase: '6 Weeks Before',
            timeOffset: '6 Weeks Before',
            title: 'Reserve Venue Space & Entertainment Lead',
            description: 'Confirm date, deposit, and access hours.',
            owner: 'Host',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-2',
            phase: '3 Weeks Before',
            timeOffset: '3 Weeks Before',
            title: 'Order Custom Cake & Send Invites',
            description: `Verify dietary needs: ${intake.dietaryRestrictions || 'None specified'}.`,
            owner: 'Host',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-3',
            phase: 'Final Week',
            timeOffset: '4 Days Before',
            title: 'Assemble Favor Packs & Playlist',
            description: 'Pack themed takeaway items and confirm playlist.',
            owner: 'Host',
            priority: 'Medium',
            completed: false,
          },
          {
            id: 'task-4',
            phase: 'Final Week',
            timeOffset: '1 Day Before',
            title: 'Pick Up Party Supplies & Ice',
            description: 'Stage balloons, coolers, and serving trays.',
            owner: 'Host',
            priority: 'High',
            completed: false,
          },
          {
            id: 'task-5',
            phase: 'Day-of Schedule',
            timeOffset: 'Day-of',
            title: 'Welcome Guests & Kickoff Games',
            description: 'Direct guests to activity stations.',
            owner: 'Host',
            priority: 'High',
            completed: false,
          },
        ],
        dayOfSchedule: [
          { time: '01:00 PM', activity: 'Host Arrival & Decor Setup', owner: 'Host', notes: 'Hang banners, inflate balloons, set tables.' },
          { time: '02:00 PM', activity: 'Guests Arrive & Welcome Refreshments', owner: 'Host', notes: 'Background music and welcome station.' },
          { time: '02:30 PM', activity: 'Featured Interactive Entertainment / Games', owner: 'Activity Lead', notes: 'Group tournament or kids obstacle run.' },
          { time: '03:45 PM', activity: 'Cake Presentation & Birthday Song', owner: 'Host', notes: 'Candles, wishes, and group photos.' },
          { time: '04:15 PM', activity: 'Gift Opening / Dance Cypher / Free Play', owner: 'Host', notes: 'Distribute party favors as guests depart.' },
          { time: '05:00 PM', activity: 'Venue Pack-down & Teardown', owner: 'Host', notes: 'Trash removal and deposit return check.' },
        ],
      },
      vendors: {
        vendors: [
          {
            id: 'v-bakery',
            category: 'Bakery & Cake',
            vendorRole: 'Custom Cake Designer',
            estimatedCostRange: `$${Math.round(total * 0.08).toLocaleString()} - $${Math.round(total * 0.12).toLocaleString()}`,
            questionsToAsk: [
              'Do you offer nut-free/gluten-free certified preparation?',
              'Can you deliver and stage the cake directly at the venue?',
            ],
            comparisonCriteria: ['Portfolio realism in theme fondant', 'Included delivery staging'],
            booked: false,
          },
          {
            id: 'v-entertainment',
            category: 'Entertainment',
            vendorRole: 'Live Activity Host',
            estimatedCostRange: `$${Math.round(total * 0.12).toLocaleString()} - $${Math.round(total * 0.18).toLocaleString()}`,
            questionsToAsk: [
              'What audio equipment and game props are included in the hourly package?',
              'What is your cancellation/weather reschedule policy?',
            ],
            comparisonCriteria: ['Energy reviews and liability insurance'],
            booked: false,
          },
          {
            id: 'v-catering',
            category: 'Catering',
            vendorRole: 'Party Food Purveyor',
            estimatedCostRange: `$${Math.round(total * 0.25).toLocaleString()} - $${Math.round(total * 0.32).toLocaleString()}`,
            questionsToAsk: [
              'Do you provide self-contained heating chafers and serving utensils?',
              'What are your minimum order lead times?',
            ],
            comparisonCriteria: ['Portion generosity and dietary labels'],
            booked: false,
          },
        ],
      },
      ideas: {
        themeDetails: {
          concept: `Vibrant High-Energy Celebration: ${intake.themeVibe}.`,
          colorPalette: ['#22E5FF', '#F5C451', '#E879F9', '#6D28D9'],
          decorElements: ['Glowing neon balloon arch', 'Custom photo photo-booth backdrop'],
        },
        activities: [
          { title: 'Interactive Scavenger Challenge', description: 'Timed hunt with team clues and custom medals.', targetAudience: 'All Guests' },
          { title: 'Signature Glow Cypher', description: 'Glow-stick accessories handed out for the final countdown dance.', targetAudience: 'Everyone' },
        ],
        customMenu: {
          signatureCocktailMocktail: isKids ? 'Galaxy Punch (Blueberry lemonade with starfruit garnish)' : 'Midnight Citrus Fizz',
          appetizers: ['Crispy slider bites', 'Artisan veggie cones with dip'],
          mains: ['Personalized flatbreads', 'Gourmet mac & cheese bar'],
          dessert: 'Confetti birthday cake with sparkler candles',
          dietaryNotes: intake.dietaryRestrictions || 'Clearly labeled nut-free and vegetarian choices.',
        },
        moneySavingHacks: [
          { tip: 'DIY Balloon Garland with Electric Pump', estimatedSavings: '$250', implementation: 'Order wholesale balloon kits and inflate with a portable pump in 45 mins.' },
        ],
      },
    };
  }

  // Community gathering / Fundraiser / Block Party
  const contingency = Math.round(total * 0.1);
  const rawItems = [
    {
      id: 'permits-city',
      category: 'Permits, Insurance & City Fees',
      allocatedAmount: Math.round(total * 0.18),
      percentage: 18,
      notes: 'Street closure permit, municipal sound permits, and event liability insurance.',
      color: '#6D28D9',
      isPerGuest: false,
    },
    {
      id: 'equipment-rentals',
      category: 'Stage, Power & Waste Logistics',
      allocatedAmount: Math.round(total * 0.28),
      percentage: 28,
      notes: 'Generators, pop-up shade canopies, ADA-compliant portable restrooms, and recycling bins.',
      color: '#22E5FF',
      isPerGuest: false,
    },
    {
      id: 'food-refreshments',
      category: 'Community Food & Hydration',
      allocatedAmount: Math.round(total * 0.24),
      percentage: 24,
      notes: `Bulk hydration station and local food trucks/catering for ${guestCount} community members.`,
      color: '#34D399',
      isPerGuest: true,
    },
    {
      id: 'local-talent',
      category: 'Community Talent & Audio',
      allocatedAmount: Math.round(total * 0.12),
      percentage: 12,
      notes: 'Local acoustic musicians, high-school jazz ensemble honorarium, and PA sound system.',
      color: '#F5C451',
      isPerGuest: false,
    },
    {
      id: 'signage-volunteer',
      category: 'Signage, Badges & Volunteer Kits',
      allocatedAmount: Math.round(total * 0.08),
      percentage: 8,
      notes: 'Directional maps, volunteer t-shirts, safety vests, and information booth banners.',
      color: '#E879F9',
      isPerGuest: false,
    },
    {
      id: 'contingency-fund',
      category: 'Contingency Reserve',
      allocatedAmount: contingency,
      percentage: 10,
      notes: '10% dedicated community safety reserve for emergency rentals or extra supplies.',
      color: '#94A3B8',
      isPerGuest: false,
    },
  ];

  const normalized = normalizeBudgetItems(rawItems, total);

  return {
    id: `community-plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    intake,
    isTemplateFallback: isFallback,
    executiveSummary: `A civic and inclusive community event in ${intake.location} designed for ${guestCount} attendees, balancing municipal safety permits, volunteer coordination, and local cultural programming.`,
    assumptions: [
      `Assumed municipal street closure and park permits submitted at least 45 days in advance.`,
      `Assumed a 10:1 ratio of attendees to volunteer coverage (approximately ${Math.max(4, Math.round(guestCount / 20))} volunteers required).`,
      `Assumed full ADA accessibility with ground-level wheelchair paths and sensory-friendly rest areas.`,
      `Allocated 10% contingency ($${contingency.toLocaleString()}) for city inspector adjustments or weather shielding.`,
    ],
    budget: {
      totalBudget: total,
      currency,
      contingencyAmount: contingency,
      summary: `Compliant, safe, and community-centered budget allocation emphasizing logistics, permits, and local talent.`,
      items: normalized,
    },
    timeline: {
      phases: ['8-12 Weeks Before (Permits)', '4 Weeks Before (Logistics)', '1 Week Before (Volunteers)', 'Event Day Schedule'],
      tasks: [
        {
          id: 'task-1',
          phase: '8-12 Weeks Before (Permits)',
          timeOffset: '10 Weeks Before',
          title: 'Submit City Street Closure & Sound Permit Applications',
          description: `Submit map routes and sound decibel limits to ${intake.location} city clerk.`,
          owner: 'Logistics Lead',
          priority: 'High',
          completed: false,
        },
        {
          id: 'task-2',
          phase: '8-12 Weeks Before (Permits)',
          timeOffset: '8 Weeks Before',
          title: 'Secure Event Liability Insurance with City Added as Insured',
          description: 'Obtain $1M/$2M general liability certificate.',
          owner: 'Logistics Lead',
          priority: 'High',
          completed: false,
        },
        {
          id: 'task-3',
          phase: '4 Weeks Before (Logistics)',
          timeOffset: '4 Weeks Before',
          title: 'Confirm ADA Restroom & Generator Drop-offs',
          description: 'Schedule morning drop-off and evening retrieval times.',
          owner: 'Operations Lead',
          priority: 'High',
          completed: false,
        },
        {
          id: 'task-4',
          phase: '1 Week Before (Volunteers)',
          timeOffset: '5 Days Before',
          title: 'Host Volunteer Orientation & Safety Briefing',
          description: 'Assign check-in shifts, first-aid tent stations, and emergency radio channels.',
          owner: 'Volunteer Coordinator',
          priority: 'High',
          completed: false,
        },
        {
          id: 'task-5',
          phase: 'Event Day Schedule',
          timeOffset: 'Event Day',
          title: 'Conduct Morning Safety Walkthrough with City Officials',
          description: 'Inspect barrier tape, fire hydrant clearances, and signage.',
          owner: 'Safety Lead',
          priority: 'High',
          completed: false,
        },
      ],
      dayOfSchedule: [
        { time: '07:00 AM', activity: 'Street Closure & Barricade Staging', owner: 'Logistics Team', notes: 'Deploy certified traffic cones and road closed signs.' },
        { time: '08:30 AM', activity: 'Power, Audio & Canopy Setup', owner: 'Sound Tech', notes: 'Power up quiet inverter generators and stage microphones.' },
        { time: '09:30 AM', activity: 'Volunteer Check-in & Radio Distribution', owner: 'Volunteer Lead', notes: 'Safety vest hand-out and role assignments.' },
        { time: '10:00 AM', activity: 'Event Gates Open to Neighborhood', owner: 'All Staff', notes: 'Music begins; information booth active.' },
        { time: '11:30 AM', activity: 'Local Band / Community Showcase', owner: 'Stage Lead', notes: 'Performances by neighborhood youth and civic leaders.' },
        { time: '01:00 PM', activity: 'Civic Remarks & Community Honors', owner: 'Council / Host', notes: 'Acknowledge community sponsors and volunteers.' },
        { time: '04:00 PM', activity: 'Event Wrap-Up & Volunteer Clean Sweep', owner: 'All Staff', notes: 'Recycling sorting, trash collection, and teardown.' },
        { time: '06:00 PM', activity: 'Barricade Removal & Street Re-Opening', owner: 'Logistics Lead', notes: 'Verify street is pristine before municipal reopen.' },
      ],
    },
    vendors: {
      vendors: [
        {
          id: 'v-permits',
          category: 'Permits & Municipal',
          vendorRole: 'City Department of Special Events',
          estimatedCostRange: `$${Math.round(total * 0.12).toLocaleString()} - $${Math.round(total * 0.18).toLocaleString()}`,
          questionsToAsk: [
            'What is the cutoff deadline for submitting neighborhood traffic detour notifications?',
            'Are on-site licensed security guards mandated for our headcount?',
          ],
          comparisonCriteria: ['Compliance timeline and inspection milestones'],
          booked: false,
        },
        {
          id: 'v-restrooms',
          category: 'Sanitation & Logistics',
          vendorRole: 'Event Sanitation & Power Provider',
          estimatedCostRange: `$${Math.round(total * 0.2).toLocaleString()} - $${Math.round(total * 0.28).toLocaleString()}`,
          questionsToAsk: [
            'Are handwashing units and ADA wheelchair ramps included?',
            'What is your rapid response time if a unit requires mid-event servicing?',
          ],
          comparisonCriteria: ['ADA compliance specifications and delivery flexibility'],
          booked: false,
        },
        {
          id: 'v-audio',
          category: 'Audio & Stage',
          vendorRole: 'Community Sound Production',
          estimatedCostRange: `$${Math.round(total * 0.1).toLocaleString()} - $${Math.round(total * 0.15).toLocaleString()}`,
          questionsToAsk: [
            'Can your PA system run entirely on portable battery/inverter power without excessive noise?',
            'Do you have multiple wireless handheld mics for community speakers?',
          ],
          comparisonCriteria: ['Clarity and sound dispersion capabilities across outdoor lawn'],
          booked: false,
        },
      ],
    },
    ideas: {
      themeDetails: {
        concept: `Inclusive Neighborhood Unity: ${intake.themeVibe}.`,
        colorPalette: ['#34D399', '#22E5FF', '#F5C451', '#6D28D9'],
        decorElements: ['Bilingual directional banners', 'Community art chalk corridor', 'Shaded accessibility rest tent'],
      },
      activities: [
        { title: 'Community Mural Canvas', description: 'Collaborative painted wooden canvas installed permanently in neighborhood park.', targetAudience: 'All Ages' },
        { title: 'Neighborhood Storytelling Corner', description: 'Local elders and youth share neighborhood history over iced tea.', targetAudience: 'Multi-generational' },
      ],
      customMenu: {
        signatureCocktailMocktail: 'Neighborhood Citrus Quencher (Local strawberry mint lemonade)',
        appetizers: ['Chilled watermelon slices', 'Fresh baked community pretzel bites'],
        mains: ['Local food truck vouchers', 'Veggie and halal street taco bar'],
        dessert: 'Artisan popsicles and local bakery cookies',
        dietaryNotes: intake.dietaryRestrictions || 'Certified allergen-free and plant-based zones available.',
      },
      moneySavingHacks: [
        { tip: 'Partner with Local Business Sponsors', estimatedSavings: '$1,500', implementation: 'Offer banner logo placement in exchange for donated water, printing, or tent loans.' },
        { tip: 'High School Volunteer Service Hours', estimatedSavings: '$800', implementation: 'Partner with school honor societies to provide student community service hours for set-up.' },
      ],
    },
  };
}
