import { useState, useEffect, useRef } from 'react';
import { COUNTRY_NAMES, FLAG_BASE } from '../config/constants';
import { FILTER_TABS, PAGE_SIZE } from '../config/homeData';

export default function GameGrid({ games, expanded, onCollapse, onTopup }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGames = activeFilter === 'all'
    ? [...games].sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0))
    : games.filter(g => g.tag === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // ── ค่าปรับได้ ──────────────────────────────────────
  const iconMarginLeft = 9;
  const iconMarginTop  = 18;
  const nameTop        = -9;
  const nameLeft       = -8;
  const nameFontSize   = 10;
  const catFontSize    = 10;
  const catTop         = -7;
  const catLeft        = -8.5;
  const btnFontSize    = 8;
  const btnPad         = '8px 11px';
  const barPadLeft     = 60;
  // ────────────────────────────────────────────────────

  const renderCard = (game, i, animStyle) => {
    const countryLabel = game.country ? (COUNTRY_NAMES[game.country] || game.country) : '';
    const displayName = game.country && game.id?.startsWith('Mobile Legends')
      ? (game.id === 'Mobile Legends' ? 'Mobile Legends TH' : game.id)
      : game.name;

    return (
    <div className="game-card" key={`${game.id}-${i}`} style={{ ...animStyle, cursor: 'pointer' }}
      onClick={() => onTopup && onTopup(game.id)}>
      <img src={game.bg} alt={displayName} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        onError={e => { e.target.style.display = 'none'; }} />
      {game.tag && (
        <div className={`promo-tag${game.tag === 'ใหม่' ? ' new' : ''}`} style={{ zIndex: 11 }}>
          {game.tag}
        </div>
      )}
      {game.country && (
        <div style={{
          position: 'absolute', top: 12, left: 10, zIndex: 11,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 8px 3px 3px',
          borderRadius: 999, background: 'rgba(15,23,42,0.76)',
          color: '#fff', fontSize: 10, fontWeight: 700, lineHeight: 1,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 1px 4px rgba(0,0,0,0.28)',
          whiteSpace: 'nowrap',
        }}>
          <img src={`${FLAG_BASE}/${game.country}.png`} alt="" loading="lazy" decoding="async" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
          <span style={{ paddingLeft: 20 }}>{countryLabel}</span>
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
        padding: `36px 14px 12px ${barPadLeft}px`,
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <img src={game.icon} alt="" loading="lazy" decoding="async"
              style={{ width: 36, height: 37, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.18)', marginLeft: iconMarginLeft, marginTop: iconMarginTop }}
              onError={e => { e.target.style.display = 'none'; }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: nameFontSize, lineHeight: 1.2, whiteSpace: 'nowrap', position: 'relative', top: nameTop, left: nameLeft }}>{displayName}</span>
          </div>
          {game.category && <div style={{ color: '#ffffff', fontSize: catFontSize, position: 'relative', top: catTop, left: catLeft }}>{game.category}</div>}
        </div>
        <button style={{
          background: '#00d1ff', color: '#ffffff', border: 'none', borderRadius: 20,
          padding: btnPad, fontSize: btnFontSize, fontWeight: 700, cursor: 'pointer', flexShrink: 0, lineHeight: 1,
        }} onClick={() => onTopup && onTopup(game.id)}>เติมเกม</button>
      </div>
    </div>
    );
  };

  const filterBar = (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {FILTER_TABS.map(({ key, label, Icon }) => (
        <button key={key} onClick={() => { setActiveFilter(key); setVisibleCount(PAGE_SIZE); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, lineHeight: 1, transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.15s ease, transform 0.15s ease',
            background: activeFilter === key ? '#00d1ff' : 'rgba(0,0,0,0.07)',
            color: activeFilter === key ? '#fff' : '#475569',
            boxShadow: activeFilter === key ? '0 4px 12px rgba(0,209,255,0.35)' : 'none',
            transform: activeFilter === key ? 'translateY(-1px)' : 'none',
          }}>
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );

  if (!expanded) {
    const preview = filteredGames.slice(0, 5);
    return (
      <div ref={ref}>
        {filterBar}
        <div className="games-grid" style={{ padding: '80px', margin: '-80px' }}>
          {preview.map((game, i) => renderCard(game, i, seen
            ? { animation: `gameCardIn 0.5s ${i * 0.1}s ease both` }
            : { opacity: 0 }
          ))}
        </div>
      </div>
    );
  }

  const visibleGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  return (
    <div ref={ref}>
      {filterBar}
      <div className="games-grid-expanded" style={{ padding: '80px', margin: '-80px' }}>
        {visibleGames.map((game, i) => renderCard(game, i, {
          animation: `gameCardIn 0.4s ${(i % PAGE_SIZE) * 0.03}s ease both`,
        }))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
        {hasMore && (
          <button className="see-more-btn" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            เกมทั้งหมด
          </button>
        )}
        <button className="collapse-btn" onClick={onCollapse}>ปิด</button>
      </div>
    </div>
  );
}
