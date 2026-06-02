export default function Navbar({ activeMenu, setActiveMenu, onLogin }) {
  const menuItems = ['HOME', 'บริการเติมเกม', 'เอเจน', 'ข่าวสาร', 'ติดต่อเรา'];

  return (
    <>
      <style>{`
        .navbar-root {
          position: absolute;
          top: 0; left: 0; right: 0;
          width: 100%; z-index: 100;
          /* gradient จาง ล่างทำให้ข้อความอ่านได้บน hero ทุกโทน */
          background: linear-gradient(to bottom,
            rgba(4, 12, 30, 0.72) 0%,
            rgba(4, 12, 30, 0.18) 70%,
            rgba(4, 12, 30, 0.00) 100%);
          padding-bottom: 18px;
        }

        .nav-btn {
          position: relative; height: 62px;
          padding: 0 17px; font-size: 15px; font-weight: 700;
          letter-spacing: 0.04em;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          border: none; background: none; cursor: pointer;
          color: rgba(255,255,255,0.78);
          transition: color 0.18s ease;
          white-space: nowrap;
          text-shadow: 0 1px 6px rgba(0,0,0,0.45);
        }
        .nav-btn::after {
          content: ''; position: absolute; bottom: 6px; left: 17px; right: 17px;
          height: 2px; background: #00d1ff;
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.2s ease;
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(0,209,255,0.7);
        }
        .nav-btn.active { color: #fff; }
        .nav-btn.active::after { transform: scaleX(1); }
        .nav-btn:hover { color: #fff; }
        .nav-btn:hover::after { transform: scaleX(0.7); }

        .topup-btn {
          background: linear-gradient(135deg, #00d1ff 0%, #0099bb 100%);
          color: #fff; border: none;
          padding: 8px 22px; font-size: 14px; font-weight: 800;
          font-family: 'PSL Chocolate Extra Pro', 'Noto Sans Thai', sans-serif;
          cursor: pointer; transition: all 0.2s ease;
          white-space: nowrap; letter-spacing: 0.04em;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          filter: drop-shadow(0 3px 10px rgba(0,209,255,0.5));
          flex-shrink: 0;
        }
        .topup-btn:hover {
          filter: drop-shadow(0 4px 14px rgba(0,209,255,0.75));
          transform: translateY(-1px);
        }

        .nav-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(0,209,255,0.35));
        }
      `}</style>

      <nav className="navbar-root">
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 32px', height: 62,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* LOGO */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setActiveMenu('HOME')}
          >
            <img
              src="/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo-asset2.png"
              alt="ALASKAN TOPUP"
              className="nav-logo-img"
            />
          </div>

          {/* MENU */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, justifyContent: 'center' }}>
            {menuItems.map(item => (
              <button
                key={item}
                className={`nav-btn ${activeMenu === item ? 'active' : ''}`}
                onClick={() => {
                  if (item === 'ติดต่อเรา') {
                    if (activeMenu === 'HOME') {
                      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setActiveMenu('HOME');
                      setTimeout(() => {
                        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 220);
                    }
                  } else {
                    setActiveMenu(item);
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* LOGIN BUTTON */}
          <button className="topup-btn" onClick={onLogin}>
            ลงชื่อเข้าใช้
          </button>
        </div>
      </nav>
    </>
  );
}
