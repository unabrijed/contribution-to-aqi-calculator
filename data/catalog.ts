// data/catalog.ts
// PM2.5 estimation methodology:
//   Cigarette/Bidi: tar_mg × 1.4 + nicotine_mg × 0.8 + paper_factor
//   Hookah: glycerin_pct × 3.2 + tobacco_pct × 4.5 + charcoal_factor
//   Vape: (vg × 0.012 + pg × 0.006 + nic × 0.1) × 150 puffs
//   Joint: tobacco_fraction × 45 + cannabis_fraction × 70
//   Source basis: WHO TobLabNet, ICMR 2019, Eissenberg et al. (2010), CDC

export interface Brand {
  id: string;
  name: string;
  variant: string;
  tar_mg: number | null;
  nicotine_mg: number | null;
  pm25: number;          // mg per unit (stick | session | joint)
  notes: string | null;
  tags: string[];
  company?: string;
  categoryId?: string;
}

export interface Company {
  id: string;
  label: string;
  country: string;
  accentColor: string;   // brand identity color for visual cards
  logoInitials: string;
  brands: Brand[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;          // emoji for visual identity
  unitLabel: string;
  description: string;
  bgClass: string;       // tailwind bg for category card
  accentHex: string;
  /** Typical use is indoors (e.g. hookah lounge); drives default PM2.5 exposure multiplier in the flow. */
  defaultIsIndoor: boolean;
  companies: Company[];
}

export const CATEGORIES: Category[] = [
  {
    id: "cigarette",
    label: "Cigarette",
    icon: "🚬",
    unitLabel: "sticks / day",
    description: "Standard filter and non-filter cigarettes",
    bgClass: "from-amber-950/60 to-ink-900",
    accentHex: "#e85d26",
    defaultIsIndoor: false,
    companies: [
      {
        id: "itc",
        label: "ITC Ltd",
        country: "India",
        accentColor: "#c9a84c",
        logoInitials: "ITC",
        brands: [
          { id: "gfk_kings",           name: "Gold Flake Kings",          variant: "Regular",      tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "India's best-selling cigarette. Filter tip.", tags: ["popular", "filter"] },
          { id: "gfk_premium_lights",  name: "Gold Flake Premium Lights", variant: "Lights",       tar_mg: 6,  nicotine_mg: 0.5, pm25: 9.5,  notes: "Ventilated filter: smokers often compensate by drawing harder.", tags: ["lights"] },
          { id: "gfk_superstar",       name: "Gold Flake Superstar",      variant: "Regular",      tar_mg: 11, nicotine_mg: 0.9, pm25: 16.7, notes: "Fuller blend than standard Kings.", tags: [] },
          { id: "classic_regular",     name: "Classic Regular",           variant: "Regular",      tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Premium ITC brand with cork-tip filter.", tags: ["premium"] },
          { id: "classic_milds",       name: "Classic Milds",             variant: "Lights",       tar_mg: 5,  nicotine_mg: 0.4, pm25: 8.1,  notes: "Ventilated filter dilutes smoke.", tags: ["lights"] },
          { id: "classic_ultra_milds", name: "Classic Ultra Milds",       variant: "Ultra Lights", tar_mg: 3,  nicotine_mg: 0.3, pm25: 5.4,  notes: "Heavily ventilated. Smokers typically compensate.", tags: ["ultra lights"] },
          { id: "wills_navy_cut",      name: "Wills Navy Cut",            variant: "Regular",      tar_mg: 12, nicotine_mg: 1.0, pm25: 17.8, notes: "One of India's oldest brands. Blended Virginia tobacco.", tags: ["heritage"] },
          { id: "four_square_special", name: "Four Square Special",       variant: "Regular",      tar_mg: 12, nicotine_mg: 0.9, pm25: 17.5, notes: "Economy tier, strong Virginia blend.", tags: ["economy"] },
          { id: "four_square_lights",  name: "Four Square Lights",        variant: "Lights",       tar_mg: 7,  nicotine_mg: 0.6, pm25: 10.7, notes: null, tags: ["lights"] },
          { id: "bristol",             name: "Bristol",                   variant: "Budget",       tar_mg: 14, nicotine_mg: 1.1, pm25: 20.9, notes: "Low-cost ITC brand. High tar relative to price.", tags: ["budget", "high tar"] },
          { id: "charms",              name: "Charms",                    variant: "Budget",       tar_mg: 15, nicotine_mg: 1.2, pm25: 22.4, notes: "Highest tar ITC entry. Rural market segment.", tags: ["budget", "strong"] },
          { id: "scissors",            name: "Scissors",                  variant: "Budget",       tar_mg: 13, nicotine_mg: 1.0, pm25: 19.2, notes: "Regional budget brand.", tags: ["budget", "regional"] },
        ],
      },
      {
        id: "pmi",
        label: "Philip Morris Intl",
        country: "Switzerland",
        accentColor: "#b91c1c",
        logoInitials: "PMI",
        brands: [
          { id: "marlboro_red",          name: "Marlboro Red",            variant: "Regular",        tar_mg: 12, nicotine_mg: 0.9, pm25: 17.5, notes: "World's best-selling cigarette.", tags: ["popular", "full"] },
          { id: "marlboro_gold",         name: "Marlboro Gold",           variant: "Lights",         tar_mg: 7,  nicotine_mg: 0.6, pm25: 10.7, notes: "Formerly 'Marlboro Lights'. Ventilated filter.", tags: ["lights"] },
          { id: "marlboro_silver",       name: "Marlboro Silver",         variant: "Ultra Lights",   tar_mg: 4,  nicotine_mg: 0.3, pm25: 6.5,  notes: "Compensation effect likely when drawing.", tags: ["ultra lights"] },
          { id: "marlboro_blue",         name: "Marlboro Blue",           variant: "Medium",         tar_mg: 9,  nicotine_mg: 0.7, pm25: 13.6, notes: "Mid-range between Red and Gold.", tags: [] },
          { id: "marlboro_menthol",      name: "Marlboro Menthol",        variant: "Menthol",        tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Menthol masks harshness: increases puffing frequency.", tags: ["menthol"] },
          { id: "iqos_heets_amber",      name: "IQOS HEETS Amber",        variant: "Heated Tobacco", tar_mg: null, nicotine_mg: 0.5, pm25: 3.2, notes: "Lower PM2.5 than combustion: but aerosol still contains particulate and toxicants.", tags: ["heated", "HNB"] },
          { id: "iqos_heets_yellow",     name: "IQOS HEETS Yellow",       variant: "Heated Light",   tar_mg: null, nicotine_mg: 0.3, pm25: 2.1, notes: "Still releases ultrafine particles into airways.", tags: ["heated", "HNB", "light"] },
        ],
      },
      {
        id: "bat",
        label: "British American Tobacco",
        country: "UK",
        accentColor: "#1d4ed8",
        logoInitials: "BAT",
        brands: [
          { id: "lucky_strike_original", name: "Lucky Strike Original",    variant: "Regular",        tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Heritage blend, now sold with filter.", tags: [] },
          { id: "lucky_strike_click",    name: "Lucky Strike Click & Roll", variant: "Menthol Capsule",tar_mg: 9,  nicotine_mg: 0.7, pm25: 13.8, notes: "Menthol capsule in filter. Very popular in India.", tags: ["menthol", "capsule"] },
          { id: "dunhill_fine_cut",      name: "Dunhill Fine Cut",          variant: "Regular",        tar_mg: 8,  nicotine_mg: 0.7, pm25: 12.4, notes: "Premium tier, fine-cut Virginia blend.", tags: ["premium"] },
          { id: "dunhill_lights",        name: "Dunhill Lights",            variant: "Lights",         tar_mg: 5,  nicotine_mg: 0.5, pm25: 8.1,  notes: null, tags: ["lights"] },
          { id: "pall_mall_red",         name: "Pall Mall Red",             variant: "Budget Regular", tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Economy international brand.", tags: ["economy"] },
        ],
      },
      {
        id: "jti",
        label: "Japan Tobacco Intl",
        country: "Japan",
        accentColor: "#059669",
        logoInitials: "JTI",
        brands: [
          { id: "camel_regular",  name: "Camel Regular",  variant: "Regular",        tar_mg: 12, nicotine_mg: 0.9, pm25: 17.5, notes: "Turkish and Virginia tobacco blend.", tags: [] },
          { id: "camel_blue",     name: "Camel Blue",     variant: "Lights",         tar_mg: 7,  nicotine_mg: 0.6, pm25: 10.7, notes: null, tags: ["lights"] },
          { id: "winston_red",    name: "Winston Red",    variant: "Regular",        tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Additive-free claim. Still full combustion product.", tags: [] },
          { id: "winston_blue",   name: "Winston Blue",   variant: "Lights",         tar_mg: 6,  nicotine_mg: 0.5, pm25: 9.5,  notes: null, tags: ["lights"] },
          { id: "ld_red",         name: "LD Red",         variant: "Budget Regular", tar_mg: 10, nicotine_mg: 0.8, pm25: 15.2, notes: "Value segment, widely available in India.", tags: ["economy"] },
        ],
      },
      {
        id: "regional_cig",
        label: "Regional / Independent",
        country: "India",
        accentColor: "#7c3aed",
        logoInitials: "REG",
        brands: [
          { id: "panama_regular", name: "Panama Regular",  variant: "Regular", tar_mg: 12, nicotine_mg: 0.9, pm25: 17.5, notes: "Popular in Maharashtra, Karnataka.", tags: ["regional"] },
          { id: "panama_lights",  name: "Panama Lights",   variant: "Lights",  tar_mg: 7,  nicotine_mg: 0.6, pm25: 10.7, notes: null, tags: ["lights", "regional"] },
          { id: "capstan",        name: "Capstan",         variant: "Regular", tar_mg: 13, nicotine_mg: 1.0, pm25: 19.2, notes: "Historic Indian brand. Strong Virginia blend.", tags: ["heritage"] },
          { id: "char_minar",     name: "Charminar",       variant: "Regular", tar_mg: 15, nicotine_mg: 1.2, pm25: 22.4, notes: "Strong Hyderabadi brand. High tar. Popular in AP/Telangana.", tags: ["strong", "regional"] },
          { id: "taj_chap",       name: "Taj Chap",        variant: "Budget",  tar_mg: 14, nicotine_mg: 1.1, pm25: 20.9, notes: "Northern India budget brand.", tags: ["budget", "regional"] },
        ],
      },
    ],
  },
  {
    id: "bidi",
    label: "Bidi",
    icon: "🌿",
    unitLabel: "sticks / day",
    description: "Hand-rolled Indian tobacco in tendu leaf",
    bgClass: "from-yellow-950/60 to-ink-900",
    accentHex: "#a16207",
    defaultIsIndoor: false,
    companies: [
      {
        id: "bidi_mfr",
        label: "Indian Manufacturers",
        country: "India",
        accentColor: "#a16207",
        logoInitials: "BDI",
        brands: [
          { id: "ganesh_bidi",    name: "Ganesh Bidi",           variant: "Standard", tar_mg: 20, nicotine_mg: 1.8, pm25: 31.2, notes: "Unfiltered tendu leaf wrap. Burns hotter than cigarettes. ICMR 2019.", tags: ["unfiltered", "popular"] },
          { id: "bidi_501",       name: "501 Bidi",              variant: "Standard", tar_mg: 22, nicotine_mg: 2.0, pm25: 34.4, notes: "One of the most widely consumed bidis in India.", tags: ["popular"] },
          { id: "mangalore_bidi", name: "Mangalore Ganesh Bidi", variant: "Standard", tar_mg: 18, nicotine_mg: 1.5, pm25: 27.8, notes: "Karnataka cooperative. Slightly smaller format.", tags: ["regional"] },
          { id: "pataka_bidi",    name: "Pataka Bidi",           variant: "Strong",   tar_mg: 24, nicotine_mg: 2.2, pm25: 37.5, notes: "Short format, concentrated combustion: highest PM2.5/stick.", tags: ["strong"] },
          { id: "kanchan_bidi",   name: "Kanchan Bidi",          variant: "Standard", tar_mg: 19, nicotine_mg: 1.6, pm25: 29.4, notes: "MP/UP market. Hand-rolled cooperative brand.", tags: ["regional"] },
        ],
      },
    ],
  },
  {
    id: "hookah",
    label: "Hookah / Shisha",
    icon: "💨",
    unitLabel: "sessions / day",
    description: "~60 min water-pipe session with natural charcoal",
    bgClass: "from-teal-950/60 to-ink-900",
    accentHex: "#0d9488",
    defaultIsIndoor: true,
    companies: [
      {
        id: "alfakher",
        label: "Al Fakher",
        country: "UAE",
        accentColor: "#0d9488",
        logoInitials: "ALF",
        brands: [
          { id: "alf_double_apple", name: "Double Apple",  variant: "Standard",           tar_mg: null, nicotine_mg: 0.5, pm25: 430, notes: "Most popular hookah flavour globally. 0.5% nicotine by weight.", tags: ["popular"] },
          { id: "alf_mint",         name: "Mint",          variant: "Mint / Menthol",     tar_mg: null, nicotine_mg: 0.5, pm25: 420, notes: "Mint masking leads to longer sessions and more exposure.", tags: ["mint"] },
          { id: "alf_grape",        name: "Grape",         variant: "Fruit",              tar_mg: null, nicotine_mg: 0.5, pm25: 428, notes: null, tags: ["fruit"] },
          { id: "alf_paan",         name: "Pan Raas",      variant: "Indian Speciality",  tar_mg: null, nicotine_mg: 0.5, pm25: 435, notes: "Pan/betel flavour. Popular in India.", tags: ["india"] },
        ],
      },
      {
        id: "starbuzz",
        label: "Starbuzz",
        country: "USA",
        accentColor: "#7c3aed",
        logoInitials: "SBZ",
        brands: [
          { id: "sb_blue_mist",  name: "Blue Mist",   variant: "Standard", tar_mg: null, nicotine_mg: 0.5, pm25: 455, notes: "Higher glycerin than Al Fakher → denser clouds → more PM2.5.", tags: ["dense"] },
          { id: "sb_code69",     name: "Code 69",     variant: "Premium",  tar_mg: null, nicotine_mg: 0.5, pm25: 460, notes: "Thicker cut. Longer sessions increase total exposure.", tags: ["premium"] },
        ],
      },
      {
        id: "adalya",
        label: "Adalya",
        country: "Turkey",
        accentColor: "#b91c1c",
        logoInitials: "ADL",
        brands: [
          { id: "adl_love66", name: "Love 66",  variant: "Fruit Blend", tar_mg: null, nicotine_mg: 0.5, pm25: 445, notes: "Strawberry-watermelon blend.", tags: ["fruit"] },
          { id: "adl_peach",  name: "Peach",    variant: "Fruit",       tar_mg: null, nicotine_mg: 0.5, pm25: 440, notes: null, tags: ["fruit"] },
        ],
      },
      {
        id: "herbal_hookah",
        label: "Herbal / Tobacco-free",
        country: "Global",
        accentColor: "#16a34a",
        logoInitials: "HRB",
        brands: [
          { id: "soex_herbal", name: "Soex Herbal", variant: "Tobacco-free", tar_mg: null, nicotine_mg: 0, pm25: 310, notes: "No tobacco, no nicotine: combustion still generates significant PM2.5. Not safe.", tags: ["tobacco-free"] },
        ],
      },
    ],
  },
  {
    id: "vape",
    label: "Vape / E-cig",
    icon: "☁️",
    unitLabel: "sessions / day",
    description: "~150 puff session. Wattage and liquid affect PM2.5.",
    bgClass: "from-blue-950/60 to-ink-900",
    accentHex: "#3b82f6",
    defaultIsIndoor: false,
    companies: [
      {
        id: "open_systems",
        label: "Open Systems / Box Mods",
        country: "Global",
        accentColor: "#3b82f6",
        logoInitials: "MOD",
        brands: [
          { id: "subohm_high_vg",  name: "Sub-ohm / High VG",      variant: "High Power",   tar_mg: null, nicotine_mg: 3,  pm25: 8.5, notes: "High VG ratio (70–80%), high wattage. Highest PM2.5 among vapes.", tags: ["cloud", "high power"] },
          { id: "standard_mod",    name: "Standard Box Mod",        variant: "Medium Power", tar_mg: null, nicotine_mg: 6,  pm25: 4.2, notes: "50/50 VG:PG. Lower aerosol density than sub-ohm.", tags: ["standard"] },
        ],
      },
      {
        id: "closed_pods",
        label: "Closed Pod Systems",
        country: "Global",
        accentColor: "#0ea5e9",
        logoInitials: "POD",
        brands: [
          { id: "juul_classic",  name: "JUUL Classic Tobacco", variant: "Nic Salt Pod", tar_mg: null, nicotine_mg: 18, pm25: 2.4, notes: "High nicotine salt delivery comparable to cigarettes. Low aerosol mass.", tags: ["nic salt", "popular"] },
          { id: "vuse_alto",     name: "Vuse Alto",            variant: "Pod",          tar_mg: null, nicotine_mg: 18, pm25: 2.8, notes: null, tags: ["pod"] },
        ],
      },
      {
        id: "disposables",
        label: "Disposables",
        country: "Global",
        accentColor: "#8b5cf6",
        logoInitials: "DIS",
        brands: [
          { id: "elfbar_600",  name: "Elf Bar 600",  variant: "Disposable", tar_mg: null, nicotine_mg: 20, pm25: 3.1, notes: "600 puff total = ~4 sessions. Popular in youth market.", tags: ["disposable"] },
          { id: "puff_bar",    name: "Puff Bar",     variant: "Disposable", tar_mg: null, nicotine_mg: 20, pm25: 2.9, notes: null, tags: ["disposable"] },
        ],
      },
    ],
  },
  {
    id: "cigar",
    label: "Cigar",
    icon: "🍂",
    unitLabel: "cigars / day",
    description: "Hand-rolled premium to machine-made cigarillos",
    bgClass: "from-orange-950/60 to-ink-900",
    accentHex: "#c2410c",
    defaultIsIndoor: false,
    companies: [
      {
        id: "premium_cigars",
        label: "Premium Hand-rolled",
        country: "Cuba / DR / Nicaragua",
        accentColor: "#c2410c",
        logoInitials: "PRE",
        brands: [
          { id: "cohiba_robusto",    name: "Cohiba Robusto",         variant: "Cuban Premium", tar_mg: null, nicotine_mg: 15, pm25: 340, notes: "~8g tobacco, ~40 min session.", tags: ["cuban", "premium"] },
          { id: "montecristo_no2",   name: "Montecristo No. 2",      variant: "Cuban Premium", tar_mg: null, nicotine_mg: 14, pm25: 310, notes: "Torpedo shape. ~7g tobacco.", tags: ["cuban", "premium"] },
          { id: "romeo_churchill",   name: "Romeo y Julieta Churchill", variant: "Cuban Premium", tar_mg: null, nicotine_mg: 16, pm25: 365, notes: "Large format ~60 min session.", tags: ["cuban", "premium", "large"] },
        ],
      },
      {
        id: "machine_cigars",
        label: "Machine-made",
        country: "Global",
        accentColor: "#78350f",
        logoInitials: "MAC",
        brands: [
          { id: "cafe_creme",     name: "Café Crème",       variant: "Cigarillo",    tar_mg: null, nicotine_mg: 4,  pm25: 95,  notes: "Small format ~2g tobacco, ~10 min session.", tags: ["cigarillo"] },
          { id: "backwoods_honey",name: "Backwoods Honey",  variant: "Blunt Wrap",   tar_mg: null, nicotine_mg: 8,  pm25: 185, notes: "Often used as blunt wrap. ~4g tobacco leaf.", tags: ["blunt wrap"] },
        ],
      },
    ],
  },
  {
    id: "joint",
    label: "Joint / Spliff",
    icon: "🌱",
    unitLabel: "joints / day",
    description: "Cannabis, tobacco-cannabis mix, or blunt",
    bgClass: "from-green-950/60 to-ink-900",
    accentHex: "#16a34a",
    defaultIsIndoor: false,
    companies: [
      {
        id: "joint_types",
        label: "Composition Types",
        country: "Global",
        accentColor: "#16a34a",
        logoInitials: "JNT",
        brands: [
          { id: "joint_pure",    name: "Pure Cannabis Joint",  variant: "100% Cannabis",       tar_mg: null, nicotine_mg: 0,   pm25: 68, notes: "Cannabis combustion produces more PM2.5/gram than tobacco. No nicotine.", tags: ["cannabis"] },
          { id: "spliff_5050",   name: "Spliff (50/50 mix)",   variant: "Tobacco + Cannabis",  tar_mg: 6,    nicotine_mg: 0.4, pm25: 55, notes: "Common European roll. Adds nicotine dependency on top of cannabis.", tags: ["mixed"] },
          { id: "blunt_cannabis",name: "Blunt",                variant: "Cannabis in tobacco wrap", tar_mg: null, nicotine_mg: 6, pm25: 90, notes: "Cigar wrap adds tobacco smoke to cannabis. Higher PM2.5 and nicotine.", tags: ["blunt"] },
        ],
      },
    ],
  },
  {
    id: "chillum",
    label: "Chillum",
    icon: "🏺",
    unitLabel: "sessions / day",
    description: "Direct-draw clay or stone pipe",
    bgClass: "from-stone-950/60 to-ink-900",
    accentHex: "#78716c",
    defaultIsIndoor: true,
    companies: [
      {
        id: "chillum_types",
        label: "Chillum Types",
        country: "India / South Asia",
        accentColor: "#78716c",
        logoInitials: "CHL",
        brands: [
          { id: "chillum_tobacco",  name: "Tobacco Chillum",         variant: "Pure Tobacco",      tar_mg: 18, nicotine_mg: 1.6, pm25: 62, notes: "No filter, direct draw. Hotter smoke concentration.", tags: ["tobacco"] },
          { id: "chillum_cannabis", name: "Cannabis Chillum (Chilam)", variant: "Cannabis / Ganja", tar_mg: null, nicotine_mg: 0, pm25: 75, notes: "Used in traditional contexts. Unfiltered cannabis combustion.", tags: ["cannabis"] },
          { id: "chillum_charas",   name: "Charas / Hash Chillum",   variant: "Hash Concentrate",  tar_mg: null, nicotine_mg: 0, pm25: 82, notes: "Hash burns hotter than cannabis flower → more particulate.", tags: ["hash"] },
        ],
      },
    ],
  },
  {
    id: "pipe",
    label: "Tobacco Pipe",
    icon: "🪵",
    unitLabel: "sessions / day",
    description: "Briar / meerschaum pipe, ~20 min session",
    bgClass: "from-red-950/60 to-ink-900",
    accentHex: "#991b1b",
    defaultIsIndoor: true,
    companies: [
      {
        id: "pipe_tobaccos",
        label: "Pipe Tobacco Blends",
        country: "Global",
        accentColor: "#991b1b",
        logoInitials: "PPE",
        brands: [
          { id: "dunhill_em",      name: "Dunhill Early Morning",  variant: "Virginia / Light",  tar_mg: 12, nicotine_mg: 1.1, pm25: 72,  notes: "~20 min, 2–3g tobacco. Light Virginia blend.", tags: ["virginia", "light"] },
          { id: "captain_black",   name: "Captain Black Regular",  variant: "Aromatic",          tar_mg: 14, nicotine_mg: 1.3, pm25: 86,  notes: "Aromatic casing causes re-lights → more combustion events.", tags: ["aromatic"] },
          { id: "orlik_golden",    name: "Orlik Golden Sliced",    variant: "Virginia Flake",    tar_mg: 16, nicotine_mg: 1.8, pm25: 101, notes: "Slow-burning flake. Extended 30–40 min sessions.", tags: ["flake", "strong"] },
        ],
      },
    ],
  },
];

// ─── Benchmarks ──────────────────────────────────────────────────────────────
export interface Benchmark {
  id: string;
  label: string;
  sublabel: string;
  unit: string;
  rate_mg_per_unit: number;
  emoji: string;
}

export const BENCHMARKS: Benchmark[] = [
  { id: "petrol_car",      label: "Petrol car",       sublabel: "city driving",      unit: "km",   rate_mg_per_unit: 230,   emoji: "🚗" },
  { id: "diesel_truck",    label: "Diesel truck",     sublabel: "highway",           unit: "km",   rate_mg_per_unit: 900,   emoji: "🚛" },
  { id: "old_2_wheeler",   label: "Old 2-wheeler",    sublabel: "BS3 city roads",    unit: "km",   rate_mg_per_unit: 150,   emoji: "🛵" },
  { id: "new_2_wheeler",   label: "New 2-wheeler",    sublabel: "BS6 emission norm", unit: "km",   rate_mg_per_unit: 25,    emoji: "🛵" },
  { id: "wood_chimney",    label: "Wood chimney",     sublabel: "hours burning",     unit: "hrs",  rate_mg_per_unit: 20000, emoji: "🏭" },
  { id: "agarbatti",       label: "Agarbatti",        sublabel: "incense sticks",    unit: "sticks", rate_mg_per_unit: 4.5, emoji: "🪔" },
];

// ─── PPI Scale ───────────────────────────────────────────────────────────────
export interface PPIBand {
  min: number;
  max: number;
  label: string;
  color: string;
  bg: string;
  desc: string;
}

export const PPI_BANDS: PPIBand[] = [
  { min: 0,   max: 50,  label: "Minimal",   color: "#22c55e", bg: "#052e16", desc: "Comparable to a few hours of city traffic." },
  { min: 51,  max: 100, label: "Moderate",  color: "#84cc16", bg: "#1a2e05", desc: "Equivalent to driving a petrol car several hundred kilometres." },
  { min: 101, max: 150, label: "Elevated",  color: "#eab308", bg: "#1c1508", desc: "More PM2.5 than a truck on a long highway run." },
  { min: 151, max: 200, label: "High",      color: "#f97316", bg: "#1c0a03", desc: "Competing with an old two-wheeler's full year of city riding." },
  { min: 201, max: 300, label: "Very high", color: "#ef4444", bg: "#1c0505", desc: "You're generating the equivalent of days of a wood-burning chimney." },
  { min: 301, max: 500, label: "Hazardous", color: "#dc2626", bg: "#150202", desc: "Your lungs absorb what a chimney pushes into a neighbourhood. Every year." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function calcPPI(annualGrams: number): number {
  const g = annualGrams;
  if (g <= 0)  return 0;
  if (g < 1)   return Math.round(g * 10);
  if (g < 5)   return Math.round(10 + (g - 1) * 10);
  if (g < 20)  return Math.round(50 + (g - 5) * 3.33);
  if (g < 50)  return Math.round(100 + (g - 20) * 1.67);
  if (g < 100) return Math.round(150 + (g - 50));
  if (g < 200) return Math.round(200 + (g - 100));
  return Math.min(500, Math.round(300 + (g - 200) * 0.67));
}

export function getPPIBand(score: number): PPIBand {
  return PPI_BANDS.find(b => score >= b.min && score <= b.max) ?? PPI_BANDS[PPI_BANDS.length - 1];
}

export function getAllBrands(): (Brand & { company: string; companyId: string; categoryId: string; categoryLabel: string })[] {
  return CATEGORIES.flatMap(cat =>
    cat.companies.flatMap(co =>
      co.brands.map(b => ({ ...b, company: co.label, companyId: co.id, categoryId: cat.id, categoryLabel: cat.label }))
    )
  );
}
