// ─── Shared constants — ใช้ร่วมกันใน Home, TopupPage, MailPassPage ─────────────
// ถ้าเพิ่มประเทศให้แก้ที่นี่ที่เดียว อย่า copy ไปวางในแต่ละ component

export const FLAG_BASE = '/images/ALASKAN_WEB_ASSET/FLAG';

// key = ชื่อไฟล์ธงใน /images/.../FLAG/ (ไม่มี .png)
// value = ชื่อประเทศที่แสดงบน card badge
export const COUNTRY_NAMES = {
  'indonesia':                'Indonesia',
  'malaysia':                 'Malaysia',
  'philippines':              'Philippines',
  'russia':                   'Russia',
  'singapore':                'Singapore',
  'thailand':                 'Thailand',
  'turkey':                   'Turkey',
  'united-states-of-america': 'USA',
};

// ชื่อภาษาไทย — ใช้ใน TopupHub (badge แสดงชื่อประเทศไทย)
export const COUNTRY_NAMES_TH = {
  'indonesia':                'อินโดนีเซีย',
  'malaysia':                 'มาเลเซีย',
  'philippines':              'ฟิลิปปินส์',
  'russia':                   'รัสเซีย',
  'singapore':                'สิงคโปร์',
  'thailand':                 'ไทย',
  'turkey':                   'ตุรกี',
  'united-states-of-america': 'อเมริกา',
};

// ช่องทางชำระเงิน — ใช้ร่วมกันใน TopupPage + MailPassPage
// iconBg/iconText/iconColor ใช้ render icon box แทน brand logo
export const PAYMENT_METHODS = [
  { id: 'promptpay', name: 'QR Code Promptpay',        desc: '',                                                   iconBg: '#003082', iconText: 'QR',    iconColor: '#fff',    badge: 'ฮิต',  popular: true,  hasQR: true  },
  { id: 'shopeepay', name: 'ShopeePay',                 desc: 'จ่ายผ่าน SPayLater หรือธนาคาร พร้อมรับส่วนลด',   iconBg: '#ee4d2d', iconText: 'S',     iconColor: '#fff',    badge: 'ฮิต',  popular: true,  hasQR: false },
  { id: 'kplus',     name: 'K PLUS',                   desc: '',                                                   iconBg: '#00a651', iconText: 'K+',    iconColor: '#fff',    badge: null,   popular: true,  hasQR: true  },
  { id: 'bbl',       name: 'โมบายแบงก์กิ้ง กรุงเทพ',  desc: '',                                                   iconBg: '#1B4D9B', iconText: 'BBL',   iconColor: '#fff',    badge: null,   popular: false, hasQR: true  },
  { id: 'credit',    name: 'บัตรเครดิต',               desc: '',                                                   iconBg: '#1a1a2e', iconText: 'CARD',  iconColor: '#fff',    badge: null,   popular: false, hasQR: false },
  { id: 'dtac',      name: 'DTAC SMS',                 desc: 'จำกัดเฉพาะลูกค้า DTAC แบบระบบเติมเงิน',           iconBg: '#009FDA', iconText: 'D',     iconColor: '#fff',    badge: null,   popular: false, hasQR: false },
  { id: 'ais',       name: 'AIS SMS',                  desc: 'ลูกค้า AIS เท่านั้น',                              iconBg: '#e60012', iconText: 'AIS',   iconColor: '#fff',    badge: null,   popular: false, hasQR: false },
  { id: 'true',      name: 'TRUE SMS',                 desc: 'จำกัดเฉพาะลูกค้า TRUE',                            iconBg: '#d4001f', iconText: 'true',  iconColor: '#fff',    badge: null,   popular: false, hasQR: false },
  { id: 'shell',     name: 'ใช้ Shell ในบัญชี',        desc: '',                                                   iconBg: '#fbce07', iconText: 'Shell', iconColor: '#1a1a2e', badge: null,   popular: false, hasQR: false },
];
