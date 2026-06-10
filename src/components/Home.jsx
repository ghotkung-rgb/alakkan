import { useState, useEffect, useRef } from 'react';
import { PROMOS, POPULAR_PACKAGES } from '../config/homeData';
import { GAMES } from '../config/games';
import { MAILPASS_GAMES } from '../config/mailpassGames';
import HeroSlider from './HeroSlider';
import Footer from './Footer';
import GameGrid from './GameGrid';
import PromoGrid from './PromoGrid';

const GAMES_TOPUP    = Object.values(GAMES).filter(g => g.showOnHome);
const GAMES_MailPass = Object.values(MAILPASS_GAMES).filter(g => g.showOnHome);

export default function Home({ onTopup, onMailPass }) {
  const [uidExpanded, setUidExpanded] = useState(false);
  const [mailExpanded, setMailExpanded] = useState(false);
  const wrapRef = useRef(null);
  const uidSectionRef = useRef(null);
  const mailSectionRef = useRef(null);

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
            <GameGrid games={GAMES_MailPass} expanded={mailExpanded} onCollapse={() => { setMailExpanded(false); setTimeout(() => mailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }} onTopup={onMailPass} urlPrefix="mailpass" />
          </div>
        </div>

        {/* ─── POPULAR PACKAGE ─── */}
        <div className="popular-section">
          <div className="popular-title">
            <span style={{ color: '#00d1ff' }}>POPULAR</span>
            <span style={{ color: '#475569' }}>PACKAGE</span>
          </div>
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
