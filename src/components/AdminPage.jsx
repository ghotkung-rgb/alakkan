import React, { useState, useMemo } from 'react';
import {
  FiGrid, FiShoppingBag, FiFileText, FiMonitor,
  FiLogOut, FiLock, FiEye, FiEyeOff,
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX,
  FiSearch, FiDollarSign, FiAlertCircle,
  FiPackage, FiMail, FiSend, FiTag, FiImage,
  FiTrendingUp, FiZap, FiCopy, FiClock,
  FiChevronDown, FiChevronUp, FiRefreshCw,
} from 'react-icons/fi';
import { GAMES } from '../config/games';
import { MAILPASS_GAMES } from '../config/mailpassGames';

// ─── auth ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'ADMIN2025';

// ─── mock orders ─────────────────────────────────────────────────────────────
const INIT_ORDERS = [
  { id: 'ORD-001', game: 'ROV',         type: 'UID',       pkg: '555 คูปอง',      price: 435,  uid: '112233445',      status: 'pending',    date: '2026-05-31 10:23' },
  { id: 'ORD-002', game: 'Free Fire',   type: 'UID',       pkg: '530 ไดมอนด์',   price: 299,  uid: '998877665',      status: 'completed',  date: '2026-05-31 09:15' },
  { id: 'ORD-003', game: 'FC Mobile',   type: 'Mail/Pass', pkg: '2200 FC Points', price: 399,  uid: 'user@gmail.com', status: 'processing', date: '2026-05-31 08:44' },
  { id: 'ORD-004', game: 'PUBG Mobile', type: 'UID',       pkg: '325 UC',         price: 119,  uid: '555000111',      status: 'failed',     date: '2026-05-30 22:10' },
  { id: 'ORD-005', game: 'ROV',         type: 'UID',       pkg: '185 คูปอง',      price: 145,  uid: '777888999',      status: 'pending',    date: '2026-05-30 20:05' },
  { id: 'ORD-006', game: 'eFootball',   type: 'Mail/Pass', pkg: '1000 Coin',      price: 180,  uid: 'admin@mail.com', status: 'completed',  date: '2026-05-30 18:30' },
];

// ─── mock news ────────────────────────────────────────────────────────────────
const INIT_NEWS = [
  { id: 1, title: 'โปรโมชั่น ROV เดือนมิถุนายน',  content: 'รับโบนัสพิเศษเมื่อเติมเพชร ROV ครบ 100 บาท พร้อมรับสกินพิเศษ!', image: '', imagePosition: 50, isHot: true,  date: '2026-05-31' },
  { id: 2, title: 'เปิดให้บริการ FC Mobile แล้ว!', content: 'เติม FC Points ง่ายๆ ผ่านเว็บ ALASKAN SHOP ราคาถูกที่สุด',         image: '', imagePosition: 50, isHot: false, date: '2026-05-30' },
  { id: 3, title: 'ระบบปิดปรับปรุง 1 มิ.ย.',        content: 'ระบบจะปิดให้บริการชั่วคราวระหว่าง 00:00–02:00 น.',                image: '', imagePosition: 50, isHot: false, date: '2026-05-29' },
];

// ─── constants ────────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:    { bg: '#fff8e6', color: '#b45309', border: '#fde68a', label: 'รอดำเนินการ' },
  processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'กำลังดำเนินการ' },
  completed:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', label: 'สำเร็จ' },
  failed:     { bg: '#fef2f2', color: '#991b1b', border: '#fecaca', label: 'ล้มเหลว' },
};

const AVAILABLE_TAGS = [
  { key: 'ขายดี',     label: 'ขายดี',     Icon: FiTrendingUp, color: '#f59e0b' },
  { key: 'ใหม่',      label: 'ใหม่',      Icon: FiZap,        color: '#10b981' },
  { key: 'โปรโมชั่น', label: 'โปรโมชั่น', Icon: FiTag,        color: '#ef4444' },
];

// ─── shared styles ────────────────────────────────────────────────────────────
const sTh = { padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', letterSpacing: '0.06em', textTransform: 'uppercase' };
const sTd = { padding: '12px 14px', fontSize: 13, color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };
const sInput = { border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' };
const sBtn   = { border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s ease' };
const sBtnCyan = { ...sBtn, borderRadius: 0, clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)', background: '#00d1ff', color: '#0f172a', fontWeight: 700, boxShadow: '0 2px 12px rgba(0,209,255,0.28)' };
const sIconBtn = { border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 8px', background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s ease' };

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  1. DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
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

function Dashboard({ orders }) {
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

      {/* Revenue + Orders */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <StatCard large icon={<FiDollarSign size={22} />}  label="รายได้ทั้งหมด"  value={`฿${revenue.toLocaleString()}`}  sub={`จาก ${completed} ออเดอร์ที่สำเร็จ`}   accent="#00d1ff" />
        <StatCard large icon={<FiShoppingBag size={22} />} label="ออเดอร์ทั้งหมด" value={total}                          sub={`รอดำเนินการ ${pending} รายการ`}          accent="#f59e0b" />
        <StatCard large icon={<FiCheck size={22} />}       label="สำเร็จแล้ว"      value={completed}                      sub={`${total ? Math.round(completed/total*100) : 0}% ของออเดอร์ทั้งหมด`} accent="#10b981" />
        <StatCard large icon={<FiAlertCircle size={22} />} label="รอดำเนินการ"     value={pending}                        sub="ต้องดำเนินการ"                            accent="#ef4444" />
      </div>

      {/* Games count */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ flex: '1 1 220px', background: 'rgba(0,209,255,0.07)', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(0,209,255,0.22)' }}>
          <div style={{ fontSize: 11, color: '#00d1ff', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>บริการ UID</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#00b8e0' }}>{uidGames.length}</div>
              <div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>เกมทั้งหมด</div>
            </div>
            <div style={{ width: 1, background: 'rgba(0,209,255,0.2)' }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#10b981' }}>{uidActive}</div>
              <div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>เปิดใช้งาน</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#94a3b8' }}>{uidGames.length - uidActive}</div>
              <div style={{ fontSize: 11, color: 'rgba(0,209,255,0.65)' }}>Coming Soon</div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 220px', background: '#f5f3ff', borderRadius: 14, padding: '16px 20px', border: '1px solid #e9d5ff' }}>
          <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>บริการ Mail/Pass</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#5b21b6' }}>{mailGames.length}</div>
              <div style={{ fontSize: 11, color: '#a78bfa' }}>เกมทั้งหมด</div>
            </div>
            <div style={{ width: 1, background: '#ddd6fe' }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#10b981' }}>{mailActive}</div>
              <div style={{ fontSize: 11, color: '#a78bfa' }}>เปิดใช้งาน</div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#94a3b8' }}>{mailGames.length - mailActive}</div>
              <div style={{ fontSize: 11, color: '#a78bfa' }}>Coming Soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#334155', margin: 0 }}>ออเดอร์ล่าสุด</h3>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>5 รายการล่าสุด</span>
      </div>
      <OrdersTable orders={orders.slice(0, 5)} onStatusChange={null} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  2. ORDERS
// ══════════════════════════════════════════════════════════════════════════════
function OrdersTable({ orders, onStatusChange }) {
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
            <tr key={o.id} style={{ background: '#fff' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <td style={sTd}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 5, color: '#475569', fontWeight: 700 }}>{o.id}</span>
              </td>
              <td style={sTd}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{o.game}</div>
                <span style={{ background: o.type === 'UID' ? '#eff6ff' : '#f5f3ff', color: o.type === 'UID' ? '#1d4ed8' : '#6d28d9', padding: '1px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700 }}>{o.type}</span>
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

function Orders({ orders, setOrders }) {
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

      {/* Filter tabs */}
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

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <FiSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหา รหัสออเดอร์ / ชื่อเกม / UID / Email..."
          style={{ ...sInput, paddingLeft: 36 }} />
      </div>

      <OrdersTable orders={filtered} onStatusChange={handleStatusChange} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  3. NEWS
// ══════════════════════════════════════════════════════════════════════════════
function ImagePickerInline({ label, src, position, onSrcChange, onPositionChange }) {
  const ref = React.useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onSrcChange(URL.createObjectURL(file));
    // TODO: POST /api/upload FormData({ file }) → { url }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* preview */}
      {src && (
        <div style={{ width: '100%', height: 120, borderRadius: 10, overflow: 'hidden', background: '#0f172a', border: '1px solid #e2e8f0', position: 'relative' }}>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${position}%` }} />
          <button onClick={() => onSrcChange('')}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: 6, padding: '3px 6px', cursor: 'pointer', color: '#fff', display: 'flex' }}>
            <FiX size={12} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="button" onClick={() => ref.current.click()}
          style={{ ...sBtn, background: '#f1f5f9', color: '#475569', fontSize: 12, padding: '6px 14px', border: '1px solid #e2e8f0', flexShrink: 0 }}>
          <FiImage size={12} /> {src ? 'เปลี่ยนรูป' : 'เพิ่มรูป'}
        </button>
        {src && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiChevronUp size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input type="range" min={0} max={100} value={position}
              onChange={e => onPositionChange(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#00d1ff', cursor: 'pointer' }} />
            <FiChevronDown size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#94a3b8', width: 28, flexShrink: 0 }}>{position}%</span>
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {src && <div style={{ fontSize: 10, color: '#94a3b8' }}>เลื่อน slider เพื่อปรับตำแหน่งภาพขึ้น/ลง</div>}
    </div>
  );
}

function NewsForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item ?? {
    title: '', content: '', image: '', imagePosition: 50, isHot: false,
    date: new Date().toISOString().slice(0, 10),
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '20px 22px', marginBottom: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#0f172a' }}>{item ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="หัวข้อข่าว *" style={sInput} />
        <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="เนื้อหาข่าว *" rows={3}
          style={{ ...sInput, resize: 'vertical' }} />

        {/* Image */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10 }}>รูปภาพประกอบ</div>
          <ImagePickerInline
            label="รูปภาพ"
            src={form.image}
            position={form.imagePosition}
            onSrcChange={url => set('image', url)}
            onPositionChange={v => set('imagePosition', v)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={form.isHot} onChange={e => set('isHot', e.target.checked)} style={{ accentColor: '#ef4444', width: 15, height: 15 }} />
            แสดง HOT badge
          </label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ ...sInput, width: 'auto' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { if (!form.title || !form.content) return alert('กรุณากรอกหัวข้อและเนื้อหา'); onSave(form); }}
            style={sBtnCyan}><FiCheck size={14} /> บันทึก</button>
          <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
}

function NewsManager({ news, setNews }) {
  const [editing, setEditing] = useState(null);

  const handleSave = (form) => {
    if (editing === 'new') {
      setNews(prev => [{ ...form, id: Date.now() }, ...prev]);
      // TODO: POST /api/news  { ...form }
    } else {
      setNews(prev => prev.map(n => n.id === editing ? { ...form, id: editing } : n));
      // TODO: PUT /api/news/:editing  { ...form }
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบข่าวนี้?')) return;
    setNews(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>จัดการข่าวสาร</h2>
        <button onClick={() => setEditing('new')} style={sBtnCyan}>
          <FiPlus size={14} /> เพิ่มข่าว
        </button>
      </div>
      {editing === 'new' && <NewsForm onSave={handleSave} onCancel={() => setEditing(null)} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {news.map(n => (
          <div key={n.id}>
            {editing === n.id
              ? <NewsForm item={n} onSave={handleSave} onCancel={() => setEditing(null)} />
              : (
                <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex' }}>
                  {/* image strip */}
                  {n.image && (
                    <div style={{ width: 90, flexShrink: 0, background: '#0f172a', overflow: 'hidden' }}>
                      <img src={n.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${n.imagePosition ?? 50}%` }} />
                    </div>
                  )}
                  <div style={{ flex: 1, padding: '14px 18px', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                      {n.title}
                      {n.isHot && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10 }}>HOT</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.content}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FiClock size={10} /> {n.date}
                      {n.image && <span style={{ marginLeft: 8, color: '#60a5fa', fontSize: 10 }}>มีรูปภาพ</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 14px', flexShrink: 0, justifyContent: 'center' }}>
                    <button onClick={() => setEditing(n.id)} style={{ ...sIconBtn, color: '#00d1ff' }} title="แก้ไข"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(n.id)} style={{ ...sIconBtn, color: '#ef4444' }} title="ลบ"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              )
            }
          </div>
        ))}
        {news.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>ยังไม่มีข่าวสาร</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  4. GAMES
// ══════════════════════════════════════════════════════════════════════════════
function ImagePickerField({ label, src, onChange }) {
  const ref = React.useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
    // TODO: POST /api/upload FormData({ file }) → { url }
  };
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e8edf4', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 9, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {src
            ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
            : <FiImage size={20} style={{ color: '#cbd5e1' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src || 'ยังไม่มีรูป'}</div>
          <button type="button" onClick={() => ref.current.click()}
            style={{ ...sBtn, background: '#fff', color: '#475569', fontSize: 12, padding: '4px 12px', border: '1px solid #e2e8f0' }}>
            <FiImage size={12} /> เลือกรูป
          </button>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

function TagToggles({ tags, onChange }) {
  const toggle = (key) => {
    const next = tags.includes(key) ? tags.filter(t => t !== key) : [...tags, key];
    onChange(next);
  };
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>แท็ก</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {AVAILABLE_TAGS.map(({ key, label, Icon, color }) => {
          const active = tags.includes(key);
          return (
            <button key={key} type="button" onClick={() => toggle(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${active ? color : '#e2e8f0'}`,
                background: active ? color + '15' : '#fff',
                color: active ? color : '#94a3b8',
                transition: 'all 0.15s ease',
              }}>
              <Icon size={12} /> {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GameEditPanel({ game, overrides, onSave, onCancel }) {
  const [name,    setName]    = useState(overrides?.name ?? game.name);
  const [iconSrc, setIconSrc] = useState(overrides?.icon ?? game.icon ?? '');
  const [bgSrc,   setBgSrc]   = useState(overrides?.bg   ?? game.bg   ?? '');
  const [tags,    setTags]    = useState(overrides?.tags ?? game.tags  ?? []);

  return (
    <div style={{ background: '#fff', border: '2px solid rgba(0,209,255,0.25)', borderRadius: 14, padding: '20px 22px', marginTop: 2, marginBottom: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <FiEdit2 size={15} style={{ color: '#00d1ff' }} />
        <span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>แก้ไข — {game.name}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม</div>
          <input value={name} onChange={e => setName(e.target.value)} style={sInput} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Icon (รูปไอคอน)" src={iconSrc} onChange={setIconSrc} /></div>
          <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Background (รูปพื้นหลัง)" src={bgSrc} onChange={setBgSrc} /></div>
        </div>
        <TagToggles tags={tags} onChange={setTags} />
        <div style={{ fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiAlertCircle size={11} /> รูปที่อัปโหลดจะแสดงเฉพาะ session นี้ — กด "แจ้งเดฟ" เพื่อส่งให้นักพัฒนาบันทึกถาวร
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onSave(game.id, { name, icon: iconSrc, bg: bgSrc, tags })}
            style={sBtnCyan}><FiCheck size={14} /> บันทึก</button>
          <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}><FiX size={14} /> ยกเลิก</button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_GAME = { name: '', category: '', currency: '', icon: '', bg: '', tags: [] };
function AddGameForm({ onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_GAME);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={{ background: '#fff', border: '2px dashed #93c5fd', borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <FiPlus size={15} style={{ color: '#00d1ff' }} />
        <span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>เพิ่มเกมใหม่</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>* กด "แจ้งเดฟ" เพื่อส่งข้อมูลให้นักพัฒนา</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
        <div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม *</div><input value={form.name} onChange={e => set('name', e.target.value)} style={sInput} placeholder="เช่น Mobile Legends" /></div>
        <div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>หมวดหมู่</div><input value={form.category} onChange={e => set('category', e.target.value)} style={sInput} placeholder="เช่น เกม MOBA" /></div>
        <div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>สกุลเงิน</div><input value={form.currency} onChange={e => set('currency', e.target.value)} style={sInput} placeholder="เช่น Diamond" /></div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Icon" src={form.icon} onChange={url => set('icon', url)} /></div>
        <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Background" src={form.bg} onChange={url => set('bg', url)} /></div>
      </div>
      <div style={{ marginBottom: 18 }}><TagToggles tags={form.tags} onChange={t => set('tags', t)} /></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { if (!form.name.trim()) return alert('กรุณากรอกชื่อเกม'); onAdd({ ...form, id: 'NEW_' + Date.now(), packages: [] }); }}
          style={sBtnCyan}><FiPlus size={14} /> เพิ่มเกม</button>
        <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}><FiX size={14} /> ยกเลิก</button>
      </div>
    </div>
  );
}

function NotifyDevModal({ overrides, newGames, onClose }) {
  const [copied, setCopied] = useState(false);
  const lines = [];
  if (Object.keys(overrides).length > 0) {
    lines.push('=== แก้ไขเกมที่มีอยู่ ===');
    Object.entries(overrides).forEach(([id, d]) => {
      lines.push(`\n[ ${id} ]`);
      if (d.name)  lines.push(`  ชื่อ: ${d.name}`);
      if (d.icon)  lines.push(`  icon: ${d.icon}`);
      if (d.bg)    lines.push(`  bg: ${d.bg}`);
      if (d.tags)  lines.push(`  tags: [${d.tags.join(', ')}]`);
    });
  }
  if (newGames.length > 0) {
    lines.push('\n=== เกมใหม่ที่ต้องเพิ่ม ===');
    newGames.forEach((g, i) => {
      lines.push(`\n[${i + 1}] ${g.name}`);
      if (g.category) lines.push(`  category: ${g.category}`);
      if (g.currency) lines.push(`  currency: ${g.currency}`);
      if (g.tags?.length) lines.push(`  tags: [${g.tags.join(', ')}]`);
    });
  }
  const text = lines.join('\n') || 'ยังไม่มีรายการที่ต้องแจ้ง';
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 540, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ background: '#1e293b', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiSend size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>แจ้งนักพัฒนา</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><FiX size={18} /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>คัดลอกข้อความด้านล่างส่งให้ dev ค่ะ</div>
          <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', fontSize: 12, color: '#334155', overflowY: 'auto', maxHeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.7, fontFamily: 'monospace' }}>{text}</pre>
        </div>
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 10 }}>
          <button onClick={handleCopy} style={{ ...(copied ? { ...sBtnCyan, background: '#10b981', color: '#fff', boxShadow: 'none' } : sBtnCyan), flex: 1, justifyContent: 'center' }}>
            {copied ? <><FiCheck size={14} /> คัดลอกแล้ว!</> : <><FiCopy size={14} /> คัดลอก</>}
          </button>
          <button onClick={onClose} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

function GamesManager() {
  const [gameTab,    setGameTab]    = useState('uid');
  const [editing,    setEditing]    = useState(null);
  const [overrides,  setOverrides]  = useState({});
  const [newGames,   setNewGames]   = useState([]);
  const [adding,     setAdding]     = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const uidList   = Object.values(GAMES);
  const mailList  = Object.values(MAILPASS_GAMES);
  const baseList  = gameTab === 'uid' ? uidList : mailList;
  const tabNewGames = newGames.filter(g => g._type === gameTab);
  const list = [...baseList, ...tabNewGames];

  const pendingCount = Object.keys(overrides).length + newGames.length;

  const handleSave = (gameId, data) => { setOverrides(prev => ({ ...prev, [gameId]: data })); setEditing(null); };
  const handleAddGame = (game) => { setNewGames(prev => [...prev, { ...game, _type: gameTab }]); setAdding(false); };

  const getDisplay = (game) => {
    const ov = overrides[game.id];
    return { name: ov?.name ?? game.name, icon: ov?.icon ?? game.icon ?? '', bg: ov?.bg ?? game.bg ?? '', tags: ov?.tags ?? game.tags ?? [] };
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>จัดการเกม</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setAdding(a => !a); setEditing(null); }}
            style={{ ...(adding ? { ...sBtn, background: '#f1f5f9', color: '#475569' } : sBtnCyan) }}>
            <FiPlus size={14} /> เพิ่มเกมใหม่
          </button>
          <button onClick={() => setShowNotify(true)}
            style={{ ...sBtn, background: pendingCount > 0 ? '#1e293b' : '#f1f5f9', color: pendingCount > 0 ? '#fff' : '#94a3b8', position: 'relative' }}>
            <FiSend size={14} /> แจ้งเดฟ
            {pendingCount > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {adding && <AddGameForm onAdd={handleAddGame} onCancel={() => setAdding(false)} />}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['uid', <FiMonitor size={14} />, `บริการ UID (${uidList.length})`, '#00d1ff', '#0f172a'], ['mail', <FiMail size={14} />, `บริการ Mail/Pass (${mailList.length})`, '#7c3aed', '#fff']].map(([key, icon, label, accent, textCol]) => (
          <button key={key} onClick={() => { setGameTab(key); setEditing(null); setAdding(false); }}
            style={{ ...sBtn, borderRadius: gameTab === key ? 0 : 8, clipPath: gameTab === key ? 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)' : 'none', background: gameTab === key ? accent : '#f1f5f9', color: gameTab === key ? textCol : '#475569', fontWeight: gameTab === key ? 700 : 600 }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={sTh}>เกม</th><th style={sTh}>หมวด</th><th style={sTh}>Currency</th>
              <th style={sTh}>แพ็กเกจ</th><th style={sTh}>แท็ก</th><th style={sTh}>สถานะ</th><th style={sTh}>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {list.map(g => {
              const d = getDisplay(g);
              const hasOv = !!overrides[g.id];
              const isNew = g.id?.startsWith('NEW_');
              const hasPackages = g.packages && g.packages.length > 0;
              return (
                <React.Fragment key={g.id}>
                  <tr style={{ background: editing === g.id ? 'rgba(0,209,255,0.06)' : '#fff' }}
                    onMouseEnter={e => { if (editing !== g.id) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if (editing !== g.id) e.currentTarget.style.background = '#fff'; }}>
                    <td style={sTd}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden', border: hasOv ? '2px solid #00d1ff' : '1px solid #e2e8f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {d.icon ? <img src={d.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} /> : <FiImage size={14} style={{ color: '#cbd5e1' }} />}
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{d.name}</div>
                          {(hasOv || isNew) && <div style={{ fontSize: 10, color: isNew ? '#10b981' : '#00d1ff', fontWeight: 700 }}>{isNew ? '+ เกมใหม่' : '● แก้ไขแล้ว'}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={sTd}><span style={{ fontSize: 12, color: '#64748b' }}>{g.category}</span></td>
                    <td style={sTd}><span style={{ fontSize: 12 }}>{g.currency}</span></td>
                    <td style={sTd}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0fdf4', color: '#166534', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        <FiPackage size={11} /> {g.packages?.length ?? 0}
                      </span>
                    </td>
                    <td style={sTd}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {d.tags.length > 0
                          ? d.tags.map(t => { const td = AVAILABLE_TAGS.find(x => x.key === t); return <span key={t} style={{ background: (td?.color ?? '#6366f1') + '18', color: td?.color ?? '#6366f1', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{t}</span>; })
                          : <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>}
                      </div>
                    </td>
                    <td style={sTd}>
                      <span style={{ background: hasPackages ? '#dcfce7' : '#fef9c3', color: hasPackages ? '#166534' : '#854d0e', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        {hasPackages ? 'เปิดใช้งาน' : 'Coming Soon'}
                      </span>
                    </td>
                    <td style={sTd}>
                      {!isNew && (
                        <button onClick={() => setEditing(editing === g.id ? null : g.id)}
                          style={{ ...sIconBtn, color: editing === g.id ? '#00d1ff' : '#64748b', background: editing === g.id ? 'rgba(0,209,255,0.08)' : '#fff', border: editing === g.id ? '1px solid rgba(0,209,255,0.35)' : '1px solid #e2e8f0' }}>
                          <FiEdit2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                  {editing === g.id && (
                    <tr><td colSpan={7} style={{ padding: '0 14px 14px' }}>
                      <GameEditPanel game={g} overrides={overrides[g.id]} onSave={handleSave} onCancel={() => setEditing(null)} />
                    </td></tr>
                  )}
                </React.Fragment>
              );
            })}
            {list.length === 0 && <tr><td colSpan={7} style={{ ...sTd, textAlign: 'center', color: '#94a3b8', padding: 32 }}>ไม่มีข้อมูลเกม</td></tr>}
          </tbody>
        </table>
      </div>
      {showNotify && <NotifyDevModal overrides={overrides} newGames={newGames} onClose={() => setShowNotify(false)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PASSWORD GATE
// ══════════════════════════════════════════════════════════════════════════════
function PasswordGate({ onAuth, onHome }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr(true); setPw(''); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}
        style={{ background: '#fff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00d1ff', boxShadow: '0 0 0 6px rgba(0,209,255,0.1)' }}>
            <FiLock size={26} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Admin Panel</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: 600, letterSpacing: '0.08em' }}>ALASKAN SHOP</div>
        </div>
        <div style={{ position: 'relative' }}>
          <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
            placeholder="รหัสผ่าน" autoFocus
            style={{ ...sInput, paddingRight: 44, border: err ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', transition: 'border-color 0.2s', fontSize: 15, borderRadius: 10, outline: 'none' }}
          onFocus={e => { if (!err) e.target.style.borderColor = '#00d1ff'; }}
          onBlur={e => { if (!err) e.target.style.borderColor = '#e2e8f0'; }} />
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {err && <div style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', marginTop: -8 }}>รหัสผ่านไม่ถูกต้อง</div>}
        <button type="submit"
          style={{ ...sBtnCyan, justifyContent: 'center', padding: '13px', fontSize: 15, fontWeight: 800, width: '100%' }}>
          เข้าสู่ระบบ
        </button>
        {onHome && (
          <button type="button" onClick={onHome}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13, fontWeight: 600, textAlign: 'center', padding: '4px 0', fontFamily: 'inherit' }}>
            &#9664; กลับหน้าหลัก
          </button>
        )}
      </form>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { key: 'dashboard', icon: <FiGrid size={16} />,       label: 'ภาพรวม'   },
  { key: 'orders',    icon: <FiShoppingBag size={16} />, label: 'ออเดอร์'  },
  { key: 'news',      icon: <FiFileText size={16} />,    label: 'ข่าวสาร'  },
  { key: 'games',     icon: <FiMonitor size={16} />,     label: 'เกม'      },
];

export default function AdminPage({ onHome }) {
  const [authed, setAuthed] = useState(false);
  const [tab,    setTab]    = useState('dashboard');
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [news,   setNews]   = useState(INIT_NEWS);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} onHome={onHome} />;

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
          <button onClick={() => { setAuthed(false); }}
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
