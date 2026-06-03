import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ activeMenu, setActiveMenu, onLogin }) {
  const menuItems = ['HOME', 'บริการเติมเกม', 'เอเจน', 'ข่าวสาร', 'ติดต่อเรา'];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNav = (item) => {
    setIsOpen(false);
    if (item === 'ติดต่อเรา') {
      if (activeMenu === 'HOME') {
        setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
      } else {
        setActiveMenu('HOME');
        setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 220);
      }
    } else {
      setActiveMenu(item);
    }
  };

  return (
    <>
      <style>{`
        .navbar-root {
          position: absolute;
          top: 0; left: 0; right: 0;
          width: 100%; z-index: 100;
          background: linear-gradient(to bottom,
            rgba(4, 12, 30, 0.86) 0%,
            rgba(4, 12, 30, 0.24) 68%,
            rgba(4, 12, 30, 0.00) 100%);
          padding-bottom: 28px;
        }

        .nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 36px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Logo ── */
        .nav-logo-wrap {
          display: flex;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.24s cubic-bezier(0.25, 1, 0.5, 1),
                      filter 0.24s ease;
        }
        .nav-logo-wrap:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 0 16px rgba(0,209,255,0.55));
        }
        .nav-logo-wrap:active { transform: scale(0.98); }
        .nav-logo-img {
          height: 38px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(0,209,255,0.30));
          display: block;
        }

        /* ── Menu ── */
        .nav-menu {
          display: flex;
          align-items: stretch;
          height: 100%;
          flex: 1;
          justify-content: center;
          gap: 2px;
        }

        .nav-btn {
          position: relative;
          height: 70px;
          padding: 0 18px;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: 0.035em;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          border: none;
          background: none;
          cursor: pointer;
          color: rgba(255,255,255,0.70);
          transition: color 0.18s ease;
          white-space: nowrap;
          text-shadow: 0 1px 8px rgba(0,0,0,0.55);
        }

        /* Hover capsule bg */
        .nav-btn::before {
          content: '';
          position: absolute;
          inset: 16px 5px;
          background: rgba(255,255,255,0.07);
          border-radius: 6px;
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .nav-btn:hover::before { opacity: 1; }
        .nav-btn.active::before {
          background: rgba(0,209,255,0.10);
          opacity: 1;
        }

        /* Signal Blue underline */
        .nav-btn::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 18px;
          right: 18px;
          height: 2px;
          background: #00d1ff;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(0,209,255,0.80),
                      0 0 20px rgba(0,209,255,0.40);
        }
        .nav-btn:hover { color: #fff; }
        .nav-btn:hover::after { transform: scaleX(0.6); }
        .nav-btn.active { color: #fff; }
        .nav-btn.active::after { transform: scaleX(1); }

        /* ── CTA Button ── */
        .nav-cta {
          background: #00d1ff;
          color: #0a1929;
          border: none;
          padding: 9px 26px;
          font-size: 13.5px;
          font-weight: 900;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          cursor: pointer;
          transition: filter 0.2s ease,
                      transform 0.2s cubic-bezier(0.25, 1, 0.5, 1),
                      background 0.15s ease;
          white-space: nowrap;
          letter-spacing: 0.05em;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          filter: drop-shadow(0 2px 10px rgba(0,209,255,0.55));
          flex-shrink: 0;
        }
        .nav-cta:hover {
          background: #1af0ff;
          filter: drop-shadow(0 4px 18px rgba(0,209,255,0.80));
          transform: translateY(-2px);
        }
        .nav-cta:active {
          transform: translateY(0);
          filter: drop-shadow(0 1px 6px rgba(0,209,255,0.40));
        }

        /* ── Hamburger ── */
        .nav-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          background: none;
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          flex-shrink: 0;
          transition: border-color 0.18s, background 0.18s;
        }
        .nav-hamburger:hover {
          border-color: #00d1ff;
          background: rgba(0,209,255,0.08);
        }

        /* ── Mobile Drawer ── */
        .nav-drawer {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 200;
        }
        .nav-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(4,12,30,0.60);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.22s ease both;
        }
        .nav-drawer-panel {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: rgba(4,12,30,0.97);
          border-bottom: 1px solid rgba(0,209,255,0.18);
          padding: 0 0 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.55);
          animation: slideDown 0.28s cubic-bezier(0.25,1,0.5,1) both;
        }
        .nav-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          padding: 0 22px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-drawer-logo {
          height: 34px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(0,209,255,0.30));
        }
        .nav-drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          background: none;
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          transition: border-color 0.18s, background 0.18s;
        }
        .nav-drawer-close:hover {
          border-color: #ef4444;
          background: rgba(239,68,68,0.10);
          color: #ef4444;
        }
        .nav-drawer-items {
          display: flex;
          flex-direction: column;
          padding: 10px 14px 0;
          gap: 2px;
        }
        .nav-drawer-item {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 10px;
          background: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          color: rgba(255,255,255,0.75);
          text-align: left;
          letter-spacing: 0.03em;
          transition: background 0.15s, color 0.15s;
        }
        .nav-drawer-item:hover, .nav-drawer-item.active {
          background: rgba(0,209,255,0.10);
          color: #00d1ff;
        }
        .nav-drawer-item.active {
          box-shadow: inset 3px 0 0 #00d1ff;
        }
        .nav-drawer-cta {
          margin: 16px 14px 0;
          width: calc(100% - 28px);
          padding: 13px;
          background: #00d1ff;
          color: #0a1929;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 900;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          cursor: pointer;
          letter-spacing: 0.05em;
          filter: drop-shadow(0 2px 10px rgba(0,209,255,0.45));
          transition: filter 0.2s, transform 0.2s;
        }
        .nav-drawer-cta:active { transform: scale(0.98); }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }

        @media (max-width: 767px) {
          .nav-menu, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .nav-drawer.open { display: block; }
          .nav-inner { padding: 0 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-btn, .nav-btn::before, .nav-btn::after,
          .nav-logo-wrap, .nav-cta, .nav-hamburger,
          .nav-drawer-backdrop, .nav-drawer-panel,
          .nav-drawer-item, .nav-drawer-close {
            transition: none;
            animation: none;
          }
        }
      `}</style>

      <nav className="navbar-root">
        <div className="nav-inner">

          {/* LOGO */}
          <div className="nav-logo-wrap" onClick={() => { setIsOpen(false); setActiveMenu('HOME'); }}>
            <img
              src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo-asset2.png"
              alt="ALASKAN TOPUP"
              className="nav-logo-img"
            />
          </div>

          {/* MENU — desktop */}
          <div className="nav-menu">
            {menuItems.map(item => (
              <button
                key={item}
                aria-current={activeMenu === item ? 'page' : undefined}
                className={`nav-btn ${activeMenu === item ? 'active' : ''}`}
                onClick={() => handleNav(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTA — desktop */}
          <button className="nav-cta" onClick={onLogin}>
            ลงชื่อเข้าใช้
          </button>

          {/* HAMBURGER — mobile only */}
          <button
            className="nav-hamburger"
            aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(v => !v)}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`nav-drawer${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="nav-drawer-backdrop" onClick={() => setIsOpen(false)} />
        <div className="nav-drawer-panel">
          <div className="nav-drawer-top">
            <img
              src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo-asset2.png"
              alt="ALASKAN TOPUP"
              className="nav-drawer-logo"
            />
            <button className="nav-drawer-close" aria-label="ปิดเมนู" onClick={() => setIsOpen(false)}>
              <FiX size={18} />
            </button>
          </div>
          <div className="nav-drawer-items">
            {menuItems.map(item => (
              <button
                key={item}
                className={`nav-drawer-item${activeMenu === item ? ' active' : ''}`}
                onClick={() => handleNav(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="nav-drawer-cta" onClick={() => { setIsOpen(false); onLogin?.(); }}>
            ลงชื่อเข้าใช้
          </button>
        </div>
      </div>
    </>
  );
}
