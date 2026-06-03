import { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { ADMIN_PASSWORD, sInput, sBtn, sBtnCyan } from './adminShared';

export default function AdminLogin({ onAuth, onHome }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr(true); setPw(''); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}
        style={{ background: '#fff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00d1ff', boxShadow: '0 0 0 6px rgba(0,209,255,0.1)' }}>
            <FiLock size={26} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Admin Panel</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 600, letterSpacing: '0.08em' }}>ALASKAN SHOP</div>
        </div>
        <div style={{ position: 'relative' }}>
          <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
            placeholder="รหัสผ่าน" autoFocus
            style={{ ...sInput, paddingRight: 44, border: err ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', transition: 'border-color 0.2s', fontSize: 15, borderRadius: 10, outline: 'none' }}
            onFocus={e => { if (!err) e.target.style.borderColor = '#00d1ff'; }}
            onBlur={e => { if (!err) e.target.style.borderColor = '#e2e8f0'; }} />
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {err && <div style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', marginTop: -8 }}>รหัสผ่านไม่ถูกต้อง</div>}
        <button type="submit" style={{ ...sBtnCyan, justifyContent: 'center', padding: '13px', fontSize: 15, fontWeight: 800, width: '100%' }}>
          เข้าสู่ระบบ
        </button>
        {onHome && (
          <button type="button" onClick={onHome}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13, fontWeight: 600, textAlign: 'center', padding: '4px 0', fontFamily: 'inherit' }}>
            &#9664; กลับหน้าหลัก
          </button>
        )}
      </form>
    </div>
  );
}
