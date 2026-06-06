import { FiCheck } from 'react-icons/fi';

export default function TopupSuccess({ orderId, game, pkgForStep2, accountSummary, totalPrice, onHome, onBack }) {
  return (
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
          <button className="tp-home-btn" onClick={onHome || onBack}>กลับหน้าหลัก</button>
          <button className="tp-history-btn" onClick={() => alert('ระบบประวัติออเดอร์กำลังพัฒนา')}>
            ดูประวัติคำสั่งซื้อ →
          </button>
        </div>
      </div>
    </div>
  );
}
