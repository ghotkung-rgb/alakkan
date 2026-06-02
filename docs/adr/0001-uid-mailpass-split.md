# แยกระบบ UID Top-up และ Mail/Pass Top-up เป็นสองระบบแยกกัน

เกมที่ร้านให้บริการมีสอง fulfillment method ที่แตกต่างกันโดยพื้นฐาน — UID (ลูกค้าให้แค่ Player ID) และ Mail/Pass (ลูกค้าให้ email + password เพื่อให้ร้านล็อกอินเข้าไปเติมแทน) เราจึงแยก config (`GAMES` / `MAILPASS_GAMES`), hub page (`TopupHub` / `MailPassHub`), และหน้าเติม (`TopupPage` / `MailPassPage`) ออกจากกันทั้งหมด แทนที่จะรวมเป็นระบบเดียวที่มี flag `method`

## Considered Options

- **รวมเป็นระบบเดียว** — config เดียว, หน้าเดียว แยกด้วย `fulfillmentMethod: 'uid' | 'mailpass'` — ดูเรียบง่ายกว่าแต่ UI ของสองแบบต่างกันมาก (Mail/Pass ต้องรับ email + password แทน UID, มีข้อความเตือนความปลอดภัยเพิ่ม) ทำให้ component มี conditional logic ซับซ้อน
- **แยกเป็นสองระบบ (ที่เลือก)** — UI แต่ละแบบชัดเจน backend dev สามารถเชื่อม API ของแต่ละ method ได้อิสระจากกัน และเกมใหม่เพิ่มเข้าระบบได้ตรงๆ โดยไม่ต้องแตะโค้ดของอีกฝั่ง

## Consequences

- เกมแต่ละชื่อต้องอยู่ใน config เดียวเท่านั้น ไม่สามารถอยู่ทั้งสองฝั่งพร้อมกัน
- ถ้าเกมในอนาคตรองรับทั้ง UID และ Mail/Pass จะต้องออกแบบ routing เพิ่มเติม
