# ALASKAN SHOP — Dev Handoff

Frontend พร้อมส่งมอบแล้ว เหลืองาน backend และ 5 จุด activate

**สถานะล่าสุด:** Build ผ่าน ✓ | Deploy บน Vercel แล้ว ✓ | 2026-06-09

---

## Pre-Handoff Checklist

| รายการ | สถานะ |
|---|---|
| `npm run build` ผ่าน | ✅ (465KB JS / 92KB CSS) |
| ไม่มี console.log นอก topupService.js | ✅ |
| TODO ทั้งหมดเป็น `[API]` markers ตั้งใจ | ✅ |
| Deploy ขึ้น Vercel | ✅ https://alaskan.vercel.app |
| HANDOFF.md + topupService.js พร้อม | ✅ |

---

## สิ่งที่ frontend ทำเสร็จแล้ว

- หน้า Home พร้อม HeroSlider (7 slides), GameGrid (23 เกม), PromoGrid, Footer
- หน้าเติมเกม UID (TopupPage) — เลือกแพ็ค, กรอก UID, สรุปออเดอร์, แนบสลิป
- หน้าเติมเกม Mail/Pass (MailPassPage) — กรอก email/password หรือ accountFields ตาม game config
- Validation ครบ — field required, payment not selected แสดง error สีแดง
- Admin panel — Dashboard, Orders, Games, Payment (QR upload), News
- QR Code แสดงผลใน TopupStep2Modal และ MailPassPage (ลูกค้าเห็น)
- Admin upload QR แต่ละธนาคารได้จาก AdminPayment
- Vercel demo: https://alaskan.vercel.app

---

## Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 18 + Vite |
| Styling | CSS (inline `<style>` ต่อ component) |
| Icons | react-icons (fi, bs, fa) |
| Font | PSL Empire Pro, PSL Chocolate Extra Pro |
| Deploy (demo) | Vercel (auto-deploy จาก GitHub `main`) |

---

## โครงสร้างไฟล์สำคัญ

```
src/
  config/
    games.js          — รายชื่อเกม UID ทั้งหมด (23 เกม) + packages + ราคา
    mailpassGames.js  — รายชื่อเกม Mail/Pass + accountFields ต่อเกม
    constants.js      — PAYMENT_METHODS, COUNTRY_NAMES
    homeData.js       — ข้อมูล HeroSlider, PromoGrid

  services/
    topupService.js   — API layer (ทั้งหมดยังเป็น mock — ดู "งานที่ต้องทำ")

  components/
    TopupPage.jsx           — หน้าเติม UID
    TopupStep2Modal.jsx     — modal step 2 (UID input + payment + QR)
    MailPassPage.jsx        — หน้าเติม Mail/Pass
    AdminPage.jsx           — shell หน้า admin + nav
    admin/
      AdminDashboard.jsx    — ภาพรวมออเดอร์
      AdminOrders.jsx       — จัดการออเดอร์ (เปลี่ยนสถานะ)
      AdminGames.jsx        — แก้ไขข้อมูลเกม (ชื่อ, icon, tag)
      AdminPayment.jsx      — upload QR ต่อธนาคาร
      AdminNews.jsx         — จัดการข่าวสาร
      AdminLogin.jsx        — หน้า login (ปัจจุบัน bypass — ดูด้านล่าง)
      adminShared.js        — constants, mock data, shared styles
```

---

## งานที่ dev team ต้องทำ

### 1. สร้าง API Endpoints (5 ตัว)

ดู `src/services/topupService.js` — แต่ละ function มี comment บอก payload + response ที่ต้องการ

| Endpoint | Method | ใช้ใน |
|---|---|---|
| `POST /api/orders` | createOrder | TopupPage, MailPassPage — เมื่อลูกค้ากดยืนยัน |
| `GET /api/orders` | getOrders | AdminPage — โหลดรายการออเดอร์ |
| `POST /api/orders/status` | updateOrderStatus | AdminOrders — เปลี่ยนสถานะออเดอร์ |
| `POST /api/qr/upload` | uploadQR | AdminPayment — admin upload QR รูปภาพ |
| `GET /api/qr/:methodId` | getQR | TopupStep2Modal, MailPassPage — ลูกค้าเห็น QR |

**วิธี activate แต่ละ function ใน `topupService.js`:**
1. ลบบรรทัดที่มี `// REMOVE` (console.log + mock return)
2. uncomment บล็อค fetch ที่มี `// UNCOMMENT`

ตัวอย่าง `createOrder`:
```js
// ลบสองบรรทัดนี้:
console.log('[topupService] createOrder (mock)', payload);
return { orderId: 'MOCK-' + Date.now(), status: 'pending' };

// เปิดบรรทัดนี้:
return apiPost('/api/orders', payload);
```

---

### 2. เปิดใช้งาน getOrders ใน AdminPage

ไฟล์: `src/components/AdminPage.jsx`

```js
// 1. เพิ่ม useEffect ใน import บรรทัดแรก:
import { useState, useEffect } from 'react';

// 2. uncomment บรรทัดนี้ (บรรทัด 7):
import { getOrders } from '../services/topupService';

// 3. เปลี่ยน useState:
const [orders, setOrders] = useState([]);  // เปลี่ยนจาก useState(INIT_ORDERS)

// 4. เพิ่ม useEffect หลัง useState:
useEffect(() => {
  if (!authed) return;
  getOrders().then(setOrders);
}, [authed]);

// 5. ลบ import INIT_ORDERS, INIT_NEWS และลบ INIT_NEWS mock ใน adminShared.js
```

---

### 3. QR — ย้ายจาก localStorage ไป server

ปัจจุบัน admin upload QR แล้วเก็บใน `localStorage` ของ browser
ลูกค้าบนเครื่องอื่นจะไม่เห็น QR — ต้องเก็บบน server แทน

**`src/components/admin/AdminPayment.jsx`** (admin upload):
```js
// เปลี่ยนจาก:
localStorage.setItem(`alaskan_qr_${method.id}`, data);

// เป็น:
import { uploadQR } from '../../services/topupService';
await uploadQR(method.id, data);
```

**`src/components/TopupStep2Modal.jsx`** และ **`src/components/MailPassPage.jsx`** (ลูกค้าเห็น QR):
```js
// เปลี่ยนจาก:
setQr(localStorage.getItem(`alaskan_qr_${selectedPayment}`) || TEST_QR);

// เป็น:
import { getQR } from '../services/topupService';
getQR(selectedPayment).then(r => setQr(r.url || TEST_QR));
```

---

### 4. ระบบ Auth Admin

ปัจจุบัน: login ถูก bypass (`authed = true` ใน AdminPage.jsx)

**วิธีเปิดใช้งาน login จริง:**

`src/components/AdminPage.jsx` บรรทัด 24:
```js
// เปลี่ยนจาก:
const [authed, setAuthed] = useState(true); // DEV

// เป็น:
const [authed, setAuthed] = useState(false);
```

Credentials ปัจจุบัน (frontend-only ชั่วคราว) อ่านจาก env — รับค่าจริงจาก frontend dev แยกต่างหาก

**Phase 2** — เปลี่ยนเป็น backend JWT: แก้ `handleSubmit` ใน `AdminLogin.jsx` ให้ POST ไปยัง `/api/auth/login` แล้วเก็บ token ใน httpOnly cookie

> **หมายเหตุ:** หน้า Admin เข้าได้ผ่าน URL `/admin` หรือกด Ctrl+Shift+A บนหน้าเว็บ (shortcut ซ่อนไว้) ไม่มีปุ่มในหน้าหลักแล้ว

---

### 5. ลบ Mock Data

`src/components/admin/adminShared.js`:
- ลบ `INIT_ORDERS` และ `INIT_NEWS` หลังจาก API ทำงานได้แล้ว
- ลบ `import { INIT_ORDERS, INIT_NEWS }` ใน `AdminPage.jsx`

---

## Environment Variables

| ตัวแปร | ที่ใช้ | ค่าตัวอย่าง |
|---|---|---|
| `VITE_API_BASE` | `topupService.js` — prefix ทุก API call | `https://api.alaskan.shop` |
| `VITE_ADMIN_USER` | `adminShared.js` — admin username (ชั่วคราว) | `alaskan` |
| `VITE_ADMIN_PASS` | `adminShared.js` — admin password (ชั่วคราว) | `ADMIN2025` |

ตั้งบน Vercel: Settings > Environment Variables
ตั้ง local: สร้างไฟล์ `.env.local` ที่ root

```env
VITE_API_BASE=https://your-api-domain.com
VITE_ADMIN_USER=your-admin-username
VITE_ADMIN_PASS=your-admin-password
```

---

## ลำดับการทำ (แนะนำ)

```
Phase 1 — API + Orders
  1. สร้าง POST /api/orders
  2. activate createOrder() ใน topupService.js
  3. สร้าง GET /api/orders + activate getOrders()
  4. สร้าง POST /api/orders/status + activate updateOrderStatus()
  5. ลบ INIT_ORDERS mock

Phase 2 — QR Server
  6. สร้าง POST /api/qr/upload + GET /api/qr/:methodId
  7. activate uploadQR() และ getQR()
  8. แก้ AdminPayment.jsx + TopupStep2Modal.jsx + MailPassPage.jsx

Phase 3 — Auth
  9. สร้าง POST /api/auth/login (return JWT)
  10. เปลี่ยน AdminLogin.jsx ให้ POST + เก็บ token
  11. เปลี่ยน authed กลับเป็น false ใน AdminPage.jsx
  12. ลบ DEV bypass comment
```

---

## TODO [API] markers ในโค้ด

ค้นหา `TODO [API]` จะเจอ 14 จุดใน 5 ไฟล์:

| ไฟล์ | จำนวน | เรื่อง |
|---|---|---|
| `topupService.js` | 5 functions | REMOVE/UNCOMMENT per function |
| `AdminPage.jsx` | 4 | useEffect + getOrders + ลบ mock imports |
| `adminShared.js` | 1 | ลบ INIT_ORDERS/INIT_NEWS |
| `AdminPayment.jsx` | 3 | localStorage → uploadQR/getQR/DELETE |
| `TopupStep2Modal.jsx` | 2 | localStorage → getQR |
| `MailPassPage.jsx` | 2 | localStorage → getQR |

---

## หมายเหตุสำหรับ dev team

- **Admin เข้าได้ผ่าน** `#admin` ใน URL หรือ Ctrl+Shift+A (ไม่มีปุ่มในหน้าหลัก)
- **QR ปัจจุบัน** เก็บใน localStorage — ต้อง upload QR บนเครื่องเดียวกับลูกค้าถึงจะเห็น (Phase 2 แก้ได้)
- **console.log** ใน topupService.js เป็น intentional mock markers — ลบได้ทันทีเมื่อ activate API
- **favicon** ใช้ PNG (ALASKAN_3D_LOGO_2000.png) — ไม่ใช้ .svg แล้ว

---

## ข้อมูลติดต่อ

Frontend dev: AlasKan (ghotkung@gmail.com)
Repository: https://github.com/ghotkung-rgb/alakkan
Demo: https://alaskan.vercel.app
