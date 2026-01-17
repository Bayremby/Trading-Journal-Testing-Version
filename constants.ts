
import { Rule, Criterion, UserSettings, TradingSystemModel } from './types';

export const DEFAULT_RULES: Rule[] = [
  { id: '1', text: 'Wait for the HTF narrative to align', active: true },
  { id: '2', text: 'Do not trade outside of Killzones', active: true },
  { id: '3', text: 'Only risk 0.5% - 1% per trade', active: true },
  { id: '4', text: 'Exit trade if bias is invalidated', active: true },
];

export const DEFAULT_CRITERIA: Criterion[] = [
  { id: 'c1', name: 'What is the Daily Bias?', type: 'Question', response: 'Determined by previous day high/low sweep or HTF order flow.' },
  { id: 'c2', name: 'Entry Confluence Checklist', type: 'Checklist', options: ['MSS (Market Structure Shift)', 'FVG Entry', 'Stop Loss below low'] },
];

export const DEFAULT_SYSTEM: TradingSystemModel = {
  id: 'default-system',
  name: 'Primary ICT Model',
  rules: DEFAULT_RULES,
  customCriteria: DEFAULT_CRITERIA,
  samples: []
};

export const DEFAULT_PAIRS = ['EURUSD', 'GBPUSD', 'NASDAQ', 'ES', 'GOLD', 'USDJPY'];
export const DEFAULT_SESSIONS = ['London', 'New York', 'Pre-NY', 'Asia'];

export const INITIAL_SETTINGS: UserSettings = {
  systems: [DEFAULT_SYSTEM],
  defaultRisk: 0.5,
  pairs: DEFAULT_PAIRS,
  sessions: DEFAULT_SESSIONS,
  theme: 'light',
};

export const SESSIONS = DEFAULT_SESSIONS; // Keep for backward compatibility
export const POIS = ['FVG', 'Order Block', 'Breaker', 'Liquidity Sweep', 'Previous High/Low'];
