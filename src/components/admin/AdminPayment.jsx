import { useState, useRef, useEffect } from 'react';
import { FiUpload, FiLink, FiCheck, FiTrash2, FiSave } from 'react-icons/fi';
import { PAYMENT_METHODS } from '../../config/constants';

// TODO [API] เมื่อ backend พร้อม: เพิ่ม import ด้านล่าง แล้วลบ qrKey + localStorage ออก
// import { uploadQR, getQR } from '../../services/topupService';

const QR_METHODS = PAYMENT_METHODS.filter(m => m.hasQR);

// TODO [API] ลบ qrKey ออกเมื่อย้ายไปใช้ uploadQR / getQR จาก topupService
function qrKey(id) { return `alaskan_qr_${id}`; }

function QRMethodCard({ method }) {
  // TODO [API] แทนที่ localStorage.getItem ด้วย:
  //   const [qr, setQr] = useState('');
  //   useEffect(() => { getQR(method.id).then(r => setQr(r.url || '')); }, [method.id]);
  const [qr,       setQr]       = useState(() => localStorage.getItem(qrKey(method.id)) || '');
  const [urlInput, setUrlInput] = useState('');
  const [saved,    setSaved]    = useState(false);
  const fileRef = useRef();

  const save = async (src) => {
    // TODO [API] แทนที่ localStorage.setItem ด้วย:
    //   const { url } = await uploadQR(method.id, src);
    //   setQr(url);
    localStorage.setItem(qrKey(method.id), src);
    setQr(src);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => save(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUrl = () => {
    const t = urlInput.trim();
    if (!t) return;
    save(t);
    setUrlInput('');
  };

  const handleRemove = () => {
    // TODO [API] เพิ่ม: await fetch('/api/qr/' + method.id, { method: 'DELETE' });
    localStorage.removeItem(qrKey(method.id));
    setQr('');
  };

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1.5px solid #e2e8f0',
      padding: '20px 20px 16px', marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: method.iconBg, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: method.iconColor, fontSize: 10, fontWeight: 900 }}>{method.iconText}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{method.name}</div>
        {qr && (
          <div style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 700,
            background: '#dcfce7', color: '#16a34a',
            padding: '3px 10px', borderRadius: 99,
          }}>มี QR แล้ว</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Preview */}
        <div style={{
          width: 130, height: 130, flexShrink: 0,
          border: '2px dashed #cbd5e1', borderRadius: 10,
          background: '#f8fafc', display: 'flex',
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {qr
            ? <img src={qr} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: 8 }}>ยังไม่มี QR</span>
          }
        </div>

        {/* Controls */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button onClick={() => fileRef.current.click()} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: '#0f172a', color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <FiUpload size={13} /> อัปโหลดรูป
            </button>
            {qr && (
              <button onClick={handleRemove} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#fee2e2', color: '#dc2626',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <FiTrash2 size={13} /> ลบ
              </button>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handleFile} />

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              placeholder="หรือวาง URL รูป QR"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrl()}
              style={{
                flex: 1, padding: '7px 11px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', fontSize: 12,
                fontFamily: 'inherit', outline: 'none', color: '#0f172a',
              }}
            />
            <button onClick={handleUrl} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: '#e0f2fe', color: '#0369a1',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <FiLink size={12} /> URL
            </button>
          </div>

          {/* Save button */}
          <button onClick={() => qr && save(qr)} disabled={!qr} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: saved ? '#16a34a' : (qr ? '#0f172a' : '#e2e8f0'),
            color: saved ? '#fff' : (qr ? '#fff' : '#94a3b8'),
            fontSize: 12, fontWeight: 800, cursor: qr ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', transition: 'background 0.2s',
          }}>
            {saved ? <FiCheck size={13} /> : <FiSave size={13} />}
            {saved ? 'บันทึกแล้ว' : 'บันทึก QR CODE'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayment() {
  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{
        fontSize: 12, color: '#64748b', marginBottom: 20,
        background: '#f1f5f9', borderRadius: 8, padding: '10px 14px',
        lineHeight: 1.7,
      }}>
        QR Code จะแสดงในหน้ายืนยันออเดอร์ เฉพาะเมื่อลูกค้าเลือกช่องทางนั้น
        ช่องทางที่ไม่มี QR (ShopeePay, SMS, บัตรเครดิต ฯลฯ) ไม่ต้องตั้งค่า
      </div>

      {QR_METHODS.map(m => <QRMethodCard key={m.id} method={m} />)}
    </div>
  );
}
