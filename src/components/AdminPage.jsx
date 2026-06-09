// TODO [API] เมื่อ backend พร้อม: เพิ่ม useEffect import และ uncomment บล็อก API ด้านล่าง
import { useState } from 'react';
import { FiGrid, FiShoppingBag, FiFileText, FiMonitor, FiLogOut, FiChevronLeft, FiCreditCard } from 'react-icons/fi';
// TODO [API] ลบ INIT_ORDERS, INIT_NEWS ออกเมื่อดึงข้อมูลจาก API แล้ว
import { INIT_ORDERS, INIT_NEWS } from './admin/adminShared';
// TODO [API] uncomment บรรทัดด้านล่าง:
// import { getOrders } from '../services/topupService';
import AdminLogin      from './admin/AdminLogin';
import Dashboard       from './admin/AdminDashboard';
import Orders          from './admin/AdminOrders';
import NewsManager     from './admin/AdminNews';
import GamesManager    from './admin/AdminGames';
import PaymentManager  from './admin/AdminPayment';

const NAV_ITEMS = [
  { key: 'dashboard', icon: <FiGrid size={18} />,        label: 'ภาพรวม'   },
  { key: 'games',     icon: <FiMonitor size={18} />,     label: 'เกม'      },
  { key: 'orders',    icon: <FiShoppingBag size={18} />, label: 'ออเดอร์'  },
  { key: 'payment',   icon: <FiCreditCard size={18} />,  label: 'ชำระเงิน' },
  { key: 'news',      icon: <FiFileText size={18} />,    label: 'ข่าวสาร'  },
];

export default function AdminPage({ onHome }) {
  const [authed, setAuthed] = useState(true); // DEV: ข้ามหน้า login ไปก่อน
  const [tab,    setTab]    = useState('games');
  // TODO [API] เมื่อ getOrders() พร้อม: เปลี่ยน useState(INIT_ORDERS) → useState([])
  //   แล้วเพิ่ม useEffect ด้านล่างนี้ (ต้อง import useEffect ก่อน):
  //   useEffect(() => {
  //     if (!authed) return;
  //     getOrders().then(setOrders);
  //   }, [authed]);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [news,   setNews]   = useState(INIT_NEWS);

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} onHome={onHome} />;

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard orders={orders} />;
      case 'orders':    return <Orders orders={orders} setOrders={setOrders} />;
      case 'news':      return <NewsManager news={news} setNews={setNews} />;
      case 'games':     return <GamesManager />;
      case 'payment':   return <PaymentManager />;
      default:          return null;
    }
  };

  const TAB_LABELS = { dashboard: 'ภาพรวม', games: 'จัดการเกม', orders: 'ออเดอร์', payment: 'ชำระเงิน', news: 'ข่าวสาร' };

  return (
    <>
      <style>{`
        .adm-root {
          display: flex; min-height: 100vh;
          background: #f0f4f8; font-family: inherit;
        }
        .adm-sidebar {
          width: 220px; background: #0f172a;
          display: flex; flex-direction: column;
          flex-shrink: 0;
          box-shadow: 2px 0 16px rgba(0,0,0,0.22);
          position: relative; z-index: 10;
          transition: width 0.22s ease;
        }
        .adm-sidebar::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 1px; height: 100%;
          background: linear-gradient(to bottom, rgba(0,209,255,0.22), transparent 60%);
          pointer-events: none;
        }
        .adm-brand {
          padding: 22px 18px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .adm-brand-name {
          font-size: 14px; font-weight: 900; color: #f1f5f9;
          letter-spacing: 0.08em;
        }
        .adm-brand-sub {
          font-size: 10px; color: #00d1ff; margin-top: 3px;
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          opacity: 0.75;
        }
        .adm-nav { flex: 1; padding: 10px 10px; }
        .adm-nav-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px;
          border-radius: 8px; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600; margin-bottom: 2px;
          text-align: left; transition: all 0.15s ease;
          font-family: inherit;
          white-space: nowrap; overflow: hidden;
        }
        .adm-nav-btn.active {
          background: rgba(0,209,255,0.13);
          color: #00d1ff;
          box-shadow: inset 2px 0 0 #00d1ff;
        }
        .adm-nav-btn:not(.active) { background: transparent; color: #94a3b8; }
        .adm-nav-btn:not(.active):hover { background: rgba(255,255,255,0.05); color: #cbd5e1; }
        .adm-nav-icon {
          flex-shrink: 0;
          filter: none; transition: filter 0.2s;
        }
        .adm-nav-btn.active .adm-nav-icon {
          filter: drop-shadow(0 0 5px rgba(0,209,255,0.7));
        }
        .adm-nav-label { flex: 1; }
        .adm-footer {
          padding: 10px 10px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 2px;
        }
        .adm-footer-btn {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 9px 12px;
          border-radius: 8px; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600;
          background: transparent; transition: all 0.15s; font-family: inherit;
          white-space: nowrap; overflow: hidden;
        }
        .adm-content { flex: 1; min-width: 0; overflow-y: auto; }
        .adm-content-header {
          background: #fff;
          padding: 16px 28px 14px;
          border-bottom: 1.5px solid #e2e8f0;
          display: flex; align-items: center; gap: 10;
        }
        .adm-content-title {
          font-size: 18px; font-weight: 900; color: #0f172a;
        }
        .adm-content-body { padding: 24px 28px; }

        /* ── Tablet responsive ── */
        @media (max-width: 900px) {
          .adm-sidebar { width: 60px; }
          .adm-brand-name, .adm-brand-sub { display: none; }
          .adm-brand { padding: 16px 12px; display: flex; align-items: center; justify-content: center; }
          .adm-nav-label { display: none; }
          .adm-nav-btn { justify-content: center; padding: 11px 0; }
          .adm-footer-btn { justify-content: center; padding: 10px 0; }
          .adm-footer-btn span { display: none; }
          .adm-content-body { padding: 16px 16px; }
          .adm-content-header { padding: 14px 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .adm-sidebar, .adm-nav-btn, .adm-footer-btn { transition: none; }
        }
      `}</style>

      <div className="adm-root">
        {/* Sidebar */}
        <div className="adm-sidebar">
          <div className="adm-brand">
            <div className="adm-brand-name">ALASKAN SHOP</div>
            <div className="adm-brand-sub">Admin Panel</div>
          </div>

          <nav className="adm-nav">
            {NAV_ITEMS.map(({ key, icon, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`adm-nav-btn${tab === key ? ' active' : ''}`}>
                <span className="adm-nav-icon">{icon}</span>
                <span className="adm-nav-label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="adm-footer">
            {onHome && (
              <button className="adm-footer-btn"
                style={{ color: '#64748b' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                onClick={onHome}>
                <FiChevronLeft size={16} />
                <span>กลับหน้าหลัก</span>
              </button>
            )}
            <button className="adm-footer-btn"
              style={{ color: '#64748b' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
              onClick={() => setAuthed(false)}>
              <FiLogOut size={16} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="adm-content">
          <div className="adm-content-header">
            <div className="adm-content-title">{TAB_LABELS[tab]}</div>
          </div>
          <div className="adm-content-body">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
