import { useState } from 'react';
import { FaFire } from 'react-icons/fa';

const NEWS = [
  {
    id: 0,
    game: 'ROV',
    tag: 'ROV',
    tagColor: '#1a6bbf',
    accentColor: '#1a6bbf',
    gradientExtra: 'linear-gradient(135deg, #0d2a00 0%, #0f2d5c 50%, #1a6bbf 100%)',
    date: '30 พ.ค. – 5 ก.ค. 2026',
    title: '⚽ RoV Sport Fest: 1 Goal 1 Server เชียร์มัน รางวัลยกเซิร์ฟ! แจกฟรีตลอดมิถุนายน',
    summary: 'กิจกรรมฟุตบอลธีมยักษ์ใหญ่ตลอดเดือนมิถุนายน! รับสกินใหม่ Laville, Veres, ชุดนักบอล Flowborn, สกิน Siren Dolia มีเอฟเฟกต์ และเปิดสกินระดับสูงฟรีทุกวัน',
    hot: true,
    img: '/images/rov11.jpg',
    url: 'https://www.facebook.com/ROVTH/',
    highlight: [
      'สกินใหม่ Laville มีเอฟเฟกต์ (12 มิ.ย.)',
      'สกินใหม่ Veres + ชุดบอล Flowborn',
      'สกิน Siren Dolia มีเอฟเฟกต์ + Limited คูปอง',
      'Championship รอบที่ 1–4 (27 มิ.ย. – 5 ก.ค.)',
    ],
  },
  {
    id: 1,
    game: 'ROV',
    tag: 'ROV',
    tagColor: '#1a6bbf',
    accentColor: '#1a6bbf',
    gradientExtra: 'linear-gradient(140deg, #0a1830 0%, #0f2d5c 55%, #1a6bbf 100%)',
    date: '20 พ.ค. 2026',
    title: 'ROV Flow Strike! ฮีโร่ใหม่ Flowborn + Collab Attack on Titan มาแล้ว',
    summary: 'อัปเดตใหม่ล่าสุด Flow Strike! มาพร้อมฮีโร่ใหม่ Flowborn, สกินครอสโอเวอร์ AOT (Cresht/Eren, Aoi/Mikasa, Nakroth/Levi) และโหมดใหม่ Arcane Brawl',
    hot: true,
    url: 'https://rov.in.th/',
  },
  {
    id: 2,
    game: 'ROV',
    tag: 'ROV',
    tagColor: '#1a6bbf',
    accentColor: '#1a6bbf',
    gradientExtra: 'linear-gradient(140deg, #061428 0%, #0f2d5c 60%, #2288e0 100%)',
    date: '10 พ.ค. 2026',
    title: 'RoV ประกาศเข้าร่วม Esports World Cup 2026 อย่างเป็นทางการ',
    summary: 'Garena ยืนยัน RoV: Arena of Valor ร่วมศึกใน Esports World Cup 2026 พร้อม patch Nakroth Rework ปรับสมดุลฮีโร่ครั้งใหญ่ฉลอง 9 ปีของเกม',
    hot: false,
    url: 'https://rov.in.th/',
  },
  {
    id: 3,
    game: 'FreeFire',
    tag: 'FREE FIRE',
    tagColor: '#e85c00',
    accentColor: '#e85c00',
    gradientExtra: 'linear-gradient(140deg, #1a0800 0%, #5c1500 55%, #e85c00 100%)',
    date: '7 พ.ค. 2026',
    title: 'Free Fire x Gintama Collab ปิดฉาก + OB54 กำลังมาพร้อมคอนเทนต์ใหม่',
    summary: 'Collaboration Gintama สิ้นสุดแล้ว (7 พ.ค.) มาพร้อมไอเทมธีม Gintoki, Kagura และ Elizabeth อัปเดต OB54 กำลังจะตามมาพร้อม Collaboration ใหม่ที่ยังไม่เปิดเผย',
    hot: false,
    url: 'https://ff.garena.com/en/news/',
  },
  {
    id: 4,
    game: 'FreeFire',
    tag: 'FREE FIRE',
    tagColor: '#e85c00',
    accentColor: '#e85c00',
    gradientExtra: 'linear-gradient(140deg, #1a0500 0%, #3d1000 55%, #cc4400 100%)',
    date: '4 พ.ค. 2026',
    title: 'Booyah Pass: Stellar Twins + 100% Bonus Top-Up Event เริ่มแล้ว!',
    summary: 'Booyah Pass ประจำเดือนใหม่ในธีม "Stellar Twins" พร้อมกับ Universal Ring Event และ 100% Bonus Top-Up Event — เติมเงินช่วงนี้รับ Diamond เพิ่มเป็น 2 เท่า',
    hot: true,
    url: 'https://ff.garena.com/en/news/',
  },
  {
    id: 5,
    game: 'PUBG',
    tag: 'PUBG MOBILE',
    tagColor: '#c8a800',
    accentColor: '#c8a800',
    gradientExtra: 'linear-gradient(140deg, #0a0900 0%, #1a1400 55%, #6b5800 100%)',
    date: '12 พ.ค. 2026',
    title: 'PUBG Mobile v4.4 มาแล้ว! Nimbus Island ลอยฟ้า + บอส Centaur ยักษ์',
    summary: "อัปเดต v4.4 Hero's Crown เปลี่ยน Erangel ด้วยสถาปัตยกรรมกรีก-โรมัน พร้อมเกาะลอยฟ้า Nimbus Island ที่มีบอส Centaur 2 ร่าง ที่ต้องช่วยกันล้มใน 3 นาที",
    hot: true,
    url: 'https://www.pubgmobile.com/en-US/news-detail.shtml',
  },
  {
    id: 6,
    game: 'PUBG',
    tag: 'PUBG MOBILE',
    tagColor: '#c8a800',
    accentColor: '#c8a800',
    gradientExtra: 'linear-gradient(140deg, #050500 0%, #0a0a00 55%, #4a3e00 100%)',
    date: '13 พ.ค. 2026',
    title: 'PUBG Mobile x Blue Lock Collab + Ranked Season 30 เปิดแล้ว',
    summary: 'ร่วมมือกับอนิเมะ Blue Lock และ Harley-Davidson collab ช่วง 8 พ.ค.–5 มิ.ย. พร้อมกับ Ranked Season 30 เริ่มวันที่ 13 พ.ค. ระบบ Glory Point ใหม่',
    hot: false,
    url: 'https://www.pubgmobile.com/en-US/news-detail.shtml',
  },
];

const FILTERS = ['ทั้งหมด', 'ROV', 'FREE FIRE', 'PUBG MOBILE'];

const GAME_LETTER = { ROV: 'ROV', FreeFire: 'FF', PUBG: 'PUBG' };

export default function News() {
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด');

  const filtered = NEWS.filter(n =>
    activeFilter === 'ทั้งหมด' || n.tag === activeFilter
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const countFor = (f) =>
    f === 'ทั้งหมด' ? NEWS.length : NEWS.filter(n => n.tag === f).length;

  return (
    <>
      <style>{`
        /* ── Page ── */
        .news-page {
          min-height: 100vh;
          background: #f0f4f8;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Header ── */
        .news-header {
          background: linear-gradient(135deg, #040c1e 0%, #0d2348 60%, #091c3a 100%);
          padding: 52px 32px 40px;
          position: relative;
          overflow: hidden;
        }
        .news-header::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .news-header::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00d1ff 40%, #0ea5e9 60%, transparent);
        }
        .news-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .news-header-eyebrow {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 11px; letter-spacing: 0.25em;
          color: #00d1ff; font-weight: 400;
          margin-bottom: 10px;
        }
        .news-header-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900; color: #fff;
          line-height: 1.1; letter-spacing: 0.02em;
          margin: 0 0 10px;
        }
        .news-header-sub {
          font-size: 14px; color: rgba(255,255,255,0.45);
        }

        /* ── Filter bar ── */
        .news-filter-bar {
          background: #fff;
          border-bottom: 1px solid #e8f0f8;
          padding: 14px 32px;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .news-filter-bar-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; gap: 8px; flex-wrap: wrap;
          align-items: center;
        }
        .news-filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 16px; border-radius: 30px;
          font-size: 12px; font-weight: 700;
          font-family: 'Good Times Rg', sans-serif;
          letter-spacing: 0.04em;
          border: 1.5px solid transparent;
          cursor: pointer; transition: all 0.18s ease;
          line-height: 1;
        }
        .news-filter-btn.active {
          background: #00d1ff; color: #fff;
          border-color: #00d1ff;
          box-shadow: 0 3px 12px rgba(0,209,255,0.35);
        }
        .news-filter-btn:not(.active) {
          background: #f1f5f9; color: #475569;
          border-color: #e2e8f0;
        }
        .news-filter-btn:not(.active):hover {
          border-color: #00d1ff; color: #00d1ff; background: #edfaff;
        }
        .news-filter-count {
          background: rgba(255,255,255,0.25);
          border-radius: 10px;
          padding: 1px 6px;
          font-size: 10px;
          line-height: 1.4;
        }
        .news-filter-btn:not(.active) .news-filter-count {
          background: #e2e8f0;
          color: #94a3b8;
        }

        /* ── Content area ── */
        .news-content {
          max-width: 1100px; margin: 0 auto;
          padding: 32px 24px 72px;
        }

        /* ── Featured card ── */
        .news-featured {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          margin-bottom: 32px;
          min-height: 400px;
          display: flex;
          align-items: flex-end;
          transition: box-shadow 0.3s ease;
        }
        .news-featured:hover {
          box-shadow: 0 24px 56px rgba(0,0,0,0.22);
        }
        .news-featured:hover .news-featured-img {
          transform: scale(1.04);
        }
        .news-featured-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          transition: transform 0.5s ease;
        }
        .news-featured-gradient {
          position: absolute; inset: 0;
        }
        .news-featured-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(4,12,30,0.97) 0%,
            rgba(4,12,30,0.75) 40%,
            rgba(4,12,30,0.25) 70%,
            transparent 100%
          );
        }
        .news-featured-badge {
          position: absolute; top: 20px; left: 20px;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 9px; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          padding: 5px 12px; border-radius: 4px;
        }
        .news-featured-body {
          position: relative; z-index: 2;
          padding: 32px 36px 36px;
          width: 100%;
          max-width: 680px;
        }
        .news-featured-meta {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px; flex-wrap: wrap;
        }
        .news-tag {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 9px; letter-spacing: 0.15em;
          padding: 4px 10px; border-radius: 4px;
          border: 1.5px solid currentColor;
          line-height: 1;
        }
        .news-hot-badge {
          display: inline-flex; align-items: center; gap: 3px;
          background: linear-gradient(135deg, #ff3b3b, #c0392b);
          color: #fff; padding: 4px 9px; border-radius: 4px;
          font-size: 9px; font-weight: 800;
          font-family: 'Good Times Rg', sans-serif;
          letter-spacing: 0.1em; line-height: 1;
        }
        .news-date {
          font-size: 12px; color: rgba(255,255,255,0.45);
          margin-left: auto;
        }
        .news-featured-title {
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 800; color: #fff;
          line-height: 1.4; margin: 0 0 12px;
          letter-spacing: 0.01em;
        }
        .news-featured-summary {
          font-size: 14px; color: rgba(255,255,255,0.65);
          line-height: 1.75; margin: 0 0 16px;
        }
        .news-highlights {
          display: flex; flex-direction: column; gap: 6px;
          margin-bottom: 20px;
        }
        .news-highlight-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .news-highlight-dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0;
        }
        .news-featured-cta {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 11px; letter-spacing: 0.08em;
          color: #fff;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          padding: 9px 18px; border-radius: 6px;
          cursor: pointer; transition: all 0.2s ease;
          outline: none;
        }
        .news-featured:hover .news-featured-cta {
          background: rgba(0,209,255,0.15);
          border-color: rgba(0,209,255,0.5);
          color: #00d1ff;
        }

        /* ── Grid section label ── */
        .news-grid-label {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 10px; letter-spacing: 0.2em; color: #94a3b8;
          margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
        }
        .news-grid-label::after {
          content: ''; flex: 1; height: 1px; background: #e2e8f0;
        }

        /* ── Grid ── */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 900px) {
          .news-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .news-grid { grid-template-columns: 1fr; }
          .news-featured-body { padding: 24px 20px 28px; }
          .news-featured { min-height: 340px; }
        }

        /* ── Grid card ── */
        .news-grid-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          min-height: 240px;
          display: flex; flex-direction: column; justify-content: flex-end;
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease;
        }
        .news-grid-card:hover {
          transform: translateY(-6px);
        }
        .news-grid-card-bg {
          position: absolute; inset: 0;
        }
        .news-grid-card-letter {
          position: absolute;
          font-family: 'Ethnocentric', sans-serif;
          font-size: 100px; font-weight: 400;
          color: rgba(255,255,255,0.055);
          right: -8px; top: 4px;
          line-height: 1; user-select: none;
          letter-spacing: -0.02em;
        }
        .news-grid-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.4) 55%,
            transparent 100%
          );
        }
        .news-grid-card-body {
          position: relative; z-index: 2;
          padding: 18px 20px 20px;
        }
        .news-grid-card-meta {
          display: flex; align-items: center; gap: 7px;
          margin-bottom: 10px; flex-wrap: wrap;
        }
        .news-grid-card-title {
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          font-size: 15px; font-weight: 800; color: #fff;
          line-height: 1.45; margin: 0 0 8px;
          letter-spacing: 0.01em;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .news-grid-card-date {
          font-size: 11px; color: rgba(255,255,255,0.4);
          margin-left: auto;
        }
        .news-grid-card-cta {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 9px; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.55);
          background: none; border: none;
          cursor: pointer; padding: 0;
          transition: color 0.2s ease, gap 0.2s ease;
          outline: none;
        }
        .news-grid-card:hover .news-grid-card-cta {
          color: #fff; gap: 8px;
        }
        .news-grid-card-accent {
          position: absolute; top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 16px 0 0 16px;
        }

        /* ── Empty state ── */
        .news-empty {
          text-align: center; padding: 72px 0;
          color: #94a3b8;
          font-size: 15px;
        }
      `}</style>

      <div className="news-page">

        {/* HEADER */}
        <div className="news-header" style={{ paddingTop: 80 }}>
          <div className="news-header-inner">
            <div className="news-header-eyebrow">ALASKAN TOPUP — NEWS & UPDATE</div>
            <h1 className="news-header-title">
              ข่าวสาร<span style={{ color: '#00d1ff' }}>เกม</span>
            </h1>
            <p className="news-header-sub">อัปเดตล่าสุด · ROV · Free Fire · PUBG Mobile</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="news-filter-bar">
          <div className="news-filter-bar-inner">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`news-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                <span className="news-filter-count">{countFor(f)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="news-content">

          {/* FEATURED */}
          {featured && (
            <div
              className="news-featured"
              onClick={() => window.open(featured.url, '_blank', 'noopener,noreferrer')}
            >
              {featured.img && (
                <img className="news-featured-img" src={featured.img} alt={featured.title} loading="lazy" decoding="async" />
              )}
              <div
                className="news-featured-gradient"
                style={{ background: featured.gradientExtra, opacity: featured.img ? 0.7 : 1 }}
              />
              <div className="news-featured-overlay" />
              <div className="news-featured-badge">FEATURED</div>

              <div className="news-featured-body">
                <div className="news-featured-meta">
                  <span className="news-tag" style={{ color: featured.tagColor, borderColor: featured.tagColor }}>
                    {featured.tag}
                  </span>
                  {featured.hot && <span className="news-hot-badge"><FaFire /> HOT</span>}
                  <span className="news-date">{featured.date}</span>
                </div>
                <h2 className="news-featured-title">{featured.title}</h2>
                <p className="news-featured-summary">{featured.summary}</p>
                {featured.highlight && (
                  <div className="news-highlights">
                    {featured.highlight.map((h, i) => (
                      <div key={i} className="news-highlight-item">
                        <div className="news-highlight-dot" style={{ background: featured.accentColor }} />
                        {h}
                      </div>
                    ))}
                  </div>
                )}
                <button className="news-featured-cta">
                  อ่านข่าวเพิ่มเติม <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* GRID */}
          {rest.length > 0 && (
            <>
              <div className="news-grid-label">MORE NEWS</div>
              <div className="news-grid">
                {rest.map(n => (
                  <div
                    key={n.id}
                    className="news-grid-card"
                    style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.18)` }}
                    onClick={() => window.open(n.url, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="news-grid-card-bg" style={{ background: n.gradientExtra }} />
                    <div className="news-grid-card-accent" style={{ background: n.accentColor }} />
                    <div className="news-grid-card-letter">{GAME_LETTER[n.game]}</div>
                    <div className="news-grid-card-overlay" />
                    <div className="news-grid-card-body">
                      <div className="news-grid-card-meta">
                        <span className="news-tag" style={{ color: n.tagColor, borderColor: n.tagColor, fontSize: 8 }}>
                          {n.tag}
                        </span>
                        {n.hot && <span className="news-hot-badge"><FaFire /></span>}
                        <span className="news-grid-card-date">{n.date}</span>
                      </div>
                      <h3 className="news-grid-card-title">{n.title}</h3>
                      <button className="news-grid-card-cta">
                        อ่านเพิ่มเติม <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="news-empty">ยังไม่มีข่าวในหมวดนี้</div>
          )}

        </div>
      </div>
    </>
  );
}
