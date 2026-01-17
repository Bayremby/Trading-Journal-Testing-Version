
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, Settings, ChevronDown, Moon, Sun, Brain } from 'lucide-react';
import { ThemeMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onToggleTheme: () => void;
  currentTheme: ThemeMode;
}

export const Layout: React.FC<LayoutProps> = ({ children, onToggleTheme, currentTheme }) => {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Overview' },
    { to: '/trades', icon: FileText, label: 'Trades' },
    { to: '/system', icon: BookOpen, label: 'Systems' },
    { to: '/psychology', icon: Brain, label: 'Psychology' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f1f3f5] dark:bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col fixed inset-y-0 px-4 py-8 animate-fade-in">
        <div className="mb-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 transition-transform hover:rotate-6">
              <div className="w-3 h-3 border-2 border-white dark:border-black rotate-45"></div>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-black dark:text-white">Silence</h1>
          </div>
          <button 
            onClick={onToggleTheme}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all active:scale-90"
            title={currentTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-gray-500" /> : <Moon className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                animate-slide-right stagger-${index + 1}
                ${isActive 
                  ? 'bg-white dark:bg-[#111] shadow-sm text-black dark:text-white font-semibold' 
                  : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              {item.label === 'Trades' && <ChevronDown className="w-3 h-3 text-gray-300 dark:text-gray-700" />}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 animate-fade-in stagger-3">
          <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/40 dark:border-white/5 text-[10px] text-gray-400 dark:text-gray-500 font-medium italic leading-relaxed transition-colors hover:bg-white/60 dark:hover:bg-white/10">
            "Silence speaks when your bias is gone."
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 bg-white dark:bg-[#0a0a0a] my-3 mr-3 rounded-[2rem] shadow-xl shadow-black/5 dark:shadow-none border border-black/[0.01] dark:border-white/[0.03] overflow-y-auto relative">
        <div key={location.pathname} className="max-w-4xl mx-auto px-10 py-10 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
