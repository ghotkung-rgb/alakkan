---
name: ALASKAN SHOP
description: ร้านรับเติมเกมออนไลน์สำหรับนักเล่นเกมไทย — sharp, trusted, complete
colors:
  signal-blue: "#00d1ff"
  signal-blue-dark: "#00b8e0"
  deep-navy: "#0f172a"
  ink: "#1e293b"
  muted: "#64748b"
  subtle: "#94a3b8"
  bg-page: "#e8f4ff"
  bg-surface: "#f0f4f8"
  bg-card: "#dbeafe"
  border-default: "#e2e8f0"
  surface-white: "#ffffff"
  alert-red: "#ef4444"
  promo-gold: "#f2d000"
  facebook-blue: "#1877f2"
typography:
  display:
    fontFamily: "'Good Times Rg', sans-serif"
    fontSize: "clamp(64px, 10vw, 140px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "'Ethnocentric', 'Good Times Rg', sans-serif"
    fontSize: "clamp(28px, 4vw, 52px)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.04em"
  title:
    fontFamily: "'Ethnocentric', 'Good Times Rg', sans-serif"
    fontSize: "26px"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.08em"
  body:
    fontFamily: "'Noto Sans Thai', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "'Noto Sans Thai', sans-serif"
    fontSize: "11px"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  badge: "4px"
  thumb: "10px"
  card-quality: "16px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "32px"
  section: "16px 32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#ffffff"
    padding: "13px 36px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-dark}"
  button-secondary:
    backgroundColor: "#475569"
    textColor: "#ffffff"
    padding: "10px 36px"
    typography: "{typography.label}"
  game-card:
    backgroundColor: "{colors.bg-card}"
    width: "224px"
    height: "262px"
  game-card-hover:
    backgroundColor: "{colors.bg-card}"
  badge-new:
    backgroundColor: "{colors.alert-red}"
    textColor: "#ffffff"
    rounded: "{rounded.badge}"
    padding: "3px 8px"
  badge-promo:
    backgroundColor: "{colors.promo-gold}"
    textColor: "#1a1a1a"
    rounded: "{rounded.badge}"
    padding: "3px 8px"
---

# Design System: ALASKAN SHOP

## 1. Overview

**Creative North Star: "The Pro Shop"**

ALASKAN SHOP looks like the gear room of a serious esports organization — organized, sharp, and built for people who know what they want. The visual language is light (near-white blue ground) with a single electric accent (Signal Blue, `#00d1ff`) that appears exactly where action lives: interactive buttons, hover glows, active borders, and section markers. Everything else is disciplined neutral. The result reads as competent and trustworthy — the same register as a well-run sports equipment shop, not a carnival.

The shape language carries the gaming identity without noise. Every card, button, footer icon, and popup uses the same angled clip-path cut corner (`polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)`). This is the one decorative commitment the system makes — consistent, restrained, and immediately recognizable. No gratuitous gradients. No glass. No rainbow.

This system explicitly rejects the Aliexpress aesthetic: cluttered layouts, competing rainbow accents, oversaturated backgrounds, elements fighting for attention. It also rejects the SaaS-cream minimal look (warm off-white, rounded-lg cards, geometric sans) — that reads as a productivity tool, not a gaming shop. The line between "gaming energy" and "gaming clutter" is restraint. Signal Blue does the heavy lifting precisely because it appears nowhere it doesn't need to.

**Key Characteristics:**
- Single electric accent (Signal Blue) on a light-blue-white ground
- Angled clip-path shape language across all interactive surfaces
- Steep typographic hierarchy: Latin display for brand identity, Thai sans for readability
- Glow-as-hover: interactions are announced via cyan `filter: drop-shadow()` cascade
- Flat at rest, lifted on interaction — no ambient shadows on idle elements
- Light backgrounds are non-negotiable in checkout flows (trust signals for credential handoff)

---

## 2. Colors: The Signal Palette

One saturated color. Every other value is a neutral. The palette's restraint is the brand's confidence.

### Primary
- **Signal Blue** (`#00d1ff`): The single accent. Used on all interactive affordances — primary buttons, hover borders, active thumbnails, section title markers, scrollbar thumbs, dividers, footer icon backgrounds. Its rarity is structural: when Signal Blue appears, something is actionable or selected.
- **Signal Blue Dark** (`#00b8e0`): Hover/pressed state for Signal Blue elements. Never used at rest.

### Neutral
- **Deep Navy** (`#0f172a`): Section titles, primary headings. The darkest value in the system.
- **Ink** (`#1e293b`): Body text, card overlay text at highest contrast. Default text color.
- **Muted** (`#64748b`): Secondary body copy, footer descriptions, quality card descriptions.
- **Subtle** (`#94a3b8`): Placeholder text, footer sub-labels, minor decorative text.
- **Page Background** (`#e8f4ff`): Root `<div>` background. Light blue tint — not warm, not neutral gray.
- **Surface** (`#f0f4f8`): Secondary page background (home-wrap, TopupPage). Slightly less blue than Page Background.
- **Card Base** (`#dbeafe`): Game cards, promo cards at rest. Pale blue — matches the background family.
- **Border Default** (`#e2e8f0`): Card borders at rest, section dividers, footer separators.
- **Surface White** (`#ffffff`): Footer, quality section cards, admin popup backgrounds.

### Contextual (semantic-only; not decorative)
- **Alert Red** (`#ef4444`): NEW badges and HOT tags exclusively. Appears only on small pill overlays. Never used as a background, button color, or decorative accent.
- **Promo Gold** (`#f2d000`): Promotion price tags, featured labels. Same rule as Alert Red — pills only.
- **Facebook Blue** (`#1877f2`): Admin/contact floating popup. Isolated to that single component. Not part of the design vocabulary.

### Named Rules

**The One Signal Rule.** Signal Blue (`#00d1ff`) is the only saturated color permitted in the core design vocabulary. Alert Red and Promo Gold exist solely as semantic signals on small badges — they are never decorative fill, button color, or background tone. Any design that needs a second accent color is solving the wrong problem.

**The Trust Floor Rule.** Checkout and hub page backgrounds stay in the `#e8f4ff–#f0f4f8` range. Dark mode is prohibited for TopupPage, MailPassPage, TopupHub, and MailPassHub. Customers submit Player IDs and credentials on these pages; a dark interface signals "underground shop" and kills conversion.

---

## 3. Typography: Two Scripts, One Hierarchy

**Display Font:** Good Times Rg (Latin display — brand name, hero identity)
**Headline Font:** Ethnocentric (Latin display — game names, section titles)
**Thai Display Fonts:** PSL Kampanath Pro / PSL Khemarat Pro / PSL Chocolate Extra Pro
**Body Font:** Noto Sans Thai (all readable Thai content)

**Character:** Latin display fonts carry the gaming energy; Thai sans carries the meaning. Good Times Rg and Ethnocentric are angular, condensed, and loud — they're used exclusively for brand marks and labels where the feeling matters more than the information density. Noto Sans Thai does the functional work: descriptions, prices, instructions, error states. The pairing is not a font pairing — it's a language split with a clear hierarchy.

### Hierarchy

- **Display** (700 weight, `clamp(64px, 10vw, 140px)`, line-height 1, letter-spacing 0.04em, uppercase): Brand name in the hero section only. Never applied to any other text. Good Times Rg.
- **Headline** (900 weight, `clamp(28px, 4vw, 52px)`, line-height 1.1, letter-spacing 0.04em, uppercase): Game names in the hero slider. Ethnocentric.
- **Title** (900 weight, 26px, line-height 1.2, letter-spacing 0.08em, uppercase): Section headings throughout the page. Prefixed by the Signal Blue vertical bar marker. Ethnocentric / Good Times Rg.
- **Body** (400–700 weight, 12–15px, line-height 1.8): All Thai descriptive content — package descriptions, quality card body, footer copy, checkout instructions. Noto Sans Thai.
- **Label** (900 weight, 10–11px, letter-spacing 0.08–0.12em, uppercase): Badges (NEW, HOT), button text, section eyebrows, small tags. Noto Sans Thai.

### Named Rules

**The Two-Script Rule.** Latin display fonts (Good Times Rg, Ethnocentric) are for brand expression only — brand name, section titles, game names in the slider. Every string that a user must actually read and act on (prices, descriptions, step instructions, error messages, CTA labels) must be in Noto Sans Thai. Mixing the display fonts into body copy makes Thai text illegible.

**The Scale Ceiling Rule.** Display type caps at `clamp(64px, 10vw, 140px)`. Section titles are 26px fixed. These are the two permitted headline scales. No intermediate sizes between them; hierarchy comes from scale contrast, not gradual steps.

---

## 4. Elevation: Glow-as-Depth

The system does not use shadows for ambient depth. Surfaces are flat at rest — no hover shadows, no idle card depth, no layering through opacity. Depth is earned through interaction: when the user hovers, the surface lifts via `transform: translateY()` and radiates a Signal Blue `filter: drop-shadow()` cascade.

This is structurally required, not just aesthetic: most interactive surfaces use `clip-path`, which clips `box-shadow` entirely. `filter: drop-shadow()` applies outside the clip boundary and is the only correct tool for clipped elements.

The two exceptions are non-clipped elements: quality cards use ambient `box-shadow: 0 4px 20px rgba(0,0,0,0.1)` at rest, and the admin popup uses `box-shadow: 0 8px 32px rgba(24,119,242,0.55)` as an attention signal.

### Shadow Vocabulary

- **Cyan glow — card hover** (`filter: drop-shadow(0 0 6px rgba(0,209,255,0.65)) drop-shadow(0 0 20px rgba(0,209,255,0.35)) drop-shadow(0 14px 36px rgba(0,0,0,0.28))`): Game cards, promo cards. Applied at hover, removed at rest. The three-layer cascade: tight rim glow → medium aura → dark ground shadow.
- **Promo glow — card hover** (`filter: drop-shadow(0 0 6px rgba(0,209,255,0.8)) drop-shadow(0 0 20px rgba(0,209,255,0.5)) drop-shadow(0 0 50px rgba(0,209,255,0.25))`): Promo cards. Slightly more intense rim than game cards.
- **Ambient — quality cards** (`box-shadow: 0 4px 20px rgba(0,0,0,0.1)`): Resting shadow on non-clipped quality feature cards. Lifts to `0 10px 30px rgba(0,209,255,0.2)` on hover.
- **Attention — admin popup** (`box-shadow: 0 8px 32px rgba(24,119,242,0.55), 0 2px 8px rgba(0,0,0,0.15)` + pulse animation): The popup pulses between this and a 10px ring expand. Not elevation — it's a call-to-action signal.
- **Button glow** (`box-shadow: 0 4px 18px rgba(0,209,255,0.45)` / `0 4px 20px rgba(0,209,255,0.5)`): Signal Blue buttons carry a resting cyan glow. This is the one exception to "flat at rest" — it reinforces that these are the primary interactive affordances.

### Named Rules

**The Clip-Path Shadow Rule.** `box-shadow` is invisible on any element with `clip-path`. It is cut off at the clip boundary and produces no visible effect. All elevation and hover effects on clipped elements must use `filter: drop-shadow()`. This is non-optional and cannot be worked around with wrappers if the wrapper is also clipped.

**The Flat-at-Rest Rule.** No game card, promo card, or navigation item carries a resting shadow. Elevation appears only in response to user interaction (hover, focus, selection). The one deliberate exception is the primary button's resting cyan glow — it marks the primary CTA even at rest.

---

## 5. Components

### Buttons (Primary)
The signature CTA shape. Angled clip-path cut corners (20px cut: `polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)`). Signal Blue background, white text, 900 weight label, `box-shadow: 0 4px 18px rgba(0,209,255,0.45)` at rest. Hover: darkens to Signal Blue Dark (`#00b8e0`), lifts 1px. No border.

### Buttons (Secondary / Collapse)
Same clip-path shape. Slate (`#475569`) background, white text. No glow. Hover: darkens to `#334155`.

### Game Cards (Signature Component)
The visual backbone of the shop. 224×262px. Angled clip-path corners (16px cut). `#dbeafe` card base, `2px solid #e2e8f0` border at rest. Cover image fills the card, `object-fit: cover`, `object-position: center top`. Dark gradient overlay on the bottom third for game name legibility. At hover: border turns Signal Blue, card lifts 6px, image scales to 1.16×, inset dark vignette (`:after` pseudo with `box-shadow: inset`), cyan drop-shadow cascade. The top edge on hover shows a 2px Signal Blue gradient bar (`:before` pseudo).

### Promo Cards
Same shape and hover behavior as game cards. Standard: 224×262px. Featured variant: 456px wide (2× a standard card). Gold `#f2d000` tag badge top-right.

### Section Titles
26px, 900 weight, Ethnocentric / Good Times Rg, uppercase, `letter-spacing: 0.08em`, Deep Navy (`#0f172a`). Prefixed by a 5×22px Signal Blue vertical bar (gradient `#00d1ff → #0099bb`, 3px radius). This prefix is the system's section marker — it must appear on every `.section-title`. Never substitute with a number, dot, or horizontal rule.

### Navigation (Navbar)
`position: absolute` — floats over the hero, transparent background at rest on the home page. Transitions to a solid background when scrolled or on non-home pages. Logo is an image asset, never text. Menu items in Noto Sans Thai. Active item highlighted in Signal Blue.

### Admin / Contact Popup
Fixed bottom-right. Facebook Blue gradient (`#1877f2 → #1251a8`). Trapezoid clip-path. Bounces and pulses at rest (attention signal, not decoration). This is the only place Facebook Blue appears in the system. Its isolation is intentional.

### Package Cards (Topup / MailPass)
Used in checkout flows. Selected state: Signal Blue border + slight scale. Badge overlays from config (`badge: 'แนะนำ'` etc.). Prices always in Thai Baht (บาท). Currency label pulled from `game.currency` config — never hardcoded.

### Hero Slider
Full-width, height `clamp(360px, 48vw, 680px)`. Background images `contain`, not `cover` (preserves game art composition). Left-side dark gradient overlay for text legibility. Thumbnail navigation bottom-left. Dot indicators centered bottom. Nav arrows appear only on hover. Active thumbnail: Signal Blue border + 1.08× scale.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `filter: drop-shadow()` for all hover elevation on clip-path elements — `box-shadow` is invisible on clipped surfaces.
- **Do** keep Signal Blue (`#00d1ff`) as the only saturated accent on any screen. One accent; its rarity is the point.
- **Do** use Good Times Rg / Ethnocentric for brand marks and section titles, and Noto Sans Thai for all body copy, instructions, and prices.
- **Do** keep checkout and hub page backgrounds in the `#e8f4ff–#f0f4f8` range — light is non-negotiable where credentials are entered.
- **Do** apply the angled clip-path (`polygon(16px ...)` for cards, `polygon(20px ...)` for buttons) consistently across all new interactive surfaces.
- **Do** prefix all section titles with the 5×22px Signal Blue vertical bar — it is the system's section marker.
- **Do** pull `game.currency`, `game.name`, and `game.packages` from config — never hardcode game-specific strings in components.
- **Do** use `clamp()` for all hero and slider dimensions — fixed `px` values cause zoom bugs.

### Don't:
- **Don't** use `box-shadow` on any element with `clip-path` — it produces no visible effect and signals a broken design.
- **Don't** use dark themes or dark backgrounds on TopupPage, MailPassPage, TopupHub, or MailPassHub. This is the "ร้านเกมจีน" tell and destroys trust.
- **Don't** add a second saturated accent color — not purple, not orange, not green. Signal Blue carries all interaction states alone.
- **Don't** use rainbow or multi-color gradients — this is the direct path to the Aliexpress aesthetic explicitly rejected in PRODUCT.md.
- **Don't** use `background-clip: text` gradient text — prohibited by system rules, decorative, and illegible at small sizes.
- **Don't** use glassmorphism (blur + semi-transparent panels) as decoration — if it appears, it must be purposeful and rare.
- **Don't** render badge pills in soft pastel colors — badges (NEW, HOT, แนะนำ, ขายดี) must be Alert Red or Promo Gold to carry semantic weight.
- **Don't** fix hero or slider heights in `px` — use `clamp()`. Fixed pixel values break at non-standard zoom levels.
- **Don't** use `transform` directly on an element that already has a CSS animation running — wrap in a parent div and apply `transform` there to avoid animation conflicts.
- **Don't** add a `box-shadow` wrapper pattern to work around the clip-path shadow rule — the clip-path shape is the identity; don't compromise it.
