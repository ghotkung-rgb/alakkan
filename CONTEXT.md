# ALASKAN SHOP — Project Context

> เอกสารนี้เขียนไว้สำหรับ AI agent (Claude, Codex, หรืออื่นๆ) ที่เข้ามาทำงานกับโปรเจกต์นี้
> อ่านไฟล์นี้ก่อนเสมอ — มันอธิบาย domain, architecture, patterns, และ conventions ทั้งหมด

---

## 1. Overview

**ALASKAN SHOP** คือร้านรับเติมเกมออนไลน์ (game top-up store) สำหรับตลาดไทย ให้บริการเติม in-game currency ให้กับผู้เล่น มีสองรูปแบบบริการ:

- **UID Top-up**: ลูกค้าให้แค่ Player ID → ร้านเติม currency โดยตรง
- **Mail/Pass Top-up**: ลูกค้าให้ email + password → ร้านล็อกอินเข้าเติมแทน

**Tech Stack:**
- React (functional components + hooks) — no class components
- Vite (bundler + dev server)
- Tailwind CSS v3
- react-icons
- ไม่มี router library — ใช้ `window.history.pushState` แบบ custom SPA

**Deploy:** GitHub Pages ผ่าน GitHub Actions (push to `main` → auto-deploy)
URL: `https://ghotkung.github.io/alakkan`

---

## 2. File Structure

```
src/
├── App.jsx                    # Root — navigation state, history management
├── main.jsx                   # Entry point
├── index.css                  # Global styles + CSS animations (bgFadeIn ฯลฯ)
│
├── components/
│   ├── Navbar.jsx             # Top navigation bar (position:absolute, overlay บน hero)
│   ├── Home.jsx               # หน้าแรก — Hero slider + promo cards + game cards
│   ├── Agents.jsx             # Character showcase page (cinematic bg style)
│   ├── News.jsx               # ข่าวสาร/อัปเดต
│   ├── AdminPage.jsx          # Admin panel (hidden, เปิดด้วย Ctrl+Shift+A)
│   │
│   ├── TopupHub.jsx           # หน้ารวมเกม UID — เลือกเกมก่อนเข้าหน้าเติม
│   ├── TopupPage.jsx          # หน้าเติมเกม UID (generic — ใช้กับทุกเกม)
│   │
│   ├── MailPassHub.jsx        # หน้ารวมเกม Mail/Pass — เลือกเกมก่อนเข้าหน้าเติม
│   ├── MailPassPage.jsx       # หน้าเติมเกม Mail/Pass (generic — ใช้กับทุกเกม)
│   │
│   ├── Howto.jsx              # คู่มือวิธีใช้บริการ (placeholder — ยังไม่มีเนื้อหาจริง)
│   ├── MascotHero.jsx         # Demo component (ไม่ได้ใช้แล้ว — ไม่ต้อง import)
│   └── GameShowMore.jsx       # ปุ่ม "ดูเพิ่มเติม" ใน game grid (helper)
│
├── config/
│   ├── games.js               # Config เกม UID ทั้งหมด → export GAMES object
│   └── mailpassGames.js       # Config เกม Mail/Pass ทั้งหมด → export MAILPASS_GAMES object
│
└── services/
    └── topupService.js        # Service layer — createOrder() stub (ยังเป็น mock, backend dev จะเติม API)
```

---

## 3. Navigation Architecture

โปรเจกต์นี้ **ไม่ใช้ React Router** — ใช้ `window.history.pushState` แบบ manual SPA

### State ที่ควบคุมการแสดงผล (ทั้งหมดอยู่ใน `App.jsx`)

```js
activeMenu     // string: 'HOME' | 'ข่าวสาร' | 'บริการเติมเกม' | 'บริการ Mail/Pass' | 'เอเจน' | 'ADMIN'
topupGame      // string | null: game ID ที่เลือกใน UID flow (e.g. 'ROV', 'FREE_FIRE')
mailpassGame   // string | null: game ID ที่เลือกใน Mail/Pass flow
topupStep      // number | string: 1 | 2 | 3 | 'howto' (step ใน UID checkout)
mailpassStep   // number | string: 1 | 2 | 3 | 'howto' (step ใน Mail/Pass checkout)
```

### Logic การแสดงผล

```
ถ้า topupGame ไม่ null + มีอยู่ใน GAMES    → แสดง <TopupPage>
ถ้า mailpassGame ไม่ null + มีอยู่ใน MAILPASS_GAMES → แสดง <MailPassPage>
ไม่งั้น → แสดงตาม activeMenu
```

### History entries

ทุกการเปลี่ยนหน้าและทุก step จะ `pushState` ลง browser history — ปุ่ม back ของ browser ทำงานได้ถูกต้องตลอด flow

**ยกเว้น:** `done` (success screen หลังสั่งซื้อสำเร็จ) เป็น local state ใน component — ไม่ push history เพราะไม่ต้องการให้ back กลับมาที่ order ที่ confirm แล้ว

### Functions ใน App.jsx

```js
navigate(next)              // เปลี่ยนหน้า + pushState (รีเซต step เป็น 1 เสมอ)
navigateTopupStep(newStep)  // เปลี่ยน step ใน UID flow + pushState
navigateMailpassStep(newStep) // เปลี่ยน step ใน Mail/Pass flow + pushState
goTopup(gameId)             // navigate ไปหน้าเติม UID ของเกม gameId
goMailPass(gameId)          // navigate ไปหน้าเติม Mail/Pass ของเกม gameId
handleMenuChange(menu)      // เปลี่ยน menu item + ล้าง topupGame/mailpassGame
```

---

## 4. Config System

### `src/config/games.js` → `GAMES`

Object ที่ key คือ game ID (string), value คือ game config:

```js
GAMES = {
  ROV: {
    id: 'ROV',
    name: 'ROV',
    subtitle: 'Realm of Valor — เติมคูปอง',
    icon: '/images/GAMES ICON/ROV_iconapp.png',
    bg: '/images/GAMES BG/ROV_bg.png',
    category: 'เกม MOBA',         // ใช้จัดกลุ่มใน Hub
    currency: 'คูปอง',             // ชื่อ in-game currency ของเกมนี้
    tags: ['โปรโมชั่น', 'ขายดี'],  // optional — แสดงบน card
    info: { title, taglines, sections }, // ข้อความ info box ในหน้าเติม
    packages: [                    // รายการ package ที่ขาย
      {
        id: 'rov_35',
        amount: 35,                // จำนวน currency
        price: 20,                 // ราคา (บาท)
        icon: '/images/.../35.png',
        badge: 'แนะนำ',           // optional badge บน card
      },
      // ...
    ],
  },
  FREE_FIRE: { ... },
  // ...
}
```

**เกมที่ยังไม่มี packages** (coming-soon): มี config ครบแต่ `packages: []` — TopupPage จะแสดง coming-soon screen อัตโนมัติ

### `src/config/mailpassGames.js` → `MAILPASS_GAMES`

โครงสร้างเดียวกับ `GAMES` แต่ใช้กับ Mail/Pass flow ค่ะ

---

## 5. Checkout Flow

### UID Top-up (TopupPage.jsx)

```
Hub → Step 1: เลือก package + กรอก UID
    → Step 2: ยืนยัน order
    → Step 3: ชำระเงิน
    → done: Success screen (local state, ไม่ใน history)
    → 'howto': หน้า Howto (ใน history — back กลับ step 1 ได้)
```

Props ที่ `TopupPage` รับ:
```js
{ game, onBack, step, onStep }
// game   = object จาก GAMES[gameId]
// onBack = () => window.history.back()  (จาก App)
// step   = topupStep state จาก App
// onStep = navigateTopupStep จาก App
```

### Mail/Pass Top-up (MailPassPage.jsx)

โครงสร้างเดียวกัน — รับ `{ game, onBack, step, onStep }` เหมือนกันทุกอย่าง

---

## 6. Service Layer

`src/services/topupService.js` มี function `createOrder(orderData)`:

- ปัจจุบันเป็น **mock stub** — log ข้อมูลและ return `{ success: true, orderId: 'MOCK-...' }`
- Backend dev จะเชื่อมต่อ API จริงในภายหลัง
- **อย่าแก้ไข business logic ใน service file** — frontend แค่ call `createOrder()` แล้วรอ response

---

## 7. Key UI Patterns

### Navbar
- `position: absolute` — ลอยทับ hero (ไม่ fixed, ไม่ sticky)
- โปร่งแสงที่ root page, มี bg เมื่อ scroll หรืออยู่หน้าอื่น
- Logo เป็นรูปภาพ ไม่ใช่ text

### Hero Slider (Home.jsx)
- รูปจาก `/images/PRO/` — `background-size: contain`
- Manual navigation only (ไม่ auto-play)
- Thumbnail bar ซ้ายล่าง
- Height: `clamp(420px, 58vw, 790px)`

### Agents Page (Agents.jsx)
- Cinematic background: 5 absolute layers ซ้อนกัน
  1. bg image (vivid, full bleed)
  2. bottom fade gradient → `#0a0f14`
  3. side vignette (left+right)
  4. top bar (readability)
  5. accent glow radial-gradient (per-character color)
- Character switch มี `bgFadeIn` animation (keyframe ใน index.css)

### Game Cards
- Named const vars สำหรับ layout values ที่ปรับบ่อย (catTop, catLeft, barPadLeft, iconMT, nameTop)
- ใช้ `filter: drop-shadow()` แทน `box-shadow` เพราะ clip-path จะตัด box-shadow ทิ้ง

### Package Cards (TopupPage / MailPassPage)
- `selected` state → highlight border + scale
- `badge` จาก config → label overlay บน card
- แสดงราคาเป็นบาท (ไม่ใช่ currency อื่น)

---

## 8. Backend Integration Plan

**Phase 1 (ปัจจุบัน):** Manual fulfillment + Google Sheets logging
- Frontend ส่ง order ข้อมูลผ่าน `topupService.createOrder()`
- Admin ดู order ใน Google Sheets แล้วเติมมือ

**Phase 2:** Payment gateway integration (PromptPay / QR)

**Phase 3:** Game API — เติมอัตโนมัติผ่าน official API (ROV, FF)

**Frontend dev ทำแค่:** UI + ส่งข้อมูลไป service layer — ไม่ต้องสนใจ backend internals

---

## 9. Conventions & Rules

- **ห้ามใช้ dark theme** ใน TopupPage / MailPassPage — ธีมเป็นขาว `#f0f4f8`
- **ห้าม hardcode currency** (เช่น "คูปอง") ใน component — ดึงจาก `game.currency` เสมอ
- **ห้าม px ตายตัว** ใน hero/slider — ใช้ `vw`, `vh`, `clamp()` เพื่อป้องกัน zoom bug
- **ห้าม transform ชน animation** — ถ้ามี animation อยู่แล้ว ใช้ wrapper div สำหรับ transform แยก
- **Named const vars** สำหรับ layout values ที่ปรับบ่อย — ไม่ hardcode inline
- **react-icons** ใช้แล้ว (fi, io, gi, bi) — import จาก `react-icons/fi` ฯลฯ
- ไม่มี `MascotHero` ใน production — component มีอยู่แต่ไม่ได้ import ที่ไหน

---

## 10. Pages & Menus

| `activeMenu` value | Component | หมายเหตุ |
|---|---|---|
| `'HOME'` | `Home.jsx` | หน้าแรก |
| `'ข่าวสาร'` | `News.jsx` | |
| `'บริการเติมเกม'` | `TopupHub.jsx` | entry → `TopupPage` |
| `'บริการ Mail/Pass'` | `MailPassHub.jsx` | entry → `MailPassPage` |
| `'เอเจน'` | `Agents.jsx` | character showcase |
| `'ADMIN'` | `AdminPage.jsx` | ซ่อน, เปิดด้วย Ctrl+Shift+A |

---

## 11. Pending Work (ณ วันที่ทำ handoff)

- [ ] Agents page: ต้องการรูปจริง (avatar, full-body, bg image ของแต่ละ character, skill icons)
- [ ] Howto.jsx: ยังเป็น placeholder — ต้องการเนื้อหาขั้นตอนจริง
- [ ] Mail/Pass: eFootball, Heartopia, Call of Duty ยังไม่มี packages
- [ ] UID: หลายเกมยังเป็น coming-soon (packages ว่าง)
- [ ] Mobile hamburger menu ใน Navbar (ยังไม่ได้ทำ)
- [ ] AdminPage: ซ่อนอยู่ ยังไม่ได้ redesign
- [ ] Login/Register modal (ยังไม่ได้เริ่ม)
- [ ] Order History UI (ยังไม่ได้เริ่ม)
- [ ] `topupService.createOrder()` ยังเป็น mock — รอ backend dev เชื่อม API

---

## 12. Domain Glossary

**Currency**: สิ่งที่ผู้เล่นได้รับหลังเติมเกม (คูปอง/เพชร/UC ฯลฯ) — ไม่ใช่เงินจริง

**UID Top-up**: เติมโดยใช้แค่ Player ID

**Mail/Pass Top-up**: เติมโดยให้ email + password ของ account เกม

**Package**: สินค้า 1 รายการ (amount + price)

**Order**: รายการสั่งซื้อ 1 ใบ (packages + UID/credential + ราคารวม)

**Hub**: หน้ารวมเกมก่อนเลือกเข้าหน้าเติม

**Coming Soon**: เกมที่มี config แต่ `packages: []` — ยังสั่งไม่ได้

**Badge**: ป้ายบน package เดี่ยว ("แนะนำ", "ขายดี")

**Promotion**: tag ระดับเกมที่แสดงใน Hero Slider — ไม่ใช่ส่วนลด

**Fulfillment**: กระบวนการส่ง currency ให้ลูกค้าหลัง order ยืนยัน (ปัจจุบัน manual)
