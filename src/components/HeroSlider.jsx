import { useState, useEffect, useRef, useCallback } from 'react';
import { FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';


// แก้รูปสไลค์บนสุด
const SLIDES = [
   { type: 'video', src: '/images/Silde%20show/0001.mp4', loop: false },
  // { type: 'brand', mascot: HERO_MASCOT_IMG, thumb: HERO_MASCOT_IMG },
  // { type: 'video', src: '/images/Silde%20show/LAYER/EFOOTBALL/EFOOTBALL.mp4', loop: true },
  // { type: 'layer', bg: '/images/Silde%20show/LAYER/FF/HOME%20WEB%20SLIDESHOW_1Freefire-1bg.png', layers: [ { src: '/images/Silde%20show/LAYER/FF/text.png', cls: 'hs-layer-text' }, { src: '/images/Silde%20show/LAYER/FF/text2.png', cls: 'hs-layer-text2' }, { src: '/images/Silde%20show/LAYER/FF/HOME%20WEB%20SLIDESHOW_1Freefire-3character.png', cls: 'hs-layer-char1' }, { src: '/images/Silde%20show/LAYER/FF/HOME%20WEB%20SLIDESHOW_1Freefire-4character.png', cls: 'hs-layer-char2' } ], thumb: '/images/GAMES BG/FREEFIRE_bg.png' },
  // { type: 'layer', bg: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV-1bg.png', layers: [ { src: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV-2shape.png', cls: 'hs-rov-shape' }, { src: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV-2laville.png', cls: 'hs-rov-char' }, { src: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV-2tagname.png', cls: 'hs-rov-tagname' }, { src: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV-2text.png', cls: 'hs-rov-text' } ], thumb: '/images/Silde%20show/LAYER/ROV/HOME%20WEB%20SLIDESHOW_2ROV.png' },
  {
    type: 'layer',
    bg: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-1bg.png',
    layers: [
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-bg2.png',       cls: 'hs-hok-bg2'   },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-item1.png',      cls: 'hs-hok-item1' },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-item2.png',      cls: 'hs-hok-item2' },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-character1.png', cls: 'hs-hok-char1' },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-character2.png', cls: 'hs-hok-char2' },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-honor.png',      cls: 'hs-hok-logo'  },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-text1.png',      cls: 'hs-hok-text1' },
      { src: '/images/Silde%20show/LAYER/PUBG/HOME%20WEB%20SLIDESHOW_3PUBGM-text2.png',      cls: 'hs-hok-text2' },
    ],
    thumb: '/images/GAMES%20BG/HONOROFKINGS_bg.png',
  },
  {
    type: 'layer',
    bg: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-bg.png',
    layers: [
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-smoke.png', cls: 'hs-fcm-smoke' },
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-fc2.png',   cls: 'hs-fcm-fc2'   },
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-logo.png',  cls: 'hs-fcm-logo'  },
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-fc3.png',   cls: 'hs-fcm-fc3'   },
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-fc1.png',   cls: 'hs-fcm-fc1'   },
      { src: '/images/Silde%20show/LAYER/FC_MOBILE/HOME%20WEB%20SLIDESHOW_5FCMOBILE-text.png',  cls: 'hs-fcm-text'  },
    ],
    thumb: '/images/GAMES%20ICON/FCMOBILE_iconapp.png',
  },
  
  { type: 'video', src: '/images/Silde%20show/LAYER/EFOOTBALL/EFOOTBALL_Video.mp4', loop: false },
];


export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState('down');
  const [videoMuted, setVideoMuted] = useState(true);
  const timerRef = useRef(null);
  const videoRefs = useRef([]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCur(c => (c + 1) % SLIDES.length);
      setDir('down');
      setAnimKey(k => k + 1);
    }, 15000);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur(c => (c + 1) % SLIDES.length);
      setDir('down');
      setAnimKey(k => k + 1);
    }, 15000);
    return () => clearInterval(timerRef.current);
  }, []);

  // sync muted state imperatively — React's muted prop doesn't update after mount
  useEffect(() => {
    const v = videoRefs.current[cur];
    if (v) v.muted = videoMuted;
  }, [videoMuted, cur]);

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
    startTimer();
  };

  const goPrev = () => {
    setCur(c => (c - 1 + SLIDES.length) % SLIDES.length);
    setDir('up');
    setAnimKey(k => k + 1);
    startTimer();
  };

  const goNext = () => {
    setCur(c => (c + 1) % SLIDES.length);
    setDir('down');
    setAnimKey(k => k + 1);
    startTimer();
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
              muted loop={s.loop !== false} playsInline
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

      <div key={animKey} className={`hs-content hs-anim-${dir}`}>
      </div>

      {slide.type === 'layer' && (
        <div key={`layer-${animKey}`} className="hs-layer-overlay">
          {slide.layers.map((l, i) =>
            l.asBg
              ? <div key={i} className={l.cls} style={{ backgroundImage: `url("${l.src}")` }} />
              : <img key={i} src={l.src} alt="" className={l.cls}
                  onError={e => { e.target.style.display = 'none'; }} />
          )}
        </div>
      )}

      {slide.type === 'video' && (
        <button
          className="hs-sound-btn"
          onClick={() => setVideoMuted(m => !m)}
          title={videoMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
        >
          {videoMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
        </button>
      )}

      <div className="hs-dots">
        <button className="hs-nav-btn" onClick={goPrev}><FiChevronLeft size={16} /></button>
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
        <button className="hs-nav-btn" onClick={goNext}><FiChevronRight size={16} /></button>
      </div>
    </div>
  );
}
