import { useState, useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiArrowLeft, FiUser } from 'react-icons/fi';
import { ADMIN_USER, ADMIN_PASSWORD } from './adminShared';

export default function AdminLogin({ onAuth, onHome }) {
  const [uid,      setUid]     = useState('');
  const [pw,       setPw]      = useState('');
  const [show,     setShow]    = useState(false);
  const [error,    setError]   = useState('');
  const [loading,  setLoading] = useState(false);
  const [shake,    setShake]   = useState(false);
  const [mounted,  setMounted] = useState(false);
  const uidRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (mounted) setTimeout(() => uidRef.current?.focus(), 100);
  }, [mounted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    // DEV bypass: ทั้งสองฟิลด์ว่างเปล่า = ข้ามได้
    if (!uid.trim() && !pw.trim()) {
      setLoading(true);
      setTimeout(() => onAuth(), 380);
      return;
    }

    if (!uid.trim()) { setError('กรุณากรอก User ID'); return; }
    if (!pw.trim())  { setError('กรุณากรอกรหัสผ่าน'); return; }

    setLoading(true);
    setTimeout(() => {
      if (uid.trim() === ADMIN_USER && pw === ADMIN_PASSWORD) {
        onAuth();
      } else {
        setError('User ID หรือรหัสผ่านไม่ถูกต้อง');
        setShake(true);
        setLoading(false);
        setTimeout(() => setShake(false), 550);
      }
    }, 380);
  };

  return (
    <>
      <style>{`
        .al-root {
          position: fixed;
          inset: 0;
          z-index: 400;
          background: #020b18;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Background atmosphere ── */
        .al-orb-top {
          position: absolute;
          width: clamp(500px, 70vw, 1000px);
          height: clamp(320px, 45vw, 640px);
          background: radial-gradient(ellipse at 50% 10%, rgba(0,209,255,0.10) 0%, transparent 68%);
          top: -15%;
          left: 50%;
          translate: -50% 0;
          pointer-events: none;
        }
        .al-orb-br {
          position: absolute;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(0,209,255,0.055) 0%, transparent 70%);
          bottom: -5%; right: 3%;
          pointer-events: none;
        }
        .al-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,209,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,209,255,0.032) 1px, transparent 1px);
          background-size: 54px 54px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── Card ── */
        .al-card {
          position: relative;
          z-index: 1;
          width: calc(100% - 32px);
          max-width: 400px;
          background: #091627;
          clip-path: polygon(
            16px 0%, 100% 0%,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            0% 100%, 0% 16px
          );
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
        .al-card.mounted {
          opacity: 1;
          translate: 0 0;
        }
        .al-card.shake {
          animation: al-shake 0.52s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes al-shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-7px); }
          30%     { transform: translateX(7px); }
          45%     { transform: translateX(-5px); }
          60%     { transform: translateX(5px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }

        /* Top edge accent */
        .al-top-edge {
          position: absolute;
          top: 0;
          left: 16px;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00d1ff 0%, rgba(0,153,187,0.35) 100%);
        }

        /* ── Logo area ── */
        .al-logo-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 26px;
          gap: 0;
        }
        .al-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(0,209,255,0.55));
          margin-bottom: 14px;
          display: block;
        }
        .al-logo-title {
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-shadow: 0 0 24px rgba(0,209,255,0.22);
        }
        .al-logo-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.32);
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-top: 5px;
          text-transform: uppercase;
        }

        /* Divider */
        .al-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,209,255,0.18), transparent);
          margin-bottom: 26px;
        }

        /* ── Form fields ── */
        .al-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.42);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .al-input-wrap { position: relative; }
        .al-input {
          display: block;
          width: 100%;
          height: 50px;
          padding: 0 48px 0 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #e2e8f0;
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 14.5px;
          outline: none;
          clip-path: polygon(
            8px 0%, 100% 0%,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            0% 100%, 0% 8px
          );
          box-sizing: border-box;
          transition:
            border-color 0.2s ease,
            background    0.2s ease,
            filter        0.22s ease;
        }
        .al-input::placeholder { color: rgba(255,255,255,0.18); }
        .al-input:focus {
          border-color: rgba(0,209,255,0.65);
          background:   rgba(0,209,255,0.045);
          filter: drop-shadow(0 0 12px rgba(0,209,255,0.22));
        }
        .al-input.err { border-color: rgba(239,68,68,0.6); }

        .al-uid-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          translate: 0 -50%;
          color: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .al-pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          translate: 0 -50%;
          background: none;
          border: none;
          color: rgba(255,255,255,0.28);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 6px;
          transition: color 0.18s;
        }
        .al-pw-toggle:hover { color: rgba(255,255,255,0.62); }

        /* Error message */
        .al-error {
          height: 18px;
          font-size: 12px;
          color: #ef4444;
          font-weight: 700;
          margin-top: 7px;
        }
        .al-error.visible { animation: al-err-in 0.22s ease both; }
        @keyframes al-err-in {
          from { opacity: 0; translate: 0 -3px; }
          to   { opacity: 1; translate: 0 0; }
        }

        /* ── Submit button ── */
        .al-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 52px;
          margin-top: 20px;
          padding: 0;
          background: #00d1ff;
          color: #061522;
          border: none;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.06em;
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          filter: drop-shadow(0 4px 18px rgba(0,209,255,0.46));
          transition:
            background 0.15s ease,
            filter     0.22s ease,
            translate  0.2s  ease;
        }
        .al-btn:hover:not(:disabled) {
          background: #1af0ff;
          filter:    drop-shadow(0 6px 28px rgba(0,209,255,0.68));
          translate: 0 -1px;
        }
        .al-btn:active:not(:disabled) {
          translate: 0 0;
          filter:    drop-shadow(0 2px 8px rgba(0,209,255,0.32));
        }
        .al-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* loading dots */
        .al-dots { display: flex; gap: 5px; align-items: center; }
        .al-dots span {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #061522;
          animation: al-dot 1.1s infinite ease-in-out both;
        }
        .al-dots span:nth-child(2) { animation-delay: 0.18s; }
        .al-dots span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes al-dot {
          0%,80%,100% { opacity: 0.3; scale: 0.6; }
          40%         { opacity: 1;   scale: 1;   }
        }

        /* ── Back button ── */
        .al-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
          margin-top: 18px;
          padding: 4px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.26);
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.18s;
        }
        .al-back:hover { color: rgba(255,255,255,0.55); }

        /* ── DEV note ── */
        .al-dev {
          margin-top: 22px;
          padding: 8px 14px;
          background: rgba(251,191,36,0.05);
          border: 1px solid rgba(251,191,36,0.14);
          font-size: 11px;
          color: rgba(251,191,36,0.6);
          font-weight: 700;
          letter-spacing: 0.03em;
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .al-card { padding: 36px 26px 30px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .al-card { transition: none; opacity: 1; translate: 0 0; }
          .al-card.shake, .al-btn, .al-input, .al-back, .al-error.visible {
            transition: none; animation: none;
          }
        }
      `}</style>

      <div className="al-root">
        <div className="al-orb-top" aria-hidden="true" />
        <div className="al-orb-br"  aria-hidden="true" />
        <div className="al-grid"    aria-hidden="true" />

        <div className={`al-card${mounted ? ' mounted' : ''}${shake ? ' shake' : ''}`}
             role="main">
          <div className="al-top-edge" aria-hidden="true" />

          {/* Logo */}
          <div className="al-logo-area">
            <img
              src="/images/ALASKAN_WEB_ASSET/LOGO%203D/ALASKAN_3D_LOGO_2000.png"
              alt="ALASKAN SHOP"
              className="al-logo-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="al-logo-title">เข้าสู่ระบบ</div>
            <div className="al-logo-sub">ALASKAN SHOP — ADMIN PANEL</div>
          </div>

          <div className="al-divider" aria-hidden="true" />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* User ID */}
            <label className="al-label" htmlFor="al-uid-input">User ID</label>
            <div className="al-input-wrap" style={{ marginBottom: 14 }}>
              <input
                id="al-uid-input"
                ref={uidRef}
                type="text"
                value={uid}
                onChange={e => { setUid(e.target.value); setError(''); }}
                placeholder="กรอก User ID"
                className={`al-input${error ? ' err' : ''}`}
                autoComplete="username"
                aria-invalid={!!error}
                onKeyDown={e => e.key === 'Enter' && inputRef.current?.focus()}
              />
              <span className="al-uid-icon" aria-hidden="true">
                <FiUser size={15} />
              </span>
            </div>

            {/* Password */}
            <label className="al-label" htmlFor="al-pw-input">รหัสผ่าน</label>
            <div className="al-input-wrap">
              <input
                id="al-pw-input"
                ref={inputRef}
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="กรอกรหัสผ่าน"
                className={`al-input${error ? ' err' : ''}`}
                autoComplete="current-password"
                aria-describedby={error ? 'al-err-msg' : undefined}
                aria-invalid={!!error}
              />
              <button
                type="button"
                className="al-pw-toggle"
                onClick={() => setShow(s => !s)}
                tabIndex={-1}
                aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            <div
              id="al-err-msg"
              className={`al-error${error ? ' visible' : ''}`}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>

            <button type="submit" className="al-btn" disabled={loading}>
              {loading
                ? <span className="al-dots" aria-label="กำลังตรวจสอบ"><span /><span /><span /></span>
                : 'เข้าสู่ระบบ'
              }
            </button>
          </form>

          {onHome && (
            <button className="al-back" onClick={onHome} type="button">
              <FiArrowLeft size={13} aria-hidden="true" />
              กลับหน้าหลัก
            </button>
          )}

          <div className="al-dev">
            DEV MODE — ยังไม่มีฐานข้อมูล<br />
            ว่างทั้งสองช่อง = ข้ามได้ &nbsp;|&nbsp; ID: alaskan / PW: ADMIN2025
          </div>
        </div>
      </div>
    </>
  );
}
