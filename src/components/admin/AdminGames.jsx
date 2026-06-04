import React, { useState } from 'react';
import {
  FiPlus, FiEdit2, FiCheck, FiX,
  FiImage, FiSend, FiCopy, FiMail, FiMonitor, FiAlertCircle,
} from 'react-icons/fi';
import { GAMES } from '../../config/games';
import { MAILPASS_GAMES } from '../../config/mailpassGames';
import { AVAILABLE_TAGS, sBtn, sBtnCyan, sInput } from './adminShared';

/* ── game.tag (singular) → tags array ── */
function getGameTags(game) {
  if (Array.isArray(game.tags)) return game.tags;
  if (game.tag) return [game.tag];
  return [];
}

/* ─────────────────────── ImagePickerField ─────────────────────── */
function ImagePickerField({ label, src, onChange }) {
  const ref = React.useRef();
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e8edf4', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 9, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {src
            ? <img src={src} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
            : <FiImage size={20} style={{ color: '#cbd5e1' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {src || 'ยังไม่มีรูป'}
          </div>
          <button type="button" onClick={() => ref.current.click()}
            style={{ ...sBtn, background: '#fff', color: '#475569', fontSize: 12, padding: '4px 12px', border: '1px solid #e2e8f0' }}>
            <FiImage size={12} /> เลือกรูป
          </button>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) onChange(URL.createObjectURL(f)); }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── TagToggles ─────────────────────── */
function TagToggles({ tags, onChange }) {
  const toggle = (key) => onChange(
    tags.includes(key) ? tags.filter(t => t !== key) : [...tags, key]
  );
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>แท็ก</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {AVAILABLE_TAGS.map(({ key, label, Icon, color }) => {
          const active = tags.includes(key);
          return (
            <button key={key} type="button" onClick={() => toggle(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 700, border: `1.5px solid ${active ? color : '#e2e8f0'}`, background: active ? color + '18' : '#fff', color: active ? color : '#94a3b8', transition: 'all 0.15s ease' }}>
              <Icon size={12} /> {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── GameCard ─────────────────────── */
function GameCard({ game, display, hasOverride, isNew, isSelected, onEdit }) {
  return (
    <div className={`ag-card${isSelected ? ' selected' : ''}`} onClick={() => onEdit(game.id)}>
      <div className="ag-card-bg"
        style={display.bg ? { backgroundImage: `url(${display.bg})` } : { background: '#1e3a5f' }} />
      <div className="ag-card-gradient" />

      {(hasOverride || isNew) && (
        <div className="ag-card-status" style={{ background: isNew ? '#10b981' : '#00d1ff' }}>
          {isNew ? '+ ใหม่' : '● แก้ไข'}
        </div>
      )}

      <button className="ag-card-edit" aria-label="แก้ไข"
        onClick={e => { e.stopPropagation(); onEdit(game.id); }}>
        {isSelected ? <FiX size={13} /> : <FiEdit2 size={13} />}
      </button>

      <div className="ag-card-bottom">
        <div className="ag-card-icon-row">
          {display.icon
            ? <img src={display.icon} alt="" className="ag-card-icon" loading="lazy" decoding="async" onError={e => { e.target.style.display = 'none'; }} />
            : <div className="ag-card-icon-ph"><FiImage size={13} /></div>}
          <span className="ag-card-name">{display.name}</span>
        </div>
        {display.tags.length > 0 && (
          <div className="ag-card-tags">
            {display.tags.slice(0, 2).map(t => {
              const td = AVAILABLE_TAGS.find(x => x.key === t);
              return (
                <span key={t} className="ag-tag"
                  style={{ background: (td?.color ?? '#6366f1') + '35', color: td?.color ?? '#6366f1' }}>
                  {t}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── GameEditPanel (modal) ─────────────────────── */
function GameEditPanel({ game, overrides, onSave, onCancel }) {
  const [name,    setName]    = useState(overrides?.name ?? game.name);
  const [iconSrc, setIconSrc] = useState(overrides?.icon ?? game.icon ?? '');
  const [bgSrc,   setBgSrc]   = useState(overrides?.bg   ?? game.bg   ?? '');
  const [tags,    setTags]    = useState(overrides?.tags ?? getGameTags(game));

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 20 }}
      onClick={onCancel}
    >
      <div
        style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 540, boxShadow: '0 24px 60px rgba(0,0,0,0.28)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ background: '#0f172a', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiEdit2 size={15} style={{ color: '#00d1ff' }} />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9', flex: 1 }}>แก้ไข — {game.name}</span>
          <button onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 4 }}>
            <FiX size={18} />
          </button>
        </div>

        <div style={{ padding: '22px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม</div>
              <input value={name} onChange={e => setName(e.target.value)} style={sInput} autoFocus />
            </div>
            <ImagePickerField label="Icon (รูปไอคอน)" src={iconSrc} onChange={setIconSrc} />
            <ImagePickerField label="Background (รูปพื้นหลัง)" src={bgSrc} onChange={setBgSrc} />
            <div style={{ gridColumn: '1 / -1' }}>
              <TagToggles tags={tags} onChange={setTags} />
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 16 }}>
            <FiAlertCircle size={11} /> รูปที่อัปโหลดจะแสดงเฉพาะ session นี้ — กด "แจ้งเดฟ" เพื่อส่งให้นักพัฒนาบันทึกถาวร
          </div>
        </div>

        <div style={{ padding: '0 24px 22px', display: 'flex', gap: 8 }}>
          <button onClick={() => onSave(game.id, { name, icon: iconSrc, bg: bgSrc, tags })} style={sBtnCyan}>
            <FiCheck size={14} /> บันทึก
          </button>
          <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}>
            <FiX size={14} /> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── AddGameForm ─────────────────────── */
const EMPTY_GAME = { name: '', category: '', currency: '', icon: '', bg: '', tags: [] };
function AddGameForm({ onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_GAME);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={{ background: '#fff', border: '2px dashed #93c5fd', borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <FiPlus size={15} style={{ color: '#00d1ff' }} />
        <span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>เพิ่มเกมใหม่</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>กด "แจ้งเดฟ" เพื่อส่งข้อมูลให้นักพัฒนา</span>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
          <FiX size={16} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม *</div>
          <input value={form.name} onChange={e => set('name', e.target.value)} style={sInput} placeholder="เช่น Mobile Legends" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>หมวดหมู่</div>
          <input value={form.category} onChange={e => set('category', e.target.value)} style={sInput} placeholder="เช่น เกม MOBA" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>สกุลเงิน</div>
          <input value={form.currency} onChange={e => set('currency', e.target.value)} style={sInput} placeholder="เช่น Diamond" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Icon" src={form.icon} onChange={url => set('icon', url)} /></div>
        <div style={{ flex: '1 1 220px' }}><ImagePickerField label="Background" src={form.bg} onChange={url => set('bg', url)} /></div>
      </div>
      <div style={{ marginBottom: 18 }}><TagToggles tags={form.tags} onChange={t => set('tags', t)} /></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          if (!form.name.trim()) return alert('กรุณากรอกชื่อเกม');
          onAdd({ ...form, id: 'NEW_' + Date.now(), packages: [] });
        }} style={sBtnCyan}><FiPlus size={14} /> เพิ่มเกม</button>
        <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}><FiX size={14} /> ยกเลิก</button>
      </div>
    </div>
  );
}

/* ─────────────────────── NotifyDevModal ─────────────────────── */
function NotifyDevModal({ overrides, newGames, onClose }) {
  const [copied, setCopied] = useState(false);
  const lines = [];
  if (Object.keys(overrides).length > 0) {
    lines.push('=== แก้ไขเกมที่มีอยู่ ===');
    Object.entries(overrides).forEach(([id, d]) => {
      lines.push(`\n[ ${id} ]`);
      if (d.name)       lines.push(`  ชื่อ: ${d.name}`);
      if (d.icon)       lines.push(`  icon: ${d.icon}`);
      if (d.bg)         lines.push(`  bg: ${d.bg}`);
      if (d.tags?.length) lines.push(`  tags: [${d.tags.join(', ')}]`);
    });
  }
  if (newGames.length > 0) {
    lines.push('\n=== เกมใหม่ที่ต้องเพิ่ม ===');
    newGames.forEach((g, i) => {
      lines.push(`\n[${i + 1}] ${g.name}`);
      if (g.category)   lines.push(`  category: ${g.category}`);
      if (g.currency)   lines.push(`  currency: ${g.currency}`);
      if (g.tags?.length) lines.push(`  tags: [${g.tags.join(', ')}]`);
    });
  }
  const text = lines.join('\n') || 'ยังไม่มีรายการที่ต้องแจ้ง';
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 540, boxShadow: '0 24px 60px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
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
          <button onClick={handleCopy}
            style={{ ...(copied ? { ...sBtnCyan, background: '#10b981', color: '#fff', boxShadow: 'none' } : sBtnCyan), flex: 1, justifyContent: 'center' }}>
            {copied ? <><FiCheck size={14} /> คัดลอกแล้ว!</> : <><FiCopy size={14} /> คัดลอก</>}
          </button>
          <button onClick={onClose} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}>ปิด</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── GamesManager (main) ─────────────────────── */
export default function GamesManager() {
  const [gameTab,    setGameTab]    = useState('uid');
  const [editing,    setEditing]    = useState(null);
  const [overrides,  setOverrides]  = useState({});
  const [newGames,   setNewGames]   = useState([]);
  const [adding,     setAdding]     = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const uidList      = Object.values(GAMES);
  const mailList     = Object.values(MAILPASS_GAMES);
  const baseList     = gameTab === 'uid' ? uidList : mailList;
  const tabNewGames  = newGames.filter(g => g._type === gameTab);
  const list         = [...baseList, ...tabNewGames];
  const pendingCount = Object.keys(overrides).length + newGames.length;

  const handleSave    = (id, data) => { setOverrides(p => ({ ...p, [id]: data })); setEditing(null); };
  const handleAddGame = (g)        => { setNewGames(p => [...p, { ...g, _type: gameTab }]); setAdding(false); };
  const toggleEdit    = (id)       => { setEditing(prev => prev === id ? null : id); };

  const getDisplay = (game) => {
    const ov = overrides[game.id];
    return {
      name: ov?.name ?? game.name,
      icon: ov?.icon ?? game.icon ?? '',
      bg:   ov?.bg   ?? game.bg   ?? '',
      tags: ov?.tags ?? getGameTags(game),
    };
  };

  const editingGame = editing ? list.find(g => g.id === editing) : null;

  return (
    <div>
      <style>{`
        .ag-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .ag-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          height: 190px;
          background: #1e293b;
          border: 2px solid transparent;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .ag-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.22);
        }
        .ag-card.selected {
          border-color: #00d1ff;
          box-shadow: 0 0 0 1px rgba(0,209,255,0.4), 0 10px 28px rgba(0,209,255,0.2);
        }
        .ag-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          transition: transform 0.32s ease;
        }
        .ag-card:hover .ag-card-bg { transform: scale(1.06); }
        .ag-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%);
        }
        .ag-card-status {
          position: absolute;
          top: 8px; left: 8px;
          font-size: 9px; font-weight: 800; color: #fff;
          padding: 3px 8px; border-radius: 20px; z-index: 2;
          letter-spacing: 0.04em;
        }
        .ag-card-edit {
          position: absolute;
          top: 8px; right: 8px;
          width: 30px; height: 30px;
          border-radius: 7px;
          background: rgba(15,23,42,0.72);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 2;
          opacity: 0;
          transform: scale(0.82);
          transition: opacity 0.15s, transform 0.15s, background 0.15s, border-color 0.15s, color 0.15s;
        }
        .ag-card:hover .ag-card-edit,
        .ag-card.selected .ag-card-edit { opacity: 1; transform: scale(1); }
        .ag-card.selected .ag-card-edit {
          background: rgba(0,209,255,0.22);
          border-color: rgba(0,209,255,0.55);
          color: #00d1ff;
        }
        .ag-card-edit:hover {
          background: #00d1ff !important;
          color: #0f172a !important;
          border-color: #00d1ff !important;
        }
        .ag-card-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 10px;
          z-index: 2;
        }
        .ag-card-icon-row {
          display: flex; align-items: center; gap: 7px;
          margin-bottom: 6px;
        }
        .ag-card-icon {
          width: 26px; height: 26px;
          border-radius: 6px; object-fit: cover;
          border: 1.5px solid rgba(255,255,255,0.22);
          flex-shrink: 0;
        }
        .ag-card-icon-ph {
          width: 26px; height: 26px;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.4); flex-shrink: 0;
        }
        .ag-card-name {
          font-size: 11px; font-weight: 700; color: #fff;
          line-height: 1.2;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .ag-card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .ag-tag {
          font-size: 9px; font-weight: 800;
          padding: 2px 7px; border-radius: 10px;
          letter-spacing: 0.03em;
        }
        @media (prefers-reduced-motion: reduce) {
          .ag-card, .ag-card-bg, .ag-card-edit { transition: none; animation: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>จัดการเกม</h2>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
            {list.length} เกม
            {pendingCount > 0
              ? <span style={{ color: '#f59e0b', fontWeight: 700 }}> · {pendingCount} รายการรอแจ้งเดฟ</span>
              : ' · ไม่มีรายการค้าง'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setAdding(a => !a); setEditing(null); }}
            style={adding ? { ...sBtn, background: '#f1f5f9', color: '#475569' } : sBtnCyan}>
            {adding ? <><FiX size={14} /> ยกเลิก</> : <><FiPlus size={14} /> เพิ่มเกมใหม่</>}
          </button>
          <button onClick={() => setShowNotify(true)}
            style={{ ...sBtn, background: pendingCount > 0 ? '#1e293b' : '#f1f5f9', color: pendingCount > 0 ? '#fff' : '#94a3b8', position: 'relative' }}>
            <FiSend size={14} /> แจ้งเดฟ
            {pendingCount > 0 && (
              <span style={{ position: 'absolute', top: -7, right: -7, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Add game form ── */}
      {adding && <AddGameForm onAdd={handleAddGame} onCancel={() => setAdding(false)} />}

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 3, marginBottom: 16, width: 'fit-content' }}>
        {[
          { key: 'uid',  icon: <FiMonitor size={14} />, label: `บริการ UID (${uidList.length})` },
          { key: 'mail', icon: <FiMail    size={14} />, label: `Mail/Pass (${mailList.length})` },
        ].map(({ key, icon, label }) => (
          <button key={key}
            onClick={() => { setGameTab(key); setEditing(null); setAdding(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              transition: 'all 0.15s ease',
              background: gameTab === key ? '#fff' : 'transparent',
              color: gameTab === key ? '#0f172a' : '#94a3b8',
              boxShadow: gameTab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── Card grid ── */}
      <div className="ag-grid">
        {list.map(g => {
          const d = getDisplay(g);
          return (
            <GameCard
              key={g.id}
              game={g}
              display={d}
              hasOverride={!!overrides[g.id]}
              isNew={g.id?.startsWith('NEW_')}
              isSelected={editing === g.id}
              onEdit={toggleEdit}
            />
          );
        })}
        {list.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            ไม่มีข้อมูลเกม
          </div>
        )}
      </div>

      {showNotify && <NotifyDevModal overrides={overrides} newGames={newGames} onClose={() => setShowNotify(false)} />}
      {editingGame && (
        <GameEditPanel
          game={editingGame}
          overrides={overrides[editingGame.id]}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
