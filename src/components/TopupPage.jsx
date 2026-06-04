import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createOrder } from '../services/topupService';
import { FiTool, FiAlertTriangle, FiMapPin, FiCheck, FiBook, FiChevronDown, FiX, FiShoppingCart } from 'react-icons/fi';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { BsDiamondFill } from 'react-icons/bs';
import { FLAG_BASE, COUNTRY_NAMES, PAYMENT_METHODS } from '../config/constants';

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
          'กดปุ่ม "ยืนยัน" และเลือกช่องทางชำระเงิน',
          'ดำเนินการชำระเงิน รอรับของในเกมได้เลย!!',
        ],
      },
    ],
  };
}

export default function TopupPage({ game, onBack, step, onStep }) {
  const [selectedPkg, setSelectedPkg]         = useState(null);
  const [quantity, setQuantity]               = useState(1);
  const [accountValues, setAccountValues]     = useState({});
  const [fieldErrors, setFieldErrors]         = useState({});
  const [loading, setLoading]                 = useState(false);
  const [orderId, setOrderId]                 = useState(null);
  const [done, setDone]                       = useState(false);
  const [showHowto, setShowHowto]             = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAllPayment, setShowAllPayment]   = useState(false);
  const [infoOpen, setInfoOpen]               = useState(false);
  const [imgZoom, setImgZoom]                 = useState(1);
  const [imgPan, setImgPan]                   = useState({ x: 0, y: 0 });
  const [showOrderDetails, setShowOrderDetails] = useState(false);
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
    { key: 'uid', label: 'User ID (UID)', placeholder: 'เช่น 123456789', inputMode: 'numeric', required: true },
  ];
  const accountEntries = accountFields.map(field => ({ ...field, value: accountValues[field.key] || '' }));
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

  const selectPkg = (pkg) => {
    setSelectedPkg(prev => prev?.id === pkg.id ? null : pkg);
    setQuantity(1);
  };

  // Computed
  const baseAmount  = selectedPkg ? (selectedPkg.amount || 0) : 0;
  const bonusRaw    = selectedPkg?.bonus;
  const bonusAmount = bonusRaw
    ? (typeof bonusRaw === 'number' ? bonusRaw : parseInt(String(bonusRaw).replace(/[^0-9]/g, '')) || 0)
    : 0;
  const unitAmount   = baseAmount + bonusAmount;
  const totalCoupons = unitAmount * quantity;
  const totalPrice   = selectedPkg ? selectedPkg.price * quantity : 0;
  const pkgLabel     = selectedPkg
    ? (selectedPkg.label || `${baseAmount.toLocaleString()} ${game.currency}`)
    : '';

  // For step 2 order display
  const pkgForStep2 = selectedPkg ? {
    ...selectedPkg,
    price: totalPrice,
    amount: totalCoupons,
    label: quantity > 1 ? `${pkgLabel} × ${quantity}` : pkgLabel,
  } : null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await createOrder({
        gameId: game.id,
        uid: primaryAccountValue,
        account: Object.fromEntries(accountEntries.map(field => [field.key, field.value.trim()])),
        packages: pkgForStep2
          ? [{ id: pkgForStep2.id, amount: pkgForStep2.amount, price: pkgForStep2.price, label: pkgForStep2.label }]
          : [],
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

        /* ── Hero fallback ── */
        .tp-hero {
          position: relative; height: 220px; overflow: hidden;
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
          position: relative; z-index: 2; height: 100%;
          display: flex; align-items: flex-end; padding: 0 40px 24px; gap: 18px;
        }
        .tp-icon {
          width: 68px; height: 68px; border-radius: 16px;
          border: 2px solid rgba(0,209,255,0.6); object-fit: cover; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,209,255,0.25);
        }
        .tp-game-name {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900; color: #fff;
          letter-spacing: 0.05em; text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .tp-game-sub { font-size: 13px; color: rgba(255,255,255,0.75); margin-top: 2px; }

        /* ── Game info bar ── */
        .tp-game-bar {
          background: #fff; border-bottom: 1.5px solid #e2e8f0;
          padding: 16px 32px; display: flex; align-items: center; gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .tp-game-bar-icon {
          width: 68px; height: 68px; border-radius: 16px;
          border: 2px solid rgba(0,209,255,0.45); object-fit: cover; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,209,255,0.18);
        }
        .tp-game-bar-name {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #0f172a;
          letter-spacing: 0.04em; line-height: 1.2;
        }
        .tp-game-bar-plat {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f1f5f9; border-radius: 6px; padding: 4px 10px;
          font-size: 13px; color: #475569; font-weight: 700;
          margin-right: 6px; margin-top: 6px;
        }
        .tp-howto-trigger-btn {
          display: flex; align-items: center; gap: 6px;
          background: #fff8e7; border: 1.5px solid #fde68a;
          color: #92400e; font-weight: 700; font-size: 13px;
          border-radius: 9px; padding: 8px 16px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif; transition: background 0.18s;
          white-space: nowrap; flex-shrink: 0;
        }
        .tp-howto-trigger-btn:hover { background: #fffbeb; }

        /* ── Step tabs ── */
        .tp-step-tabs {
          background: #fff; border-bottom: 1.5px solid #e2e8f0;
          padding: 0 32px; display: flex; align-items: center;
        }
        .tp-step-item {
          display: flex; align-items: center; gap: 9px; padding: 12px 0;
          font-size: 13px; font-weight: 700; color: #94a3b8;
        }
        .tp-step-item.active { color: #0f172a; }
        .tp-step-item.done   { color: #00d1ff; }
        .tp-step-num {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900;
          background: #e2e8f0; color: #64748b; flex-shrink: 0; transition: background 0.2s;
        }
        .tp-step-item.active .tp-step-num,
        .tp-step-item.done   .tp-step-num { background: #00d1ff; color: #fff; }
        .tp-step-line {
          flex: 1; max-width: 80px; min-width: 20px;
          height: 1.5px; background: #e2e8f0; margin: 0 14px;
        }

        /* ── Body ── */
        .tp-body {
          max-width: 1300px; margin: 0 auto;
          padding: 36px 24px 24px;
        }

        /* ── Section header ── */
        .tp-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .tp-section-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: clamp(22px, 2.8vw, 34px); font-weight: 900;
          color: #1e293b; letter-spacing: 0.06em;
        }
        .tp-section-tag {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: clamp(22px, 2.8vw, 34px); font-weight: 900;
          color: #00d1ff; letter-spacing: 0.08em; white-space: nowrap;
        }

        /* ── Package grid frame — same 6-point polygon as .game-card ── */
        .tp-pkg-grid-outer {
          clip-path: polygon(28px 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%, 0% 28px);
          background: #b0c2d4;
          padding: 0;
          margin: 0 -20px 24px;
        }
        .tp-pkg-grid-inner {
          clip-path: polygon(28px 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%, 0% 28px);
          background: #b0c2d4;
          padding: 28px 32px;
        }

        /* ── Package grid ── */
        .tp-pkg-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 18px;
          row-gap: 28px;
        }
        @media (max-width: 960px)  { .tp-pkg-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 640px)  { .tp-pkg-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 380px)  { .tp-pkg-grid { grid-template-columns: repeat(2, 1fr); } }

        @keyframes tp-pkg-pulse {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.45; }
        }
        @keyframes tp-shimmer {
          0%   { transform: translateX(-120%) rotate(25deg); }
          100% { transform: translateX(400%) rotate(25deg); }
        }
        @keyframes check-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        /* ── Package card — exact same clip-path as .game-card ── */
        .tp-pkg-card {
          clip-path: polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px);
          background: linear-gradient(160deg, #1a2844 0%, #0e1a30 100%);
          border: 2px solid rgba(100,140,200,0.25);
          display: flex; flex-direction: column;
          cursor: pointer; position: relative; text-align: center; overflow: hidden;
          user-select: none;
          transition: transform 0.22s var(--ease-out-quart,cubic-bezier(0.25,1,0.5,1)),
                      filter 0.22s var(--ease-out-quart,cubic-bezier(0.25,1,0.5,1)),
                      border-color 0.22s var(--ease-out-quart,cubic-bezier(0.25,1,0.5,1));
        }
        /* Top cyan edge line — same as game-card::before */
        .tp-pkg-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 11;
          background: linear-gradient(90deg, transparent 0%, #00d1ff 50%, transparent 100%);
          opacity: 0; transition: opacity 0.28s ease; pointer-events: none;
          animation: tp-pkg-pulse 3.5s ease-in-out infinite;
        }
        .tp-pkg-card:hover::before,
        .tp-pkg-card.selected::before { opacity: 1; animation: none; }
        /* Shimmer sweep */
        .tp-pkg-card::after {
          content: '';
          position: absolute; top: -60%; left: -20%;
          width: 22%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: rotate(25deg);
          animation: tp-shimmer 5s ease-in-out infinite;
          pointer-events: none; z-index: 3;
        }
        .tp-pkg-card > * { position: relative; z-index: 2; }
        .tp-pkg-card:hover {
          transform: translateY(-6px); border-color: #00d1ff;
          will-change: transform, filter;
          filter:
            drop-shadow(0 0 6px rgba(0,209,255,0.65))
            drop-shadow(0 0 20px rgba(0,209,255,0.35))
            drop-shadow(0 14px 36px rgba(0,0,0,0.28));
          animation: none;
        }
        .tp-pkg-card.selected {
          border-color: #00c8ef;
          will-change: transform, filter;
          filter:
            drop-shadow(0 0 8px rgba(0,200,240,0.9))
            drop-shadow(0 0 22px rgba(0,200,240,0.55))
            drop-shadow(0 10px 28px rgba(0,0,0,0.45));
          transform: scale(1.03);
          animation: none;
        }

        /* Image */
        .tp-pkg-img-wrap {
          flex: 1; padding: 14px 12px 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .tp-pkg-img-wrap img {
          width: 80%; aspect-ratio: 1/1; object-fit: contain; display: block;
          filter: drop-shadow(0 0 10px rgba(0,190,240,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.5));
          transition: filter 0.22s, transform 0.22s;
        }
        .tp-pkg-card:hover .tp-pkg-img-wrap img {
          filter: drop-shadow(0 0 18px rgba(0,190,240,0.85)) drop-shadow(0 2px 8px rgba(0,0,0,0.5));
          transform: scale(1.06) translateY(-2px);
        }
        .tp-pkg-card.selected .tp-pkg-img-wrap img {
          filter: drop-shadow(0 0 22px rgba(0,210,255,0.95)) drop-shadow(0 0 10px rgba(0,210,255,0.65)) drop-shadow(0 2px 6px rgba(0,0,0,0.4));
          transform: scale(1.06) translateY(-2px);
        }

        /* Badge — cyan background, white text, right-edge parallelogram cut */
        .tp-pkg-badge {
          position: absolute; top: 8px; right: 10px;
          font-size: 9px; font-weight: 900; padding: 2px 7px 2px 10px; border-radius: 0;
          clip-path: polygon(5px 0, 100% 0, 100% 100%, 0 100%);
          letter-spacing: 0.04em; z-index: 4; white-space: nowrap;
          font-family: 'Noto Sans Thai', sans-serif;
          background: #00b8d9; color: #fff;
        }
        .tp-pkg-badge.hot { background: #00b8d9; }
        .tp-pkg-badge.rec { background: #0099b8; }

        /* Check indicator */
        .tp-pkg-check {
          position: absolute; top: 6px; right: 6px;
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #fff; z-index: 5;
          animation: check-pop 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
          filter: drop-shadow(0 0 6px rgba(0,200,255,0.7));
        }

        /* Amount label: number=white, currency=cyan; selected: swap */
        .tp-pkg-amount-label {
          padding: 0 10px 8px;
          font-size: clamp(11px, 1vw, 13px); font-weight: 400;
          color: #fff; text-align: center; line-height: 1.4;
        }
        .tp-pkg-amount-label strong {
          font-weight: 900; color: #fff; font-size: 1.15em;
          transition: color 0.2s;
        }
        .tp-pkg-currency { color: #00d1ff; transition: color 0.2s; }
        .tp-pkg-card.selected .tp-pkg-amount-label strong { color: #00d1ff; }
        .tp-pkg-card.selected .tp-pkg-currency { color: rgba(180,235,255,0.85); }

        /* Price box: project signature clip-path + gray bg + cyan text → selected: cyan bg + white text */
        .tp-pkg-price-box {
          box-sizing: border-box;
          width: calc(100% - 24px);
          margin: 0 12px 5px;
          clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);
          background: rgba(255,255,255,0.13);
          padding: 4px 6px;
          font-size: clamp(12px, 1.1vw, 15px); font-weight: 900;
          color: #00d1ff; text-align: center; letter-spacing: 0.02em;
          transition: background 0.2s, color 0.2s;
        }
        .tp-pkg-card.selected .tp-pkg-price-box {
          background: linear-gradient(90deg, #00c4e8, #0096ba);
          color: #fff;
        }

        /* ── White card box ── */
        .tp-card {
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 24px 28px;
          margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .tp-card-label {
          font-size: 12px; font-weight: 700; color: #00d1ff;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;
        }

        /* ── UID inputs ── */
        .tp-uid-input {
          width: 100%; box-sizing: border-box; background: #f8fafc;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          color: #1e293b; font-size: 16px; font-weight: 700; padding: 13px 16px;
          outline: none; font-family: 'Noto Sans Thai', sans-serif;
          transition: border-color 0.2s; letter-spacing: 0.04em;
        }
        .tp-uid-input::placeholder { color: #94a3b8; font-weight: 400; letter-spacing: 0; }
        .tp-uid-input:focus { border-color: #00d1ff; background: #fff; }
        .tp-uid-input.error { border-color: #f87171; background: #fff5f5; }
        .tp-uid-input.error:focus { border-color: #ef4444; }
        .tp-field-error { font-size: 12px; color: #ef4444; margin-top: 5px; display: flex; align-items: center; gap: 4px; }
        .tp-uid-hint { font-size: 12px; color: #94a3b8; margin-top: 10px; display: flex; align-items: center; gap: 5px; }
        .tp-account-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .tp-account-grid.single { grid-template-columns: 1fr; }
        .tp-field-label { font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 8px; }
        @media (max-width: 560px) { .tp-account-grid { grid-template-columns: 1fr; } }

        /* ── Summary card (step 1) ── */
        .tp-sum-wrap {
          padding: 20px 24px 32px;
          display: flex; justify-content: center;
        }
        .tp-sum-wrap > .tp-sum-card {
          width: 100%; max-width: 760px;
        }
        .tp-sum-card {
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 10px 10px 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .tp-sum-boxes { display: flex; gap: 10px; margin-bottom: 10px; }
        .tp-sum-box {
          flex: 1; background: #f8fafc;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          min-width: 0; display: flex; flex-direction: column;
          overflow: hidden;
        }
        .tp-sum-box-title {
          font-size: 11px; font-weight: 700; color: #64748b; text-align: center;
          padding: 8px 12px; border-bottom: 1px solid #e2e8f0;
        }
        .tp-sum-box-body {
          flex: 1; padding: 10px 14px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .tp-sum-box-body-center {
          flex: 1; padding: 10px 14px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .tp-sum-detail-line {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; color: #475569; line-height: 1.8;
        }
        .tp-sum-detail-val {
          display: flex; align-items: center; gap: 4px;
          font-weight: 700; color: #1e293b; font-size: 13px;
        }
        .tp-sum-gem { color: #3b82f6; }
        .tp-sum-bonus { color: #16a34a; }
        .tp-sum-empty { font-size: 12px; color: #94a3b8; font-style: italic; }
        .tp-sum-total-big {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #1e293b;
          display: flex; align-items: center; gap: 6px; line-height: 1;
        }
        .tp-sum-price-big {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #ef4444; letter-spacing: 0.02em;
        }
        .tp-sum-actions {
          display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
        }
        .tp-sum-left-actions { display: flex; align-items: center; gap: 8px; }
        .tp-sum-pkg-icon {
          width: 40px; height: 40px; border-radius: 9px;
          background: #f1f5f9; border: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .tp-sum-pkg-icon img { width: 100%; height: 100%; object-fit: contain; }
        .tp-qty-wrap {
          display: flex; align-items: center; flex-shrink: 0;
          border: 1.5px solid #e2e8f0; border-radius: 9px; overflow: hidden;
        }
        .tp-qty-btn {
          width: 36px; height: 40px; background: #f1f5f9; border: none;
          font-size: 18px; font-weight: 700; color: #475569; cursor: pointer;
          display: flex; align-items: center; justify-content: center; line-height: 1;
          transition: background 0.12s;
        }
        .tp-qty-btn:hover:not(:disabled) { background: #dbeafe; color: #1d4ed8; }
        .tp-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .tp-qty-num { font-size: 15px; font-weight: 900; color: #1e293b; min-width: 38px; text-align: center; padding: 0 4px; }
        .tp-confirm-btn {
          flex: 0 0 220px;
          background: linear-gradient(90deg, #00c4e8, #0096c7);
          color: #fff; border: none; border-radius: 10px;
          padding: 11px 20px; font-size: 15px; font-weight: 900;
          cursor: pointer; white-space: nowrap;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.18s, transform 0.12s;
          filter: drop-shadow(0 4px 14px rgba(0,196,232,0.4));
        }
        .tp-confirm-btn:disabled { opacity: 0.25; cursor: not-allowed; filter: none; }
        .tp-confirm-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Step 2 Modal ── */
        .tp-step2-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15,23,42,0.55);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: tp-fade-in 0.2s ease;
        }
        @keyframes tp-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .tp-step2-modal {
          background: #f0f4f8; border-radius: 20px;
          width: 100%; max-width: 900px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.3);
          animation: tp-slide-up 0.26s cubic-bezier(0.34,1.15,0.64,1);
        }
        @keyframes tp-slide-up { from { transform: translateY(36px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .tp-step2-header {
          background: #fff; border-radius: 20px 20px 0 0;
          padding: 14px 18px; border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 2;
        }
        .tp-step2-close {
          margin-left: auto; width: 32px; height: 32px; border-radius: 50%;
          background: #f1f5f9; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; transition: background 0.12s;
        }
        .tp-step2-close:hover { background: #e2e8f0; }
        .tp-step2-body {
          display: grid; grid-template-columns: 1fr 320px; gap: 14px;
          padding: 14px;
        }
        .tp-step2-left { display: flex; flex-direction: column; gap: 12px; }
        .tp-step2-section {
          background: #fff; border-radius: 14px; padding: 16px 18px;
          border: 1.5px solid #e2e8f0;
        }
        .tp-step2-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 14px;
        }
        .tp-step2-section-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tp-uid-field { position: relative; margin-bottom: 4px; }
        .tp-uid-input {
          width: 100%; box-sizing: border-box;
          padding: 11px 14px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 14px; color: #0f172a; background: #f8fafc;
          outline: none; font-family: 'Noto Sans Thai', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .tp-uid-input:focus { border-color: #00c4e8; box-shadow: 0 0 0 3px rgba(0,196,232,0.15); background: #fff; }
        .tp-uid-input.error { border-color: #ef4444; }
        .tp-uid-input-icon { position: absolute; left: 11px; top: 50%; translate: 0 -50%; color: #94a3b8; pointer-events: none; }
        .tp-uid-error { font-size: 11px; color: #ef4444; margin-top: 4px; }
        .tp-pay-list { display: flex; flex-direction: column; gap: 8px; }
        .tp-pay-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          cursor: pointer; transition: border-color 0.15s, background 0.15s;
        }
        .tp-pay-item:hover { border-color: #00c4e8; background: #f0f9ff; }
        .tp-pay-item.selected { border-color: #00c4e8; background: #fff; }
        .tp-pay-item-icon {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 900; flex-shrink: 0;
        }
        .tp-pay-item-name { font-size: 13px; font-weight: 700; color: #0f172a; }
        .tp-pay-item-desc { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .tp-pay-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid #cbd5e1; margin-left: auto; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s;
        }
        .tp-pay-item.selected .tp-pay-radio { border-color: #00c4e8; }
        .tp-pay-radio-dot { width: 9px; height: 9px; border-radius: 50%; background: #00c4e8; display: none; }
        .tp-pay-item.selected .tp-pay-radio-dot { display: block; }
        .tp-step2-right { display: flex; flex-direction: column; gap: 10px; }
        .tp-order-sum {
          background: #fff; border-radius: 14px; padding: 16px;
          border: 1.5px solid #e2e8f0;
        }
        .tp-order-sum-title { font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 12px; }
        .tp-order-pkg-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .tp-order-pkg-img {
          width: 50px; height: 50px; border-radius: 10px;
          background: #f1f5f9; border: 1.5px solid #e2e8f0;
          object-fit: contain; flex-shrink: 0;
        }
        .tp-order-pkg-big {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 20px; font-weight: 900; color: #1e293b; line-height: 1.1;
        }
        .tp-order-pkg-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .tp-order-detail-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; color: #475569; padding: 5px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .tp-order-detail-val {
          display: flex; align-items: center; gap: 4px;
          font-weight: 700; color: #1e293b; font-size: 12px;
        }
        .tp-order-reward {
          margin-top: 10px; padding: 9px 12px; border-radius: 10px;
          background: #f0f9ff; border: 1px solid #bae6fd;
        }
        .tp-order-reward-title { font-size: 11px; font-weight: 800; color: #0369a1; margin-bottom: 5px; }
        .tp-order-reward-row {
          display: flex; justify-content: space-between;
          font-size: 12px; color: #0369a1; font-weight: 600;
        }
        .tp-order-toggle-btn {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: #00a8cc; font-weight: 600;
          cursor: pointer; background: none; border: none; padding: 7px 0 2px;
          font-family: 'Noto Sans Thai', sans-serif;
        }
        .tp-order-extra {
          font-size: 11px; color: #64748b; padding: 8px 0;
          border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 3px;
        }
        .tp-order-total-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-top: 12px; padding-top: 12px; border-top: 1.5px solid #e2e8f0;
        }
        .tp-order-total-price {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900; color: #1e293b; line-height: 1;
        }
        .tp-step2-confirm-btn {
          width: 100%; background: linear-gradient(90deg, #00c4e8, #0096c7);
          color: #fff; border: none; border-radius: 12px;
          padding: 13px; font-size: 15px; font-weight: 900;
          cursor: pointer; font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.18s, transform 0.12s;
          filter: drop-shadow(0 4px 14px rgba(0,196,232,0.4));
        }
        .tp-step2-confirm-btn:disabled { opacity: 0.3; cursor: not-allowed; filter: none; }
        .tp-step2-confirm-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
        .tp-step2-back-btn {
          width: 100%; background: none; border: 1.5px solid #e2e8f0;
          color: #64748b; border-radius: 10px; padding: 9px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif; transition: background 0.12s;
        }
        .tp-step2-back-btn:hover { background: #f1f5f9; }

        /* ── Dark bar (step 2) ── */
        .tp-bar {
          position: sticky; bottom: 0;
          background: #0f172a; border-top: 1.5px solid rgba(0,209,255,0.15);
          padding: 12px 32px; display: flex; align-items: center; gap: 16px;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.3);
        }
        .tp-bar-left { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .tp-bar-amount {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 18px; font-weight: 900; color: #fbbf24; letter-spacing: 0.04em;
        }
        .tp-bar-price { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 600; }
        .tp-next-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none; padding: 14px 40px;
          font-size: 16px; font-weight: 900; border-radius: 12px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          white-space: nowrap; flex-shrink: 0;
          filter: drop-shadow(0 6px 20px rgba(0,209,255,0.55)); letter-spacing: 0.03em;
        }
        .tp-next-btn:disabled { opacity: 0.28; cursor: not-allowed; filter: none; }
        .tp-next-btn:not(:disabled):hover { opacity: 0.88; transform: translateY(-2px); }

        /* ── Payment methods ── */
        .tp-pay-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 600px) { .tp-pay-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 360px) { .tp-pay-grid { grid-template-columns: 1fr; } }
        .tp-pay-btn {
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px;
          padding: 10px 12px; cursor: pointer; font: inherit; text-align: left;
          transition: border-color 0.18s, background 0.18s; position: relative; width: 100%;
        }
        .tp-pay-btn.selected { background: #f0fbff; border-color: #00d1ff; }
        .tp-pay-btn:not(.selected):hover { border-color: #bae6fd; background: #f8fafc; }
        .tp-pay-btn:focus-visible { outline: 2px solid #00d1ff; outline-offset: 2px; }
        .tp-pay-btn:active { transform: scale(0.97); transition-duration: 0.08s; }
        .tp-pay-icon {
          width: 44px; height: 44px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tp-pay-icon span { font-size: 10px; font-weight: 900; letter-spacing: -0.03em; line-height: 1; text-align: center; }
        .tp-pay-badge {
          position: absolute; top: 5px; right: 6px;
          background: #ef4444; color: #fff; font-size: 9px; font-weight: 900;
          padding: 2px 6px; border-radius: 20px; letter-spacing: 0.04em;
        }
        .tp-pay-expand {
          margin-top: 8px; width: 100%; background: none; border: 1px dashed #d1d5db;
          border-radius: 8px; padding: 9px 16px; font-size: 12px; font-weight: 700;
          color: #64748b; cursor: pointer; font: inherit;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .tp-pay-expand:hover { background: #f8fafc; border-color: #bae6fd; color: #0369a1; }

        /* ── Order summary rows ── */
        .tp-summary-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;
        }
        .tp-summary-row:last-child { border-bottom: none; }
        .tp-summary-key { color: #64748b; font-weight: 600; }
        .tp-summary-val { color: #0f172a; font-weight: 800; }
        .tp-summary-val.accent { color: #00d1ff; }
        .tp-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0 4px; font-size: 16px;
        }
        .tp-total-price {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 26px; font-weight: 900; color: #00d1ff;
        }

        /* ── Warning ── */
        .tp-warning {
          background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px;
          padding: 14px 18px; display: flex; gap: 10px; align-items: flex-start;
          font-size: 13px; color: #92400e; line-height: 1.6; margin-bottom: 20px;
        }

        /* ── Info box ── */
        .tp-info-box {
          background: linear-gradient(160deg, #12122a 0%, #0a0a1e 100%);
          border: 1px solid rgba(100,120,255,0.18); border-radius: 20px;
          margin-bottom: 36px; position: relative; overflow: hidden;
        }
        .tp-info-box::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,209,255,0.4), transparent);
        }
        .tp-info-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: clamp(18px, 2.4vw, 26px); font-weight: 900;
          color: #fff; letter-spacing: 0.04em; line-height: 1.2;
        }
        .tp-info-sub { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 8px; }
        .tp-info-section { margin-top: 30px; }
        .tp-info-section-title {
          font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 10px;
          padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .tp-info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .tp-info-list li { font-size: 14px; color: rgba(255,255,255,0.72); display: flex; gap: 10px; line-height: 1.6; }
        .tp-info-list li .tp-info-bullet { color: #00d1ff; font-weight: 900; flex-shrink: 0; margin-top: 1px; }

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
          display: flex; align-items: center; justify-content: center; padding: 24px;
          animation: tp-fade-up 0.25s ease both;
        }
        .tp-success-box {
          display: flex; flex-direction: column; align-items: center;
          background: #f0f4f8; border-radius: 20px;
          padding: 40px 28px 32px; width: 100%; max-width: 460px;
          max-height: 90vh; overflow-y: auto; text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.22);
        }
        .tp-success-icon {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          display: flex; align-items: center; justify-content: center;
          color: #fff; margin-bottom: 24px;
          animation: tp-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          filter: drop-shadow(0 8px 24px rgba(0,209,255,0.45));
        }
        .tp-success-title {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 28px; font-weight: 900; color: #0f172a; margin-bottom: 6px;
          animation: tp-fade-up 0.4s 0.2s both;
        }
        .tp-success-sub {
          font-size: 14px; color: #64748b; margin-bottom: 32px;
          animation: tp-fade-up 0.4s 0.3s both;
        }
        .tp-success-card {
          background: #fff; border-radius: 4px; border: 1.5px solid #e2e8f0;
          padding: 20px 28px; width: 100%; max-width: 420px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07); text-align: left;
          animation: tp-fade-up 0.4s 0.4s both; margin-bottom: 28px;
        }
        .tp-success-order-id {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px;
        }
        .tp-success-order-id span { color: #00d1ff; font-size: 13px; }
        .tp-success-actions {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: tp-fade-up 0.4s 0.5s both;
        }
        .tp-home-btn {
          background: #f1f5f9; color: #1e293b; border: none; padding: 12px 28px;
          font-size: 14px; font-weight: 700; border-radius: 10px; cursor: pointer;
          font-family: 'Noto Sans Thai', sans-serif; transition: background 0.2s;
        }
        .tp-home-btn:hover { background: #e2e8f0; }
        .tp-history-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc); color: #fff; border: none;
          padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 10px;
          cursor: pointer; font-family: 'Noto Sans Thai', sans-serif;
          filter: drop-shadow(0 3px 10px rgba(0,209,255,0.35)); transition: opacity 0.2s;
        }
        .tp-history-btn:hover { opacity: 0.88; }

        /* ── Howto modal ── */
        .tp-howto-overlay {
          position: fixed; inset: 0; z-index: 210;
          background: rgba(10,15,28,0.82);
          display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: tp-fade-up 0.2s ease both;
        }
        .tp-howto-box {
          position: relative; border-radius: 14px; overflow: hidden;
          max-width: 560px; width: 100%; max-height: 92vh;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55); display: flex; flex-direction: column;
        }
        .tp-howto-fab { position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 6px; }
        .tp-howto-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.55); border: none; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; backdrop-filter: blur(4px);
        }
        .tp-howto-close:hover { background: rgba(0,0,0,0.8); }
        .tp-howto-zoom-bar {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          border-radius: 20px; padding: 5px 14px; z-index: 10;
        }
        .tp-howto-zoom-btn {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: none; color: #fff;
          cursor: pointer; font-size: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; transition: background 0.15s;
        }
        .tp-howto-zoom-btn:hover { background: rgba(255,255,255,0.25); }
        .tp-howto-zoom-label { font-size: 11px; color: rgba(255,255,255,0.75); min-width: 34px; text-align: center; }
        .tp-howto-imgwrap { overflow: hidden; line-height: 0; }
        .tp-howto-img { width: 100%; display: block; object-fit: contain; max-height: 92vh; }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .tp-pkg-card, .tp-pkg-card::before, .tp-pkg-card::after { animation: none; }
          .tp-pkg-card, .tp-confirm-btn, .tp-next-btn, .tp-uid-input,
          .tp-home-btn, .tp-history-btn, .tp-pay-btn { transition-duration: 0.01ms; }
          .tp-pay-btn:active { transform: none; }
          .tp-howto-overlay { animation: none; }
          .tp-success-icon, .tp-success-title, .tp-success-sub,
          .tp-success-card, .tp-success-actions { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ══════════════ Coming Soon ══════════════ */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="tp-page">
          {game.promoBg ? (
            <div style={{ position: 'relative' }}>
              <img src={game.promoBg} alt={game.name}
                style={{ display: 'block', width: '100%', aspectRatio: game.promoAspect || '21 / 9' }}
                onError={e => { e.target.style.display = 'none'; }} />
              {game.promoFade && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to bottom, transparent, #f0f4f8)', pointerEvents: 'none' }} />}
            </div>
          ) : (
            <div className="tp-hero">
              <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
              <div className="tp-hero-overlay" />
              <div className="tp-hero-content">
                <img src={game.icon} alt={game.name} className="tp-icon" onError={e => { e.target.style.display = 'none'; }} />
                <div>
                  <div className="tp-game-name">{game.name}</div>
                  <div className="tp-game-sub">{game.subtitle}</div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', maxWidth: 360 }}>
              <div style={{ marginBottom: 18, color: '#94a3b8' }}><FiTool size={52} /></div>
              <div style={{ fontFamily: "'PSL Kampanath Pro', sans-serif", fontSize: 24, fontWeight: 900, color: '#1e293b', letterSpacing: '0.04em', marginBottom: 10 }}>กำลังเปิดให้บริการ</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', lineHeight: 2, marginBottom: 28 }}>
                สินค้าจะมาในเร็วๆ นี้<br />ติดตามได้ที่เฟส <strong style={{ color: '#1e293b' }}>ALASKAN ONLINE SHOP</strong> ของเรา
              </div>
              <a href="https://www.facebook.com/ALASKAN.ONLINE.SHOP" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1877f2', color: '#fff', textDecoration: 'none', padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, filter: 'drop-shadow(0 4px 12px rgba(24,119,242,0.4))' }}>
                ติดตาม Facebook Page
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ Main page ══════════════ */}
      {game.packages && game.packages.length > 0 && (
        <div className="tp-page">

          {/* Banner */}
          {game.promoBg ? (
            <div style={{ position: 'relative' }}>
              <img src={game.promoBg} alt={game.name}
                style={{ display: 'block', width: '100%', aspectRatio: game.promoAspect || '21 / 9' }}
                onError={e => { e.target.style.display = 'none'; }} />
              {game.promoFade && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to bottom, transparent, #f0f4f8)', pointerEvents: 'none' }} />}
            </div>
          ) : (
            <div className="tp-hero">
              <div className="tp-hero-bg" style={{ backgroundImage: `url('${game.bg}')` }} />
              <div className="tp-hero-overlay" />
              <div className="tp-hero-content">
                <img src={game.icon} alt={game.name} className="tp-icon" onError={e => { e.target.style.display = 'none'; }} />
                <div>
                  <div className="tp-game-name">{game.name}</div>
                  <div className="tp-game-sub">{game.subtitle}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Game info bar ── */}
          <div className="tp-game-bar">
            <img src={game.icon} alt={game.name} className="tp-game-bar-icon"
              onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <div className="tp-game-bar-name">
                เติมเกม <span style={{ color: '#00d1ff' }}>{game.name}</span>
              </div>
              <div>
                <span className="tp-game-bar-plat"><FaAndroid size={11} /> Android</span>
                <span className="tp-game-bar-plat"><FaApple size={11} /> iOS</span>
              </div>
            </div>
            <div style={{ flex: 1 }} />
          </div>

          {/* ── Step tabs ── */}
          <div className="tp-step-tabs">
            <div className={`tp-step-item${step === 1 ? ' active' : step > 1 ? ' done' : ''}`}>
              <div className="tp-step-num">{step > 1 ? <FiCheck size={11} /> : '1'}</div>
              <span>เลือกสินค้า</span>
            </div>
            <div className="tp-step-line" />
            <div className={`tp-step-item${step === 2 ? ' active' : ''}`}>
              <div className="tp-step-num">2</div>
              <span>ชำระเงิน</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="tp-body">

            {/* ══ STEP 1: เลือกแพ็กเกจ + กรอก UID ══ */}
            {step === 1 && (
              <>
                {/* Section header */}
                <div className="tp-section-header">
                  <div className="tp-section-title">กรุณาเลือกแพ็คที่ต้องการ</div>
                  <div className="tp-section-tag">UID TOP-UP</div>
                </div>

                {/* Package grid (clip-path frame + project-style cards) */}
                <div className="tp-pkg-grid-outer">
                  <div className="tp-pkg-grid-inner">
                    <div className="tp-pkg-grid">
                      {game.packages.map(pkg => {
                        const isSelected = selectedPkg?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            className={`tp-pkg-card${isSelected ? ' selected' : ''}`}
                            onClick={() => selectPkg(pkg)}
                          >
                            {isSelected && <div className="tp-pkg-check"><FiCheck size={11} /></div>}
                            {pkg.badge && (
                              <div className={`tp-pkg-badge ${pkg.badge === 'แนะนำ' ? 'rec' : 'hot'}`}>
                                {pkg.badge}
                              </div>
                            )}
                            <div className="tp-pkg-img-wrap">
                              <img
                                src={pkg.img || game.icon}
                                alt={`${pkg.amount}`}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            </div>
                            <div className="tp-pkg-amount-label">
                              {pkg.amount > 0
                                ? <><strong>{pkg.amount.toLocaleString()}</strong> <span className="tp-pkg-currency">{game.currency}</span></>
                                : <strong>{pkg.label || ''}</strong>
                              }
                            </div>
                            <span className="tp-pkg-price-box">{pkg.price.toLocaleString()} บาท</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Info box (collapsible) */}
                {(() => {
                  const info = game.info || buildDefaultInfo(game);
                  return (
                    <div className="tp-info-box" style={{ padding: 0, overflow: 'hidden' }}>
                      <button
                        onClick={() => setInfoOpen(v => !v)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '22px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, font: 'inherit' }}
                      >
                        <div className="tp-info-title">{info.title}</div>
                        <span style={{ color: '#00d1ff', flexShrink: 0, display: 'flex', alignItems: 'center', transition: 'transform 0.25s', transform: infoOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <FiChevronDown size={20} />
                        </span>
                      </button>
                      {infoOpen && (
                        <div style={{ padding: '0 44px 32px' }}>
                          {info.taglines && info.taglines.map((t, i) => (
                            <div key={i} className="tp-info-sub">{t}</div>
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

            {/* Step 2 is now a modal — rendered below */}

            {/* ══ SUCCESS overlay ══ */}
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
                    {pkgForStep2 && (
                      <div className="tp-summary-row">
                        <span className="tp-summary-key">แพ็กเกจ</span>
                        <span className="tp-summary-val accent">{pkgForStep2.label}</span>
                      </div>
                    )}
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

          {/* ── Step 1: Summary card (sticky bottom) ── */}
          {step === 1 && !done && (
            <div className="tp-sum-wrap">
              <div className="tp-sum-card">
                {/* 3 sub-boxes */}
                <div className="tp-sum-boxes">
                  {/* Box 1: Detail */}
                  <div className="tp-sum-box">
                    <div className="tp-sum-box-title">รายละเอียด</div>
                    <div className="tp-sum-box-body">
                      {selectedPkg ? (
                        <>
                          <div className="tp-sum-detail-line">
                            <span>ราคาต้น</span>
                            <div className="tp-sum-detail-val">
                              <BsDiamondFill className="tp-sum-gem" />
                              {baseAmount.toLocaleString()}
                            </div>
                          </div>
                          {bonusAmount > 0 && (
                            <div className="tp-sum-detail-line">
                              <span>+ โบนัสทั่วไป</span>
                              <div className="tp-sum-detail-val tp-sum-bonus">
                                <BsDiamondFill style={{ flexShrink: 0 }} />
                                {bonusAmount.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="tp-sum-empty">เลือกแพ็กเกจก่อน</div>
                      )}
                    </div>
                  </div>
                  {/* Box 2: Total amount */}
                  <div className="tp-sum-box">
                    <div className="tp-sum-box-title">จำนวนทั้งหมด</div>
                    <div className="tp-sum-box-body-center">
                      <div className="tp-sum-total-big">
                        <BsDiamondFill className="tp-sum-gem" size={20} />
                        {selectedPkg ? totalCoupons.toLocaleString() : '—'}
                      </div>
                    </div>
                  </div>
                  {/* Box 3: Price */}
                  <div className="tp-sum-box">
                    <div className="tp-sum-box-title">ราคารวม</div>
                    <div className="tp-sum-box-body-center">
                      <div className="tp-sum-price-big">
                        {selectedPkg ? `฿ ${totalPrice.toLocaleString()}` : '—'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action row */}
                <div className="tp-sum-actions">
                  <div className="tp-sum-left-actions">
                    <div className="tp-sum-pkg-icon">
                      <img
                        src={selectedPkg?.img || game.icon} alt=""
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="tp-qty-wrap">
                      <button className="tp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                      <span className="tp-qty-num">{quantity}</span>
                      <button className="tp-qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))} disabled={!selectedPkg}>+</button>
                    </div>
                  </div>
                  <button
                    className="tp-confirm-btn"
                    disabled={!selectedPkg}
                    onClick={() => onStep(2)}
                  >
                    {selectedPkg ? `ทำการชำระเงิน ฿${totalPrice.toLocaleString()}` : 'เลือกแพ็กเกจก่อน'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Modal overlay ── */}
          {step === 2 && !done && (
            <div className="tp-step2-overlay" onClick={e => { if (e.target === e.currentTarget) onStep(1); }}>
              <div className="tp-step2-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="tp-step2-header">
                  <img src={game.icon} alt={game.name} loading="lazy" decoding="async"
                    style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>เติมเกม {game.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>กรอกข้อมูลและเลือกช่องทางชำระเงิน</div>
                  </div>
                  <button className="tp-step2-close" onClick={() => onStep(1)} aria-label="ปิด">
                    <FiX size={16} />
                  </button>
                </div>

                {/* Body: 2 columns */}
                <div className="tp-step2-body">

                  {/* Left column */}
                  <div className="tp-step2-left">

                    {/* UID Input */}
                    <div className="tp-step2-section">
                      <div className="tp-step2-section-title">
                        <div className="tp-step2-section-icon">
                          <FiMapPin size={15} style={{ color: '#0ea5e9' }} />
                        </div>
                        กรุณากรอก ID ผู้เล่น
                      </div>
                      {accountFields.map(field => (
                        <div key={field.key} className="tp-uid-field">
                          <FiMapPin size={14} className="tp-uid-input-icon" />
                          <input
                            className={`tp-uid-input${fieldErrors[field.key] ? ' error' : ''}`}
                            placeholder={field.placeholder || `กรอก ${field.label}`}
                            inputMode={field.inputMode}
                            value={accountValues[field.key] || ''}
                            onChange={e => updateAccountValue(field.key, e.target.value)}
                            onBlur={() => blurAccountField(field)}
                          />
                          {fieldErrors[field.key] && (
                            <div className="tp-uid-error">{fieldErrors[field.key]}</div>
                          )}
                        </div>
                      ))}
                      {game.howtoImage && (
                        <button className="tp-howto-trigger-btn" style={{ marginTop: 10 }} onClick={() => setShowHowto(true)}>
                          <FiBook size={14} /> วิธีเติมเกม
                        </button>
                      )}
                    </div>

                    {/* Payment methods */}
                    <div className="tp-step2-section">
                      <div className="tp-step2-section-title">
                        <div className="tp-step2-section-icon">
                          <FiShoppingCart size={15} style={{ color: '#0ea5e9' }} />
                        </div>
                        เลือกช่องทางการชำระเงิน
                      </div>
                      <div className="tp-pay-list">
                        {PAYMENT_METHODS.map(pm => (
                          <div
                            key={pm.id}
                            className={`tp-pay-item${selectedPayment === pm.id ? ' selected' : ''}`}
                            onClick={() => setSelectedPayment(pm.id)}
                          >
                            <div className="tp-pay-item-icon" style={{ background: pm.iconBg }}>
                              <span style={{ color: pm.iconColor, fontSize: 10, fontWeight: 900 }}>{pm.iconText}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="tp-pay-item-name">{pm.name}</div>
                              {pm.desc && <div className="tp-pay-item-desc">{pm.desc}</div>}
                            </div>
                            {pm.badge && (
                              <span style={{ fontSize: 10, fontWeight: 800, color: '#0096ba', background: '#e0f7fa', padding: '2px 7px', borderRadius: 99 }}>{pm.badge}</span>
                            )}
                            <div className="tp-pay-radio">
                              <div className="tp-pay-radio-dot" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right column — order summary */}
                  <div className="tp-step2-right">
                    <div className="tp-order-sum">
                      <div className="tp-order-sum-title">สรุปรายการสั่งซื้อ</div>

                      {/* Package row */}
                      <div className="tp-order-pkg-row">
                        <img
                          className="tp-order-pkg-img"
                          src={selectedPkg?.img || game.icon} alt=""
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <div className="tp-order-pkg-big">
                            {baseAmount.toLocaleString()}
                            {bonusAmount > 0 && (
                              <span style={{ color: '#16a34a' }}>+{bonusAmount.toLocaleString()}</span>
                            )}
                          </div>
                          <div className="tp-order-pkg-sub">ทั้งหมด {totalCoupons.toLocaleString()} {game.currency}</div>
                        </div>
                      </div>

                      {/* Detail rows */}
                      <div className="tp-order-detail-row">
                        <span>ชื่อสินค้า</span>
                        <div className="tp-order-detail-val">
                          <BsDiamondFill className="tp-sum-gem" />
                          {(baseAmount * quantity).toLocaleString()}
                        </div>
                      </div>
                      {bonusAmount > 0 && (
                        <div className="tp-order-detail-row">
                          <span>โบนัสพิเศษ</span>
                          <div className="tp-order-detail-val" style={{ color: '#16a34a' }}>
                            <BsDiamondFill style={{ flexShrink: 0 }} />
                            {(bonusAmount * quantity).toLocaleString()}
                          </div>
                        </div>
                      )}
                      <div className="tp-order-detail-row">
                        <span>ทั้งหมด</span>
                        <div className="tp-order-detail-val">
                          <BsDiamondFill className="tp-sum-gem" />
                          {totalCoupons.toLocaleString()}
                        </div>
                      </div>

                      {/* Reward */}
                      <div className="tp-order-reward">
                        <div className="tp-order-reward-title">รางวัลการสั่งซื้อ</div>
                        <div className="tp-order-reward-row">
                          <span>คะแนน VIP Midasbuy</span>
                          <span>x{Math.max(1, Math.floor(totalPrice / 10))}</span>
                        </div>
                      </div>

                      {/* Expandable details */}
                      <button className="tp-order-toggle-btn" onClick={() => setShowOrderDetails(p => !p)}>
                        {showOrderDetails ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียดเพิ่ม'}
                        <FiChevronDown size={13} style={{ transform: showOrderDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                      {showOrderDetails && (
                        <div className="tp-order-extra">
                          <div>แพ็กเกจ: {pkgForStep2?.label}</div>
                          <div>จำนวน: {quantity} ชุด</div>
                          <div>ราคาต่อชุด: ฿{selectedPkg?.price?.toLocaleString()}</div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="tp-order-total-row">
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>รวม</div>
                        <div className="tp-order-total-price">฿ {totalPrice.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Confirm button */}
                    <button
                      className="tp-step2-confirm-btn"
                      disabled={!accountComplete || !selectedPayment || loading}
                      onClick={handleConfirm}
                    >
                      {loading ? 'กำลังดำเนินการ...' : `ยืนยันการสั่งซื้อ ฿${totalPrice.toLocaleString()}`}
                    </button>

                    <button className="tp-step2-back-btn" onClick={() => onStep(1)}>
                      กลับไปเลือกแพ็กเกจ
                    </button>

                    <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <FiAlertTriangle size={11} />
                      ข้อมูลการชำระเงินจะถูกเข้ารหัสอย่างปลอดภัย
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ══════════════ Howto modal ══════════════ */}
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
                src={game.howtoImage} alt="วิธีเติมเกม" className="tp-howto-img"
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
