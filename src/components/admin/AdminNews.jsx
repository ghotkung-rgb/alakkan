import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiImage, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi';
import { sInput, sBtn, sBtnCyan, sIconBtn } from './adminShared';

function ImagePickerInline({ src, position, onSrcChange, onPositionChange }) {
  const ref = React.useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onSrcChange(URL.createObjectURL(file)); // ← blob URL ชั่วคราว ใช้แสดง preview เท่านั้น
    // ══════════════════════════════════════════════════════════
    //  [BACKEND] แทนบรรทัดบนด้วยโค้ดนี้:
    //
    //  const data = new FormData();
    //  data.append('file', file);
    //  const res = await fetch('/api/upload', { method: 'POST', body: data });
    //  const { url } = await res.json();  // server ต้อง return { url: string }
    //  onSrcChange(url);                  // ← ใช้ URL จริงจาก server
    //
    //  อย่าลืมเปลี่ยน handleFile เป็น async ด้วย
    // ══════════════════════════════════════════════════════════
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {src && (
        <div style={{ width: '100%', height: 120, borderRadius: 10, overflow: 'hidden', background: '#0f172a', border: '1px solid #e2e8f0', position: 'relative' }}>
          <img src={src} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${position}%` }} />
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
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginBottom: 10 }}>รูปภาพประกอบ</div>
          <ImagePickerInline
            src={form.image} position={form.imagePosition}
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

export default function NewsManager({ news, setNews }) {
  const [editing, setEditing] = useState(null);

  const handleSave = (form) => {
    if (editing === 'new') {
      setNews(prev => [{ ...form, id: Date.now() }, ...prev]);
      // ══════════════════════════════════════════════════════
      //  [BACKEND] เพิ่มหลัง setNews:
      //
      //  const res = await fetch('/api/news', {
      //    method: 'POST',
      //    headers: { 'Content-Type': 'application/json' },
      //    body: JSON.stringify(form),
      //  });
      //  const created = await res.json(); // server return { id, ...form }
      //  setNews(prev => [created, ...prev]); // ← ใช้ id จาก server แทน Date.now()
      // ══════════════════════════════════════════════════════
    } else {
      setNews(prev => prev.map(n => n.id === editing ? { ...form, id: editing } : n));
      // ══════════════════════════════════════════════════════
      //  [BACKEND] เพิ่มหลัง setNews:
      //
      //  await fetch(`/api/news/${editing}`, {
      //    method: 'PUT',
      //    headers: { 'Content-Type': 'application/json' },
      //    body: JSON.stringify(form),
      //  });
      // ══════════════════════════════════════════════════════
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
                  {n.image && (
                    <div style={{ width: 90, flexShrink: 0, background: '#0f172a', overflow: 'hidden' }}>
                      <img src={n.image} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${n.imagePosition ?? 50}%` }} />
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
