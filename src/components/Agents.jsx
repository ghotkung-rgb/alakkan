import { useEffect, useState } from 'react';
import { FiActivity, FiChevronLeft, FiChevronRight, FiClock, FiShield, FiTarget, FiZap } from 'react-icons/fi';
import { GiBrickWall, GiMedicines, GiUnlitBomb } from 'react-icons/gi';

const AGENTS = [
  {
    id: 'blaze',
    name: 'BLAZE',
    role: 'Rush Specialist',
    status: 'ACTIVE',
    motto: 'เปิดจังหวะเร็ว เคลียร์พื้นที่ไว เหมาะกับงานที่ต้องตัดสินใจเฉียบ',
    bio: 'สายบุกแนวหน้า ใช้ความเร็วและแรงกดดันเพื่อสร้างพื้นที่ให้ทีมเข้าเติมเกมและปิดงานแบบมั่นใจ',
    portrait: '/images/GR1.png',
    avatar: '/images/GR.png',
    backdrop: '/images/BG-red.png',
    accent: '#ff4d4d',
    softAccent: 'rgba(255,77,77,0.22)',
    stats: { speed: 92, control: 74, support: 68 },
    skills: [
      { name: 'Flash Entry', desc: 'เปิดไฟต์และบังคับจังหวะคู่ต่อสู้', icon: FiZap },
      { name: 'Close Combat', desc: 'คุมระยะประชิดและปิดงานไว', icon: FiTarget },
    ],
  },
  {
    id: 'jackal',
    name: 'JACKAL',
    role: 'Support Operator',
    status: 'READY',
    motto: 'นิ่งกว่า เดินเกมเป็นระบบกว่า ดูแลหลังบ้านให้ทีมขยับง่าย',
    bio: 'สายซัพพอร์ตที่ออกแบบมาให้หน้าบริการดูน่าเชื่อถือขึ้น เน้นความปลอดภัย ความชัดเจน และการประคองงานจนจบ',
    portrait: '/images/jackson.png',
    avatar: '/images/AGENT/small_logo.jpg',
    backdrop: '/images/1-bg.png',
    accent: '#00d1ff',
    softAccent: 'rgba(0,209,255,0.22)',
    stats: { speed: 68, control: 83, support: 96 },
    skills: [
      { name: 'Recovery Drone', desc: 'ดูแลรายการที่ต้องตรวจสอบต่อเนื่อง', icon: GiMedicines },
      { name: 'Secure Guard', desc: 'ลดความเสี่ยงและปกป้องข้อมูลลูกค้า', icon: FiShield },
    ],
  },
  {
    id: 'watchman',
    name: 'WATCHMAN',
    role: 'System Sentinel',
    status: 'STANDBY',
    motto: 'เฝ้าระบบ จัดระเบียบ และกันความผิดพลาดก่อนถึงมือลูกค้า',
    bio: 'เจ้าหน้าที่สายควบคุม เหมาะกับงานที่ต้องจัดการหลายรายการพร้อมกัน มองเห็นภาพรวมและแยก priority ได้ดี',
    portrait: '/images/all.png',
    avatar: '/images/ALASKAN_WEB_ASSET/PNG/alaskan_logo.png',
    backdrop: '/images/GAMES BG/DELTAFORCE_bg.png',
    accent: '#f5c84c',
    softAccent: 'rgba(245,200,76,0.2)',
    stats: { speed: 61, control: 97, support: 79 },
    skills: [
      { name: 'Order Grid', desc: 'จัดคิวงานและป้องกันรายการตกหล่น', icon: GiBrickWall },
      { name: 'Live Scan', desc: 'อ่านสถานะและจับปัญหาก่อนลุกลาม', icon: FiActivity },
    ],
  },
  {
    id: 'cyan',
    name: 'CYAN',
    role: 'Stealth Analyst',
    status: 'ONLINE',
    motto: 'ทำงานเงียบ ตรวจละเอียด และเข้าถึงข้อมูลเท่าที่จำเป็น',
    bio: 'สายวิเคราะห์สำหรับ flow ที่ละเอียดอย่าง Mail/Pass เน้นความรอบคอบ ความปลอดภัย และการสื่อสารที่ไม่ทำให้ลูกค้ากังวล',
    portrait: '/images/GR.png',
    avatar: '/images/skill_1.png',
    backdrop: '/images/GAMES BG/VALORANT_bg.png',
    accent: '#45f0c1',
    softAccent: 'rgba(69,240,193,0.18)',
    stats: { speed: 77, control: 86, support: 88 },
    skills: [
      { name: 'Silent Check', desc: 'ตรวจข้อมูลสำคัญโดยไม่รบกวน flow', icon: FiClock },
      { name: 'Signal Jam', desc: 'กรองความผิดพลาดก่อนยืนยันรายการ', icon: GiUnlitBomb },
    ],
  },
];

const METRICS = [
  { label: 'Agents', value: '04' },
  { label: 'Service Modes', value: 'UID / M-P' },
  { label: 'Queue Guard', value: '24H' },
];

function AgentStat({ label, value, color }) {
  return (
    <div className="agent-stat">
      <div className="agent-stat-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="agent-stat-track">
        <span style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function SkillIcon({ icon: Icon, color }) {
  return (
    <div className="agent-skill-icon" style={{ color, borderColor: `${color}66`, boxShadow: `0 0 24px ${color}33` }}>
      <Icon size={22} />
    </div>
  );
}

export default function Agents() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = AGENTS[activeIndex];

  useEffect(() => {
    AGENTS.forEach(agent => {
      [agent.portrait, agent.avatar, agent.backdrop].forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  const goPrev = () => setActiveIndex(index => (index - 1 + AGENTS.length) % AGENTS.length);
  const goNext = () => setActiveIndex(index => (index + 1) % AGENTS.length);

  return (
    <section className="agents-page" style={{ '--agent-bg': `url("${active.backdrop}")` }}>
      <style>{`
        .agents-page {
          --agent-accent: ${active.accent};
          --agent-soft: ${active.softAccent};
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #070b10;
          color: #f8fafc;
          font-family: 'Noto Sans Thai', sans-serif;
          isolation: isolate;
        }
        .agents-page::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -3;
          background-image: var(--agent-bg);
          background-size: cover;
          background-position: center;
          filter: saturate(1.15) brightness(0.62);
          transform: scale(1.04);
          animation: agent-bg-in 0.55s ease both;
        }
        .agents-page::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(circle at 64% 52%, var(--agent-soft) 0%, transparent 34%),
            linear-gradient(90deg, rgba(7,11,16,0.96) 0%, rgba(7,11,16,0.74) 42%, rgba(7,11,16,0.24) 72%, rgba(7,11,16,0.84) 100%),
            linear-gradient(180deg, rgba(7,11,16,0.35) 0%, rgba(7,11,16,0.05) 35%, #070b10 100%);
        }
        .agents-noise {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 78%, transparent 100%);
        }
        .agents-shell {
          min-height: 100vh;
          max-width: 1480px;
          margin: 0 auto;
          padding: clamp(92px, 9vw, 126px) clamp(18px, 4vw, 56px) 34px;
          display: grid;
          grid-template-columns: minmax(290px, 0.9fr) minmax(360px, 1.15fr) minmax(250px, 0.8fr);
          gap: clamp(18px, 3vw, 42px);
          align-items: end;
        }
        .agents-copy {
          align-self: center;
          animation: agent-panel-in 0.45s ease both;
        }
        .agents-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--agent-accent);
          font-family: 'Good Times Rg', 'Noto Sans Thai', sans-serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .agents-kicker::before {
          content: '';
          width: 34px;
          height: 2px;
          background: currentColor;
          box-shadow: 0 0 16px currentColor;
        }
        .agents-title {
          margin: 0;
          font-family: 'Ethnocentric', 'Good Times Rg', sans-serif;
          font-size: clamp(48px, 8vw, 104px);
          line-height: 0.88;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 18px 46px rgba(0,0,0,0.42), 0 0 34px var(--agent-soft);
        }
        .agents-role {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #101820;
          background: var(--agent-accent);
          padding: 8px 14px;
          font-family: 'Good Times Rg', 'Noto Sans Thai', sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }
        .agents-motto {
          margin: 24px 0 0;
          max-width: 460px;
          font-size: clamp(17px, 1.8vw, 24px);
          line-height: 1.48;
          font-weight: 800;
          color: #f8fafc;
        }
        .agents-bio {
          margin: 14px 0 0;
          max-width: 520px;
          color: rgba(226,232,240,0.78);
          font-size: 14px;
          line-height: 1.85;
        }
        .agents-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
          max-width: 520px;
        }
        .agents-metric {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(4,8,14,0.58);
          padding: 13px 14px;
          clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
        }
        .agents-metric strong {
          display: block;
          color: #fff;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 18px;
          letter-spacing: 0.08em;
        }
        .agents-metric span {
          display: block;
          color: rgba(226,232,240,0.58);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 5px;
        }
        .agents-stage {
          position: relative;
          min-height: clamp(460px, 68vh, 760px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .agents-stage::before {
          content: '';
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: 3%;
          height: 22%;
          background: radial-gradient(ellipse, var(--agent-soft) 0%, transparent 70%);
          filter: blur(18px);
        }
        .agents-portrait {
          position: relative;
          z-index: 2;
          max-height: clamp(410px, 72vh, 790px);
          max-width: min(96%, 560px);
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 0 34px var(--agent-soft)) drop-shadow(22px 24px 36px rgba(0,0,0,0.64));
          animation: agent-portrait-in 0.48s ease both;
        }
        .agents-name-ghost {
          position: absolute;
          left: 50%;
          bottom: 14%;
          transform: translateX(-50%);
          z-index: 1;
          font-family: 'Ethnocentric', sans-serif;
          font-size: clamp(58px, 9vw, 148px);
          letter-spacing: 0.08em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.14);
          opacity: 0.7;
          white-space: nowrap;
          pointer-events: none;
        }
        .agents-panel {
          align-self: center;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: agent-panel-in 0.5s 0.05s ease both;
        }
        .agents-card {
          border: 1px solid rgba(255,255,255,0.13);
          background: linear-gradient(145deg, rgba(9,15,24,0.86), rgba(7,11,16,0.68));
          backdrop-filter: blur(16px);
          padding: 20px;
          clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
          box-shadow: 0 22px 54px rgba(0,0,0,0.28);
        }
        .agents-card-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          font-family: 'Good Times Rg', 'Noto Sans Thai', sans-serif;
          color: #fff;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .agents-card-title span {
          color: var(--agent-accent);
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
        }
        .agent-stat + .agent-stat {
          margin-top: 14px;
        }
        .agent-stat-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(226,232,240,0.72);
          font-size: 12px;
          margin-bottom: 7px;
        }
        .agent-stat-head strong {
          color: #fff;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 12px;
        }
        .agent-stat-track {
          height: 7px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
        }
        .agent-stat-track span {
          display: block;
          height: 100%;
          box-shadow: 0 0 16px currentColor;
        }
        .agents-skills {
          display: grid;
          gap: 12px;
        }
        .agents-skill {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 12px;
          align-items: center;
          padding: 10px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .agents-skill:hover {
          transform: translateX(-5px);
          border-color: color-mix(in srgb, var(--agent-accent), transparent 35%);
          background: rgba(255,255,255,0.085);
        }
        .agent-skill-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          background: rgba(0,0,0,0.28);
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        .agents-skill strong {
          display: block;
          color: #fff;
          font-size: 14px;
          letter-spacing: 0.02em;
        }
        .agents-skill p {
          margin: 3px 0 0;
          color: rgba(226,232,240,0.62);
          font-size: 12px;
          line-height: 1.55;
        }
        .agents-roster {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .agents-roster-btn {
          position: relative;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.35);
          min-height: 86px;
          cursor: pointer;
          overflow: hidden;
          padding: 0;
          transition: transform 0.18s ease, border-color 0.18s ease;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        .agents-roster-btn:hover {
          transform: translateY(-3px);
          border-color: var(--agent-accent);
        }
        .agents-roster-btn.is-active {
          border-color: var(--agent-accent);
          box-shadow: 0 0 20px var(--agent-soft);
        }
        .agents-roster-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.72;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .agents-roster-btn.is-active img,
        .agents-roster-btn:hover img {
          opacity: 1;
          transform: scale(1.08);
        }
        .agents-roster-btn span {
          position: absolute;
          left: 7px;
          right: 7px;
          bottom: 6px;
          color: #fff;
          font-family: 'Good Times Rg', sans-serif;
          font-size: 8px;
          letter-spacing: 0.04em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
        }
        .agents-controls {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .agents-control {
          width: 46px;
          height: 42px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
        }
        .agents-control:hover {
          color: #071016;
          background: var(--agent-accent);
          transform: translateY(-2px);
        }
        @keyframes agent-bg-in {
          from { opacity: 0; transform: scale(1.08); }
          to { opacity: 1; transform: scale(1.04); }
        }
        @keyframes agent-panel-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes agent-portrait-in {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 1120px) {
          .agents-shell {
            grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
            align-items: center;
          }
          .agents-stage {
            grid-column: 2;
            grid-row: 1 / span 2;
          }
          .agents-panel {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
          }
        }
        @media (max-width: 760px) {
          .agents-shell {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            padding-top: 88px;
          }
          .agents-copy {
            order: 1;
          }
          .agents-stage {
            order: 2;
            min-height: 390px;
            margin: -10px -18px 0;
          }
          .agents-panel {
            order: 3;
            display: flex;
          }
          .agents-title {
            font-size: clamp(42px, 15vw, 72px);
          }
          .agents-metrics {
            grid-template-columns: 1fr;
          }
          .agents-portrait {
            max-height: 440px;
            max-width: 86%;
          }
          .agents-name-ghost {
            font-size: clamp(42px, 16vw, 82px);
            bottom: 22%;
          }
          .agents-roster {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="agents-noise" />
      <div className="agents-shell">
        <div className="agents-copy" key={`copy-${active.id}`}>
          <div className="agents-kicker">ALASKAN AGENT ROSTER</div>
          <h1 className="agents-title">{active.name}</h1>
          <div className="agents-role">
            <FiActivity size={14} />
            {active.role}
          </div>
          <p className="agents-motto">{active.motto}</p>
          <p className="agents-bio">{active.bio}</p>

          <div className="agents-metrics">
            {METRICS.map(metric => (
              <div className="agents-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="agents-stage" key={`stage-${active.id}`}>
          <div className="agents-name-ghost">{active.name}</div>
          <img
            className="agents-portrait"
            src={active.portrait}
            alt={active.name}
            onError={event => {
              event.currentTarget.src = '/images/AGENT/small_logo.jpg';
            }}
          />
        </div>

        <aside className="agents-panel">
          <div className="agents-card">
            <div className="agents-card-title">
              Performance
              <span>{active.status}</span>
            </div>
            <AgentStat label="Speed" value={active.stats.speed} color={active.accent} />
            <AgentStat label="Control" value={active.stats.control} color={active.accent} />
            <AgentStat label="Support" value={active.stats.support} color={active.accent} />
          </div>

          <div className="agents-card">
            <div className="agents-card-title">
              Skill Loadout
              <span>02 Slots</span>
            </div>
            <div className="agents-skills">
              {active.skills.map(skill => (
                <div className="agents-skill" key={skill.name}>
                  <SkillIcon icon={skill.icon} color={active.accent} />
                  <div>
                    <strong>{skill.name}</strong>
                    <p>{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="agents-card">
            <div className="agents-card-title">
              Select Agent
              <span>{activeIndex + 1}/{AGENTS.length}</span>
            </div>
            <div className="agents-roster">
              {AGENTS.map((agent, index) => (
                <button
                  className={`agents-roster-btn${index === activeIndex ? ' is-active' : ''}`}
                  key={agent.id}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                  aria-label={`เลือก ${agent.name}`}
                >
                  <img
                    src={agent.avatar}
                    alt=""
                    onError={event => {
                      event.currentTarget.src = '/images/AGENT/small_logo.jpg';
                    }}
                  />
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
            <div className="agents-controls" style={{ marginTop: 16 }}>
              <button className="agents-control" onClick={goPrev} type="button" aria-label="ก่อนหน้า">
                <FiChevronLeft size={22} />
              </button>
              <button className="agents-control" onClick={goNext} type="button" aria-label="ถัดไป">
                <FiChevronRight size={22} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
