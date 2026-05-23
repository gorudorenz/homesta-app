import React, { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface PraiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
}

export const PraiseModal: React.FC<PraiseModalProps> = ({ isOpen, onClose, minutes }) => {
  
  // モーダルが開いた瞬間に豪華な紙吹雪演出
  useEffect(() => {
    if (isOpen) {
      // 1回目の紙吹雪（中央から）
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#ec4899', '#3b82f6', '#10b981', '#fbbf24']
      });

      // 2回目の紙吹雪（左から）
      const leftTimer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 },
          colors: ['#a78bfa', '#ec4899', '#fbbf24']
        });
      }, 300);

      // 3回目の紙吹雪（右から）
      const rightTimer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 },
          colors: ['#a78bfa', '#ec4899', '#06b6d4']
        });
      }, 500);

      return () => {
        clearTimeout(leftTimer);
        clearTimeout(rightTimer);
      };
    }
  }, [isOpen]);

  // 動的な全力褒めメッセージの生成
  const praiseDetails = useMemo(() => {
    const messages = [
      {
        title: 'あなたは本当に努力の天才！',
        body: `なんと今日、${minutes}分も自分の未来のために時間を使ったんだね！「やろう」と決めてやり切るその実行力、本気で尊敬するし、本当にかっこいいよ！😭✨`
      },
      {
        title: '宇宙一の集中力！',
        body: `お疲れ様！${minutes}分間、自分と向き合えたね。自己管理が苦手って思ってるかもしれないけど、今これをやり遂げた事実が、キミが「できる人」である何よりの証拠だよ！🐰🏆`
      },
      {
        title: '尊すぎる第一歩！',
        body: `すごい、すごすぎる！${minutes}分勉強したキミは昨日より確実にパワーアップしてるよ！この努力の積み重ねが、キミを素敵な場所へ連れて行ってくれるからね！🌟`
      }
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }, [minutes]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 8, 20, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="glass-card" style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        border: '2px solid var(--color-primary-light)',
        padding: '30px 24px',
        boxShadow: '0 20px 50px rgba(167, 139, 250, 0.4)',
        animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        
        {/* お祝いヘッダー */}
        <div style={{ display: 'flex', gap: '4px', color: 'var(--color-warning)' }}>
          <Sparkles size={24} className="animate-pulse" />
          <Heart size={24} style={{ color: 'var(--color-error)' }} />
          <Sparkles size={24} className="animate-pulse" />
        </div>

        {/* 時間アピール */}
        <div style={{
          background: 'var(--primary-gradient)',
          padding: '12px 24px',
          borderRadius: '20px',
          color: '#fff',
          fontWeight: '800',
          fontSize: '18px',
          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
        }}>
          学習完了！ {minutes} 分達成！🎉
        </div>

        {/* ほめうさイラスト（嬉しそうな表情） */}
        <div style={{ width: '120px', height: '120px', position: 'relative' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'float 3s ease-in-out infinite' }}>
            {/* 耳（うれしくてピンと立ってる） */}
            <ellipse cx="35" cy="20" rx="10" ry="24" fill="#fff" transform="rotate(-5 35 20)" />
            <ellipse cx="35" cy="22" rx="6" ry="18" fill="#fda4af" transform="rotate(-5 35 22)" />
            <ellipse cx="65" cy="20" rx="10" ry="24" fill="#fff" transform="rotate(5 65 20)" />
            <ellipse cx="65" cy="22" rx="6" ry="18" fill="#fda4af" transform="rotate(5 65 22)" />
            {/* 顔 */}
            <circle cx="50" cy="58" r="26" fill="#fff" />
            {/* ほっぺ */}
            <circle cx="33" cy="62" r="6" fill="#fecdd3" />
            <circle cx="67" cy="62" r="6" fill="#fecdd3" />
            {/* 目（ニッコリ顔） */}
            <path d="M36,52 Q40,48 44,52" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M56,52 Q60,48 64,52" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* 鼻・大きな笑顔の口 */}
            <polygon points="50,59 48,57 52,57" fill="#f43f5e" />
            <path d="M44,63 Q50,71 56,63" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" />
            {/* お祝いの星 */}
            <circle cx="20" cy="40" r="2" fill="#fbbf24" />
            <circle cx="80" cy="40" r="3" fill="#fbbf24" />
          </svg>
        </div>

        {/* 褒めちぎりテキスト */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
            {praiseDetails.title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-main)',
            lineHeight: '1.6',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'left'
          }}>
            {praiseDetails.body}
          </p>
        </div>

        {/* 閉じるボタン */}
        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{
            marginTop: '10px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)'
          }}
        >
          ありがとう！
        </button>

      </div>
    </div>
  );
};
