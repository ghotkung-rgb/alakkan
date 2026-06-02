// ════════════════════════════════════════════════════════════
//  MascotHero — hero มาสคอตแบบ "ไฮไลท์ภาพพื้นหลังโชว์ภาพ" (ซ้อน 3 ชั้น)
//  ตัวจริงบนหน้า Home · ไม่ยุ่งกับ HeroSlider/มาสคอตเดิมที่จัดวางไว้
// ════════════════════════════════════════════════════════════

const MASCOT_IMG = '/images/ALASKAN_WEB_ASSET/BACKGROUND/home/alaskan_mascot1.png';
const PAGE_BG    = '#e8f4ff';   // ตรงกับสีพื้น root ของหน้า เพื่อให้รูปกลืนหาย

export default function MascotHero() {
  return (
    <div style={{
      position: 'relative',
      height: 'clamp(320px, 42vw, 560px)',
      overflow: 'hidden',
    }}>
      {/* ชั้น 1 — มาสคอตเป็นภาพพื้นหลัง (cover + หรี่เล็กน้อย) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${MASCOT_IMG}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1)',
      }} />

      {/* ชั้น 2 — ไล่เฉดให้กลืนพื้น (บน-ล่าง) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom,
          rgba(232,244,255,0) 25%,
          ${PAGE_BG} 100%)`,
      }} />
      {/* ชั้น 2.5 — ไล่เฉดซ้าย-ขวา ให้ขอบนุ่ม */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to right,
          rgba(232,244,255,0.4) 0%,
          rgba(232,244,255,0) 38%,
          rgba(232,244,255,0) 62%,
          rgba(232,244,255,0.4) 100%)`,
      }} />

      {/* ชั้น 3 — ข้อความทับบนสุด */}
      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: "'Good Times Rg', sans-serif",
          fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 700,
          color: '#00d1ff', letterSpacing: '0.04em', lineHeight: 1,
          filter: 'drop-shadow(0 0 32px rgba(0,209,255,0.4))',
        }}>ALASKAN</span>
        <span style={{
          fontFamily: "'Good Times Rg', sans-serif",
          fontSize: 'clamp(14px, 2.4vw, 32px)', fontWeight: 900,
          color: '#1e293b', letterSpacing: '0.2em', marginTop: 4,
        }}>TOPUP&nbsp;&nbsp;GAME ONLINE</span>
      </div>
    </div>
  );
}
