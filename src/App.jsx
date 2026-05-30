import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Agents from './components/Agents';
import TopupPage from './components/TopupPage';
import TopupHub from './components/TopupHub';
import News from './components/News';
import { GAMES } from './config/games';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('HOME');
  const [topupGame, setTopupGame] = useState(null);

  const goTopup = (gameId) => {
    setTopupGame(gameId);
    window.history.pushState({ topupGame: gameId }, '');
  };

  const backFromTopup = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = () => setTopupGame(null);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showTopup = topupGame && GAMES[topupGame];

  return (
    <div className="relative w-full min-h-screen font-sans text-black select-none"
         style={{ background: '#e8f4ff', display: 'flex', flexDirection: 'column' }}>

      <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div style={{ flex: 1 }}>
        {showTopup ? (
          <TopupPage game={GAMES[topupGame]} onBack={backFromTopup} />
        ) : (
          <>
            {activeMenu === 'HOME' && <Home onTopup={goTopup} />}
            {activeMenu === 'AGENTS' && <Agents />}
            {activeMenu === 'ข่าวสาร' && <News />}
            {activeMenu === 'บริการเติมเกม' && (
              <TopupHub onSelectGame={goTopup} onBack={() => setActiveMenu('HOME')} />
            )}
            {activeMenu !== 'HOME' && activeMenu !== 'AGENTS' && activeMenu !== 'ข่าวสาร' && activeMenu !== 'บริการเติมเกม' && (
              <div className="w-full h-full flex items-center justify-center bg-[#111] text-gray-500">
                <p className="text-xl italic font-bold">🎯 หน้า [{activeMenu}] กำลังอยู่ในช่วงพัฒนา...</p>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
