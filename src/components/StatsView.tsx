import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, BarChart3, Award, Info, AlertTriangle, BookHeart } from 'lucide-react';

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
  
  // ひと言日記のステート
  const [diaries, setDiaries] = useState<{ [date: string]: string }>({});
  const [diaryInput, setDiaryInput] = useState('');

  // 誘惑パターンのステート
  const [distractionStats, setDistractionStats] = useState<{ reason: string; count: number }[]>([]);

  useEffect(() => {
    // 日記の読み込み
    try {
      const stored = localStorage.getItem('homesta_diaries');
      if (stored) setDiaries(JSON.parse(stored));
    } catch (e) {}

    // 誘惑パターンの読み込みと集計
    try {
      const stored = localStorage.getItem('homesta_distractions');
      if (stored) {
        const parsed: { reason: string; date: string }[] = JSON.parse(stored);
        const counts: { [r: string]: number } = {};
        parsed.forEach(item => {
          counts[item.reason] = (counts[item.reason] || 0) + 1;
        });
        const statsArr = Object.keys(counts).map(reason => ({ reason, count: counts[reason] }));
        statsArr.sort((a, b) => b.count - a.count);
        setDistractionStats(statsArr);
      }
    } catch (e) {}
  }, []);

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

  const badges = useMemo(() => {
    return [
      { id: 'first_step', title: '最初の一歩', desc: '1回でも学習を開始できた！', unlocked: stats.sessionsCount >= 1, color: '#a78bfa' },
      { id: 'revival_hero', title: '復活の勇者', desc: '途切れても諦めずに再開した！', unlocked: stats.revivalCount >= 1, color: '#06b6d4' },
      { id: 'tiny_accumulate', title: 'ちりつもマスター', desc: '累計30分以上学習を積み重ねた！', unlocked: stats.totalMinutes >= 30, color: '#fbbf24' },
      { id: 'big_hero', title: '大英傑の領域', desc: '累計120分以上学習した！', unlocked: stats.totalMinutes >= 120, color: '#ec4899' },
      { id: 'task_hunter', title: '極小タスクマスター', desc: '極小タスクを3回以上達成！', unlocked: completedTasksCount >= 3, color: '#10b981' },
    ];
  }, [stats, completedTasksCount]);

  const handleCellClick = (dateStr: string, minutes: number) => {
    setSelectedCellInfo({ dateStr, minutes });
    setDiaryInput(diaries[dateStr] || '');
  };

  const saveDiary = () => {
    if (!selectedCellInfo) return;
    const newDiaries = { ...diaries, [selectedCellInfo.dateStr]: diaryInput };
    setDiaries(newDiaries);
    localStorage.setItem('homesta_diaries', JSON.stringify(newDiaries));
  };

  return (
    <div className="stats-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      
      {/* 日付セルの詳細（日記入力含む） */}
      {selectedCellInfo && (
        <div className="glass-card" style={{
          position: 'fixed', top: '20px', left: '20px', right: '20px', zIndex: 1000,
          border: '1.5px solid var(--color-primary-light)', background: 'rgba(15, 10, 30, 0.98)',
          animation: 'popIn 0.3s', padding: '20px', boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-primary-light)' }}>
              {selectedCellInfo.dateStr} の記録
            </h3>
            <button onClick={() => setSelectedCellInfo(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>×</button>
          </div>
          
          <p style={{ color: '#fff', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
            {selectedCellInfo.minutes > 0 ? (
              <span>この日は <strong>{selectedCellInfo.minutes}分</strong> も頑張ったんだね！素晴らしい進捗だよ！🐰🎉</span>
            ) : (
              <span>この日は「<strong>セルフケア＆充電</strong>」の日！心と身体を休められたから、また次の一歩を踏み出せるんだね。ナイス充電！🔋💖</span>
            )}
          </p>

          {selectedCellInfo.minutes === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-primary-light)' }}>
                <BookHeart size={14} /> ひと言日記（今日はどんな風に休んだ？）
              </div>
              <textarea
                value={diaryInput}
                onChange={(e) => setDiaryInput(e.target.value)}
                placeholder="例: 今日はたくさん寝てリフレッシュした！"
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '13px', resize: 'none', height: '60px'
                }}
              />
              <button className="btn btn-secondary" onClick={saveDiary} style={{ padding: '8px' }}>
                保存する
              </button>
            </div>
          )}
        </div>
      )}

      {/* 累積成果カード */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}><BarChart3 style={{ color: 'var(--color-secondary)' }} />成長の可視化</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>累計学習時間</span><span style={{ fontWeight: 'bold' }}>{stats.totalMinutes} 分</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>学習セッション回数</span><span style={{ fontWeight: 'bold' }}>{stats.sessionsCount} 回</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-muted)' }}>復活力（復活回数）</span><span style={{ fontWeight: 'bold', color: 'var(--color-primary-light)' }}>{stats.revivalCount} 回</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: 'var(--text-muted)' }}>達成した極小タスク</span><span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>{completedTasksCount} 個</span>
          </div>
        </div>
      </div>

      {/* 誘惑パターンの可視化 */}
      {distractionStats.length > 0 && (
        <div className="glass-card" style={{ background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--color-warning)' }}><AlertTriangle size={20} />あなたの誘惑パターン</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            タイマー中に踏みとどまった「誘惑」の回数です。己を知るのが最大の武器！
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {distractionStats.map(stat => (
              <div key={stat.reason} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{stat.reason}</span>
                <span className="badge badge-warning">{stat.count} 回 阻止</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* カレンダーグリッド */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '6px' }}><Calendar style={{ color: 'var(--color-primary-light)' }} />活動と充電の記録（直近4週間）</h2>
        <p style={{ fontSize: '11px', marginBottom: '16px' }}>マスをタップすると、頑張りや充電日記を確認できます。</p>

        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '12px', justifyContent: 'flex-end' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary-gradient)' }}></span>活動日</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236,72,153,0.3)' }}></span>充電日</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', padding: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '16px' }}>
          {calendarDays.map((day) => {
            const isActive = day.minutes > 0;
            const hasDiary = diaries[day.dateStr] !== undefined && diaries[day.dateStr] !== '';
            return (
              <button
                key={day.dateStr}
                onClick={() => handleCellClick(day.dateStr, day.minutes)}
                style={{
                  aspectRatio: '1', borderRadius: '8px', border: isActive ? 'none' : '1px solid rgba(236, 72, 153, 0.25)',
                  background: isActive ? 'var(--primary-gradient)' : 'rgba(236, 72, 153, 0.08)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', padding: '2px',
                  boxShadow: isActive ? '0 2px 6px rgba(236, 72, 153, 0.3)' : 'none', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: isActive ? '#fff' : 'var(--text-muted)' }}>{day.dayNum}</span>
                {isActive ? (
                  <span style={{ fontSize: '7px', fontWeight: 'bold', color: '#fff' }}>{day.minutes}m</span>
                ) : (
                  <span style={{ fontSize: '7px', fontWeight: 'bold', color: 'rgba(236, 72, 153, 0.7)' }}>{hasDiary ? '📖' : '🔋'}</span>
                )}
              </button>
            );
          })}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginTop: '6px' }}>
          {['日', '月', '火', '水', '木', '金', '土'].map((w, idx) => (<span key={idx} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{w}</span>))}
        </div>
      </div>

      {/* バッジコレクション */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '16px' }}><Award style={{ color: 'var(--color-warning)' }} />がんばりアワード</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {badges.map((b) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '16px',
              background: b.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255,255,255,0.01)',
              border: b.unlocked ? `1px solid ${b.color}40` : '1px solid rgba(255,255,255,0.03)',
              opacity: b.unlocked ? 1 : 0.45, transition: 'all 0.3s'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: b.unlocked ? `linear-gradient(135deg, ${b.color}30 0%, ${b.color}60 100%)` : 'rgba(255,255,255,0.05)',
                border: b.unlocked ? `2px solid ${b.color}` : '2px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.unlocked ? '#fff' : 'var(--text-muted)'
              }}>
                {b.unlocked ? <Award size={20} /> : <Info size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: b.unlocked ? '#fff' : 'var(--text-muted)' }}>{b.title}</h3>
                <p style={{ fontSize: '11px', margin: '2px 0 0' }}>{b.desc}</p>
              </div>
              <div>
                {b.unlocked ? <span className="badge badge-success">獲得済</span> : <span className="badge badge-primary" style={{ color: 'var(--text-muted)' }}>未開放</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
