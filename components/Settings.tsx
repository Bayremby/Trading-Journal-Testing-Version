
import React, { useState } from 'react';
import { UserSettings, ThemeMode } from '../types';
import { Button } from './Button';
import { Plus, Trash2, Sun, Moon } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [newPair, setNewPair] = useState('');
  const [newSession, setNewSession] = useState('');

  const handleAddPair = () => {
    if (!newPair.trim() || localSettings.pairs.includes(newPair.toUpperCase())) return;
    const updated = { ...localSettings, pairs: [...localSettings.pairs, newPair.toUpperCase()] };
    setLocalSettings(updated);
    onSave(updated);
    setNewPair('');
  };

  const removePair = (pair: string) => {
    const updated = { ...localSettings, pairs: localSettings.pairs.filter(p => p !== pair) };
    setLocalSettings(updated);
    onSave(updated);
  };

  const handleAddSession = () => {
    if (!newSession.trim() || localSettings.sessions.includes(newSession.trim())) return;
    const updated = { ...localSettings, sessions: [...localSettings.sessions, newSession.trim()] };
    setLocalSettings(updated);
    onSave(updated);
    setNewSession('');
  };

  const removeSession = (session: string) => {
    const updated = { ...localSettings, sessions: localSettings.sessions.filter(s => s !== session) };
    setLocalSettings(updated);
    onSave(updated);
  };

  const setTheme = (theme: ThemeMode) => {
    const updated = { ...localSettings, theme };
    setLocalSettings(updated);
    onSave(updated);
  };

  return (
    <div className="max-w-3xl animate-slide-up">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Account Settings</h1>
        <p className="text-gray-400 dark:text-gray-600 text-sm">Configure your trading environment.</p>
      </header>

      <section className="bg-white dark:bg-[#111] rounded-2xl border border-gray-50 dark:border-white/[0.03] p-8 shadow-sm space-y-10">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Appearance</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${localSettings.theme === 'light' ? 'bg-black text-white border-black' : 'bg-gray-50 dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 text-gray-400'}`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${localSettings.theme === 'dark' ? 'bg-white text-black border-white' : 'bg-gray-50 dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 text-gray-400'}`}
            >
              <Moon className="w-4 h-4" /> Dark Mode
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-white/[0.03]">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Risk Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-600 mb-2 uppercase tracking-tight">Default Risk Per Trade (%)</label>
              <input 
                type="number" step="0.1"
                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-xl p-4 text-sm font-bold text-black dark:text-white outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-white/20"
                value={localSettings.defaultRisk}
                onChange={e => {
                  const updated = { ...localSettings, defaultRisk: parseFloat(e.target.value) };
                  setLocalSettings(updated);
                  onSave(updated);
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-white/[0.03]">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Tracked Instruments</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {localSettings.pairs.map((pair, index) => (
              <div key={pair} className={`flex items-center gap-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 px-3 py-1.5 rounded-lg group animate-scale-in stagger-${(index % 3) + 1}`}>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{pair}</span>
                <button onClick={() => removePair(pair)} className="text-gray-300 dark:text-gray-700 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="e.g. US30, BTCUSD"
              className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-black dark:text-white outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-white/20"
              value={newPair}
              onChange={e => setNewPair(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPair()}
            />
            <Button onClick={handleAddPair} variant="secondary" className="rounded-xl dark:bg-[#222] dark:border-white/10 dark:text-white hover:dark:bg-[#333] transition-all"><Plus className="w-4 h-4 mr-2" /> Add Pair</Button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-white/[0.03]">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Trading Sessions</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {localSettings.sessions.map((session, index) => (
              <div key={session} className={`flex items-center gap-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 px-3 py-1.5 rounded-lg group animate-scale-in stagger-${(index % 3) + 1}`}>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{session}</span>
                <button onClick={() => removeSession(session)} className="text-gray-300 dark:text-gray-700 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="e.g. London, New York, Asia"
              className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-black dark:text-white outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-white/20"
              value={newSession}
              onChange={e => setNewSession(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddSession()}
            />
            <Button onClick={handleAddSession} variant="secondary" className="rounded-xl dark:bg-[#222] dark:border-white/10 dark:text-white hover:dark:bg-[#333] transition-all"><Plus className="w-4 h-4 mr-2" /> Add Session</Button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-white/[0.03] text-center">
          <p className="text-xs text-gray-300 dark:text-gray-800 italic">"Discipline is doing what needs to be done, even if you don't want to do it."</p>
        </div>
      </section>
    </div>
  );
};
