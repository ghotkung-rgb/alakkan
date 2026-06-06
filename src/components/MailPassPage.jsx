import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/topupService';
import { FiAlertTriangle, FiLock, FiBook, FiEye, FiEyeOff, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { PAYMENT_METHODS } from '../config/constants';

// step: 1 = เลือกแพ็กเกจ, 2 = กรอก Email/PW, 3 = ยืนยัน, 'success' = สำเร็จ
function buildDefaultInfo(game) {
  return {
    title: `บริการเติม${game.currency} ${game.name}`,
    taglines: [
      `ALASKAN SHOP ผู้ให้บริการเติม${game.currency}เกม ${game.name} ในราคาคุ้มค่าสุดๆ`,
      'สะดวก รวดเร็ว ปลอดภัย ถูกต้องตามระบบที่ตัวเกมกำหนดแน่นอน 100%',
    ],
    sections: [
      {
        heading: `เติม ${game.name} กับ ALASKAN SHOP ดีกว่าเติมเองยังไง?`,
        ordered: false,
        items: [
          'คุ้มและประหยัดกว่าเติมเองในเกม',
          'สะดวก รวดเร็ว พร้อมให้บริการตลอด 24 ช.ม.',
          'ทีมงานดูแลตลอดการทำรายการ ปลอดภัย 100%',
        ],
      },
      {
        heading: `ขั้นตอนการใช้บริการเติม ${game.name}`,
        ordered: true,
        items: [
          'เลือกแพ็กเกจที่ต้องการเติม',
          'กรอก Email และ Password ของบัญชีเกม',
          'กดปุ่ม "ถัดไป" และยืนยันออเดอร์',
          'เลือกช่องทางชำระเงินที่ต้องการ',
          'ทีมงานจะดำเนินการเติมและแจ้งผลให้ทราบทันที',
        ],
      },
    ],
  };
}

export default function MailPassPage({ game, onBack, step, onStep, onHome }) {
  const [selectedPkgs, setSelectedPkgs] = useState([]);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [orderId, setOrderId]           = useState(null);
  const [done, setDone]                 = useState(false);
  const [showHowto, setShowHowto]             = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAllPayment, setShowAllPayment]   = useState(false);

  const togglePkg = (pkg) => {
    setSelectedPkgs(prev =>
      prev.some(p => p.id === pkg.id)
        ? prev.filter(p => p.id !== pkg.id)
        : [...prev, pkg]
    );
  };

  const totalPrice   = selectedPkgs.reduce((sum, p) => sum + p.price, 0);
  const totalAmount  = selectedPkgs.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pkgSummary   = selectedPkgs.length === 0
    ? ''
    : selectedPkgs.length === 1
      ? (selectedPkgs[0].label || `${selectedPkgs[0].amount.toLocaleString()} ${game.currency}`)
      : `${selectedPkgs.length} แพ็กเกจ`;
  const amountDisplay = selectedPkgs.length === 0
    ? ''
    : totalAmount > 0
      ? `${totalAmount.toLocaleString()} ${game.currency}`
      : `${selectedPkgs.length} รายการ`;

  // รีเซ็ต done เมื่อกด back — ป้องกัน success overlay ค้างหลัง navigate
  useEffect(() => {
    const reset = () => setDone(false);
    window.addEventListener('popstate', reset);
    return () => window.removeEventListener('popstate', reset);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await createOrder({
        gameId: game.id, uid: email,
        packages: selectedPkgs.map(p => ({ id: p.id, amount: p.amount, price: p.price, label: p.label })),
        totalPrice,
        paymentMethod: selectedPayment,
      });
      setOrderId(result.orderId);
      setDone(true);
      // ลบ step สุดท้ายออกจาก history — ป้องกัน back/forward กลับมา re-submit ได้
      window.history.replaceState(
        { activeMenu: 'HOME', topupGame: null, mailpassGame: game.id, topupStep: 1, mailpassStep: 1 },
        '',
        window.location.hash,
      );
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep2 = email.trim() && password.trim();

  // ── ปรับสัดส่วนแบนเนอร์โปรโมชั่น step 1 (กว้าง/สูง) ── เลขหลังมาก = เตี้ยลง
  //    ค่ารวมทุกเกม · ตั้งเฉพาะเกมได้ที่ promoAspect ใน config (เช่น FC = '21 / 7')
  const PROMO_ASPECT = game.promoAspect || '21 / 7';

  return (
    <>
      <style>{`
        .mp-page {
          min-height: 100vh;
          background: #e8f4ff;
          color: #1e293b;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Hero ── */
        .mp-hero {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .mp-hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center top;
          filter: brightness(0.55);
        }
        .mp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(232,244,255,0) 20%, #e8f4ff 100%);
        }
        .mp-hero-content {
          position: relative; z-index: 2;
          height: 100%;
          display: flex; align-items: flex-end;
          padding: 0 40px 24px;
          gap: 18px;
        }
        /* ── Promo top (step1 only) ── */
        .mp-promo-wrap {
          position: relative;
        }
        .mp-icon {
          width: 68px; height: 68px;
          border-radius: 16px;
          border: 2px solid rgba(0,209,255,0.6);
          object-fit: cover; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,209,255,0.25);
        }
        .mp-game-name {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900;
          color: #fff; letter-spacing: 0.05em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .mp-game-sub { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 2px; }
        .mp-game-badge {
          display: inline-block;
          background: rgba(0,209,255,0.88);
          color: #fff;
          font-size: 10px; font-weight: 800;
          padding: 2px 9px; border-radius: 20px;
          margin-top: 5px; letter-spacing: 0.06em;
        }

        /* ── Body ── */
        .mp-body {
          max-width: 1300px; margin: 0 auto;
          padding: 44px 24px 100px;
        }

        /* ── Promo image top ── */
        .mp-promo-img {
          display: block;
          width: 100%;
          margin: 0 auto;
          object-fit: cover;
          object-position: center;
          border-radius: 0;
        }

        /* ── Package grid ── */
        .mp-section-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #1e293b; letter-spacing: 0.06em;
          margin-bottom: 16px;
        }
        .mp-pkg-grid {
          display: grid;
          grid-template-columns: repeat(5, 224px);
          justify-content: center;
          gap: 44px 33px; margin-bottom: 36px;
        }
        @media (max-width: 768px) { .mp-pkg-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .mp-pkg-grid { grid-template-columns: repeat(2, 1fr); } }

        /* ── Package card — diagonal cut ── */
        @keyframes mp-glow-pulse {
          0%, 100% { filter: drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 0 6px rgba(0,209,255,0.15)); }
          50%       { filter: drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 0 18px rgba(0,209,255,0.45)); }
        }
        @keyframes mp-shimmer {
          0%   { transform: translateX(-120%) rotate(25deg); }
          100% { transform: translateX(400%) rotate(25deg); }
        }
        .mp-pkg-card {
          background: linear-gradient(160deg, #1e293b 0%, #0f172a 100%);
          clip-path: polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px);
          padding: 10px 10px 12px;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), filter 0.22s;
          position: relative; text-align: center; overflow: hidden;
          will-change: transform;
          animation: mp-glow-pulse 3s ease-in-out infinite;
        }
        /* เรืองแสงพื้นหลังด้านใน */
        .mp-pkg-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 20%, rgba(0,209,255,0.18) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        /* แสงวาบ shimmer */
        .mp-pkg-card::after {
          content: '';
          position: absolute;
          top: -60%; left: -20%;
          width: 25%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
          transform: rotate(25deg);
          animation: mp-shimmer 4s ease-in-out infinite;
          pointer-events: none; z-index: 3;
        }
        .mp-pkg-card > * { position: relative; z-index: 2; }
        /* icon กลาว */
        .mp-pkg-card img {
          filter: drop-shadow(0 0 10px rgba(0,209,255,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          transition: filter 0.22s;
        }
        .mp-pkg-card:hover {
          transform: translateY(-5px) scale(1.04);
          filter: drop-shadow(0 10px 24px rgba(0,209,255,0.5)) drop-shadow(0 0 30px rgba(0,209,255,0.25));
        }
        .mp-pkg-card:hover img {
          filter: drop-shadow(0 0 18px rgba(0,209,255,0.9)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        .mp-pkg-card.selected {
          background: linear-gradient(160deg, #78350f 0%, #92400e 50%, #1e293b 100%);
          transform: scale(1.04);
          filter: drop-shadow(0 0 16px rgba(0,209,255,0.8)) drop-shadow(0 6px 20px rgba(0,209,255,0.4));
          animation: none;
        }
        .mp-pkg-card.selected::before {
          background: radial-gradient(ellipse at 50% 20%, rgba(0,209,255,0.35) 0%, transparent 65%);
        }
        .mp-pkg-card.selected img {
          filter: drop-shadow(0 0 22px rgba(255,200,50,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        @keyframes mp-check-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .mp-pkg-check {
          position: absolute; top: 6px; right: 6px;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: #fff;
          z-index: 2;
          animation: mp-check-pop 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .mp-pkg-badge {
          position: absolute; top: 5px; left: 16px;
          font-size: 9px; font-weight: 900;
          padding: 2px 8px; border-radius: 20px;
          letter-spacing: 0.05em; z-index: 4;
          white-space: nowrap;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .mp-pkg-badge.hot { background: linear-gradient(90deg, #fbbf24, #f59e0b); color: #78350f; }
        .mp-pkg-badge.rec { background: linear-gradient(90deg, #00d1ff, #00a3cc); color: #fff; }
        .mp-coupon-label {
          font-size: 13px; font-weight: 900; color: #fbbf24;
          margin-top: 4px; letter-spacing: 0.01em;
          text-shadow: 0 0 10px rgba(0,209,255,0.5);
        }
        .mp-price {
          font-size: 14px; font-weight: 900; color: #fff; margin-top: 2px;
        }
        .mp-price-unit { font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 1px; font-weight: 600; }

        /* ── Input card ── */
        .mp-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 24px 28px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .mp-card-label {
          font-size: 12px; font-weight: 700;
          color: #00d1ff; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .mp-input {
          width: 100%; box-sizing: border-box;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b; font-size: 15px; font-weight: 600;
          padding: 13px 16px;
          outline: none;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: border-color 0.2s;
          margin-bottom: 12px;
        }
        .mp-input::placeholder { color: #94a3b8; font-weight: 400; }
        .mp-input:focus { border-color: #00d1ff; background: #fff; }
        .mp-pw-wrap {
          position: relative;
        }
        .mp-pw-wrap .mp-input {
          padding-right: 48px;
          margin-bottom: 0;
          letter-spacing: 0.06em;
        }
        .mp-pw-toggle {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; font-size: 18px;
          color: #94a3b8; padding: 4px;
          transition: color 0.2s;
        }
        .mp-pw-toggle:hover { color: #00d1ff; }
        .mp-hint {
          font-size: 12px; color: #94a3b8;
          margin-top: 10px;
          display: flex; align-items: flex-start; gap: 5px;
          line-height: 1.6;
        }

        /* ── Security warning ── */
        .mp-security-box {
          background: #fffbeb;
          border: 1.5px solid #fde68a;
          border-radius: 12px; padding: 14px 18px;
          font-size: 13px; color: #92400e;
          line-height: 1.7; margin-bottom: 20px;
        }
        .mp-security-box strong { color: #78350f; }

        /* ── Summary ── */
        .mp-summary-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .mp-summary-row:last-child { border-bottom: none; }
        .mp-summary-key { color: #64748b; font-weight: 600; }
        .mp-summary-val { color: #0f172a; font-weight: 800; }
        .mp-summary-val.accent { color: #00d1ff; }
        .mp-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0 4px; font-size: 16px;
        }
        .mp-total-price {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #00d1ff;
        }

        /* ── Bottom bar ── */
        .mp-bar {
          position: sticky; bottom: 0;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-top: 1.5px solid #e2e8f0;
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
        }
        .mp-bar-info { font-size: 13px; color: #64748b; line-height: 1.5; }
        .mp-bar-info strong { color: #00d1ff; font-size: 16px; }
        .mp-next-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none;
          padding: 16px 52px; font-size: 17px; font-weight: 900;
          border-radius: 12px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          white-space: nowrap;
          filter: drop-shadow(0 6px 20px rgba(0,209,255,0.55));
          letter-spacing: 0.03em;
        }
        .mp-next-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .mp-next-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-2px); }

        /* ── Info box ── */
        .mp-info-box {
          background: linear-gradient(160deg, #12122a 0%, #0a0a1e 100%);
          border: 1px solid rgba(100,120,255,0.18);
          border-radius: 20px;
          padding: 40px 44px;
          margin-bottom: 36px;
          position: relative;
          overflow: hidden;
        }
        .mp-info-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,209,255,0.4), transparent);
        }
        .mp-info-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #fff; text-align: center;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
          line-height: 1.2;
        }
        .mp-info-sub {
          font-size: 14px; color: rgba(255,255,255,0.65);
          text-align: center; line-height: 1.8;
          margin-bottom: 8px;
          max-width: 560px; margin-left: auto; margin-right: auto;
        }
        .mp-info-section { margin-top: 30px; }
        .mp-info-section-title {
          font-size: 14px; font-weight: 800;
          color: #fff; margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .mp-info-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .mp-info-list li {
          font-size: 14px; color: rgba(255,255,255,0.72);
          display: flex; gap: 10px; line-height: 1.6;
        }
        .mp-info-bullet { color: #00d1ff; font-weight: 900; flex-shrink: 0; margin-top: 1px; }

        /* ── Payment method grid ── */
        .mp-pay-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 600px) {
          .mp-pay-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 360px) {
          .mp-pay-grid { grid-template-columns: 1fr; }
        }
        .mp-pay-btn {
          display: flex; align-items: center; gap: 10px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px; padding: 10px 12px;
          cursor: pointer; font: inherit; text-align: left;
          transition: border-color 0.18s, background 0.18s;
          position: relative; width: 100%;
        }
        .mp-pay-btn.selected {
          background: #f0fbff;
          border-color: #00d1ff;
        }
        .mp-pay-btn:not(.selected):hover {
          border-color: #bae6fd;
          background: #f8fafc;
        }
        .mp-pay-btn:focus-visible {
          outline: 2px solid #00d1ff;
          outline-offset: 2px;
        }
        .mp-pay-btn:active {
          transform: scale(0.97);
          transition-duration: 0.08s;
        }
        .mp-pay-icon {
          width: 44px; height: 44px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .mp-pay-icon span {
          font-size: 10px; font-weight: 900;
          letter-spacing: -0.03em; line-height: 1; text-align: center;
        }
        .mp-pay-badge {
          position: absolute; top: 5px; right: 6px;
          background: #ef4444; color: #fff;
          font-size: 9px; font-weight: 900;
          padding: 2px 6px; border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .mp-pay-expand {
          margin-top: 8px; width: 100%;
          background: none; border: 1px dashed #d1d5db;
          border-radius: 8px; padding: 9px 16px;
          font-size: 12px; font-weight: 700; color: #64748b;
          cursor: pointer; font: inherit;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .mp-pay-expand:hover {
          background: #f8fafc; border-color: #bae6fd; color: #0369a1;
        }
        .mp-pay-expand:focus-visible {
          outline: 2px solid #00d1ff; outline-offset: 2px;
        }
        .mp-pay-section-label {
          font-size: 13px; font-weight: 700; color: #1e293b;
          margin-bottom: 12px;
        }

        /* ── Warning box ── */
        .mp-warning {
          background: #fffbeb; border: 1.5px solid #fde68a;
          border-radius: 12px; padding: 14px 18px;
          display: flex; gap: 10px; align-items: flex-start;
          font-size: 13px; color: #92400e; line-height: 1.6;
          margin-bottom: 20px;
        }

        /* ── Success ── */
        @keyframes mp-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes mp-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mp-success-wrap {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15,23,42,0.55);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: mp-fade-up 0.25s ease both;
        }
        .mp-success-box {
          display: flex; flex-direction: column; align-items: center;
          background: #e8f4ff; border-radius: 20px;
          padding: 40px 28px 32px; width: 100%; max-width: 460px;
          max-height: 90vh; overflow-y: auto;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
        }
        .mp-success-icon {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; color: #fff; margin-bottom: 24px;
          animation: mp-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          filter: drop-shadow(0 8px 24px rgba(0,209,255,0.45));
        }
        .mp-success-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900; color: #0f172a;
          margin-bottom: 6px;
          animation: mp-fade-up 0.4s 0.2s both;
        }
        .mp-success-sub {
          font-size: 14px; color: #64748b;
          margin-bottom: 32px;
          animation: mp-fade-up 0.4s 0.3s both;
        }
        .mp-success-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e2e8f0; padding: 20px 28px;
          width: 100%; max-width: 420px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          text-align: left;
          animation: mp-fade-up 0.4s 0.4s both;
          margin-bottom: 28px;
        }
        .mp-success-order-id {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px;
        }
        .mp-success-order-id span { color: #00d1ff; font-size: 13px; }
        .mp-success-actions {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: mp-fade-up 0.4s 0.5s both;
        }
        .mp-home-btn {
          background: #f1f5f9; color: #1e293b; border: none;
          padding: 12px 28px; font-size: 14px; font-weight: 700;
          border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: background 0.2s;
        }
        .mp-home-btn:hover { background: #e2e8f0; }
        .mp-history-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none; padding: 12px 28px;
          font-size: 14px; font-weight: 700; border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          filter: drop-shadow(0 3px 10px rgba(0,209,255,0.35));
          transition: opacity 0.2s;
        }
        .mp-history-btn:hover { opacity: 0.88; }

        /* ── Reduced motion fallback ── */
        @media (prefers-reduced-motion: reduce) {
          .mp-pkg-card,
          .mp-pkg-card::after { animation: none; transition: filter 0.1s; }
          .mp-pkg-check { animation: none; }
          .mp-pay-btn { transition: none; }
          .mp-pay-btn:active { transform: none; }
          .mp-next-btn,
          .mp-input,
          .mp-pw-toggle { transition-duration: 0.01ms; }
          .mp-success-icon { animation: none; opacity: 1; transform: none; }
          .mp-success-title,
          .mp-success-sub,
          .mp-success-card,
          .mp-success-actions { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ── Coming Soon ── */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="mp-page">
          <div className="mp-hero">
            <div className="mp-hero-bg" style={{ backgroundImage: `url('${game.promoBg || game.bg}')` }} />
            <div className="mp-hero-overlay" />
            <div className="mp-hero-content">
              <img src={game.icon} alt={game.name} className="mp-icon"
                onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <div className="mp-game-name">{game.name}</div>
                <div className="mp-game-sub">{game.subtitle}</div>
                <div className="mp-game-badge">Mail / Pass</div>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 80px' }}>
            <img
              src={game.promoBg || game.bg}
              alt={game.name}
              className="mp-promo-img"
              style={{ aspectRatio: PROMO_ASPECT, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      )}

      {/* ── หน้าปกติ ── */}
      {game.packages && game.packages.length > 0 && (
      <div className="mp-page">

        {/* step 1 → รูปโปรโมชั่นเต็มบน + ปุ่มกลับลอยทับ */}
        {step === 1 ? (
          <div className="mp-promo-wrap">
            <img
              src={game.promoBg || game.bg}
              alt={game.name}
              className="mp-promo-img"
              style={{ aspectRatio: PROMO_ASPECT }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        ) : (
          /* step 2/3/success → hero ปกติ */
          <div className="mp-hero">
            <div className="mp-hero-bg" style={{ backgroundImage: `url('${game.promoBg || game.bg}')` }} />
            <div className="mp-hero-overlay" />
            <div className="mp-hero-content">
              <img src={game.icon} alt={game.name} className="mp-icon"
                onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <div className="mp-game-name">{game.name}</div>
                <div className="mp-game-sub">{game.subtitle}</div>
                <div className="mp-game-badge">Mail / Pass</div>
              </div>
            </div>
          </div>
        )}

        <div className="mp-body">


          {/* ════ STEP 1: เลือกแพ็กเกจ ════ */}
          {step === 1 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="mp-section-title" style={{ margin: 0 }}>เลือกแพ็กเกจที่ต้องการ</div>
                {selectedPkgs.length > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#00d1ff', fontSize: 14, lineHeight: 1.4 }}>
                      {amountDisplay}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                      รวม <strong style={{ color: '#0f172a' }}>{totalPrice.toLocaleString()} บาท</strong>
                    </div>
                  </div>
                )}
              </div>
              <div className="mp-pkg-grid">
                {game.packages.map(pkg => {
                  const isSelected = selectedPkgs.some(p => p.id === pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      className={`mp-pkg-card${isSelected ? ' selected' : ''}`}
                      onClick={() => togglePkg(pkg)}
                    >
                      {isSelected && <div className="mp-pkg-check"><FiCheck size={12} /></div>}
                      {pkg.badge && (
                        <div className={`mp-pkg-badge ${pkg.badge === 'แนะนำ' ? 'rec' : 'hot'}`}>
                          {pkg.badge}
                        </div>
                      )}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                        <img src={pkg.img} alt={`${pkg.amount}`} loading="lazy" decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                      {(pkg.label || pkg.amount > 0) && (
                        <div className="mp-coupon-label">
                          {pkg.label || `${pkg.amount.toLocaleString()} ${game.currency}`}
                        </div>
                      )}
                      <div className="mp-price">
                        {pkg.price.toLocaleString()}
                        <span className="mp-price-unit">บาท</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Info box ── */}
              {(() => {
                const info = game.info || buildDefaultInfo(game);
                return (
                  <div className="mp-info-box">
                    <div className="mp-info-title">{info.title}</div>
                    {info.taglines && info.taglines.map((t, i) => (
                      <div key={i} className="mp-info-sub">{t}</div>
                    ))}
                    {info.sections && info.sections.map((sec, si) => (
                      <div key={si} className="mp-info-section">
                        <div className="mp-info-section-title">{sec.heading}</div>
                        <ul className="mp-info-list">
                          {sec.items.map((item, ii) => (
                            <li key={ii}>
                              <span className="mp-info-bullet">{sec.ordered ? `${ii + 1}.` : '—'}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </>
          )}

          {/* ════ STEP 2: กรอก Email + Password ════ */}
          {step === 2 && (
            <>
              {/* สรุปแพ็กเกจที่เลือก */}
              <div className="mp-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: selectedPkgs.length > 1 ? 12 : 0 }}>
                  <div>
                    <div className="mp-card-label">แพ็กเกจที่เลือก ({selectedPkgs.length} รายการ)</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{pkgSummary}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#00d1ff', fontFamily: "'PSL Kampanath Pro', sans-serif" }}>
                      {totalPrice.toLocaleString()} บาท
                    </div>
                    <button
                      onClick={() => window.history.back()}
                      style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2, textDecoration: 'underline' }}
                    >เปลี่ยน</button>
                  </div>
                </div>
                {selectedPkgs.length > 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedPkgs.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                        <span>{p.label || `${p.amount.toLocaleString()} ${game.currency}`}</span>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.price.toLocaleString()} บาท</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security warning */}
              <div className="mp-security-box">
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><FiAlertTriangle size={15} /> ข้อควรระวัง — บริการ Mail/Pass</strong>
                บริการนี้ต้องการ Email และ Password ของบัญชีเกม เราจะใช้ข้อมูลเพื่อเข้าเติมเท่านั้น
                และ<strong>ไม่เก็บรหัสผ่านไว้ในระบบ</strong> แนะนำให้เปลี่ยนรหัสผ่านใหม่หลังเติมเสร็จทุกครั้ง
              </div>

              {/* Email + Password inputs */}
              <div className="mp-card">
                <div className="mp-card-label">ข้อมูลบัญชีเกม</div>
                <input
                  className="mp-input"
                  type="email"
                  placeholder="Email ของบัญชีเกม"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
                <div className="mp-pw-wrap">
                  <input
                    className="mp-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password ของบัญชีเกม"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="mp-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    tabIndex={-1}
                  >
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <div className="mp-hint">
                  <FiLock size={14} style={{ flexShrink: 0 }} />
                  ข้อมูลของคุณจะถูกส่งผ่านช่องทางที่เข้ารหัส และลบออกทันทีหลังเติมเสร็จ
                </div>
              </div>

              {/* ── วิธีเติมเกม — แสดงทุกเกม ── */}
              {(() => {
                const info = game.info || buildDefaultInfo(game);
                const steps = info.sections?.find(s => s.ordered)?.items ?? [];
                if (game.howtoImage) {
                  return (
                    <button
                      onClick={() => window.open(game.howtoImage, '_blank', 'noopener,noreferrer')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#fff', border: '1.5px solid #fde68a',
                        borderRadius: 12, padding: '13px 20px',
                        cursor: 'pointer', width: '100%',
                        font: 'inherit', color: '#92400e',
                        fontSize: 14, fontWeight: 700, transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <FiBook size={18} />
                      <span>ดูวิธีการเติมเกม</span>
                      <span style={{ marginLeft: 'auto', color: '#00d1ff', fontSize: 16 }}>→</span>
                    </button>
                  );
                }
                if (steps.length === 0) return null;
                return (
                  <div>
                    <button
                      onClick={() => setShowHowto(v => !v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#fff', border: '1.5px solid #fde68a',
                        borderRadius: showHowto ? '12px 12px 0 0' : 12,
                        padding: '13px 20px',
                        cursor: 'pointer', width: '100%',
                        font: 'inherit', color: '#92400e',
                        fontSize: 14, fontWeight: 700, transition: 'background 0.2s, border-radius 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <FiBook size={18} />
                      <span>ดูวิธีการเติมเกม</span>
                      <span style={{ marginLeft: 'auto', color: '#00d1ff' }}>
                        {showHowto ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </span>
                    </button>
                    {showHowto && (
                      <div style={{
                        background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: 'none',
                        borderRadius: '0 0 12px 12px', padding: '14px 20px',
                      }}>
                        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {steps.map((step, i) => (
                            <li key={i} style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── เลือกวิธีชำระเงิน ── */}
              <div style={{ marginTop: 28, borderTop: '1px solid #e2e8f0', paddingTop: 24 }}>
                <div className="mp-pay-section-label">ช่องทางชำระเงิน</div>
                <div className="mp-pay-grid">
                  {PAYMENT_METHODS.filter(pm => pm.popular || showAllPayment).map(pm => {
                    const isSel = selectedPayment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        className={`mp-pay-btn${isSel ? ' selected' : ''}`}
                        onClick={() => setSelectedPayment(pm.id)}
                        aria-pressed={isSel}
                      >
                        <div className="mp-pay-icon" style={{ background: pm.iconBg }}>
                          <span style={{ color: pm.iconColor }}>{pm.iconText}</span>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                            {pm.name}
                          </div>
                          {pm.desc && (
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>
                              {pm.desc}
                            </div>
                          )}
                        </div>
                        {pm.badge && <div className="mp-pay-badge">{pm.badge}</div>}
                        {isSel && <FiCheck size={14} style={{ color: '#00d1ff', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
                {!showAllPayment && (
                  <button className="mp-pay-expand" onClick={() => setShowAllPayment(true)}>
                    ดูช่องทางอื่น ↓  ({PAYMENT_METHODS.filter(pm => !pm.popular).length} ช่องทาง)
                  </button>
                )}
              </div>
            </>
          )}

          {/* ════ STEP 3: ยืนยันออเดอร์ ════ */}
          {step === 3 && (
            <>
              <div className="mp-warning">
                <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน หลังจากยืนยันแล้ว <strong>ไม่สามารถยกเลิกได้</strong></span>
              </div>

              <div className="mp-card">
                <div className="mp-card-label">สรุปออเดอร์</div>
                <div className="mp-summary-row">
                  <span className="mp-summary-key">เกม</span>
                  <span className="mp-summary-val">{game.name}</span>
                </div>
                {selectedPkgs.map((p, i) => (
                  <div key={p.id} className="mp-summary-row">
                    <span className="mp-summary-key">{selectedPkgs.length > 1 ? `แพ็กเกจ ${i + 1}` : 'แพ็กเกจ'}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mp-summary-val accent">
                        {p.label || `${p.amount.toLocaleString()} ${game.currency}`}
                      </span>
                      {p.bonus && <div style={{ fontSize: 12, color: '#ef4444' }}>+{p.bonus}</div>}
                    </div>
                  </div>
                ))}
                <div className="mp-summary-row">
                  <span className="mp-summary-key">Email บัญชี</span>
                  <span className="mp-summary-val" style={{ fontFamily: 'monospace', fontSize: 14 }}>{email}</span>
                </div>
                <div className="mp-summary-row">
                  <span className="mp-summary-key">Password</span>
                  <span className="mp-summary-val" style={{ letterSpacing: '0.15em' }}>{'•'.repeat(Math.min(password.length, 10))}</span>
                </div>
                {selectedPayment && (() => {
                  const pm = PAYMENT_METHODS.find(p => p.id === selectedPayment);
                  return pm ? (
                    <div className="mp-summary-row">
                      <span className="mp-summary-key">ช่องทางชำระ</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 4, background: pm.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 7, fontWeight: 900, color: pm.iconColor, letterSpacing: '-0.02em' }}>{pm.iconText}</span>
                        </div>
                        <span className="mp-summary-val">{pm.name}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="mp-total-row">
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>ยอดชำระรวม</span>
                  <span className="mp-total-price">{totalPrice.toLocaleString()} <span style={{ fontSize: 16, color: '#64748b' }}>บาท</span></span>
                </div>
              </div>

            </>
          )}

          {/* ════ SUCCESS ════ */}
          {done && (
            <div className="mp-success-wrap">
              <div className="mp-success-box">
              <div className="mp-success-icon"><FiCheck size={42} /></div>
              <div className="mp-success-title">สั่งซื้อสำเร็จ!</div>
              <div className="mp-success-sub">ไอเทมจะถูกเติมเข้าบัญชีของคุณภายใน 5–30 นาที</div>

              <div className="mp-success-card">
                <div className="mp-success-order-id">
                  Order ID: <span>#{orderId || 'ALK-XXXXXXXX'}</span>
                </div>
                <div className="mp-summary-row">
                  <span className="mp-summary-key">เกม</span>
                  <span className="mp-summary-val">{game.name}</span>
                </div>
                {selectedPkgs.map((p, i) => (
                  <div key={p.id} className="mp-summary-row">
                    <span className="mp-summary-key">{selectedPkgs.length > 1 ? `แพ็กเกจ ${i + 1}` : 'แพ็กเกจ'}</span>
                    <span className="mp-summary-val accent">
                      {p.label || `${p.amount.toLocaleString()} ${game.currency}`}
                    </span>
                  </div>
                ))}
                <div className="mp-summary-row">
                  <span className="mp-summary-key">Email</span>
                  <span className="mp-summary-val" style={{ fontFamily: 'monospace', fontSize: 13 }}>{email}</span>
                </div>
                <div className="mp-summary-row" style={{ border: 'none', paddingTop: 14 }}>
                  <span className="mp-summary-key">ยอดชำระรวม</span>
                  <span className="mp-summary-val accent" style={{ fontSize: 20 }}>{totalPrice.toLocaleString()} บาท</span>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                background: '#fffbeb', border: '1.5px solid #fde68a',
                borderRadius: 12, padding: '12px 18px', fontSize: 13, color: '#92400e',
                maxWidth: 420, width: '100%', textAlign: 'left', marginBottom: 24,
              }}>
                <FiLock size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>แนะนำให้<strong>เปลี่ยนรหัสผ่านบัญชีเกม</strong>หลังได้รับไอเทมเรียบร้อยแล้ว</span>
              </div>

              <div className="mp-success-actions">
                <button className="mp-home-btn" onClick={onHome || onBack}>กลับหน้าหลัก</button>
                <button className="mp-history-btn" onClick={() => alert('ระบบประวัติออเดอร์กำลังพัฒนา')}>
                  ดูประวัติคำสั่งซื้อ →
                </button>
              </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Bottom bar ── */}
        {!done && (
          <div className="mp-bar">
            <div className="mp-bar-info">
              {step === 1 && (selectedPkgs.length > 0
                ? <>
                    <strong style={{ color: '#00d1ff' }}>{amountDisplay}</strong>
                    <br />
                    <span style={{ color: '#64748b' }}>รวม {totalPrice.toLocaleString()} บาท</span>
                  </>
                : <span style={{ color: '#94a3b8' }}>กรุณาเลือกแพ็กเกจ</span>
              )}
              {step === 2 && (() => {
                if (!canProceedStep2) return <span style={{ color: '#94a3b8' }}>กรอก Email + Password</span>;
                if (!selectedPayment)  return <span style={{ color: '#94a3b8' }}>กรุณาเลือกวิธีชำระเงิน</span>;
                const pm = PAYMENT_METHODS.find(p => p.id === selectedPayment);
                return <><strong style={{ color: '#00d1ff' }}>{email}</strong><br /><span style={{ color: '#64748b' }}>{pm?.name}</span></>;
              })()}
              {step === 3 && (
                <><strong>{pkgSummary}</strong> — รวม {totalPrice.toLocaleString()} บาท</>
              )}
            </div>

            <button
              className="mp-next-btn"
              disabled={
                (step === 1 && selectedPkgs.length === 0) ||
                (step === 2 && (!canProceedStep2 || !selectedPayment)) ||
                (step === 3 && loading)
              }
              onClick={() => {
                if (step === 1) onStep(2);
                else if (step === 2) onStep(3);
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
