import React, { useState } from 'react';
import {
  FiPlus, FiEdit2, FiCheck, FiX,
  FiImage, FiSend, FiCopy, FiPackage, FiMail, FiMonitor, FiAlertCircle,
} from 'react-icons/fi';
import { GAMES } from '../../config/games';
import { MAILPASS_GAMES } from '../../config/mailpassGames';
import { AVAILABLE_TAGS, sTh, sTd, sBtn, sBtnCyan, sIconBtn, sInput } from './adminShared';

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
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 700, border: `1.5px solid ${active ? color : '#e2e8f0'}`, background: active ? color + '15' : '#fff', color: active ? color : '#94a3b8', transition: 'all 0.15s ease' }}>
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
          <button onClick={() => onSave(game.id, { name, icon: iconSrc, bg: bgSrc, tags })} style={sBtnCyan}><FiCheck size={14} /> บันทึก</button>
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

export default function GamesManager() {
  const [gameTab,    setGameTab]    = useState('uid');
  const [editing,    setEditing]    = useState(null);
  const [overrides,  setOverrides]  = useState({});
  const [newGames,   setNewGames]   = useState([]);
  const [adding,     setAdding]     = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const uidList  = Object.values(GAMES);
  const mailList = Object.values(MAILPASS_GAMES);
  const baseList = gameTab === 'uid' ? uidList : mailList;
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
        {[['uid', <FiMonitor size={14} />, `บริการ UID (${uidList.length})`, '#00d1ff', '#0f172a'], ['mail', <FiMail size={14} />, `บริการ Mail/Pass (${mailList.length})`, '#475569', '#fff']].map(([key, icon, label, accent, textCol]) => (
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
