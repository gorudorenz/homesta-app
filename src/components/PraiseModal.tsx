import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Share2, CalendarClock } from 'lucide-react';
import { generatePraise } from '../utils/praiseGenerator';

interface PraiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
}

type Step = 'reflection' | 'praise' | 'schedule';
type ReflectionType = 'good' | 'normal' | 'bad';

export const PraiseModal: React.FC<PraiseModalProps> = ({ isOpen, onClose, minutes }) => {
  const [step, setStep] = useState<Step>('reflection');
  const [reflection, setReflection] = useState<ReflectionType | null>(null);

  // モーダルが開くたびにステートをリセット
  useEffect(() => {
    if (isOpen) {
      setStep('reflection');
      setReflection(null);
    }
  }, [isOpen]);

  // 紙吹雪演出（praiseステップに入った時）
  useEffect(() => {
    if (isOpen && step === 'praise') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#a78bfa', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'] });
      const leftTimer = setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors: ['#a78bfa', '#ec4899', '#fbbf24'] });
      }, 300);
      const rightTimer = setTimeout(() => {
        confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors: ['#a78bfa', '#ec4899', '#06b6d4'] });
      }, 500);
      return () => { clearTimeout(leftTimer); clearTimeout(rightTimer); };
    }
  }, [isOpen, step]);

  const userName = useMemo(() => {
    try {
      const data = localStorage.getItem('homesta_user_data');
      if (data) return JSON.parse(data).name || 'キミ';
    } catch (e) {}
    return 'キミ';
  }, []);

  const praiseDetails = useMemo(() => {
    if (step !== 'praise' || !reflection) return { title: '', body: '' };
    return generatePraise({ userName, minutes, reflection });
  }, [step, reflection, userName, minutes]);

  const handleReflection = (type: ReflectionType) => {
    setReflection(type);
    setStep('praise');
  };

  const handleShare = async () => {
    const text = `今日「ほめスタ」で${minutes}分がんばったよ！えらいっ！🐰✨ #ほめスタ`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ほめスタでがんばったよ！',
          text: text,
        });
      } catch (e) {
        console.error('Share failed', e);
      }
    } else {
      alert('お使いのブラウザはシェア機能に対応していません。');
    }
  };

  const handleSchedule = (timeStr: string) => {
    // 擬似的な予約機能（ローカルストレージ等に保存する想定）
    localStorage.setItem('homesta_next_schedule', timeStr);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 8, 20, 0.9)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px', animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="glass-card" style={{
        maxWidth: '400px', width: '100%', textAlign: 'center',
        border: '2px solid var(--color-primary-light)', padding: '30px 24px',
        boxShadow: '0 20px 50px rgba(167, 139, 250, 0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
      }}>
        
        {step === 'reflection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', animation: 'popIn 0.3s' }}>
            <h2 style={{ fontSize: '20px', color: '#fff' }}>お疲れ様！<br/>今日どうだった？</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => handleReflection('good')}>
                😆 めちゃくちゃ集中できた！
              </button>
              <button className="btn btn-secondary" onClick={() => handleReflection('normal')}>
                🙂 まあまあかな
              </button>
              <button className="btn btn-secondary" onClick={() => handleReflection('bad')}>
                🥺 しんどかった…よく耐えた私
              </button>
            </div>
          </div>
        )}

        {step === 'praise' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', animation: 'popIn 0.3s' }}>
            <div style={{ display: 'flex', gap: '4px', color: 'var(--color-warning)' }}>
              <Sparkles size={24} className="animate-pulse" />
              <Heart size={24} style={{ color: 'var(--color-error)' }} />
              <Sparkles size={24} className="animate-pulse" />
            </div>

            <div style={{
              background: 'var(--primary-gradient)', padding: '12px 24px', borderRadius: '20px',
              color: '#fff', fontWeight: '800', fontSize: '18px', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
            }}>
              学習完了！ {minutes} 分達成！🎉
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{praiseDetails.title}</h3>
              <p style={{
                fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6',
                background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'left'
              }}>
                {praiseDetails.body}
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => setStep('schedule')} style={{ width: '100%' }}>
              次へ進む
            </button>
          </div>
        )}

        {step === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', animation: 'popIn 0.3s' }}>
            <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CalendarClock size={20} />
              次いつやる？
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ここで約束すると続きやすいよ！</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => handleSchedule('明日の同じ時間')}>
                🕒 明日の同じ時間
              </button>
              <button className="btn btn-secondary" onClick={() => handleSchedule('明後日')}>
                📅 明後日
              </button>
              <button className="btn btn-outline" onClick={() => handleSchedule('未定')} style={{ padding: '12px' }}>
                後で決める
              </button>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

            <button className="btn btn-primary" onClick={handleShare} style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Share2 size={16} />
              誰かに1対1で報告する
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
