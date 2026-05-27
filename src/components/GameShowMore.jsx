import React, { useState, useEffect } from 'react';

// ─── GameShowMore ───────────────────────────────────────────────
// Props:
//   games    — array of { id, name, img, isNew, tag }
//   title    — ชื่อ section เช่น "UID TOP-UP" หรือ "MAIL/PASS TOP-UP"
//   accentWord — คำแรกที่เป็นสีฟ้า เช่น "UID" หรือ "MAIL/PASS"
//   onClose  — callback เมื่อปิด overlay
// ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15; // แสดงครั้งละ 10 เกม

export default function GameShowMore({ games = [], title = '', accentWord = '', onClose }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [animKey, setAnimKey] = useState(0);

  // ป้องกัน scroll ของหน้าหลัก
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
    setAnimKey(k => k + 1);
  };

  // แยก accentWord ออกจาก title
  const restTitle = title.replace(accentWord, '').trim();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700;900&family=Barlow+Condensed:wght@400;700;900&display=swap');

        @keyframes gsm-fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes gsm-slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gsm-cardIn {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes newPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.7; }
        }

        .gsm-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 20, 40, 0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          animation: gsm-fadeIn 0.25s ease both;
        }

        .gsm-modal {
          background: #f0f4f8;
          width: 90vw; max-width: 1220px;
          max-height: 90vh;
          border-radius: 0;
          display: flex; flex-direction: column;
          clip-path: polygon(
            20px 0%, 100% 0%,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0% 100%, 0% 20px
          );
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
          animation: gsm-slideUp 0.3s ease both;
          overflow: hidden;
        }

        .gsm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 28px 16px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .gsm-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          letter-spacing: 0.06em; text-transform: uppercase;
          display: flex; align-items: baseline; gap: 8px;
        }

        .gsm-title-accent { color: #00d1ff; }
        .gsm-title-rest   { color: #0f172a; }

        .gsm-close {
          width: 36px; height: 36px;
          background: #f0f4f8; border: 1.5px solid #e2e8f0;
          cursor: pointer; font-size: 18px; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          clip-path: polygon(
            8px 0%, 100% 0%,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            0% 100%, 0% 8px
          );
        }
        .gsm-close:hover { background: #ef4444; border-color: #ef4444; color: #fff; }

        .gsm-body {
          overflow-y: auto; flex: 1;
          padding: 24px 28px;
          scrollbar-width: thin;
          scrollbar-color: #38bdf8 #e2e8f0;
        }
        .gsm-body::-webkit-scrollbar { width: 5px; }
        .gsm-body::-webkit-scrollbar-track { background: #e2e8f0; }
        .gsm-body::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 3px; }

        .gsm-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .gsm-card {
          position: relative; overflow: hidden;
          cursor: pointer; aspect-ratio: 224/262;
          border: 2px solid #e2e8f0;
          background: #dbeafe;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          clip-path: polygon(
            12px 0%, 100% 0%,
            100% calc(100% - 12px),
            calc(100% - 12px) 100%,
            0% 100%, 0% 12px
          );
        }
        .gsm-card:hover {
          transform: translateY(-5px);
          border-color: #38bdf8;
          box-shadow: 0 10px 28px rgba(0,209,255,0.3);
        }
        .gsm-card img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          display: block;
          transition: transform 0.35s ease;
        }
        .gsm-card:hover img { transform: scale(1.05); }

        .gsm-new-badge {
          position: absolute; top: 8px; left: 8px;
          background: #ef4444; color: white;
          font-size: 10px; font-weight: 900;
          padding: 3px 8px; letter-spacing: 0.1em;
          animation: newPulse 2s ease infinite;
          clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
        }

        .gsm-tag-badge {
          position: absolute; bottom: 40px; left: 8px;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 10px; padding: 2px 8px; border-radius: 100px;
          color: rgba(255,255,255,0.8);
        }

        .gsm-footer {
          padding: 16px 28px 20px;
          display: flex; justify-content: center;
          background: #f0f4f8;
          border-top: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .gsm-load-more {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; border: none; cursor: pointer;
          padding: 10px 40px;
          background: #00d1ff;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          box-shadow: 0 4px 14px rgba(14,165,233,0.35);
          transition: all 0.2s;
        }
        .gsm-load-more:hover { background: #0077b6; transform: translateY(-1px); }

        .gsm-count {
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 12px; color: #94a3b8;
          text-align: center; margin-bottom: 16px;
        }
      `}</style>

      <div className="gsm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
        <div className="gsm-modal">

          {/* Header */}
          <div className="gsm-header">
            <div className="gsm-title">
              <span className="gsm-title-accent">{accentWord}</span>
              <span className="gsm-title-rest">{restTitle}</span>
            </div>
            <button className="gsm-close" onClick={onClose}>✕</button>
          </div>

          {/* Body */}
          <div className="gsm-body">
            {/* TEST BADGE — ลบบรรทัดนี้ก่อนใช้งานจริง */}
            <div className="gsm-count">แสดง {visibleGames.length} / {games.length} เกม</div>

            <div className="gsm-grid">
              {visibleGames.map((game, i) => (
                <div
                  className="gsm-card"
                  key={game.id}
                  style={{
                    animation: `gsm-cardIn 0.4s ${(i % PAGE_SIZE) * 0.04}s ease both`,
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.name}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg,#bfdbfe,#dbeafe)';
                    }}
                  />
                  {game.isNew && <div className="gsm-new-badge">NEW</div>}
                  {game.tag && <div className="gsm-tag-badge">⚡ {game.tag}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Footer — SEE MORE */}
          {hasMore && (
            <div className="gsm-footer">
              <button className="gsm-load-more" onClick={loadMore}>
                SEE MORE 
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}