import { FiX, FiClock } from 'react-icons/fi';

export default function TopupHowto({ game, imgZoom, imgPan, dragRef, onClose, onWheel, onMouseDown, onMouseMove, onMouseUp, onZoomIn, onZoomOut }) {
  return (
    <div className="tp-howto-overlay" onClick={onClose}>
      <div className="tp-howto-box" onClick={e => e.stopPropagation()}>
        <div className="tp-howto-fab">
          <button className="tp-howto-close" onClick={onClose} aria-label="ปิด">
            <FiX size={16} />
          </button>
        </div>

        {game.howtoImage ? (
          <>
            <div
              className="tp-howto-imgwrap"
              onWheel={onWheel}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{ cursor: imgZoom > 1 ? (dragRef.current ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
              <img
                src={game.howtoImage} alt="วิธีเติมเกม" className="tp-howto-img"
                style={{
                  transform: `scale(${imgZoom}) translate(${imgPan.x / imgZoom}px, ${imgPan.y / imgZoom}px)`,
                  transition: dragRef.current ? 'none' : 'transform 0.15s ease',
                  transformOrigin: 'center center',
                  userSelect: 'none', pointerEvents: 'none',
                }}
                draggable={false}
              />
            </div>
            <div className="tp-howto-zoom-bar">
              <button className="tp-howto-zoom-btn" onClick={onZoomOut} aria-label="ซูมออก">−</button>
              <span className="tp-howto-zoom-label">{Math.round(imgZoom * 100)}%</span>
              <button className="tp-howto-zoom-btn" onClick={onZoomIn} aria-label="ซูมเข้า">+</button>
            </div>
          </>
        ) : (
          <div className="tp-howto-coming-soon">
            <FiClock className="tp-howto-coming-icon" />
            <div className="tp-howto-coming-title">วิธีการเติมจะมาเร็วๆนี้</div>
            <div className="tp-howto-coming-sub">{game.name}</div>
          </div>
        )}
      </div>
    </div>
  );
}
