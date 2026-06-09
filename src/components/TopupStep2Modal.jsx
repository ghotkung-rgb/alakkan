import { useState, useEffect, useRef } from 'react';
import { FiX, FiUser, FiAlertTriangle, FiChevronDown, FiBook, FiCheck, FiPlus } from 'react-icons/fi';
import { BsWallet2 } from 'react-icons/bs';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../config/constants';
import QRLightbox from './QRLightbox';

// TODO [API] ลบ TEST_QR เมื่อ backend พร้อม (QR จะมาจาก getQR() แทน)
const TEST_QR = '/images/QR/QR.jpg';

function PaymentQR({ selectedPayment }) {
  const method = PAYMENT_METHODS.find(m => m.id === selectedPayment);
  const [qr,       setQr]       = useState('');
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!method?.hasQR) { setQr(''); return; }
    // TODO [API] แทนที่ localStorage.getItem ด้วย:
    //   import { getQR } from '../services/topupService';
    //   getQR(selectedPayment).then(r => setQr(r.url || TEST_QR));
    setQr(localStorage.getItem(`alaskan_qr_${selectedPayment}`) || TEST_QR);
  }, [selectedPayment, method]);

  if (!method?.hasQR || !qr) return null;
  return (
    <>
      <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 10, letterSpacing: '0.05em' }}>
          สแกน QR — {method.name}
        </div>
        <img src={qr} alt={`QR ${method.name}`}
          onClick={() => setLightbox(true)}
          style={{ width: 210, height: 210, objectFit: 'contain', borderRadius: 8, display: 'block', margin: '0 auto', cursor: 'zoom-in' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
          กดรูปเพื่อขยาย · โอนแล้วกด "ยืนยันการสั่งซื้อ"
        </div>
      </div>
      {lightbox && <QRLightbox src={qr} label={`QR — ${method.name}`} onClose={() => setLightbox(false)} />}
    </>
  );
}

function SlipUpload({ slip, setSlip }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSlip({ src: ev.target.result, name: file.name });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{
      border: slip ? '1.5px solid #bbf7d0' : '2px dashed #cbd5e1',
      borderRadius: 10, marginBottom: 12,
      background: slip ? '#f0fdf4' : '#f8fafc',
      overflow: 'hidden', transition: 'all 0.2s',
    }}>
      {slip ? (
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#16a34a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiCheck size={14} /> แนบสลิปแล้ว
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={slip.src} alt="slip"
              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #bbf7d0', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: '#374151', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {slip.name}
              </div>
              <button onClick={() => setSlip(null)} style={{
                marginTop: 6, fontSize: 11, color: '#dc2626', fontWeight: 700,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
              }}>
                ลบสลิป
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => fileRef.current.click()} style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
          width: '100%', padding: '10px 14px', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <FiPlus size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>แนบสลิปการโอนเงิน</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>ไม่บังคับ — ช่วยให้ตรวจสอบได้เร็วขึ้น</div>
          </div>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export default function TopupStep2Modal({
  game, selectedPkg, quantity,
  accountFields, accountValues, fieldErrors,
  updateAccountValue, blurAccountField,
  selectedPayment, setSelectedPayment,
  paymentError, setPaymentError,
  showOrderDetails, setShowOrderDetails,
  accountComplete, handleConfirm, loading,
  totalPrice, totalCoupons, baseAmount, bonusAmount, pkgForStep2,
  isItem, itemDisplayName,
  onShowHowto,
  slip, setSlip,
}) {
  return (
    <div className="tp-step2-overlay" onClick={e => { if (e.target === e.currentTarget) window.history.back(); }}>
      <div className="tp-step2-modal" onClick={e => e.stopPropagation()}>

        <div className="tp-step2-header">
          <img src={game.icon} alt={game.name} loading="lazy" decoding="async"
            className="tp-step2-header-icon"
            onError={e => { e.target.style.display = 'none'; }} />
          <div>
            <div className="tp-step2-header-name">เติมเกม <span style={{ color: '#00d1ff' }}>{game.name}</span></div>
            <div className="tp-step2-header-plats">
              <span className="tp-game-bar-plat"><FaAndroid size={11} /> Android</span>
              <span className="tp-game-bar-plat"><FaApple size={11} /> iOS</span>
            </div>
          </div>
          <button className="tp-step2-close" onClick={() => window.history.back()} aria-label="ปิด">
            <FiX size={16} />
          </button>
        </div>

        <div className="tp-modal-steps-bar">
          <div className="tp-modal-step done">
            <div className="tp-modal-step-num"><FiCheck size={10} /></div>
            <span>เลือกแพ็คเกม</span>
          </div>
          <div className="tp-modal-step-line" />
          <div className="tp-modal-step active">
            <div className="tp-modal-step-num">2</div>
            <span>กรอก UID</span>
          </div>
          <div className="tp-modal-step-line" />
          <div className="tp-modal-step">
            <div className="tp-modal-step-num">3</div>
            <span>ยืนยันออเดอร์</span>
          </div>
        </div>

        <div className="tp-step2-section-header">
          <div className="tp-section-title">ข้อมูลการชำระเงิน</div>
          <div className="tp-section-tag">
            <span style={{ color: '#00d1ff' }}>UID</span>
            <span style={{ color: '#0f172a' }}>TOP-UP</span>
          </div>
        </div>

        <div className="tp-step2-body">

          {/* Left column */}
          <div className="tp-step2-left">

            <div className="tp-step2-section">
              <div className="tp-step2-section-title">
                <div className="tp-step2-section-icon">
                  <FiUser size={15} style={{ color: '#0ea5e9' }} />
                </div>
                กรุณากรอก ID ผู้เล่น
              </div>
              {accountFields.map(field => (
                <div key={field.key} className="tp-uid-field">
                  <FiUser size={14} className="tp-uid-input-icon" />
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
              <button className="tp-howto-trigger-btn" style={{ marginTop: 10 }} onClick={onShowHowto}>
                <FiBook size={14} /> วิธีเติมเกม
              </button>
            </div>

            <div className="tp-step2-section">
              <div className="tp-step2-section-title">
                <div className="tp-step2-section-icon">
                  <BsWallet2 size={15} style={{ color: '#0ea5e9' }} />
                </div>
                เลือกช่องทางการชำระเงิน
                {paymentError && (
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                    — กรุณาเลือกช่องทางชำระเงิน
                  </span>
                )}
              </div>
              <div className={`tp-pay-list${paymentError ? ' pay-err' : ''}`}>
                {PAYMENT_METHODS.map(pm => (
                  <div
                    key={pm.id}
                    className={`tp-pay-item${selectedPayment === pm.id ? ' selected' : ''}`}
                    onClick={() => { setSelectedPayment(pm.id); setPaymentError(false); }}
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
              <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }}>
                <FiAlertTriangle size={11} />
                ข้อมูลการชำระเงินจะถูกเข้ารหัสอย่างปลอดภัย
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="tp-step2-right">
            <div className="tp-order-sum">
              <div className="tp-order-sum-title">สรุปรายการสั่งซื้อ</div>

              <div className="tp-order-pkg-row">
                <img
                  className="tp-order-pkg-img"
                  src={selectedPkg?.img || game.icon} alt=""
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div>
                  {isItem ? (
                    <>
                      <div className="tp-order-pkg-big" style={{ fontSize: 16, lineHeight: 1.4 }}>{itemDisplayName}</div>
                      <div className="tp-order-pkg-sub">ไอเทม × {quantity}</div>
                    </>
                  ) : (
                    <>
                      <div className="tp-order-pkg-big">
                        {baseAmount.toLocaleString()}
                        {bonusAmount > 0 && (
                          <span style={{ color: '#16a34a' }}>+{bonusAmount.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="tp-order-pkg-sub">ทั้งหมด {totalCoupons.toLocaleString()} {game.currency}</div>
                    </>
                  )}
                </div>
              </div>

              {isItem ? (
                <div className="tp-order-detail-row">
                  <span>ไอเทม</span>
                  <div className="tp-order-detail-val">{itemDisplayName}</div>
                </div>
              ) : (
                <>
                  <div className="tp-order-detail-row">
                    <span>ชื่อสินค้า</span>
                    <div className="tp-order-detail-val">
                      {(baseAmount * quantity).toLocaleString()}
                    </div>
                  </div>
                  {bonusAmount > 0 && (
                    <div className="tp-order-detail-row">
                      <span>โบนัสพิเศษ</span>
                      <div className="tp-order-detail-val" style={{ color: '#16a34a' }}>
                        {(bonusAmount * quantity).toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div className="tp-order-detail-row">
                    <span>ทั้งหมด</span>
                    <div className="tp-order-detail-val">
                      {totalCoupons.toLocaleString()}
                    </div>
                  </div>
                </>
              )}

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

              <div className="tp-order-total-row">
                <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>ยอดชำระ</div>
                <div className="tp-order-total-price">฿ {totalPrice.toLocaleString()}</div>
              </div>
            </div>

            <PaymentQR selectedPayment={selectedPayment} />

            <SlipUpload slip={slip} setSlip={setSlip} />

            <button
              className="tp-step2-confirm-btn"
              disabled={!accountComplete || loading}
              onClick={handleConfirm}
            >
              {loading ? 'กำลังดำเนินการ...' : `ยืนยันการสั่งซื้อ ฿${totalPrice.toLocaleString()}`}
            </button>

            <button className="tp-step2-back-btn" onClick={() => window.history.back()}>
              กลับไปเลือกแพ็กเกจ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
