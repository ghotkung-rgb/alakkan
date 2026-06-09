import { FiTrendingUp, FiZap, FiTag } from 'react-icons/fi';
import { PAYMENT_METHODS } from '../../config/constants';

// map id → ชื่อ เพื่อ render ใน AdminOrders
export const PAYMENT_METHODS_MAP = Object.fromEntries(
  PAYMENT_METHODS.map(m => [m.id, { name: m.name, iconBg: m.iconBg, iconText: m.iconText, iconColor: m.iconColor }])
);

// credentials อ่านจาก .env (VITE_ADMIN_USER / VITE_ADMIN_PASS) — Phase 2: เปลี่ยนเป็น backend JWT
export const ADMIN_USER     = import.meta.env.VITE_ADMIN_USER;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;

// ══════════════════════════════════════════════════════════════
//  TODO [API] ข้อมูล mock ด้านล่าง — ลบออกเมื่อ backend พร้อม
//
//  ขั้นตอน:
//  1. ใน AdminPage.jsx — uncomment useEffect + getOrders() (ดู TODO ในไฟล์นั้น)
//  2. ลบ INIT_ORDERS และ INIT_NEWS ที่นี่ออก
//  3. ลบ import { INIT_ORDERS, INIT_NEWS } ใน AdminPage.jsx ออก
//
//  โครงสร้าง object สำหรับ dev ดูได้จาก mock ด้านล่าง
// ══════════════════════════════════════════════════════════════
// โครงสร้าง order object — backend ต้อง return ตาม field เหล่านี้ทุกตัว
export const INIT_ORDERS = [
  { id: 'ORD-001', game: 'ROV',         type: 'UID',       pkg: '555 คูปอง',      price: 435,  uid: '112233445',      paymentMethod: 'promptpay', slip: null, status: 'pending',    date: '2026-05-31 10:23' },
  { id: 'ORD-002', game: 'Free Fire',   type: 'UID',       pkg: '530 ไดมอนด์',   price: 299,  uid: '998877665',      paymentMethod: 'kplus',     slip: null, status: 'completed',  date: '2026-05-31 09:15' },
  { id: 'ORD-003', game: 'FC Mobile',   type: 'Mail/Pass', pkg: '2200 FC Points', price: 399,  uid: 'user@gmail.com', paymentMethod: 'bbl',       slip: null, status: 'processing', date: '2026-05-31 08:44' },
  { id: 'ORD-004', game: 'PUBG Mobile', type: 'UID',       pkg: '325 UC',         price: 119,  uid: '555000111',      paymentMethod: 'shopeepay', slip: null, status: 'failed',     date: '2026-05-30 22:10' },
  { id: 'ORD-005', game: 'ROV',         type: 'UID',       pkg: '185 คูปอง',      price: 145,  uid: '777888999',      paymentMethod: 'promptpay', slip: null, status: 'pending',    date: '2026-05-30 20:05' },
  { id: 'ORD-006', game: 'eFootball',   type: 'Mail/Pass', pkg: '1000 Coin',      price: 180,  uid: 'admin@mail.com', paymentMethod: 'kplus',     slip: null, status: 'completed',  date: '2026-05-30 18:30' },
];

export const INIT_NEWS = [
  { id: 1, title: 'โปรโมชั่น ROV เดือนมิถุนายน',  content: 'รับโบนัสพิเศษเมื่อเติมเพชร ROV ครบ 100 บาท พร้อมรับสกินพิเศษ!', image: '', imagePosition: 50, isHot: true,  date: '2026-05-31' },
  { id: 2, title: 'เปิดให้บริการ FC Mobile แล้ว!', content: 'เติม FC Points ง่ายๆ ผ่านเว็บ ALASKAN SHOP ราคาถูกที่สุด',         image: '', imagePosition: 50, isHot: false, date: '2026-05-30' },
  { id: 3, title: 'ระบบปิดปรับปรุง 1 มิ.ย.',        content: 'ระบบจะปิดให้บริการชั่วคราวระหว่าง 00:00–02:00 น.',                image: '', imagePosition: 50, isHot: false, date: '2026-05-29' },
];

export const STATUS_MAP = {
  pending:    { bg: '#fff8e6', color: '#b45309', border: '#fde68a', label: 'รอดำเนินการ' },
  processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'กำลังดำเนินการ' },
  completed:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', label: 'สำเร็จ' },
  failed:     { bg: '#fef2f2', color: '#991b1b', border: '#fecaca', label: 'ล้มเหลว' },
};

export const AVAILABLE_TAGS = [
  { key: 'ขายดี',     label: 'ขายดี',     Icon: FiTrendingUp, color: '#f59e0b' },
  { key: 'ใหม่',      label: 'ใหม่',      Icon: FiZap,        color: '#10b981' },
  { key: 'โปรโมชั่น', label: 'โปรโมชั่น', Icon: FiTag,        color: '#ef4444' },
];

export const sTh = { padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', letterSpacing: '0.06em', textTransform: 'uppercase' };
export const sTd = { padding: '12px 14px', fontSize: 13, color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };
export const sInput = { border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' };
export const sBtn   = { border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s ease' };
export const sBtnCyan = { ...sBtn, borderRadius: 0, clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)', background: '#00d1ff', color: '#0f172a', fontWeight: 700, boxShadow: '0 2px 12px rgba(0,209,255,0.28)' };
export const sIconBtn = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 8px', background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s ease' };
