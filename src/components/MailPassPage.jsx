import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/topupService';
import { FiAlertTriangle, FiLock, FiBook, FiEye, FiEyeOff, FiCheck, FiX, FiUser, FiTool, FiChevronDown } from 'react-icons/fi';
import { BsWallet2 } from 'react-icons/bs';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../config/constants';
import { PaymentQR, SlipUpload } from './PaymentWidgets';
import './MailPassPage.css';

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
          'เลือกช่องทางชำระเงินที่ต้องการ',
          'ทีมงานจะดำเนินการเติมและแจ้งผลให้ทราบทันที',
        ],
      },
    ],
  };
}

export default function MailPassPage({ game, onBack, step, onStep, onHome }) {
  const [selectedPkgs, setSelectedPkgs] = useState([]);
  const [quantity, setQuantity]         = useState(1);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [fieldValues, setFieldValues]   = useState(() => {
    const init = {};
    (game.accountFields || []).forEach(f => {
      if (f.type === 'select' && f.options?.length === 1) init[f.key] = f.options[0];
    });
    return init;
  });
  const [showPw, setShowPw]             = useState(false);
  const [showHowtoPopup, setShowHowtoPopup] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [orderId, setOrderId]           = useState(null);
  const [slip, setSlip]                 = useState(null);
  const [done, setDone]                 = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentError,    setPaymentError]    = useState(false);

  // scroll lock while modal open
  useEffect(() => {
    if (step === 2) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [step]);

  useEffect(() => {
    const reset = () => setDone(false);
    window.addEventListener('popstate', reset);
    return () => window.removeEventListener('popstate', reset);
  }, []);

  const togglePkg = (pkg) => {
    setSelectedPkgs(prev =>
      prev.some(p => p.id === pkg.id) ? [] : [pkg]
    );
    setQuantity(1);
  };

  const totalPrice  = selectedPkgs.reduce((sum, p) => sum + p.price, 0) * quantity;
  const totalAmount = selectedPkgs.reduce((sum, p) => sum + (p.amount || 0), 0) * quantity;

  const validateMPField = (field, value) => {
    const raw = value ?? '';
    const trimmed = field.type === 'password' ? raw : raw.trim();
    if (field.required && !trimmed) return field.type === 'select' ? `กรุณาเลือก ${field.label}` : `กรุณากรอก ${field.label}`;
    if (!trimmed) return null;
    if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'อีเมลไม่ถูกต้อง';
    }
    if (field.type === 'password') {
      if (trimmed.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    if (field.type === 'tel') {
      if (!/^0[0-9]{8,9}$/.test(trimmed)) return 'เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)';
    }
    if (field.inputMode === 'numeric') {
      if (!/^\d+$/.test(trimmed)) return 'กรอกเฉพาะตัวเลขเท่านั้น';
      if (trimmed.length < 5)     return 'ต้องมีอย่างน้อย 5 หลัก';
      if (trimmed.length > 20)    return 'ค่าที่กรอกยาวเกินไป';
    }
    return null;
  };

  const [mpFieldErrors, setMpFieldErrors] = useState({});

  const validateAllMP = () => {
    if (!game.accountFields) {
      const errs = {};
      if (!email.trim()) errs.email = 'กรุณากรอกอีเมล';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'อีเมลไม่ถูกต้อง';
      if (!password) errs.password = 'กรุณากรอกรหัสผ่าน';
      else if (password.length < 6) errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      setMpFieldErrors(errs);
      return Object.keys(errs).length === 0;
    }
    const errs = {};
    game.accountFields.forEach(f => {
      const err = validateMPField(f, fieldValues[f.key] || '');
      if (err) errs[f.key] = err;
    });
    setMpFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canConfirm = game.accountFields
    ? game.accountFields.filter(f => f.required).every(f => (fieldValues[f.key] || '').trim())
    : email.trim() && password.trim();

  const handleConfirm = async () => {
    if (!selectedPayment) { setPaymentError(true); return; }
    if (!validateAllMP()) return;
    setLoading(true);
    try {
      const result = await createOrder({
        gameId: game.id,
        uid: game.accountFields ? (fieldValues['idLogin'] || '') : email,
        accountData: game.accountFields ? fieldValues : { email, password },
        packages: selectedPkgs.map(p => ({ id: p.id, amount: (p.amount || 0) * quantity, price: p.price * quantity, label: quantity > 1 ? `${p.label || `${p.amount} ${game.currency}`} × ${quantity}` : (p.label || `${p.amount} ${game.currency}`) })),
        totalPrice,
        paymentMethod: selectedPayment,
        slip: slip?.src || null,
      });
      setOrderId(result.orderId);
      setDone(true);
      window.history.replaceState(
        { activeMenu: 'HOME', topupGame: null, mailpassGame: game.id, topupStep: 1, mailpassStep: 1 },
        '',
        window.location.hash,
      );
    } finally {
      setLoading(false);
    }
  };

  const PROMO_ASPECT = game.promoAspect || '21 / 7';

  const HeroBanner = () => {
    const bannerSrc = game.promoBg || game.bg;
    return (
      <div style={{ position: 'relative' }}>
        <img src={bannerSrc} alt={game.name}
          style={{ display: 'block', width: '100%', aspectRatio: PROMO_ASPECT, objectFit: 'cover', objectPosition: 'center top' }}
          onError={e => { e.target.style.display = 'none'; }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(to bottom, transparent, #ffffff)', pointerEvents: 'none' }} />
      </div>
    );
  };

  const HowtoBlock = () => {
    const info  = game.info || buildDefaultInfo(game);
    const steps = info.sections?.find(s => s.ordered)?.items ?? [];
    const handleClick = () => {
      if (game.howtoImage) {
        window.open(game.howtoImage, '_blank', 'noopener,noreferrer');
      } else {
        setShowHowtoPopup(true);
      }
    };
    return (
      <button className="mp-howto-btn" style={{ marginTop: 10 }} onClick={handleClick}>
        <FiBook size={14} /> ดูวิธีการเติมเกม
      </button>
    );
  };

  return (
    <>
      {/* ── Coming Soon ── */}
      {(!game.packages || game.packages.length === 0) && (
        <div className="mp-page">
          <HeroBanner />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 24px 80px' }}>
            <div style={{ textAlign: 'center', maxWidth: 360 }}>
              <div style={{ marginBottom: 18, color: '#94a3b8' }}><FiTool size={52} /></div>
              <div style={{ fontFamily: "'PSL Kampanath Pro', sans-serif", fontSize: 24, fontWeight: 900, color: '#475569', letterSpacing: '0.04em', marginBottom: 10 }}>กำลังเปิดให้บริการ</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', lineHeight: 2, marginBottom: 28 }}>
                สินค้าจะมาในเร็วๆ นี้<br />ติดตามได้ที่เฟส <strong style={{ color: '#475569' }}>ALASKAN ONLINE SHOP</strong> ของเรา
              </div>
              <a href="https://www.facebook.com/ALASKAN.ONLINE.SHOP" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1877f2', color: '#fff', textDecoration: 'none', padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, filter: 'drop-shadow(0 4px 12px rgba(24,119,242,0.4))' }}>
                ติดตาม Facebook Page
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      {game.packages && game.packages.length > 0 && (
        <div className="mp-page">

          <HeroBanner />

          {/* Game bar */}
          <div className="mp-game-bar">
            <img src={game.icon} alt={game.name} className="mp-game-bar-icon"
              onError={e => { e.target.style.display = 'none'; }} />
            <div style={{ position: 'relative', paddingTop: '40px' }}>
              <div className="mp-game-bar-label">เติมเกม</div>
              <div className="mp-game-bar-name">{game.name}</div>
              <div>
                <span className="mp-game-bar-plat"><FaGooglePlay size={11} /> Play Store</span>
                <span className="mp-game-bar-plat"><FaApple size={11} /> iOS</span>
              </div>
            </div>
            <div style={{ flex: 1 }} />
          </div>

          {/* Step tabs */}
          <div className="mp-step-tabs">
            <div className={`mp-step-item${step === 1 ? ' active' : ' done'}`}>
              <div className="mp-step-num">{step > 1 ? <FiCheck size={11} /> : '1'}</div>
              <span>เลือกแพ็กเกจ</span>
            </div>
            <div className="mp-step-line" />
            <div className={`mp-step-item${step === 2 ? ' active' : ''}`}>
              <div className="mp-step-num">2</div>
              <span>{game.accountFields ? 'กรอกข้อมูล' : 'กรอก Email'}</span>
            </div>
            <div className="mp-step-line" />
            <div className="mp-step-item">
              <div className="mp-step-num">3</div>
              <span>ยืนยันออเดอร์</span>
            </div>
          </div>

          {/* ── STEP 1: Package grid ── */}
          {step === 1 && (
            <div className="mp-body">

              <div className="mp-section-header">
                <div className="mp-section-title">กรุณาเลือกแพ็คที่ต้องการ</div>
                <div className="mp-section-tag">
                  <span style={{ color: '#00d1ff' }}>MAIL</span>
                  <span style={{ color: '#475569' }}>PASS</span>
                </div>
              </div>

              <div className="mp-pkg-grid">
                {game.packages.map(pkg => {
                  const isSelected = selectedPkgs.some(p => p.id === pkg.id);
                  return (
                    <div key={pkg.id}
                      className={`mp-pkg-card-wrap${isSelected ? ' selected' : ''}`}
                      onClick={() => togglePkg(pkg)}>
                      <div className="mp-pkg-card">
                        {pkg.badge && (
                          <div className={`mp-pkg-badge ${pkg.badge === 'แนะนำ' ? 'rec' : 'hot'}`}>
                            {pkg.badge}
                          </div>
                        )}
                        <div className="mp-pkg-img-wrap">
                          <img src={pkg.img || game.icon} alt={`${pkg.amount}`} loading="lazy" decoding="async"
                            onError={e => { e.target.style.display = 'none'; }} />
                        </div>
                        <div className={`mp-pkg-amount-label${pkg.amount === 0 ? ' is-label' : ''}`}>
                          {pkg.amount > 0
                            ? <><strong>{pkg.amount.toLocaleString()}</strong> <span className="mp-pkg-currency">{game.currency}</span></>
                            : <strong>{pkg.label || ''}</strong>
                          }
                        </div>
                        <span className="mp-pkg-price-box">{pkg.price.toLocaleString()} THB</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ── Summary card (step 1) ── */}
          {step === 1 && selectedPkgs.length > 0 && !done && (
            <div className="mp-sum-wrap">
              <div className="mp-sum-card">
                <div className="mp-sum-boxes">

                  {/* Box 1: รายละเอียด */}
                  <div className="mp-sum-box">
                    <div className="mp-sum-box-title">รายละเอียด</div>
                    <div className="mp-sum-box-body">
                      <div className="mp-sum-item-name">
                        <img src={selectedPkgs[0]?.img || game.icon} alt=""
                          style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none'; }} />
                        <span>
                          {selectedPkgs.length === 1
                            ? (selectedPkgs[0].label || `${selectedPkgs[0].amount?.toLocaleString()} ${game.currency}`)
                            : `${selectedPkgs.length} แพ็กเกจที่เลือก`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Box 2: จำนวนทั้งหมด */}
                  <div className="mp-sum-box">
                    <div className="mp-sum-box-title">{totalAmount > 0 ? game.currency : 'แพ็กเกจ'}</div>
                    <div className="mp-sum-box-body-center">
                      {totalAmount > 0 ? (
                        <div className="mp-sum-total-big">
                          <img src={selectedPkgs[0]?.img || game.icon} alt=""
                            style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }}
                            onError={e => { e.target.style.display = 'none'; }} />
                          {totalAmount.toLocaleString()}
                        </div>
                      ) : (
                        <div className="mp-sum-total-big">{selectedPkgs.length}</div>
                      )}
                      <div className="mp-sum-qty-row">
                        <span className="mp-sum-qty-label">จำนวน</span>
                        <div className="mp-qty-wrap">
                          <button className="mp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                          <span className="mp-qty-num">{quantity}</span>
                          <button className="mp-qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Box 3: ราคารวม + confirm */}
                  <div className="mp-sum-box">
                    <div className="mp-sum-box-title">ราคารวม</div>
                    <div className="mp-sum-box-body-center">
                      <div className="mp-sum-price-big">
                        {totalPrice.toLocaleString()} <span className="mp-sum-thb">บาท</span>
                      </div>
                      <button className="mp-confirm-btn" onClick={() => onStep(2)}>
                        ยืนยันชำระเงิน
                      </button>
                    </div>
                  </div>

                </div>
                <div className="mp-sum-note">* โปรดตรวจสอบแพ็กเกจที่ต้องการให้ถูกต้อง ก่อนทำรายการชำระเงิน</div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Modal ── */}
          {step === 2 && !done && (
            <div className="mp-step2-overlay"
              onClick={e => { if (e.target === e.currentTarget) window.history.back(); }}>
              <div className="mp-step2-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="mp-step2-header">
                  <img src={game.icon} alt={game.name} className="mp-step2-header-icon"
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <div className="mp-step2-header-name">
                      เติมเกม <span style={{ color: '#00d1ff' }}>{game.name}</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <span className="mp-game-bar-plat"><FaGooglePlay size={11} /> Play Store</span>
                      <span className="mp-game-bar-plat"><FaApple size={11} /> iOS</span>
                    </div>
                  </div>
                  <button className="mp-step2-close" onClick={() => window.history.back()} aria-label="ปิด">
                    <FiX size={16} />
                  </button>
                </div>

                {/* Mini step bar */}
                <div className="mp-modal-steps-bar">
                  <div className="mp-modal-step done">
                    <div className="mp-modal-step-num"><FiCheck size={10} /></div>
                    <span>เลือกแพ็กเกจ</span>
                  </div>
                  <div className="mp-modal-step-line" />
                  <div className="mp-modal-step active">
                    <div className="mp-modal-step-num">2</div>
                    <span>{game.accountFields ? 'กรอกข้อมูล' : 'กรอก Email'}</span>
                  </div>
                  <div className="mp-modal-step-line" />
                  <div className="mp-modal-step">
                    <div className="mp-modal-step-num">3</div>
                    <span>ยืนยันออเดอร์</span>
                  </div>
                </div>

                {/* Section header */}
                <div className="mp-step2-section-header">
                  <div className="mp-section-title">ข้อมูลการชำระเงิน</div>
                  <div className="mp-section-tag">
                    <span style={{ color: '#00d1ff' }}>MAIL</span>
                    <span style={{ color: '#475569' }}>PASS</span>
                  </div>
                </div>

                {/* 2-col body */}
                <div className="mp-step2-body">

                  {/* Left */}
                  <div className="mp-step2-left">

                    <div className="mp-step2-section">
                      <div className="mp-step2-section-title">
                        <div className="mp-step2-section-icon">
                          <FiUser size={15} style={{ color: '#0ea5e9' }} />
                        </div>
                        กรุณากรอกข้อมูลบัญชีเกม
                      </div>
                      <div className="mp-security-box" style={{ marginBottom: 14 }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <FiAlertTriangle size={15} /> ข้อควรระวัง — บริการ Mail/Pass
                        </strong>
                        บริการนี้ต้องการ Email และ Password ของบัญชีเกม เราจะใช้ข้อมูลเพื่อเข้าเติมเท่านั้น
                        และ<strong>ไม่เก็บรหัสผ่านไว้ในระบบ</strong> แนะนำให้เปลี่ยนรหัสผ่านใหม่หลังเติมเสร็จทุกครั้ง
                      </div>
                      {game.accountFields ? (
                        game.accountFields.map(field => (
                          <div key={field.key} className="mp-account-field">
                            <div className="mp-field-label">
                              {field.label}
                              {field.required && <span className="mp-field-req"> *</span>}
                              {field.labelHint && <span className="mp-field-label-hint">({field.labelHint})</span>}
                            </div>
                            <div className="mp-uid-field">
                              {field.type === 'select' ? (
                                <>
                                  <FiChevronDown size={14} className="mp-uid-input-icon" />
                                  <select
                                    className={`mp-uid-input mp-select${mpFieldErrors[field.key] ? ' err' : ''}`}
                                    value={fieldValues[field.key] || ''}
                                    onChange={e => {
                                      setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }));
                                      setMpFieldErrors(prev => ({ ...prev, [field.key]: null }));
                                    }}
                                  >
                                    <option value="">{field.placeholder}</option>
                                    {(field.options || []).map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </>
                              ) : (
                                <>
                                  {field.type === 'password'
                                    ? <FiLock size={14} className="mp-uid-input-icon" />
                                    : <FiUser size={14} className="mp-uid-input-icon" />}
                                  <input
                                    className={`mp-uid-input${field.type === 'password' ? ' pw' : ''}${mpFieldErrors[field.key] ? ' err' : ''}`}
                                    type={field.type === 'password' ? (showPw ? 'text' : 'password') : field.type}
                                    placeholder={field.placeholder}
                                    value={fieldValues[field.key] || ''}
                                    onChange={e => {
                                      setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }));
                                      setMpFieldErrors(prev => ({ ...prev, [field.key]: null }));
                                    }}
                                    autoComplete={field.type === 'password' ? 'current-password' : 'off'}
                                  />
                                  {field.type === 'password' && (
                                    <button type="button" className="mp-uid-pw-toggle"
                                      onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                                      {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                            {mpFieldErrors[field.key] && (
                              <div className="mp-field-error">{mpFieldErrors[field.key]}</div>
                            )}
                            {field.hint && !mpFieldErrors[field.key] && <div className="mp-field-hint">{field.hint}</div>}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="mp-account-field">
                            <div className="mp-uid-field">
                              <FiUser size={14} className="mp-uid-input-icon" />
                              <input className={`mp-uid-input${mpFieldErrors.email ? ' err' : ''}`} type="email"
                                placeholder="Email ของบัญชีเกม"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setMpFieldErrors(p => ({ ...p, email: null })); }}
                                autoFocus autoComplete="username" />
                            </div>
                            {mpFieldErrors.email && <div className="mp-field-error">{mpFieldErrors.email}</div>}
                          </div>
                          <div className="mp-account-field">
                            <div className="mp-uid-field">
                              <FiLock size={14} className="mp-uid-input-icon" />
                              <input className={`mp-uid-input pw${mpFieldErrors.password ? ' err' : ''}`}
                                type={showPw ? 'text' : 'password'}
                                placeholder="Password ของบัญชีเกม"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setMpFieldErrors(p => ({ ...p, password: null })); }}
                                autoComplete="current-password" />
                              <button type="button" className="mp-uid-pw-toggle"
                                onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                            {mpFieldErrors.password && <div className="mp-field-error">{mpFieldErrors.password}</div>}
                          </div>
                        </>
                      )}
                      <div className="mp-hint">
                        <FiLock size={14} style={{ flexShrink: 0 }} />
                        ข้อมูลของคุณจะถูกส่งผ่านช่องทางที่เข้ารหัส และลบออกทันทีหลังเติมเสร็จ
                      </div>
                      <HowtoBlock />
                    </div>

                    <div className="mp-step2-section">
                      <div className="mp-step2-section-title">
                        <div className="mp-step2-section-icon">
                          <BsWallet2 size={15} style={{ color: '#0ea5e9' }} />
                        </div>
                        เลือกช่องทางการชำระเงิน
                        {paymentError && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                            — กรุณาเลือกช่องทางชำระเงิน
                          </span>
                        )}
                      </div>
                      <div className={`mp-pay-list${paymentError ? ' pay-err' : ''}`}>
                        {PAYMENT_METHODS.map(pm => (
                          <div key={pm.id}
                            className={`mp-pay-item${selectedPayment === pm.id ? ' selected' : ''}`}
                            onClick={() => { setSelectedPayment(pm.id); setPaymentError(false); }}>
                            <div className="mp-pay-item-icon" style={{ background: pm.iconBg }}>
                              <span style={{ color: pm.iconColor, fontSize: 10, fontWeight: 900 }}>{pm.iconText}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="mp-pay-item-name">{pm.name}</div>
                              {pm.desc && <div className="mp-pay-item-desc">{pm.desc}</div>}
                            </div>
                            {pm.badge && (
                              <span style={{ fontSize: 10, fontWeight: 800, color: '#0096ba', background: '#e0f7fa', padding: '2px 7px', borderRadius: 99 }}>
                                {pm.badge}
                              </span>
                            )}
                            <div className="mp-pay-radio"><div className="mp-pay-radio-dot" /></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                        <FiAlertTriangle size={11} />
                        ข้อมูลการชำระเงินจะถูกเข้ารหัสอย่างปลอดภัย
                      </div>
                    </div>

                  </div>

                  {/* Right */}
                  <div className="mp-step2-right">
                    <div className="mp-order-sum">
                      <div className="mp-order-sum-title">สรุปรายการสั่งซื้อ</div>

                      <div className="mp-order-pkg-row">
                        <img className="mp-order-pkg-img"
                          src={selectedPkgs[0]?.img || game.icon} alt=""
                          onError={e => { e.target.style.display = 'none'; }} />
                        <div>
                          <div className="mp-order-pkg-big">
                            {selectedPkgs.length === 1
                              ? `${selectedPkgs[0].label || `${selectedPkgs[0].amount?.toLocaleString()} ${game.currency}`}${quantity > 1 ? ` × ${quantity}` : ''}`
                              : `${selectedPkgs.length} แพ็กเกจ`}
                          </div>
                          {totalAmount > 0 && (
                            <div className="mp-order-pkg-sub">รวม {totalAmount.toLocaleString()} {game.currency}</div>
                          )}
                        </div>
                      </div>

                      {selectedPkgs.map(p => (
                        <div key={p.id} className="mp-order-detail-row">
                          <span>{p.label || `${p.amount?.toLocaleString()} ${game.currency}`}</span>
                          <div className="mp-order-detail-val">{p.price.toLocaleString()} ฿</div>
                        </div>
                      ))}

                      <div className="mp-order-total-row">
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>ยอดชำระ</div>
                        <div className="mp-order-total-price">฿ {totalPrice.toLocaleString()}</div>
                      </div>
                    </div>

                    <PaymentQR selectedPayment={selectedPayment} />

                    <SlipUpload slip={slip} setSlip={setSlip} />

                    <button className="mp-step2-confirm-btn"
                      disabled={!canConfirm || loading}
                      onClick={handleConfirm}>
                      {loading ? 'กำลังดำเนินการ...' : `ยืนยันการสั่งซื้อ ฿${totalPrice.toLocaleString()}`}
                    </button>

                    <button className="mp-step2-back-btn" onClick={() => window.history.back()}>
                      กลับไปเลือกแพ็กเกจ
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ── Howto popup ── */}
          {showHowtoPopup && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontFamily: "'PSL Kampanath Pro', sans-serif", fontSize: 20, fontWeight: 900, color: '#475569' }}>วิธีเติมเกม</div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }} onClick={() => setShowHowtoPopup(false)}>
                    <FiX size={18} />
                  </button>
                </div>
                {(() => {
                  const info = game.info || buildDefaultInfo(game);
                  const steps = info.sections?.find(s => s.ordered)?.items ?? [];
                  return steps.length > 0 ? (
                    <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {steps.map((s, i) => (
                        <li key={i} style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{s}</li>
                      ))}
                    </ol>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: 15, fontWeight: 700 }}>
                      วิธีการเติมจะมาเร็วๆ นี้
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── Success ── */}
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
                        {p.label || `${p.amount?.toLocaleString()} ${game.currency}`}
                      </span>
                    </div>
                  ))}
                  {game.accountFields ? (
                    game.accountFields.filter(f => f.type !== 'password' && fieldValues[f.key]).map(f => (
                      <div key={f.key} className="mp-summary-row">
                        <span className="mp-summary-key">{f.label}</span>
                        <span className="mp-summary-val" style={{ fontFamily: 'monospace', fontSize: 13 }}>{fieldValues[f.key]}</span>
                      </div>
                    ))
                  ) : (
                    <div className="mp-summary-row">
                      <span className="mp-summary-key">Email</span>
                      <span className="mp-summary-val" style={{ fontFamily: 'monospace', fontSize: 13 }}>{email}</span>
                    </div>
                  )}
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
      )}
    </>
  );
}
