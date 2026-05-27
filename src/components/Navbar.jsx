import React from 'react';

export default function Navbar({ activeMenu, setActiveMenu }) {
  const menuItems = ['HOME', 'บริการเติมเกม',  'ข่าวสาร', 'ติดต่อเรา'];

  return (
    <>
      <style>{`
        .navbar-root {
          position: static;
          width: 100%; z-index: 50;
        }
        .nav-btn {
          position: relative; height: 100%;
          padding: 0 18px; font-size: 16px; font-weight: 700;
          letter-spacing: 0.03em;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          border: none; background: none; cursor: pointer;
          transition: color 0.15s ease;
          white-space: nowrap;
        }
        .nav-btn::after {
          content: ''; position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 2.5px; background: #00d1ff;
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.2s ease;
          border-radius: 2px;
        }
        .nav-btn.active { color: #00d1ff; }
        .nav-btn.active::after { transform: scaleX(1); }
        .nav-btn:hover { color: #00b8e0; }
        .nav-btn:hover::after { transform: scaleX(1); }

        .topup-btn {
          background: linear-gradient(135deg, #00d1ff, #00a3cc);
          color: #fff; border: none;
          padding: 9px 22px; font-size: 15px; font-weight: 700;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          cursor: pointer; transition: all 0.2s ease;
          white-space: nowrap;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          box-shadow: 0 4px 14px rgba(0,209,255,0.35);
          letter-spacing: 0.02em;
        }
        .topup-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .nav-logo-brand {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 20px; font-weight: 900;
          letter-spacing: 0.05em;
        }
        .nav-logo-sub {
          font-family: 'PSL Kampanath Pro', sans-serif;
          font-size: 18px; font-weight: 900;
          letter-spacing: 0.05em; color: #0f172a;
        }
      `}</style>

      <nav
        className="navbar-root"
        style={{
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 32px', height: 62,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* LOGO */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setActiveMenu('HOME')}
          >
            <div style={{
              background: '#00d1ff', color: '#fff',
              padding: '4px 14px', borderRadius: 6,
            }}>
              <span className="nav-logo-brand">ALASKAN</span>
            </div>
            <span className="nav-logo-sub">SHOP</span>
          </div>

          {/* MENU */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, justifyContent: 'center' }}>
            {menuItems.map(item => (
              <button
                key={item}
                className={`nav-btn ${activeMenu === item ? 'active' : ''}`}
                onClick={() => setActiveMenu(item)}
                style={{ color: activeMenu === item ? '#00d1ff' : '#475569' }}
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