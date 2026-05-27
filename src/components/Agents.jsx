import React, { useState, useEffect, useRef } from 'react';

const CHARACTERS_DATA = {
  1: {
    name: "BLAZE",
    subTitle: "แนะนำความสามารถ",
    skills: [
      { id: 1, name: "นักสู้", icon: "/images/skill_1.png", desc: "มีวิชาต่อสู้" },
      { id: 2, name: "อดทน", icon: "/images/skill_2.png", desc: "มีความทนทานสูง" }
    ],
    mainImg: "/images/GR1.png",
    bgImg: "/images/BG-red.png",
    accentColor: "#ff4444",
    glowColor: "rgba(255,68,68,0.4)",
    tag: "RECON",
  },
  2: {
    name: "JACKAL",
    subTitle: "แนะนำความสามารถ",
    skills: [
      { id: 1, name: "โดรนรักษาพยาบาล", icon: "/images/skill_3.png", desc: "ส่งโดรนฟื้นฟูพลังงานให้ทีม" },
      { id: 2, name: "โล่พลังงาน", icon: "/images/skill_4.png", desc: "สร้างกำแพงพลังงานป้องกันทีม" }
    ],
    mainImg: "/images/jackson.png",
    bgImg: "/images/jackal-bg.jpg",
    accentColor: "#00d4ff",
    glowColor: "rgba(0,212,255,0.4)",
    tag: "SUPPORT",
  },
  3: {
    name: "WATCHMAN",
    subTitle: "แนะนำความสามารถ",
    skills: [
      { id: 1, name: "ป้อมปืนกล", icon: "🤖", desc: "วางป้อมปืนอัตโนมัติครอบคลุมพื้นที่" },
      { id: 2, name: "กำแพงเหล็ก", icon: "🧱", desc: "สร้างสิ่งกีดขวางชั่วคราว" }
    ],
    mainImg: "/images/watchman-full.png",
    bgImg: "/images/watchman-bg.jpg",
    accentColor: "#f2d000",
    glowColor: "rgba(242,208,0,0.4)",
    tag: "SENTINEL",
  },
  4: {
    name: "CYAN",
    subTitle: "แนะนำความสามารถ",
    skills: [
      { id: 1, name: "ระเบิดสลบ", icon: "💣", desc: "ปล่อยคลื่นกระแทกทำให้ศัตรูมึนงง" },
      { id: 2, name: "เครื่องพรางตัว", icon: "✨", desc: "กลายเป็นล่องหนชั่วคราว" }
    ],
    mainImg: "/images/cyan-full.png",
    bgImg: "/images/cyan-bg.jpg",
    accentColor: "#a855f7",
    glowColor: "rgba(168,85,247,0.4)",
    tag: "DUELIST",
  }
};

const CHARACTER_IDS = [1, 2, 3, 4];

// Preload images to prevent disappearing on revisit
function preloadImages() {
  Object.values(CHARACTERS_DATA).forEach(char => {
    const img1 = new Image(); img1.src = char.mainImg;
    const img2 = new Image(); img2.src = char.bgImg;
  });
  CHARACTER_IDS.forEach(id => {
    const av = new Image(); av.src = `/images/avatar-${id}.jpg`;
  });
}

const ScanlineOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    mixBlendMode: 'multiply'
  }} />
);

const NoiseOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '150px 150px'
  }} />
);

const CornerBracket = ({ position, color }) => {
  const styles = {
    'top-left': { top: 16, left: 16, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    'top-right': { top: 16, right: 16, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
    'bottom-left': { bottom: 16, left: 16, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
    'bottom-right': { bottom: 16, right: 16, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
  };
  return (
    <div style={{
      position: 'absolute', width: 32, height: 32, opacity: 0.6, zIndex: 5, pointerEvents: 'none',
      transition: 'border-color 0.5s ease',
      ...styles[position]
    }} />
  );
};

const GlitchText = ({ text, color }) => {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3500);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <h1 style={{
        fontSize: 'clamp(70px, 11vw, 160px)',
        fontFamily: "'Impact', 'Anton', sans-serif",
        fontWeight: 900, fontStyle: 'italic',
        letterSpacing: '-0.04em', lineHeight: 0.85,
        color: '#f0f0f0', textTransform: 'uppercase',
        textShadow: `4px 4px 0px rgba(0,0,0,0.5), 0 0 60px ${color}55`,
        transition: 'color 0.5s ease, text-shadow 0.5s ease',
        userSelect: 'none',
        position: 'relative', zIndex: 0,
        WebkitTextStroke: '1px rgba(255,255,255,0.1)',
      }}>{text}</h1>
      {/* Glitch layers */}
      {glitch && <>
        <h1 style={{
          position: 'absolute', top: 0, left: 0,
          fontSize: 'clamp(70px, 11vw, 160px)', fontFamily: "'Impact', sans-serif",
          fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.85,
          color: color, textTransform: 'uppercase', userSelect: 'none',
          clipPath: 'inset(30% 0 50% 0)',
          transform: 'translateX(-4px)', opacity: 0.7,
          animation: 'none',
        }}>{text}</h1>
        <h1 style={{
          position: 'absolute', top: 0, left: 0,
          fontSize: 'clamp(70px, 11vw, 160px)', fontFamily: "'Impact', sans-serif",
          fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 0.85,
          color: '#00ffff', textTransform: 'uppercase', userSelect: 'none',
          clipPath: 'inset(60% 0 10% 0)',
          transform: 'translateX(4px)', opacity: 0.5,
        }}>{text}</h1>
      </>}
    </div>
  );
};

const ParticleField = ({ color }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, bottom: `${p.y % 40}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          backgroundColor: color,
          animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
          boxShadow: `0 0 6px ${color}`,
        }} />
      ))}
    </div>
  );
};

export default function Agents() {
  const [activeId, setActiveId] = useState(1);
  const [prevId, setPrevId] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [scrollOffset, setScrollOffset] = useState(0); // 0 = show chars 1-4 visible
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mounted, setMounted] = useState(false);
  const imgRefs = useRef({});

  const VISIBLE_COUNT = 3; // how many avatars visible at once
  const MAX_OFFSET = Math.max(0, CHARACTER_IDS.length - VISIBLE_COUNT);

  useEffect(() => {
    preloadImages();
    setMounted(true);
    // Mark all images as loaded initially
    const loaded = {};
    CHARACTER_IDS.forEach(id => { loaded[id] = true; });
    setImgLoaded(loaded);
  }, []);

  const currentChar = CHARACTERS_DATA[activeId];
const changeChar = (id) => {
  if (id === activeId || transitioning) return;
  setPrevId(activeId);
  setTransitioning(true);
  
  // เพิ่มบรรทัดนี้ — ขยับ offset ให้ตัวที่เลือกอยู่ใน view เสมอ
  const idx = CHARACTER_IDS.indexOf(id);
  setScrollOffset(Math.min(Math.max(0, idx - 1), MAX_OFFSET));

  setTimeout(() => {
    setActiveId(id);
    setTransitioning(false);
    setPrevId(null);
  }, 350);
};

const scrollUp = () => {
  const currentIndex = CHARACTER_IDS.indexOf(activeId);
  if (currentIndex > 0) {
    const newId = CHARACTER_IDS[currentIndex - 1];
    changeChar(newId);
    setScrollOffset(o => Math.max(0, o - 1));
  }
};

const scrollDown = () => {
  const currentIndex = CHARACTER_IDS.indexOf(activeId);
  if (currentIndex < CHARACTER_IDS.length - 1) {
    const newId = CHARACTER_IDS[currentIndex + 1];
    changeChar(newId);
    setScrollOffset(o => Math.min(MAX_OFFSET, o + 1));
  }
};


  const visibleIds = CHARACTER_IDS.slice(scrollOffset, scrollOffset + VISIBLE_COUNT);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Share+Tech+Mono&display=swap');

        @keyframes bgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes charAppear { from { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        @keyframes scanLine { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
        @keyframes pulseGlow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        @keyframes tagBlink { 0%,90%,100% { opacity: 1; } 95% { opacity: 0.3; } }
        @keyframes avatarSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes borderDash {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
        @keyframes hbarPulse {
          0%,100% { width: 30%; opacity: 0.5; }
          50% { width: 60%; opacity: 1; }
        }

        .skill-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .skill-card:hover { transform: translateX(8px); }

        .char-btn { transition: all 0.2s ease; }
        .char-btn:hover { transform: scale(1.05); }

        .scan-overlay {
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 50%, transparent 100%);
          height: 200px; width: 100%;
          position: absolute; pointer-events: none; z-index: 4;
          animation: scanLine 6s linear infinite;
        }
      `}</style>

      {/* ========== BACKGROUND LAYERS ========== */}

      {/* BG Image - with key to force remount on change, fixing disappear bug */}
      <div key={`bg-${activeId}`} style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${currentChar.bgImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        animation: 'bgFadeIn 0.7s ease forwards',
      }} />

      {/* Dark overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)',
        transition: 'background 0.7s ease',
      }} />

      {/* Accent color vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `radial-gradient(ellipse at 60% 80%, ${currentChar.glowColor} 0%, transparent 60%)`,
        transition: 'background 0.7s ease',
      }} />

      {/* Scanline + Noise */}
      <ScanlineOverlay />
      <NoiseOverlay />
      <div className="scan-overlay" />

      {/* Particles */}
      <ParticleField color={currentChar.accentColor} key={`particles-${activeId}`} />

      {/* Corner brackets */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
        <CornerBracket key={pos} position={pos} color={currentChar.accentColor} />
      ))}

      {/* Horizontal accent line */}
      <div style={{
        position: 'absolute', top: '18%', left: 0, right: 0, height: 1, zIndex: 3,
        background: `linear-gradient(90deg, transparent, ${currentChar.accentColor}88, transparent)`,
        transition: 'background 0.5s ease',
      }} />

      {/* ========== HUD HEADER ========== */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, fontFamily: "'Share Tech Mono', monospace",
        color: currentChar.accentColor, fontSize: 11, letterSpacing: '0.3em',
        opacity: 0.8, transition: 'color 0.5s ease',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ animation: 'hbarPulse 2s ease infinite', display: 'inline-block', height: 1, background: 'currentColor', width: 40 }} />
        AGENT SELECT // CLASSIFIED
        <span style={{ animation: 'hbarPulse 2s ease infinite 1s', display: 'inline-block', height: 1, background: 'currentColor', width: 40 }} />
      </div>

      {/* ========== MAIN LAYOUT ========== */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', height: '100%',
        maxWidth: 1600, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr',
        padding: '80px 64px 32px',
        boxSizing: 'border-box',
      }}>

        {/* ===== LEFT PANEL: AGENT TAG + SKILLS ===== */}
        <div key={`left-${activeId}`} style={{
          position: 'absolute', left: 48, top: '50%', transform: 'translateY(-40%)',
          zIndex: 30, maxWidth: 340,
          animation: 'slideInLeft 0.4s ease forwards',
        }}>
          {/* Role tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 20,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, letterSpacing: '0.4em',
            color: currentChar.accentColor,
            animation: 'tagBlink 4s ease infinite',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: currentChar.accentColor,
              boxShadow: `0 0 10px ${currentChar.accentColor}`,
              display: 'inline-block',
            }} />
            {currentChar.tag} // ACTIVE
          </div>

          {/* Section title */}
          <div style={{
            borderLeft: `3px solid ${currentChar.accentColor}`,
            paddingLeft: 16, marginBottom: 28,
            transition: 'border-color 0.5s ease',
          }}>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em',
              marginBottom: 4,
            }}>SPECIAL ABILITIES</p>
            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 22, fontWeight: 700, color: '#fff',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{currentChar.subTitle}</h3>
          </div>

          {/* Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {currentChar.skills.map((skill, i) => (
              <div
                key={skill.id}
                className="skill-card"
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 60, height: 60, flexShrink: 0,
                  background: hoveredSkill === skill.id
                    ? currentChar.accentColor
                    : 'rgba(10,15,20,0.85)',
                  border: `2px solid ${hoveredSkill === skill.id ? currentChar.accentColor : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                  boxShadow: hoveredSkill === skill.id ? `0 0 24px ${currentChar.glowColor}, inset 0 0 20px rgba(255,255,255,0.1)` : 'none',
                  transition: 'all 0.25s ease',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}>

               <img 
    src={skill.icon} 
    alt={skill.name}
    style={{ width: '100%', height: '70%', objectFit: 'contain' 
   
  
      
    }}



  />


                </div>

                {/* Text */}
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 18, fontWeight: 700, color: hoveredSkill === skill.id ? currentChar.accentColor : '#fff',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    transition: 'color 0.2s ease',
                  }}>{skill.name}</div>
                  <div style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 10, color: 'rgba(255,255,255,2000.6)',
                    marginTop: 3, letterSpacing: '0.05em',
                    maxHeight: hoveredSkill === skill.id ? 40 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}>{skill.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button style={{
            marginTop: 36,
            background: 'transparent',
            border: `2px solid ${currentChar.accentColor}`,
            color: currentChar.accentColor,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: 13,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            padding: '12px 28px',
            cursor: 'pointer',
            clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'all 0.25s ease',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = currentChar.accentColor;
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = currentChar.accentColor;
            }}
          >
            <span>▶</span>
            <span>ดูสกิลแบบวิดีโอ</span>
          </button>
        </div>

        {/* ===== BIG NAME TEXT (behind character) ===== */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
          zIndex: 10, pointerEvents: 'none', userSelect: 'none', 
          paddingLeft: '16%',             paddingBottom: '26%',           // เพิ่ม

          overflow: 'hidden',
        }}>
          <GlitchText text={currentChar.name} color={currentChar.accentColor} />
        </div>

        {/* ===== CHARACTER IMAGE (in front of name) ===== */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 20, pointerEvents: 'none',
          paddingBottom: 0,
        }}>
          {/* Glow base under char */}
          <div style={{
            position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)',
            width: '30%', height: 80,
            background: `radial-gradient(ellipse, ${currentChar.glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transition: 'background 0.5s ease',
            animation: 'pulseGlow 2.5s ease infinite',
          }} />

          {/* Transition: old image fades out */}
          {transitioning && prevId && (
            <img
              src={CHARACTERS_DATA[prevId].mainImg}
              alt=""
              style={{
                position: 'absolute', bottom: 0,
                height: '90%', objectFit: 'contain', objectPosition: 'bottom',
                opacity: 0, transition: 'opacity 0.3s ease',
                filter: 'blur(4px)',
              }}
            />
          )}

          {/* Current character */}
          <img
            key={`char-${activeId}`}
            src={currentChar.mainImg}
            alt={currentChar.name}
            style={{
              height: '90%', objectFit: 'contain', objectPosition: 'bottom',
              filter: `drop-shadow(0 0 40px ${currentChar.glowColor}) drop-shadow(20px 20px 40px rgba(0,0,0,0.8))`,
              animation: 'charAppear 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
              transition: 'filter 0.5s ease',
            }}
            onError={e => { e.target.style.opacity = 0; }}
          />
        </div>

     

        {/* ===== RIGHT PANEL: CHARACTER SELECTOR ===== */}
        <div style={{
          position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
          zIndex: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.6)', padding: '12px 10px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}>
          {/* Scroll up button */}
          <button
            onClick={scrollUp}
             disabled={CHARACTER_IDS.indexOf(activeId) === 0}
            style={{
              background: 'none', border: 'none',
             color: CHARACTER_IDS.indexOf(activeId) === 0 ? 'rgba(255,255,255,0.2)' : currentChar.accentColor,
              fontSize: 16, cursor: CHARACTER_IDS.indexOf(activeId) === 0 ? 'default' : 'pointer',
              fontSize: 16, cursor: scrollOffset === 0 ? 'default' : 'pointer',
              padding: '4px 8px', transition: 'color 0.2s ease',
              lineHeight: 1,
            }}
          >▲</button>

          {/* Avatar list — only show VISIBLE_COUNT at a time */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
            {visibleIds.map((id, idx) => {
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => changeChar(id)}
                  className="char-btn"
                  style={{
                    width: 72, height: 72,
                    padding: 0, cursor: 'pointer',
                    border: `2px solid ${isActive ? currentChar.accentColor : 'rgba(255,255,255,0.15)'}`,
                    background: 'rgba(10,15,20,0.8)',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: isActive ? `0 0 20px ${currentChar.glowColor}, 0 0 40px ${currentChar.glowColor}` : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    animation: `avatarSlide 0.3s ${idx * 0.06}s ease both`,
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`/images/avatar-${id}.jpg`}
                    alt={CHARACTERS_DATA[id].name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      filter: isActive ? 'brightness(1)' : 'brightness(0.5) grayscale(0.4)',
                      transition: 'filter 0.3s ease',
                    }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {/* Active indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(135deg, ${currentChar.accentColor}22 0%, transparent 60%)`,
                    }} />
                  )}
                  {/* Name label */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                    padding: '10px 4px 4px',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                    color: isActive ? currentChar.accentColor : 'rgba(255,255,255,0.6)',
                    textAlign: 'center', textTransform: 'uppercase',
                    transition: 'color 0.3s ease',
                  }}>
                    {CHARACTERS_DATA[id].name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scroll down button */}
          <button
            onClick={scrollDown}
             disabled={CHARACTER_IDS.indexOf(activeId) === CHARACTER_IDS.length - 1}
            style={{
              background: 'none', border: 'none',
              color: CHARACTER_IDS.indexOf(activeId) === CHARACTER_IDS.length - 1 ? 'rgba(255,255,255,0.2)' : currentChar.accentColor,
              fontSize: 16, cursor: scrollOffset >= MAX_OFFSET ? 'default' : 'pointer',
              padding: '4px 8px', transition: 'color 0.2s ease',
              lineHeight: 1,
            }}
          >▼</button>

          {/* Scroll position indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
            {CHARACTER_IDS.map(id => (
              <div key={id} style={{
                width: 4, height: 4, borderRadius: '50%',
                background: activeId === id ? currentChar.accentColor : 'rgba(255,255,255,0.2)',
                boxShadow: activeId === id ? `0 0 6px ${currentChar.accentColor}` : 'none',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}