
import { Trade, UserSettings } from '../types';
import { INITIAL_SETTINGS } from '../constants';

const KEYS = {
  TRADES: 'silence_journal_trades',
  SETTINGS: 'silence_journal_settings',
};

export const storage = {
  getTrades: (): Trade[] => {
    const data = localStorage.getItem(KEYS.TRADES);
    if (!data) return [];
    
    const trades = JSON.parse(data);
    // Migration: Add psychology fields if missing
    return trades.map((trade: Trade) => ({
      ...trade,
      emotions: trade.emotions || [],
      ruleRespectScore: trade.ruleRespectScore ?? 100,
      rulesFollowedCount: trade.rulesFollowedCount ?? 0,
      totalActiveRules: trade.totalActiveRules ?? 0,
    }));
  },
  saveTrades: (trades: Trade[]) => {
    localStorage.setItem(KEYS.TRADES, JSON.stringify(trades));
  },
  getSettings: (): UserSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) return INITIAL_SETTINGS;
    
    const settings = JSON.parse(data);
    // Migration: Add sessions if missing
    if (!settings.sessions) {
      settings.sessions = INITIAL_SETTINGS.sessions;
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    }
    return settings;
  },
  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};
