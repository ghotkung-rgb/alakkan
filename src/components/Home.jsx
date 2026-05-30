import React, { useState, useEffect, useRef } from 'react';
// Note: โปรโมชั่น — เพิ่ม/ลดการ์ดได้เลย
const PROMOS = [
  { id: 1, name: "ROV Promotion",      img: "/images/PRO/rov_promotion_web1_ai.png",      tag: "HOT" }, //tag คือป้ายใหม่อื่นๆ เช่น HOT, SALE, etc. (ถ้าไม่มีให้ใส่ null)
  { id: 2, name: "ACE RACER", category: "เกมแข่งรถ", bg: "/images/GAMES BG/ACERACER_bg.png", icon: "/images/GAMES ICON/ACERACER_iconapp.png", tag: "ใหม่" },
  { id: 3, name: "BIGO LIVE", category: "สตรีมมิ่ง", bg: "/images/GAMES BG/BIGOLIVE_bg.png", icon: "/images/GAMES ICON/BIGOLIVE_iconapp.png", tag: "ใหม่" },
  { id: 4, name: "IDENTITY V", category: "เกมเอาชีวิตรอด", bg: "/images/GAMES BG/IDENTITYV_bg.png", icon: "/images/GAMES ICON/IDENTITYV_iconapp.png", tag: null },
];

// Note: ชื่อเกม , bg (ภาพพื้นหลัง) , icon (ไอคอนแอป) , category (หมวดหมู่) , tag
const GAMES_TOPUP = [
  { id: 1,  name: "ROV",               category: "เกม MOBA",           bg: "/images/GAMES BG/ROV_bg.png",             icon: "/images/GAMES ICON/ROV_iconapp.png",             tag: "ขายดี"  },
  { id: 2,  name: "PUBG Mobile",       category: "เกม Battle Royale",   bg: "/images/GAMES BG/PUBGMOBILE_bg.png",       icon: "/images/GAMES ICON/PUBGMOBILE_iconapp.png",      tag: null   },
  { id: 3,  name: "Free Fire",         category: "เกม Battle Royale",   bg: "/images/GAMES BG/FREEFIRE_bg.png",         icon: "/images/GAMES ICON/FREEFIRE_iconapp.png",        tag: null   },
  { id: 4,  name: "Call of Duty",      category: "เกมยิง FPS",          bg: "/images/GAMES BG/CALLOFDUTY_bg.png",       icon: "/images/GAMES ICON/CALLOFDUTY_iconapp.png",      tag: null   },
  { id: 5,  name: "Delta Force",       category: "เกมยิง FPS",          bg: "/images/GAMES BG/DELTAFORCE_bg.png",       icon: "/images/GAMES ICON/DELTAFORCE_iconapp.png",      tag: "ใหม่" },
  { id: 6,  name: "Blood Strike",      category: "เกมยิง FPS",          bg: "/images/GAMES BG/BLOODSTRIKE_bg.png",      icon: "/images/GAMES ICON/BLOODSTRIKE_iconapp.png",     tag: "ใหม่" },
  { id: 7,  name: "Valorant",          category: "เกมยิงกลยุทธ์",       bg: "/images/GAMES BG/VALORANT_bg.png",         icon: "/images/GAMES ICON/VALORANT_iconapp.png",        tag: null   },
  { id: 8,  name: "Honor of Kings",    category: "เกม MOBA",            bg: "/images/GAMES BG/HONOROFKINGS_bg.png",     icon: "/images/GAMES ICON/HONOROFKINGS_iconapp.png",    tag: null   },
  { id: 9,  name: "Honkai: Star Rail", category: "เกม RPG",             bg: "/images/GAMES BG/STARRAIL_bg.png",         icon: "/images/GAMES ICON/STARRAIL_iconapp.png",        tag: null   },
  { id: 10, name: "Arena Breakout",    category: "เกมยิงกลยุทธ์",       bg: "/images/GAMES BG/ARENABREAKOUT_bg.png",    icon: "/images/GAMES ICON/ARENABREAKOUT_iconapp.png",   tag: null   },
  { id: 11, name: "ACE RACER",         category: "เกมแข่งรถ",           bg: "/images/GAMES BG/ACERACER_bg.png",         icon: "/images/GAMES ICON/ACERACER_iconapp.png",        tag: null   },
  { id: 12, name: "Aether Gazer",      category: "เกม RPG",             bg: "/images/GAMES BG/AETHERGAZER_bg.png",      icon: "/images/GAMES ICON/AETHERGAZER_iconapp.png",     tag: null   },
  { id: 13, name: "AFK Journey",       category: "เกม RPG",             bg: "/images/GAMES BG/AFKJOURNEY_bg.png",       icon: "/images/GAMES ICON/AFKJOURNEY_iconapp.png",      tag: null   },
  { id: 14, name: "Ballistic Hero",    category: "เกมยิง FPS",          bg: "/images/GAMES BG/BALLISTICHERO_bg.png",    icon: "/images/GAMES ICON/BALLISTICHERO_iconapp.png",   tag: "ใหม่" },
  { id: 15, name: "BIGO LIVE",         category: "สตรีมมิ่ง",           bg: "/images/GAMES BG/BIGOLIVE_bg.png",         icon: "/images/GAMES ICON/BIGOLIVE_iconapp.png",        tag: null   },
  { id: 16, name: "Bleach",            category: "เกม RPG",             bg: "/images/GAMES BG/BLEACH_bg.png",           icon: "/images/GAMES ICON/BLEACH_iconapp.png",          tag: null   },
  { id: 17, name: "Dunk City Dynasty", category: "เกมกีฬา",             bg: "/images/GAMES BG/DUNKCITY_bg.png",         icon: "/images/GAMES ICON/DUNKCITY_iconapp.png",        tag: null   },
  { id: 18, name: "Heartopia",         category: "เกมจำลอง",            bg: "/images/GAMES BG/HEARTOPIA_bg.png",        icon: "/images/GAMES ICON/HEARTOPIA_iconapp.png",       tag: null   },
  { id: 19, name: "Identity V",        category: "เกมเอาชีวิตรอด",      bg: "/images/GAMES BG/IDENTITYV_bg.png",        icon: "/images/GAMES ICON/IDENTITYV_iconapp.png",       tag: null   },
  { id: 20, name: "LoL: Wild Rift",    category: "เกม MOBA",            bg: "/images/GAMES BG/LOLWILDRIFT_bg.png",      icon: "/images/GAMES ICON/LOLWILDRIFT_iconapp.png",     tag: null   },
  { id: 21, name: "League of Legends", category: "เกม MOBA",            bg: "/images/GAMES BG/LOL_bg.png",              icon: "/images/GAMES ICON/LOL_iconapp.png",             tag: null   },
  { id: 22, name: "Magic Chess",       category: "เกมกลยุทธ์",          bg: "/images/GAMES BG/MAGICCHESS_bg.png",       icon: "/images/GAMES ICON/MAGICCHESS_iconapp.png",      tag: null   },
  { id: 23, name: "Where Winds Meet",  category: "เกม RPG",             bg: "/images/GAMES BG/WHEREWINDMEET_bg.png",    icon: "/images/GAMES ICON/WHEREWINDMEET_iconapp.png",   tag: "ใหม่" },
];

// Note: ชื่อเกม , bg (ภาพพื้นหลัง) , icon (ไอคอนแอป) , category , tag
const GAMES_MailPass = [
  { id: 1, name: "eFootball",    category: "เกมฟุตบอล", bg: "/images/GAMES BG/EFOOTBALL_bg.png",  icon: "/images/GAMES ICON/EFOOTBALL_iconapp.png",  tag: null },
  { id: 2, name: "FC Mobile",    category: "เกมฟุตบอล", bg: "/images/GAMES BG/FCMOBILE_bg.png",   icon: "/images/GAMES ICON/FCMOBILE_iconapp.png",   tag: null },
  { id: 3, name: "Heartopia",    category: "เกมจำลอง",  bg: "/images/GAMES BG/HEARTOPIA_bg.png",  icon: "/images/GAMES ICON/HEARTOPIA_iconapp.png",  tag: null },
  { id: 4, name: "Call of Duty", category: "เกมยิง FPS", bg: "/images/GAMES BG/CALLOFDUTY_bg.png", icon: "/images/GAMES ICON/CALLOFDUTY_iconapp.png", tag: null },
];

// Note: Popular Package — เพิ่ม/ลด/แก้ข้อความได้เลย
const POPULAR_PACKAGES = [
  { id: 1, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web_ai.png" },
  { id: 2, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/mlbb_promotion_web_ai_edit1.png" },
  { id: 3, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web2_ai.png" },
];

const HERO_MASCOT_IMG = "/images/ALASKAN_WEB_ASSET/BACKGROUND/home/alaskan_mascot1.png";

const PAGE_SIZE = 15;

function GameGrid({ games, expanded, onCollapse, onTopup }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) setVisibleCount(PAGE_SIZE);
  }, [expanded]);

  // ── ค่าปรับได้ ──────────────────────────────────────
  const iconMarginLeft = 9;   // ไอคอน ซ้าย/ขวา
  const iconMarginTop  = 18;  // ไอคอน ขึ้น/ลง
  const nameTop        = -9;  // ชื่อเกม ขึ้น/ลง
  const nameLeft       = -8;  // ชื่อเกม ซ้าย/ขวา
  const nameFontSize   = 10;  // ชื่อเกม ขนาดฟอนต์
  const catFontSize    = 10;  // หมวดหมู่ ขนาดฟอนต์
  const catTop         = -7;   // หมวดหมู่ ขึ้น/ลง
  const catLeft        = -8.5;   // หมวดหมู่ ซ้าย/ขวา
  const btnFontSize    = 8;   // ปุ่มเติมเกม ขนาดฟอนต์
  const btnPad         = '8px 11px'; // ปุ่มเติมเกม padding
  const barPadLeft     = 60;  // bottom bar padding-left
  // ────────────────────────────────────────────────────

  const renderCard = (game, i, animStyle) => (
    <div className="game-card" key={`${game.id}-${i}`} style={{ ...animStyle, cursor:'pointer' }}
      onClick={() => onTopup && onTopup(game.name)}>
      <img src={game.bg} alt={game.name}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
        onError={e => { e.target.style.display = 'none'; }} />
      {game.tag && (
        <div className={`promo-tag${game.tag === 'ใหม่' ? ' new' : ''}`} style={{ zIndex: 11 }}>
          {game.tag}
        </div>
      )}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
        padding:`36px 14px 12px ${barPadLeft}px`,
        display:'flex', flexDirection:'row', alignItems:'center', gap:10,
      }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <img src={game.icon} alt=""
              style={{ width:36, height:37, borderRadius:8, objectFit:'cover', flexShrink:0, border:'1.5px solid rgba(255,255,255,0.18)', marginLeft:iconMarginLeft, marginTop:iconMarginTop }}
              onError={e => { e.target.style.display = 'none'; }} />
            <span style={{ color:'#fff', fontWeight:700, fontSize:nameFontSize, lineHeight:1.2, whiteSpace:'nowrap', position:'relative', top:nameTop, left:nameLeft }}>{game.name}</span>
          </div>
          {game.category && <div style={{ color:'#ffffff', fontSize:catFontSize, position:'relative', top:catTop, left:catLeft }}>{game.category}</div>}
        </div>
        <button style={{
          background:'#00d1ff', color:'#ffffff', border:'none', borderRadius:20,
          padding:btnPad, fontSize:btnFontSize, fontWeight:700, cursor:'pointer', flexShrink:0,
          lineHeight:1,
        }} onClick={() => onTopup && onTopup(game.name)}>เติมเกม</button>
      </div>
    </div>
  );

  if (!expanded) {
    const preview = games.slice(0, 5);
    return (
      <div ref={ref}>
        <div className="games-grid" style={{ padding: '80px', margin: '-80px' }}>
          {preview.map((game, i) => renderCard(game, i, {
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateY(0)' : 'translateY(40px)',
            transition: `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`,
          }))}
        </div>
      </div>
    );
  }

  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  return (
    <div ref={ref}>
      <div className="games-grid-expanded" style={{ padding: '80px', margin: '-80px' }}>
        {visibleGames.map((game, i) => renderCard(game, i, {
          animation: `gameCardIn 0.4s ${(i % PAGE_SIZE) * 0.03}s ease both`,
        }))}
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:20 }}>
        {hasMore && (
          <button className="see-more-btn" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            เกมทั้งหมด
          </button>
        )}
        <button className="collapse-btn" onClick={onCollapse}>ปิด</button>
      </div>
    </div>
  );
}

function PromoGrid({ promos }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.5;
      scrollRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ overflow: 'hidden', margin: '0' }}>
      <div ref={scrollRef} className="promo-grid" style={{ overflow: 'hidden', padding: '60px', margin: '-60px' }}>
        {promos.map((p, i) => (
          <div className={`promo-card${i === 0 ? ' featured' : ''}`} key={p.id} style={{
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateY(0)' : 'translateY(40px)',
            transition: `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`,
          }}>
            {p.bg ? (
              <>
                <img src={p.bg} alt={p.name}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.style.display = 'none'; }} />
                {p.tag && <div className={`promo-tag ${p.tag === 'ใหม่' ? 'new' : ''}`}>{p.tag}</div>}
                <div style={{
                  position:'absolute', bottom:0, left:0, right:0,
                  background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
                  padding:'36px 14px 12px 49px',
                  display:'flex', flexDirection:'row', alignItems:'center', gap:10,
                }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <img src={p.icon} alt=""
                        style={{ width:36, height:37, borderRadius:8, objectFit:'cover', flexShrink:0, border:'1.5px solid rgba(255,255,255,0.18)',marginLeft: 10, marginTop: 29 }}
                        onError={e => { e.target.style.display = 'none'; }} />
                      <span style={{ color:'#fff', fontWeight:700, fontSize:13, lineHeight:1.2, whiteSpace:'nowrap' }}>{p.name}</span>
                    </div>
                    {p.category && <div style={{ color:'#ffffff', fontSize:11, marginTop:2 }}>{p.category}</div>}
                  </div>
                  <button style={{
                    background:'#00d1ff', color:'#ffffff', border:'none', borderRadius:20,
                    padding:'5px 11px', fontSize:10, fontWeight:700, cursor:'pointer', flexShrink:0,
                    lineHeight:1,
                  }}>เติมเกม</button>
                </div>
              </>
            ) : (
              <>
                <img src={p.img} alt={p.name}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className="game-overlay" />
                {p.tag && <div className={`promo-tag ${p.tag === 'ใหม่' ? 'new' : ''}`}>{p.tag}</div>}
                <div className="game-name">{p.name}</div>
              </>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

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

function HeroSlider() {
  const slides = [
    { type: 'brand',  thumb: HERO_MASCOT_IMG },
    { type: 'promo', bg: '/images/PRO/rov_promotion_web1_ai.png',            thumb: '/images/PRO/rov_promotion_web1_ai.png' },
    { type: 'promo', bg: '/images/PRO/mlbb_promotion_web_ai_edit1.png',       thumb: '/images/PRO/mlbb_promotion_web_ai_edit1.png' },
    { type: 'promo', bg: '/images/PRO/Alaskan_freefire_banner_web_ai.png',    thumb: '/images/PRO/Alaskan_freefire_banner_web_ai.png' },
    { type: 'promo', bg: '/images/PRO/Alaskan_freefire_banner_web2_ai.png',   thumb: '/images/PRO/Alaskan_freefire_banner_web2_ai.png' },
  ];

  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState('down');

  const goTo = (idx) => {
    if (idx === cur) return;
    setDir(idx > cur ? 'down' : 'up');
    setCur(idx);
    setAnimKey(k => k + 1);
  };
  const goPrev = () => setCur(c => { const n = (c - 1 + slides.length) % slides.length; setDir('up'); setAnimKey(k => k + 1); return n; });
  const goNext = () => setCur(c => { const n = (c + 1) % slides.length; setDir('down'); setAnimKey(k => k + 1); return n; });


  const slide = slides[cur];

  return (
    <div className="hero-slider">
      {slides.map((s, i) => (
        <div key={i} className={`hs-bg${i === cur ? ' active' : ''}`}
          style={s.type === 'brand' ? {
            backgroundColor: 'transparent',
          } : {
            backgroundImage: s.bg ? `url("${s.bg}")` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundColor: 'transparent',
          }} />
      ))}

      {slide.type === 'brand' && <div className="hs-overlay" style={{ background: 'none' }} />}

      <div key={animKey} className={`hs-content hs-anim-${dir}`}>
        {slide.type === 'brand' && (
          <div className="hero-inner" style={{ height: '100%', paddingTop: 0 }}>
            <img src="/images/effect/TOPBLUE.png" alt="" style={{
              position:'absolute', top:0, right:0,
              width:'28%', pointerEvents:'none', zIndex:1,
              animation:'slideFromTopRight 1.0s 0.1s ease both',
            }} onError={e => { e.target.style.display='none'; }} />
            <img src="/images/effect/DOWNBLUE.png" alt="" style={{
              position:'absolute', bottom:180, left:0,
              width:'28%', pointerEvents:'none', zIndex:1,
              animation:'slideFromBottomLeft 1.0s 0.3s ease both',
            }} onError={e => { e.target.style.display='none'; }} />
            <div className="hero-text-wrap">
              <span className="hero-text-alaskan">ALASKAN</span>
              <span className="hero-text-sub">
                <span>TOPUP</span>
                <span className="hero-text-gap" />
                <span>GAME ONLINE</span>
              </span>
            </div>
            <img className="hero-mascot" src={HERO_MASCOT_IMG} alt="mascot"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>

      <div className="hs-thumbs">
        <button className="hs-nav-btn" onClick={goPrev}>&#9664;</button>
        <div className="hs-thumb-list">
          {slides.map((s, i) => (
            <div key={i} className={`hs-thumb${i === cur ? ' active' : ''}`} onClick={() => goTo(i)}>
              {s.thumb && <img src={s.thumb} alt="" onError={e => { e.target.style.display = 'none'; }} />}
            </div>
          ))}
        </div>
        <button className="hs-nav-btn" onClick={goNext}>&#9654;</button>
      </div>
    </div>
  );
}

export default function Home({ onTopup }) {
  const [visible, setVisible] = useState(false);
  const [uidExpanded, setUidExpanded] = useState(false);
  const [mailExpanded, setMailExpanded] = useState(false);
  const [modal, setModal] = useState(null);
  useEffect(() => { setVisible(true); }, []);

  return (
    <>
      <div className="home-wrap">

        {/* BG มุมขวาบนสุด */}
        <img src="/images/BG/TOPBLUE.png" alt=""
          className="absolute top-0 right-0 w-1/4 pointer-events-none select-none z-0"
          style={{ animation: 'slideFromTopRight 1.2s 0.2s ease both' }}
          onError={e => e.target.style.display='none'} />

        {/* BG มุมล่างซ้ายสุด */}
        <img src="/images/BG/DOWNBLUE.png" alt=""
          className="absolute bottom-0 left-0 w-1/4 pointer-events-none select-none z-0"
          style={{ animation: 'slideFromBottomLeft 1.2s 0.4s ease both' }}
          onError={e => e.target.style.display='none'} />

        {/* ─── HERO + PROMOTION — พื้นหลังเดียวกัน ─── */}
        <div className="hero-bg">
        
          {/* Hero Slider */}
          <HeroSlider />

          {/* PROMOTION อยู่ใน bg เดียวกัน */}
          <div className="section relative z-1 pb-7" style={{ marginTop: 36 }}>
            <div className="section-inner">
              <div className="section-title justify-center">PROMOTION</div>
              <PromoGrid promos={PROMOS} />
            </div>
          </div>

        </div>

        <div className="divider" />

        {/* ─── UID TOP-UP ─── */}
        <div className="section">
          <div className="section-inner">
            <div className="section-title-row">
              <div className="section-title mb-0">
                <span style={{ color: '#00d1ff' }}>UID</span> TOP-UP
              </div>
              {!uidExpanded && (
                <button className="see-more-btn" onClick={() => setUidExpanded(true)}>ดูเกมอื่นๆ</button>
              )}
            </div>
            <GameGrid games={GAMES_TOPUP} expanded={uidExpanded} onCollapse={() => setUidExpanded(false)} onTopup={onTopup} />
          </div>
        </div>

        <div className="divider" />

        {/* ─── MAIL PASS ─── */}
        <div className="section">
          <div className="section-inner">
            <div className="section-title-row">
              <div className="section-title mb-0">
                <span style={{ color: '#00d1ff' }}>MAIL/PASS</span> TOP-UP
              </div>
              {!mailExpanded && (
                <button className="see-more-btn" onClick={() => setMailExpanded(true)}>ดูเกมอื่นๆ</button>
              )}
            </div>
            <GameGrid games={GAMES_MailPass} expanded={mailExpanded} onCollapse={() => setMailExpanded(false)} />
          </div>
        </div>

        {/* ─── POPULAR PACKAGE ─── */}
        <div className="popular-section">
          <div className="popular-title">
            <span style={{ color: '#00d1ff' }}>POPULAR</span>
            <span style={{ color: '#1e293b' }}>PACKAGE</span>
          </div>
          {POPULAR_PACKAGES.map((pkg) => (
            <div className="popular-banner" key={pkg.id}>
              <div className="popular-banner-inner">
                <img
                  src={pkg.img}
                  alt={`package-${pkg.id}`}
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg,#00b4d8,#00a3cc)';
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* ─── บริการอย่างมีคุณภาพ ─── */}
        <div className="quality-section">
          <div className="quality-title">บริการอย่างมีคุณภาพ</div>
          <div className="quality-grid">
            <div className="quality-card">
              <div className="quality-icon"><img src="/images/Asset 350.png" alt="best value" style={{ width: 48, height: 48, objectFit: 'contain' }} /></div>
              <div className="quality-card-title">ความคุ้มค่า (Best Value)</div>
              <div className="quality-card-desc">
                ประหยัดกว่าเติมเองสูงสุด 10-30%<br/>
                เราให้ราคาดีและระบบทำทุกทาง<br/>
                ที่ให้ได้ตามต้นทุนที่คุ้มกว่า<br/>
                เพื่อส่งต่อความประหยัดให้ลูกค้าเอง
              </div>
            </div>
            <div className="quality-card">
              <div className="quality-icon"><img src="/images/Asset 360.png" alt="instant delivery" style={{ width: 48, height: 48, objectFit: 'contain' }} /></div>
              <div className="quality-card-title">ระบบเดิมโนว รวดเร็ว<br/>(Instant Delivery)</div>
              <div className="quality-card-desc">
                ระบบอัตโนมัติ 24 ชม.<br/>
                ไม่ต้องรอแอดมินตอบ<br/>
                เดิมเสร็จปุ๊บ ของเข้าปั๊บ<br/>
                พร้อมสุดท้ายได้ทันที
              </div>
            </div>
            <div className="quality-card">
              <div className="quality-icon"><img src="/images/Asset 370.png" alt="premium support" style={{ width: 48, height: 48, objectFit: 'contain' }} /></div>
              <div className="quality-card-title">บริการดี ปลอดภัย<br/>(Premium Support)</div>
              <div className="quality-card-desc">
                รับประกันความปลอดภัย 100%<br/>
                ไร้ความเสี่ยงโดนแบน<br/>
                เพราะเราไม่ผ่านทางที่ก่อ<br/>
                ตามกระบวนการของเกม
              </div>
            </div>
          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div id="contact-section" className="footer-section">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo.png" alt="Alaskan Logo"
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
                {[
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/CHATWEB1.png",   alt: "Chat",      href: "https://www.messenger.com/t/677062779057497/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792&recurring_notification=0" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/FACEBOOK1.png",  alt: "Facebook",  href: "https://www.facebook.com/ALASKAN.ONLINE.SHOP" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/INSTAGRAM1.png", alt: "Instagram", href: "#" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/LINE1.png",      alt: "Line",      href: "#" },
                ].map((ic) => (
                  <a href={ic.href} target="_blank" rel="noopener noreferrer" className="footer-icon-wrap" key={ic.alt}>
                    <div className="footer-icon-inner">
                      <img src={ic.src} alt={ic.alt} />
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
            <a href="https://www.facebook.com/ALASKAN.ONLINE.SHOP" target="_blank" rel="noopener noreferrer" style={{ display:'block', textDecoration:'none' }}>
              <div className="footer-fanpage-card">
                <div className="footer-fanpage-img">
                  <img src="/images/ALASKAN_WEB_ASSET/BACKGROUND/home/Alaskan_page_cover_1_ai_edit.png" alt="fanpage"
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
          <div style={{ display:'flex', gap:20, marginLeft:32 }}>
            <button onClick={() => setModal('privacy')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#64748b', fontFamily:'inherit', letterSpacing:'0.04em' }}>นโยบายความเป็นส่วนตัว</button>
            <button onClick={() => setModal('terms')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#64748b', fontFamily:'inherit', letterSpacing:'0.04em' }}>เงื่อนไขการให้บริการ</button>
          </div>
        </div>

        {/* ─── ADMIN POPUP ─── */}
        <button className="admin-popup" style={{ display: 'none' }} onClick={() => window.open('https://www.facebook.com/ALASKAN.ONLINE.SHOP', '_blank', 'noopener,noreferrer')}>
          <img className="admin-popup-icon" src="/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/FACEBOOK1.png" alt="Facebook" />
          <span className="admin-popup-text">ติดต่อแอดมินตลอด 24 ชั่วโมง!</span>
        </button>


      </div>
    </>
  );
}