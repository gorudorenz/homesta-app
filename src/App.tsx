import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TimerView } from './components/TimerView';
import { TaskView, type Task } from './components/TaskView';
import { StatsView } from './components/StatsView';
import { PraiseModal } from './components/PraiseModal';
import { Sparkles } from 'lucide-react';

interface AppStats {
  totalMinutes: number;
  sessionsCount: number;
  streakDays: number;
  revivalCount: number;
  lastStudyDate: string | null;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userName, setUserName] = useState<string>('');
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);
  
  // アプリ統計
  const [stats, setStats] = useState<AppStats>({
    totalMinutes: 0,
    sessionsCount: 0,
    streakDays: 0,
    revivalCount: 0,
    lastStudyDate: null,
  });

  // タスクリスト
  const [tasks, setTasks] = useState<Task[]>([]);

  // 日付ごとの学習分数 (YYYY-MM-DD -> minutes)
  const [studyHistory, setStudyHistory] = useState<{ [date: string]: number }>({});

  // 褒めモーダル管理
  const [praiseModalOpen, setPraiseModalOpen] = useState<boolean>(false);
  const [lastPraiseMinutes, setLastPraiseMinutes] = useState<number>(0);
  const [quickTimerDuration, setQuickTimerDuration] = useState<number | null>(null);

  // ローカルストレージからのロード
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem('homesta_user_data');
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        setUserName(parsed.name || '');
        setIsFirstLaunch(false);
      }

      const storedStats = localStorage.getItem('homesta_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      const storedTasks = localStorage.getItem('homesta_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      const storedHistory = localStorage.getItem('homesta_history');
      if (storedHistory) {
        setStudyHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  // ローカルストレージへのセーブヘルパー
  const saveStats = (newStats: AppStats) => {
    setStats(newStats);
    localStorage.setItem('homesta_stats', JSON.stringify(newStats));
  };

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('homesta_tasks', JSON.stringify(newTasks));
  };

  const saveHistory = (newHistory: { [date: string]: number }) => {
    setStudyHistory(newHistory);
    localStorage.setItem('homesta_history', JSON.stringify(newHistory));
  };

  // ニックネームの登録
  const handleRegisterName = (nameInput: string) => {
    if (!nameInput.trim()) return;
    const cleanName = nameInput.trim();
    setUserName(cleanName);
    setIsFirstLaunch(false);
    localStorage.setItem('homesta_user_data', JSON.stringify({ name: cleanName }));
  };

  // タイマー完了時
  const handleTimerComplete = (minutes: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // 履歴の更新
    const newHistory = { ...studyHistory };
    newHistory[todayStr] = (newHistory[todayStr] || 0) + minutes;
    saveHistory(newHistory);

    // 復活カウント（復活力）の判定
    let newRevivalCount = stats.revivalCount;
    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 最後に勉強した日から2日以上空いて再開した場合に復活カウントアップ
      if (diffDays > 1) {
        newRevivalCount += 1;
      }
    }

    const newStats = {
      totalMinutes: stats.totalMinutes + minutes,
      sessionsCount: stats.sessionsCount + 1,
      streakDays: stats.streakDays + 1, // ダミー項目（現状維持。カレンダーが「充電」を肯定するため、厳格なstreakは不要）
      revivalCount: newRevivalCount,
      lastStudyDate: todayStr,
    };
    saveStats(newStats);

    // 全力褒めモーダルを表示
    setLastPraiseMinutes(minutes);
    setPraiseModalOpen(true);
  };

  // ホーム画面からのクイックタイマー起動
  const handleStartQuickTimer = () => {
    setQuickTimerDuration(3); // 3分タイマー
    setCurrentTab('timer');
  };

  // タスク管理の操作
  const handleAddTask = (text: string) => {
    const newTaskItem: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    const newTasks = [newTaskItem, ...tasks];
    saveTasks(newTasks);
  };

  const handleToggleTask = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined } : task
    );
    saveTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    saveTasks(newTasks);
  };

  // 完了済みタスクの件数（統計画面用）
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // ニックネーム未登録時のセットアップ画面
  if (isFirstLaunch) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', padding: '24px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
            <Sparkles size={40} className="animate-pulse" />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>ほめスタへようこそ！</h1>
          
          <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
            「ほめスタ」は、自己管理が苦手でも大丈夫な学習アプリです。<br/>
            がんばった日はもちろん、休んだ日も「充電」として肯定します。
          </p>

          <div style={{ width: '80px', height: '80px', margin: '0 auto' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'float 3s ease-in-out infinite' }}>
              <ellipse cx="38" cy="25" rx="10" ry="22" fill="#fff" transform="rotate(-10 38 25)" />
              <ellipse cx="38" cy="27" rx="6" ry="16" fill="#fda4af" transform="rotate(-10 38 27)" />
              <ellipse cx="62" cy="25" rx="10" ry="22" fill="#fff" transform="rotate(10 62 25)" />
              <ellipse cx="62" cy="27" rx="6" ry="16" fill="#fda4af" transform="rotate(10 62 27)" />
              <circle cx="50" cy="58" r="26" fill="#fff" />
              <circle cx="34" cy="62" r="5" fill="#fecdd3" />
              <circle cx="66" cy="62" r="5" fill="#fecdd3" />
              <circle cx="42" cy="54" r="3.5" fill="#1e293b" />
              <circle cx="58" cy="54" r="3.5" fill="#1e293b" />
              <polygon points="50,60 48,58 52,58" fill="#f43f5e" />
              <path d="M48,62 Q50,64 52,62" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
              handleRegisterName(input);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}
          >
            <input
              type="text"
              name="name"
              placeholder="ニックネームを入力してね"
              maxLength={10}
              required
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                textAlign: 'center',
                fontFamily: 'var(--font-family)'
              }}
            />
            <button type="submit" className="btn btn-primary">
              スタートする
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* ヘッダーエリア */}
      <header style={{
        padding: '20px 20px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
      }}>
        <h1 style={{ fontSize: '20px' }}>ほめスタ 🐰</h1>
        <span className="badge badge-primary">
          {userName} ちゃん
        </span>
      </header>

      {/* コンテンツエリア */}
      <main className="app-content">
        {currentTab === 'home' && (
          <HomeView
            stats={stats}
            userName={userName}
            onStartQuickTimer={handleStartQuickTimer}
            onNavigateToTasks={() => setCurrentTab('tasks')}
          />
        )}

        {currentTab === 'timer' && (
          <TimerView
            quickTimerDuration={quickTimerDuration}
            clearQuickTimer={() => setQuickTimerDuration(null)}
            onTimerComplete={handleTimerComplete}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentTab === 'stats' && (
          <StatsView
            stats={stats}
            completedTasksCount={completedTasksCount}
            studyHistory={studyHistory}
          />
        )}
      </main>

      {/* スマホ用ボトムナビゲーション */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* 全力褒めモーダル */}
      <PraiseModal
        isOpen={praiseModalOpen}
        onClose={() => setPraiseModalOpen(false)}
        minutes={lastPraiseMinutes}
      />
    </div>
  );
}
