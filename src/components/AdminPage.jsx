import { useState } from 'react';
import { FiGrid, FiShoppingBag, FiFileText, FiMonitor, FiLogOut } from 'react-icons/fi';
import { INIT_ORDERS, INIT_NEWS } from './admin/adminShared';
import AdminLogin    from './admin/AdminLogin';
import Dashboard     from './admin/AdminDashboard';
import Orders        from './admin/AdminOrders';
import NewsManager   from './admin/AdminNews';
import GamesManager  from './admin/AdminGames';

const NAV_ITEMS = [
  { key: 'dashboard', icon: <FiGrid size={16} />,        label: 'ภาพรวม'  },
  { key: 'orders',    icon: <FiShoppingBag size={16} />,  label: 'ออเดอร์' },
  { key: 'news',      icon: <FiFileText size={16} />,     label: 'ข่าวสาร' },
  { key: 'games',     icon: <FiMonitor size={16} />,      label: 'เกม'     },
];

// TODO [RESPONSIVE]: sidebar 220px fixed จะล้น viewport บน mobile
//                    แนะนำ: hamburger + bottom nav หรือ hide sidebar ด้วย media query
export default function AdminPage({ onHome }) {
  const [authed, setAuthed] = useState(false);
  const [tab,    setTab]    = useState('dashboard');
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [news,   setNews]   = useState(INIT_NEWS);

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} onHome={onHome} />;

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard orders={orders} />;
      case 'orders':    return <Orders orders={orders} setOrders={setOrders} />;
      case 'news':      return <NewsManager news={news} setNews={setNews} />;
      case 'games':     return <GamesManager />;
      default:          return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'inherit' }}>
      <div style={{ width: 220, background: '#1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '2px 0 12px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '26px 20px 16px', borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#f1f5f9', letterSpacing: '0.06em' }}>ALASKAN SHOP</div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 3, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {NAV_ITEMS.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 2, textAlign: 'left', background: tab === key ? 'rgba(0,209,255,0.12)' : 'transparent', color: tab === key ? '#00d1ff' : '#94a3b8', transition: 'all 0.15s ease' }}>
              <span style={{ display: 'flex', filter: tab === key ? 'drop-shadow(0 0 5px rgba(0,209,255,0.7))' : 'none', transition: 'filter 0.2s ease' }}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 10px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {onHome && (
            <button onClick={onHome}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: 'transparent', color: '#64748b', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
              &#9664; กลับหน้าหลัก
            </button>
          )}
          <button onClick={() => setAuthed(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: 'transparent', color: '#64748b', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
            <FiLogOut size={15} /> ออกจากระบบ
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', minWidth: 0 }}>
        {renderContent()}
      </div>
    </div>
  );
}
