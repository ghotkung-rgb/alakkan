import { useState, useEffect, useRef, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar({ activeMenu, setActiveMenu, onLogin }) {
  const menuItems = ['HOME', 'ข่าวสาร', 'ติดต่อเรา'];
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);

  const CLOSE_DURATION = 240;

  const openDrawer = useCallback(() => {
    clearTimeout(closeTimer.current);
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, CLOSE_DURATION);
  }, []);

  useEffect(() => {
    const hw = document.querySelector('.home-wrap');
    if (hw) hw.style.overflowY = isOpen ? 'hidden' : '';
    else document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      const hw = document.querySelector('.home-wrap');
      if (hw) hw.style.overflowY = '';
      else document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // swipe down on navbar area to open, swipe up on drawer to close
  const touchStartY = useRef(null);
  const onNavTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const onNavTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 40 && !isOpen) openDrawer();
    if (dy < -40 && isOpen) closeDrawer();
    touchStartY.current = null;
  };

  const handleNav = (item) => {
    closeDrawer();
    if (item === 'ติดต่อเรา') {
      const contactEl = document.getElementById('contact-section');
      if (contactEl) {
        setTimeout(() => contactEl.scrollIntoView({ behavior: 'smooth' }), 50);
      } else {
        setActiveMenu('HOME');
        setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 380);
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
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }
        .nav-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
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
          filter:
            drop-shadow(0 0 5px rgba(0,209,255,0.6))
            drop-shadow(0 0 14px rgba(0,209,255,0.35));
        }
        .nav-logo-wrap:active { transform: scale(0.98); }
        .nav-logo-img {
          height: 38px;
          width: auto;
          object-fit: contain;
          filter:
            drop-shadow(0 0 4px rgba(0,209,255,0.5))
            drop-shadow(0 0 10px rgba(0,209,255,0.25));
          display: block;
        }
        .nav-logo-asset1 {
          height: 26px;
          margin-left: 8px;
          filter:
            drop-shadow(0 0 3px rgba(0,209,255,0.45))
            drop-shadow(0 0 8px rgba(0,209,255,0.2));
        }

        /* ── Menu ── */
        .nav-menu {
          display: flex;
          align-items: stretch;
          height: 100%;
          justify-content: center;
          gap: 2px;
        }

        .nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          height: 70px;
          padding: 0 18px;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.035em;
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
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
          color: #ffffff;
          border: none;
          padding: 9px 26px;
          font-size: 16px;
          font-weight: 900;
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
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
          display: flex;
          align-items: center;
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 10px;
          background: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
          color: rgba(255,255,255,0.75);
          text-align: left;
          letter-spacing: 0.03em;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
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
          font-family: 'PSL Chocolate Extra Pro', 'PSL Empire Pro', sans-serif;
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
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-100%); opacity: 0; }
        }

        .nav-drawer-backdrop.closing {
          animation: fadeOut 0.24s ease both;
        }
        .nav-drawer-panel.closing {
          animation: slideUp 0.24s cubic-bezier(0.25,1,0.5,1) both;
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

      <nav className="navbar-root" onTouchStart={onNavTouchStart} onTouchEnd={onNavTouchEnd}>
        <div className="nav-inner">

          {/* LOGO */}
          <a className="nav-logo-wrap" href="#home"
            onClick={(e) => { e.preventDefault(); setIsOpen(false); setActiveMenu('HOME'); }}
            style={{ textDecoration: 'none' }}>
            <img
              src="/images/ALASKAN_WEB_ASSET/LOGO%203D/ALASKAN_3D_LOGO_2000.png"
              alt="ALASKAN TOPUP"
              className="nav-logo-img"
            />
            <img
              src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo-asset1.png"
              alt=""
              className="nav-logo-img nav-logo-asset1"
            />
          </a>

          {/* MENU — desktop */}
          <div className="nav-menu">
            {menuItems.map(item => {
              const href = item === 'HOME' ? '#home' : item === 'ข่าวสาร' ? '#news' : undefined;
              const Tag = href ? 'a' : 'button';
              return (
                <Tag
                  key={item}
                  href={href}
                  aria-current={activeMenu === item ? 'page' : undefined}
                  className={`nav-btn ${activeMenu === item ? 'active' : ''}`}
                  onClick={(e) => { if (href) e.preventDefault(); handleNav(item); }}
                  style={href ? { textDecoration: 'none' } : undefined}
                >
                  {item}
                </Tag>
              );
            })}
          </div>

          {/* Login CTA + Hamburger — right column */}
          <div className="nav-right">
            {onLogin && (
              <button className="nav-cta" onClick={onLogin}>
                เข้าสู่ระบบ
              </button>
            )}
            <button
              className="nav-hamburger"
              aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={isOpen}
              onClick={() => isOpen ? closeDrawer() : openDrawer()}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`nav-drawer${isOpen ? ' open' : ''}`} aria-hidden={!isOpen} onTouchStart={onNavTouchStart} onTouchEnd={onNavTouchEnd}>
        <div className={`nav-drawer-backdrop${isClosing ? ' closing' : ''}`} onClick={closeDrawer} />
        <div className={`nav-drawer-panel${isClosing ? ' closing' : ''}`}>
          <div className="nav-drawer-top">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/images/ALASKAN_WEB_ASSET/LOGO%203D/ALASKAN_3D_LOGO_2000.png"
                alt="ALASKAN TOPUP"
                className="nav-drawer-logo"
              />
              <img
                src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo-asset1.png"
                alt=""
                style={{ height: 22, width: 'auto', objectFit: 'contain', marginLeft: 8, filter: 'drop-shadow(0 0 8px rgba(0,209,255,0.25))' }}
              />
            </div>
            <button className="nav-drawer-close" aria-label="ปิดเมนู" onClick={closeDrawer}>
              <FiX size={18} />
            </button>
          </div>
          <div className="nav-drawer-items">
            {menuItems.map(item => {
              const href = item === 'HOME' ? '#home' : item === 'ข่าวสาร' ? '#news' : undefined;
              const Tag = href ? 'a' : 'button';
              return (
                <Tag
                  key={item}
                  href={href}
                  className={`nav-drawer-item${activeMenu === item ? ' active' : ''}`}
                  onClick={(e) => { if (href) e.preventDefault(); handleNav(item); }}
                  style={href ? { textDecoration: 'none' } : undefined}
                >
                  {item}
                </Tag>
              );
            })}
            {onLogin && (
              <button
                className="nav-drawer-item"
                onClick={() => { closeDrawer(); onLogin(); }}
                style={{ color: '#00d1ff', fontWeight: 700 }}
              >
                เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
