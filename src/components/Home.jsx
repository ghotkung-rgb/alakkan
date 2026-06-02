import { useState, useEffect, useRef } from 'react';
import { FiGrid, FiTrendingUp, FiZap } from 'react-icons/fi';

const FLAG_BASE = '/images/ALASKAN_WEB_ASSET/FLAG';
const COUNTRY_NAMES = {
  'indonesia':                'Indonesia',
  'malaysia':                 'Malaysia',
  'philippines':              'Philippines',
  'russia':                   'Russia',
  'singapore':                'Singapore',
  'turkey':                   'Turkey',
  'united-states-of-america': 'USA',
};
import HeroSlider from './HeroSlider';
import Footer from './Footer';
// Note: โปรโมชั่น — เพิ่ม/ลดการ์ดได้เลย
// gameId ต้องตรงกับ key ใน GAMES หรือ MAILPASS_GAMES, type: 'uid' | 'mailpass'
const PROMOS = [
  { id: 1, name: "ROV Promotion",      img: "/images/PRO/rov_promotion_web1_ai.png",      tag: "HOT",  gameId: 'ROV',        type: 'uid' },
  { id: 2, name: "ACE RACER", category: "เกมแข่งรถ", bg: "/images/GAMES BG/ACERACER_bg.png", icon: "/images/GAMES ICON/ACERACER_iconapp.png", tag: "ใหม่", gameId: 'ACE RACER', type: 'uid' },
  { id: 3, name: "BIGO LIVE", category: "สตรีมมิ่ง", bg: "/images/GAMES BG/BIGOLIVE_bg.png", icon: "/images/GAMES ICON/BIGOLIVE_iconapp.png", tag: "ใหม่", gameId: 'BIGO LIVE', type: 'uid' },
  { id: 4, name: "IDENTITY V", category: "เกมเอาชีวิตรอด", bg: "/images/GAMES BG/IDENTITYV_bg.png", icon: "/images/GAMES ICON/IDENTITYV_iconapp.png", tag: null, gameId: 'Identity V', type: 'uid' },
];

// Note: ชื่อเกม , bg (ภาพพื้นหลัง) , icon (ไอคอนแอป) , category (หมวดหมู่) , tag
const GAMES_TOPUP = [
  { id: 1,  name: "ROV",               category: "เกม MOBA",           bg: "/images/GAMES BG/ROV_bg.png",             icon: "/images/GAMES ICON/ROV_iconapp.png",             tag: "ขายดี"  },
  { id: 2,  name: "Mobile Legends",    category: "เกม MOBA", tag: null,     bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png" },
  { id: 31, name: "Mobile Legends ID", category: "เกม MOBA", country: "indonesia", tag: "ขายดี", bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png" },
  { id: 25, name: "Mobile Legends MY", category: "เกม MOBA", country: "malaysia",                 bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 26, name: "Mobile Legends PH", category: "เกม MOBA", country: "philippines",              bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 27, name: "Mobile Legends SG", category: "เกม MOBA", country: "singapore",                bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 28, name: "Mobile Legends RU", category: "เกม MOBA", country: "russia",                   bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 29, name: "Mobile Legends TR", category: "เกม MOBA", country: "turkey",                   bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 30, name: "Mobile Legends US", category: "เกม MOBA", country: "united-states-of-america", bg: "/images/ALASKAN_WEB_ASSET/BACKGROUND/background_web_Alaskan/game_banner/edit/mobilelegends_web_banner.png", icon: "/images/ALASKAN_WEB_ASSET/GAMES ICON/MOBILE LEGENDS/MOBILE LEGENDS.png", tag: null },
  { id: 3,  name: "PUBG Mobile",       category: "เกม Battle Royale",   bg: "/images/GAMES BG/PUBGMOBILE_bg.png",       icon: "/images/GAMES ICON/PUBGMOBILE_iconapp.png",      tag: null   },
  { id: 4,  name: "Free Fire",         category: "เกม Battle Royale",   bg: "/images/GAMES BG/FREEFIRE_bg.png",         icon: "/images/GAMES ICON/FREEFIRE_iconapp.png",        tag: null   },
  { id: 5,  name: "Call of Duty",      category: "เกมยิง FPS",          bg: "/images/GAMES BG/CALLOFDUTY_bg.png",       icon: "/images/GAMES ICON/CALLOFDUTY_iconapp.png",      tag: null   },
  { id: 6,  name: "Delta Force",       category: "เกมยิง FPS",          bg: "/images/GAMES BG/DELTAFORCE_bg.png",       icon: "/images/GAMES ICON/DELTAFORCE_iconapp.png",      tag: "ใหม่" },
  { id: 7,  name: "Blood Strike",      category: "เกมยิง FPS",          bg: "/images/GAMES BG/BLOODSTRIKE_bg.png",      icon: "/images/GAMES ICON/BLOODSTRIKE_iconapp.png",     tag: "ใหม่" },
  { id: 8,  name: "Valorant",          category: "เกมยิงกลยุทธ์",       bg: "/images/GAMES BG/VALORANT_bg.png",         icon: "/images/GAMES ICON/VALORANT_iconapp.png",        tag: null   },
  { id: 9,  name: "Honor of Kings",    category: "เกม MOBA",            bg: "/images/GAMES BG/HONOROFKINGS_bg.png",     icon: "/images/GAMES ICON/HONOROFKINGS_iconapp.png",    tag: null   },
  { id: 10, name: "Honkai: Star Rail", category: "เกม RPG",             bg: "/images/GAMES BG/STARRAIL_bg.png",         icon: "/images/GAMES ICON/STARRAIL_iconapp.png",        tag: null   },
  { id: 11, name: "Arena Breakout",    category: "เกมยิงกลยุทธ์",       bg: "/images/GAMES BG/ARENABREAKOUT_bg.png",    icon: "/images/GAMES ICON/ARENABREAKOUT_iconapp.png",   tag: null   },
  { id: 12, name: "ACE RACER",         category: "เกมแข่งรถ",           bg: "/images/GAMES BG/ACERACER_bg.png",         icon: "/images/GAMES ICON/ACERACER_iconapp.png",        tag: null   },
  { id: 13, name: "Aether Gazer",      category: "เกม RPG",             bg: "/images/GAMES BG/AETHERGAZER_bg.png",      icon: "/images/GAMES ICON/AETHERGAZER_iconapp.png",     tag: null   },
  { id: 14, name: "AFK Journey",       category: "เกม RPG",             bg: "/images/GAMES BG/AFKJOURNEY_bg.png",       icon: "/images/GAMES ICON/AFKJOURNEY_iconapp.png",      tag: null   },
  { id: 15, name: "Ballistic Hero",    category: "เกมยิง FPS",          bg: "/images/GAMES BG/BALLISTICHERO_bg.png",    icon: "/images/GAMES ICON/BALLISTICHERO_iconapp.png",   tag: "ใหม่" },
  { id: 16, name: "BIGO LIVE",         category: "สตรีมมิ่ง",           bg: "/images/GAMES BG/BIGOLIVE_bg.png",         icon: "/images/GAMES ICON/BIGOLIVE_iconapp.png",        tag: null   },
  { id: 17, name: "Bleach",            category: "เกม RPG",             bg: "/images/GAMES BG/BLEACH_bg.png",           icon: "/images/GAMES ICON/BLEACH_iconapp.png",          tag: null   },
  { id: 18, name: "Dunk City Dynasty", category: "เกมกีฬา",             bg: "/images/GAMES BG/DUNKCITY_bg.png",         icon: "/images/GAMES ICON/DUNKCITY_iconapp.png",        tag: null   },
  { id: 19, name: "Heartopia",         category: "เกมจำลอง",            bg: "/images/GAMES BG/HEARTOPIA_bg.png",        icon: "/images/GAMES ICON/HEARTOPIA_iconapp.png",       tag: null   },
  { id: 20, name: "Identity V",        category: "เกมเอาชีวิตรอด",      bg: "/images/GAMES BG/IDENTITYV_bg.png",        icon: "/images/GAMES ICON/IDENTITYV_iconapp.png",       tag: null   },
  { id: 21, name: "LoL: Wild Rift",    category: "เกม MOBA",            bg: "/images/GAMES BG/LOLWILDRIFT_bg.png",      icon: "/images/GAMES ICON/LOLWILDRIFT_iconapp.png",     tag: null   },
  { id: 22, name: "League of Legends", category: "เกม MOBA",            bg: "/images/GAMES BG/LOL_bg.png",              icon: "/images/GAMES ICON/LOL_iconapp.png",             tag: null   },
  { id: 23, name: "Magic Chess",       category: "เกมกลยุทธ์",          bg: "/images/GAMES BG/MAGICCHESS_bg.png",       icon: "/images/GAMES ICON/MAGICCHESS_iconapp.png",      tag: null   },
  { id: 24, name: "Where Winds Meet",  category: "เกม RPG",             bg: "/images/GAMES BG/WHEREWINDMEET_bg.png",    icon: "/images/GAMES ICON/WHEREWINDMEET_iconapp.png",   tag: "ใหม่" },
];

// Note: ชื่อเกม , bg (ภาพพื้นหลัง) , icon (ไอคอนแอป) , category , tag
const GAMES_MailPass = [
  { id: 1, name: "eFootball",    category: "เกมฟุตบอล", bg: "/images/GAMES BG/EFOOTBALL_bg.png",  icon: "/images/GAMES ICON/EFOOTBALL_iconapp.png",  tag: "ขายดี" },
  { id: 2, name: "FC Mobile",    category: "เกมฟุตบอล", bg: "/images/GAMES BG/FCMOBILE_bg.png",   icon: "/images/GAMES ICON/FCMOBILE_iconapp.png",   tag: "ขายดี" },
  { id: 3, name: "Heartopia",    category: "เกมจำลอง",  bg: "/images/GAMES BG/HEARTOPIA_bg.png",  icon: "/images/GAMES ICON/HEARTOPIA_iconapp.png",  tag: null },
  { id: 4, name: "Call of Duty", category: "เกมยิง FPS", bg: "/images/GAMES BG/CALLOFDUTY_bg.png", icon: "/images/GAMES ICON/CALLOFDUTY_iconapp.png", tag: null },
];

// Note: Popular Package — เพิ่ม/ลด/แก้ข้อความได้เลย
const POPULAR_PACKAGES = [
  { id: 1, img: "/images/PRO/PACKBLOOD.png" },
  { id: 2, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web_ai.png" },
  { id: 3, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/mlbb_promotion_web_ai_edit1.png" },
  { id: 4, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web2_ai.png" },
];

const PAGE_SIZE = 15;

const FILTER_TABS = [
  { key: 'all',    label: 'ทั้งหมด', Icon: FiGrid        },
  { key: 'ขายดี', label: 'ขายดี',   Icon: FiTrendingUp  },
  { key: 'ใหม่',  label: 'ใหม่',    Icon: FiZap         },
];

function GameGrid({ games, expanded, onCollapse, onTopup }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGames = activeFilter === 'all'
    ? [...games].sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0))
    : games.filter(g => g.tag === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
      {game.country && (
        <div style={{ position:'absolute', top:20, left:10, zIndex:11, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.55)', borderRadius:20, padding:'3px 8px 3px 3px', backdropFilter:'blur(4px)' }}>
          <img src={`${FLAG_BASE}/${game.country}.png`} alt="" style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, objectFit:'cover' }} onError={e => { e.target.style.display='none'; }} />
          <span style={{ fontSize:9, color:'#fff', fontWeight:700, whiteSpace:'nowrap', marginLeft:28 }}>{COUNTRY_NAMES[game.country]}</span>
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

  const filterBar = (
    <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
      {FILTER_TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => { setActiveFilter(key); setVisibleCount(PAGE_SIZE); }}
          style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'6px 16px', borderRadius:20, border:'none', cursor:'pointer',
            fontSize:12, fontWeight:700, lineHeight:1, transition:'all 0.2s ease',
            background: activeFilter === key ? '#00d1ff' : 'rgba(0,0,0,0.07)',
            color: activeFilter === key ? '#fff' : '#475569',
            boxShadow: activeFilter === key ? '0 4px 12px rgba(0,209,255,0.35)' : 'none',
            transform: activeFilter === key ? 'translateY(-1px)' : 'none',
          }}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );

  if (!expanded) {
    const preview = filteredGames.slice(0, 5);
    return (
      <div ref={ref}>
        {filterBar}
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

  const visibleGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  return (
    <div ref={ref}>
      {filterBar}
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

function PromoGrid({ promos, onTopup, onMailPass }) {
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

  const handlePromo = (p) => {
    if (!p.gameId) return;
    if (p.type === 'mailpass') onMailPass?.(p.gameId);
    else onTopup?.(p.gameId);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ overflow: 'hidden', margin: '0' }}>
      <div ref={scrollRef} className="promo-grid" style={{ overflow: 'hidden', padding: '60px', margin: '-60px' }}>
        {promos.map((p, i) => (
          <div className={`promo-card${i === 0 ? ' featured' : ''}`} key={p.id}
            onClick={() => handlePromo(p)}
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`,
              cursor: p.gameId ? 'pointer' : 'default',
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
                  }} onClick={(e) => { e.stopPropagation(); handlePromo(p); }}>เติมเกม</button>
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


export default function Home({ onTopup, onMailPass }) {
  const [uidExpanded, setUidExpanded] = useState(false);
  const [mailExpanded, setMailExpanded] = useState(false);
  const wrapRef = useRef(null);
  const uidSectionRef = useRef(null);
  const mailSectionRef = useRef(null);

  useEffect(() => { wrapRef.current?.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <>
      <div className="home-wrap" ref={wrapRef}>

        {/* BG มุมขวาบนสุด */}
        <img src="/images/effect/TOPBLUE.png" alt=""
          className="absolute top-0 right-0 w-1/4 pointer-events-none select-none z-0"
          style={{ animation: 'slideFromTopRight 1.2s 0.2s ease both' }}
          onError={e => e.target.style.display='none'} />

        {/* BG มุมล่างซ้ายสุด */}
        <img src="/images/effect/DOWNBLUE.png" alt=""
          className="absolute bottom-0 left-0 w-1/4 pointer-events-none select-none z-0"
          style={{ animation: 'slideFromBottomLeft 1.2s 0.4s ease both' }}
          onError={e => e.target.style.display='none'} />

        {/* ─── HERO + PROMOTION — พื้นหลังเดียวกัน ─── */}
        <div className="hero-bg">
        
          {/* Hero Slider */}
          <HeroSlider />

          {/* PROMOTION อยู่ใน bg เดียวกัน */}
          <div className="section relative z-1 pb-7" style={{ marginTop: 25 }}>
            <div className="section-inner">
              <div className="section-title justify-center" style={{ marginBottom: 110, fontSize: 36 }}>PROMOTION</div>
              <PromoGrid promos={PROMOS} onTopup={onTopup} onMailPass={onMailPass} />
            </div>
          </div>

        </div>

        <div className="divider" />

        {/* ─── UID TOP-UP ─── */}
        <div className="section" ref={uidSectionRef}>
          <div className="section-inner">
            <div className="section-title-row">
              <div className="section-title mb-0">
                <span style={{ color: '#00d1ff' }}>UID</span> TOP-UP
              </div>
              {!uidExpanded && (
                <button className="see-more-btn" onClick={() => setUidExpanded(true)}>ดูเกมอื่นๆ</button>
              )}
            </div>
            <GameGrid games={GAMES_TOPUP} expanded={uidExpanded} onCollapse={() => { setUidExpanded(false); setTimeout(() => uidSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }} onTopup={onTopup} />
          </div>
        </div>

        <div className="divider" />

        {/* ─── MAIL PASS ─── */}
        <div className="section" ref={mailSectionRef}>
          <div className="section-inner">
            <div className="section-title-row">
              <div className="section-title mb-0">
                <span style={{ color: '#00d1ff' }}>MAIL/PASS</span> TOP-UP
              </div>
              {!mailExpanded && (
                <button className="see-more-btn" onClick={() => setMailExpanded(true)}>ดูเกมอื่นๆ</button>
              )}
            </div>
            <GameGrid games={GAMES_MailPass} expanded={mailExpanded} onCollapse={() => { setMailExpanded(false); setTimeout(() => mailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }} onTopup={onMailPass} />
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

        {/* ─── WHY ALASKAN ─── */}
        <div className="quality-section">
          <div className="quality-title">ทำไมต้องเลือก ALASKAN</div>
          <div className="quality-grid">
            {[
              { stat: '30%',  label: 'ประหยัดกว่าเติมเอง',         desc: 'ราคาพิเศษผ่านระบบของเรา ส่งต่อส่วนลดให้ลูกค้าโดยตรง ไม่มีค่าแอบแฝง' },
              { stat: '24h',  label: 'ระบบอัตโนมัติตลอด 24 ชม.',  desc: 'เติมเสร็จปุ๊บ ของเข้าปั๊บ ไม่ต้องรอแอดมิน ทำงานทุกวันทุกชั่วโมง' },
              { stat: '100%', label: 'ปลอดภัย ไม่โดนแบน',          desc: 'เติมตามช่องทางของเกมโดยตรง ตามกระบวนการที่ถูกต้อง ไม่มีความเสี่ยง' },
            ].map(({ stat, label, desc }) => (
              <div className="quality-card" key={stat}>
                <div className="quality-stat">{stat}</div>
                <div className="quality-card-title">{label}</div>
                <div className="quality-card-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <Footer />


      </div>
    </>
  );
}
