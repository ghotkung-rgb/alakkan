import { useState } from 'react';

const MODAL_CONTENT = {
  privacy: {
    title: 'นโยบายความเป็นส่วนตัว',
    body: [
      { h: 'การเก็บรวบรวมข้อมูล', p: 'ALASKAN SHOP เก็บรวบรวมข้อมูลที่จำเป็นสำหรับการให้บริการเท่านั้น เช่น UID เกม, ช่องทางการติดต่อ และประวัติการสั่งซื้อ เพื่อประมวลผลคำสั่งและปรับปรุงบริการ' },
      { h: 'การใช้ข้อมูล', p: 'ข้อมูลของท่านถูกใช้เพื่อดำเนินการเติมเกม ติดต่อกลับกรณีมีปัญหา และปรับปรุงประสบการณ์การใช้บริการ เราไม่เปิดเผยข้อมูลส่วนตัวให้แก่บุคคลที่สามโดยไม่ได้รับอนุญาต' },
      { h: 'ความปลอดภัย', p: 'เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต และปฏิบัติตามมาตรฐานการคุ้มครองข้อมูลส่วนบุคคล (PDPA)' },
      { h: 'การติดต่อ', p: 'หากมีข้อสงสัยเกี่ยวกับนโยบายนี้ กรุณาติดต่อเราผ่านช่องทาง Facebook: ALASKAN.ONLINE.SHOP' },
    ],
  },
  terms: {
    title: 'เงื่อนไขการให้บริการ',
    body: [
      { h: 'การใช้บริการ', p: 'บริการเติมเกมของ ALASKAN SHOP มีไว้สำหรับผู้ใช้ที่มีอายุ 13 ปีขึ้นไป การใช้บริการถือว่าท่านยอมรับเงื่อนไขทั้งหมดนี้แล้ว' },
      { h: 'ความถูกต้องของ UID', p: 'ลูกค้าต้องตรวจสอบ UID หรือข้อมูลที่ใช้เติมให้ถูกต้องก่อนยืนยันคำสั่ง เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากการกรอก UID ผิดพลาด' },
      { h: 'การคืนเงิน', p: 'หากเกิดข้อผิดพลาดจากระบบของเรา จะดำเนินการคืนเงินหรือเติมใหม่ให้ภายใน 24 ชั่วโมง กรุณาแจ้งปัญหาพร้อมหลักฐานผ่านช่องทางติดต่อ' },
      { h: 'ข้อห้าม', p: 'ห้ามใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมาย หรือพยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต การกระทำดังกล่าวอาจถูกระงับการใช้บริการทันที' },
    ],
  },
};

const SOCIAL_ICONS = [
  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/CHATWEB1.png",   alt: "Chat",      href: "https://www.messenger.com/t/677062779057497/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0" },
  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/FACEBOOK1.png",  alt: "Facebook",  href: "https://www.facebook.com/ALASKAN.ONLINE.SHOP" },
  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/INSTAGRAM1.png", alt: "Instagram", href: "#" },
  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/LINE1.png",      alt: "Line",      href: "#" },
];

export default function Footer() {
  const [modal, setModal] = useState(null);

  return (
    <>
      {/* ─── FOOTER ─── */}
      <div id="contact-section" className="footer-section">
        <div className="footer-left">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <img src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo.png" alt="Alaskan Logo" loading="lazy" decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <div>
              <div className="footer-logo-name">ALASKAN</div>
              <div className="footer-logo-sub">TOPUP GAME ONLINE</div>
            </div>
          </div>
          <div className="footer-desc">
            ALASKAN เราให้บริการในรูปแบบสะดวกทำหน้าที่เดิมเกมอย่างมีความการการ<br/>
            เราคัดสรรเฉพาะช่องทางที่ถูกกฎหมายและปลอดภัยสูงสุด<br/>
            เพื่อต่อตอบสนองคุณค่าทำทางด้านอสังหาริมทรัพย์คุณภาพ<br/>
            พร้อมการดูแลและระดับบัตรอย่างไว้ใจทุกขั้นตอน
          </div>
          <div className="footer-contact">
            <span className="footer-contact-label">ติดต่อเรา</span>
            <div className="footer-icons">
              {SOCIAL_ICONS.map((ic) => (
                <a href={ic.href} target="_blank" rel="noopener noreferrer" className="footer-icon-wrap" key={ic.alt}>
                  <div className="footer-icon-inner">
                    <img src={ic.src} alt={ic.alt} loading="lazy" decoding="async" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-fanpage-title">
            <span style={{ color: '#1877f2', fontWeight: 900 }}>FACEBOOK</span>
            <span style={{ fontWeight: 900 }}> FANPAGE</span>
          </div>
          <a href="https://www.facebook.com/ALASKAN.ONLINE.SHOP" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
            <div className="footer-fanpage-card">
              <div className="footer-fanpage-img">
                <img src="/images/ALASKAN_WEB_ASSET/BACKGROUND/home/Alaskan_page_cover_1_ai_edit.png" alt="fanpage" loading="lazy" decoding="async"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* ─── COPYRIGHT ─── */}
      <div className="copyright-bar">
        <span>© 2026 AlasKan Shop. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20, marginLeft: 32 }}>
          <button onClick={() => setModal('privacy')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit', letterSpacing: '0.04em' }}>นโยบายความเป็นส่วนตัว</button>
          <button onClick={() => setModal('terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b', fontFamily: 'inherit', letterSpacing: '0.04em' }}>เงื่อนไขการให้บริการ</button>
        </div>
      </div>

      {/* ─── PRIVACY / TERMS MODAL ─── */}
      {modal && MODAL_CONTENT[modal] && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(8,18,40,0.55)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, animation: 'fadeIn 0.25s ease both',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, maxWidth: 600, width: '100%',
              maxHeight: '80vh', overflow: 'hidden', position: 'relative',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              padding: '22px 28px', borderBottom: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg,#00d1ff 0%,#0099bb 100%)',
            }}>
              <div style={{
                fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '0.02em',
                fontFamily: "'PSL Kampanath Pro','Noto Sans Thai',sans-serif",
              }}>{MODAL_CONTENT[modal].title}</div>
              <button onClick={() => setModal(null)} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                fontSize: 18, fontWeight: 700, lineHeight: 1, flexShrink: 0,
              }}>✕</button>
            </div>
            <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
              {MODAL_CONTENT[modal].body.map((sec, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 6,
                    fontFamily: "'Noto Sans Thai',sans-serif",
                  }}>{sec.h}</div>
                  <div style={{
                    fontSize: 13, color: '#475569', lineHeight: 1.8,
                    fontFamily: "'Noto Sans Thai',sans-serif",
                  }}>{sec.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
