import { useState, useEffect, useRef } from 'react';
import { FLAG_BASE, COUNTRY_NAMES } from '../config/constants';
import { PROMOS, POPULAR_PACKAGES, PAGE_SIZE, FILTER_TABS } from '../config/homeData';
import { GAMES } from '../config/games';
import { MAILPASS_GAMES } from '../config/mailpassGames';
import HeroSlider from './HeroSlider';
import Footer from './Footer';

const GAMES_TOPUP   = Object.values(GAMES).filter(g => g.showOnHome);
const GAMES_MailPass = Object.values(MAILPASS_GAMES).filter(g => g.showOnHome);

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
      {/* TODO: เพิ่ม width/height attribute เพื่อหลีกเลี่ยง CLS */}
      <img src={game.bg} alt={game.name} loading="lazy"
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
          {/* FIXME: marginLeft:28 ทำให้ text ห่างจาก flag มากเกินไป — ลบออกแล้ว gap:5 ที่ parent ทำหน้าที่แทน */}
          <span style={{ fontSize:9, color:'#fff', fontWeight:700, whiteSpace:'nowrap' }}>{COUNTRY_NAMES[game.country]}</span>
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
        {/* TODO: รูปแบบ stat-card (30%, 24h, 100%) เป็น "hero-metric template" ที่ design system ห้าม
                  แนะนำให้เปลี่ยนเป็น icon + short copy แทนตัวเลขใหญ่ — ดู /impeccable bolder quality-section */}
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
