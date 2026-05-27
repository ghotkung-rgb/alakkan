import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Agents from './components/Agents';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('HOME');

  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] font-sans text-black select-none"
         style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeMenu === 'HOME' && <Home />}
        {activeMenu === 'AGENTS' && <Agents />}

        {activeMenu !== 'HOME' && activeMenu !== 'AGENTS' && (
          <div className="w-full h-full flex items-center justify-center bg-[#111] text-gray-500">
            <p className="text-xl italic font-bold">🎯 หน้า [{activeMenu}] กำลังอยู่ในช่วงพัฒนา...</p>
          </div>
        )}
      </div>

    </div>
  );
}