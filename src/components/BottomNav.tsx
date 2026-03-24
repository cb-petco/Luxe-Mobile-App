import { Home, History, Bell, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'history' | 'notifications' | 'profile';
  onNavigate: (tab: 'home' | 'history' | 'notifications' | 'profile') => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'history' as const, icon: History, label: 'History' },
    { id: 'notifications' as const, icon: Bell, label: 'Alerts' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`}
              />
              <span
                className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
