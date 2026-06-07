import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/topupService';
import { FiAlertTriangle, FiLock, FiBook, FiEye, FiEyeOff, FiCheck, FiChevronDown, FiChevronUp, FiX, FiUser, FiTool } from 'react-icons/fi';
import { BsWallet2 } from 'react-icons/bs';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../config/constants';
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
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [orderId, setOrderId]           = useState(null);
  const [done, setDone]                 = useState(false);
  const [showHowto, setShowHowto]       = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

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
      prev.some(p => p.id === pkg.id)
        ? prev.filter(p => p.id !== pkg.id)
        : [...prev, pkg]
    );
  };

  const totalPrice  = selectedPkgs.reduce((sum, p) => sum + p.price, 0);
  const totalAmount = selectedPkgs.reduce((sum, p) => sum + (p.amount || 0), 0);

  const canConfirm = email.trim() && password.trim() && selectedPayment;

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

  const HeroBanner = () => game.promoBg ? (
    <div style={{ position: 'relative' }}>
      <img src={game.promoBg} alt={game.name}
        style={{ display: 'block', width: '100%', aspectRatio: PROMO_ASPECT }}
        onError={e => { e.target.style.display = 'none'; }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, transparent, #e8f4ff)', pointerEvents: 'none' }} />
    </div>
  ) : (
    <div className="mp-hero">
      <div className="mp-hero-bg" style={{ backgroundImage: `url('${game.promoBg || game.bg}')` }} />
      <div className="mp-hero-overlay" />
      <div className="mp-hero-content">
        <img src={game.icon} alt={game.name} className="mp-icon"
          onError={e => { e.target.style.display = 'none'; }} />
        <div>
          <div className="mp-game-name">{game.name}</div>
          <div className="mp-game-sub">{game.subtitle}</div>
        </div>
      </div>
    </div>
  );

  const HowtoBlock = () => {
    const info  = game.info || buildDefaultInfo(game);
    const steps = info.sections?.find(s => s.ordered)?.items ?? [];
    if (game.howtoImage) {
      return (
        <button className="mp-howto-btn"
          onClick={() => window.open(game.howtoImage, '_blank', 'noopener,noreferrer')}>
          <FiBook size={16} />
          <span>ดูวิธีการเติมเกม</span>
          <span style={{ marginLeft: 'auto', color: '#00d1ff', fontSize: 14 }}>→</span>
        </button>
      );
    }
    if (steps.length === 0) return null;
    return (
      <div>
        <button className="mp-howto-btn"
          style={{ borderRadius: showHowto ? '10px 10px 0 0' : 10 }}
          onClick={() => setShowHowto(v => !v)}>
          <FiBook size={16} />
          <span>ดูวิธีการเติมเกม</span>
          <span style={{ marginLeft: 'auto', color: '#00d1ff' }}>
            {showHowto ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </span>
        </button>
        {showHowto && (
          <div style={{
            background: '#fffbeb', border: '1.5px solid #fde68a', borderTop: 'none',
            borderRadius: '0 0 10px 10px', padding: '12px 16px',
          }}>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {steps.map((s, i) => (
                <li key={i} style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
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
              <span>กรอก Email</span>
            </div>
            <div className="mp-step-line" />
            <div className={`mp-step-item${step === 2 ? ' active' : ''}`}>
              <div className="mp-step-num">3</div>
              <span>ยืนยัน</span>
            </div>
          </div>

          {/* ── STEP 1: Package grid ── */}
          {step === 1 && (
            <div className="mp-body">

              <div className="mp-section-header">
                <div className="mp-section-title">กรุณาเลือกแพ็คที่ต้องการ</div>
                <div className="mp-section-tag">
                  <span style={{ color: '#00d1ff' }}>MAIL</span>
                  <span style={{ color: '#0f172a' }}>PASS</span>
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
                        {isSelected && <div className="mp-pkg-check"><FiCheck size={12} /></div>}
                        {pkg.badge && (
                          <div className={`mp-pkg-badge ${pkg.badge === 'แนะนำ' ? 'rec' : 'hot'}`}>
                            {pkg.badge}
                          </div>
                        )}
                        <div className="mp-pkg-img-wrap">
                          <img src={pkg.img || game.icon} alt={`${pkg.amount}`} loading="lazy" decoding="async"
                            onError={e => { e.target.style.display = 'none'; }} />
                        </div>
                        <div className="mp-pkg-amount-label">
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
                        <span className="mp-qty-num">{selectedPkgs.length}</span>
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
                    <span className="mp-game-badge" style={{ display: 'inline-block', marginTop: 4 }}>Mail / Pass</span>
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
                    <span>กรอก Email</span>
                  </div>
                  <div className="mp-modal-step-line" />
                  <div className="mp-modal-step active">
                    <div className="mp-modal-step-num">3</div>
                    <span>ยืนยัน</span>
                  </div>
                </div>

                {/* Section header */}
                <div className="mp-step2-section-header">
                  <div className="mp-section-title">ข้อมูลการชำระเงิน</div>
                  <div className="mp-section-tag">
                    <span style={{ color: '#00d1ff' }}>MAIL</span>
                    <span style={{ color: '#0f172a' }}>PASS</span>
                  </div>
                </div>

                {/* 2-col body */}
                <div className="mp-step2-body">

                  {/* Left */}
                  <div className="mp-step2-left">

                    <div className="mp-security-box">
                      <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <FiAlertTriangle size={15} /> ข้อควรระวัง — บริการ Mail/Pass
                      </strong>
                      บริการนี้ต้องการ Email และ Password ของบัญชีเกม เราจะใช้ข้อมูลเพื่อเข้าเติมเท่านั้น
                      และ<strong>ไม่เก็บรหัสผ่านไว้ในระบบ</strong> แนะนำให้เปลี่ยนรหัสผ่านใหม่หลังเติมเสร็จทุกครั้ง
                    </div>

                    <div className="mp-step2-section">
                      <div className="mp-step2-section-title">
                        <div className="mp-step2-section-icon">
                          <FiUser size={15} style={{ color: '#0ea5e9' }} />
                        </div>
                        กรุณากรอกข้อมูลบัญชีเกม
                      </div>
                      <input className="mp-input" type="email"
                        placeholder="Email ของบัญชีเกม"
                        value={email} onChange={e => setEmail(e.target.value)}
                        autoFocus autoComplete="username" />
                      <div className="mp-pw-wrap">
                        <input className="mp-input"
                          type={showPw ? 'text' : 'password'}
                          placeholder="Password ของบัญชีเกม"
                          value={password} onChange={e => setPassword(e.target.value)}
                          autoComplete="current-password" />
                        <button type="button" className="mp-pw-toggle"
                          onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                          {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
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
                      </div>
                      <div className="mp-pay-list">
                        {PAYMENT_METHODS.map(pm => (
                          <div key={pm.id}
                            className={`mp-pay-item${selectedPayment === pm.id ? ' selected' : ''}`}
                            onClick={() => setSelectedPayment(pm.id)}>
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
                              ? (selectedPkgs[0].label || `${selectedPkgs[0].amount?.toLocaleString()} ${game.currency}`)
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
      )}
    </>
  );
}
