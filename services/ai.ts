import { Trade, UserSettings } from '../types';

interface AIAnalysis {
  suggestions: string[];
  motivationQuote: string;
  actionableAdvice: string[];
  patternInsights: string;
}

const MOTIVATION_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "The best trade is the one you don't take.",
  "Patience is not the ability to wait, but how you behave while waiting.",
  "Consistency over intensity. Process over outcome.",
  "The market rewards patience and punishes impulsivity.",
  "Silence speaks when your bias is gone.",
  "Master your emotions, master your trading.",
  "Every violation is a lesson, not a failure.",
];

export const analyzePsychologyWithAI = async (
  trades: Trade[],
  ruleViolations: Array<{ ruleText: string; violationRate: number; violations: number; timesActive: number }>,
  selectedSystemName: string,
  avgRRS30Days: number
): Promise<AIAnalysis | null> => {
  // Try multiple ways to access the API key (Vite defines it as process.env.GEMINI_API_KEY)
  // @ts-ignore - Vite injects this at build time
  const apiKey = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY ||
                 (window as any).process?.env?.GEMINI_API_KEY || 
                 import.meta.env.GEMINI_API_KEY || 
                 import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    // Fallback to rule-based analysis if no API key
    return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
  }

  try {
    // Prepare psychology data for AI
    const psychologyData = {
      totalTrades: trades.length,
      avgRRS30Days: avgRRS30Days.toFixed(1),
      mostViolatedRules: ruleViolations.slice(0, 3).map(v => ({
        rule: v.ruleText,
        violationRate: v.violationRate.toFixed(1),
        violations: v.violations,
        timesActive: v.timesActive
      })),
      emotionBreakdown: getEmotionBreakdown(trades),
      recentPerformance: getRecentPerformance(trades),
      systemName: selectedSystemName
    };

    const prompt = `You are a trading psychology coach analyzing a trader's journal data. Provide helpful, non-judgmental insights.

Trading System: ${psychologyData.systemName}
Total Trades: ${psychologyData.totalTrades}
Average Rule Respect Score (30 days): ${psychologyData.avgRRS30Days}%

Most Violated Rules:
${psychologyData.mostViolatedRules.map((r, i) => `${i + 1}. "${r.rule}" - ${r.violationRate}% violation rate (${r.violations}/${r.timesActive} times)`).join('\n')}

Emotion Patterns:
${Object.entries(psychologyData.emotionBreakdown).map(([emotion, stats]) => 
  `- ${emotion}: ${stats.winRate.toFixed(0)}% win rate, ${stats.avgR >= 0 ? '+' : ''}${stats.avgR.toFixed(1)}R avg`
).join('\n')}

Recent Performance: ${psychologyData.recentPerformance}

Provide your response as JSON with this exact structure:
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "motivationQuote": "an inspiring quote",
  "actionableAdvice": ["action 1", "action 2", "action 3"],
  "patternInsights": "a paragraph about patterns you notice"
}

Be specific, actionable, and supportive. Focus on discipline, patience, and process improvement.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
    }
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find JSON in code blocks
      jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonMatch = [jsonMatch[0], jsonMatch[1]];
      }
    }
    
    if (jsonMatch && jsonMatch[0]) {
      try {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
          motivationQuote: analysis.motivationQuote || getRandomQuote(),
          actionableAdvice: Array.isArray(analysis.actionableAdvice) ? analysis.actionableAdvice : [],
          patternInsights: analysis.patternInsights || ''
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
      }
    }

    // Fallback if JSON parsing fails
    return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback to rule-based analysis
    return generateRuleBasedAnalysis(trades, ruleViolations, avgRRS30Days);
  }
};

const getEmotionBreakdown = (trades: Trade[]) => {
  const emotionStats: Record<string, { wins: number; total: number; winRate: number; avgR: number }> = {};
  
  trades.forEach(trade => {
    trade.emotions?.forEach(emotion => {
      if (!emotionStats[emotion]) {
        emotionStats[emotion] = { wins: 0, total: 0, winRate: 0, avgR: 0 };
      }
      emotionStats[emotion].total++;
      if (trade.resultR > 0) emotionStats[emotion].wins++;
      emotionStats[emotion].avgR += trade.resultR;
    });
  });

  Object.keys(emotionStats).forEach(emotion => {
    const stats = emotionStats[emotion];
    stats.winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    stats.avgR = stats.total > 0 ? stats.avgR / stats.total : 0;
  });

  return emotionStats;
};

const getRecentPerformance = (trades: Trade[]) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = trades.filter(t => new Date(t.date) >= thirtyDaysAgo);
  
  if (recent.length === 0) return 'No recent trades';
  
  const wins = recent.filter(t => t.resultR > 0).length;
  const winRate = (wins / recent.length) * 100;
  const avgR = recent.reduce((sum, t) => sum + t.resultR, 0) / recent.length;
  
  return `${winRate.toFixed(0)}% win rate, ${avgR >= 0 ? '+' : ''}${avgR.toFixed(1)}R average`;
};

const getRandomQuote = (): string => {
  return MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
};

// Export for use in component fallback
export const generateRuleBasedAnalysis = (
  trades: Trade[],
  ruleViolations: Array<{ ruleText: string; violationRate: number; violations: number; timesActive: number }>,
  avgRRS30Days: number
): AIAnalysis => {
  const suggestions: string[] = [];
  const actionableAdvice: string[] = [];

  // RRS-based suggestions
  if (avgRRS30Days < 70) {
    suggestions.push('Your Rule Respect Score is below 70%. Focus on one rule at a time to build discipline gradually.');
    actionableAdvice.push('Before each trade, review your rules checklist and commit to following at least 80% of them.');
  } else if (avgRRS30Days < 85) {
    suggestions.push('You\'re making progress on discipline. Aim to reach 85%+ Rule Respect Score for consistent results.');
    actionableAdvice.push('Identify your most violated rule and create a pre-trade reminder to check it specifically.');
  } else {
    suggestions.push('Excellent discipline! Your high Rule Respect Score shows strong adherence to your trading system.');
    actionableAdvice.push('Maintain this level of discipline and consider adding more nuanced rules to your system.');
  }

  // Rule violation insights
  if (ruleViolations.length > 0) {
    const topViolation = ruleViolations[0];
    if (topViolation.violationRate > 30) {
      suggestions.push(`"${topViolation.ruleText}" is your most violated rule (${topViolation.violationRate.toFixed(1)}%). This is a key area for improvement.`);
      actionableAdvice.push(`Create a visual reminder for "${topViolation.ruleText}" on your trading screen or journal.`);
    }
  }

  // Emotion-based insights
  const emotionBreakdown = getEmotionBreakdown(trades);
  const lowPerformingEmotions = Object.entries(emotionBreakdown)
    .filter(([_, stats]) => stats.winRate < 40 && stats.total >= 3)
    .sort((a, b) => a[1].winRate - b[1].winRate);

  if (lowPerformingEmotions.length > 0) {
    const [emotion, stats] = lowPerformingEmotions[0];
    suggestions.push(`Trades with "${emotion}" emotion show ${stats.winRate.toFixed(0)}% win rate. Consider waiting for a calmer state before entering.`);
    actionableAdvice.push(`When feeling ${emotion.toLowerCase()}, take a 5-minute break and reassess before entering a trade.`);
  }

  return {
    suggestions,
    motivationQuote: getRandomQuote(),
    actionableAdvice,
    patternInsights: `You have ${trades.length} trades recorded. ${avgRRS30Days >= 85 ? 'Your discipline is strong' : avgRRS30Days >= 70 ? 'You\'re building discipline' : 'Focus on improving rule adherence'}. ${ruleViolations.length > 0 ? `Your most challenging rule is "${ruleViolations[0].ruleText}".` : 'Keep tracking your rules to identify patterns.'}`
  };
};
