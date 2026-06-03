import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TrendingUp, Calendar, Zap, X } from 'lucide-react';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalMinutes: number;
    sessionsCount: number;
  };
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ isOpen, onClose, stats }) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#fbbf24']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 8, 20, 0.9)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2500, padding: '20px', animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="glass-card" style={{
        maxWidth: '400px', width: '100%',
        border: '2px solid var(--color-success)', padding: '24px',
        boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)',
        display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative'
      }}>
        
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <TrendingUp size={36} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
          <h2 style={{ fontSize: '22px', color: '#fff', marginBottom: '8px' }}>今週のレポート</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>先週もよくがんばったね！あなたの積み重ねです✨</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Calendar size={16} /> 累計学習時間
            </span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{stats.totalMinutes} <span style={{ fontSize: '12px' }}>分</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Zap size={16} /> 学習セッション
            </span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{stats.sessionsCount} <span style={{ fontSize: '12px' }}>回</span></span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
          今週もマイペースにいこう！
        </button>
      </div>
    </div>
  );
};
