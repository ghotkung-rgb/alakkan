import { FiX, FiUser, FiAlertTriangle, FiChevronDown, FiBook, FiCheck } from 'react-icons/fi';
import { BsWallet2, BsDiamondFill } from 'react-icons/bs';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../config/constants';

export default function TopupStep2Modal({
  game, selectedPkg, quantity,
  accountFields, accountValues, fieldErrors,
  updateAccountValue, blurAccountField,
  selectedPayment, setSelectedPayment,
  showOrderDetails, setShowOrderDetails,
  accountComplete, handleConfirm, loading,
  totalPrice, totalCoupons, baseAmount, bonusAmount, pkgForStep2,
  isItem, itemDisplayName,
  onShowHowto,
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
              {game.howtoImage && (
                <button className="tp-howto-trigger-btn" style={{ marginTop: 10 }} onClick={onShowHowto}>
                  <FiBook size={14} /> วิธีเติมเกม
                </button>
              )}
            </div>

            <div className="tp-step2-section">
              <div className="tp-step2-section-title">
                <div className="tp-step2-section-icon">
                  <BsWallet2 size={15} style={{ color: '#0ea5e9' }} />
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

            <button
              className="tp-step2-confirm-btn"
              disabled={!accountComplete || !selectedPayment || loading}
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
