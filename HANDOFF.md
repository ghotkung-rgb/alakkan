# ALASKAN SHOP — Frontend Handoff

> ไฟล์นี้สำหรับ dev team ที่รับช่วง backend ต่อ
> Frontend พร้อม 100% — ต้องทำเฉพาะส่วนที่ระบุด้านล่าง

---

## 1. Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 + CSS-in-JS (inline + `<style>`) |
| Icons | react-icons (Feather set) |
| Routing | Hash-based SPA (`#home`, `#topup/ROV`, `#mailpass/eFootball`) — ไม่ใช้ React Router |
| Deployment | Vercel (demo) → เปลี่ยนเป็น server จริงได้เลย |

---

## 2. Environment Variables

สร้างไฟล์ `.env` ที่ root หรือตั้งค่าบน server:

```env
VITE_ADMIN_USER=your_admin_username
VITE_ADMIN_PASS=your_admin_password
```

> ตัวอย่างดู `.env.example`
> ⚠️ ตอนนี้ใช้ basic username/password — Phase 2 ควรเปลี่ยนเป็น JWT

---

## 3. จุดเชื่อมต่อ Backend (API Integration Points)

### 3.1 สร้างออเดอร์ — จุดสำคัญที่สุด

**ไฟล์:** `src/services/topupService.js`

ไฟล์นี้ไฟล์เดียวครอบคลุมทุกเกม ทั้ง UID และ Mail/Pass

```js
// ปัจจุบัน (mock):
export async function createOrder({ gameId, uid, packages, totalPrice }) {
  return { orderId: 'MOCK-' + Date.now(), status: 'pending' };
}

// เปลี่ยนเป็น (จริง):
export async function createOrder({ gameId, uid, packages, totalPrice }) {
  return await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, uid, packages, totalPrice }),
  }).then(r => r.json());
  // ต้อง return: { orderId: string, status: 'pending' }
}
```

**ข้อมูลที่ส่งไป:**
```json
{
  "gameId": "ROV",
  "uid": "1234567890",
  "packages": [
    { "id": 14, "amount": 555, "price": 435, "label": null }
  ],
  "totalPrice": 435
}
```

**ข้อมูลที่ต้อง return:**
```json
{ "orderId": "ORD-001", "status": "pending" }
```

---

### 3.2 ดึงรายการออเดอร์ (Admin)

**ไฟล์:** `src/components/admin/adminShared.js` บรรทัด 8

```js
// ปัจจุบัน (hardcode mock data):
export const INIT_ORDERS = [ ... ];

// เปลี่ยนเป็น (จริง):
// ใน AdminPage.jsx เพิ่ม useEffect ดึง GET /api/orders แล้วใส่ใน state
// โครงสร้าง order object ดูที่ INIT_ORDERS เป็นตัวอย่าง
```

**โครงสร้าง order object:**
```json
{
  "id": "ORD-001",
  "game": "ROV",
  "type": "UID",
  "pkg": "555 คูปอง",
  "price": 435,
  "uid": "1234567890",
  "status": "pending",
  "date": "2026-06-08 10:23"
}
```

**status ที่รองรับ:** `pending` | `processing` | `completed` | `failed`

---

### 3.3 อัปเดตสถานะออเดอร์ (Admin)

**ไฟล์:** `src/components/admin/AdminOrders.jsx` บรรทัด 96

```js
// ปัจจุบัน (แก้แค่ state ใน browser):
const handleStatusChange = (id, newStatus) => {
  setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  // TODO: PUT /api/orders/:id  { status: newStatus }
};

// เพิ่มบรรทัดนี้:
await fetch(`/api/orders/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: newStatus }),
});
```

---

### 3.4 จัดการข่าวสาร (Admin)

**ไฟล์:** `src/components/admin/AdminNews.jsx`

| บรรทัด | TODO | API ที่ต้องสร้าง |
|--------|------|-----------------|
| 11 | อัปโหลดรูปข่าว | `POST /api/upload` รับ `FormData({ file })` → return `{ url: string }` |
| 91 | สร้างข่าวใหม่ | `POST /api/news` รับ `{ title, content, image, isHot, date }` |
| 94 | แก้ไขข่าว | `PUT /api/news/:id` รับ `{ title, content, image, isHot, date }` |

**โครงสร้าง news object:**
```json
{
  "id": 1,
  "title": "โปรโมชั่น ROV เดือนมิถุนายน",
  "content": "...",
  "image": "/uploads/news1.jpg",
  "imagePosition": 50,
  "isHot": true,
  "date": "2026-06-08"
}
```

ดึงข่าวครั้งแรก: แทนที่ `INIT_NEWS` ด้วย `GET /api/news`

---

### 3.5 Admin Authentication

**ไฟล์:** `src/components/admin/adminShared.js` บรรทัด 4-5

```js
export const ADMIN_USER     = import.meta.env.VITE_ADMIN_USER;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;
```

**ปัจจุบัน:** เช็ค username/password ใน browser (ไม่ปลอดภัย)
**Phase 2:** เปลี่ยน `AdminLogin.jsx` ให้ POST ไป `/api/auth/login` แล้วรับ JWT token กลับมาเก็บใน `localStorage` + ส่ง `Authorization: Bearer <token>` ทุก API call

---

## 4. Config Files — แก้ข้อมูลเกม

### 4.1 เกม UID (`src/config/games.js`)

แต่ละเกมเป็น object ใน `export const GAMES = { ... }`

**โครงสร้างพื้นฐาน:**
```js
'ROV': {
  id: 'ROV',                    // ต้องตรงกับ key
  name: 'ROV',                  // ชื่อที่แสดง
  subtitle: 'Realm of Valor',   // คำอธิบายสั้น
  icon: '/images/...',          // path รูปไอคอน (ใน public/)
  bg: '/images/...',            // path รูปพื้นหลัง
  promoBg: '/images/...',       // รูปแบนเนอร์หน้าเติมเกม (สัดส่วน 21:7)
  howtoImage: '/images/...',    // รูปวิธีการเติม — ต้องมีทุกเกม หรือ null
  category: 'เกม MOBA',
  currency: 'คูปอง',            // หน่วยเงินในเกม
  tags: ['โปรโมชั่น', 'ขายดี'], // ['ขายดี', 'ใหม่', 'โปรโมชั่น']
  showOnHome: true,             // แสดงบน home page หรือไม่
  packages: [ ... ],            // รายการแพ็กเกจ (ดูด้านล่าง)
  accountFields: [ ... ],       // ฟิลด์กรอก UID (ดูด้านล่าง)
}
```

**โครงสร้าง package:**
```js
{ id: 14, amount: 555, price: 435, badge: 'ขายดี', img: '/images/...' }
// amount: จำนวน currency ในเกม
// price: ราคา (บาท)
// badge: 'ขายดี' | 'แนะนำ' | undefined
// label: ข้อความแทน amount เมื่อ amount = 0 (เช่น Weekly Pass)
```

**โครงสร้าง accountFields (ฟิลด์กรอก UID):**
```js
accountFields: [
  { key: 'userId',   label: 'User ID',   placeholder: 'เช่น 123456789', inputMode: 'numeric', required: true },
  // เกมที่ต้องการ Server ID เพิ่มฟิลด์ที่สอง:
  { key: 'serverId', label: 'Server ID', placeholder: 'เช่น 1234',      inputMode: 'numeric', required: true },
]
```

### 4.2 เกม Mail/Pass (`src/config/mailpassGames.js`)

โครงสร้างเดียวกันกับ UID แต่ไม่มี `accountFields` — ใช้ email + password แทน

---

### 4.3 หน้าหลัก (`src/config/homeData.js`)

```js
// โปรโมการ์ดบนสุด
export const PROMOS = [
  { id: 1, name: "ชื่อโปร", img: "/images/...", tag: "HOT",
    gameId: 'ROV',       // ต้องตรงกับ id ใน GAMES หรือ MAILPASS_GAMES
    type: 'uid' },       // 'uid' | 'mailpass'
];

// รูปภาพ Popular Package
export const POPULAR_PACKAGES = [
  { id: 1, img: "/images/PRO/..." },
];
```

---

### 4.4 ช่องทางชำระเงิน (`src/config/constants.js`)

```js
export const PAYMENT_METHODS = [
  { id: 'promptpay', name: 'QR Code Promptpay', ... },
  // เพิ่ม/ลบช่องทางได้ที่นี่
];
```

ตอนนี้แสดง UI เท่านั้น — ต้องเชื่อม payment gateway จริงเมื่อ user เลือกช่องทาง

---

## 5. ที่เก็บรูปภาพ

รูปทั้งหมดอยู่ใน `public/images/` โดยมีโครงสร้าง:

```
public/images/
├── GAMES ICON/           — ไอคอนแอพเกม (.png)
├── GAMES BG/             — รูปพื้นหลังเกม (.png)
├── HOW TO/               — รูปวิธีเติมเกมแต่ละเกม (.jpg)
├── BG_UID/               — แบนเนอร์ 21:7 หน้าเติม UID
├── MAIL/                 — แบนเนอร์ 21:7 หน้าเติม Mail/Pass
├── PRO/                  — รูปโปรโมชั่น
├── ALASKAN_WEB_ASSET/
│   ├── PACKAGE ICON/     — ไอคอนแพ็กเกจแยกตามเกม
│   ├── GAMES ICON/       — ไอคอนในรูปแบบ Alaskan asset
│   ├── BACKGROUND/       — background และ game banner
│   ├── LOGO 3D/          — โลโก้
│   └── FLAG/             — ธงประเทศ (ใช้กับ MLBB multi-server)
```

> ชื่อโฟลเดอร์มีช่องว่าง — path ใน HTML/JS ใช้ได้ปกติ (`/images/GAMES ICON/xxx.png`)
> ในกรณีที่ encode: `/images/HOW%20TO/H_ROV.jpg`

---

## 6. การ Build และ Deploy

```bash
npm install        # ติดตั้ง dependencies
npm run dev        # dev server ที่ localhost:5173
npm run build      # build ไปที่ dist/
```

ไฟล์ที่ได้หลัง build อยู่ใน `dist/` — นำขึ้น server ได้เลย

**Server config สำคัญ:**
เนื่องจากใช้ hash routing (`#...`) server ไม่ต้อง config พิเศษ — `index.html` ตัวเดียวรองรับทุก URL

---

## 7. Development Phases (แผนที่วางไว้)

| Phase | สถานะ | รายละเอียด |
|-------|--------|-----------|
| Phase 1 | รอ dev | เชื่อม `createOrder` → API, ดึงออเดอร์จาก Google Sheets หรือ DB |
| Phase 2 | รอ dev | Payment Gateway (PromptPay, ShopeePay ฯลฯ) |
| Phase 3 | รอ dev | Game API อัตโนมัติ (เติมเกมผ่าน API ของเกมโดยตรง) |

---

## 8. ไฟล์ที่ไม่ต้องแตะ

| ไฟล์ | เหตุผล |
|------|--------|
| `src/components/Navbar.jsx` | ออกแบบตำแหน่งตายตัว |
| `src/components/HeroSlider.jsx` | animation ซับซ้อน |
| `src/components/GameGrid.jsx` | card style มาตรฐานโปรเจกต์ |
| `src/index.css` | ใช้ custom font + animation ทั้งเว็บ |

---

## 9. Summary — สิ่งที่ dev ต้องทำ

1. **สร้าง API endpoints** ตามข้อ 3 (ใช้ Express / FastAPI / ฯลฯ ก็ได้)
2. **แก้ `topupService.js`** ไฟล์เดียว — uncomment โค้ดที่ comment ไว้แล้ว
3. **แก้ `adminShared.js`** — เปลี่ยน `INIT_ORDERS` / `INIT_NEWS` ดึงจาก API แทน
4. **ตั้ง `.env`** บน server (`VITE_ADMIN_USER`, `VITE_ADMIN_PASS`)
5. **เพิ่มข้อมูลเกม** ที่ยังขาดใน `games.js` / `mailpassGames.js` (packages + ราคา)
6. **เชื่อม Payment Gateway** ใน `constants.js` + `TopupPage.jsx` Step 3
