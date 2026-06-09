import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiZoomIn, FiZoomOut, FiDownload } from 'react-icons/fi';

export default function QRLightbox({ src, label, onClose }) {
  const [zoom, setZoom]   = useState(1);
  const [pan,  setPan]    = useState({ x: 0, y: 0 });
  const dragRef           = useRef(null);
  const overlayRef        = useRef(null);

  /* reset on open */
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [src]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const zoomIn  = useCallback(() => setZoom(z => Math.min(4, +(z + 0.5).toFixed(1))), []);
  const zoomOut = useCallback(() => setZoom(z => {
    const next = Math.max(1, +(z - 0.5).toFixed(1));
    if (next === 1) setPan({ x: 0, y: 0 });
    return next;
  }), []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => {
      const next = Math.min(4, Math.max(1, z - e.deltaY * 0.003));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const onMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y };
  }, [zoom, pan]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    setPan({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY });
  }, []);

  const onMouseUp = useCallback(() => { dragRef.current = null; }, []);

  /* touch zoom (pinch) */
  const lastDist = useRef(null);
  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastDist.current !== null) {
        const delta = dist - lastDist.current;
        setZoom(z => Math.min(4, Math.max(1, z + delta * 0.005)));
      }
      lastDist.current = dist;
    }
  }, []);
  const onTouchEnd = useCallback(() => { lastDist.current = null; dragRef.current = null; }, []);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = 'QR-payment.jpg';
    a.click();
  };

  const content = (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 2,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
          {label || 'QR Code ชำระเงิน'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDownload} title="ดาวน์โหลด QR" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8, border: 'none',
            background: '#00d1ff', color: '#0f172a',
            fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <FiDownload size={14} /> ดาวน์โหลด
          </button>
          <button onClick={onClose} title="ปิด" style={{
            width: 34, height: 34, borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.12)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        style={{
          overflow: 'hidden', cursor: zoom > 1 ? (dragRef.current ? 'grabbing' : 'grab') : 'zoom-in',
          borderRadius: 12, background: '#fff',
          boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
          maxWidth: '80vw', maxHeight: '80vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={src}
          alt="QR Code"
          draggable={false}
          style={{
            display: 'block',
            width: 'min(440px, 72vw)', height: 'min(440px, 72vw)',
            objectFit: 'contain',
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: dragRef.current ? 'none' : 'transform 0.15s ease',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Zoom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginTop: 20, background: 'rgba(255,255,255,0.1)',
        borderRadius: 99, padding: '8px 20px',
      }}>
        <button onClick={zoomOut} title="ซูมออก" style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.15)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 18, fontWeight: 700,
        }}>
          <FiZoomOut size={16} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', minWidth: 44, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={zoomIn} title="ซูมเข้า" style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: 'rgba(255,255,255,0.15)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <FiZoomIn size={16} />
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
        Scroll เพื่อซูม · ลาก เพื่อเลื่อน · กด Esc เพื่อปิด
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
