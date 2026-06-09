// ═══════════════════════════════════════════════════════════════════════════
//  topupService.js  —  API Layer สำหรับระบบเติมเกม ALASKAN SHOP
//
//  สถานะ: MOCK ทั้งหมด  (return ข้อมูลปลอม — ไม่มีการส่งข้อมูลจริง)
//
//  ════════════════════════════════════════════════════════════════════════
//  [DEV GUIDE]  วิธีเปิดใช้งาน API จริง — ทำ 2 ขั้นตอน:
//
//  1. แก้ทุก function ด้านล่าง:
//       - ลบบรรทัด console.log + return mock (ที่มาร์คว่า REMOVE)
//       - uncomment บล็อค fetch (ที่มาร์คว่า UNCOMMENT)
//
//  2. ตั้ง environment variable บน server / Vercel:
//       VITE_API_BASE=https://your-api-domain.com
//     ถ้าไม่ตั้ง VITE_API_BASE ไฟล์นี้จะ fallback เป็น '' (same-origin)
//
//  ════════════════════════════════════════════════════════════════════════
//  ไฟล์ที่เรียกใช้ topupService.js:
//    - src/components/TopupPage.jsx    → createOrder() บรรทัด ~190
//    - src/components/MailPassPage.jsx → createOrder() บรรทัด ~216
//
//  ไม่มีไฟล์อื่นในโปรเจกต์ที่ import topupService.js
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`API ${path} → ${res.status}: ${msg}`);
  }
  return res.json();
}


// ─── createOrder ─────────────────────────────────────────────────────────────
//
//  เรียกเมื่อ: ผู้ใช้กดปุ่ม "ยืนยันการสั่งซื้อ" ในทั้ง TopupPage และ MailPassPage
//
//  Payload ที่ส่งมาจาก TopupPage (UID games):
//    gameId        string   — game.id เช่น 'ROV', 'FreeFire'
//    uid           string   — ค่า join ของ accountFields ทั้งหมด (เช่น '123456 / 789')
//    account       object   — { uid: '123456', serverId: '789', ... }  (key = accountField.key)
//    packages      array    — [{ id, amount, price, label }]
//    totalPrice    number   — ราคารวม (บาท)
//    paymentMethod string   — id ของช่องทางชำระเงิน เช่น 'promptpay', 'kplus'
//    slip          string|null — base64 ของภาพสลิป (หรือ null ถ้าไม่แนบ)
//
//  Payload ที่ส่งมาจาก MailPassPage (Mail/Pass games):
//    gameId        string   — game.id เช่น 'FC Mobile', 'eFootball'
//    uid           string   — email หรือ fieldValues['idLogin']
//    accountData   object   — { email, password } หรือ fieldValues ทั้งหมด
//    packages      array    — [{ id, amount, price, label }]
//    totalPrice    number   — ราคารวม (บาท)
//    paymentMethod string   — เหมือนกัน
//    slip          string|null — เหมือนกัน
//
//  *** หมายเหตุ: TopupPage ส่ง `account` — MailPassPage ส่ง `accountData`
//      Backend ควรรับทั้งสอง field (หรือ normalize ใน payload ก่อน POST)
//
//  Response ที่ต้องการ:
//    { orderId: string, status: 'pending' }
//
export async function createOrder(payload) {
  // ── REMOVE (ลบทั้งสองบรรทัดนี้เมื่อเปิดใช้ API จริง) ────────────────
  console.log('[topupService] createOrder (mock)', payload);
  return { orderId: 'MOCK-' + Date.now(), status: 'pending' };
  // ─────────────────────────────────────────────────────────────────────

  // ── UNCOMMENT เมื่อ backend พร้อม ─────────────────────────────────────
  // return apiPost('/api/orders', payload);
  // ─────────────────────────────────────────────────────────────────────
}


// ─── getOrders ───────────────────────────────────────────────────────────────
//
//  ใช้ใน: AdminPage.jsx (ปัจจุบัน admin ใช้ INIT_ORDERS mock จาก adminShared.js)
//
//  วิธีเปิดใช้งาน:
//  1. ใน AdminPage.jsx เพิ่ม:
//       import { getOrders } from '../services/topupService';
//       useEffect(() => { getOrders().then(setOrders); }, []);
//  2. ลบ INIT_ORDERS ออกจาก adminShared.js (หรือเก็บไว้เป็น fallback)
//
//  Response ที่ต้องการ: array ของ order objects
//  ดูโครงสร้าง object ได้จาก INIT_ORDERS ใน src/components/admin/adminShared.js
//
export async function getOrders() {
  // ── REMOVE ────────────────────────────────────────────────────────────
  console.log('[topupService] getOrders (mock)');
  return [];
  // ─────────────────────────────────────────────────────────────────────

  // ── UNCOMMENT ─────────────────────────────────────────────────────────
  // const res = await fetch(`${API_BASE}/api/orders`);
  // return res.json();
  // ─────────────────────────────────────────────────────────────────────
}


// ─── updateOrderStatus ────────────────────────────────────────────────────────
//
//  ใช้ใน: AdminOrders.jsx — เมื่อ admin เปลี่ยนสถานะออเดอร์
//  (ปัจจุบันอัปเดต state ใน memory เท่านั้น — reset เมื่อ refresh)
//
//  payload: { orderId: string, status: 'pending'|'processing'|'completed'|'failed' }
//  Response ที่ต้องการ: { ok: true }
//
export async function updateOrderStatus(orderId, status) {
  // ── REMOVE ────────────────────────────────────────────────────────────
  console.log('[topupService] updateOrderStatus (mock)', { orderId, status });
  return { ok: true };
  // ─────────────────────────────────────────────────────────────────────

  // ── UNCOMMENT ─────────────────────────────────────────────────────────
  // return apiPost('/api/orders/status', { orderId, status });
  // ─────────────────────────────────────────────────────────────────────
}


// ─── uploadQR ─────────────────────────────────────────────────────────────────
//
//  ปัจจุบัน: QR Code เก็บใน localStorage ของ browser (AdminPayment.jsx)
//  ข้อจำกัด: admin upload QR บนเครื่องหนึ่ง ลูกค้าบนเครื่องอื่นไม่เห็น
//
//  วิธีเปิดใช้งาน (ต้องแก้ AdminPayment.jsx ด้วย):
//  1. ใน AdminPayment.jsx แทนที่ localStorage.setItem ด้วย:
//       await uploadQR(method.id, base64OrUrl);
//  2. เพิ่ม getQR() ใน PaymentQR component (TopupStep2Modal + MailPassPage)
//     แทนที่ localStorage.getItem
//
//  payload: { methodId: string, qrData: string }  — base64 หรือ URL
//  Response ที่ต้องการ: { url: string }  — URL ของรูปบน server
//
export async function uploadQR(methodId, qrData) {
  // ── REMOVE ────────────────────────────────────────────────────────────
  console.log('[topupService] uploadQR (mock — ยังใช้ localStorage)', { methodId });
  return { url: qrData };
  // ─────────────────────────────────────────────────────────────────────

  // ── UNCOMMENT ─────────────────────────────────────────────────────────
  // return apiPost('/api/qr/upload', { methodId, qrData });
  // ─────────────────────────────────────────────────────────────────────
}


// ─── getQR ────────────────────────────────────────────────────────────────────
//
//  ดึง QR URL ของแต่ละ payment method จาก server
//  ปัจจุบัน: อ่านจาก localStorage โดยตรงใน PaymentQR component
//
//  Response ที่ต้องการ: { url: string|null }
//
export async function getQR(methodId) {
  // ── REMOVE ────────────────────────────────────────────────────────────
  const url = localStorage.getItem(`alaskan_qr_${methodId}`) || null;
  return { url };
  // ─────────────────────────────────────────────────────────────────────

  // ── UNCOMMENT ─────────────────────────────────────────────────────────
  // const res = await fetch(`${API_BASE}/api/qr/${methodId}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────────────────
}
