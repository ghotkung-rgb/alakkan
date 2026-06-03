import { useState, useMemo } from 'react';
import { FiSearch, FiCheck, FiX, FiRefreshCw, FiClock } from 'react-icons/fi';
import { STATUS_MAP, sTh, sTd, sBtn } from './adminShared';

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export function OrdersTable({ orders, onStatusChange }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={sTh}>รหัสออเดอร์</th>
            <th style={sTh}>เกม / ประเภท</th>
            <th style={sTh}>แพ็กเกจ</th>
            <th style={sTh}>ราคา</th>
            <th style={sTh}>UID / Email</th>
            <th style={sTh}>วันที่</th>
            <th style={sTh}>สถานะ</th>
            {onStatusChange && <th style={sTh}>อัปเดต</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ background: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <td style={sTd}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 5, color: '#475569', fontWeight: 700 }}>{o.id}</span>
              </td>
              <td style={sTd}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{o.game}</div>
                <span style={{ background: o.type === 'UID' ? '#eff6ff' : '#f1f5f9', color: o.type === 'UID' ? '#1d4ed8' : '#475569', padding: '1px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700 }}>{o.type}</span>
              </td>
              <td style={sTd}><span style={{ fontWeight: 600 }}>{o.pkg}</span></td>
              <td style={sTd}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#059669' }}>฿{o.price.toLocaleString()}</span>
              </td>
              <td style={sTd}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: 5 }}>{o.uid}</span>
              </td>
              <td style={sTd}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 12 }}>
                  <FiClock size={11} /> {o.date}
                </div>
              </td>
              <td style={sTd}><StatusBadge status={o.status} /></td>
              {onStatusChange && (
                <td style={sTd}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {o.status !== 'completed' && (
                      <button onClick={() => onStatusChange(o.id, 'completed')}
                        style={{ ...sBtn, background: '#f0fdf4', color: '#166534', padding: '4px 10px', fontSize: 11, border: '1px solid #bbf7d0' }}>
                        <FiCheck size={11} /> สำเร็จ
                      </button>
                    )}
                    {o.status !== 'processing' && o.status !== 'completed' && (
                      <button onClick={() => onStatusChange(o.id, 'processing')}
                        style={{ ...sBtn, background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', fontSize: 11, border: '1px solid #bfdbfe' }}>
                        <FiRefreshCw size={11} /> กำลังทำ
                      </button>
                    )}
                    {o.status !== 'failed' && (
                      <button onClick={() => onStatusChange(o.id, 'failed')}
                        style={{ ...sBtn, background: '#fef2f2', color: '#991b1b', padding: '4px 10px', fontSize: 11, border: '1px solid #fecaca' }}>
                        <FiX size={11} /> ล้มเหลว
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={9} style={{ ...sTd, textAlign: 'center', color: '#94a3b8', padding: '40px' }}>ไม่พบรายการ</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Orders({ orders, setOrders }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    // TODO: PUT /api/orders/:id  { status: newStatus }
  };

  const filtered = useMemo(() => orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || [o.id, o.game, o.uid, o.pkg].some(v => v.toLowerCase().includes(search.toLowerCase()))),
    [orders, filter, search]
  );

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    failed: orders.filter(o => o.status === 'failed').length,
  }), [orders]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>จัดการออเดอร์</h2>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{filtered.length} รายการ</span>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['all','ทั้งหมด'], ['pending','รอดำเนินการ'], ['processing','กำลังดำเนินการ'], ['completed','สำเร็จ'], ['failed','ล้มเหลว']].map(([key, label]) => {
          const active = filter === key;
          const s = STATUS_MAP[key];
          return (
            <button key={key} onClick={() => setFilter(key)}
              style={{
                ...sBtn, padding: '6px 14px', fontSize: 12,
                background: active ? (s ? s.bg : '#1e293b') : '#f8fafc',
                color: active ? (s ? s.color : '#fff') : '#64748b',
                border: `1.5px solid ${active ? (s ? s.border : '#1e293b') : '#e2e8f0'}`,
              }}>
              {label}
              <span style={{ background: active ? 'rgba(0,0,0,0.1)' : '#e2e8f0', color: active ? 'inherit' : '#64748b', borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 800 }}>
                {counts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <FiSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหา รหัสออเดอร์ / ชื่อเกม / UID / Email..."
          style={{ ...{ border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }, paddingLeft: 36 }} />
      </div>

      <OrdersTable orders={filtered} onStatusChange={handleStatusChange} />
    </div>
  );
}
