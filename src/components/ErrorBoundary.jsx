import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f0f4f8', fontFamily: "'PSL Empire Pro', sans-serif",
          color: '#1e293b', textAlign: 'center', padding: 24, gap: 16,
        }}>
          <FiAlertTriangle size={52} color="#ef4444" />
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>เกิดข้อผิดพลาด</h2>
          <p style={{
            color: '#64748b', margin: 0,
            fontFamily: "'Noto Sans Thai', sans-serif", fontSize: 15,
          }}>
            กรุณารีเฟรชหน้าเพจ หากปัญหายังคงอยู่ให้ติดต่อผู้ดูแลระบบ
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(90deg, #00c4e8, #0096c7)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 28px', fontSize: 16, fontWeight: 900, cursor: 'pointer',
              fontFamily: "'PSL Empire Pro', sans-serif",
            }}
          >
            <FiRefreshCw size={16} />
            รีเฟรช
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
