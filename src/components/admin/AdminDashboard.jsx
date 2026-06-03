import { FiDollarSign, FiShoppingBag, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { GAMES } from '../../config/games';
import { MAILPASS_GAMES } from '../../config/mailpassGames';
import { OrdersTable } from './AdminOrders';

function StatCard({ icon, label, value, sub, accent, large }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: large ? '22px 26px' : '16px 20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex',
      alignItems: 'center', gap: 16, flex: large ? '1 1 220px' : '1 1 150px',
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: large ? 28 : 22, fontWeight: 900, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard({ orders }) {
  const uidGames  = Object.values(GAMES);
  const mailGames = Object.values(MAILPASS_GAMES);

  const total     = orders.length;
  const pending   = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const revenue   = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.price, 0);

  const uidActive  = uidGames.filter(g => g.packages?.length > 0).length;
  const mailActive = mailGames.filter(g => g.packages?.length > 0).length;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>ภาพรวม</h2>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <StatCard large icon={<FiDollarSign size={22} />}  label="รายได้ทั้งหมด"  value={`฿${revenue.toLocaleString()}`}  sub={`จาก ${completed} ออเดอร์ที่สำเร็จ`}   accent="#00d1ff" />
        <StatCard large icon={<FiShoppingBag size={22} />} label="ออเดอร์ทั้งหมด" value={total}                          sub={`รอดำเนินการ ${pending} รายการ`}          accent="#f59e0b" />
        <StatCard large icon={<FiCheck size={22} />}       label="สำเร็จแล้ว"      value={completed}                      sub={`${total ? Math.round(completed/total*100) : 0}% ของออเดอร์ทั้งหมด`} accent="#10b981" />
        <StatCard large icon={<FiAlertCircle size={22} />} label="รอดำเนินการ"     value={pending}                        sub="ต้องดำเนินการ"                            accent="#ef4444" />
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ flex: '1 1 220px', background: 'rgba(0,209,255,0.07)', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(0,209,255,0.22)' }}>
          <div style={{ fontSize: 11, color: '#00d1ff', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>บริการ UID</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#00b8e0' }}>{uidGames.length}</div><div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>เกมทั้งหมด</div></div>
            <div style={{ width: 1, background: 'rgba(0,209,255,0.2)' }} />
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#10b981' }}>{uidActive}</div><div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>เปิดใช้งาน</div></div>
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#94a3b8' }}>{uidGames.length - uidActive}</div><div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>Coming Soon</div></div>
          </div>
        </div>
        <div style={{ flex: '1 1 220px', background: '#f8fafc', borderRadius: 14, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>บริการ Mail/Pass</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a' }}>{mailGames.length}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>เกมทั้งหมด</div></div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#10b981' }}>{mailActive}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>เปิดใช้งาน</div></div>
            <div><div style={{ fontSize: 26, fontWeight: 900, color: '#94a3b8' }}>{mailGames.length - mailActive}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>Coming Soon</div></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#334155', margin: 0 }}>ออเดอร์ล่าสุด</h3>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>5 รายการล่าสุด</span>
      </div>
      <OrdersTable orders={orders.slice(0, 5)} onStatusChange={null} />
    </div>
  );
}
