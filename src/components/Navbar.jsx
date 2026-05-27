import React, { useState, useEffect } from 'react';

export default function Navbar({ activeMenu, setActiveMenu }) {
  const menuItems = ['HOME', 'NEWS', 'AGENTS', 'ROLES', 'CONTENTS'];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.home-wrap');
    const target = el || window;
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 20);
    target.addEventListener('scroll', onScroll);
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@600;700;900&display=swap');

    .navbar-root {
  position: relative;  /* เปลี่ยนจาก absolute เป็น relative */
  top: 0; left: 0; width: 100%; z-index: 50;
  font-family: 'Noto Sans Thai', sans-serif;
  transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .navbar-root.scrolled {
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
        }
        .nav-btn {
          position: relative; height: 100%;
          padding: 0 14px; font-size: 13px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
          border: none; background: none; cursor: pointer;
          transition: color 0.15s ease;
          white-space: nowrap;
        }
        .nav-btn::after {
          content: ''; position: absolute; bottom: 0; left: 14px; right: 14px;
          height: 2px; background: #0ea5e9;
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.2s ease;
          border-radius: 2px;
        }
        .nav-btn.active { color: #0ea5e9; }
        .nav-btn.active::after { transform: scaleX(1); }
        .nav-btn:hover { color: #0284c7; }
        .nav-btn:hover::after { transform: scaleX(1); }

        .topup-btn {
          background: #0ea5e9; color: #fff;
          border: none; border-radius: 6px;
          padding: 7px 18px; font-size: 13px; font-weight: 700;
          font-family: 'Noto Sans Thai', sans-serif;
          cursor: pointer; transition: background 0.2s ease;
          white-space: nowrap;
        }
        .topup-btn:hover { background: #0284c7; }
      `}</style>

      <nav
        className={`navbar-root ${scrolled ? 'scrolled' : ''}`}
        style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 32px', height: 54,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* LOGO */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setActiveMenu('HOME')}
          >
            <div style={{
              background: '#0ea5e9', color: '#fff',
              fontWeight: 900, fontSize: 16, padding: '4px 12px',
              borderRadius: 6, letterSpacing: '0.02em',
            }}>
              ALASKAN
            </div>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#0f172a', letterSpacing: '0.02em' }}>
              SHOP
            </span>
          </div>

          {/* MENU */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, justifyContent: 'center' }}>
            {menuItems.map(item => (
              <button
                key={item}
                className={`nav-btn ${activeMenu === item ? 'active' : ''}`}
                onClick={() => setActiveMenu(item)}
                style={{ color: activeMenu === item ? '#0ea5e9' : '#475569' }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* TOP UP BUTTON */}
          <button className="topup-btn" onClick={() => alert('Top Up Clicked')}>
            ลงชื่อเข้าใช้
          </button>
        </div>
      </nav>
    </>
  );
}