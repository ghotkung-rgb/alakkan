import { useState, useEffect, useRef, useCallback } from 'react';

const HERO_MASCOT_IMG = "/images/ALASKAN_WEB_ASSET/BACKGROUND/home/alaskan_mascot1.png";
const HERO_GR_IMG = "/images/GR1.png";
const HERO_BG1_IMG = "/images/ALASKAN_WEB_ASSET/BACKGROUND/home/BLACKGROUD2.png";

// ── Slide-0 background position ──────────────────────────────
const bg1Right   = '15%';                        // เยื้องขวา
const bg1Bottom  = '-5%';                        // ระยะจากล่าง
const bg1Height  = 'clamp(200px, 55vw, 780px)'; // ควบคุมด้วย height (รูป 3:1)
const bg1Opacity = 0.85;                         // ความโปร่งแสง

// แก้รูปสไลค์บนสุด
const SLIDES = [
  { type: 'brand', mascot: HERO_MASCOT_IMG, thumb: HERO_MASCOT_IMG },
  { type: 'promo', bg: '/images/Silde%20show/HOME WEB SLIDESHOW_1Alaskan.png' },
  {
    type: 'layer',
    bg: '/images/Silde%20show/LAYER/HOME%20WEB%20SLIDESHOW_1Freefire-1bg.png',
    layers: [
      { src: '/images/Silde%20show/LAYER/HOME%20WEB%20SLIDESHOW_1Freefire-2text.png',      cls: 'hs-layer-text'  },
      { src: '/images/Silde%20show/LAYER/HOME%20WEB%20SLIDESHOW_1Freefire-3character.png', cls: 'hs-layer-char1' },
      { src: '/images/Silde%20show/LAYER/HOME%20WEB%20SLIDESHOW_1Freefire-4character.png', cls: 'hs-layer-char2' },
    ],
    thumb: '/images/GAMES BG/FREEFIRE_bg.png',
  },
  { type: 'video', src: '/images/Silde%20show/PUBG1.mp4', src2: '/images/Silde%20show/PUBG2.mp4', thumb: '/images/GAMES BG/PUBGMOBILE_bg.png' },
  { type: 'promo', bg: '/images/PRO/rov_promotion_web1_ai.png', bgPos: 'center center', thumb: '/images/PRO/rov_promotion_web1_ai.png' },
  { type: 'promo', bg: '/images/Silde%20show/PUBGE1.png', bgPos: 'center center', thumb: '/images/MAIL/FC_FOOBALL3.png' },
  { type: 'promo', bg: '/images/Silde%20show/EFOOBALL.png', bgPos: 'center center', thumb: '/images/PRO/Alaskan_freefire_banner_web_ai.png' },
  { type: 'promo', bg: '/images/Silde%20show/HEARTOPIA.png', bgPos: 'center center', thumb: '/images/PRO/Alaskan_freefire_banner_web2_ai.png' },
  { type: 'promo', bg: '/images/BG_UID/FF.png', bgPos: 'center center', thumb: '/images/GAMES ICON/FREEFIRE_iconapp.png' },
];

function BrandSlide({ slide }) {
  const grH = 'clamp(300px, 48vw, 680px)';
  const grMoveX = '0vw';
  const grMoveY = '15vh';
  const mascotMoveX = '0vw';
  const mascotMoveY = '0vh';

  return (
    <div className="hero-inner" style={{ height: '100%', paddingTop: 0 }}>
      {!slide.blend && (
        <img
          src={HERO_BG1_IMG}
          alt=""
          style={{
            position: 'absolute',
            right: bg1Right,
            bottom: bg1Bottom,
            height: bg1Height,
            width: 'auto',
            opacity: bg1Opacity,
            pointerEvents: 'none',
            zIndex: 0,
            animation: `slideFromRight 1.0s 0.8s ease both`,
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
      <img
        src={slide.blend ? '/images/effect/TOPRED.png' : '/images/effect/TOPBLUE.png'}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '28%',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'slideFromTopRight 1.0s 0.1s ease both',
        }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      <img
        src={slide.blend ? '/images/effect/DOWNRED.png' : '/images/effect/DOWNBLUE.png'}
        alt=""
        style={{
          position: 'absolute',
          bottom: '11vh',
          left: 0,
          width: '28%',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'slideFromBottomLeft 1.0s 0.3s ease both',
        }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div className="hero-text-wrap">
        <span className="hero-text-alaskan">ALASKAN</span>
        <span className="hero-text-sub">
          <span>TOPUP</span>
          <span className="hero-text-gap" />
          <span>GAME ONLINE</span>
        </span>
      </div>
      <img
        className="hero-mascot"
        src={slide.mascot}
        alt="mascot"
        style={slide.blend
          ? { mixBlendMode: 'multiply', height: grH, marginTop: grMoveY, marginLeft: grMoveX }
          : { marginTop: mascotMoveY, marginLeft: mascotMoveX }}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  );
}

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState('down');
  const timerRef = useRef(null);
  const videoRefs = useRef([]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCur(c => (c + 1) % SLIDES.length);
      setDir('down');
      setAnimKey(k => k + 1);
    }, 5000);
  }, []);

  // useEffect(() => {
  //   startTimer();
  //   return () => clearInterval(timerRef.current);
  // }, [startTimer]);

  // pause วิดีโอที่ไม่ active, play วิดีโอที่ active (รองรับ split 2 ตัว)
  useEffect(() => {
    SLIDES.forEach((s, i) => {
      const v  = videoRefs.current[i];
      const v2 = videoRefs.current[`${i}b`];
      if (i === cur) {
        if (v)  { v.currentTime  = 0; v.play().catch(() => {}); }
        if (v2) { v2.currentTime = 0; v2.play().catch(() => {}); }
      } else {
        if (v)  v.pause();
        if (v2) v2.pause();
      }
    });
  }, [cur]);

  const goTo = (idx) => {
    if (idx === cur) return;
    setDir(idx > cur ? 'down' : 'up');
    setCur(idx);
    setAnimKey(k => k + 1);
  };

  const goPrev = () => {
    setCur(c => (c - 1 + SLIDES.length) % SLIDES.length);
    setDir('up');
    setAnimKey(k => k + 1);
  };

  const goNext = () => {
    setCur(c => (c + 1) % SLIDES.length);
    setDir('down');
    setAnimKey(k => k + 1);
  };

  const slide = SLIDES[cur];

  return (
    <div className="hero-slider">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hs-bg${i === cur ? ' active' : ''}`}
          style={s.type === 'brand'
            ? { backgroundColor: 'transparent' }
            : s.type === 'video'
            ? { backgroundColor: '#000' }
            : {
                backgroundImage: s.bg ? `url("${s.bg}")` : 'none',
                backgroundSize: s.bgSize || 'cover',
                backgroundPosition: s.bgPos || 'center center',
                backgroundColor: s.bgColor || 'transparent',
              }}
        >
          {s.type === 'video' && !s.src2 && (
            <video
              ref={el => { videoRefs.current[i] = el; }}
              src={s.src}
              muted loop playsInline
              preload="none"
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
            />
          )}
          {s.type === 'video' && s.src2 && (
            <div style={{ position:'absolute', inset:0, display:'flex' }}>
              <video
                ref={el => { videoRefs.current[i] = el; }}
                src={s.src}
                muted loop playsInline preload="none"
                style={{ width:'50%', height:'100%', objectFit:'cover', flexShrink:0 }}
              />
              <video
                ref={el => { videoRefs.current[`${i}b`] = el; }}
                src={s.src2}
                muted loop playsInline preload="none"
                style={{ width:'50%', height:'100%', objectFit:'cover', flexShrink:0 }}
              />
            </div>
          )}
        </div>
      ))}

      {slide.type === 'brand' && <div className="hs-overlay" style={{ background: 'none' }} />}

      <div key={animKey} className={`hs-content hs-anim-${dir}`}>
        {slide.type === 'brand' && <BrandSlide slide={slide} />}
      </div>

      {slide.type === 'layer' && (
        <div key={`layer-${animKey}`} className="hs-layer-overlay">
          {slide.layers.map((l, i) => (
            <img key={i} src={l.src} alt="" className={l.cls}
              onError={e => { e.target.style.display = 'none'; }} />
          ))}
        </div>
      )}

      <div className="hs-dots">
        <button className="hs-nav-btn" onClick={goPrev}>&#9664;</button>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width:  i === cur ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === cur ? '#00d1ff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
          />
        ))}
        <button className="hs-nav-btn" onClick={goNext}>&#9654;</button>
      </div>
    </div>
  );
}
