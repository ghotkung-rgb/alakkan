import React, { useState } from 'react';
import { createOrder } from '../services/topupService';

// step: 1 = เลือกแพ็กเกจ, 2 = กรอก UID, 3 = ยืนยันออเดอร์, 'success' = สำเร็จ
export default function TopupPage({ game, onBack }) {
  const [step, setStep]               = useState(1);
  const [selectedPkgs, setSelectedPkgs] = useState([]);
  const [uid, setUid]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [orderId, setOrderId]         = useState(null);

  const togglePkg = (pkg) => {
    setSelectedPkgs(prev =>
      prev.some(p => p.id === pkg.id)
        ? prev.filter(p => p.id !== pkg.id)
        : [...prev, pkg]
    );
  };

  const totalPrice   = selectedPkgs.reduce((sum, p) => sum + p.price, 0);
  const totalCoupons = selectedPkgs.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pkgSummary = selectedPkgs.length === 0
    ? ''
    : selectedPkgs.length === 1
      ? (selectedPkgs[0].label || `${selectedPkgs[0].amount.toLocaleString()} ${game.currency}`)
      : `${selectedPkgs.length} แพ็กเกจ`;
  const couponBreakdown = selectedPkgs.length === 0
    ? ''
    : totalCoupons > 0
      ? `${totalCoupons.toLocaleString()} ${game.currency}`
      : `${selectedPkgs.length} รายการ`;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await createOrder({
        gameId: game.id, uid,
        packages: selectedPkgs.map(p => ({ id: p.id, amount: p.amount, price: p.price, label: p.label })),
        totalPrice,
      });
      setOrderId(result.orderId);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 'success') { setStep(1); setSelectedPkgs([]); setUid(''); setOrderId(null); }
  };

  return (
    <>
      <style>{`
        .tp-page {
          min-height: 100vh;
          background: #f0f4f8;
          color: #1e293b;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Hero ── */
        .tp-hero {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .tp-hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center top;
          filter: brightness(0.55);
        }
        .tp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(240,244,248,0) 20%, #f0f4f8 100%);
        }
        .tp-hero-content {
          position: relative; z-index: 2;
          height: 100%;
          display: flex; align-items: flex-end;
          padding: 0 40px 24px;
          gap: 18px;
        }
        .tp-icon {
          width: 68px; height: 68px;
          border-radius: 16px;
          border: 2px solid rgba(0,209,255,0.6);
          object-fit: cover; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,209,255,0.25);
        }
        .tp-game-name {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900;
          color: #fff; letter-spacing: 0.05em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .tp-game-sub { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 2px; }

        /* ── Back btn ── */
        .tp-back-btn {
          position: absolute; top: 72px; left: 28px; z-index: 10;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e2e8f0;
          color: #1e293b; font-size: 13px; font-weight: 700;
          padding: 7px 16px; border-radius: 8px;
          cursor: pointer; font-family: 'Noto Sans Thai', sans-serif;
          transition: background 0.2s, color 0.2s;
          display: flex; align-items: center; gap: 5px;
          backdrop-filter: blur(6px);
        }
        .tp-back-btn:hover { background: #00d1ff; color: #fff; border-color: #00d1ff; }

        /* ── Body ── */
        .tp-body {
          max-width: 960px; margin: 0 auto;
          padding: 20px 24px 100px;
        }

        /* ── Stepper ── */
        .tp-stepper {
          display: flex; align-items: center;
          margin-bottom: 28px;
          gap: 0;
        }
        .tp-step-item {
          display: flex; align-items: center; gap: 8px;
          flex: 1;
        }
        .tp-step-circle {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800;
          flex-shrink: 0;
          transition: all 0.25s;
        }
        .tp-step-circle.done   { background: #00d1ff; color: #fff; }
        .tp-step-circle.active { background: #00d1ff; color: #fff; box-shadow: 0 0 0 4px rgba(0,209,255,0.2); }
        .tp-step-circle.idle   { background: #e2e8f0; color: #94a3b8; }
        .tp-step-label {
          font-size: 12px; font-weight: 700;
          white-space: nowrap;
          transition: color 0.25s;
        }
        .tp-step-label.active { color: #00d1ff; }
        .tp-step-label.done   { color: #0ea5e9; }
        .tp-step-label.idle   { color: #94a3b8; }
        .tp-step-line {
          flex: 1; height: 2px;
          margin: 0 8px;
          transition: background 0.3s;
        }
        .tp-step-line.done   { background: #00d1ff; }
        .tp-step-line.idle   { background: #e2e8f0; }

        /* ── Package grid ── */
        .tp-section-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 16px; font-weight: 900;
          color: #1e293b; letter-spacing: 0.06em;
          margin-bottom: 16px;
        }
        .tp-pkg-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }
        @media (max-width: 768px) {
          .tp-pkg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .tp-pkg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .tp-pkg-card {
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 8px 8px 12px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
          position: relative;
          text-align: center;
          overflow: hidden;
          will-change: transform;
        }
        .tp-pkg-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00d1ff, #0ea5e9, #00d1ff);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          z-index: 1;
        }
        .tp-pkg-card:hover {
          border-color: #00d1ff;
          box-shadow: 0 10px 30px rgba(0,209,255,0.2), 0 2px 8px rgba(0,0,0,0.05);
          transform: translateY(-5px) scale(1.03);
        }
        .tp-pkg-card:hover::before {
          transform: scaleX(1);
        }
        .tp-pkg-card.selected {
          border-color: #00d1ff;
          box-shadow: 0 0 0 3px rgba(0,209,255,0.18), 0 8px 24px rgba(0,209,255,0.22);
          background: linear-gradient(160deg, #edfaff 0%, #fff 60%);
          transform: scale(1.03);
        }
        .tp-pkg-card.selected::before {
          transform: scaleX(1);
          background: linear-gradient(90deg, #00d1ff, #00e5ff, #00a3cc);
        }
        @keyframes check-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .tp-pkg-check {
          position: absolute; top: 7px; right: 8px;
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 900; color: #fff;
          box-shadow: 0 3px 10px rgba(0,209,255,0.55);
          z-index: 2;
          animation: check-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .tp-coupon-label {
          font-size: 14px; font-weight: 900; color: #00d1ff;
          margin-top: 5px; letter-spacing: 0.01em;
          text-shadow: 0 0 12px rgba(0,209,255,0.35);
        }
        .tp-price {
          font-size: 15px; font-weight: 900; color: #1e293b;
          margin-top: 1px;
        }
        .tp-price-unit { font-size: 12px; color: #64748b; margin-left: 1px; font-weight: 600; }

        /* ── UID section ── */
        .tp-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .tp-card-label {
          font-size: 12px; font-weight: 700;
          color: #00d1ff; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .tp-uid-input {
          width: 100%; box-sizing: border-box;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b; font-size: 16px; font-weight: 700;
          padding: 13px 16px;
          outline: none;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: border-color 0.2s;
          letter-spacing: 0.04em;
        }
        .tp-uid-input::placeholder { color: #94a3b8; font-weight: 400; letter-spacing: 0; }
        .tp-uid-input:focus { border-color: #00d1ff; background: #fff; }
        .tp-uid-hint {
          font-size: 12px; color: #94a3b8; margin-top: 10px;
          display: flex; align-items: center; gap: 5px;
        }

        /* ── Confirm summary card ── */
        .tp-summary-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .tp-summary-row:last-child { border-bottom: none; }
        .tp-summary-key { color: #64748b; font-weight: 600; }
        .tp-summary-val { color: #0f172a; font-weight: 800; }
        .tp-summary-val.accent { color: #00d1ff; }
        .tp-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0 4px;
          font-size: 16px;
        }
        .tp-total-price {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #00d1ff;
        }

        /* ── Bottom bar ── */
        .tp-bar {
          position: sticky; bottom: 0;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-top: 1.5px solid #e2e8f0;
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
        }
        .tp-bar-info { font-size: 13px; color: #64748b; line-height: 1.5; }
        .tp-bar-info strong { color: #00d1ff; font-size: 16px; }
        .tp-next-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none;
          padding: 13px 36px; font-size: 15px; font-weight: 800;
          border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          white-space: nowrap;
          filter: drop-shadow(0 4px 12px rgba(0,209,255,0.4));
        }
        .tp-next-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .tp-next-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Warning box ── */
        .tp-warning {
          background: #fffbeb; border: 1.5px solid #fde68a;
          border-radius: 12px; padding: 14px 18px;
          display: flex; gap: 10px; align-items: flex-start;
          font-size: 13px; color: #92400e; line-height: 1.6;
          margin-bottom: 20px;
        }

        /* ── Success screen ── */
        @keyframes tp-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tp-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tp-success-wrap {
          display: flex; flex-direction: column; align-items: center;
          padding: 48px 24px 80px;
          text-align: center;
        }
        .tp-success-icon {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; color: #fff;
          margin-bottom: 24px;
          animation: tp-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          filter: drop-shadow(0 8px 24px rgba(0,209,255,0.45));
        }
        .tp-success-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900; color: #0f172a;
          margin-bottom: 6px;
          animation: tp-fade-up 0.4s 0.2s both;
        }
        .tp-success-sub {
          font-size: 14px; color: #64748b;
          margin-bottom: 32px;
          animation: tp-fade-up 0.4s 0.3s both;
        }
        .tp-success-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          padding: 20px 28px;
          width: 100%; max-width: 420px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          text-align: left;
          animation: tp-fade-up 0.4s 0.4s both;
          margin-bottom: 28px;
        }
        .tp-success-order-id {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .tp-success-order-id span {
          color: #00d1ff; font-size: 13px;
        }
        .tp-success-actions {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: tp-fade-up 0.4s 0.5s both;
        }
        .tp-home-btn {
          background: #f1f5f9; color: #1e293b;
          border: none; padding: 12px 28px;
          font-size: 14px; font-weight: 700;
          border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: background 0.2s;
        }
        .tp-home-btn:hover { background: #e2e8f0; }
        .tp-history-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none;
          padding: 12px 28px; font-size: 14px; font-weight: 700;
          border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          filter: drop-shadow(0 3px 10px rgba(0,209,255,0.35));
          transition: opacity 0.2s;
        }
        .tp-history-btn:hover { opacity: 0.88; }
      `}</style>

      {/* ── Coming Soon — เกมที่ยังไม่เปิด packages ── */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="tp-page">
          <div className="tp-hero">
            <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
            <div className="tp-hero-overlay" />
            <button className="tp-back-btn" onClick={onBack}>&#9664; กลับ</button>
            <div className="tp-hero-content">
              <img src={game.icon} alt={game.name} className="tp-icon"
                onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <div className="tp-game-name">{game.name}</div>
                <div className="tp-game-sub">{game.subtitle}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', maxWidth: 360 }}>
              <div style={{ fontSize: 52, marginBottom: 18, filter: 'grayscale(0.2)' }}>🛠️</div>
              <div style={{
                fontFamily: "'PSL Kampanath Pro', sans-serif",
                fontSize: 24, fontWeight: 900, color: '#1e293b',
                letterSpacing: '0.04em', marginBottom: 10,
              }}>
                กำลังเปิดให้บริการ
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', lineHeight: 2, marginBottom: 28 }}>
                สินค้าจะมาในเร็วๆ นี้<br />
                ติดตามได้ที่เฟส <strong style={{ color: '#1e293b' }}>ALASKAN ONLINE SHOP</strong> ของเรา
              </div>
              <a
                href="https://www.facebook.com/ALASKAN.ONLINE.SHOP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#1877f2', color: '#fff',
                  textDecoration: 'none', padding: '11px 28px',
                  borderRadius: 10, fontSize: 14, fontWeight: 700,
                  filter: 'drop-shadow(0 4px 12px rgba(24,119,242,0.4))',
                }}
              >
                ติดตาม Facebook Page
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── หน้าปกติ — เกมที่มี packages ── */}
      {game.packages && game.packages.length > 0 && (
      <div className="tp-page">

        {/* ── Hero ── */}
        <div className="tp-hero">
          <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
          <div className="tp-hero-overlay" />
          {step !== 'success' && (
            <button className="tp-back-btn" onClick={handleBack}>
              &#9664; {step === 1 ? 'กลับ' : 'ย้อนกลับ'}
            </button>
          )}
          <div className="tp-hero-content">
            <img src={game.icon} alt={game.name} className="tp-icon"
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div className="tp-game-name">{game.name}</div>
              <div className="tp-game-sub">{game.subtitle}</div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="tp-body">

          {/* Stepper (ซ่อนบน success) */}
          {step !== 'success' && (
            <div className="tp-stepper">
              {[
                { n: 1, label: 'เลือกแพ็กเกจ' },
                { n: 2, label: 'กรอก UID' },
                { n: 3, label: 'ยืนยันออเดอร์' },
              ].map((s, i) => {
                const state = step > s.n ? 'done' : step === s.n ? 'active' : 'idle';
                return (
                  <React.Fragment key={s.n}>
                    <div className="tp-step-item">
                      <div className={`tp-step-circle ${state}`}>
                        {state === 'done' ? '✓' : s.n}
                      </div>
                      <span className={`tp-step-label ${state}`}>{s.label}</span>
                    </div>
                    {i < 2 && <div className={`tp-step-line ${step > s.n ? 'done' : 'idle'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ═══════════════ STEP 1: เลือกแพ็กเกจ ═══════════════ */}
          {step === 1 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="tp-section-title" style={{ margin: 0 }}>เลือกแพ็กเกจที่ต้องการ</div>
                {selectedPkgs.length > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#00d1ff', fontSize: 14, lineHeight: 1.4 }}>
                      {couponBreakdown}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                      รวม <strong style={{ color: '#0f172a' }}>{totalPrice.toLocaleString()} ฿</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="tp-pkg-grid">
                {game.packages.map(pkg => {
                  const isSelected = selectedPkgs.some(p => p.id === pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      className={`tp-pkg-card${isSelected ? ' selected' : ''}`}
                      onClick={() => togglePkg(pkg)}
                    >
                      {isSelected && <div className="tp-pkg-check">✓</div>}
                      <img src={pkg.img} alt={`${pkg.amount}`}
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                      {(pkg.label || pkg.amount > 0) && (
                        <div className="tp-coupon-label">
                          {pkg.label || `${pkg.amount.toLocaleString()} ${game.currency}`}
                        </div>
                      )}
                      <div className="tp-price">
                        {pkg.price.toLocaleString()}
                        <span className="tp-price-unit">฿</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ═══════════════ STEP 2: กรอก UID ═══════════════ */}
          {step === 2 && (
            <>
              {/* สรุปแพ็กเกจที่เลือก */}
              <div className="tp-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: selectedPkgs.length > 1 ? 12 : 0 }}>
                  <div>
                    <div className="tp-card-label">แพ็กเกจที่เลือก ({selectedPkgs.length} รายการ)</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{pkgSummary}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#00d1ff', fontFamily: "'PSL Kampanath Pro', sans-serif" }}>
                      {totalPrice.toLocaleString()} ฿
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2, textDecoration: 'underline' }}
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>
                {selectedPkgs.length > 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedPkgs.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                        <span>{p.label || `${p.amount.toLocaleString()} ${game.currency}`}</span>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.price.toLocaleString()} ฿</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* UID input */}
              <div className="tp-card">
                <div className="tp-card-label">กรอก User ID (UID)</div>
                <input
                  className="tp-uid-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="เช่น 123456789"
                  value={uid}
                  onChange={e => setUid(e.target.value)}
                  autoFocus
                />
                <div className="tp-uid-hint">
                  <span>⚠️</span>
                  ตรวจสอบ UID ให้ถูกต้องก่อนยืนยัน ไอเทมจะถูกส่งไปยัง UID ที่กรอกทันที
                </div>
              </div>

              {/* วิธีหา UID */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#475569' }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: '#1e293b' }}>📍 วิธีดู UID ของฉันอยู่ที่ไหน?</div>
                {game.id === 'ROV' && <span>เปิดเกม → กดที่รูปโปรไฟล์ → UID จะแสดงใต้ชื่อตัวละคร</span>}
                {game.id === 'Free Fire' && <span>เปิดเกม → กดที่รูปโปรไฟล์มุมซ้ายบน → UID แสดงใต้ชื่อ</span>}
                {game.id === 'PUBG Mobile' && <span>เปิดเกม → โปรไฟล์ → UID แสดงใต้ชื่อผู้เล่น</span>}
                {!['ROV','Free Fire','PUBG Mobile'].includes(game.id) && <span>เปิดเกม → โปรไฟล์ → ดู UID ใต้ชื่อผู้เล่น</span>}
              </div>
            </>
          )}

          {/* ═══════════════ STEP 3: ยืนยันออเดอร์ ═══════════════ */}
          {step === 3 && (
            <>
              <div className="tp-warning">
                <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                <span>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน หลังจากยืนยันแล้ว <strong>ไม่สามารถยกเลิกได้</strong> ไอเทมจะถูกส่งเข้าบัญชีทันที</span>
              </div>

              <div className="tp-card">
                <div className="tp-card-label">สรุปออเดอร์</div>
                <div className="tp-summary-row">
                  <span className="tp-summary-key">เกม</span>
                  <span className="tp-summary-val">{game.name}</span>
                </div>
                {selectedPkgs.map((p, i) => (
                  <div key={p.id} className="tp-summary-row">
                    <span className="tp-summary-key">{selectedPkgs.length > 1 ? `แพ็กเกจ ${i + 1}` : 'แพ็กเกจ'}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span className="tp-summary-val accent">
                        {p.label || `${p.amount.toLocaleString()} ${game.currency}`}
                      </span>
                      {p.bonus && <div style={{ fontSize: 12, color: '#ef4444' }}>+{p.bonus}</div>}
                    </div>
                  </div>
                ))}
                <div className="tp-summary-row">
                  <span className="tp-summary-key">User ID (UID)</span>
                  <span className="tp-summary-val" style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.05em' }}>{uid}</span>
                </div>
                <div className="tp-total-row">
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>ยอดชำระรวม</span>
                  <span className="tp-total-price">{totalPrice.toLocaleString()} <span style={{ fontSize: 16, color: '#64748b' }}>บาท</span></span>
                </div>
              </div>

              <div style={{ background: '#f0fbff', border: '1.5px solid #bae6fd', borderRadius: 12, padding: '12px 18px', fontSize: 13, color: '#0369a1' }}>
                💳 ชำระเงินผ่าน PromptPay / TrueMoney Wallet / โอนธนาคาร (เดฟจะเชื่อมระบบชำระเงินในขั้นตอนถัดไป)
              </div>
            </>
          )}

          {/* ═══════════════ SUCCESS ═══════════════ */}
          {step === 'success' && (
            <div className="tp-success-wrap">
              <div className="tp-success-icon">✓</div>
              <div className="tp-success-title">สั่งซื้อสำเร็จ!</div>
              <div className="tp-success-sub">ไอเทมจะถูกส่งเข้า UID ของคุณภายใน 5–15 นาที</div>

              <div className="tp-success-card">
                <div className="tp-success-order-id">
                  Order ID: <span>#{orderId || 'ALK-XXXXXXXX'}</span>
                </div>
                <div className="tp-summary-row">
                  <span className="tp-summary-key">เกม</span>
                  <span className="tp-summary-val">{game.name}</span>
                </div>
                {selectedPkgs.map((p, i) => (
                  <div key={p.id} className="tp-summary-row">
                    <span className="tp-summary-key">{selectedPkgs.length > 1 ? `แพ็กเกจ ${i + 1}` : 'แพ็กเกจ'}</span>
                    <span className="tp-summary-val accent">
                      {p.label || `${p.amount.toLocaleString()} ${game.currency}`}
                    </span>
                  </div>
                ))}
                <div className="tp-summary-row">
                  <span className="tp-summary-key">UID</span>
                  <span className="tp-summary-val" style={{ fontFamily: 'monospace' }}>{uid}</span>
                </div>
                <div className="tp-summary-row" style={{ border: 'none', paddingTop: 14 }}>
                  <span className="tp-summary-key">ยอดชำระรวม</span>
                  <span className="tp-summary-val accent" style={{ fontSize: 20 }}>{totalPrice.toLocaleString()} บาท</span>
                </div>
              </div>

              <div className="tp-success-actions">
                <button className="tp-home-btn" onClick={onBack}>กลับหน้าหลัก</button>
                <button className="tp-history-btn" onClick={() => alert('ระบบประวัติออเดอร์กำลังพัฒนา')}>
                  ดูประวัติคำสั่งซื้อ →
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Bottom action bar (ซ่อนบน success) ── */}
        {step !== 'success' && (
          <div className="tp-bar">
            <div className="tp-bar-info">
              {step === 1 && (selectedPkgs.length > 0
                ? <>
                    <strong style={{ color: '#00d1ff' }}>{couponBreakdown}</strong>
                    <br />
                    <span style={{ color: '#64748b' }}>รวม {totalPrice.toLocaleString()} บาท</span>
                  </>
                : <span style={{ color: '#94a3b8' }}>กรุณาเลือกแพ็กเกจ</span>
              )}
              {step === 2 && (uid.trim()
                ? <><strong>{uid}</strong><br />UID ที่กรอก</>
                : <span style={{ color: '#94a3b8' }}>กรุณากรอก UID</span>
              )}
              {step === 3 && (
                <><strong>{pkgSummary}</strong> — รวม {totalPrice.toLocaleString()} บาท</>
              )}
            </div>

            <button
              className="tp-next-btn"
              disabled={
                (step === 1 && selectedPkgs.length === 0) ||
                (step === 2 && !uid.trim()) ||
                (step === 3 && loading)
              }
              onClick={() => {
                if (step === 1) setStep(2);
                else if (step === 2) setStep(3);
                else if (step === 3) handleConfirm();
              }}
            >
              {step === 3
                ? (loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ')
                : 'ถัดไป →'
              }
            </button>
          </div>
        )}

      </div>
      )}

    </>
  );
}
