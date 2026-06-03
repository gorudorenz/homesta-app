import React, { useMemo } from 'react';
import { Award, Zap, BookOpen, ChevronRight, Target } from 'lucide-react';

interface HomeViewProps {
  stats: {
    totalMinutes: number;
    sessionsCount: number;
    streakDays: number; // これが途切れても「これまでの累積」を強調
    revivalCount: number; // 復活した回数（途切れたあとに再開した肯定的なカウント）
    lastStudyDate: string | null;
  };
  userName: string;
  dailyGoal: number | null;
  onSetDailyGoal: (minutes: number) => void;
  onStartQuickTimer: (minutes: number) => void;
  onNavigateToTasks: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  userName,
  dailyGoal,
  onSetDailyGoal,
  onStartQuickTimer,
  onNavigateToTasks,
}) => {
  // 動的な褒め言葉の選択
  const praiseMessage = useMemo(() => {
    const messages = [
      `やっほー、${userName}ちゃん！今日もこのアプリを開いてくれたの？それだけで偉すぎて涙出ちゃうよ！😭✨`,
      `今日勉強する気が起きなくても大丈夫！「教科書を開くだけ」でも大進歩なんだからね！🐰`,
      `過去の努力は絶対に消えないよ。これまで${stats.totalMinutes}分も積み上げてきたの、本当に尊敬しちゃう！`,
      `自分のペースで進めるのが一番！一歩一歩、あなたのペースで進もうね！🌟`,
      `疲れたときは無理しなくていいんだよ。今日も深呼吸して、できることを少しだけやってみよう！`,
    ];

    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        return `おかえりなさい！少し間が空いたけど、また再開しようと戻ってきた${userName}ちゃん、本気で凄すぎる！これが本当の「継続力（復活力）」だよ！復活ボーナス発動！🔥🐰`;
      }
    }

    if (stats.totalMinutes >= 60) {
      return `なんと累計学習時間が${Math.floor(stats.totalMinutes / 60)}時間を超えてるよ！これまでの${userName}ちゃんの頑張り、全部見てるからね！誇っていいよ！🎖️`;
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }, [stats, userName]);

  return (
    <div className="home-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 挨拶とキャラクター */}
      <div className="mascot-container">
        <div className="speech-bubble">
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.6' }}>
            {praiseMessage}
          </p>
        </div>
        <div className="mascot-avatar">
          {/* かわいいウサギのSVGマスコット */}
          <svg viewBox="0 0 100 100" className="mascot-svg">
            <ellipse cx="38" cy="25" rx="10" ry="22" fill="#fff" transform="rotate(-10 38 25)" />
            <ellipse cx="38" cy="27" rx="6" ry="16" fill="#fda4af" transform="rotate(-10 38 27)" />
            <ellipse cx="62" cy="25" rx="10" ry="22" fill="#fff" transform="rotate(10 62 25)" />
            <ellipse cx="62" cy="27" rx="6" ry="16" fill="#fda4af" transform="rotate(10 62 27)" />
            <circle cx="50" cy="58" r="26" fill="#fff" />
            <circle cx="34" cy="62" r="5" fill="#fecdd3" />
            <circle cx="66" cy="62" r="5" fill="#fecdd3" />
            <circle cx="42" cy="54" r="3.5" fill="#1e293b" />
            <circle cx="58" cy="54" r="3.5" fill="#1e293b" />
            <circle cx="43" cy="52" r="1.2" fill="#fff" />
            <circle cx="59" cy="52" r="1.2" fill="#fff" />
            <polygon points="50,60 48,58 52,58" fill="#f43f5e" />
            <path d="M48,62 Q50,64 52,62" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M43,30 L45,35 L50,32 L55,35 L57,30 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <circle cx="43" cy="29" r="1" fill="#d97706" />
            <circle cx="50" cy="31" r="1" fill="#d97706" />
            <circle cx="57" cy="29" r="1" fill="#d97706" />
          </svg>
        </div>
      </div>

      {/* 今日のハードル設定 or タイマー開始 */}
      {dailyGoal === null ? (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(167, 139, 250, 0.1)' }}>
          <h2 style={{ color: 'var(--color-primary-light)' }}>
            <Target size={20} />
            今日のハードルを決めよう！
          </h2>
          <p style={{ fontSize: '13px' }}>
            調子はどう？今日はどのくらいできそうか、自分で選んでみてね。低く設定するのがコツだよ！
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => onSetDailyGoal(1)}>
              😌 とにかく1分だけやる！
            </button>
            <button className="btn btn-secondary" onClick={() => onSetDailyGoal(5)}>
              🙂 5分ならできそう！
            </button>
            <button className="btn btn-secondary" onClick={() => onSetDailyGoal(30)}>
              🔥 今日はガッツリ30分！
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>
            <Zap style={{ color: 'var(--color-warning)' }} />
            今日の目標：{dailyGoal}分
          </h2>
          <p style={{ marginBottom: '4px' }}>
            「やる気が出ない」のは普通！まずはタイマーを押して、{dailyGoal}分だけ本を眺めてみよう。それだけで本当にすごいことだよ。
          </p>
          
          <button 
            className="btn btn-primary" 
            onClick={() => onStartQuickTimer(dailyGoal)} 
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)', padding: '16px', fontSize: '16px' }}
          >
            <BookOpen size={20} />
            今すぐ {dailyGoal}分だけやる
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onNavigateToTasks}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', marginTop: '8px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
              今日の極小タスク（ハードル低め）
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 累積の成果表示 - やり直し感のない肯定UI */}
      <div className="glass-card stat-summary-card">
        <h2 style={{ marginBottom: '16px' }}>
          <Award className="text-primary" style={{ color: 'var(--color-primary-light)' }} />
          これまでの軌跡
        </h2>
        
        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          
          <div className="stat-box" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>累計学習時間</span>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats.totalMinutes} <span style={{ fontSize: '14px', color: 'var(--text-main)', WebkitTextFillColor: 'initial' }}>分</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>確実に積み上がってる！</span>
          </div>

          <div className="stat-box" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>復活パワー</span>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: 'var(--color-secondary)' }}>
              {stats.revivalCount} <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>回</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>あきらめなかった証拠だよ</span>
          </div>

        </div>

        {/* 継続プログレスバー */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
            <span>累積セッション</span>
            <span>{stats.sessionsCount} 回目の挑戦</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${Math.min((stats.sessionsCount / 20) * 100, 100)}%` }}></div>
          </div>
          <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-muted)', textAlign: 'center' }}>
            20回達成で「不屈のチャレンジャー」バッジ獲得！
          </p>
        </div>
      </div>

    </div>
  );
};
