import { useState, useEffect, useRef } from 'react';

export default function PromoGrid({ promos, onTopup, onMailPass }) {
  const ref = useRef(null);
  const scrollRef = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handlePromo = (p) => {
    if (!p.gameId) return;
    if (p.type === 'mailpass') onMailPass?.(p.gameId);
    else onTopup?.(p.gameId);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ overflow: 'hidden', margin: '0' }}>
        <div ref={scrollRef} className="promo-grid" style={{ overflow: 'hidden', padding: '60px', margin: '-60px' }}>
          {promos.map((p, i) => (
            <div className={`promo-card${i === 0 ? ' featured' : ''}`} key={p.id}
              onClick={() => handlePromo(p)}
              style={{
                ...(seen
                  ? { animation: `gameCardIn 0.5s ${i * 0.12}s ease both` }
                  : { opacity: 0 }),
                cursor: p.gameId ? 'pointer' : 'default',
              }}>
              {p.bg ? (
                <>
                  <img src={p.bg} alt={p.name} loading="lazy" decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                  {p.tag && <div className={`promo-tag ${p.tag === 'ใหม่' ? 'new' : ''}`}>{p.tag}</div>}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
                    padding: '36px 14px 12px 49px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <img src={p.icon} alt="" loading="lazy" decoding="async"
                          style={{ width: 36, height: 37, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.18)', marginLeft: 10, marginTop: 29 }}
                          onError={e => { e.target.style.display = 'none'; }} />
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{p.name}</span>
                      </div>
                      {p.category && <div style={{ color: '#ffffff', fontSize: 11, marginTop: 2 }}>{p.category}</div>}
                    </div>
                    <button style={{
                      background: '#00d1ff', color: '#ffffff', border: 'none', borderRadius: 20,
                      padding: '5px 11px', fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0, lineHeight: 1,
                    }} onClick={(e) => { e.stopPropagation(); handlePromo(p); }}>เติมเกม</button>
                  </div>
                </>
              ) : (
                <>
                  <img src={p.img} alt={p.name} loading="lazy" decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div className="game-overlay" />
                  {p.tag && <div className={`promo-tag ${p.tag === 'ใหม่' ? 'new' : ''}`}>{p.tag}</div>}
                  <div className="game-name">{p.name}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
