import { useState, useEffect, useRef } from 'react';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { PAYMENT_METHODS } from '../config/constants';
import QRLightbox from './QRLightbox';

// TODO [API] ลบ TEST_QR เมื่อ backend พร้อม (QR จะมาจาก getQR() แทน)
const TEST_QR = '/images/QR/QR.jpg';

export function PaymentQR({ selectedPayment }) {
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

export function SlipUpload({ slip, setSlip }) {
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
