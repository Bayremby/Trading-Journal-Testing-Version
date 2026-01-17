
import { Trade } from '../types';

export const calculateMetrics = (trades: Trade[]) => {
  if (trades.length === 0) {
    return {
      winRate: 0,
      avgRR: 0,
      equityCurve: [],
      rulesFollowedPercent: 0,
      tradesPlannedVsTaken: 0,
      avgRRS30Days: 0,
      emotionPerformance: {},
    };
  }

  const wins = trades.filter(t => t.resultR > 0).length;
  const winRate = (wins / trades.length) * 100;
  
  const totalRR = trades.reduce((acc, t) => acc + (t.resultR > 0 ? t.riskReward : 0), 0);
  const avgRR = totalRR / (wins || 1);

  // Simple Equity Curve (starting from 0R)
  let currentR = 0;
  const equityCurve = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => {
      currentR += t.resultR;
      return { date: t.date, balance: currentR };
    });

  // Calculate rules followed
  let totalRulesChecked = 0;
  let rulesFollowedCount = 0;
  trades.forEach(t => {
    const values = Object.values(t.rulesFollowed);
    totalRulesChecked += values.length;
    rulesFollowedCount += values.filter(v => v === true).length;
  });
  const rulesFollowedPercent = totalRulesChecked === 0 ? 0 : (rulesFollowedCount / totalRulesChecked) * 100;

  // Calculate RRS for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTrades = trades.filter(t => new Date(t.date) >= thirtyDaysAgo);
  const avgRRS30Days = recentTrades.length > 0
    ? recentTrades.reduce((sum, t) => sum + (t.ruleRespectScore || 100), 0) / recentTrades.length
    : 0;

  // Calculate performance by emotion
  const emotionPerformance: Record<string, { wins: number; total: number; winRate: number; avgR: number }> = {};
  const emotionTags = ['Calm', 'Neutral', 'Impatient', 'Confident', 'Fearful', 'FOMO', 'Overconfident', 'Hesitant'];
  
  emotionTags.forEach(emotion => {
    const tradesWithEmotion = trades.filter(t => t.emotions?.includes(emotion));
    if (tradesWithEmotion.length > 0) {
      const wins = tradesWithEmotion.filter(t => t.resultR > 0).length;
      const avgR = tradesWithEmotion.reduce((sum, t) => sum + t.resultR, 0) / tradesWithEmotion.length;
      emotionPerformance[emotion] = {
        wins,
        total: tradesWithEmotion.length,
        winRate: (wins / tradesWithEmotion.length) * 100,
        avgR
      };
    }
  });

  return {
    winRate,
    avgRR,
    equityCurve,
    rulesFollowedPercent,
    avgRRS30Days,
    emotionPerformance,
  };
};
