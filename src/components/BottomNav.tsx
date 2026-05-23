import React from 'react';
import { Home, Timer, CheckSquare, BarChart2 } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const navItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'timer', label: 'タイマー', icon: Timer },
    { id: 'tasks', label: 'タスク', icon: CheckSquare },
    { id: 'stats', label: '統計', icon: BarChart2 },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-btn-${item.id}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
            aria-label={item.label}
          >
            <div className="icon-wrapper">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
