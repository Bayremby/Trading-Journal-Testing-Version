import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Trades } from './components/Trades';
import { Settings as SettingsComponent } from './components/Settings';
import { TradingSystem } from './components/TradingSystem';
import { Psychology } from './components/Psychology';
import { TradeEntryModal } from './components/TradeEntryModal';
import { TradeReviewModal } from './components/TradeReviewModal';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { storage } from './services/storage';
import { dataSync } from './services/dataSync';
import { Trade, UserSettings, ThemeMode } from './types';
import { Plus } from 'lucide-react';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
};

// Main App Content (Protected)
interface AppContentProps {
  onToggleTheme: () => void;
  currentTheme: ThemeMode;
}

const AppContent: React.FC<AppContentProps> = ({ onToggleTheme, currentTheme }) => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [reviewingTrade, setReviewingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    // Load data from localStorage first
    setTrades(storage.getTrades());
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);

    // If user is logged in, sync with Supabase
    if (user) {
      // Try to load from Supabase, if empty upload local data
      const loadFromSupabase = async () => {
        try {
          const cloudTrades = await dataSync.loadTrades(user.id);
          if (cloudTrades.length > 0) {
            setTrades(cloudTrades);
            storage.saveTrades(cloudTrades);
          } else {
            // Upload local data to Supabase if cloud is empty
            const localTrades = storage.getTrades();
            if (localTrades.length > 0) {
              await dataSync.syncTrades(user.id, localTrades);
            }
          }

          // Sync settings
          const cloudSettings = await dataSync.loadSettings(user.id);
          if (cloudSettings) {
            const systems = await dataSync.loadSystems(user.id);
            const fullSettings = { ...cloudSettings, systems };
            setSettings(fullSettings);
            storage.saveSettings(fullSettings);
          } else {
            // Upload local settings to Supabase
            await dataSync.syncSettings(user.id, savedSettings);
            await dataSync.syncSystems(user.id, savedSettings.systems);
          }
        } catch (err) {
          console.error('Error syncing with Supabase:', err);
        }
      };
      loadFromSupabase();
    }
  }, [user]);

  const handleSaveTrade = async (tradeToSave: Trade) => {
    let updatedTrades: Trade[];
    const exists = trades.find(t => t.id === tradeToSave.id);
    
    if (exists) {
      updatedTrades = trades.map(t => t.id === tradeToSave.id ? tradeToSave : t);
    } else {
      updatedTrades = [...trades, tradeToSave];
    }
    
    setTrades(updatedTrades);
    storage.saveTrades(updatedTrades);

    // Sync to Supabase if user is logged in
    if (user) {
      try {
        await dataSync.syncTrades(user.id, [tradeToSave]);
      } catch (err) {
        console.error('Error syncing trade to Supabase:', err);
      }
    }
  };

  const handleDeleteTrade = async (id: string) => {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated);
    storage.saveTrades(updated);

    // Delete from Supabase if user is logged in
    if (user) {
      try {
        await dataSync.deleteTrade(id);
      } catch (err) {
        console.error('Error deleting trade from Supabase:', err);
      }
    }
  };

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);

    // Sync to Supabase if user is logged in
    if (user) {
      try {
        await dataSync.syncSettings(user.id, newSettings);
        await dataSync.syncSystems(user.id, newSettings.systems);
      } catch (err) {
        console.error('Error syncing settings to Supabase:', err);
      }
    }
  };

  const openEntryModal = (date?: string, tradeToEdit?: Trade) => {
    setEditingTrade(tradeToEdit || null);
    setSelectedDate(date || new Date().toISOString().split('T')[0]);
    setIsEntryModalOpen(true);
    setIsReviewModalOpen(false);
  };

  const openReviewModal = (trade: Trade) => {
    setReviewingTrade(trade);
    setIsReviewModalOpen(true);
  };

  return (
    <Layout onToggleTheme={onToggleTheme} currentTheme={currentTheme}>
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
  );
};

// Main App with Auth
const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('silence_journal_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.theme || 'dark';
      } catch {
        return 'dark';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Also update in localStorage
    const saved = localStorage.getItem('silence_journal_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        settings.theme = newTheme;
        localStorage.setItem('silence_journal_settings', JSON.stringify(settings));
      } catch {
        // Ignore parse errors
      }
    }
  };

  const handleLoginSuccess = () => {
    // Refresh theme after login
    const saved = localStorage.getItem('silence_journal_settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setTheme(settings.theme || 'dark');
      } catch {
        // Ignore
      }
    }
  };

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage onToggleTheme={handleToggleTheme} currentTheme={theme} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppContent onToggleTheme={handleToggleTheme} currentTheme={theme} />
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
