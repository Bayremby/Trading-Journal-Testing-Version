
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Trades } from './components/Trades';
import { Settings as SettingsComponent } from './components/Settings';
import { TradingSystem } from './components/TradingSystem';
import { Psychology } from './components/Psychology';
import { TradeEntryModal } from './components/TradeEntryModal';
import { TradeReviewModal } from './components/TradeReviewModal';
import { storage } from './services/storage';
import { Trade, UserSettings, ThemeMode } from './types';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [reviewingTrade, setReviewingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    setTrades(storage.getTrades());
    applyTheme(settings.theme);
  }, []);

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleSaveTrade = (tradeToSave: Trade) => {
    let updatedTrades: Trade[];
    const exists = trades.find(t => t.id === tradeToSave.id);
    
    if (exists) {
      updatedTrades = trades.map(t => t.id === tradeToSave.id ? tradeToSave : t);
    } else {
      updatedTrades = [...trades, tradeToSave];
    }
    
    setTrades(updatedTrades);
    storage.saveTrades(updatedTrades);
  };

  const handleDeleteTrade = (id: string) => {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated);
    storage.saveTrades(updated);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
    applyTheme(newSettings.theme);
  };

  const handleToggleTheme = () => {
    const newTheme: ThemeMode = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ ...settings, theme: newTheme });
  };

  const openEntryModal = (date?: string, tradeToEdit?: Trade) => {
    setEditingTrade(tradeToEdit || null);
    setSelectedDate(date || new Date().toISOString().split('T')[0]);
    setIsEntryModalOpen(true);
    setIsReviewModalOpen(false); // Close review if editing
  };

  const openReviewModal = (trade: Trade) => {
    setReviewingTrade(trade);
    setIsReviewModalOpen(true);
  };

  return (
    <HashRouter>
      <Layout onToggleTheme={handleToggleTheme} currentTheme={settings.theme}>
        <Routes>
          <Route path="/" element={<Dashboard trades={trades} settings={settings} onOpenReview={openReviewModal} />} />
          <Route path="/trades" element={<Trades trades={trades} onOpenReview={openReviewModal} onOpenEntry={openEntryModal} />} />
          <Route path="/system" element={<TradingSystem settings={settings} onSave={handleUpdateSettings} trades={trades} />} />
          <Route path="/psychology" element={<Psychology trades={trades} settings={settings} />} />
          <Route path="/settings" element={<SettingsComponent settings={settings} onSave={handleUpdateSettings} />} />
        </Routes>

        {/* Floating Journal Button */}
        <button 
          onClick={() => openEntryModal()}
          className="fixed bottom-12 right-12 w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-105 hover:-translate-y-1 transition-all active:scale-95 z-40 animate-fade-in"
          title="New Journal Entry"
        >
          <Plus className="w-8 h-8" />
        </button>

        {isEntryModalOpen && (
          <TradeEntryModal 
            isOpen={isEntryModalOpen} 
            onClose={() => setIsEntryModalOpen(false)} 
            onSave={handleSaveTrade}
            onDelete={editingTrade ? () => handleDeleteTrade(editingTrade.id) : undefined}
            settings={settings}
            initialDate={selectedDate || undefined}
            editTrade={editingTrade || undefined}
          />
        )}

        {isReviewModalOpen && reviewingTrade && (
          <TradeReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            trade={reviewingTrade}
            settings={settings}
            onEdit={(trade) => openEntryModal(undefined, trade)}
            onDelete={handleDeleteTrade}
          />
        )}
      </Layout>
    </HashRouter>
  );
};

export default App;
