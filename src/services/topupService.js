// ═══════════════════════════════════════════════════════════════════
//  topupService.js — ไฟล์เชื่อมต่อ Backend สำหรับระบบเติมเกม
//
//  ⚠️  ตอนนี้เป็น "mock" ทั้งหมด — ยังไม่มี API จริง
//  ✅  เดฟทำแค่ไฟล์นี้ไฟล์เดียว ก็ครอบคลุมทุกเกมในระบบ
// ═══════════════════════════════════════════════════════════════════

// ─── สร้างออเดอร์ใหม่ ────────────────────────────────────────────
//
//  ถูกเรียกเมื่อผู้ใช้กดปุ่ม "ยืนยันการสั่งซื้อ" ใน TopupPage.jsx
//
//  ข้อมูลที่ได้รับ:
//    gameId   — ชื่อเกม เช่น 'ROV', 'Free Fire', 'PUBG Mobile'
//    uid      — User ID ที่ผู้ใช้กรอก
//    packages — array ของแพ็กเกจที่เลือก [{ id, amount, price, label }]
//    totalPrice — ราคารวมทั้งหมด (บาท)
//
//  ต้อง return:
//    { orderId: string, status: 'pending' }
//
export async function createOrder({ gameId, uid, packages, totalPrice }) {
  // ══════════════════════════════════════════════════════════════
  //  [BACKEND] ขั้นตอนที่ต้องทำ:
  //  1. ลบ 2 บรรทัดล่างสุด (console.log + return mock) ออก
  //  2. uncomment โค้ด fetch ด้านล่างนี้
  // ══════════════════════════════════════════════════════════════
  // return await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ gameId, uid, packages, totalPrice }),
  // }).then(r => r.json());
  // ── ต้อง return: { orderId: string, status: 'pending' } ──

  console.log('[topupService] createOrder (mock)', { gameId, uid, packages, totalPrice });
  return { orderId: 'MOCK-' + Date.now(), status: 'pending' };
}
