import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createOrder } from '../services/topupService';
import { FiTool, FiAlertTriangle, FiMapPin, FiCheck, FiBook, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { FLAG_BASE, COUNTRY_NAMES, PAYMENT_METHODS } from '../config/constants';

// step: 1 = เลือกแพ็กเกจ, 2 = กรอก UID, 3 = ยืนยันออเดอร์, 'success' = สำเร็จ
function buildDefaultInfo(game) {
  return {
    title: `บริการเติม${game.currency} ${game.name}`,
    taglines: [
      `ALASKAN SHOP ผู้ให้บริการเติม${game.currency}เกม ${game.name} ในราคาคุ้มค่าสุดๆ`,
      'สะดวก รวดเร็ว ปลอดภัย ถูกต้องตามระบบที่ตัวเกมกำหนดแน่นอน 100%',
    ],
    sections: [
      {
        heading: `เติม ${game.name} กับ ALASKAN SHOP ดีกว่าเติมเองในเกมยังไง?`,
        ordered: false,
        items: [
          'คุ้มและประหยัดกว่าเติมเองในเกม',
          'สะดวก รวดเร็ว พร้อมให้บริการตลอด 24 ช.ม.',
          'ง่าย ไม่ยุ่งยาก ใช้แค่ UID คัดลอกจากในเกมได้เลย',
        ],
      },
      {
        heading: `ขั้นตอนการใช้บริการเติม ${game.name}`,
        ordered: true,
        items: [
          'คัดลอก UID มาใส่ในช่องที่กำหนด',
          'เลือกแพ็กเกจที่ต้องการเติม',
          'กดปุ่ม "ถัดไป" และยืนยันออเดอร์',
          'เลือกช่องทางชำระเงินที่ต้องการ',
          'ดำเนินการชำระเงิน รอรับของในเกมได้เลย!!',
        ],
      },
    ],
  };
}

export default function TopupPage({ game, onBack, step, onStep }) {
  const [selectedPkgs, setSelectedPkgs] = useState([]);
  const [accountValues, setAccountValues] = useState({});
  const [fieldErrors, setFieldErrors]     = useState({});
  const [loading, setLoading]         = useState(false);
  const [orderId, setOrderId]         = useState(null);
  const [done, setDone]               = useState(false);
  const [showHowto, setShowHowto]             = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAllPayment, setShowAllPayment]   = useState(false);
  const [infoOpen, setInfoOpen]               = useState(false);
  const [imgZoom, setImgZoom]   = useState(1);
  const [imgPan, setImgPan]     = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  const closeHowto = useCallback(() => {
    setShowHowto(false);
    setImgZoom(1);
    setImgPan({ x: 0, y: 0 });
  }, []);

  const onImgWheel = useCallback((e) => {
    e.preventDefault();
    setImgZoom(z => {
      const next = Math.min(4, Math.max(1, z - e.deltaY * 0.003));
      if (next === 1) setImgPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const onImgMouseDown = useCallback((e) => {
    if (imgZoom <= 1) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX - imgPan.x, startY: e.clientY - imgPan.y };
  }, [imgZoom, imgPan]);

  const onImgMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    setImgPan({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY });
  }, []);

  const onImgMouseUp = useCallback(() => { dragRef.current = null; }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    if (showHowto) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (top) window.scrollTo(0, parseInt(top) * -1);
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (top) window.scrollTo(0, parseInt(top) * -1);
    };
  }, [showHowto]);

  const accountFields = game.accountFields || [
    {
      key: 'uid',
      label: 'User ID (UID)',
      placeholder: 'เช่น 123456789',
      inputMode: 'numeric',
      required: true,
    },
  ];
  const accountEntries = accountFields.map(field => ({
    ...field,
    value: accountValues[field.key] || '',
  }));
  const accountComplete = accountEntries.every(field => !field.required || field.value.trim())
    && accountEntries.every(field => !fieldErrors[field.key]);
  const primaryAccountValue = accountEntries.map(field => field.value.trim()).filter(Boolean).join(' / ');
  const accountSummary = accountEntries
    .filter(field => field.value.trim())
    .map(field => `${field.label}: ${field.value.trim()}`)
    .join(' · ');
  const accountStepLabel = accountFields.length > 1 ? 'กรอกข้อมูลบัญชี' : 'กรอก UID';

  const validateField = (field, value) => {
    const trimmed = value.trim();
    if (field.required && !trimmed) return 'กรุณากรอก ' + field.label;
    if (field.inputMode === 'numeric' && trimmed && !/^\d+$/.test(trimmed))
      return 'กรอกเฉพาะตัวเลขเท่านั้น ไม่มีตัวอักษรหรือช่องว่าง';
    if (field.inputMode === 'numeric' && trimmed && trimmed.length < 5)
      return 'UID ต้องมีอย่างน้อย 5 หลัก';
    return null;
  };

  const updateAccountValue = (key, value) => {
    setAccountValues(prev => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: null }));
  };

  const blurAccountField = (field) => {
    const trimmed = (accountValues[field.key] || '').trim();
    setAccountValues(prev => ({ ...prev, [field.key]: trimmed }));
    setFieldErrors(prev => ({ ...prev, [field.key]: validateField(field, trimmed) }));
  };

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
        gameId: game.id,
        uid: primaryAccountValue,
        account: Object.fromEntries(accountEntries.map(field => [field.key, field.value.trim()])),
        packages: selectedPkgs.map(p => ({ id: p.id, amount: p.amount, price: p.price, label: p.label })),
        totalPrice,
        paymentMethod: selectedPayment,
      });
      setOrderId(result.orderId);
      setDone(true);
    } finally {
      setLoading(false);
    }
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

        /* ── Body ── */
        .tp-body {
          max-width: 1300px; margin: 0 auto;
          padding: 44px 24px 100px;
        }

        /* ── Package grid ── */
        .tp-section-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #1e293b; letter-spacing: 0.06em;
          margin-bottom: 16px;
        }
        .tp-pkg-grid {
          display: grid;
          grid-template-columns: repeat(5, 224px);
          justify-content: center;
          gap: 44px 33px;
          margin-bottom: 36px;
        }
        @media (max-width: 768px) {
          .tp-pkg-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .tp-pkg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        /* TODO [PERF]: tp-glow-pulse + tp-shimmer รันพร้อมกันทุก card (อาจ 30+ card)
                       ถ้า frame drop เกิดขึ้น ให้ลด animation เหลือเฉพาะ hover state */
        @keyframes tp-glow-pulse {
          0%, 100% { filter: drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 0 6px rgba(0,209,255,0.15)); }
          50%       { filter: drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 0 18px rgba(0,209,255,0.45)); }
        }
        @keyframes tp-shimmer {
          0%   { transform: translateX(-120%) rotate(25deg); }
          100% { transform: translateX(400%) rotate(25deg); }
        }
        /* TODO [PERF]: will-change: transform บน card ทุกใบ = compositor layer ทุกใบ
                       ลบ will-change ออกถ้าไม่มีปัญหา scroll jank */
        .tp-pkg-card {
          background: linear-gradient(160deg, #1e293b 0%, #0f172a 100%);
          clip-path: polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px);
          padding: 10px 10px 12px;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1), filter 0.22s;
          position: relative; text-align: center; overflow: hidden;
          will-change: transform;
          animation: tp-glow-pulse 3s ease-in-out infinite;
        }
        .tp-pkg-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 20%, rgba(0,209,255,0.18) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .tp-pkg-card::after {
          content: '';
          position: absolute;
          top: -60%; left: -20%;
          width: 25%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
          transform: rotate(25deg);
          animation: tp-shimmer 4s ease-in-out infinite;
          pointer-events: none; z-index: 3;
        }
        .tp-pkg-card > * { position: relative; z-index: 2; }
        .tp-pkg-card img {
          filter: drop-shadow(0 0 10px rgba(0,209,255,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          transition: filter 0.22s;
        }
        .tp-pkg-card:hover {
          transform: translateY(-5px) scale(1.04);
          filter: drop-shadow(0 10px 24px rgba(0,209,255,0.5)) drop-shadow(0 0 30px rgba(0,209,255,0.25));
        }
        .tp-pkg-card:hover img {
          filter: drop-shadow(0 0 18px rgba(0,209,255,0.9)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        .tp-pkg-card.selected {
          background: linear-gradient(160deg, #78350f 0%, #92400e 50%, #1e293b 100%);
          transform: scale(1.04);
          filter: drop-shadow(0 0 16px rgba(0,209,255,0.8)) drop-shadow(0 6px 20px rgba(0,209,255,0.4));
          animation: none;
        }
        .tp-pkg-card.selected::before {
          background: radial-gradient(ellipse at 50% 20%, rgba(0,209,255,0.35) 0%, transparent 65%);
        }
        .tp-pkg-card.selected img {
          filter: drop-shadow(0 0 22px rgba(255,200,50,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        @keyframes check-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .tp-pkg-check {
          position: absolute; top: 6px; right: 6px;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: #fff;
          z-index: 4;
          animation: check-pop 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .tp-pkg-badge {
          position: absolute; top: 5px; left: 16px;
          font-size: 9px; font-weight: 900;
          padding: 2px 8px; border-radius: 20px;
          letter-spacing: 0.05em; z-index: 4;
          white-space: nowrap;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .tp-pkg-badge.hot { background: linear-gradient(90deg, #fbbf24, #f59e0b); color: #78350f; }
        .tp-pkg-badge.rec { background: linear-gradient(90deg, #00d1ff, #00a3cc); color: #fff; }
        .tp-coupon-label {
          font-size: 13px; font-weight: 900; color: #fbbf24;
          margin-top: 4px; letter-spacing: 0.01em;
          text-shadow: 0 0 10px rgba(0,209,255,0.5);
        }
        .tp-price {
          font-size: 14px; font-weight: 900; color: #fff;
          margin-top: 2px;
        }
        .tp-price-unit { font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 1px; font-weight: 600; }

        /* ── Account section ── */
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
        .tp-uid-input.error { border-color: #f87171; background: #fff5f5; }
        .tp-uid-input.error:focus { border-color: #ef4444; }
        .tp-field-error { font-size: 12px; color: #ef4444; margin-top: 5px; display: flex; align-items: center; gap: 4px; }
        .tp-uid-hint {
          font-size: 12px; color: #94a3b8; margin-top: 10px;
          display: flex; align-items: center; gap: 5px;
        }
        .tp-account-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .tp-account-grid.single {
          grid-template-columns: 1fr;
        }
        .tp-field-label {
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          margin-bottom: 8px;
        }
        @media (max-width: 560px) {
          .tp-account-grid { grid-template-columns: 1fr; }
        }

        /* ── Payment method grid ── */
        .tp-pay-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 600px) {
          .tp-pay-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 360px) {
          .tp-pay-grid { grid-template-columns: 1fr; }
        }
        .tp-pay-btn {
          display: flex; align-items: center; gap: 10px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px; padding: 10px 12px;
          cursor: pointer; font: inherit; text-align: left;
          transition: border-color 0.18s, background 0.18s;
          position: relative; width: 100%;
        }
        .tp-pay-btn.selected {
          background: #f0fbff;
          border-color: #00d1ff;
        }
        .tp-pay-btn:not(.selected):hover {
          border-color: #bae6fd;
          background: #f8fafc;
        }
        .tp-pay-btn:focus-visible {
          outline: 2px solid #00d1ff;
          outline-offset: 2px;
        }
        .tp-pay-btn:active {
          transform: scale(0.97);
          transition-duration: 0.08s;
        }
        .tp-pay-icon {
          width: 44px; height: 44px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .tp-pay-icon span {
          font-size: 10px; font-weight: 900;
          letter-spacing: -0.03em; line-height: 1;
          text-align: center;
        }
        .tp-pay-badge {
          position: absolute; top: 5px; right: 6px;
          background: #ef4444; color: #fff;
          font-size: 9px; font-weight: 900;
          padding: 2px 6px; border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .tp-pay-expand {
          margin-top: 8px; width: 100%;
          background: none; border: 1px dashed #d1d5db;
          border-radius: 8px; padding: 9px 16px;
          font-size: 12px; font-weight: 700; color: #64748b;
          cursor: pointer; font: inherit;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .tp-pay-expand:hover {
          background: #f8fafc; border-color: #bae6fd; color: #0369a1;
        }
        .tp-pay-expand:focus-visible {
          outline: 2px solid #00d1ff; outline-offset: 2px;
        }
        .tp-pay-section-label {
          font-size: 13px; font-weight: 700; color: #1e293b;
          margin-bottom: 12px;
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
          padding: 16px 52px; font-size: 17px; font-weight: 900;
          border-radius: 12px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          white-space: nowrap;
          filter: drop-shadow(0 6px 20px rgba(0,209,255,0.55));
          letter-spacing: 0.03em;
        }
        .tp-next-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .tp-next-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-2px); }

        /* ── Info box ── */
        .tp-info-box {
          background: linear-gradient(160deg, #12122a 0%, #0a0a1e 100%);
          border: 1px solid rgba(100,120,255,0.18);
          border-radius: 20px;
          padding: 40px 44px;
          margin-bottom: 36px;
          position: relative;
          overflow: hidden;
        }
        .tp-info-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,209,255,0.4), transparent);
        }
        .tp-info-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 32px; font-weight: 900;
          color: #fff; text-align: center;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
          line-height: 1.2;
        }
        .tp-info-sub {
          font-size: 14px; color: rgba(255,255,255,0.65);
          text-align: center; line-height: 1.8;
          margin-bottom: 8px;
          max-width: 560px; margin-left: auto; margin-right: auto;
        }
        .tp-info-section {
          margin-top: 30px;
        }
        .tp-info-section-title {
          font-size: 14px; font-weight: 800;
          color: #fff; margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .tp-info-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .tp-info-list li {
          font-size: 14px; color: rgba(255,255,255,0.72);
          display: flex; gap: 10px; line-height: 1.6;
        }
        .tp-info-list li .tp-info-bullet {
          color: #00d1ff; font-weight: 900; flex-shrink: 0; margin-top: 1px;
        }

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
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15,23,42,0.55);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: tp-fade-up 0.25s ease both;
        }
        .tp-success-box {
          display: flex; flex-direction: column; align-items: center;
          background: #f0f4f8; border-radius: 20px;
          padding: 40px 28px 32px; width: 100%; max-width: 460px;
          max-height: 90vh; overflow-y: auto;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
        }
        .tp-howto-overlay {
          position: fixed; inset: 0; z-index: 210;
          background: rgba(10,15,28,0.82);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: tp-fade-up 0.2s ease both;
        }
        .tp-howto-box {
          position: relative;
          border-radius: 14px; overflow: hidden;
          max-width: 560px; width: 100%;
          max-height: 92vh;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55);
          display: flex; flex-direction: column;
        }
        .tp-howto-fab {
          position: absolute; top: 10px; right: 10px; z-index: 10;
          display: flex; gap: 6px;
        }
        .tp-howto-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: none;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          backdrop-filter: blur(4px);
        }
        .tp-howto-close:hover { background: rgba(0,0,0,0.8); }
        .tp-howto-zoom-bar {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          border-radius: 20px; padding: 5px 14px;
          z-index: 10;
        }
        .tp-howto-zoom-btn {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: none;
          color: #fff; cursor: pointer; font-size: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .tp-howto-zoom-btn:hover { background: rgba(255,255,255,0.25); }
        .tp-howto-zoom-label {
          font-size: 11px; color: rgba(255,255,255,0.75);
          min-width: 34px; text-align: center;
        }
        .tp-howto-imgwrap {
          overflow: hidden; line-height: 0;
        }
        .tp-howto-img {
          width: 100%; display: block;
          object-fit: contain; max-height: 92vh;
        }
        .tp-success-icon {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; color: #fff;
          margin-bottom: 24px;
          animation: tp-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
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
          background: #fff; border-radius: 4px;
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

        /* ── Reduced motion fallback ── */
        @media (prefers-reduced-motion: reduce) {
          .tp-pkg-card,
          .tp-pkg-card::after { animation: none; transition: filter 0.1s; }
          .tp-pkg-check { animation: none; }
          .tp-pay-btn { transition: none; }
          .tp-pay-btn:active { transform: none; }
          .tp-next-btn,
          .tp-uid-input,
          .tp-home-btn,
          .tp-history-btn { transition-duration: 0.01ms; }
          .tp-howto-overlay { animation: none; }
          .tp-success-icon { animation: none; opacity: 1; transform: none; }
          .tp-success-title,
          .tp-success-sub,
          .tp-success-card,
          .tp-success-actions { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ── Coming Soon — เกมที่ยังไม่เปิด packages ── */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="tp-page">
          {game.promoBg ? (
            <div style={{ position: 'relative' }}>
              <img
                src={game.promoBg}
                alt={game.name}
                style={{ display: 'block', width: '100%', aspectRatio: game.promoAspect || '21 / 9' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '35%',
                background: 'linear-gradient(to bottom, transparent, #f0f4f8)',
                pointerEvents: 'none',
              }} />
            </div>
          ) : (
            <div className="tp-hero">
              <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
              <div className="tp-hero-overlay" />
              <div className="tp-hero-content">
                <img src={game.icon} alt={game.name} className="tp-icon"
                  onError={e => { e.target.style.display = 'none'; }} />
                <div>
                  <div className="tp-game-name">{game.name}</div>
                  <div className="tp-game-sub">{game.subtitle}</div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', maxWidth: 360 }}>
              <div style={{ fontSize: 52, marginBottom: 18, color: '#94a3b8' }}><FiTool size={52} /></div>
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

        {/* ── Hero / Promo Banner ── */}
        {game.promoBg ? (
          <div style={{ position: 'relative' }}>
            <img
              src={game.promoBg}
              alt={game.name}
              style={{ display: 'block', width: '100%', aspectRatio: game.promoAspect || '21 / 9' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '35%',
              background: 'linear-gradient(to bottom, transparent, #f0f4f8)',
              pointerEvents: 'none',
            }} />
          </div>
        ) : (
          <div className="tp-hero">
            <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
            <div className="tp-hero-overlay" />
            <div className="tp-hero-content">
              <img src={game.icon} alt={game.name} className="tp-icon"
                onError={e => { e.target.style.display = 'none'; }} />
              <div>
                <div className="tp-game-name">{game.name}</div>
                <div className="tp-game-sub">{game.subtitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="tp-body">


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
                      รวม <strong style={{ color: '#0f172a' }}>{totalPrice.toLocaleString()} บาท</strong>
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
                      {isSelected && <div className="tp-pkg-check"><FiCheck size={13} /></div>}
                      {pkg.badge && (
                        <div className={`tp-pkg-badge ${pkg.badge === 'แนะนำ' ? 'rec' : 'hot'}`}>
                          {pkg.badge}
                        </div>
                      )}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                        <img
                          src={pkg.img || game.bg}
                          alt={`${pkg.amount}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        {(pkg.country || game.country) && (() => { const c = pkg.country || game.country; return (
                          <div style={{ position: 'absolute', top: 7, left: 7, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.55)', borderRadius: 5, padding: '3px 6px', backdropFilter: 'blur(4px)' }}>
                            <img
                              src={`${FLAG_BASE}/${c}.png`}
                              alt={c}
                              style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <span style={{ fontSize: 10, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {COUNTRY_NAMES[c] || c}
                            </span>
                          </div>
                        ); })()}
                      </div>
                      {(pkg.label || pkg.amount > 0) && (
                        <div className="tp-coupon-label">
                          {pkg.label || `${pkg.amount.toLocaleString()} ${game.currency}`}
                        </div>
                      )}
                      <div className="tp-price">
                        {pkg.originalPrice && (
                          <span style={{ color: '#94a3b8', textDecoration: 'line-through', marginRight: 4, fontWeight: 400 }}>
                            {pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {pkg.price.toLocaleString()}
                        <span className="tp-price-unit">บาท</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Info box (collapsible) ── */}
              {(() => {
                const info = game.info || buildDefaultInfo(game);
                return (
                  <div className="tp-info-box" style={{ padding: 0, overflow: 'hidden' }}>
                    <button
                      onClick={() => setInfoOpen(v => !v)}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '22px 44px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, font: 'inherit',
                      }}
                    >
                      <div className="tp-info-title" style={{ margin: 0, textAlign: 'left', fontSize: 'clamp(18px, 2.4vw, 26px)' }}>
                        {info.title}
                      </div>
                      <span style={{ color: '#00d1ff', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'transform 0.25s', transform: infoOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <FiChevronDown size={20} />
                      </span>
                    </button>
                    {infoOpen && (
                      <div style={{ padding: '0 44px 32px' }}>
                        {info.taglines && info.taglines.map((t, i) => (
                          <div key={i} className="tp-info-sub" style={{ marginLeft: 0, marginRight: 0 }}>{t}</div>
                        ))}
                        {info.sections && info.sections.map((sec, si) => (
                          <div key={si} className="tp-info-section">
                            <div className="tp-info-section-title">{sec.heading}</div>
                            <ul className="tp-info-list">
                              {sec.items.map((item, ii) => (
                                <li key={ii}>
                                  <span className="tp-info-bullet">{sec.ordered ? `${ii + 1}.` : '—'}</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {/* ═══════════════ STEP 2: กรอกข้อมูลบัญชี ═══════════════ */}
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
                      {totalPrice.toLocaleString()} บาท
                    </div>
                    <button
                      onClick={() => onStep(1)}
                      style={{ fontSize: 14, color: '#00d1ff', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, fontWeight: 700, textDecoration: 'underline' }}
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
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.price.toLocaleString()} บาท</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account inputs */}
              <div className="tp-card">
                <div className="tp-card-label">{accountStepLabel}</div>
                <div className={`tp-account-grid${accountFields.length === 1 ? ' single' : ''}`}>
                  {accountEntries.map((field, index) => (
                    <label key={field.key}>
                      <div className="tp-field-label">{field.label}</div>
                      <input
                        className={`tp-uid-input${fieldErrors[field.key] ? ' error' : ''}`}
                        type={field.type || 'text'}
                        inputMode={field.inputMode || 'text'}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={e => updateAccountValue(field.key, e.target.value)}
                        onBlur={() => blurAccountField(field)}
                        autoFocus={index === 0}
                      />
                      {fieldErrors[field.key] && (
                        <div className="tp-field-error">
                          <FiAlertTriangle size={12} />
                          {fieldErrors[field.key]}
                        </div>
                      )}
                    </label>
                  ))}
                </div>
                <div className="tp-uid-hint">
                  <FiAlertTriangle size={14} style={{ flexShrink: 0 }} />
                  {game.accountHint || 'ตรวจสอบ UID ให้ถูกต้องก่อนยืนยัน ไอเทมจะถูกส่งไปยัง UID ที่กรอกทันที'}
                </div>
              </div>

              {/* วิธีหาข้อมูลบัญชี */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#475569' }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}><FiMapPin size={14} /> วิธีดูข้อมูลบัญชีอยู่ที่ไหน?</div>
                {/* TODO: ย้าย accountHelp text ไปไว้ใน games.js config แต่ละเกมเลย
                         อย่า hardcode game.id ใน component — เปราะบางมากเมื่อเปลี่ยนชื่อเกม */}
                {game.accountHelp && <span>{game.accountHelp}</span>}
                {!game.accountHelp && game.id === 'ROV' && <span>เปิดเกม → กดที่รูปโปรไฟล์ → UID จะแสดงใต้ชื่อตัวละคร</span>}
                {!game.accountHelp && game.id === 'Free Fire' && <span>เปิดเกม → กดที่รูปโปรไฟล์มุมซ้ายบน → UID แสดงใต้ชื่อ</span>}
                {!game.accountHelp && game.id === 'PUBG Mobile' && <span>เปิดเกม → โปรไฟล์ → UID แสดงใต้ชื่อผู้เล่น</span>}
                {!game.accountHelp && !['ROV','Free Fire','PUBG Mobile'].includes(game.id) && <span>เปิดเกม → โปรไฟล์ → ดู UID ใต้ชื่อผู้เล่น</span>}
              </div>

              {/* ── วิธีเติมเกม — แสดงทุกเกม ── */}
              {(() => {
                const info = game.info || buildDefaultInfo(game);
                const steps = info.sections?.find(s => s.ordered)?.items ?? [];
                if (game.howtoImage) {
                  return (
                    <button
                      onClick={() => setShowHowto(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#fff', border: '1.5px solid #fde68a',
                        borderRadius: 12, padding: '13px 20px',
                        cursor: 'pointer', width: '100%', marginTop: 14,
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
                  <div style={{ marginTop: 14 }}>
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
                        borderBottom: showHowto ? '1.5px solid #fde68a' : undefined,
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
                <div className="tp-pay-section-label">ช่องทางชำระเงิน</div>
                <div className="tp-pay-grid">
                  {PAYMENT_METHODS.filter(pm => pm.popular || showAllPayment).map(pm => {
                    const isSel = selectedPayment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        className={`tp-pay-btn${isSel ? ' selected' : ''}`}
                        onClick={() => setSelectedPayment(pm.id)}
                        aria-pressed={isSel}
                      >
                        <div className="tp-pay-icon" style={{ background: pm.iconBg }}>
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
                        {pm.badge && <div className="tp-pay-badge">{pm.badge}</div>}
                        {isSel && <FiCheck size={14} style={{ color: '#00d1ff', flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
                {!showAllPayment && (
                  <button className="tp-pay-expand" onClick={() => setShowAllPayment(true)}>
                    ดูช่องทางอื่น ↓  ({PAYMENT_METHODS.filter(pm => !pm.popular).length} ช่องทาง)
                  </button>
                )}
              </div>
            </>
          )}

          {/* ═══════════════ STEP 3: ยืนยันออเดอร์ ═══════════════ */}
          {step === 3 && (
            <>
              <div className="tp-warning">
                <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
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
                  <span className="tp-summary-key">ข้อมูลบัญชี</span>
                  <span className="tp-summary-val" style={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: '0.03em', textAlign: 'right' }}>{accountSummary}</span>
                </div>
                {selectedPayment && (() => {
                  const pm = PAYMENT_METHODS.find(p => p.id === selectedPayment);
                  return pm ? (
                    <div className="tp-summary-row">
                      <span className="tp-summary-key">ช่องทางชำระ</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 4, background: pm.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 7, fontWeight: 900, color: pm.iconColor, letterSpacing: '-0.02em' }}>{pm.iconText}</span>
                        </div>
                        <span className="tp-summary-val">{pm.name}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
                <div className="tp-total-row">
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>ยอดชำระรวม</span>
                  <span className="tp-total-price">{totalPrice.toLocaleString()} <span style={{ fontSize: 16, color: '#64748b' }}>บาท</span></span>
                </div>
              </div>

              <button
                onClick={() => onStep(2)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  width: '100%',
                  background: 'none',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '11px 20px',
                  fontSize: 13, fontWeight: 700, color: '#64748b',
                  cursor: 'pointer',
                  fontFamily: "'Noto Sans Thai', sans-serif",
                  transition: 'border-color 0.18s, color 0.18s, background 0.18s',
                  marginTop: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d1ff'; e.currentTarget.style.color = '#0369a1'; e.currentTarget.style.background = '#f0fbff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'none'; }}
              >
                ↩ แก้ไขข้อมูล
              </button>

            </>
          )}

          {/* ═══════════════ SUCCESS ═══════════════ */}
          {done && (
            <div className="tp-success-wrap">
              <div className="tp-success-box">
              <div className="tp-success-icon"><FiCheck size={42} /></div>
              <div className="tp-success-title">สั่งซื้อสำเร็จ!</div>
              <div className="tp-success-sub">ไอเทมจะถูกส่งเข้าบัญชีของคุณภายใน 5–15 นาที</div>

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
                  <span className="tp-summary-key">ข้อมูลบัญชี</span>
                  <span className="tp-summary-val" style={{ fontFamily: 'monospace', textAlign: 'right' }}>{accountSummary}</span>
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
            </div>
          )}

        </div>

        {/* ── Bottom action bar (ซ่อนบน success) ── */}
        {!done && (
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
              {step === 2 && (() => {
                if (!accountComplete) return <span style={{ color: '#94a3b8' }}>กรุณากรอกข้อมูลให้ครบ</span>;
                if (!selectedPayment)  return <span style={{ color: '#94a3b8' }}>กรุณาเลือกวิธีชำระเงิน</span>;
                const pm = PAYMENT_METHODS.find(p => p.id === selectedPayment);
                return <><strong>{primaryAccountValue}</strong><br /><span style={{ color: '#64748b' }}>{pm?.name}</span></>;
              })()}
              {step === 3 && (
                <><strong>{pkgSummary}</strong> — รวม {totalPrice.toLocaleString()} บาท</>
              )}
            </div>

            <button
              className="tp-next-btn"
              disabled={
                (step === 1 && selectedPkgs.length === 0) ||
                (step === 2 && (!accountComplete || !selectedPayment)) ||
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

      {/* ═══════════════ HOWTO MODAL (root level — fixed เต็มหน้าจอเสมอ) ═══════════════ */}
      {showHowto && game.howtoImage && (
        <div className="tp-howto-overlay" onClick={closeHowto}>
          <div className="tp-howto-box" onClick={e => e.stopPropagation()}>

            <div className="tp-howto-fab">
              <button className="tp-howto-close" onClick={closeHowto} aria-label="ปิด">
                <FiX size={16} />
              </button>
            </div>

            <div
              className="tp-howto-imgwrap"
              onWheel={onImgWheel}
              onMouseDown={onImgMouseDown}
              onMouseMove={onImgMouseMove}
              onMouseUp={onImgMouseUp}
              onMouseLeave={onImgMouseUp}
              style={{ cursor: imgZoom > 1 ? (dragRef.current ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
              <img
                src={game.howtoImage}
                alt="วิธีเติมเกม"
                className="tp-howto-img"
                style={{
                  transform: `scale(${imgZoom}) translate(${imgPan.x / imgZoom}px, ${imgPan.y / imgZoom}px)`,
                  transition: dragRef.current ? 'none' : 'transform 0.15s ease',
                  transformOrigin: 'center center',
                  userSelect: 'none', pointerEvents: 'none',
                }}
                draggable={false}
              />
            </div>

            <div className="tp-howto-zoom-bar">
              <button className="tp-howto-zoom-btn" onClick={() => { const z = Math.max(1, +(imgZoom - 0.5).toFixed(1)); setImgZoom(z); if (z === 1) setImgPan({ x: 0, y: 0 }); }} aria-label="ซูมออก">−</button>
              <span className="tp-howto-zoom-label">{Math.round(imgZoom * 100)}%</span>
              <button className="tp-howto-zoom-btn" onClick={() => setImgZoom(z => Math.min(4, +(z + 0.5).toFixed(1)))} aria-label="ซูมเข้า">+</button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
