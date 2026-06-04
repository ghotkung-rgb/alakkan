import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';

const BASE = '/images/ALASKAN_WEB_ASSET/PACKAGE ICON/ROV';
const ROV_PACKAGES = [
  { id: 1,  coupon: 15,    price: 15,    bonus: null,    img: `${BASE}/rov_coupon1.png` },
  { id: 2,  coupon: 50,    price: 49,    bonus: null,    img: `${BASE}/rov_coupon2.png` },
  { id: 3,  coupon: 100,   price: 99,    bonus: null,    img: `${BASE}/rov_coupon3.png` },
  { id: 4,  coupon: 300,   price: 299,   bonus: null,    img: `${BASE}/rov_coupon4.png` },
  { id: 5,  coupon: 500,   price: 490,   bonus: null,    img: `${BASE}/rov_coupon5.png` },
  { id: 6,  coupon: 1000,  price: 970,   bonus: '+50',   img: `${BASE}/rov_coupon6.png` },
  { id: 7,  coupon: 2000,  price: 1900,  bonus: '+150',  img: `${BASE}/rov_coupon7.png` },
  { id: 8,  coupon: 5000,  price: 4700,  bonus: '+500',  img: `${BASE}/rov_coupon8.png` },
  { id: 9,  coupon: 10000, price: 9400,  bonus: '+1000', img: `${BASE}/rov_coupon9.png` },
];

export default function TopupROV({ onBack }) {
  const [uid, setUid] = useState('');
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        .rov-page {
          min-height: 100vh;
          background: #f0f4f8;
          color: #1e293b;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Hero ── */
        .rov-hero {
          position: relative;
          height: 240px;
          overflow: hidden;
        }
        .rov-hero-bg {
          position: absolute; inset: 0;
          background-image: url('/images/GAMES BG/ROV_bg.png');
          background-size: cover; background-position: center top;
          filter: brightness(0.6);
        }
        .rov-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(240,244,248,0) 20%, #f0f4f8 100%);
        }
        .rov-hero-content {
          position: relative; z-index: 2;
          height: 100%;
          display: flex; align-items: flex-end;
          padding: 0 48px 28px;
          gap: 20px;
        }
        .rov-icon {
          width: 72px; height: 72px;
          border-radius: 16px;
          border: 2px solid rgba(0,209,255,0.6);
          object-fit: cover; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,209,255,0.25);
        }
        .rov-title-wrap { display: flex; flex-direction: column; gap: 3px; }
        .rov-game-name {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 30px; font-weight: 900;
          color: #fff; letter-spacing: 0.06em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .rov-game-sub { font-size: 13px; color: rgba(255,255,255,0.8); }

        /* ── Back btn ── */
        .rov-back-btn {
          position: absolute; top: 76px; left: 32px; z-index: 10;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e2e8f0;
          color: #1e293b; font-size: 13px; font-weight: 700;
          padding: 8px 18px; border-radius: 8px;
          cursor: pointer; font-family: 'Noto Sans Thai', sans-serif;
          transition: background 0.2s, color 0.2s;
          display: flex; align-items: center; gap: 6px;
          backdrop-filter: blur(6px);
        }
        .rov-back-btn:hover { background: #00d1ff; color: #fff; border-color: #00d1ff; }

        /* ── Body ── */
        .rov-body {
          max-width: 960px; margin: 0 auto;
          padding: 24px 24px 100px;
        }

        /* ── UID input ── */
        .rov-uid-section {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .rov-uid-label {
          font-size: 13px; font-weight: 700;
          color: #00d1ff; letter-spacing: 0.08em;
          margin-bottom: 10px;
        }
        .rov-uid-row { display: flex; gap: 10px; }
        .rov-uid-input {
          flex: 1;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b; font-size: 15px; font-weight: 700;
          padding: 12px 16px;
          outline: none;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: border-color 0.2s;
        }
        .rov-uid-input::placeholder { color: #94a3b8; font-weight: 400; }
        .rov-uid-input:focus { border-color: #00d1ff; }
        .rov-uid-hint {
          font-size: 12px; color: #94a3b8;
          margin-top: 8px;
        }

        /* ── Packages ── */
        .rov-section-title {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 15px; font-weight: 900;
          color: #1e293b; letter-spacing: 0.08em;
          margin-bottom: 16px;
        }
        .rov-pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 14px;
          margin-bottom: 36px;
        }
        .rov-pkg-card {
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px 16px 18px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          position: relative;
          text-align: center;
        }
        .rov-pkg-card:hover {
          border-color: #00d1ff;
          box-shadow: 0 4px 20px rgba(0,209,255,0.15);
          transform: translateY(-2px);
        }
        .rov-pkg-card.selected {
          border-color: #00d1ff;
          box-shadow: 0 4px 24px rgba(0,209,255,0.25);
          background: #f0fbff;
        }
        .rov-pkg-bonus {
          position: absolute; top: -10px; right: 12px;
          background: #ef4444;
          color: #fff; font-size: 11px; font-weight: 900;
          padding: 2px 10px; border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .rov-coupon-amount {
          font-family: 'Good Times Rg', sans-serif;
          font-size: 20px; font-weight: 900;
          color: #00d1ff; line-height: 1;
        }
        .rov-coupon-label {
          font-size: 12px; color: #94a3b8;
          margin-top: 2px; margin-bottom: 10px;
        }
        .rov-pkg-divider {
          height: 1px; background: #e2e8f0;
          margin: 10px 0;
        }
        .rov-price {
          font-size: 18px; font-weight: 900;
          color: #1e293b;
        }
        .rov-price-unit { font-size: 12px; color: #94a3b8; margin-left: 2px; }

        /* ── Confirm bar ── */
        .rov-confirm-bar {
          position: sticky; bottom: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-top: 1.5px solid #e2e8f0;
          padding: 16px 32px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
        }
        .rov-confirm-summary { font-size: 14px; color: #64748b; }
        .rov-confirm-summary strong { color: #00d1ff; font-size: 18px; }
        .rov-confirm-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none;
          padding: 13px 36px; font-size: 15px; font-weight: 700;
          border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,209,255,0.35);
        }
        .rov-confirm-btn:disabled {
          opacity: 0.3; cursor: not-allowed; transform: none;
        }
        .rov-confirm-btn:not(:disabled):hover {
          opacity: 0.88; transform: translateY(-1px);
        }
      `}</style>

      <div className="rov-page">

        {/* ── Hero ── */}
        <div className="rov-hero">
          <div className="rov-hero-bg" />
          <div className="rov-hero-overlay" />
          <button className="rov-back-btn" onClick={onBack}>
            <FiChevronLeft size={14} /> กลับ
          </button>
          <div className="rov-hero-content">
            <img src="/images/GAMES ICON/ROV_iconapp.png" alt="ROV" className="rov-icon"
              onError={e => { e.target.style.display='none'; }} />
            <div className="rov-title-wrap">
              <div className="rov-game-name">ROV</div>
              <div className="rov-game-sub">Realm of Valor — เติมคูปอง</div>
            </div>
          </div>
        </div>

        <div className="rov-body">

          {/* ── UID ── */}
          <div className="rov-uid-section">
            <div className="rov-uid-label">กรอก UID ของคุณ</div>
            <div className="rov-uid-row">
              <input
                className="rov-uid-input"
                type="text"
                placeholder="เช่น 123456789"
                value={uid}
                onChange={e => setUid(e.target.value)}
              />
            </div>
            <div className="rov-uid-hint">* ตรวจสอบ UID ให้ถูกต้องก่อนกดยืนยัน เพื่อป้องกันความผิดพลาด</div>
          </div>

          {/* ── Packages ── */}
          <div className="rov-section-title">เลือกแพ็กเกจ</div>
          <div className="rov-pkg-grid">
            {ROV_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`rov-pkg-card${selected?.id === pkg.id ? ' selected' : ''}`}
                onClick={() => setSelected(pkg)}
              >
                {pkg.bonus && <div className="rov-pkg-bonus">โบนัส {pkg.bonus}</div>}
                <img src={pkg.img} alt={`${pkg.coupon} คูปอง`} loading="lazy" decoding="async"
                  style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 6px', display: 'block' }}
                  onError={e => { e.target.style.display='none'; }} />
                <div className="rov-coupon-amount">{pkg.coupon.toLocaleString()}</div>
                <div className="rov-coupon-label">คูปอง</div>
                <div className="rov-pkg-divider" />
                <div className="rov-price">
                  {pkg.price.toLocaleString()}
                  <span className="rov-price-unit">บาท</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Confirm Bar ── */}
        <div className="rov-confirm-bar">
          <div className="rov-confirm-summary">
            {selected
              ? <>เลือก <strong>{selected.coupon.toLocaleString()} คูปอง</strong> — {selected.price.toLocaleString()} บาท</>
              : <span>กรุณาเลือกแพ็กเกจ</span>
            }
          </div>
          <button
            className="rov-confirm-btn"
            disabled={!selected || !uid.trim()}
            onClick={() => alert(`สั่งซื้อ ${selected.coupon} คูปอง ราคา ${selected.price} บาท\nUID: ${uid}`)}
          >
            ยืนยันการเติม
          </button>
        </div>

      </div>
    </>
  );
}
