# ALASKAN SHOP — Project Context

> เอกสารนี้เขียนไว้สำหรับ AI agent (Claude, Codex, หรืออื่นๆ) ที่เข้ามาทำงานกับโปรเจกต์นี้
> อ่านไฟล์นี้ก่อนเสมอ — มันอธิบาย domain, architecture, patterns, และ conventions ทั้งหมด

---

## 1. Overview

**ALASKAN SHOP** คือร้านรับเติมเกมออนไลน์ (game top-up store) สำหรับตลาดไทย ให้บริการเติม in-game currency ให้กับผู้เล่น มีสองรูปแบบบริการ:

- **UID Top-up**: ลูกค้าให้แค่ Player ID → ร้านเติม currency โดยตรง
- **Mail/Pass Top-up**: ลูกค้าให้ email + password → ร้านล็อกอินเข้าเติมแทน

**Tech Stack:**
- React 19 (functional components + hooks) — ไม่มี class components ยกเว้น `ErrorBoundary`
- Vite 8 (bundler + dev server)
- Tailwind CSS v4
- react-icons (fi, fa, bs)
- ไม่มี router library — ใช้ `window.history.pushState` + URL hash แบบ custom SPA
- sharp (devDep) — compress รูปก่อน build

**Deploy:** Vercel (auto-deploy จาก `main` branch)
**URL:** `https://ghotkung.github.io/alakkan` (หรือ Vercel URL)

---

## 2. File Structure

```
src/
├── App.jsx                    # Root — navigation state, history, ErrorBoundary
├── main.jsx                   # Entry point
├── index.css                  # Global styles: fonts, animations, home/slider CSS
│
├── components/
│   ├── Navbar.jsx             # Top nav (position:absolute, overlay บน hero)
│   ├── Footer.jsx             # Footer — social links, copyright
│   ├── Home.jsx               # หน้าแรก — HeroSlider + PromoGrid + GameGrid
│   ├── HeroSlider.jsx         # Slider 7 ใบ (promo/layer/video), dots, thumbnail bar
│   ├── PromoGrid.jsx          # Promo card carousel
│   ├── GameGrid.jsx           # ตารางเกม (clip-path cards, badge, tag)
│   ├── News.jsx               # ข่าวสาร/อัปเดต
│   ├── ErrorBoundary.jsx      # React error boundary (class component)
│   │
│   ├── TopupHub.jsx           # หน้ารวมเกม UID (ปัจจุบันปิดใช้งาน — ไม่อยู่ใน nav)
│   ├── TopupPage.jsx          # หน้าเติมเกม UID (generic — ใช้กับทุกเกม)
│   ├── TopupPage.css          # CSS เฉพาะ TopupPage (hero, game bar, grid, summary, modal)
│   ├── TopupStep2Modal.jsx    # Modal step 2 — กรอก UID + เลือกชำระเงิน
│   ├── TopupSuccess.jsx       # Success overlay หลัง order ยืนยัน
│   ├── TopupHowto.jsx         # Howto modal (popup รูปวิธีเติม, zoom/pan ได้)
│   │
│   ├── MailPassHub.jsx        # หน้ารวมเกม Mail/Pass — เลือกเกมก่อนเข้าหน้าเติม
│   ├── MailPassPage.jsx       # หน้าเติมเกม Mail/Pass (generic)
│   ├── MailPassPage.css       # CSS เฉพาะ MailPassPage (mirror pattern ของ TopupPage)
│   │
│   ├── AdminPage.jsx          # Admin panel wrapper (login → แยก sub-tabs)
│   └── admin/
│       ├── AdminLogin.jsx     # หน้า login admin (dark portal)
│       ├── AdminDashboard.jsx # Dashboard — stats + quick actions
│       ├── AdminGames.jsx     # จัดการรายการเกม
│       ├── AdminOrders.jsx    # รายการออเดอร์
│       ├── AdminNews.jsx      # จัดการข่าวสาร
│       └── adminShared.js     # ADMIN_USER / ADMIN_PASSWORD จาก import.meta.env
│
├── config/
│   ├── games.js               # Config เกม UID ทั้งหมด → export GAMES object
│   ├── mailpassGames.js       # Config เกม Mail/Pass ทั้งหมด → export MAILPASS_GAMES object
│   ├── constants.js           # PAYMENT_METHODS, COUNTRY_NAMES, COUNTRY_NAMES_TH, FLAG_BASE
│   └── homeData.js            # ข้อมูลคงที่สำหรับ Home (slides, promo cards, ฯลฯ)
│
└── services/
    └── topupService.js        # Service layer — createOrder() stub (mock, backend dev จะเติม API)
```

ไฟล์ที่ไม่มีในโปรเจกต์: `Agents.jsx`, `Howto.jsx`, `MascotHero.jsx`, `GameShowMore.jsx`, `TopupHub.jsx` (มีไฟล์แต่ไม่ได้ใช้)

---

## 3. Navigation Architecture

โปรเจกต์นี้ **ไม่ใช้ React Router** — ใช้ URL hash (`#home`, `#topup/ROV` ฯลฯ) + `window.history.pushState`

### State ที่ควบคุมการแสดงผล (ทั้งหมดอยู่ใน `App.jsx`)

```js
activeMenu     // 'HOME' | 'ข่าวสาร' | 'บริการ Mail/Pass' | 'ADMIN'
topupGame      // string | null: game ID ที่เลือกใน UID flow (e.g. 'ROV', 'FREE_FIRE')
mailpassGame   // string | null: game ID ที่เลือกใน Mail/Pass flow
topupStep      // 1 | 2
mailpassStep   // 1 | 2
```

### URL Hash Mapping

| Hash | State |
|---|---|
| `#home` | HOME |
| `#news` | ข่าวสาร |
| `#mailpass` | บริการ Mail/Pass (MailPassHub) |
| `#admin` | ADMIN |
| `#topup/ROV` | TopupPage เกม ROV |
| `#mailpass/HONKAI` | MailPassPage เกม HONKAI |

### Logic การแสดงผล

```
ถ้า topupGame ไม่ null + มีใน GAMES        → แสดง <TopupPage>
ถ้า mailpassGame ไม่ null + มีใน MAILPASS_GAMES → แสดง <MailPassPage>
ไม่งั้น → แสดงตาม activeMenu
```

TopupPage / MailPassPage แสดงโดยตรงโดยไม่ผ่าน Hub — user คลิกเกมใน GameGrid หรือ HeroSlider แล้ว `goTopup(gameId)` เรียกทันที

### เปิด Admin

- Navbar มีปุ่ม login ทางขวา → `handleMenuChange('ADMIN')`
- `Ctrl + Shift + A` — toggle เข้า/ออก admin ได้ตลอด

### Functions ใน App.jsx

```js
navigate(next)               // เปลี่ยนหน้า + pushState + exit animation 160ms
navigateTopupStep(newStep)   // เปลี่ยน step ใน UID flow
navigateMailpassStep(newStep)// เปลี่ยน step ใน Mail/Pass flow
goTopup(gameId)              // ไปหน้าเติม UID
goMailPass(gameId)           // ไปหน้าเติม Mail/Pass
handleMenuChange(menu)       // เปลี่ยน menu + ล้าง topupGame/mailpassGame
```

### Scroll & Session Persistence

- `beforeunload` → บันทึก scroll position ลง `sessionStorage`
- refresh → คืน scroll position กลับ
- `topup_account_{game.name}` ใน sessionStorage → คืน UID ที่กรอกไว้เมื่อกลับมาหน้าเดิม

---

## 4. Config System

### `src/config/games.js` → `GAMES`

```js
GAMES = {
  ROV: {
    id: 'ROV',
    name: 'ROV',
    subtitle: 'Realm of Valor — เติมคูปอง',
    icon: '/images/GAMES ICON/ROV_iconapp.png',
    bg: '/images/GAMES BG/ROV_bg.png',
    promoBg: '/images/PRO/ROV.png',     // banner ด้านบนหน้าเติม (optional)
    promoAspect: '21 / 9',              // aspect ratio ของ promoBg (optional, default '21/9')
    category: 'เกม MOBA',
    currency: 'คูปอง',
    tags: ['โปรโมชั่น', 'ขายดี'],       // optional — tag badge บน GameGrid card
    accountFields: [                    // optional — ถ้าไม่มี default เป็น UID field
      { key: 'uid', label: 'User ID (UID)', placeholder: '...', inputMode: 'numeric', required: true },
    ],
    howtoImage: '/images/HOWTO/rov.png',// optional — รูปวิธีเติม (เปิดใน TopupHowto modal)
    info: { title, taglines, sections },// ข้อความ info box ในหน้าเติม
    packages: [
      {
        id: 'rov_35',
        amount: 35,                     // จำนวน currency (0 = ไอเทม ไม่แสดงตัวเลข)
        price: 20,                      // ราคา บาท
        img: '/images/PACKAGE ICON/ROV/35.png',
        label: 'ชื่อไอเทม',             // optional — ถ้า amount=0 แสดง label แทน
        badge: 'แนะนำ',                 // optional: 'แนะนำ' | 'ขายดี'
      },
    ],
  },
}
```

**Coming-soon game:** มี config ครบแต่ `packages: []` — TopupPage แสดง coming-soon screen อัตโนมัติ

### `src/config/mailpassGames.js` → `MAILPASS_GAMES`

โครงสร้างเดียวกับ `GAMES` แต่ field `accountFields` ไม่ได้ใช้ (MailPassPage ใช้ email+password fixed)
และมี `mailpassBg` / `mailpassGames.bg` แยกต่างหากสำหรับบางเกม

### `src/config/constants.js`

```js
PAYMENT_METHODS  // array: { id, name, desc, iconBg, iconText, iconColor, badge, popular }
COUNTRY_NAMES    // { 'thailand': 'Thailand', ... } — ชื่อภาษาอังกฤษ
COUNTRY_NAMES_TH // { 'thailand': 'ไทย', ... } — ชื่อภาษาไทย
FLAG_BASE        // '/images/ALASKAN_WEB_ASSET/FLAG' — path base ของรูปธง
```

---

## 5. Checkout Flow

### UID Top-up

```
GameGrid / HeroSlider → goTopup(gameId) → TopupPage (step 1)
  Step 1: เลือก package + summary card fixed-bottom
       → onStep(2)
  Step 2: TopupStep2Modal (modal) — กรอก UID + เลือกชำระเงิน + howto button
       → handleConfirm()
  done: TopupSuccess overlay (local state ไม่ push history)
```

Props ที่ `TopupPage` รับ:
```js
{ game, onBack, step, onStep, onHome }
```

### Mail/Pass Top-up

```
Navbar 'บริการ Mail/Pass' → MailPassHub → goMailPass(gameId) → MailPassPage (step 1)
  Step 1: เลือก packages (multi-select) + summary card fixed-bottom
       → onStep(2)
  Step 2: Modal — กรอก email + password + เลือกชำระเงิน
       → handleConfirm()
  done: success overlay (local state)
```

---

## 6. Service Layer

`src/services/topupService.js` — `createOrder(orderData)`:

- ปัจจุบันเป็น **mock stub** — log และ return `{ success: true, orderId: 'MOCK-...' }`
- Backend dev จะเชื่อมต่อ API จริงในภายหลัง
- **อย่าแก้ business logic ใน service** — frontend แค่ call `createOrder()` แล้วรอ response

---

## 7. Key UI Patterns

### Font Stack

| Font | ใช้สำหรับ |
|---|---|
| `PSL Empire Pro` | Primary font — ทั้งเว็บ (label, body, section title) |
| `PSL Kampanath Pro` | Game names, hero headings, order summary |
| `Noto Sans Thai` | Form inputs, description text (Thai readability) |
| `Ethnocentric` | UID TOP-UP badge, English section tags |
| `Good Times Rg` | Hero text "ALASKAN" |

### Clip-path Card Pattern (ซิกเนเจอร์ของโปรเจกต์)

```css
clip-path: polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px);
```

- ตัดมุมบนซ้ายและล่างขวา → ดูเหมือนการ์ดเกม
- ใช้ `filter: drop-shadow()` เท่านั้น — `box-shadow` ถูก clip-path ตัดทิ้ง
- `::before` = เส้น gradient ด้านบน (ไฮไลท์ hover)

### Navbar

- `position: absolute` — ลอยทับ hero, ไม่ fixed/sticky
- โปร่งแสงที่ HOME, มี bg ที่หน้าอื่น
- Logo เป็น `<img>` ไม่ใช่ text
- ซ่อนทั้งหมดเมื่ออยู่หน้า ADMIN

### Hero Slider

- 7 ใบ (promo slides + layer slides)
- Aspect ratio: `21 / 9` (`aspect-ratio` CSS)
- Manual navigation — thumbnail bar ซ้ายล่าง + dots กลางล่าง
- Layer slide: 4 PNG layers (shape/char/text/char2) + animation stagger 0.5–1.2s
- ใช้ `translate` CSS property แทน `transform` สำหรับ offset (เพื่อไม่ชน animation)

### Summary Card (Fixed Bottom)

- `.tp-sum-wrap`: `position: fixed; bottom: 0; background: transparent; padding: 0 16px 12px`
- `.tp-sum-card`: clip-path 20px, `border: 2px solid #fff` (เนียนกับพื้นขาว), drop-shadow
- แสดงเมื่อ `step === 1 && selectedPkg !== null`

### Admin

- `AdminLogin.jsx` — dark portal, credentials จาก `.env` (`VITE_ADMIN_USER` / `VITE_ADMIN_PASS`)
- DEV bypass: ว่างทั้งสองช่อง = เข้าได้ (สำหรับ local dev)
- Navbar ซ่อนเมื่ออยู่หน้า ADMIN

---

## 8. Conventions & Rules

- **ห้ามใช้ emoji ใน UI** — ใช้ react-icons เท่านั้น ไม่มีข้อยกเว้น
- **ห้ามใช้ dark theme** ใน TopupPage / MailPassPage — ธีมเป็นขาว `#f0f4f8` / `#fff`
- **ห้าม hardcode currency** (เช่น "คูปอง") ใน component — ดึงจาก `game.currency` เสมอ
- **ห้าม px ตายตัว** ใน hero/slider — ใช้ `vw`, `vh`, `clamp()` เพื่อป้องกัน zoom bug
- **filter: drop-shadow()** แทน box-shadow เสมอเมื่อ element มี clip-path
- **CSS `translate` property** แทน `transform: translate()` เมื่อต้องการ offset บน element ที่มี animation (animation fill-mode:both ล็อค transform)
- **animation-fill-mode: backwards** (ไม่ใช่ `both`) บน element ที่มี `position: fixed` เพื่อป้องกัน fixed positioning trap
- **Named const vars** สำหรับ layout values ที่ปรับบ่อย — ไม่ hardcode inline
- **อ่าน GameGrid.jsx + index.css** ก่อนสร้าง card ใหม่ทุกครั้ง — อย่า guess clip-path

---

## 9. Environment Variables

ใช้ Vite env pattern — prefix `VITE_` เท่านั้นที่ bundle ไปกับ frontend

```
VITE_ADMIN_USER=alaskan
VITE_ADMIN_PASS=ADMIN2025
```

- `.env` อยู่ใน `.gitignore` — ไม่ commit
- `.env.example` อยู่ใน git — template สำหรับ dev ใหม่
- **Vercel production**: ต้องตั้ง env vars ใน Project Settings > Environment Variables ด้วยมือ
  ถ้าไม่ตั้ง admin login production ใช้ได้แค่ DEV bypass

---

## 10. Build Pipeline

```bash
npm run build        # node scripts/compress.mjs → vite build
npm run build:fast   # vite build (ข้าม compress)
npm run optimize-images  # compress เฉพาะ
```

`scripts/compress.mjs` — compress PNG/JPG ใน `public/images/` ด้วย sharp
- ใช้ manifest (`.compress-manifest.json`) skip ไฟล์ที่ไม่ได้แก้
- ข้าม Windows MAX_PATH โดย catch error แล้ว log "skip"

---

## 11. Pages & Menus

| `activeMenu` | Component | หมายเหตุ |
|---|---|---|
| `'HOME'` | Home.jsx | หน้าแรก |
| `'ข่าวสาร'` | News.jsx | |
| `'บริการ Mail/Pass'` | MailPassHub.jsx | entry → MailPassPage |
| `'ADMIN'` | AdminPage.jsx | Ctrl+Shift+A หรือปุ่ม Login ใน Navbar |

TopupPage แสดงเมื่อ `topupGame !== null` (ไม่ผ่าน activeMenu)
MailPassPage แสดงเมื่อ `mailpassGame !== null`

---

## 12. Backend Integration Plan

**Phase 1 (ปัจจุบัน):** Manual fulfillment + Google Sheets logging
- Frontend ส่ง order ข้อมูลผ่าน `topupService.createOrder()`
- Admin ดู order ใน Google Sheets แล้วเติมมือ

**Phase 2:** Payment gateway (PromptPay / QR)

**Phase 3:** Game API — เติมอัตโนมัติ (ROV, FF)

**Frontend dev ทำแค่:** UI + ส่งข้อมูลไป service layer — ไม่ต้องสนใจ backend internals

---

## 13. Pending Work

- [ ] **Admin page** — edit ชื่อ/icon/profile/tags เกม, เพิ่มเกมใหม่, ปุ่มแจ้งเดฟ
- [ ] **Mobile Navbar** — hamburger menu (ยังไม่ได้ทำ)
- [ ] **Order History UI** — ยังไม่ได้เริ่ม
- [ ] `topupService.createOrder()` ยังเป็น mock — รอ backend dev เชื่อม API
- [ ] หลายเกมใน UID/Mail/Pass ยัง coming-soon (packages ว่าง)

---

## 14. Domain Glossary

**Currency**: สิ่งที่ผู้เล่นได้รับหลังเติมเกม (คูปอง/เพชร/UC ฯลฯ) — ไม่ใช่เงินจริง

**UID Top-up**: เติมโดยใช้แค่ Player ID

**Mail/Pass Top-up**: เติมโดยให้ email + password ของ account เกม

**Package**: สินค้า 1 รายการ (amount + price) — ถ้า `amount = 0` คือไอเทม ไม่แสดงตัวเลข

**Order**: รายการสั่งซื้อ 1 ใบ (packages + UID/credential + ราคารวม)

**Hub**: หน้ารวมเกมก่อนเลือกเข้าหน้าเติม (MailPassHub ยังใช้, TopupHub ปิดชั่วคราว)

**Coming Soon**: เกมที่มี config แต่ `packages: []` — ยังสั่งไม่ได้

**Badge**: ป้ายบน package card ("แนะนำ" / "ขายดี")

**Layer Slide**: HeroSlider slide ที่ประกอบด้วย PNG หลายชั้น + animation stagger แทน static bg image

**Fulfillment**: กระบวนการส่ง currency ให้ลูกค้าหลัง order ยืนยัน (ปัจจุบัน manual)
