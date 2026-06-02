# Product

## Register

split: brand (homepage, hub pages, hero, promotions) / product (checkout flows, admin panel)

## Users

นักเล่นเกมไทยที่ต้องการเติม in-game currency อย่างรวดเร็วและปลอดภัย อายุ 13–35 ปี เข้าถึงผ่านมือถือและเดสก์ท็อป พวกเขามาด้วยเป้าหมายชัดเจน: เลือก package → จ่ายเงิน → รับ currency — ต้องการ flow ที่ไม่มีสิ่งกวนใจ และรู้สึกว่าร้านนี้น่าเชื่อถือพอจะให้ UID หรือ email/password

## Product Purpose

ALASKAN SHOP คือร้านรับเติมเกมออนไลน์สำหรับตลาดไทย ให้บริการ 2 รูปแบบ: UID Top-up (ลูกค้าให้ Player ID) และ Mail/Pass Top-up (ลูกค้าให้ account credentials) ความสำเร็จวัดจากการที่ลูกค้าทำ order จนเสร็จโดยไม่ลังเล และกลับมาซื้อซ้ำ

## Brand Personality

สนุก · เข้าถึงได้ · ครบ

เสียง: เป็นมิตรแต่มีความมั่นใจ — ไม่ formal เกินไป ไม่ aggressive เกินไป พูดตรงๆ สั้น กระชับ ไม่มีศัพท์การตลาดหลอกๆ

อารมณ์ที่ต้องการ: ตื่นเต้น (เห็นเกมที่ชอบ) + ไว้วางใจ (กล้าให้ข้อมูล) + พอใจ (จบ order ไว)

## Anti-references

- **ร้านเกมจีน / Aliexpress**: รกเกินไป, gradient สีรุ้ง, หลายองค์ประกอบแย่งความสนใจพร้อมกัน — ทำให้รู้สึกไม่น่าเชื่อถือ
- **SaaS startup ทั่วไป**: cream background, rounded cards แบบ flat, geometric sans ธรรมดา — ไม่มี gaming energy เลย
- **ร้าน budget ราคาถูกมาก**: ดูไม่น่าไว้ใจ ลูกค้าไม่กล้ากรอก UID หรือ credentials

## Design Principles

1. **Trust through restraint** — ร้านที่น่าเชื่อถือดูสะอาดกว่าร้านที่ตะโกนบอกว่าน่าเชื่อถือ ลด noise ให้เหลือแค่สิ่งที่ลูกค้าต้องการตัดสินใจ
2. **Gaming energy ไม่ใช่ gaming clutter** — ใช้ shape language (angled clip-path), typography scale, และ glow เพื่อสร้างความรู้สึกเกม — ไม่ใช่การยัดองค์ประกอบให้เต็มจอ
3. **Thai-first** — ภาษา, font, cultural context มาก่อน ดีไซน์ที่ดีสำหรับคนไทยไม่จำเป็นต้องเหมือน international gaming store
4. **Flow ที่ชัด** — ในทุก checkout step ลูกค้าต้องรู้ทันทีว่าต้องทำอะไรต่อ ไม่มีสิ่งรบกวน
5. **Identity ที่จดจำได้** — cyan `#00d1ff` + angled corners + display fonts คือ signature — ความสม่ำเสมอสร้าง brand recognition

## Accessibility & Inclusion

- Target: WCAG AA (contrast ≥ 4.5:1 body text, ≥ 3:1 large text)
- ภาษาหลัก: ไทย — ทุก UI copy ต้องอ่านออกในฟอนต์ไทยที่ใช้
- Reduced motion: ทุก animation ต้องมี `@media (prefers-reduced-motion: reduce)` fallback
- Touch targets: ≥ 44px สำหรับ mobile (ฐานลูกค้าหลักใช้มือถือ)
