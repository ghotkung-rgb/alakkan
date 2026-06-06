import { useState, useEffect, useRef, useCallback } from 'react';
import { createOrder } from '../services/topupService';
import { FiTool, FiCheck } from 'react-icons/fi';
import { FaAndroid, FaApple } from 'react-icons/fa';
import TopupStep2Modal from './TopupStep2Modal';
import TopupSuccess from './TopupSuccess';
import TopupHowto from './TopupHowto';
import './TopupPage.css';

export default function TopupPage({ game, onBack, step, onStep, onHome }) {
  const [selectedPkg, setSelectedPkg]           = useState(null);
  const [quantity, setQuantity]                 = useState(1);
  const [accountValues, setAccountValues]       = useState({});
  const [fieldErrors, setFieldErrors]           = useState({});
  const [loading, setLoading]                   = useState(false);
  const [orderId, setOrderId]                   = useState(null);
  const [done, setDone]                         = useState(false);
  const [showHowto, setShowHowto]               = useState(false);
  const [selectedPayment, setSelectedPayment]   = useState(null);
  const [imgZoom, setImgZoom]                   = useState(1);
  const [imgPan, setImgPan]                     = useState({ x: 0, y: 0 });
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

  const onZoomIn  = useCallback(() => setImgZoom(z => Math.min(4, +(z + 0.5).toFixed(1))), []);
  const onZoomOut = useCallback(() => setImgZoom(z => {
    const next = Math.max(1, +(z - 0.5).toFixed(1));
    if (next === 1) setImgPan({ x: 0, y: 0 });
    return next;
  }), []);

  useEffect(() => {
    const reset = () => setDone(false);
    window.addEventListener('popstate', reset);
    return () => window.removeEventListener('popstate', reset);
  }, []);

  useEffect(() => {
    if (step === 2) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [step]);

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
  const accountEntries = accountFields.map(f => ({ ...f, value: accountValues[f.key] || '' }));
  const accountComplete = accountEntries.every(f => !f.required || f.value.trim())
    && accountEntries.every(f => !fieldErrors[f.key]);
  const primaryAccountValue = accountEntries.map(f => f.value.trim()).filter(Boolean).join(' / ');
  const accountSummary = accountEntries
    .filter(f => f.value.trim())
    .map(f => `${f.label}: ${f.value.trim()}`)
    .join(' · ');

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

  const baseAmount   = selectedPkg ? (selectedPkg.amount || 0) : 0;
  const bonusRaw     = selectedPkg?.bonus;
  const bonusAmount  = bonusRaw
    ? (typeof bonusRaw === 'number' ? bonusRaw : parseInt(String(bonusRaw).replace(/[^0-9]/g, '')) || 0)
    : 0;
  const totalCoupons = (baseAmount + bonusAmount) * quantity;
  const totalPrice   = selectedPkg ? selectedPkg.price * quantity : 0;
  const pkgLabel     = selectedPkg
    ? (selectedPkg.label || `${baseAmount.toLocaleString()} ${game.currency}`)
    : '';
  const pkgForStep2  = selectedPkg ? {
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
        account: Object.fromEntries(accountEntries.map(f => [f.key, f.value.trim()])),
        packages: pkgForStep2
          ? [{ id: pkgForStep2.id, amount: pkgForStep2.amount, price: pkgForStep2.price, label: pkgForStep2.label }]
          : [],
        totalPrice,
        paymentMethod: selectedPayment,
      });
      setOrderId(result.orderId);
      setDone(true);
      window.history.replaceState(
        { activeMenu: 'HOME', topupGame: game.id, mailpassGame: null, topupStep: 1, mailpassStep: 1 },
        '',
        window.location.hash,
      );
    } finally {
      setLoading(false);
    }
  };

  const HeroBanner = () => game.promoBg ? (
    <div style={{ position: 'relative' }}>
      <img src={game.promoBg} alt={game.name}
        style={{ display: 'block', width: '100%', aspectRatio: game.promoAspect || '21 / 9' }}
        onError={e => { e.target.style.display = 'none'; }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, transparent, #ffffff)', pointerEvents: 'none' }} />
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
  );

  return (
    <>
      {/* ── Coming Soon ── */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="tp-page">
          <HeroBanner />
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

      {/* ── Main page ── */}
      {game.packages && game.packages.length > 0 && (
        <div className={`tp-page${step === 2 ? ' step-2' : ''}`}>

          <HeroBanner />

          {/* Game bar */}
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

          {/* Step tabs */}
          <div className="tp-step-tabs">
            <div className={`tp-step-item${step === 1 ? ' active' : ' done'}`}>
              <div className="tp-step-num">{step > 1 ? <FiCheck size={11} /> : '1'}</div>
              <span>เลือกแพ็คเกม</span>
            </div>
            <div className="tp-step-line" />
            <div className={`tp-step-item${step === 2 ? ' active' : ''}`}>
              <div className="tp-step-num">2</div>
              <span>กรอก UID</span>
            </div>
            <div className="tp-step-line" />
            <div className={`tp-step-item${step === 2 ? ' active' : ''}`}>
              <div className="tp-step-num">3</div>
              <span>ยืนยันออเดอร์</span>
            </div>
          </div>

          {/* Package section */}
          <div className="tp-pkg-section">

            <div className="tp-body">
              <div className="tp-section-header">
                <div className="tp-section-title">กรุณาเลือกแพ็คที่ต้องการ</div>
                <div className="tp-section-tag">
                  <span style={{ color: '#00d1ff' }}>UID</span>
                  <span style={{ color: '#0f172a' }}>TOP-UP</span>
                </div>
              </div>
              <div className="tp-pkg-grid">
                {game.packages.map(pkg => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        className={`tp-pkg-card${isSelected ? ' selected' : ''}`}
                        onClick={() => selectPkg(pkg)}
                      >
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

            {/* Summary card — fixed bottom */}
            {step === 1 && !done && selectedPkg && (
              <div className="tp-sum-wrap">
                <div className="tp-sum-card">
                  <div className="tp-sum-boxes">
                    <div className="tp-sum-box">
                      <div className="tp-sum-box-title">รายละเอียด</div>
                      <div className="tp-sum-box-body">
                        <div className="tp-sum-detail-line">
                          <span>ราคาต้น</span>
                          <div className="tp-sum-detail-val">
                            <img src={selectedPkg?.img || game.icon} alt="" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                            {baseAmount.toLocaleString()}
                          </div>
                        </div>
                        {bonusAmount > 0 && (
                          <div className="tp-sum-detail-line">
                            <span>+ โบนัสทั่วไป</span>
                            <div className="tp-sum-detail-val tp-sum-bonus">
                              <img src={selectedPkg?.img || game.icon} alt="" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                              {bonusAmount.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="tp-sum-box">
                      <div className="tp-sum-box-title">จำนวนทั้งหมด</div>
                      <div className="tp-sum-box-body-center">
                        <div className="tp-sum-total-big">
                          <img src={selectedPkg?.img || game.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                          {totalCoupons.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="tp-sum-box">
                      <div className="tp-sum-box-title">ราคารวม</div>
                      <div className="tp-sum-box-body-center">
                        <div className="tp-sum-price-big">฿ {totalPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="tp-sum-actions">
                    <div className="tp-sum-left-actions">
                      <div className="tp-sum-pkg-icon">
                        <img src={selectedPkg?.img || game.icon} alt=""
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                      <div className="tp-qty-wrap">
                        <button className="tp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                        <span className="tp-qty-num">{quantity}</span>
                        <button className="tp-qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</button>
                      </div>
                    </div>
                    <button className="tp-confirm-btn" onClick={() => onStep(2)}>
                      ทำการชำระเงิน ฿{totalPrice.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Step 2 Modal */}
          {step === 2 && !done && (
            <TopupStep2Modal
              game={game}
              selectedPkg={selectedPkg}
              quantity={quantity}
              accountFields={accountFields}
              accountValues={accountValues}
              fieldErrors={fieldErrors}
              updateAccountValue={updateAccountValue}
              blurAccountField={blurAccountField}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              showOrderDetails={showOrderDetails}
              setShowOrderDetails={setShowOrderDetails}
              accountComplete={accountComplete}
              handleConfirm={handleConfirm}
              loading={loading}
              totalPrice={totalPrice}
              totalCoupons={totalCoupons}
              baseAmount={baseAmount}
              bonusAmount={bonusAmount}
              pkgForStep2={pkgForStep2}
              onShowHowto={() => setShowHowto(true)}
            />
          )}

          {/* Success overlay */}
          {done && (
            <TopupSuccess
              orderId={orderId}
              game={game}
              pkgForStep2={pkgForStep2}
              accountSummary={accountSummary}
              totalPrice={totalPrice}
              onHome={onHome}
              onBack={onBack}
            />
          )}

        </div>
      )}

      {/* Howto Modal */}
      {showHowto && (
        <TopupHowto
          game={game}
          imgZoom={imgZoom}
          imgPan={imgPan}
          dragRef={dragRef}
          onClose={closeHowto}
          onWheel={onImgWheel}
          onMouseDown={onImgMouseDown}
          onMouseMove={onImgMouseMove}
          onMouseUp={onImgMouseUp}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />
      )}
    </>
  );
}
