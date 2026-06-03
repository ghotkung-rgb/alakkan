import { useState } from 'react';
import { GAMES } from '../config/games';
import { FLAG_BASE, COUNTRY_NAMES_TH as COUNTRY_NAMES } from '../config/constants';

const TABS = ['ทั้งหมด', 'โปรโมชั่น', 'ขายดี'];

export default function TopupHub({ onSelectGame, onBack }) {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  const allGames = Object.values(GAMES);
  const activeCount = allGames.filter(g => g.packages && g.packages.length > 0).length;
  const filtered = activeCategory === 'ทั้งหมด'
    ? allGames
    : allGames.filter(g => g.tags && g.tags.includes(activeCategory));

  return (
    <>
      <style>{`
        .hub-page {
          background: #f0f4f8;
          min-height: 100vh;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Header ── */
        .hub-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 20px 0;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .hub-header-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .hub-back-btn {
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          color: #1e293b;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .hub-back-btn:hover {
          background: #00d1ff;
          color: #fff;
          border-color: #00d1ff;
        }
        .hub-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #1e293b;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .hub-subtitle {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .hub-subtitle span {
          color: #00d1ff;
          font-weight: 700;
        }

        /* ── Category filter ── */
        .hub-cats {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: none;
        }
        .hub-cats::-webkit-scrollbar { display: none; }
        .hub-cat-chip {
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          white-space: nowrap;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .hub-cat-chip.active {
          background: #00d1ff;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0,209,255,0.35);
        }
        .hub-cat-chip.idle {
          background: #f1f5f9;
          color: #475569;
        }
        .hub-cat-chip.idle:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* ── Game grid ── */
        .hub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 12px;
          padding: 16px;
        }
        @media (min-width: 480px) {
          .hub-grid { grid-template-columns: repeat(auto-fill, minmax(158px, 1fr)); gap: 14px; }
        }
        @media (min-width: 768px) {
          .hub-grid { grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 16px; padding: 20px; }
        }
        @media (min-width: 1024px) {
          .hub-grid { grid-template-columns: repeat(auto-fill, minmax(178px, 1fr)); padding: 24px; }
        }

        /* ── Game card ── */
        .hub-card {
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #1e293b;
          box-shadow: 0 2px 10px rgba(0,0,0,0.12);
          transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.22s;
          -webkit-tap-highlight-color: transparent;
        }
        .hub-card:hover {
          transform: translateY(-7px) scale(1.025);
          box-shadow: 0 14px 36px rgba(0,0,0,0.22);
        }
        .hub-card:active {
          transform: scale(0.97);
        }
        .hub-card-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.35s ease;
        }
        .hub-card:hover .hub-card-bg {
          transform: scale(1.18);
        }
        .hub-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.45) 50%,
            transparent 100%
          );
        }
        .hub-card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.02em;
          backdrop-filter: blur(4px);
          z-index: 2;
        }
        .hub-card-badge.soon {
          background: rgba(245, 158, 11, 0.88);
          color: #fff;
        }
        .hub-card-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px 12px 13px;
          z-index: 2;
        }
        .hub-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          object-fit: cover;
          border: 1.5px solid rgba(255,255,255,0.25);
          margin-bottom: 7px;
          display: block;
        }
        .hub-card-name {
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          line-height: 1.35;
          margin-bottom: 2px;
        }
        .hub-card-cat {
          color: rgba(255,255,255,0.55);
          font-size: 10px;
          margin-bottom: 9px;
        }
        .hub-card-btn {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 12px;
          color: #fff;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .hub-card-btn.active {
          background: #00d1ff;
          box-shadow: 0 2px 8px rgba(0,209,255,0.5);
        }
        .hub-card-btn.soon {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
        }

        /* ── Empty state ── */
        .hub-empty {
          padding: 60px 24px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
        }
      `}</style>

      <div className="hub-page">

        {/* Header */}
        <div className="hub-header">
          <div className="hub-header-top">
            <button className="hub-back-btn" onClick={onBack}>&#9664; กลับ</button>
            <div>
              <div className="hub-title">บริการเติมเกม UID</div>
              <div className="hub-subtitle">
                เปิดบริการแล้ว <span>{activeCount} เกม</span> · ทั้งหมด {allGames.length} เกม
              </div>
            </div>
          </div>

          <div className="hub-cats">
            {TABS.map(cat => (
              <button
                key={cat}
                className={`hub-cat-chip ${activeCategory === cat ? 'active' : 'idle'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="hub-empty">ไม่มีเกมในหมวดนี้</div>
        ) : (
          <div className="hub-grid">
            {filtered.map(game => {
              const hasPackages = game.packages && game.packages.length > 0;
              return (
                <div
                  key={game.id}
                  className="hub-card"
                  onClick={() => onSelectGame(game.id)}
                >
                  <img
                    src={game.bg}
                    alt=""
                    className="hub-card-bg"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="hub-card-overlay" />
                  {!hasPackages && (
                    <span className="hub-card-badge soon">เร็วๆ นี้</span>
                  )}
                  {game.country && (
                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '3px 8px 3px 3px', backdropFilter: 'blur(4px)', zIndex: 3 }}>
                      <img src={`${FLAG_BASE}/${game.country}.png`} alt="" style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      <span style={{ fontSize: 10, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 28 }}>{COUNTRY_NAMES[game.country] || game.country}</span>
                    </div>
                  )}
                  <div className="hub-card-info">
                    <img
                      src={game.icon}
                      alt=""
                      className="hub-card-icon"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="hub-card-name">{game.name}</div>
                    <div className="hub-card-cat">
                      {game.category}{game.country ? ` · ${COUNTRY_NAMES[game.country]}` : ''}
                    </div>
                    <span className={`hub-card-btn ${hasPackages ? 'active' : 'soon'}`}>
                      {hasPackages ? 'เติมเกม' : 'เร็วๆ นี้'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}
