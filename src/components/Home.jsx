import React, { useState, useEffect, useRef } from 'react';
import GameShowMore from './GameShowMore';
// Note: โปรโมชั่น — เพิ่ม/ลดการ์ดได้เลย
const PROMOS = [
  { id: 1, name: "ROV Promotion",      img: "/images/PRO/rov_promotion_web1_ai.png",      tag: "HOT" },
  { id: 2, name: "FreeFire Promotion", img: "/images/PRO/Alaskan_freefire_banner_web_ai.png", tag: "ใหม่" },
  { id: 3, name: "FreeFire Promotion", img: "/images/PRO/Alaskan_freefire_banner_web2_ai.png", tag: "ใหม่" },
  { id: 4, name: "MLBB Promotion",     img: "/images/PRO/mlbb_promotion_web_ai_edit1.png", tag: "HOT" },
];

// Note: ชื่อเกม , รูปภาพเกม , ล่าสุด
const GAMES_TOPUP = [
  { id: 1, name: "ROV",          img: "/images/UID/1.png", isNew: false, tag: null },
  { id: 2, name: "PUBG Mobile",  img: "/images/UID/2.png", isNew: false, tag: null },
  { id: 3, name: "Delta Force",  img: "/images/UID/3.png", isNew: false, tag: null },
  { id: 4, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 5, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 6, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 7, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 8, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 9, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 10, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
  { id: 11, name: "Call of Duty", img: "/images/UID/4.png", isNew: false, tag: null },
];

// Note: ชื่อเกม , รูปภาพเกม , ล่าสุด
const GAMES_MailPass = [
  { id: 1, name: "FC MOBILE",          img: "/images/MAIL/M1.png", isNew: false, tag: null },
  { id: 2, name: "Magic Chess Go Go",  img: "/images/MAIL/M2.png", isNew: false, tag: null },
  { id: 3, name: "Where Winds Meet",   img: "/images/MAIL/M3.png", isNew: false, tag: null },
  { id: 4, name: "Call of Duty Mobile",img: "/images/MAIL/M4.png", isNew: false, tag: null },
];

// Note: Popular Package — เพิ่ม/ลด/แก้ข้อความได้เลย
const POPULAR_PACKAGES = [
  { id: 1, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web_ai.png" },
  { id: 2, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/mlbb_promotion_web_ai_edit1.png" },
  { id: 3, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web2_ai.png" },
];

const HERO_MASCOT_IMG = "/images/ALASKAN_WEB_ASSET/BACKGROUND/home/Mascot1.png";

function GameGrid({ games, startIndex = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="games-grid">
        {games.map((game, i) => (
          <div
            className="game-card"
            key={game.id}
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`,
              width: '224px',
              minWidth: '224px',
              height: '262px',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            <img
              src={game.img}
              alt={game.name}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            {game.isNew && <div className="new-badge">NEW</div>}
            {game.tag && <div className="tag-badge">⚡ {game.tag}</div>}
          </div>
        ))}
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
      <button onClick={() => scroll('prev')} style={{
        position: 'absolute', left: -52, top: '50%', transform: 'translateY(-50%)',
        zIndex: 10, width: 40, height: 40,
        background: 'linear-gradient(135deg, #0ea5e9, #0077b6)',
        border: 'none', borderRadius: '50%',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 20, fontWeight: 900,
        boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
        transition: 'all 0.2s',
      }}>‹</button>

      <div ref={scrollRef} className="promo-grid" style={{ overflow: 'hidden' }}>
        {promos.map((p, i) => (
          <div className="promo-card" key={p.id} style={{
            opacity: seen ? 1 : 0,
            transform: seen ? 'translateY(0)' : 'translateY(40px)',
            transition: `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`,
          }}>
            <img src={p.img} alt={p.name}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
            <div className="game-overlay" />
            {p.tag && <div className={`promo-tag ${p.tag === 'ใหม่' ? 'new' : ''}`}>{p.tag}</div>}
            <div className="game-name">{p.name}</div>
          </div>
        ))}
      </div>

      <button onClick={() => scroll('next')} style={{
        position: 'absolute', right: -52, top: '50%', transform: 'translateY(-50%)',
        zIndex: 10, width: 40, height: 40,
        background: 'linear-gradient(135deg, #0ea5e9, #0077b6)',
        border: 'none', borderRadius: '50%',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 20, fontWeight: 900,
        boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
        transition: 'all 0.2s',
      }}>›</button>
    </div>
  );
}

export default function Home() {
  const [visible, setVisible] = useState(false);
  const [showMore, setShowMore] = useState(null);
  useEffect(() => { setVisible(true); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700;900&family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes newPulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
        @keyframes mascotFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes heroFadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideFromTopRight { from { opacity:0; transform:translate(60px, -60px); } to { opacity:1; transform:translate(0, 0); } }
        @keyframes slideFromBottomLeft { from { opacity:0; transform:translate(-60px, 60px); } to { opacity:1; transform:translate(0, 0); } }

        .home-wrap {
          position:relative;
          width:100%; height:100%; overflow-y:auto;
          background:#f0f4f8;
          font-family:'Noto Sans Thai', sans-serif;
          color:#1e293b;
          scrollbar-width:thin;
          scrollbar-color:#38bdf8 #e2e8f0;
        }
        .home-wrap::-webkit-scrollbar { width:6px; }
        .home-wrap::-webkit-scrollbar-track { background:#e2e8f0; }
        .home-wrap::-webkit-scrollbar-thumb { background:#38bdf8; border-radius:3px; }

        /* ─── HERO ─── */
        .hero-bg {
          position:relative; width:100%;
          background:linear-gradient(180deg,#e8f4ff 0%,#f0f8ff 50%,#f0f4f8 100%);
          overflow:hidden;
        }
        .hero-bg::before {
          content:''; position:absolute;
          top:5%; left:50%; transform:translateX(-50%);
          width:600px; height:600px;
          background:radial-gradient(circle,rgba(56,189,248,0.15) 0%,transparent 70%);
          pointer-events:none; z-index:0;
        }
        .hero-title-wrap {
          position:relative; z-index:1;
          display:flex; flex-direction:column; align-items:center;
          padding-top:48px; pointer-events:none; user-select:none;
        }
        .hero-mascot {
          position:relative; z-index:2;
          display:block; margin:0 auto;
          width:auto; max-height:420px;
          object-fit:contain; object-position:bottom;
          animation:mascotFloat 4s ease-in-out infinite, heroFadeIn 0.8s 0.15s ease both;
          filter:drop-shadow(0 16px 32px rgba(14,165,233,0.18));
        }

        /* ─── DIVIDER ─── */
        .divider { height:1px; margin:4px 32px; background:#e2e8f0; }

        /* ─── SECTION ─── */
        .section { padding:16px 32px; }
        .section-inner { max-width: 1140px; margin: 0 auto; width: 100%; }
        .section-title {
          font-size:32px; font-weight:900; letter-spacing:0.08em;
          text-transform:uppercase; margin-bottom:16px;
          display:flex; align-items:center; gap:10px; color:#0f172a;
          font-family:'Barlow Condensed', sans-serif;
        }
        .section-title::before { display:none; }
        .section-title-row {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:16px;
        }
        .see-more-btn {
          font-size:12px; font-weight:800; color:#fff;
          border:none;
          padding:7px 24px;
          background: linear-gradient(90deg, #00c6f7, #0077b6);
          cursor:pointer;
          letter-spacing:0.1em;
          font-family:'Barlow Condensed', sans-serif;
          text-transform:uppercase;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition:all 0.2s;
          box-shadow: 0 4px 14px rgba(0,198,247,0.4);
        }
        .see-more-btn:hover { opacity:0.85; transform:translateY(-1px); }

        /* ─── PROMO GRID ─── */
        .promo-grid {
          display:grid;
          grid-template-columns: repeat(4, 224px);
          gap:8px;
          height:262px;
        }
        .promo-card {
          position:relative; overflow:hidden;
          cursor:pointer; background:#dbeafe;
          border:2px solid #e2e8f0;
          box-sizing: border-box;
          width: 224px; height: 262px;
          transition:all 0.25s ease;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
          clip-path: polygon(
            16px 0%, 100% 0%,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            0% 100%, 0% 16px
          );
        }
        .promo-card:hover {
          border-color:#38bdf8;
          box-shadow:0 8px 24px rgba(56,189,248,0.2);
          transform:translateY(-3px);
        }
        .promo-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.35s ease; }
        .promo-card:hover img { transform:scale(1.04); }
        .promo-card .game-overlay {
          position:absolute; inset:0;
          background:linear-gradient(180deg,transparent 35%,rgba(10,22,60,0.88) 100%);
        }
        .promo-card .game-name {
          position:absolute; bottom:0; left:0; right:0;
          padding:8px 10px 10px; font-size:12px; font-weight:700;
          text-align:center; line-height:1.4; color:#fff;
        }
        .promo-tag {
          position:absolute; top:8px; right:8px;
          background:#f2d000; color:#1a1a1a;
          font-size:10px; font-weight:900;
          padding:3px 8px; border-radius:4px; letter-spacing:0.08em;
        }
        .promo-tag.new { background:#ef4444; color:#fff; }

        /* ─── GAMES GRID ─── */
        .games-grid { display:flex; flex-direction:row; gap:8px; overflow-x:auto; scrollbar-width:none; }
        .games-grid::-webkit-scrollbar { display:none; }
        .game-card {
          position:relative; overflow:hidden;
          cursor:pointer; width:224px; height:262px;
          box-sizing:border-box;
          border:2px solid #e2e8f0;
          transition:all 0.25s ease;
          background:#dbeafe;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
          clip-path: polygon(
            16px 0%, 100% 0%,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            0% 100%, 0% 16px
          );
        }
        .game-card:hover {
          transform:translateY(-5px);
          border-color:#38bdf8;
          box-shadow:0 10px 28px rgba(56,189,248,0.25);
        }
        .game-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top; display:block; transition:transform 0.35s ease; }
        .game-card:hover img { transform:scale(1.05); }
        .game-overlay {
          position:absolute; inset:0;
          background:linear-gradient(180deg,transparent 40%,rgba(10,22,60,0.92) 100%);
        }
        .game-name {
          position:absolute; bottom:0; left:0; right:0;
          padding:10px 10px 12px; font-size:11px; font-weight:700;
          text-align:center; line-height:1.4; color:#fff;
        }
        .new-badge {
          position:absolute; top:8px; left:8px;
          background:#ef4444; color:white; font-size:10px;
          font-weight:900; padding:3px 8px; border-radius:4px;
          letter-spacing:0.1em; animation:newPulse 2s ease infinite;
        }
        .tag-badge {
          position:absolute; bottom:40px; left:8px;
          background:rgba(0,0,0,0.6);
          border:1px solid rgba(255,255,255,0.2);
          font-size:10px; padding:2px 8px; border-radius:100px;
          color:rgba(255,255,255,0.8);
        }

        /* ─── POPULAR PACKAGE ─── */
        .popular-section { padding: 16px 32px 8px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .popular-title {
          font-size: 32px; font-weight: 900;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 4px; text-align: center;
          margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .popular-banner {
          width: 100%; margin-bottom: 12px;
          cursor: pointer;
          clip-path: polygon(
            16px 0%, 100% 0%,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            0% 100%, 0% 16px
          );
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .popular-banner:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        .popular-banner-inner { width: 100%; height: 300px; overflow: hidden; }
        .popular-banner img {
          width: 100%; height: 300px;
          object-fit: cover; object-position: center top; display: block;
        }

        /* ─── QUALITY SECTION ─── */
        .quality-section {
          background: linear-gradient(180deg, #00c6f7 0%, #0ea5e9 100%);
          padding: 48px 32px 56px; text-align: center;
        }
        .quality-title {
          font-size: 26px; font-weight: 900; color: #fff;
          font-family: 'Noto Sans Thai', sans-serif;
          margin-bottom: 32px; letter-spacing: 0.04em;
        }
        .quality-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; max-width: 760px; margin: 0 auto;
        }
        .quality-card {
          background: #fff; padding: 28px 20px 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: center; position: relative; overflow: hidden;
          clip-path: polygon(
            20px 0%, 100% 0%,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0% 100%, 0% 20px
          );
        }
        .quality-icon {
          width: 60px; height: 60px; border-radius: 50%;
          border: 2.5px solid #0ea5e9;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: #0ea5e9; margin: 0 auto 16px; font-weight: 900;
        }
        .quality-card-title {
          font-size: 14px; font-weight: 700; color: #0ea5e9;
          margin-bottom: 12px; line-height: 1.5;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .quality-card-desc {
          font-size: 12px; color: #475569; line-height: 1.8;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ─── FOOTER ─── */
        .footer-section {
          background: #fff; padding: 36px 40px;
          display: flex; gap: 40px; align-items: flex-start;
          border-top: 1px solid #e2e8f0;
        }
        .footer-left { flex: 1; }
        .footer-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .footer-logo-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #0077b6);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 20px;
        }
        .footer-logo-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 900; color: #0ea5e9; letter-spacing: 1px;
        }
        .footer-logo-sub {
          font-size: 10px; color: #94a3b8; letter-spacing: 1px;
          font-family: 'Barlow Condensed', sans-serif;
        }
        .footer-desc {
          font-size: 12px; color: #64748b; line-height: 1.9;
          font-family: 'Noto Sans Thai', sans-serif; margin-bottom: 20px;
        }
        .footer-contact { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .footer-contact-label {
          font-size: 12px; color: #475569; font-weight: 600;
          font-family: 'Noto Sans Thai', sans-serif; cursor: pointer;
        }
        .footer-contact-label:hover { color: #0ea5e9; }
        .footer-icons { display: flex; gap: 8px; }
        .footer-icon-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 48px; height: 48px;
          background: #0ea5e9;
          clip-path: polygon(
            12px 0%, 100% 0%,
            100% calc(100% - 12px),
            calc(100% - 12px) 100%,
            0% 100%, 0% 12px
          );
          cursor: pointer; transition: transform 0.2s, opacity 0.2s; text-decoration: none;
        }
        .footer-icon-inner {
          display: inline-flex; align-items: center; justify-content: center;
          width: 42px; height: 42px; background: #0ea5e9;
          clip-path: polygon(
            10px 0%, 100% 0%,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0% 100%, 0% 10px
          );
          padding: 7px;
        }
        .footer-icon-inner img { width: 100%; height: 100%; object-fit: contain; filter: brightness(0) invert(1); }
        .footer-icon-wrap:hover { transform: translateY(-3px); opacity: 0.85; }
        .footer-right { width: 220px; flex-shrink: 0; }
        .footer-fanpage-title { font-size: 16px; margin-bottom: 10px; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px; }
        .footer-fanpage-card { border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .footer-fanpage-img {
          position: relative; width: 100%; height: 120px;
          background: linear-gradient(135deg, #e8f4ff, #bfdbfe);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div className="home-wrap">

        {/* BG มุมขวาบนสุด */}
        <img src="/images/BG/TOPBLUE.png" alt="" style={{
          position:'absolute', top:0, right:0,
          width:'25%', pointerEvents:'none', userSelect:'none', zIndex:0,
          animation: 'slideFromTopRight 1.2s 0.2s ease both',
        }} onError={e => e.target.style.display='none'} />

        {/* BG มุมล่างซ้ายสุด */}
        <img src="/images/BG/DOWNBLUE.png" alt="" style={{
          position:'absolute', bottom:0, left:0,
          width:'25%', pointerEvents:'none', userSelect:'none', zIndex:0,
          animation: 'slideFromBottomLeft 1.2s 0.4s ease both',
        }} onError={e => e.target.style.display='none'} />

        {/* ─── HERO + PROMOTION — พื้นหลังเดียวกัน ─── */}
        <div className="hero-bg">

          {/* Title */}
          <div className="hero-title-wrap">
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
              fontSize: 'clamp(40px, 7vw, 90px)', lineHeight: 0.9,
              color: '#0ea5e9', letterSpacing: '8px', textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(14,165,233,0.3)',
            }}>ALASKAN</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 'clamp(11px, 1.5vw, 16px)', letterSpacing: '8px',
              color: '#334155', textTransform: 'uppercase', marginTop: '6px',
            }}>TOPUP GAME ONLINE</div>
          </div>

          {/* Mascot */}
          <img
            className="hero-mascot"
            src={HERO_MASCOT_IMG}
            alt="mascot"
            onError={e => { e.target.style.display = 'none'; }}
          />

          {/* PROMOTION อยู่ใน bg เดียวกัน */}
          <div className="section" style={{ paddingBottom: 28, position:'relative', zIndex:1 }}>
            <div className="section-title" style={{ justifyContent: 'center' }}>PROMOTION</div>
            <div className="section-inner">
              <PromoGrid promos={PROMOS} />
            </div>
          </div>

        </div>

        <div className="divider" />

        {/* ─── UID TOP-UP ─── */}
        <div className="section">
          <div className="section-title-row">
            <div className="section-title" style={{ margin: 0 }}>
              <span style={{ color: '#0ea5e9' }}>UID</span> TOP-UP
            </div>
            <button className="see-more-btn" onClick={() => setShowMore('uid')}>SEE MORE</button>
          </div>
          <div className="section-inner">
            <GameGrid games={GAMES_TOPUP} startIndex={0} />
          </div>
        </div>

        <div className="divider" />

        {/* ─── MAIL PASS ─── */}
        <div className="section">
          <div className="section-title-row">
            <div className="section-title" style={{ margin: 0 }}>
              <span style={{ color: '#0ea5e9' }}>MAIL/PASS</span> TOP-UP
            </div>
            <button className="see-more-btn" onClick={() => setShowMore('mail')}>SEE MORE</button>
          </div>
          <div className="section-inner">
            <GameGrid games={GAMES_MailPass} startIndex={GAMES_TOPUP.length} />
          </div>
        </div>

        {/* ─── POPULAR PACKAGE ─── */}
        <div className="popular-section">
          <div className="popular-title">
            <span style={{ color: '#0ea5e9' }}>POPULAR</span>
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
                    e.target.parentElement.style.background = 'linear-gradient(135deg,#00b4d8,#0077b6)';
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
              <div className="quality-icon">$</div>
              <div className="quality-card-title">ความคุ้มค่า (Best Value)</div>
              <div className="quality-card-desc">
                ประหยัดกว่าเติมเองสูงสุด 10-30%<br/>
                เราให้ราคาดีและระบบทำทุกทาง<br/>
                ที่ให้ได้ตามต้นทุนที่คุ้มกว่า<br/>
                เพื่อส่งต่อความประหยัดให้ลูกค้าเอง
              </div>
            </div>
            <div className="quality-card">
              <div className="quality-icon">⚡</div>
              <div className="quality-card-title">ระบบเดิมโนว รวดเร็ว<br/>(Instant Delivery)</div>
              <div className="quality-card-desc">
                ระบบอัตโนมัติ 24 ชม.<br/>
                ไม่ต้องรอแอดมินตอบ<br/>
                เดิมเสร็จปุ๊บ ของเข้าปั๊บ<br/>
                พร้อมสุดท้ายได้ทันที
              </div>
            </div>
            <div className="quality-card">
              <div className="quality-icon">✓</div>
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
        <div className="footer-section">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-icon">⬡</div>
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
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/CHATWEB1.png",   alt: "Chat" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/FACEBOOK1.png",  alt: "Facebook" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/INSTAGRAM1.png", alt: "Instagram" },
                  { src: "/images/ALASKAN_WEB_ASSET/SOCIAL%20ICON/PNG/LINE1.png",      alt: "Line" },
                ].map((ic) => (
                  <a href="#" className="footer-icon-wrap" key={ic.alt}>
                    <div className="footer-icon-inner">
                      <img src={ic.src} alt={ic.alt} />
                    </div>
                  </a>
                ))}
              </div>
              <span className="footer-contact-label" style={{ marginLeft: 24 }}>นโยบายความเป็นส่วนตัว</span>
              <span className="footer-contact-label" style={{ marginLeft: 24 }}>เงื่อนไขการให้บริการ</span>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-fanpage-title">
              <span style={{ color: '#1877f2', fontWeight: 900 }}>FACEBOOK</span>
              <span style={{ fontWeight: 900 }}> FANPAGE</span>
            </div>
            <div className="footer-fanpage-card">
              <div className="footer-fanpage-img">
                <img src="/images/fanpage-preview.jpg" alt="fanpage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── GameShowMore Overlay ─── */}
        {showMore === 'uid' && (
          <GameShowMore
            games={GAMES_TOPUP}
            title="UID TOP-UP"
            accentWord="UID"
            onClose={() => setShowMore(null)}
          />
        )}
        {showMore === 'mail' && (
          <GameShowMore
            games={GAMES_MailPass}
            title="MAIL/PASS TOP-UP"
            accentWord="MAIL/PASS"
            onClose={() => setShowMore(null)}
          />
        )}

      </div>
    </>
  );
}