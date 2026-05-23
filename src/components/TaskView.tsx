import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, Trash2, Plus, Sparkles, Check, Smile } from 'lucide-react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

interface TaskViewProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskView: React.FC<TaskViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [newtaskText, setNewtaskText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // プリセットタスク（ハードル極低）
  const presets = [
    { text: '机に向かって座る', hint: '座っただけで偉い！' },
    { text: '教科書や参考書を机に置く', hint: 'やる気準備完了！' },
    { text: '本やサイトを1ページ開く', hint: '実質もう勉強開始！' },
    { text: 'ノートに日付を書く', hint: '行動を起こせた証拠！' },
    { text: 'ペンを手に持つ', hint: 'ペンを握るだけで100点！' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newtaskText.trim()) return;
    onAddTask(newtaskText.trim());
    setNewtaskText('');
  };

  // タスク完了時の褒めメッセージ表示
  const handleToggle = (id: string, text: string, wasCompleted: boolean) => {
    onToggleTask(id);
    
    // 未完了から完了になった時だけ褒める
    if (!wasCompleted) {
      const praiseList = [
        `「${text}」ができた！行動力が本当に素晴らしいよ！👏`,
        `小さな一歩だけど確実な成長！天才すぎる！✨`,
        `有言実行の鏡だね！本当にかっこいいよ！🐰`,
        `すばらしい！これでまた一つ、自分が好きになれるね！🌟`,
        `完璧！ハードルを下げてやり遂げる、これこそ継続の極意だよ！🔥`,
      ];
      const rand = praiseList[Math.floor(Math.random() * praiseList.length)];
      setToastMessage(rand);
      
      // 4秒後にトーストを非表示
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  };

  // 未完了タスクと完了済タスクの分類
  const activeTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

  return (
    <div className="task-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 褒めトースト */}
      {toastMessage && (
        <div className="glass-card" style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          border: '1px solid var(--color-success)',
          background: 'rgba(16, 185, 129, 0.95)',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
        }}>
          <Sparkles size={20} style={{ color: '#fff', flexShrink: 0 }} />
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>
            {toastMessage}
          </p>
        </div>
      )}

      {/* タスク追加フォーム */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '14px' }}>
          <CheckSquare style={{ color: 'var(--color-primary-light)' }} />
          極小タスクを追加
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="例: 教科書をパッと開く"
            value={newtaskText}
            onChange={(e) => setNewtaskText(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'var(--font-family)'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '12px 18px' }} aria-label="追加">
            <Plus size={18} />
          </button>
        </form>
      </div>

      {/* プリセットタスク（ハードル下げる工夫） */}
      <div className="glass-card">
        <h2 style={{ marginBottom: '12px', fontSize: '15px' }}>
          💡 ハードルをとことん下げるプリセット
        </h2>
        <p style={{ fontSize: '11px', marginBottom: '12px' }}>
          タップするだけでタスクに追加できます。これくらい小さな行動で十分！
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onAddTask(preset.text)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '99px',
                padding: '6px 12px',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <span>+ {preset.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* タスク一覧 */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '200px' }}>
        <h2>
          タスクリスト ({activeTasks.length})
        </h2>

        {tasks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', gap: '12px', padding: '40px 0' }}>
            <Smile size={48} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '13px', textAlign: 'center' }}>
              現在タスクはありません。<br/>
              上のプリセットから、できそうなものを1つ選んでみて！
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* 未完了タスク */}
            {activeTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s'
                }}
              >
                <button
                  onClick={() => handleToggle(task.id, task.text, task.completed)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <Square size={20} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{task.text}</span>
                </button>
                
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(244, 63, 94, 0.6)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(244, 63, 94, 0.6)'}
                  aria-label="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* 区切り線（完了済みがある場合のみ） */}
            {completedTasks.length > 0 && activeTasks.length > 0 && (
              <hr style={{ border: 'none', borderTop: '1px dashed rgba(255,255,255,0.08)', margin: '8px 0' }} />
            )}

            {/* 完了済タスク（続きとして肯定的に表示） */}
            {completedTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.03)',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  opacity: 0.7
                }}
              >
                <button
                  onClick={() => handleToggle(task.id, task.text, task.completed)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: 1,
                    textDecoration: 'line-through'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13px' }}>{task.text}</span>
                </button>
                
                <button
                  onClick={() => onDeleteTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px'
                  }}
                  aria-label="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
};
