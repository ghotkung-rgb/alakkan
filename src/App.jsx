import { useState, useEffect } from 'react';
import { FiTarget } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TopupPage from './components/TopupPage';
import TopupHub from './components/TopupHub';
import MailPassHub from './components/MailPassHub';
import MailPassPage from './components/MailPassPage';
import News from './components/News';
import AdminPage from './components/AdminPage';
import { GAMES } from './config/games';
import { MAILPASS_GAMES } from './config/mailpassGames';

// ── URL hash ↔ nav state (ทำให้ refresh แล้วยังอยู่หน้าเดิม) ──
const stateToHash = (s) => {
  if (s.topupGame)    return `topup/${encodeURIComponent(s.topupGame)}`;
  if (s.mailpassGame) return `mailpass/${encodeURIComponent(s.mailpassGame)}`;
  const m = { HOME: 'home', 'ข่าวสาร': 'news', 'บริการเติมเกม': 'topup', 'บริการ Mail/Pass': 'mailpass', ADMIN: 'admin' };
  return m[s.activeMenu] ?? 'home';
};
const hashToState = (hash) => {
  const h = (hash || '').replace(/^#/, '');
  if (h.startsWith('topup/'))    return { activeMenu: 'HOME', topupGame: decodeURIComponent(h.slice(6)),    mailpassGame: null, topupStep: 1, mailpassStep: 1 };
  if (h.startsWith('mailpass/')) return { activeMenu: 'HOME', topupGame: null, mailpassGame: decodeURIComponent(h.slice(9)), topupStep: 1, mailpassStep: 1 };
  const m = { '': 'HOME', home: 'HOME', news: 'ข่าวสาร', topup: 'บริการเติมเกม', mailpass: 'บริการ Mail/Pass', admin: 'ADMIN' };
  return { activeMenu: m[h] ?? 'HOME', topupGame: null, mailpassGame: null, topupStep: 1, mailpassStep: 1 };
};

export default function App() {
  const [activeMenu, setActiveMenu]     = useState(() => hashToState(window.location.hash).activeMenu);
  const [topupGame, setTopupGame]       = useState(() => hashToState(window.location.hash).topupGame);
  const [mailpassGame, setMailpassGame] = useState(() => hashToState(window.location.hash).mailpassGame);
  const [topupStep, setTopupStep]       = useState(1);
  const [mailpassStep, setMailpassStep] = useState(1);
  const [viewKey, setViewKey]           = useState(0);
  const [exiting, setExiting]           = useState(false);

  // ── apply nav state หลัง exit animation ──
  const applyNav = (s) => {
    setActiveMenu(s.activeMenu ?? 'HOME');
    setTopupGame(s.topupGame ?? null);
    setMailpassGame(s.mailpassGame ?? null);
    setTopupStep(s.topupStep ?? 1);
    setMailpassStep(s.mailpassStep ?? 1);
    setViewKey(k => k + 1);
    setExiting(false);
  };

  // ── นำทาง + บันทึกลงประวัติเบราเซอร์ + อัป hash URL ──
  const navigate = (next) => {
    const view = { activeMenu, topupGame, mailpassGame, topupStep: 1, mailpassStep: 1, ...next };
    window.history.pushState(view, '', '#' + stateToHash(view));
    setExiting(true);
    setTimeout(() => applyNav(view), 160);
  };

  // ── เปลี่ยน step ภายในหน้าเติมเกม (hash ไม่เปลี่ยน แค่บันทึก step ลง history) ──
  const navigateTopupStep = (newStep) => {
    setTopupStep(newStep);
    window.history.pushState({ activeMenu, topupGame, mailpassGame, topupStep: newStep, mailpassStep }, '', '#' + stateToHash({ activeMenu, topupGame, mailpassGame }));
  };
  const navigateMailpassStep = (newStep) => {
    setMailpassStep(newStep);
    window.history.pushState({ activeMenu, topupGame, mailpassGame, topupStep, mailpassStep: newStep }, '', '#' + stateToHash({ activeMenu, topupGame, mailpassGame }));
  };

  const goTopup    = (gameId) => navigate({ topupGame: gameId, mailpassGame: null, topupStep: 1 });
  const goMailPass = (gameId) => navigate({ mailpassGame: gameId, topupGame: null, mailpassStep: 1 });
  const backFromTopup    = () => window.history.back();
  const backFromMailPass = () => window.history.back();

  useEffect(() => {
    // seed history entry แรก พร้อม hash ปัจจุบัน
    const initState = hashToState(window.location.hash);
    window.history.replaceState(
      { ...initState, topupStep: 1, mailpassStep: 1 },
      '',
      '#' + stateToHash(initState),
    );

    // คืน scroll position หลัง refresh
    const saved = sessionStorage.getItem('scrollPos');
    if (saved) {
      try {
        const { hash, y } = JSON.parse(saved);
        if (hash === window.location.hash && y > 0) {
          setTimeout(() => window.scrollTo(0, y), 80);
        }
      } catch {}
      sessionStorage.removeItem('scrollPos');
    }

    // บันทึก scroll ก่อน refresh
    const saveScroll = () => {
      sessionStorage.setItem('scrollPos', JSON.stringify({
        hash: window.location.hash,
        y: window.scrollY,
      }));
    };
    window.addEventListener('beforeunload', saveScroll);

    const handlePopState = (e) => {
      const s = e.state || hashToState(window.location.hash);
      setExiting(true);
      setTimeout(() => applyNav(s), 160);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', saveScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setActiveMenu(m => m === 'ADMIN' ? 'HOME' : 'ADMIN');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const showTopup    = topupGame    && GAMES[topupGame];
  const showMailPass = mailpassGame && MAILPASS_GAMES[mailpassGame];

  const handleMenuChange = (menu) => navigate({ activeMenu: menu, topupGame: null, mailpassGame: null });

  const KNOWN_MENUS = ['HOME', 'ข่าวสาร', 'บริการเติมเกม', 'บริการ Mail/Pass', 'ADMIN'];

  return (
    <div className="relative w-full min-h-screen font-sans text-black select-none"
         style={{ background: '#e8f4ff', display: 'flex', flexDirection: 'column' }}>

      {activeMenu !== 'ADMIN' && (
        <Navbar activeMenu={activeMenu} setActiveMenu={handleMenuChange} onLogin={() => handleMenuChange('ADMIN')} />
      )}

      <div key={viewKey} className={exiting ? 'page-exit' : 'page-enter'} style={{ flex: 1 }}>
        {showTopup ? (
          <TopupPage key={topupGame} game={GAMES[topupGame]} onBack={backFromTopup} step={topupStep} onStep={navigateTopupStep} />
        ) : showMailPass ? (
          <MailPassPage game={MAILPASS_GAMES[mailpassGame]} onBack={backFromMailPass} step={mailpassStep} onStep={navigateMailpassStep} />
        ) : (
          <>
            {activeMenu === 'HOME' && <Home onTopup={goTopup} onMailPass={goMailPass} />}
            {activeMenu === 'ข่าวสาร' && <News />}
            {activeMenu === 'บริการเติมเกม' && (
              <TopupHub onSelectGame={goTopup} onBack={() => handleMenuChange('HOME')} />
            )}
            {activeMenu === 'บริการ Mail/Pass' && (
              <MailPassHub onSelectGame={goMailPass} onBack={() => handleMenuChange('HOME')} />
            )}
            {activeMenu === 'ADMIN' && <AdminPage onHome={() => handleMenuChange('HOME')} />}
            {!KNOWN_MENUS.includes(activeMenu) && (
              <div className="w-full h-full flex items-center justify-center bg-[#f0f4f8] text-[#334155]">
                <p className="text-xl italic font-bold" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiTarget /> หน้า [{activeMenu}] กำลังอยู่ในช่วงพัฒนา...</p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
