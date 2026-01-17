
export type Session = string; // Sessions are now configurable by user
export type POI = 'FVG' | 'Order Block' | 'Breaker' | 'Liquidity Sweep' | 'Previous High/Low';
export type TradeRating = 1 | 2 | 3 | 4 | 5;
export type TradeGrade = 'A+' | 'A' | 'B' | 'C';
export type ThemeMode = 'light' | 'dark';
export type TradeOutcome = 'Win' | 'Loss' | 'BE';

export interface Rule {
  id: string;
  text: string;
  active: boolean;
}

export interface Criterion {
  id: string;
  name: string;
  type: 'Question' | 'Checklist' | 'Multi-select';
  options?: string[]; // Used for Checklist items and Multi-select options
  response?: string;  // Used for Question/Response type
}

export interface TradingSystemModel {
  id: string;
  name: string;
  rules: Rule[];
  customCriteria: Criterion[];
  samples: string[];
}

export interface Trade {
  id: string;
  systemId: string; // The ID of the system used for this trade
  pair: string;
  date: string;
  entryTime: string;
  exitTime: string;
  sessions: Session[];
  pois: POI[];
  riskPercent: number;
  riskReward: number; // The RR of the trade setup
  resultR: number; // The actual realized R result
  outcome: TradeOutcome;
  rating: TradeRating;
  grade?: TradeGrade; // Calculated grade based on performance
  screenshots: string[]; // base64 or urls
  customCriteria: Record<string, string | string[] | boolean>;
  rulesFollowed: Record<string, boolean>;
  ruleViolationReflection?: string;
  // Psychology Module Fields
  emotions: string[]; // Emotion tags selected before entry
  ruleRespectScore: number; // RRS: (Rules Followed ÷ Total Active Rules) × 100
  rulesFollowedCount: number; // Number of rules followed
  totalActiveRules: number; // Total active rules at time of trade
  reflection: {
    liquidityDraw: string;
    htfNarrative: string;
    mistakes: string;
  };
}

export interface UserSettings {
  systems: TradingSystemModel[];
  defaultRisk: number;
  pairs: string[];
  sessions: string[];
  theme: ThemeMode;
}
