import React, { useState, useMemo } from 'react';
import { Calendar, BarChart3, Award, Info } from 'lucide-react';

interface StatsViewProps {
  stats: {
    totalMinutes: number;
    sessionsCount: number;
    streakDays: number;
    revivalCount: number;
    lastStudyDate: string | null;
  };
  completedTasksCount: number;
  studyHistory: { [date: string]: number }; // 日付ごとの学習分数 (YYYY-MM-DD)
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  completedTasksCount,
  studyHistory,
}) => {
  const [selectedCellInfo, setSelectedCellInfo] = useState<{ dateStr: string; minutes: number } | null>(null);

  // 直近28日間（4週間）の日付配列を生成
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayOfWeek: d.toLocaleDateString('ja-JP', { weekday: 'short' }),
        dayNum: d.getDate(),
        minutes: studyHistory[dateStr] || 0,
      });
    }
    return days;
  }, [studyHistory]);

  // バッジリストの判定
  const badges = useMemo(() => {
    return [
      {
        id: 'first_step',
        title: '最初の一歩',
        desc: '1回でも学習を開始できた！',
        unlocked: stats.sessionsCount >= 1,
        color: '#a78bfa',
      },
      {
        id: 'revival_hero',
        title: '復活の勇者',
        desc: '途切れても諦めずに再開した！',
        unlocked: stats.revivalCount >= 1,
        color: '#06b6d4',
      },
      {
        id: 'tiny_accumulate',
        title: 'ちりつもマスター',
        desc: '累計30分以上学習を積み重ねた！',
        unlocked: stats.totalMinutes >= 30,
        color: '#fbbf24',
      },
      {
        id: 'big_hero',
        title: '大英傑の領域',
        desc: '累計120分以上学習した！',
        unlocked: stats.totalMinutes >= 120,
        color: '#ec4899',
      },
      {
        id: 'task_hunter',
        title: '極小タスクマスター',
        desc: '極小タスクを3回以上達成！',
        unlocked: completedTasksCount >= 3,
        color: '#10b981',
      },
    ];
  }, [stats, completedTasksCount]);

  const handleCellClick = (dateStr: string, minutes: number) => {
    setSelectedCellInfo({ dateStr, minutes });
  };

  return (
    <div className="stats-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 肯定的なカレンダー説明とポップアップダイアログ */}
      {selectedCellInfo && (
        <div className="glass-card" style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          border: '1.5px solid var(--color-primary-light)',
          background: 'rgba(15, 10, 30, 0.98)',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          padding: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-primary-light)' }}>
              {selectedCellInfo.dateStr} の記録
            </h3>
            <button
              onClick={() => setSelectedCellInfo(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          
          <p style={{ color: '#fff', fontSize: '13px', lineHeight: '1.6', marginBottom: '0' }}>
            {selectedCellInfo.minutes > 0 ? (
              <span>
                この日は <strong>{selectedCellInfo.minutes}分</strong> も頑張ったんだね！素晴らしい進捗だよ！🐰🎉
              </span>
            ) : (
              <span>
                この日は「<strong>セルフケア＆充電</strong>」の日だったよ！心と身体を休められたから、また次の一歩を踏み出せるんだね。ナイス充電！🔋💖
              </span>
            )}
          </p>
        </div>
      )}

      {/* 累積成果カード */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}>
          <BarChart3 style={{ color: 'var(--color-secondary)' }} />
          成長の可視化
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>累計学習時間</span>
            <span style={{ fontWeight: 'bold' }}>{stats.totalMinutes} 分</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>学習セッション回数</span>
            <span style={{ fontWeight: 'bold' }}>{stats.sessionsCount} 回</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>復活力（復活回数）</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-primary-light)' }}>{stats.revivalCount} 回</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: 'var(--text-muted)' }}>達成した極小タスク</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>{completedTasksCount} 個</span>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド：やり直し感のない「活動 / 充電」カレンダー */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '6px' }}>
          <Calendar style={{ color: 'var(--color-primary-light)' }} />
          活動と充電の記録（直近4週間）
        </h2>
        <p style={{ fontSize: '11px', marginBottom: '16px' }}>
          マスをタップすると、その日の頑張りや充電の様子を確認できます。
        </p>

        {/* 凡例 */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '12px', justifyContent: 'flex-end' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' }}></span>
            活動日（学習）
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236,72,153,0.3)' }}></span>
            充電日（セルフケア）
          </span>
        </div>

        {/* グリッドカレンダー */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          padding: '8px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}>
          {calendarDays.map((day) => {
            const isActive = day.minutes > 0;
            return (
              <button
                key={day.dateStr}
                onClick={() => handleCellClick(day.dateStr, day.minutes)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '8px',
                  border: isActive ? 'none' : '1px solid rgba(236, 72, 153, 0.25)',
                  background: isActive
                    ? 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)'
                    : 'rgba(236, 72, 153, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '2px',
                  boxShadow: isActive ? '0 2px 6px rgba(236, 72, 153, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: isActive ? '#fff' : 'var(--text-muted)' }}>
                  {day.dayNum}
                </span>
                {isActive && (
                  <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#fff' }}>
                    {day.minutes}m
                  </span>
                )}
                {!isActive && (
                  <span style={{ fontSize: '7px', fontWeight: 'bold', color: 'rgba(236, 72, 153, 0.7)' }}>
                    🔋
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 曜日ヘッダーの補足 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginTop: '6px' }}>
          {['日', '月', '火', '水', '木', '金', '土'].map((w, idx) => (
            <span key={idx} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{w}</span>
          ))}
        </div>
      </div>

      {/* バッジコレクション */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}>
          <Award style={{ color: 'var(--color-warning)' }} />
          がんばりアワード
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px',
                borderRadius: '16px',
                background: badge.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255,255,255,0.01)',
                border: badge.unlocked ? `1px solid ${badge.color}40` : '1px solid rgba(255,255,255,0.03)',
                opacity: badge.unlocked ? 1 : 0.45,
                transition: 'all 0.3s'
              }}
            >
              {/* バッジアイコン */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: badge.unlocked
                  ? `linear-gradient(135deg, ${badge.color}30 0%, ${badge.color}60 100%)`
                  : 'rgba(255,255,255,0.05)',
                border: badge.unlocked ? `2px solid ${badge.color}` : '2px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: badge.unlocked ? '#fff' : 'var(--text-muted)',
                boxShadow: badge.unlocked ? `0 4px 10px ${badge.color}25` : 'none'
              }}>
                {badge.unlocked ? <Award size={20} /> : <Info size={18} />}
              </div>

              {/* バッジ情報 */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: badge.unlocked ? '#fff' : 'var(--text-muted)' }}>
                  {badge.title}
                </h3>
                <p style={{ fontSize: '11px', margin: '2px 0 0' }}>
                  {badge.desc}
                </p>
              </div>

              {/* 解放ステータス */}
              <div>
                {badge.unlocked ? (
                  <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    獲得済
                  </span>
                ) : (
                  <span className="badge badge-primary" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                    未開放
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
