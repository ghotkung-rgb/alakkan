const ROV_BASE   = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/ROV';
const FF_BASE    = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/FREEFIRE';
const PUBGM_BASE = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/PUBGM';

export const GAMES = {

  // ══════════════════════════════════════════
  //  เกม MOBA
  // ══════════════════════════════════════════

  ROV: {
    id: 'ROV',
    name: 'ROV',
    subtitle: 'Realm of Valor — เติมคูปอง',
    icon: '/images/GAMES ICON/ROV_iconapp.png',
    bg: '/images/GAMES BG/ROV_bg.png',
    category: 'เกม MOBA',
    currency: 'คูปอง',
    tags: ['โปรโมชั่น', 'ขายดี'],
    packages: [
      { id: 1,  amount: 11,   price: 10,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 2,  amount: 24,   price: 20,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 3,  amount: 33,   price: 29,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 4,  amount: 48,   price: 40,   bonus: null,  popular: false, tier: 'ปกติ',      img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 5,  amount: 60,   price: 49,   bonus: null,  popular: false, tier: 'ปกติ',      img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 6,  amount: 72,   price: 60,   bonus: null,  popular: false, tier: 'ปกติ',      img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 7,  amount: 110,  price: 89,   bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 8,  amount: 120,  price: 100,  bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 9,  amount: 185,  price: 145,  bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 10, amount: 220,  price: 178,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 11, amount: 330,  price: 270,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 12, amount: 370,  price: 290,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 13, amount: 440,  price: 355,  bonus: null,  popular: false, tier: 'โปร',       img: `${ROV_BASE}/rov_coupon5.png` },
      { id: 14, amount: 555,  price: 435,  bonus: null,  popular: true,  tier: 'โปร',       img: `${ROV_BASE}/rov_coupon5.png` },
      { id: 15, amount: 620,  price: 488,  bonus: null,  popular: false, tier: 'โปร',       img: `${ROV_BASE}/rov_coupon5.png` },
      { id: 16, amount: 740,  price: 580,  bonus: null,  popular: false, tier: 'พรีเมียม',  img: `${ROV_BASE}/rov_coupon6.png` },
      { id: 17, amount: 925,  price: 720,  bonus: null,  popular: false, tier: 'พรีเมียม',  img: `${ROV_BASE}/rov_coupon6.png` },
      { id: 18, amount: 1110, price: 870,  bonus: null,  popular: false, tier: 'พรีเมียม',  img: `${ROV_BASE}/rov_coupon6.png` },
      { id: 19, amount: 1240, price: 960,  bonus: null,  popular: false, tier: 'ซูเปอร์',   img: `${ROV_BASE}/rov_coupon7.png` },
      { id: 20, amount: 1480, price: 1160, bonus: null,  popular: false, tier: 'ซูเปอร์',   img: `${ROV_BASE}/rov_coupon7.png` },
      { id: 21, amount: 1860, price: 1440, bonus: null,  popular: false, tier: 'ซูเปอร์',   img: `${ROV_BASE}/rov_coupon7.png` },
      { id: 22, amount: 2480, price: 1920, bonus: null,  popular: true,  tier: 'อัลตร้า',   img: `${ROV_BASE}/rov_coupon8.png` },
      { id: 23, amount: 3720, price: 2880, bonus: null,  popular: false, tier: 'อัลตร้า',   img: `${ROV_BASE}/rov_coupon8.png` },
      { id: 24, amount: 4960, price: 3840, bonus: null,  popular: false, tier: 'อัลตร้า',   img: `${ROV_BASE}/rov_coupon8.png` },
      { id: 25, amount: 6200, price: 4800, bonus: null,  popular: false, tier: 'อัลตร้า',   img: `${ROV_BASE}/rov_coupon8.png` },
      { id: 26, amount: 7440,  price: 5760, bonus: null, popular: false, tier: 'เมกะ',      img: `${ROV_BASE}/rov_coupon9.png` },
      { id: 27, amount: 8680,  price: 6720, bonus: null, popular: false, tier: 'เมกะ',      img: `${ROV_BASE}/rov_coupon9.png` },
      { id: 28, amount: 9920,  price: 7680, bonus: null, popular: false, tier: 'เมกะ',      img: `${ROV_BASE}/rov_coupon9.png` },
      { id: 29, amount: 11160, price: 8640, bonus: null, popular: false, tier: 'เมกะ',      img: `${ROV_BASE}/rov_coupon9.png` },
      { id: 30, amount: 12400, price: 9600, bonus: null, popular: false, tier: 'เมกะ',      img: `${ROV_BASE}/rov_coupon9.png` },
    ],
  },

  'Honor of Kings': {
    id: 'Honor of Kings',
    name: 'Honor of Kings',
    subtitle: 'Honor of Kings — เติมโทเค็น',
    icon: '/images/GAMES ICON/HONOROFKINGS_iconapp.png',
    bg: '/images/GAMES BG/HONOROFKINGS_bg.png',
    category: 'เกม MOBA',
    currency: 'โทเค็น',
    packages: [],
  },

  'LoL: Wild Rift': {
    id: 'LoL: Wild Rift',
    name: 'LoL: Wild Rift',
    subtitle: 'League of Legends: Wild Rift — เติม Wild Cores',
    icon: '/images/GAMES ICON/LOLWILDRIFT_iconapp.png',
    bg: '/images/GAMES BG/LOLWILDRIFT_bg.png',
    category: 'เกม MOBA',
    currency: 'Wild Cores',
    packages: [],
  },

  'League of Legends': {
    id: 'League of Legends',
    name: 'League of Legends',
    subtitle: 'League of Legends — เติม RP',
    icon: '/images/GAMES ICON/LOL_iconapp.png',
    bg: '/images/GAMES BG/LOL_bg.png',
    category: 'เกม MOBA',
    currency: 'RP',
    packages: [],
  },

  'Magic Chess': {
    id: 'Magic Chess',
    name: 'Magic Chess',
    subtitle: 'Magic Chess: Bang Bang — เติมเพชร',
    icon: '/images/GAMES ICON/MAGICCHESS_iconapp.png',
    bg: '/images/GAMES BG/MAGICCHESS_bg.png',
    category: 'เกม MOBA',
    currency: 'เพชร',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกม Battle Royale
  // ══════════════════════════════════════════

  'Free Fire': {
    id: 'Free Fire',
    name: 'Free Fire',
    subtitle: 'Garena Free Fire — เติมเพชร & พาส',
    icon: '/images/GAMES ICON/FREEFIRE_iconapp.png',
    bg: '/images/GAMES BG/FREEFIRE_bg.png',
    category: 'เกม Battle Royale',
    currency: 'เพชร',
    tags: ['โปรโมชั่น', 'ขายดี'],
    packages: [
      { id: 1,  amount: 70,   price: 35,   bonus: null,   img: `${FF_BASE}/diamond1_freefire.png` },
      { id: 2,  amount: 140,  price: 69,   bonus: null,   img: `${FF_BASE}/diamond2_freefire.png` },
      { id: 3,  amount: 355,  price: 169,  bonus: null,   img: `${FF_BASE}/diamond3_freefire.png` },
      { id: 4,  amount: 720,  price: 329,  bonus: null,   img: `${FF_BASE}/diamond4_freefire.png` },
      { id: 5,  amount: 1450, price: 649,  bonus: '+145', img: `${FF_BASE}/diamond5_freefire.png` },
      { id: 6,  amount: 2180, price: 969,  bonus: '+218', img: `${FF_BASE}/diamond6_freefire.png` },
      { id: 7,  amount: 0, price: 19,  bonus: null, label: 'Weekly Pass Lite',    img: `${FF_BASE}/weekly_pass_lite_freefire.png` },
      { id: 8,  amount: 0, price: 79,  bonus: null, label: 'Weekly Pass',         img: `${FF_BASE}/weekly_pass_freefire.png` },
      { id: 9,  amount: 0, price: 199, bonus: null, label: 'Monthly Pass',        img: `${FF_BASE}/monthly_pass_freefire.png` },
      { id: 10, amount: 0, price: 199, bonus: null, label: 'Booyah Pass',         img: `${FF_BASE}/booyah_pass_freefire.png` },
      { id: 11, amount: 0, price: 79,  bonus: null, label: 'Membership Mingguan', img: `${FF_BASE}/freefire_MembershipMingguan.png` },
      { id: 12, amount: 0, price: 349, bonus: null, label: 'Level Up Pass',       img: `${FF_BASE}/freefire_levelup.png` },
      { id: 13, amount: 0, price: 549, bonus: null, label: 'Evo Access',          img: `${FF_BASE}/freefire_Evoaccess.png` },
    ],
  },

  'PUBG Mobile': {
    id: 'PUBG Mobile',
    name: 'PUBG Mobile',
    subtitle: 'PUBG Mobile — เติม UC',
    icon: '/images/GAMES ICON/PUBGMOBILE_iconapp.png',
    bg: '/images/GAMES BG/PUBGMOBILE_bg.png',
    category: 'เกม Battle Royale',
    currency: 'UC',
    tags: ['โปรโมชั่น', 'ขายดี'],
    packages: [
      { id: 1, amount: 60,   price: 35,   bonus: null,    img: `${PUBGM_BASE}/uc_pubgmobile.png` },
      { id: 2, amount: 325,  price: 169,  bonus: '+25',   img: `${PUBGM_BASE}/uc_pubgmobile.png` },
      { id: 3, amount: 660,  price: 329,  bonus: '+60',   img: `${PUBGM_BASE}/uc_pubgmobile.png` },
      { id: 4, amount: 1800, price: 899,  bonus: '+180',  img: `${PUBGM_BASE}/uc_pubgmobile.png` },
      { id: 5, amount: 3850, price: 1899, bonus: '+385',  img: `${PUBGM_BASE}/uc_pubgmobile.png` },
      { id: 6, amount: 8100, price: 3799, bonus: '+810',  img: `${PUBGM_BASE}/uc_pubgmobile.png` },
    ],
  },

  // ══════════════════════════════════════════
  //  เกมยิง FPS
  // ══════════════════════════════════════════

  'Call of Duty': {
    id: 'Call of Duty',
    name: 'Call of Duty',
    subtitle: 'Call of Duty Mobile — เติม CP',
    icon: '/images/GAMES ICON/CALLOFDUTY_iconapp.png',
    bg: '/images/GAMES BG/CALLOFDUTY_bg.png',
    category: 'เกมยิง FPS',
    currency: 'CP',
    tags: ['โปรโมชั่น', 'ขายดี'],
    packages: [],
  },

  'Delta Force': {
    id: 'Delta Force',
    name: 'Delta Force',
    subtitle: 'Delta Force: Hawk Ops — เติม DF Points',
    icon: '/images/GAMES ICON/DELTAFORCE_iconapp.png',
    bg: '/images/GAMES BG/DELTAFORCE_bg.png',
    category: 'เกมยิง FPS',
    currency: 'DF Points',
    packages: [],
  },

  'Blood Strike': {
    id: 'Blood Strike',
    name: 'Blood Strike',
    subtitle: 'Blood Strike — เติมคริสตัล',
    icon: '/images/GAMES ICON/BLOODSTRIKE_iconapp.png',
    bg: '/images/GAMES BG/BLOODSTRIKE_bg.png',
    category: 'เกมยิง FPS',
    currency: 'คริสตัล',
    packages: [],
  },

  'Ballistic Hero': {
    id: 'Ballistic Hero',
    name: 'Ballistic Hero',
    subtitle: 'Ballistic Hero — เติมคริสตัล',
    icon: '/images/GAMES ICON/BALLISTICHERO_iconapp.png',
    bg: '/images/GAMES BG/BALLISTICHERO_bg.png',
    category: 'เกมยิง FPS',
    currency: 'คริสตัล',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมยิงกลยุทธ์
  // ══════════════════════════════════════════

  'Valorant': {
    id: 'Valorant',
    name: 'Valorant',
    subtitle: 'Valorant — เติม VP',
    icon: '/images/GAMES ICON/VALORANT_iconapp.png',
    bg: '/images/GAMES BG/VALORANT_bg.png',
    category: 'เกมยิงกลยุทธ์',
    currency: 'VP',
    packages: [],
  },

  'Arena Breakout': {
    id: 'Arena Breakout',
    name: 'Arena Breakout',
    subtitle: 'Arena Breakout — เติม Armory Coin',
    icon: '/images/GAMES ICON/ARENABREAKOUT_iconapp.png',
    bg: '/images/GAMES BG/ARENABREAKOUT_bg.png',
    category: 'เกมยิงกลยุทธ์',
    currency: 'Armory Coin',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกม RPG
  // ══════════════════════════════════════════

  'Honkai: Star Rail': {
    id: 'Honkai: Star Rail',
    name: 'Honkai: Star Rail',
    subtitle: 'Honkai: Star Rail — เติม Oneiric Shard',
    icon: '/images/GAMES ICON/STARRAIL_iconapp.png',
    bg: '/images/GAMES BG/STARRAIL_bg.png',
    category: 'เกม RPG',
    currency: 'Oneiric Shard',
    packages: [],
  },

  'Aether Gazer': {
    id: 'Aether Gazer',
    name: 'Aether Gazer',
    subtitle: 'Aether Gazer — เติม Quartz',
    icon: '/images/GAMES ICON/AETHERGAZER_iconapp.png',
    bg: '/images/GAMES BG/AETHERGAZER_bg.png',
    category: 'เกม RPG',
    currency: 'Quartz',
    packages: [],
  },

  'AFK Journey': {
    id: 'AFK Journey',
    name: 'AFK Journey',
    subtitle: 'AFK Journey — เติมเพชร',
    icon: '/images/GAMES ICON/AFKJOURNEY_iconapp.png',
    bg: '/images/GAMES BG/AFKJOURNEY_bg.png',
    category: 'เกม RPG',
    currency: 'เพชร',
    packages: [],
  },

  'Bleach': {
    id: 'Bleach',
    name: 'Bleach',
    subtitle: 'Bleach: Brave Souls — เติมคริสตัล',
    icon: '/images/GAMES ICON/BLEACH_iconapp.png',
    bg: '/images/GAMES BG/BLEACH_bg.png',
    category: 'เกม RPG',
    currency: 'คริสตัล',
    packages: [],
  },

  'Where Winds Meet': {
    id: 'Where Winds Meet',
    name: 'Where Winds Meet',
    subtitle: 'Where Winds Meet — เติม Gem',
    icon: '/images/GAMES ICON/WHEREWINDMEET_iconapp.png',
    bg: '/images/GAMES BG/WHEREWINDMEET_bg.png',
    category: 'เกม RPG',
    currency: 'Gem',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมกลยุทธ์
  // ══════════════════════════════════════════

  'ACE RACER': {
    id: 'ACE RACER',
    name: 'ACE RACER',
    subtitle: 'ACE RACER — เติม Gold',
    icon: '/images/GAMES ICON/ACERACER_iconapp.png',
    bg: '/images/GAMES BG/ACERACER_bg.png',
    category: 'เกมแข่งรถ',
    currency: 'Gold',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  สตรีมมิ่ง
  // ══════════════════════════════════════════

  'BIGO LIVE': {
    id: 'BIGO LIVE',
    name: 'BIGO LIVE',
    subtitle: 'BIGO LIVE — เติม Beans',
    icon: '/images/GAMES ICON/BIGOLIVE_iconapp.png',
    bg: '/images/GAMES BG/BIGOLIVE_bg.png',
    category: 'สตรีมมิ่ง',
    currency: 'Beans',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมกีฬา
  // ══════════════════════════════════════════

  'Dunk City Dynasty': {
    id: 'Dunk City Dynasty',
    name: 'Dunk City Dynasty',
    subtitle: 'Dunk City Dynasty — เติม Coin',
    icon: '/images/GAMES ICON/DUNKCITY_iconapp.png',
    bg: '/images/GAMES BG/DUNKCITY_bg.png',
    category: 'เกมกีฬา',
    currency: 'Coin',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมจำลอง
  // ══════════════════════════════════════════

  'Heartopia': {
    id: 'Heartopia',
    name: 'Heartopia',
    subtitle: 'Heartopia — เติม Gem',
    icon: '/images/GAMES ICON/HEARTOPIA_iconapp.png',
    bg: '/images/GAMES BG/HEARTOPIA_bg.png',
    category: 'เกมจำลอง',
    currency: 'Gem',
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมเอาชีวิตรอด
  // ══════════════════════════════════════════

  'Identity V': {
    id: 'Identity V',
    name: 'Identity V',
    subtitle: 'Identity V — เติม Echoes',
    icon: '/images/GAMES ICON/IDENTITYV_iconapp.png',
    bg: '/images/GAMES BG/IDENTITYV_bg.png',
    category: 'เกมเอาชีวิตรอด',
    currency: 'Echoes',
    packages: [],
  },

};
