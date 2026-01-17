import { Trade, TradingSystemModel, TradeGrade } from '../types';

// ============================================
// AI MENTOR SERVICE - Psychology & Strategy Intelligence
// ============================================

// ============================================
// TRADE GRADING SYSTEM
// ============================================

export function getGradeColor(grade: TradeGrade): string {
  if (grade === 'A+' || grade === 'A') return 'text-emerald-500';
  if (grade === 'B') return 'text-blue-500';
  if (grade === 'C') return 'text-amber-500';
  return 'text-gray-500';
}

export function getGradeBgColor(grade: TradeGrade): string {
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-500/10 border-emerald-500/20';
  if (grade === 'B') return 'bg-blue-500/10 border-blue-500/20';
  if (grade === 'C') return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-gray-500/10 border-gray-500/20';
}

export interface PsychologyScore {
  overall: number;
  ruleAdherence: number;
  emotionalStability: number;
  tradingDiscipline: number;
  consistency: number;
}

export interface ScoreExplanation {
  formula: string;
  calculation: string;
  description: string;
}

export interface PsychologyInsight {
  score: PsychologyScore;
  scoreExplanations: Record<keyof PsychologyScore, ScoreExplanation>;
  strengths: string[];
  risks: string[];
  coachingMessage: string;
  warnings: string[];
}

export interface SetupAnalysis {
  session: string;
  poi?: string;
  winRate: number;
  totalTrades: number;
  avgR: number;
  confluenceDetails?: {
    rulesFollowed: string[];
    rulesViolated: string[];
    keyFactors: string[];
  };
}

export interface SystemIntelligence {
  overallWinRate: number;
  edgeClarityScore: number;
  consistencyRating: number;
  bestSetup: SetupAnalysis | null;
  worstSetup: SetupAnalysis | null;
  sessionAnalysis: Record<string, { winRate: number; trades: number; avgR: number }>;
  scoreExplanations: {
    edgeClarity: ScoreExplanation;
    consistency: ScoreExplanation;
  };
  diagnosis: string[];
  recommendations: string[];
}

// ============================================
// PSYCHOLOGY ANALYSIS
// ============================================

export function analyzePsychology(trades: Trade[], systems: TradingSystemModel[]): PsychologyInsight {
  if (trades.length < 5) {
    return {
      score: { overall: 0, ruleAdherence: 0, emotionalStability: 0, tradingDiscipline: 0, consistency: 0 },
      scoreExplanations: {
        overall: { formula: 'Weighted Average', calculation: 'Not enough data', description: 'Overall psychology score based on weighted components' },
        ruleAdherence: { formula: 'Rules Followed / Total Rules × 100', calculation: 'Not enough data', description: 'How well you follow your trading rules' },
        emotionalStability: { formula: 'Emotion Analysis Score', calculation: 'Not enough data', description: 'Your emotional control during trading' },
        tradingDiscipline: { formula: 'Risk Consistency Score', calculation: 'Not enough data', description: 'How consistently you manage risk' },
        consistency: { formula: 'Pattern Consistency Score', calculation: 'Not enough data', description: 'How consistent your trading behavior is' }
      },
      strengths: [],
      risks: ['Not enough trade data for analysis. Log at least 5 trades.'],
      coachingMessage: 'Start logging your trades consistently to receive personalized coaching insights.',
      warnings: []
    };
  }

  // Calculate rule adherence (40% of score)
  const ruleAdherence = calculateRuleAdherence(trades);
  
  // Calculate emotional stability (30% of score)
  const emotionalStability = calculateEmotionalStability(trades);
  
  // Calculate trading discipline (20% of score)
  const tradingDiscipline = calculateTradingDiscipline(trades);
  
  // Calculate consistency (10% of score)
  const consistency = calculateConsistency(trades);
  
  // Overall score
  const overall = Math.round(
    ruleAdherence * 0.4 +
    emotionalStability * 0.3 +
    tradingDiscipline * 0.2 +
    consistency * 0.1
  );

  const strengths = identifyStrengths(trades, { ruleAdherence, emotionalStability, tradingDiscipline, consistency });
  const risks = identifyRisks(trades, { ruleAdherence, emotionalStability, tradingDiscipline, consistency });
  const coachingMessage = generateCoachingMessage(trades, { overall, ruleAdherence, emotionalStability, tradingDiscipline, consistency });
  const warnings = generateWarnings(trades);

  // Generate score explanations
  const scoreExplanations = {
    overall: { 
      formula: 'Rule Adherence (40%) + Emotional Stability (30%) + Trading Discipline (20%) + Consistency (10%)', 
      calculation: `${(ruleAdherence * 0.4).toFixed(1)} + ${(emotionalStability * 0.3).toFixed(1)} + ${(tradingDiscipline * 0.2).toFixed(1)} + ${(consistency * 0.1).toFixed(1)} = ${overall}`, 
      description: 'Overall psychology score based on weighted components' 
    },
    ruleAdherence: { 
      formula: 'Rules Followed / Total Rules × 100', 
      calculation: `Based on ${trades.filter(t => t.rulesFollowed).length} trades with rule tracking`, 
      description: 'How well you follow your trading rules' 
    },
    emotionalStability: { 
      formula: 'Emotion Analysis Score', 
      calculation: `Analyzed ${trades.filter(t => t.emotions && t.emotions.length > 0).length} trades with emotions`, 
      description: 'Your emotional control during trading' 
    },
    tradingDiscipline: { 
      formula: 'Risk Consistency Score', 
      calculation: `Based on risk consistency across ${trades.length} trades`, 
      description: 'How consistently you manage risk' 
    },
    consistency: { 
      formula: 'Pattern Consistency Score', 
      calculation: `Pattern analysis of ${trades.length} trades`, 
      description: 'How consistent your trading behavior is' 
    }
  };

  return {
    score: { overall, ruleAdherence, emotionalStability, tradingDiscipline, consistency },
    scoreExplanations,
    strengths,
    risks,
    coachingMessage,
    warnings
  };
}

function calculateRuleAdherence(trades: Trade[]): number {
  const tradesWithRules = trades.filter(t => t.rulesFollowed && Object.keys(t.rulesFollowed).length > 0);
  if (tradesWithRules.length === 0) return 50; // Neutral if no rules tracked

  let totalRules = 0;
  let followedRules = 0;

  tradesWithRules.forEach(trade => {
    const rules = Object.entries(trade.rulesFollowed || {});
    totalRules += rules.length;
    followedRules += rules.filter(([_, followed]) => followed).length;
  });

  return totalRules > 0 ? Math.round((followedRules / totalRules) * 100) : 50;
}

function calculateEmotionalStability(trades: Trade[]): number {
  // Analyze trading patterns after losses
  let stabilityScore = 70; // Base score
  
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let consecutiveLosses = 0;
  let revengeTradeIndicators = 0;
  
  for (let i = 0; i < sortedTrades.length; i++) {
    const trade = sortedTrades[i];
    const isLoss = trade.resultR < 0;
    
    if (isLoss) {
      consecutiveLosses++;
      
      // Check for revenge trading patterns (multiple trades same day after loss)
      if (i < sortedTrades.length - 1) {
        const nextTrade = sortedTrades[i + 1];
        const sameDay = trade.date === nextTrade.date;
        if (sameDay && consecutiveLosses >= 2) {
          revengeTradeIndicators++;
        }
      }
    } else {
      consecutiveLosses = 0;
    }
  }

  // Penalize for revenge trading indicators
  stabilityScore -= revengeTradeIndicators * 10;
  
  return Math.max(0, Math.min(100, stabilityScore));
}

function calculateTradingDiscipline(trades: Trade[]): number {
  let disciplineScore = 70;
  
  // Check for overtrading (more than 5 trades per day)
  const tradesByDay: Record<string, number> = {};
  trades.forEach(t => {
    const day = t.date.split('T')[0];
    tradesByDay[day] = (tradesByDay[day] || 0) + 1;
  });
  
  const overtradingDays = Object.values(tradesByDay).filter(count => count > 5).length;
  disciplineScore -= overtradingDays * 5;
  
  // Bonus for consistent risk percentage (if available)
  const riskPercents = trades.map(t => t.riskPercent).filter(Boolean);
  if (riskPercents.length > 5) {
    const avgRisk = riskPercents.reduce((a, b) => a + b, 0) / riskPercents.length;
    const variance = riskPercents.reduce((sum, risk) => sum + Math.pow(risk - avgRisk, 2), 0) / riskPercents.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avgRisk; // Coefficient of variation
    
    if (cv < 0.2) disciplineScore += 15; // Very consistent
    else if (cv < 0.4) disciplineScore += 5; // Somewhat consistent
    else disciplineScore -= 10; // Inconsistent
  }
  
  return Math.max(0, Math.min(100, disciplineScore));
}

function calculateConsistency(trades: Trade[]): number {
  if (trades.length < 10) return 50;
  
  // Calculate weekly trading frequency consistency
  const tradesByWeek: Record<string, number> = {};
  trades.forEach(t => {
    const date = new Date(t.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    tradesByWeek[weekKey] = (tradesByWeek[weekKey] || 0) + 1;
  });
  
  const weeklyTrades = Object.values(tradesByWeek);
  if (weeklyTrades.length < 2) return 50;
  
  const avgWeekly = weeklyTrades.reduce((a, b) => a + b, 0) / weeklyTrades.length;
  const variance = weeklyTrades.reduce((sum, count) => sum + Math.pow(count - avgWeekly, 2), 0) / weeklyTrades.length;
  const cv = Math.sqrt(variance) / avgWeekly;
  
  // Lower CV = more consistent
  if (cv < 0.3) return 90;
  if (cv < 0.5) return 70;
  if (cv < 0.7) return 50;
  return 30;
}

function identifyStrengths(trades: Trade[], scores: { ruleAdherence: number; emotionalStability: number; tradingDiscipline: number; consistency: number }): string[] {
  const strengths: string[] = [];
  
  if (scores.ruleAdherence >= 80) {
    strengths.push('Excellent rule adherence - you follow your trading plan consistently.');
  }
  if (scores.emotionalStability >= 75) {
    strengths.push('Strong emotional control - you handle losses well without revenge trading.');
  }
  if (scores.tradingDiscipline >= 75) {
    strengths.push('Good trading discipline - consistent position sizing and trade frequency.');
  }
  if (scores.consistency >= 70) {
    strengths.push('Consistent trading routine - regular journaling and trading schedule.');
  }
  
  // Session-based analysis
  const sessionWinRates = analyzeSessionPerformance(trades);
  const bestSession = Object.entries(sessionWinRates)
    .filter(([_, data]) => data.trades >= 5)
    .sort((a, b) => b[1].winRate - a[1].winRate)[0];
  
  if (bestSession && bestSession[1].winRate >= 60) {
    strengths.push(`Strong performance during ${bestSession[0]} session (${bestSession[1].winRate.toFixed(0)}% win rate).`);
  }
  
  return strengths.slice(0, 4);
}

function identifyRisks(trades: Trade[], scores: { ruleAdherence: number; emotionalStability: number; tradingDiscipline: number; consistency: number }): string[] {
  const risks: string[] = [];
  
  if (scores.ruleAdherence < 60) {
    risks.push('Rule violations are impacting your performance. Focus on following your system.');
  }
  if (scores.emotionalStability < 60) {
    risks.push('Signs of emotional trading detected. Consider taking breaks after losses.');
  }
  if (scores.tradingDiscipline < 60) {
    risks.push('Overtrading or inconsistent position sizing detected.');
  }
  if (scores.consistency < 50) {
    risks.push('Inconsistent trading routine may be affecting your edge.');
  }
  
  // Check for specific patterns
  const recentTrades = trades.slice(-20);
  const lossStreak = findLongestLossStreak(recentTrades);
  if (lossStreak >= 4) {
    risks.push(`Recent loss streak of ${lossStreak} trades detected. Review your recent setups.`);
  }
  
  return risks.slice(0, 4);
}

function findLongestLossStreak(trades: Trade[]): number {
  let maxStreak = 0;
  let currentStreak = 0;
  
  trades.forEach(t => {
    if (t.resultR < 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return maxStreak;
}

function generateCoachingMessage(trades: Trade[], scores: PsychologyScore): string {
  const messages: string[] = [];
  
  if (scores.overall >= 80) {
    messages.push("You're performing exceptionally well. Your discipline and consistency are paying off.");
  } else if (scores.overall >= 60) {
    messages.push("You're on the right track, but there's room for improvement.");
  } else {
    messages.push("Your trading psychology needs attention. Focus on the fundamentals.");
  }
  
  // Add specific advice based on weakest area
  const weakest = Object.entries(scores)
    .filter(([key]) => key !== 'overall')
    .sort((a, b) => (a[1] as number) - (b[1] as number))[0];
  
  switch (weakest[0]) {
    case 'ruleAdherence':
      messages.push("Your biggest opportunity is improving rule adherence. Before each trade, review your checklist and ensure all criteria are met.");
      break;
    case 'emotionalStability':
      messages.push("Work on emotional control. Consider implementing a mandatory 30-minute break after any losing trade.");
      break;
    case 'tradingDiscipline':
      messages.push("Focus on discipline. Set a maximum number of trades per day and stick to consistent position sizing.");
      break;
    case 'consistency':
      messages.push("Build a consistent routine. Trade at the same times each day and journal every trade immediately.");
      break;
  }
  
  return messages.join(' ');
}

function generateWarnings(trades: Trade[]): string[] {
  const warnings: string[] = [];
  const recentTrades = trades.slice(-30);
  
  // Check for Friday performance
  const fridayTrades = recentTrades.filter(t => new Date(t.date).getDay() === 5);
  if (fridayTrades.length >= 3) {
    const fridayWinRate = fridayTrades.filter(t => t.resultR > 0).length / fridayTrades.length;
    if (fridayWinRate < 0.4) {
      warnings.push('Your Friday performance is below average. Consider reducing Friday trading.');
    }
  }
  
  // Check for late-day performance
  const lateTrades = recentTrades.filter(t => {
    const hour = new Date(t.date).getHours();
    return hour >= 16;
  });
  if (lateTrades.length >= 3) {
    const lateWinRate = lateTrades.filter(t => t.resultR > 0).length / lateTrades.length;
    if (lateWinRate < 0.4) {
      warnings.push('Your performance drops after 4 PM. Consider ending your trading day earlier.');
    }
  }
  
  // Check for win streak overconfidence
  const winStreak = findLongestWinStreak(recentTrades);
  if (winStreak >= 5) {
    warnings.push(`After win streaks of ${winStreak}+, watch for overconfidence. Stick to your rules.`);
  }
  
  return warnings;
}

function findLongestWinStreak(trades: Trade[]): number {
  let maxStreak = 0;
  let currentStreak = 0;
  
  trades.forEach(t => {
    if (t.resultR > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return maxStreak;
}

function analyzeSessionPerformance(trades: Trade[]): Record<string, { winRate: number; trades: number; avgR: number }> {
  const sessions: Record<string, { wins: number; total: number; totalR: number }> = {
    'Asian': { wins: 0, total: 0, totalR: 0 },
    'London': { wins: 0, total: 0, totalR: 0 },
    'New York': { wins: 0, total: 0, totalR: 0 },
    'Off-Hours': { wins: 0, total: 0, totalR: 0 }
  };
  
  trades.forEach(t => {
    const hour = new Date(t.date).getHours();
    let session = 'Off-Hours';
    
    if (hour >= 0 && hour < 8) session = 'Asian';
    else if (hour >= 8 && hour < 13) session = 'London';
    else if (hour >= 13 && hour < 21) session = 'New York';
    
    sessions[session].total++;
    sessions[session].totalR += t.resultR;
    if (t.resultR > 0) sessions[session].wins++;
  });
  
  const result: Record<string, { winRate: number; trades: number; avgR: number }> = {};
  Object.entries(sessions).forEach(([name, data]) => {
    if (data.total > 0) {
      result[name] = {
        winRate: (data.wins / data.total) * 100,
        trades: data.total,
        avgR: data.totalR / data.total
      };
    }
  });
  
  return result;
}

// ============================================
// SYSTEM INTELLIGENCE ANALYSIS
// ============================================

export function analyzeSystemIntelligence(trades: Trade[], system: TradingSystemModel): SystemIntelligence {
  const systemTrades = trades.filter(t => t.systemId === system.id);
  
  if (systemTrades.length < 10) {
    return {
      overallWinRate: 0,
      edgeClarityScore: 0,
      consistencyRating: 0,
      bestSetup: null,
      worstSetup: null,
      sessionAnalysis: {},
      scoreExplanations: {
        edgeClarity: { 
          formula: 'Win Rate (40%) + Consistency (25%) + Rule Adherence (20%) + Sample Size (15%)', 
          calculation: 'Not enough data', 
          description: 'How clear and reliable your trading edge is' 
        },
        consistency: { 
          formula: 'Performance Variance Score', 
          calculation: 'Not enough data', 
          description: 'How consistent your trading results are over time' 
        }
      },
      diagnosis: ['Not enough trades for analysis. Log at least 10 trades with this system.'],
      recommendations: ['Continue trading and logging to build a meaningful sample size.']
    };
  }
  
  // Calculate overall metrics
  const wins = systemTrades.filter(t => t.resultR > 0).length;
  const overallWinRate = (wins / systemTrades.length) * 100;
  
  // Session analysis
  const sessionAnalysis = analyzeSessionPerformance(systemTrades);
  
  // Find best and worst setups by session
  const sessionEntries = Object.entries(sessionAnalysis).filter(([_, data]) => data.trades >= 3);
  const sortedByWinRate = [...sessionEntries].sort((a, b) => b[1].winRate - a[1].winRate);
  
  // Add confluence details to best and worst setups
  const bestSetup: SetupAnalysis | null = sortedByWinRate.length > 0 ? {
    session: sortedByWinRate[0][0],
    winRate: sortedByWinRate[0][1].winRate,
    totalTrades: sortedByWinRate[0][1].trades,
    avgR: sortedByWinRate[0][1].avgR,
    confluenceDetails: generateConfluenceDetails(systemTrades.filter(t => {
      const hour = new Date(t.date).getHours();
      let session = 'Off-Hours';
      if (hour >= 0 && hour < 8) session = 'Asian';
      else if (hour >= 8 && hour < 13) session = 'London';
      else if (hour >= 13 && hour < 21) session = 'New York';
      return session === sortedByWinRate[0][0];
    }), system)
  } : null;
  
  const worstSetup: SetupAnalysis | null = sortedByWinRate.length > 1 ? {
    session: sortedByWinRate[sortedByWinRate.length - 1][0],
    winRate: sortedByWinRate[sortedByWinRate.length - 1][1].winRate,
    totalTrades: sortedByWinRate[sortedByWinRate.length - 1][1].trades,
    avgR: sortedByWinRate[sortedByWinRate.length - 1][1].avgR,
    confluenceDetails: generateConfluenceDetails(systemTrades.filter(t => {
      const hour = new Date(t.date).getHours();
      let session = 'Off-Hours';
      if (hour >= 0 && hour < 8) session = 'Asian';
      else if (hour >= 8 && hour < 13) session = 'London';
      else if (hour >= 13 && hour < 21) session = 'New York';
      return session === sortedByWinRate[sortedByWinRate.length - 1][0];
    }), system)
  } : null;
  
  // Calculate edge clarity score
  const edgeClarityScore = calculateEdgeClarityScore(systemTrades, overallWinRate, system);
  
  // Calculate consistency rating
  const consistencyRating = calculateSystemConsistency(systemTrades);
  
  // Generate diagnosis and recommendations
  const diagnosis = generateSystemDiagnosis(systemTrades, overallWinRate, sessionAnalysis, system);
  const recommendations = generateSystemRecommendations(systemTrades, overallWinRate, bestSetup, worstSetup, system);
  
  // Generate score explanations
  const scoreExplanations = {
    edgeClarity: { 
      formula: 'Win Rate (40%) + Consistency (25%) + Rule Adherence (20%) + Sample Size (15%)', 
      calculation: `${(overallWinRate * 0.4).toFixed(1)} + ${(consistencyRating * 0.25).toFixed(1)} + ${(calculateRuleAdherence(systemTrades) * 0.2).toFixed(1)} + ${Math.min(systemTrades.length * 1.5, 15).toFixed(1)} = ${edgeClarityScore.toFixed(1)}`, 
      description: 'How clear and reliable your trading edge is' 
    },
    consistency: { 
      formula: 'Performance Variance Score', 
      calculation: `Based on variance across ${systemTrades.length} trades`, 
      description: 'How consistent your trading results are over time' 
    }
  };
  
  return {
    overallWinRate,
    edgeClarityScore,
    consistencyRating,
    bestSetup,
    worstSetup,
    sessionAnalysis,
    scoreExplanations,
    diagnosis,
    recommendations
  };
}

function generateConfluenceDetails(trades: Trade[], system: TradingSystemModel): { rulesFollowed: string[]; rulesViolated: string[]; keyFactors: string[] } {
  const rulesFollowed: string[] = [];
  const rulesViolated: string[] = [];
  const keyFactors: string[] = [];
  
  // Analyze rule adherence
  trades.forEach(trade => {
    if (trade.rulesFollowed) {
      Object.entries(trade.rulesFollowed).forEach(([ruleId, followed]) => {
        const rule = system.rules.find(r => r.id === ruleId);
        if (rule) {
          if (followed) {
            if (!rulesFollowed.includes(rule.text)) rulesFollowed.push(rule.text);
          } else {
            if (!rulesViolated.includes(rule.text)) rulesViolated.push(rule.text);
          }
        }
      });
    }
    
    // Analyze key factors
    if (trade.pois && trade.pois.length > 0) {
      trade.pois.forEach(poi => {
        if (!keyFactors.includes(poi)) keyFactors.push(poi);
      });
    }
    
    if (trade.sessions && trade.sessions.length > 0) {
      trade.sessions.forEach(session => {
        if (!keyFactors.includes(session)) keyFactors.push(session);
      });
    }
  });
  
  return { rulesFollowed, rulesViolated, keyFactors };
}

function calculateEdgeClarityScore(trades: Trade[], winRate: number, system: TradingSystemModel): number {
  // Win rate contribution (40%)
  const winRateScore = Math.min(100, winRate * 1.5);
  
  // Consistency contribution (25%)
  const consistencyScore = calculateSystemConsistency(trades);
  
  // Rule adherence contribution (20%)
  let ruleAdherenceScore = 50;
  const tradesWithRules = trades.filter(t => t.rulesFollowed && Object.keys(t.rulesFollowed).length > 0);
  if (tradesWithRules.length > 0) {
    let totalRules = 0;
    let followedRules = 0;
    tradesWithRules.forEach(trade => {
      const rules = Object.entries(trade.rulesFollowed || {});
      totalRules += rules.length;
      followedRules += rules.filter(([_, followed]) => followed).length;
    });
    ruleAdherenceScore = totalRules > 0 ? (followedRules / totalRules) * 100 : 50;
  }
  
  // Sample size reliability (15%)
  let sampleScore = 0;
  if (trades.length >= 100) sampleScore = 100;
  else if (trades.length >= 50) sampleScore = 80;
  else if (trades.length >= 30) sampleScore = 60;
  else if (trades.length >= 10) sampleScore = 40;
  else sampleScore = 20;
  
  return Math.round(
    winRateScore * 0.4 +
    consistencyScore * 0.25 +
    ruleAdherenceScore * 0.2 +
    sampleScore * 0.15
  );
}

function calculateSystemConsistency(trades: Trade[]): number {
  if (trades.length < 10) return 50;
  
  // Calculate monthly performance consistency
  const monthlyResults: Record<string, { wins: number; total: number }> = {};
  
  trades.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!monthlyResults[month]) {
      monthlyResults[month] = { wins: 0, total: 0 };
    }
    monthlyResults[month].total++;
    if (t.resultR > 0) monthlyResults[month].wins++;
  });
  
  const monthlyWinRates = Object.values(monthlyResults)
    .filter(m => m.total >= 5)
    .map(m => m.wins / m.total);
  
  if (monthlyWinRates.length < 2) return 50;
  
  const avgWinRate = monthlyWinRates.reduce((a, b) => a + b, 0) / monthlyWinRates.length;
  const variance = monthlyWinRates.reduce((sum, wr) => sum + Math.pow(wr - avgWinRate, 2), 0) / monthlyWinRates.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower standard deviation = more consistent
  if (stdDev < 0.1) return 90;
  if (stdDev < 0.15) return 75;
  if (stdDev < 0.2) return 60;
  if (stdDev < 0.25) return 45;
  return 30;
}

function generateSystemDiagnosis(
  trades: Trade[],
  winRate: number,
  sessionAnalysis: Record<string, { winRate: number; trades: number; avgR: number }>,
  system: TradingSystemModel
): string[] {
  const diagnosis: string[] = [];
  
  // Overall performance diagnosis
  if (winRate >= 60) {
    diagnosis.push(`Your system shows a strong edge with a ${winRate.toFixed(1)}% win rate.`);
  } else if (winRate >= 50) {
    diagnosis.push(`Your system is marginally profitable at ${winRate.toFixed(1)}% win rate. Focus on improving setup selection.`);
  } else {
    diagnosis.push(`Your system is currently underperforming at ${winRate.toFixed(1)}% win rate. Review your entry criteria.`);
  }
  
  // Session-based diagnosis
  const sessions = Object.entries(sessionAnalysis).filter(([_, data]) => data.trades >= 5);
  if (sessions.length >= 2) {
    const best = sessions.sort((a, b) => b[1].winRate - a[1].winRate)[0];
    const worst = sessions.sort((a, b) => a[1].winRate - b[1].winRate)[0];
    
    if (best[1].winRate - worst[1].winRate > 15) {
      diagnosis.push(`Significant session variance detected: ${best[0]} (${best[1].winRate.toFixed(0)}%) vs ${worst[0]} (${worst[1].winRate.toFixed(0)}%).`);
    }
  }
  
  // Rule violation impact
  const tradesWithViolations = trades.filter(t => {
    const rules = Object.entries(t.rulesFollowed || {});
    return rules.some(([_, followed]) => !followed);
  });
  
  if (tradesWithViolations.length > 0) {
    const violationLosses = tradesWithViolations.filter(t => t.resultR < 0).length;
    const violationLossRate = (violationLosses / tradesWithViolations.length) * 100;
    if (violationLossRate > 60) {
      diagnosis.push(`Rule violations are costly: ${violationLossRate.toFixed(0)}% of trades with violations result in losses.`);
    }
  }
  
  return diagnosis;
}

function generateSystemRecommendations(
  trades: Trade[],
  winRate: number,
  bestSetup: SetupAnalysis | null,
  worstSetup: SetupAnalysis | null,
  system: TradingSystemModel
): string[] {
  const recommendations: string[] = [];
  
  // Session-based recommendations
  if (bestSetup && worstSetup && bestSetup.winRate - worstSetup.winRate > 20) {
    recommendations.push(`Focus on ${bestSetup.session} session where your win rate is ${bestSetup.winRate.toFixed(0)}%. Consider reducing or eliminating ${worstSetup.session} trades.`);
  }
  
  // Win rate based recommendations
  if (winRate < 50) {
    recommendations.push('Review your entry criteria. Consider adding more confluence factors before entering trades.');
  } else if (winRate >= 60) {
    recommendations.push('Your system has a clear edge. Focus on consistency and avoiding rule violations.');
  }
  
  // Sample size recommendation
  if (trades.length < 30) {
    recommendations.push(`Continue logging trades. You have ${trades.length} trades - aim for 30+ for reliable statistics.`);
  } else if (trades.length >= 100) {
    recommendations.push('You have a solid sample size. Your statistics are reliable for decision-making.');
  }
  
  // Average R recommendation
  const avgR = trades.reduce((sum, t) => sum + t.resultR, 0) / trades.length;
  if (avgR < 0) {
    recommendations.push('Your average R is negative. Focus on cutting losses quickly and letting winners run.');
  } else if (avgR > 1) {
    recommendations.push(`Excellent risk management with ${avgR.toFixed(2)}R average. Maintain your current approach.`);
  }
  
  return recommendations.slice(0, 4);
}
