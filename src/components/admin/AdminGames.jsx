import React, { useState, useRef } from 'react';
import {
  FiPlus, FiEdit2, FiCheck, FiX,
  FiImage, FiSend, FiCopy, FiMail, FiMonitor, FiAlertCircle, FiUpload, FiTrash2,
} from 'react-icons/fi';
import { GAMES } from '../../config/games';
import { MAILPASS_GAMES } from '../../config/mailpassGames';
import { AVAILABLE_TAGS, sBtn, sBtnCyan, sInput } from './adminShared';

function getGameTags(game) {
  if (Array.isArray(game.tags)) return game.tags;
  if (game.tag) return [game.tag];
  return [];
}

/* ─── ImagePickerField ─────────────────────────────────────── */
// path = ค่าที่ส่งให้ dev (ใช้ใน games.js)
// preview = URL สำหรับ img src (อาจเป็น blob สำหรับดูพรีวิว)
function ImagePickerField({ label, src, onChange }) {
  const [path,    setPath]    = useState(src || '');
  const [preview, setPreview] = useState(src || '');
  const fileRef = useRef();

  const updatePath = (val) => {
    setPath(val);
    setPreview(val);
    onChange(val);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const suggested = `/images/${f.name}`;
    setPath(suggested);
    setPreview(URL.createObjectURL(f));
    onChange(suggested);
  };

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e8edf4', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 54, height: 54, borderRadius: 9, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0, border: '1px solid #dde3ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview
            ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
            : <FiImage size={18} style={{ color: '#cbd5e1' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={path}
            onChange={e => updatePath(e.target.value)}
            placeholder="/images/GAMES ICON/..."
            style={{ ...sInput, fontSize: 11, marginBottom: 6 }}
          />
          <button type="button" onClick={() => fileRef.current.click()}
            style={{ ...sBtn, background: '#fff', color: '#475569', fontSize: 11, padding: '4px 10px', border: '1px solid #e2e8f0' }}>
            <FiUpload size={11} /> อัปโหลดรูปใหม่
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

/* ─── TagToggles ───────────────────────────────────────────── */
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

/* ─── GameCard ─────────────────────────────────────────────── */
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

/* ─── ModalShell — กรอบ modal ใช้ร่วม ─────────────────────── */
function ModalShell({ title, icon, onClose, children, footer }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 560, boxShadow: '0 24px 60px rgba(0,0,0,0.28)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ background: '#0f172a', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {icon}
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9', flex: 1 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 4 }}>
            <FiX size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── GameEditPanel ────────────────────────────────────────── */
function GameEditPanel({ game, overrides, onSave, onCancel }) {
  const [name,    setName]    = useState(overrides?.name ?? game.name);
  const [iconSrc, setIconSrc] = useState(overrides?.icon ?? game.icon ?? '');
  const [bgSrc,   setBgSrc]   = useState(overrides?.bg   ?? game.bg   ?? '');
  const [tags,    setTags]    = useState(overrides?.tags ?? getGameTags(game));

  return (
    <ModalShell
      title={`แก้ไข — ${game.name}`}
      icon={<FiEdit2 size={15} style={{ color: '#00d1ff' }} />}
      onClose={onCancel}
      footer={
        <>
          <button onClick={() => onSave(game.id, { name, icon: iconSrc, bg: bgSrc, tags })} style={sBtnCyan}>
            <FiCheck size={14} /> บันทึก
          </button>
          <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}>
            <FiX size={14} /> ยกเลิก
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม</div>
          <input value={name} onChange={e => setName(e.target.value)} style={sInput} autoFocus />
        </div>
        <ImagePickerField label="รูปไอคอน (Icon)" src={iconSrc} onChange={setIconSrc} />
        <ImagePickerField label="รูปพื้นหลัง (Background)" src={bgSrc} onChange={setBgSrc} />
        <TagToggles tags={tags} onChange={setTags} />
      </div>
      <div style={{ fontSize: 11, color: '#92400e', display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '8px 10px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
        <FiAlertCircle size={12} /> ข้อมูลจะหายหลัง refresh — กด "แจ้งเดฟ" เพื่อส่งให้นักพัฒนาบันทึกถาวร
      </div>
    </ModalShell>
  );
}

/* ─── AddGameModal ─────────────────────────────────────────── */
const EMPTY_GAME = { name: '', category: '', currency: '', icon: '', bg: '', tags: [] };
function AddGameModal({ onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_GAME);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name.trim()) { alert('กรุณากรอกชื่อเกม'); return; }
    onAdd({ ...form, id: 'NEW_' + Date.now(), packages: [] });
  };

  return (
    <ModalShell
      title="เพิ่มเกมใหม่"
      icon={<FiPlus size={15} style={{ color: '#10b981' }} />}
      onClose={onCancel}
      footer={
        <>
          <button onClick={handleAdd} style={sBtnCyan}><FiPlus size={14} /> เพิ่มเกม</button>
          <button onClick={onCancel} style={{ ...sBtn, background: '#f1f5f9', color: '#475569' }}><FiX size={14} /> ยกเลิก</button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 5 }}>ชื่อเกม *</div>
          <input value={form.name} onChange={e => set('name', e.target.value)} style={sInput} placeholder="เช่น Mobile Legends" autoFocus />
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <ImagePickerField label="รูปไอคอน" src={form.icon} onChange={url => set('icon', url)} />
        <ImagePickerField label="รูปพื้นหลัง" src={form.bg} onChange={url => set('bg', url)} />
      </div>
      <TagToggles tags={form.tags} onChange={t => set('tags', t)} />
      <div style={{ fontSize: 11, color: '#475569', marginTop: 14, padding: '8px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', lineHeight: 1.6 }}>
        หลังกด "เพิ่มเกม" — ข้อมูลจะแสดงใน grid แบบชั่วคราว กด "แจ้งเดฟ" เพื่อส่งให้นักพัฒนาเพิ่มลงในระบบถาวร
      </div>
    </ModalShell>
  );
}

/* ─── NotifyDevModal ───────────────────────────────────────── */
function NotifyDevModal({ overrides, newGames, onClose }) {
  const [copied, setCopied] = useState(false);
  const lines = [];
  if (Object.keys(overrides).length > 0) {
    lines.push('=== แก้ไขเกมที่มีอยู่ ===');
    Object.entries(overrides).forEach(([id, d]) => {
      lines.push(`\n[ ${id} ]`);
      if (d.name)           lines.push(`  ชื่อ: ${d.name}`);
      if (d.icon)           lines.push(`  icon: ${d.icon}`);
      if (d.bg)             lines.push(`  bg: ${d.bg}`);
      if (d.tags?.length)   lines.push(`  tags: [${d.tags.join(', ')}]`);
    });
  }
  if (newGames.length > 0) {
    lines.push('\n=== เกมใหม่ที่ต้องเพิ่ม ===');
    newGames.forEach((g, i) => {
      lines.push(`\n[${i + 1}] ${g.name}`);
      if (g.category)       lines.push(`  category: ${g.category}`);
      if (g.currency)       lines.push(`  currency: ${g.currency}`);
      if (g.icon)           lines.push(`  icon: ${g.icon}`);
      if (g.bg)             lines.push(`  bg: ${g.bg}`);
      if (g.tags?.length)   lines.push(`  tags: [${g.tags.join(', ')}]`);
      lines.push(`  packages: [] (กรอกราคาเพิ่มเติม)`);
    });
  }
  const text = lines.join('\n') || 'ยังไม่มีรายการที่ต้องแจ้ง';
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2400); });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 560, boxShadow: '0 24px 60px rgba(0,0,0,0.22)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ background: '#1e293b', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiSend size={16} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>แจ้งนักพัฒนา</span>
            {(Object.keys(overrides).length + newGames.length) > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 8px', fontSize: 11, fontWeight: 800 }}>
                {Object.keys(overrides).length + newGames.length} รายการ
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><FiX size={18} /></button>
        </div>
        <div style={{ padding: '18px 22px' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>คัดลอกข้อความด้านล่างส่งให้ dev ค่ะ</div>
          <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', fontSize: 12, color: '#334155', overflowY: 'auto', maxHeight: 280, whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.7, fontFamily: 'monospace', margin: 0 }}>{text}</pre>
        </div>
        <div style={{ padding: '0 22px 18px', display: 'flex', gap: 10 }}>
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

/* ─── GamesManager (main) ──────────────────────────────────── */
export default function GamesManager() {
  const [gameTab,    setGameTab]    = useState('uid');
  const [editing,    setEditing]    = useState(null);
  const [overrides,  setOverrides]  = useState({});
  const [newGames,   setNewGames]   = useState([]);
  const [adding,     setAdding]     = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const uidList     = Object.values(GAMES);
  const mailList    = Object.values(MAILPASS_GAMES);
  const baseList    = gameTab === 'uid' ? uidList : mailList;
  const tabNewGames = newGames.filter(g => g._type === gameTab);
  const list        = [...baseList, ...tabNewGames];
  const pendingCount = Object.keys(overrides).length + newGames.length;

  const handleSave    = (id, data) => { setOverrides(p => ({ ...p, [id]: data })); setEditing(null); };
  const handleAddGame = (g)        => { setNewGames(p => [...p, { ...g, _type: gameTab }]); setAdding(false); };
  const toggleEdit    = (id)       => setEditing(prev => prev === id ? null : id);
  const handleReset   = ()         => { if (window.confirm('ล้างการแก้ไขทั้งหมด?')) { setOverrides({}); setNewGames([]); } };

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
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 14px;
        }
        .ag-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          height: 195px;
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
          padding: 10px; z-index: 2;
        }
        .ag-card-icon-row {
          display: flex; align-items: center; gap: 7px; margin-bottom: 6px;
        }
        .ag-card-icon {
          width: 26px; height: 26px;
          border-radius: 6px; object-fit: cover;
          border: 1.5px solid rgba(255,255,255,0.22); flex-shrink: 0;
        }
        .ag-card-icon-ph {
          width: 26px; height: 26px; border-radius: 6px;
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
          padding: 2px 7px; border-radius: 10px; letter-spacing: 0.03em;
        }
        @media (prefers-reduced-motion: reduce) {
          .ag-card, .ag-card-bg, .ag-card-edit { transition: none; animation: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>จัดการเกม</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
            {list.length} เกม
            {pendingCount > 0
              ? <span style={{ color: '#f59e0b', fontWeight: 700 }}> · {pendingCount} รายการรอแจ้งเดฟ</span>
              : ' · ไม่มีรายการค้าง'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {pendingCount > 0 && (
            <button onClick={handleReset}
              style={{ ...sBtn, background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontSize: 12 }}>
              <FiTrash2 size={13} /> ล้างทั้งหมด
            </button>
          )}
          <button onClick={() => { setAdding(true); setEditing(null); }}
            style={sBtnCyan}>
            <FiPlus size={14} /> เพิ่มเกมใหม่
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

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 3, marginBottom: 18, width: 'fit-content' }}>
        {[
          { key: 'uid',  icon: <FiMonitor size={14} />, label: `บริการ UID (${uidList.length})` },
          { key: 'mail', icon: <FiMail    size={14} />, label: `Mail/Pass (${mailList.length})` },
        ].map(({ key, icon, label }) => (
          <button key={key}
            onClick={() => { setGameTab(key); setEditing(null); setAdding(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s ease',
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
            <GameCard key={g.id} game={g} display={d}
              hasOverride={!!overrides[g.id]}
              isNew={g.id?.startsWith('NEW_')}
              isSelected={editing === g.id}
              onEdit={toggleEdit} />
          );
        })}
        {list.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            ไม่มีข้อมูลเกม
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {adding     && <AddGameModal  onAdd={handleAddGame} onCancel={() => setAdding(false)} />}
      {showNotify && <NotifyDevModal overrides={overrides} newGames={newGames} onClose={() => setShowNotify(false)} />}
      {editingGame && (
        <GameEditPanel game={editingGame} overrides={overrides[editingGame.id]}
          onSave={handleSave} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}
