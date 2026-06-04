const ROV_BASE   = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/ROV';
const FF_BASE    = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/FREEFIRE';
const PUBGM_BASE = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/PUBGM';
const MLBB_BASE  = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/MLBB';

// แพ็คต้นแบบ MLBB — ใช้ร่วมกันทุก server (แก้ราคาทีหลังต่อ server)
const MLBB_PKG = (server, country) => [
  { id: `mlbb-${server}-5`,      amount: 5,    price: 5,   img: `${MLBB_BASE}/mlbb_diamond1.png` },
  { id: `mlbb-${server}-11`,     amount: 11,   price: 10,  img: `${MLBB_BASE}/mlbb_diamond1.png` },
  { id: `mlbb-${server}-22`,     amount: 22,   price: 20,  img: `${MLBB_BASE}/mlbb_diamond2.png` },
  { id: `mlbb-${server}-56`,     amount: 56,   price: 50,  badge: 'แนะนำ', img: `${MLBB_BASE}/mlbb_diamond3.png` },
  { id: `mlbb-${server}-112`,    amount: 112,  price: 99,  img: `${MLBB_BASE}/mlbb_diamond4.png` },
  { id: `mlbb-${server}-223`,    amount: 223,  price: 195, badge: 'ขายดี', img: `${MLBB_BASE}/mlbb_diamond5.png` },
  { id: `mlbb-${server}-336`,    amount: 336,  price: 290, img: `${MLBB_BASE}/mlbb_diamond6.png` },
  { id: `mlbb-${server}-570`,    amount: 570,  price: 485, img: `${MLBB_BASE}/mlbb_diamond7.png` },
  { id: `mlbb-${server}-1163`,   amount: 1163, price: 970, img: `${MLBB_BASE}/mlbb_diamond8.png` },
  { id: `mlbb-${server}-weekly`, amount: 0,    price: 79,  label: 'Weekly Diamond Pass', img: `${MLBB_BASE}/mlbb_WeeklyDiamondPass.png` },
].map(pkg => ({ ...pkg, country }));

const MLBB_SHARED = {
  name: 'Mobile Legends',
  icon: '/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png',
  bg: '/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png',
  category: 'เกม MOBA',
  currency: 'เพชร',
  showOnHome: true,
  tags: ['โปรโมชั่น', 'ขายดี'],
  accountFields: [
    { key: 'userId',   label: 'User ID',   placeholder: 'เช่น 123456789', inputMode: 'numeric', required: true },
    { key: 'serverId', label: 'Server ID', placeholder: 'เช่น 1234',      inputMode: 'numeric', required: true },
  ],
  accountHint: 'Mobile Legends ต้องใช้ทั้ง User ID และ Server ID ตรวจสอบให้ถูกต้องก่อนยืนยัน',
};

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
    promoBg: '/images/BG_UID/ROV.png',
    promoAspect: '21 / 7',
    howtoImage: '/images/HOW%20TO/H_ROV.jpg',
    category: 'เกม MOBA',
    currency: 'คูปอง',
    tag: 'ขายดี',
    showOnHome: true,
    tags: ['โปรโมชั่น', 'ขายดี'],
    info: {
      title: 'บริการเติมคูปอง ROV',
      taglines: [
        'ALASKAN SHOP ตัวแทนจำหน่ายและผู้ให้บริการเติมคูปองเกม ROV ในราคาคุ้มค่าสุดๆ',
        'สะดวก รวดเร็ว ปลอดภัย ถูกต้องตามระบบที่ตัวเกมกำหนดแน่นอน 100%',
      ],
      sections: [
        {
          heading: 'เติม ROV กับ ALASKAN SHOP ดีกว่าเติมเองในเกมยังไง?',
          ordered: false,
          items: [
            'คุ้มและประหยัดกว่าเติมเองในเกม',
            'สะดวก รวดเร็ว พร้อมให้บริการตลอด 24 ช.ม.',
            'ง่าย ไม่ยุ่งยาก ใช้แค่ OPEN ID คัดลอกจากในเกมได้เลย',
          ],
        },
        {
          heading: 'ขั้นตอนการใช้บริการเติม ROV',
          ordered: true,
          items: [
            'คัดลอก OPEN ID มาใส่ในช่องที่กำหนด',
            'เลือกแพ็กเกจที่ต้องการเติม',
            'กดปุ่ม "ถัดไป" และยืนยันออเดอร์',
            'เลือกช่องทางชำระเงินที่ต้องการ',
            'ดำเนินการชำระเงิน รอรับของในเกมได้เลย!!',
          ],
        },
      ],
    },
    packages: [
      { id: 1,  amount: 11,   price: 10,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 2,  amount: 24,   price: 20,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 3,  amount: 33,   price: 29,   bonus: null,  popular: false, tier: 'เริ่มต้น',  img: `${ROV_BASE}/rov_coupon1.png` },
      { id: 4,  amount: 48,   price: 40,   bonus: null,  popular: false, tier: 'ปกติ',      badge: 'แนะนำ', img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 5,  amount: 60,   price: 49,   bonus: null,  popular: false, tier: 'ปกติ',      img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 6,  amount: 72,   price: 60,   bonus: null,  popular: false, tier: 'ปกติ',      img: `${ROV_BASE}/rov_coupon2.png` },
      { id: 7,  amount: 110,  price: 89,   bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 8,  amount: 120,  price: 100,  bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 9,  amount: 185,  price: 145,  bonus: null,  popular: false, tier: 'สแตนดาร์ด', img: `${ROV_BASE}/rov_coupon3.png` },
      { id: 10, amount: 220,  price: 178,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 11, amount: 330,  price: 270,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 12, amount: 370,  price: 290,  bonus: null,  popular: false, tier: 'พลัส',      img: `${ROV_BASE}/rov_coupon4.png` },
      { id: 13, amount: 440,  price: 355,  bonus: null,  popular: false, tier: 'โปร',       img: `${ROV_BASE}/rov_coupon5.png` },
      { id: 14, amount: 555,  price: 435,  bonus: null,  popular: true,  tier: 'โปร',       badge: 'ขายดี', img: `${ROV_BASE}/rov_coupon5.png` },
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

  // ── Mobile Legends แยกตาม server ──────────────────────────────────────────
  'Mobile Legends':    { ...MLBB_SHARED, id: 'Mobile Legends',    subtitle: 'Mobile Legends — Server ไทย',          tag: null,      country: 'thailand',                 tags: ['ขายดี'], packages: MLBB_PKG('th', 'thailand') },
  'Mobile Legends ID': { ...MLBB_SHARED, id: 'Mobile Legends ID', subtitle: 'Mobile Legends — Server อินโดนีเซีย', tag: 'ขายดี',   country: 'indonesia',               tags: [], packages: MLBB_PKG('id', 'indonesia') },
  'Mobile Legends MY': { ...MLBB_SHARED, id: 'Mobile Legends MY', subtitle: 'Mobile Legends — Server มาเลเซีย',    tag: null,      country: 'malaysia',                tags: [], packages: MLBB_PKG('my', 'malaysia') },
  'Mobile Legends PH': { ...MLBB_SHARED, id: 'Mobile Legends PH', subtitle: 'Mobile Legends — Server ฟิลิปปินส์', tag: null,      country: 'philippines',             tags: [], packages: MLBB_PKG('ph', 'philippines') },
  'Mobile Legends SG': { ...MLBB_SHARED, id: 'Mobile Legends SG', subtitle: 'Mobile Legends — Server สิงคโปร์',   tag: null,      country: 'singapore',               tags: [], packages: MLBB_PKG('sg', 'singapore') },
  'Mobile Legends RU': { ...MLBB_SHARED, id: 'Mobile Legends RU', subtitle: 'Mobile Legends — Server รัสเซีย',     tag: null,      country: 'russia',                  tags: [], packages: MLBB_PKG('ru', 'russia') },
  'Mobile Legends TR': { ...MLBB_SHARED, id: 'Mobile Legends TR', subtitle: 'Mobile Legends — Server ตุรกี',       tag: null,      country: 'turkey',                  tags: [], packages: MLBB_PKG('tr', 'turkey') },
  'Mobile Legends US': { ...MLBB_SHARED, id: 'Mobile Legends US', subtitle: 'Mobile Legends — Server สหรัฐฯ',      tag: null,      country: 'united-states-of-america', tags: [], packages: MLBB_PKG('us', 'united-states-of-america') },

  'Honor of Kings': {
    id: 'Honor of Kings',
    name: 'Honor of Kings',
    subtitle: 'Honor of Kings — เติมโทเค็น',
    icon: '/images/GAMES ICON/HONOROFKINGS_iconapp.png',
    bg: '/images/GAMES BG/HONOROFKINGS_bg.png',
    category: 'เกม MOBA',
    currency: 'โทเค็น',
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    promoBg: '/images/BG_UID/FF.png',
    promoAspect: '33 / 14',
    promoFade: true,
    howtoImage: '/images/HOW%20TO/ff.png',
    category: 'เกม Battle Royale',
    currency: 'เพชร',
    tag: 'ขายดี',
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: 'ใหม่',
    showOnHome: true,
    packages: [
      { id: 'df-18',       amount: 18,                                   price: 12,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-30',       amount: 30,                                   price: 19,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-60',       amount: 60,                                   price: 34,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-300',      amount: 0, label: '300 + 20 Delta Coin',      price: 139,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-420',      amount: 0, label: '420 + 40 Delta Coin',      price: 199,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-680',      amount: 0, label: '680 + 70 Delta Coin',      price: 269,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-1280',     amount: 0, label: '1,280 + 200 Delta Coin',   price: 519,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-1680',     amount: 0, label: '1,680 + 300 Delta Coin',   price: 649,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-3280',     amount: 0, label: '3,280 + 670 Delta Coin',   price: 1279,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
      { id: 'df-6480',     amount: 0, label: '6,480 + 1,620 Delta Coin', price: 2499,  badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Deltaforce_coin.png' },
    ],
  },

  'Blood Strike': {
    id: 'Blood Strike',
    name: 'Blood Strike',
    subtitle: 'Blood Strike — เติม Gold',
    icon: '/images/GAMES ICON/BLOODSTRIKE_iconapp.png',
    bg: '/images/GAMES BG/BLOODSTRIKE_bg.png',
    category: 'เกมยิง FPS',
    currency: 'Gold',
    tag: 'ใหม่',
    showOnHome: true,
    packages: [
      { id: 'bs-100',  amount: 0, label: '100+5 Gold',    price: 27,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_s.png' },
      { id: 'bs-300',  amount: 0, label: '300+20 Gold',   price: 70,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_s.png' },
      { id: 'bs-500',  amount: 0, label: '500+40 Gold',   price: 116,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_m.png' },
      { id: 'bs-1000', amount: 0, label: '1000+100 Gold', price: 231,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_m.png' },
      { id: 'bs-2000', amount: 0, label: '2000+260 Gold', price: 458,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_l.png' },
      { id: 'bs-5000', amount: 0, label: '5000+800 Gold', price: 1132,  badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/BLOODSTRIKE/bs_gold_l.png' },
    ],
  },

  'Ballistic Hero': {
    id: 'Ballistic Hero',
    name: 'Ballistic Hero',
    subtitle: 'Ballistic Hero — เติมคริสตัล',
    icon: '/images/GAMES ICON/BALLISTICHERO_iconapp.png',
    bg: '/images/GAMES BG/BALLISTICHERO_bg.png',
    category: 'เกมยิง FPS',
    currency: 'คริสตัล',
    tag: 'ใหม่',
    showOnHome: true,
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมยิงกลยุทธ์
  // ══════════════════════════════════════════

  'Valorant': {
    id: 'Valorant',
    name: 'Valorant',
    subtitle: 'Valorant — เติม Valorant Point',
    icon: '/images/GAMES ICON/VALORANT_iconapp.png',
    bg: '/images/GAMES BG/VALORANT_bg.png',
    category: 'เกมยิงกลยุทธ์',
    currency: 'VP',
    tag: 'ขายดี',  // แก้แท็กเกมในหน้า UID TOP Up เช่น ขายดี , ใหม่ 
    showOnHome: true,
    packages: [
      // ── Rogue Collection Bundles ──────────────────────────────
      { id: 'vp-rogue-gun',    amount: 0, label: '2,525 VP (Rogue Collection ปืนแยกชิ้น)', price: 628,   originalPrice: 650,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-rogue-melee',  amount: 0, label: '4,650 VP (Rogue Collection Melee)',       price: 1133,  originalPrice: 1180,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-rogue-bundle', amount: 0, label: '9,000 VP (Rogue Collection Bundle)',      price: 2153,  originalPrice: 2240,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      // ── Valorant Points ──────────────────────────────────────
      { id: 'vp-475',    amount: 475,    price: 129,   originalPrice: 130,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-1000',   amount: 1000,   price: 249,   originalPrice: 279,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-1475',   amount: 1475,   price: 378,   originalPrice: 390,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-2050',   amount: 2050,   price: 499,   originalPrice: 559,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-3050',   amount: 3050,   price: 748,   originalPrice: 830,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-3650',   amount: 3650,   price: 884,   originalPrice: 920,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-5350',   amount: 5350,   price: 1269,  originalPrice: 1400,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-7400',   amount: 7400,   price: 1768,  originalPrice: 1959,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-10000',  amount: 10000,  price: 2402,  originalPrice: 2650,  badge: 'แนะนำ', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
      { id: 'vp-11000',  amount: 11000,  price: 2534,  originalPrice: 2640,  badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Valorant_points.png' },
    ],
  },

  'Arena Breakout': {
    id: 'Arena Breakout',
    name: 'Arena Breakout',
    subtitle: 'Arena Breakout — เติม Bonds',
    icon: '/images/GAMES ICON/ARENABREAKOUT_iconapp.png',
    bg: '/images/GAMES BG/ARENABREAKOUT_bg.png',
    category: 'เกมยิงกลยุทธ์',
    currency: 'Bonds',
    tag: null,
    showOnHome: true,
    packages: [
      // ── Passes & Privileges ──────────────────────────────────
      { id: 'ab-pass-monthly-adv',  amount: 0, label: 'Monthly Advanced Battle Pass',            price: 35,    originalPrice: 39,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_AdvancedBattlePass.png' },
      { id: 'ab-pass-beginner',     amount: 0, label: 'Beginner Select (VIP + เชฟ 4 ช่อง 3 วัน)', price: 29,  originalPrice: 39,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_BeginnerSelect.png' },
      { id: 'ab-case-bullet',       amount: 0, label: 'Bulletproof Case Privileges (30 วัน)',    price: 89,    originalPrice: 110,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_BulletproofCase.png' },
      { id: 'ab-pass-monthly-pre',  amount: 0, label: 'Monthly Premium Battle Pass',             price: 129,   originalPrice: 159,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_PremiumBattlePass.png' },
      { id: 'ab-case-composite',    amount: 0, label: 'Composite Case Privileges (30 วัน)',      price: 219,   originalPrice: 335,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_CompositeCase.png' },
      { id: 'ab-pass-quarterly',    amount: 0, label: 'Quarterly Premium Battle Pass',           price: 369,   originalPrice: 469,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_QuarterlyPremiumBattlePass.png' },
      // ── Bonds ────────────────────────────────────────────────
      { id: 'ab-66',    amount: 66,    price: 34,    originalPrice: 39,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
      { id: 'ab-335',   amount: 335,   price: 149,   originalPrice: 189,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
      { id: 'ab-675',   amount: 675,   price: 319,   originalPrice: 375,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
      { id: 'ab-1690',  amount: 1690,  price: 729,   originalPrice: 939,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
      { id: 'ab-3400',  amount: 3400,  price: 1329,  originalPrice: 1870,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
      { id: 'ab-6820',  amount: 6820,  price: 2599,  originalPrice: 3750,  badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/ARENA%20BREAKOUT/Arena%20Breakout_bonds.png' },
    ],
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
    tag: null,
    showOnHome: true,
    packages: [
      { id: 'hsr-pass',   amount: 0, label: 'บัตรกำนัลเสียงรถไฟ',  price: 179,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_ExpressSupplyPass.png' },
      { id: 'hsr-60',     amount: 0, label: '60 Shard',             price: 35,    img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
      { id: 'hsr-300',    amount: 0, label: '300+30 Shard',         price: 179,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
      { id: 'hsr-980',    amount: 0, label: '980+110 Shard',        price: 549,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
      { id: 'hsr-1980',   amount: 0, label: '1980+260 Shard',       price: 1100,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
      { id: 'hsr-3280',   amount: 0, label: '3280+600 Shard',       price: 1800,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
      { id: 'hsr-6480',   amount: 0, label: '6480+1600 Shard',      price: 3700,  badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/STARRAIL/starrail_shard.png' },
    ],
  },

  'Aether Gazer': {
    id: 'Aether Gazer',
    name: 'Aether Gazer',
    subtitle: 'Aether Gazer — เติม Quartz',
    icon: '/images/GAMES ICON/AETHERGAZER_iconapp.png',
    bg: '/images/GAMES BG/AETHERGAZER_bg.png',
    category: 'เกม RPG',
    currency: 'Quartz',
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
    packages: [],
  },

  'Where Winds Meet': {
    id: 'Where Winds Meet',
    name: 'Where Winds Meet',
    subtitle: 'Where Winds Meet — เติม Echo Beads',
    icon: '/images/GAMES ICON/WHEREWINDMEET_iconapp.png',
    bg: '/images/GAMES BG/WHEREWINDMEET_bg.png',
    category: 'เกม RPG',
    currency: 'Echo Beads',
    tag: 'มาแรง',
    showOnHome: true,
    tags: ['ขายดี'],
    packages: [
      { id: 'wwm-monthly',  amount: 0, label: 'Monthly Pass',         originalPrice: 175,  price: 164,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-elite',    amount: 0, label: 'Elite Battle Pass',    originalPrice: 350,  price: 324,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-premium',  amount: 0, label: 'Premium Battle Pass',  originalPrice: 675,  price: 629,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-60',       amount: 60,    originalPrice: 39,   price: 35,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-180',      amount: 180,   originalPrice: 105,  price: 99,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-300',      amount: 300,   originalPrice: 175,  price: 165,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-600',      amount: 600,   originalPrice: 350,  price: 329,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-900',      amount: 900,   originalPrice: 520,  price: 479,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-1800',     amount: 1800,  originalPrice: 1100, price: 939,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-3000',     amount: 3000,  originalPrice: 1690, price: 1549, img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-6000',     amount: 6000,  originalPrice: 3390, price: 3079, img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
      { id: 'wwm-12000',    amount: 12000, originalPrice: 6690, price: 6149, badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/Wherewindmeet_echo.png' },
    ],
  },

  // ══════════════════════════════════════════
  //  เกมแข่งรถ
  // ══════════════════════════════════════════

  'ACE RACER': {
    id: 'ACE RACER',
    name: 'ACE RACER',
    subtitle: 'ACE RACER — เติม Gold',
    icon: '/images/GAMES ICON/ACERACER_iconapp.png',
    bg: '/images/GAMES BG/ACERACER_bg.png',
    category: 'เกมแข่งรถ',
    currency: 'Gold',
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
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
    tag: null,
    showOnHome: true,
    packages: [],
  },

  // ══════════════════════════════════════════
  //  เกมจำลอง
  // ══════════════════════════════════════════

  'Heartopia': {
    id: 'Heartopia',
    name: 'Heartopia',
    subtitle: 'Heartopia — เติม เพชรหัวใจ',
    icon: '/images/GAMES ICON/HEARTOPIA_iconapp.png',
    bg: '/images/GAMES BG/HEARTOPIA_bg.png',
    category: 'เกมจำลอง',
    currency: 'เพชรหัวใจ',
    tag: null,
    showOnHome: true,
    packages: [
      { id: 'ht-pass7',   amount: 0, label: 'สมาชิกสมาคมลูกโอ๊กระดับต้น',  price: 22,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_pass7.png' },
      { id: 'ht-pass30',  amount: 0, label: 'สมาชิกทางการลูกกลมทองคำ',      price: 99,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_pass30.png' },
      { id: 'ht-20',      amount: 20,                                         price: 19,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_pass7.png' },
      { id: 'ht-60',      amount: 60,                                         price: 37,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/Heartopia_candy.png' },
      { id: 'ht-300',     amount: 0, label: '300 + 20 เพชรหัวใจ',            price: 169,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_FestivalPack.png' },
      { id: 'ht-680',     amount: 0, label: '680 + 50 เพชรหัวใจ',            price: 365,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_FestivalPack.png' },
      { id: 'ht-1280',    amount: 0, label: '1280 + 90 เพชรหัวใจ',           price: 659,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_FestivalPackUP.png' },
      { id: 'ht-1980',    amount: 0, label: '1980 + 150 เพชรหัวใจ',          price: 999,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_FestivalPackUP.png' },
      { id: 'ht-3280',    amount: 0, label: '3280 + 270 เพชรหัวใจ',          price: 1699, img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_SupremeFestivalPack.png' },
      { id: 'ht-6480',    amount: 0, label: '6480 + 570 เพชรหัวใจ',          price: 3149, badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/HEATOPIA/heartopia_SupremeFestivalPack.png' },
    ],
  },

  // ══════════════════════════════════════════
  //  เกมเอาชีวิตรอด
  // ══════════════════════════════════════════

  'Identity V': {
    id: 'Identity V',
    name: 'Identity V',
    subtitle: 'Identity V — เติม Extra Echoes',
    icon: '/images/GAMES ICON/IDENTITYV_iconapp.png',
    bg: '/images/GAMES BG/IDENTITYV_bg.png',
    category: 'เกมเอาชีวิตรอด',
    currency: 'Echoes',
    tag: null,
    showOnHome: true,
    packages: [
      { id: 'idv-66',    amount: 66,    price: 30,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/IdentityV_letter.png' },
      { id: 'idv-203',   amount: 203,   price: 89,   img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/IdentityV_letter.png' },
      { id: 'idv-335',   amount: 335,   price: 145,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/IdentityV_letter.png' },
      { id: 'idv-759',   amount: 759,   price: 291,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_CluesPackage.png' },
      { id: 'idv-2277',  amount: 2277,  price: 863,  img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_CluesPackage.png' },
      { id: 'idv-3795',  amount: 3795,  price: 1424, img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_InspirationsPackage.png' },
      { id: 'idv-6831',  amount: 6831,  price: 2547, badge: 'แนะนำ', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_InspirationsPackage.png' },
      { id: 'idv-7590',  amount: 7590,  price: 2816, badge: 'ขายดี', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_InspirationsPackage.png' },
      { id: 'idv-dentist', amount: 19310, label: 'โปรเหมาตู้ Dentist', price: 7163, badge: 'แนะนำ', img: '/images/ALASKAN_WEB_ASSET/PACKAGE%20ICON/IDENTITY%20V/identityv_MemorySpherePackage.png' },
    ],
  },

};
