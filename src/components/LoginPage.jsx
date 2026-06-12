import { useState, useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { ADMIN_USER, ADMIN_PASSWORD } from './admin/adminShared';

export default function LoginPage({ onAuthAdmin, onRegister, onHome }) {
  const [phone,    setPhone]   = useState('');
  const [pw,       setPw]      = useState('');
  const [show,     setShow]    = useState(false);
  const [error,    setError]   = useState('');
  const [loading,  setLoading] = useState(false);
  const [shake,    setShake]   = useState(false);
  const [mounted,  setMounted] = useState(false);
  const phoneRef = useRef(null);
  const pwRef    = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (mounted) setTimeout(() => phoneRef.current?.focus(), 100);
  }, [mounted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!phone.trim()) { setError('กรุณากรอกเบอร์โทร'); return; }
    if (!pw.trim())    { setError('กรุณากรอกรหัสผ่าน'); return; }

    setLoading(true);
    setTimeout(() => {
      // Admin detect — ถ้า phone ตรงกับ ADMIN_USER
      if (phone.trim() === ADMIN_USER && pw === ADMIN_PASSWORD) {
        onAuthAdmin();
        return;
      }
      // TODO [API] user auth — POST /api/auth/login { phone, password }
      setError('เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง');
      setShake(true);
      setLoading(false);
      setTimeout(() => setShake(false), 550);
    }, 380);
  };

  return (
    <>
      <style>{`
        .lp-root {
          position: fixed;
          inset: 0;
          z-index: 400;
          background: #020b18;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'PSL Empire Pro', sans-serif;
        }

        /* ── Background atmosphere ── */
        .lp-orb-top {
          position: absolute;
          width: clamp(500px, 70vw, 1000px);
          height: clamp(320px, 45vw, 640px);
          background: radial-gradient(ellipse at 50% 10%, rgba(0,209,255,0.10) 0%, transparent 68%);
          top: -15%; left: 50%;
          translate: -50% 0;
          pointer-events: none;
        }
        .lp-orb-br {
          position: absolute;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(0,209,255,0.055) 0%, transparent 70%);
          bottom: -5%; right: 3%;
          pointer-events: none;
        }
        .lp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,209,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,209,255,0.032) 1px, transparent 1px);
          background-size: 54px 54px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── Card ── */
        .lp-card {
          position: relative; z-index: 1;
          width: calc(100% - 32px); max-width: 420px;
          background: #091627;
          clip-path: polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px);
          padding: 44px 40px 36px;
          filter:
            drop-shadow(0 0 40px rgba(0,209,255,0.09))
            drop-shadow(0 32px 64px rgba(0,0,0,0.65));
          opacity: 0;
          translate: 0 30px;
          transition:
            opacity  0.42s cubic-bezier(0.22, 1, 0.36, 1),
            translate 0.42s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .lp-card.mounted  { opacity: 1; translate: 0 0; }
        .lp-card.shake    { animation: lp-shake 0.52s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
        @keyframes lp-shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-7px); }
          30%     { transform: translateX(7px); }
          45%     { transform: translateX(-5px); }
          60%     { transform: translateX(5px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        .lp-top-edge {
          position: absolute; top: 0; left: 16px; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00d1ff 0%, rgba(0,153,187,0.35) 100%);
        }

        /* ── Logo area ── */
        .lp-logo-area {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 26px; gap: 0;
        }
        .lp-logo-img {
          height: 52px; width: auto; object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(0,209,255,0.55));
          margin-bottom: 14px;
        }
        .lp-logo-title {
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
          font-size: 19px; font-weight: 700; color: #f1f5f9;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-shadow: 0 0 24px rgba(0,209,255,0.22);
        }
        .lp-logo-sub {
          font-size: 11px; color: rgba(255,255,255,0.32);
          font-weight: 700; letter-spacing: 0.1em;
          margin-top: 5px; text-transform: uppercase;
        }
        .lp-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,209,255,0.18), transparent);
          margin-bottom: 26px;
        }

        /* ── Form fields ── */
        .lp-label {
          display: block; font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.42); letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .lp-input-wrap { position: relative; }
        .lp-input {
          display: block; width: 100%; height: 50px;
          padding: 0 48px 0 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #e2e8f0;
          font-family: 'PSL Empire Pro', sans-serif; font-size: 14.5px;
          outline: none;
          clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);
          box-sizing: border-box;
          transition: border-color 0.2s ease, background 0.2s ease, filter 0.22s ease;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.18); }
        .lp-input:focus {
          border-color: rgba(0,209,255,0.65);
          background:   rgba(0,209,255,0.045);
          filter: drop-shadow(0 0 12px rgba(0,209,255,0.22));
        }
        .lp-input.err { border-color: rgba(239,68,68,0.6); }
        .lp-field-icon {
          position: absolute; right: 14px; top: 50%; translate: 0 -50%;
          color: rgba(255,255,255,0.25); display: flex; align-items: center;
          pointer-events: none;
        }
        .lp-pw-toggle {
          position: absolute; right: 12px; top: 50%; translate: 0 -50%;
          background: none; border: none; color: rgba(255,255,255,0.28);
          cursor: pointer; display: flex; align-items: center; padding: 6px;
          transition: color 0.18s;
        }
        .lp-pw-toggle:hover { color: rgba(255,255,255,0.62); }

        /* Error */
        .lp-error {
          height: 18px; font-size: 12px; color: #ef4444;
          font-weight: 700; margin-top: 7px;
        }
        .lp-error.visible { animation: lp-err-in 0.22s ease both; }
        @keyframes lp-err-in {
          from { opacity: 0; translate: 0 -3px; }
          to   { opacity: 1; translate: 0 0; }
        }

        /* ── Login button ── */
        .lp-btn {
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 52px; margin-top: 20px;
          background: #00d1ff; color: #061522; border: none;
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
          font-size: 15px; font-weight: 900; letter-spacing: 0.06em;
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          filter: drop-shadow(0 4px 18px rgba(0,209,255,0.46));
          transition: background 0.15s ease, filter 0.22s ease, translate 0.2s ease;
        }
        .lp-btn:hover:not(:disabled) {
          background: #1af0ff;
          filter: drop-shadow(0 6px 28px rgba(0,209,255,0.68));
          translate: 0 -1px;
        }
        .lp-btn:active:not(:disabled) { translate: 0 0; filter: drop-shadow(0 2px 8px rgba(0,209,255,0.32)); }
        .lp-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* loading dots */
        .lp-dots { display: flex; gap: 5px; align-items: center; }
        .lp-dots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: #061522; animation: lp-dot 1.1s infinite ease-in-out both;
        }
        .lp-dots span:nth-child(2) { animation-delay: 0.18s; }
        .lp-dots span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes lp-dot {
          0%,80%,100% { opacity: 0.3; scale: 0.6; }
          40%         { opacity: 1;   scale: 1; }
        }

        /* ── Register button ── */
        .lp-divider-row {
          display: flex; align-items: center; gap: 10px; margin: 18px 0 14px;
        }
        .lp-divider-row span {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .lp-divider-row em {
          font-style: normal; font-size: 11px;
          color: rgba(255,255,255,0.22); letter-spacing: 0.06em;
        }
        .lp-register-btn {
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 46px;
          background: transparent;
          border: 1px solid rgba(0,209,255,0.25);
          color: rgba(0,209,255,0.75);
          font-family: 'PSL Empire Pro', sans-serif;
          font-size: 13.5px; font-weight: 700; letter-spacing: 0.05em;
          cursor: pointer;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }
        .lp-register-btn:hover {
          border-color: rgba(0,209,255,0.55);
          color: #00d1ff;
          background: rgba(0,209,255,0.06);
        }

        /* ── Back ── */
        .lp-back {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          width: 100%; margin-top: 16px; padding: 4px;
          background: none; border: none;
          color: rgba(255,255,255,0.26);
          font-family: 'PSL Empire Pro', sans-serif;
          font-size: 12.5px; font-weight: 600; cursor: pointer;
          transition: color 0.18s;
        }
        .lp-back:hover { color: rgba(255,255,255,0.55); }

        @media (max-width: 480px) { .lp-card { padding: 36px 26px 30px; } }
        @media (prefers-reduced-motion: reduce) {
          .lp-card { transition: none; opacity: 1; translate: 0 0; }
          .lp-card.shake, .lp-btn, .lp-input, .lp-back, .lp-error.visible { transition: none; animation: none; }
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-orb-top" aria-hidden="true" />
        <div className="lp-orb-br"  aria-hidden="true" />
        <div className="lp-grid"    aria-hidden="true" />

        <div className={`lp-card${mounted ? ' mounted' : ''}${shake ? ' shake' : ''}`} role="main">
          <div className="lp-top-edge" aria-hidden="true" />

          {/* Logo */}
          <div className="lp-logo-area">
            <img
              src="/images/ALASKAN_WEB_ASSET/LOGO%203D/ALASKAN_3D_LOGO_2000.png"
              alt="ALASKAN SHOP"
              className="lp-logo-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="lp-logo-title">เข้าสู่ระบบ</div>
            <div className="lp-logo-sub">ALASKAN SHOP</div>
          </div>

          <div className="lp-divider" aria-hidden="true" />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Phone */}
            <label className="lp-label" htmlFor="lp-phone-input">เบอร์โทรศัพท์</label>
            <div className="lp-input-wrap" style={{ marginBottom: 14 }}>
              <input
                id="lp-phone-input"
                ref={phoneRef}
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(''); }}
                placeholder="0XX-XXX-XXXX"
                className={`lp-input${error ? ' err' : ''}`}
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={!!error}
                onKeyDown={e => e.key === 'Enter' && pwRef.current?.focus()}
              />
              <span className="lp-field-icon" aria-hidden="true"><FiPhone size={15} /></span>
            </div>

            {/* Password */}
            <label className="lp-label" htmlFor="lp-pw-input">รหัสผ่าน</label>
            <div className="lp-input-wrap">
              <input
                id="lp-pw-input"
                ref={pwRef}
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="กรอกรหัสผ่าน"
                className={`lp-input${error ? ' err' : ''}`}
                autoComplete="current-password"
                aria-describedby={error ? 'lp-err-msg' : undefined}
                aria-invalid={!!error}
              />
              <button
                type="button"
                className="lp-pw-toggle"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            <div
              id="lp-err-msg"
              className={`lp-error${error ? ' visible' : ''}`}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>

            {/* Login */}
            <button type="submit" className="lp-btn" disabled={loading}>
              {loading
                ? <span className="lp-dots"><span/><span/><span/></span>
                : 'เข้าสู่ระบบ'}
            </button>

          </form>

          {/* Register */}
          <div className="lp-divider-row">
            <span /><em>ยังไม่มีบัญชี?</em><span />
          </div>
          <button type="button" className="lp-register-btn" onClick={onRegister}>
            สมัครสมาชิก
          </button>

          {/* Back */}
          <button type="button" className="lp-back" onClick={onHome}>
            <FiArrowLeft size={13} />
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </>
  );
}
