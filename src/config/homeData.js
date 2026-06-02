import { FiGrid, FiTrendingUp, FiZap } from 'react-icons/fi';

// gameId ต้องตรงกับ game.name ใน GAMES หรือ MAILPASS_GAMES
// type: 'uid' | 'mailpass'
export const PROMOS = [
  { id: 1, name: "ROV Promotion",  img: "/images/PRO/rov_promotion_web1_ai.png",    tag: "HOT",  gameId: 'ROV',        type: 'uid'      },
  { id: 2, name: "ACE RACER",      category: "เกมแข่งรถ",         bg: "/images/GAMES BG/ACERACER_bg.png",    icon: "/images/GAMES ICON/ACERACER_iconapp.png",    tag: "ใหม่", gameId: 'ACE RACER',   type: 'uid' },
  { id: 3, name: "BIGO LIVE",      category: "สตรีมมิ่ง",         bg: "/images/GAMES BG/BIGOLIVE_bg.png",    icon: "/images/GAMES ICON/BIGOLIVE_iconapp.png",    tag: "ใหม่", gameId: 'BIGO LIVE',   type: 'uid' },
  { id: 4, name: "IDENTITY V",     category: "เกมเอาชีวิตรอด",   bg: "/images/GAMES BG/IDENTITYV_bg.png",   icon: "/images/GAMES ICON/IDENTITYV_iconapp.png",   tag: null,   gameId: 'Identity V',  type: 'uid' },
];

// รูปโปรโมชั่นยอดนิยม — เพิ่ม/ลดได้เลย
export const POPULAR_PACKAGES = [
  { id: 1, img: "/images/PRO/PACKBLOOD.png" },
  { id: 2, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web_ai.png"   },
  { id: 3, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/mlbb_promotion_web_ai_edit1.png"      },
  { id: 4, img: "/images/ALASKAN_WEB_ASSET/PROMOTION%20WEB/Alaskan_freefire_banner_web2_ai.png"  },
];

// จำนวนการ์ดต่อหน้า (ก่อนกด "ดูเพิ่มเติม")
export const PAGE_SIZE = 15;

// แท็บกรองเกม — key ต้องตรงกับ tag ใน GAMES / MAILPASS_GAMES
export const FILTER_TABS = [
  { key: 'all',    label: 'ทั้งหมด', Icon: FiGrid       },
  { key: 'ขายดี', label: 'ขายดี',   Icon: FiTrendingUp },
  { key: 'ใหม่',  label: 'ใหม่',    Icon: FiZap        },
];
