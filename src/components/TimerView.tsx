import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Sparkles, Smile } from 'lucide-react';

interface TimerViewProps {
  quickTimerDuration: number | null; // ホーム画面からクイックスタートされた場合
  clearQuickTimer: () => void;
  onTimerComplete: (minutes: number) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  quickTimerDuration,
  clearQuickTimer,
  onTimerComplete,
}) => {
  const defaultDurations = [3, 10, 25]; // 単位：分
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // デフォルト3分
  const [timeLeft, setTimeLeft] = useState<number>(3 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [preventMsg, setPreventMsg] = useState<string | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeLeft = useRef<number>(3 * 60);

  // ホーム画面からのクイックスタート対応
  useEffect(() => {
    if (quickTimerDuration !== null) {
      setSelectedDuration(quickTimerDuration);
      setTimeLeft(quickTimerDuration * 60);
      initialTimeLeft.current = quickTimerDuration * 60;
      setIsRunning(true);
      clearQuickTimer();
    }
  }, [quickTimerDuration, clearQuickTimer]);

  // タイマーの残り時間監視
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleComplete = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // 実際に学習した分数（端数切り上げ、最低1分）
    const elapsedSeconds = initialTimeLeft.current - timeLeft;
    const elapsedMinutes = Math.max(Math.ceil(elapsedSeconds / 60), 1);
    
    onTimerComplete(elapsedMinutes);
    
    // タイマーリセット
    setTimeLeft(selectedDuration * 60);
  };

  const handleDurationSelect = (mins: number) => {
    if (isRunning) return;
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    initialTimeLeft.current = mins * 60;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      initialTimeLeft.current = timeLeft;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    initialTimeLeft.current = selectedDuration * 60;
  };

  // 秒を分：秒のフォーマットに変換
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 円形ゲージのダッシュオフセット計算
  const strokeDashoffset = useMemo(() => {
    const total = selectedDuration * 60;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    if (total === 0) return 0;
    return circumference - (timeLeft / total) * circumference;
  }, [timeLeft, selectedDuration]);

  // スマホ離脱防止メッセージ
  const handlePreventDistraction = () => {
    const messages = [
      `「スマホ触りたいな」って気付けたの、本当に天才！メタ認知能力が高すぎるよ！そのまま深呼吸しよ？🧘‍♀️`,
      `SNSを見ようとした自分に気付いてストップできたね！その自制心、宇宙一だよ！かっこいい！💫`,
      `私を見てくれてありがとう！スマホの向こう側より、目の前のあなたの未来のほうが100万倍輝いてるよ！✨`,
      `偉い！誘惑に負けそうになっても、このボタンを押した時点で${userNameText}ちゃんの勝ちだよ！🏆`,
      `スマホもちょっと休憩したがってるかも。あと数分、一緒にのんびりペンを動かしてみない？🐰`,
    ];
    const rand = messages[Math.floor(Math.random() * messages.length)];
    setPreventMsg(rand);
    // 5秒後に消す
    setTimeout(() => {
      setPreventMsg(null);
    }, 6000);
  };

  // ローカルストレージからニックネームを取得（デフォルトは「キミ」）
  const userNameText = useMemo(() => {
    try {
      const data = localStorage.getItem('homesta_user_data');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.name || 'キミ';
      }
    } catch (e) {
      // ignore
    }
    return 'キミ';
  }, []);

  return (
    <div className="timer-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      
      {/* 離脱防止の緊急吹き出しメッセージ */}
      {preventMsg && (
        <div className="glass-card" style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          right: '20px',
          zIndex: 10,
          border: '2px solid var(--color-primary-light)',
          background: 'rgba(15, 10, 30, 0.95)',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <Smile size={36} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', lineHeight: '1.5' }}>
            {preventMsg}
          </p>
        </div>
      )}

      {/* 円形タイマー表示 */}
      <div style={{ position: 'relative', width: '220px', height: '220px', marginTop: '20px' }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
          {/* 背景の円 */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="10"
          />
          {/* 進捗の円 */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="transparent"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
          {/* グラデーションの定義 */}
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中央の文字盤 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '38px',
            fontWeight: '800',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 8px rgba(167,139,250,0.2)'
          }}>
            {formatTime(timeLeft)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isRunning ? 'ただいま前進中！🚀' : 'いつでもスタートしてね'}
          </span>
        </div>
      </div>

      {/* 時間の選択肢（未計測時のみ選択可能） */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        {defaultDurations.map((mins) => (
          <button
            key={mins}
            onClick={() => handleDurationSelect(mins)}
            disabled={isRunning}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: selectedDuration === mins ? '1px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedDuration === mins ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedDuration === mins ? '#fff' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isRunning ? 0.5 : 1
            }}
          >
            {mins}分
          </button>
        ))}
      </div>

      {/* タイマー操作ボタン */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '10px' }}>
        <button
          className={`btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          onClick={toggleTimer}
          style={{ flex: 2 }}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? '一時停止' : '学習をはじめる'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetTimer}
          style={{ flex: 1, padding: '14px' }}
          aria-label="リセット"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* スマホ離脱防止機能 */}
      {isRunning && (
        <div className="glass-card" style={{
          width: '100%',
          marginTop: '15px',
          border: '1px dashed rgba(167, 139, 250, 0.4)',
          background: 'rgba(167, 139, 250, 0.02)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '13px', color: 'var(--color-primary-light)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <AlertCircle size={14} />
            スマホを触りたくなったら…
          </h3>
          <p style={{ fontSize: '11px', marginBottom: '12px' }}>
            ついSNSや他のアプリを開きそうになったら、下のボタンを押してみて。
          </p>
          <button
            className="btn btn-outline"
            onClick={handlePreventDistraction}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              borderStyle: 'dashed'
            }}
          >
            <Sparkles size={14} />
            ついスマホを触りそう…
          </button>
        </div>
      )}

    </div>
  );
};
