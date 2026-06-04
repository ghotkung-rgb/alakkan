import { useState } from 'react';
import { MAILPASS_GAMES } from '../config/mailpassGames';
import { FiLock, FiChevronLeft } from 'react-icons/fi';

const TABS = ['ทั้งหมด', 'โปรโมชั่น', 'ขายดี'];

export default function MailPassHub({ onSelectGame, onBack }) {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  const allGames = Object.values(MAILPASS_GAMES);
  const activeCount = allGames.filter(g => g.packages && g.packages.length > 0).length;
  const filtered = activeCategory === 'ทั้งหมด'
    ? allGames
    : allGames.filter(g => g.tags && g.tags.includes(activeCategory));

  return (
    <>
      <style>{`
        .mph-page {
          background: #f0f4f8;
          min-height: 100vh;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Header ── */
        .mph-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 14px 20px 0;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .mph-header-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .mph-back-btn {
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
        .mph-back-btn:hover {
          background: #00d1ff;
          color: #fff;
          border-color: #00d1ff;
        }
        .mph-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: #1e293b;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .mph-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          margin-left: 7px;
          letter-spacing: 0.06em;
          vertical-align: middle;
        }
        .mph-subtitle {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .mph-subtitle span {
          color: #00d1ff;
          font-weight: 700;
        }

        /* ── Warning bar ── */
        .mph-warning-bar {
          background: #fffbeb;
          border-bottom: 1px solid #fde68a;
          padding: 8px 20px;
          font-size: 12px;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        /* ── Category filter ── */
        .mph-cats {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: none;
        }
        .mph-cats::-webkit-scrollbar { display: none; }
        .mph-cat-chip {
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
        .mph-cat-chip.active {
          background: #f59e0b;
          color: #fff;
          box-shadow: 0 3px 10px rgba(245,158,11,0.35);
        }
        .mph-cat-chip.idle {
          background: #f1f5f9;
          color: #475569;
        }
        .mph-cat-chip.idle:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* ── Game grid ── */
        .mph-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          gap: 12px;
          padding: 16px;
        }
        @media (min-width: 480px) {
          .mph-grid { grid-template-columns: repeat(auto-fill, minmax(158px, 1fr)); gap: 14px; }
        }
        @media (min-width: 768px) {
          .mph-grid { grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 16px; padding: 20px; }
        }
        @media (min-width: 1024px) {
          .mph-grid { grid-template-columns: repeat(auto-fill, minmax(178px, 1fr)); padding: 24px; }
        }

        /* ── Game card ── */
        .mph-card {
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #1e293b;
          box-shadow: 0 2px 10px rgba(0,0,0,0.12);
          transition: transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.22s;
          -webkit-tap-highlight-color: transparent;
        }
        .mph-card:hover {
          transform: translateY(-7px) scale(1.025);
          box-shadow: 0 14px 36px rgba(0,0,0,0.22);
        }
        .mph-card:active {
          transform: scale(0.97);
        }
        .mph-card-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.35s ease;
        }
        .mph-card:hover .mph-card-bg {
          transform: scale(1.18);
        }
        .mph-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.45) 50%,
            transparent 100%
          );
        }
        .mph-card-badge {
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
          background: rgba(245, 158, 11, 0.88);
          color: #fff;
        }
        .mph-card-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px 12px 13px;
          z-index: 2;
        }
        .mph-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          object-fit: cover;
          border: 1.5px solid rgba(255,255,255,0.25);
          margin-bottom: 7px;
          display: block;
        }
        .mph-card-name {
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          line-height: 1.35;
          margin-bottom: 2px;
        }
        .mph-card-cat {
          color: rgba(255,255,255,0.55);
          font-size: 10px;
          margin-bottom: 9px;
        }
        .mph-card-btn {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 12px;
          color: #fff;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .mph-card-btn.active {
          background: #f59e0b;
          box-shadow: 0 2px 8px rgba(245,158,11,0.5);
        }
        .mph-card-btn.soon {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
        }

        /* ── Empty state ── */
        .mph-empty {
          padding: 60px 24px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
        }
      `}</style>

      <div className="mph-page">

        {/* Header */}
        <div className="mph-header">
          <div className="mph-header-top">
            <button className="mph-back-btn" onClick={onBack}><FiChevronLeft size={14} /> กลับ</button>
            <div>
              <div className="mph-title">
                บริการเติมเกม Mail/Pass
                <span className="mph-badge">EMAIL</span>
              </div>
              <div className="mph-subtitle">
                เปิดบริการแล้ว <span>{activeCount} เกม</span> · ทั้งหมด {allGames.length} เกม
              </div>
            </div>
          </div>

          <div className="mph-cats">
            {TABS.map(cat => (
              <button
                key={cat}
                className={`mph-cat-chip ${activeCategory === cat ? 'active' : 'idle'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Warning bar */}
        <div className="mph-warning-bar">
          <FiLock size={15} style={{ flexShrink: 0 }} />
          <span>บริการนี้ใช้ Email + Password ของบัญชีเกม — โปรดอ่านนโยบายความปลอดภัยก่อนใช้งาน</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="mph-empty">ไม่มีเกมในหมวดนี้</div>
        ) : (
          <div className="mph-grid">
            {filtered.map(game => {
              const hasPackages = game.packages && game.packages.length > 0;
              return (
                <div
                  key={game.id}
                  className="mph-card"
                  onClick={() => onSelectGame(game.id)}
                >
                  <img
                    src={game.bg}
                    alt=""
                    className="mph-card-bg"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="mph-card-overlay" />
                  {!hasPackages && (
                    <span className="mph-card-badge">เร็วๆ นี้</span>
                  )}
                  <div className="mph-card-info">
                    <img
                      src={game.icon}
                      alt=""
                      className="mph-card-icon"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="mph-card-name">{game.name}</div>
                    <div className="mph-card-cat">{game.category}</div>
                    <span className={`mph-card-btn ${hasPackages ? 'active' : 'soon'}`}>
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
