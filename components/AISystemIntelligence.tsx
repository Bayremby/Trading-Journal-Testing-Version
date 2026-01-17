import React, { useMemo, useState } from 'react';
import { Trade, TradingSystemModel } from '../types';
import { Cpu, TrendingUp, TrendingDown, Target, Zap, BarChart3, Clock, Lightbulb, CheckCircle2, Info } from 'lucide-react';
import { analyzeSystemIntelligence, SystemIntelligence } from '../services/aiMentor';

interface AISystemIntelligenceProps {
  trades: Trade[];
  system: TradingSystemModel;
}

export const AISystemIntelligence: React.FC<AISystemIntelligenceProps> = ({ trades, system }) => {
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const intelligence: SystemIntelligence = useMemo(() => {
    return analyzeSystemIntelligence(trades, system);
  }, [trades, system]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    if (score >= 30) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500';
    if (score >= 50) return 'from-amber-500 to-yellow-500';
    if (score >= 30) return 'from-orange-500 to-amber-500';
    return 'from-rose-500 to-red-500';
  };

  const systemTrades = trades.filter(t => t.systemId === system.id);

  if (systemTrades.length < 10) {
    return (
      <div className="py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Cpu className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">Not Enough Data</h3>
        <p className="text-sm text-gray-300 dark:text-gray-700 max-w-xs mx-auto">
          Log at least 10 trades with this system to unlock AI-powered strategy analysis.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
          Current: {systemTrades.length} trades
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white">System Intelligence</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            AI Strategy Analysis for {system.name}
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Win Rate */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Win Rate</span>
          </div>
          <div className={`text-3xl font-black ${getScoreColor(intelligence.overallWinRate)}`}>
            {intelligence.overallWinRate.toFixed(1)}%
          </div>
        </div>

        {/* Edge Clarity Score */}
        <div className={`rounded-2xl border p-5 ${getScoreBgColor(intelligence.edgeClarityScore)} relative`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Edge Clarity</span>
            </div>
            <button
              onClick={() => setShowExplanation(showExplanation === 'edgeClarity' ? null : 'edgeClarity')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Show formula explanation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className={`text-3xl font-black ${getScoreColor(intelligence.edgeClarityScore)}`}>
            {intelligence.edgeClarityScore}
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreGradient(intelligence.edgeClarityScore)} transition-all duration-500`}
              style={{ width: `${intelligence.edgeClarityScore}%` }}
            />
          </div>
          
          {/* Explanation Tooltip */}
          {showExplanation === 'edgeClarity' && (
            <div className="absolute z-[9999] top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
              <div className="text-xs space-y-1">
                <div className="font-black text-gray-700 dark:text-gray-300">Formula:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.edgeClarity.formula}</div>
                <div className="font-black text-gray-700 dark:text-gray-300 mt-2">Calculation:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.edgeClarity.calculation}</div>
                <div className="font-black text-gray-700 dark:text-gray-300 mt-2">What this means:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.edgeClarity.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Consistency */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-5 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">Consistency</span>
            </div>
            <button
              onClick={() => setShowExplanation(showExplanation === 'consistency' ? null : 'consistency')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Show formula explanation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className={`text-3xl font-black ${getScoreColor(intelligence.consistencyRating)}`}>
            {intelligence.consistencyRating}
          </div>
          
          {/* Explanation Tooltip */}
          {showExplanation === 'consistency' && (
            <div className="absolute z-[9999] top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
              <div className="text-xs space-y-1">
                <div className="font-black text-gray-700 dark:text-gray-300">Formula:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.consistency.formula}</div>
                <div className="font-black text-gray-700 dark:text-gray-300 mt-2">Calculation:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.consistency.calculation}</div>
                <div className="font-black text-gray-700 dark:text-gray-300 mt-2">What this means:</div>
                <div className="text-gray-600 dark:text-gray-400">{intelligence.scoreExplanations.consistency.description}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Best vs Worst Setup */}
      {(intelligence.bestSetup || intelligence.worstSetup) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Setup */}
          {intelligence.bestSetup && (
            <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Best Setup</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">Session</span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{intelligence.bestSetup.session}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">Win Rate</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{intelligence.bestSetup.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">Trades</span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{intelligence.bestSetup.totalTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">Avg R</span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {intelligence.bestSetup.avgR >= 0 ? '+' : ''}{intelligence.bestSetup.avgR.toFixed(2)}R
                  </span>
                </div>
                
                {/* Confluence Details */}
                {intelligence.bestSetup.confluenceDetails && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-500/20">
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 mb-2">Confluence Analysis</div>
                    <div className="space-y-1">
                      {intelligence.bestSetup.confluenceDetails.rulesFollowed.length > 0 && (
                        <div>
                          <span className="text-[10px] font-medium text-emerald-600/70">Rules Often Followed:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {intelligence.bestSetup.confluenceDetails.rulesFollowed.map((rule, idx) => (
                              <span key={idx} className="text-[9px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                {rule}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {intelligence.bestSetup.confluenceDetails.keyFactors.length > 0 && (
                        <div>
                          <span className="text-[10px] font-medium text-emerald-600/70">Key Factors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {intelligence.bestSetup.confluenceDetails.keyFactors.map((factor, idx) => (
                              <span key={idx} className="text-[9px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Worst Setup */}
          {intelligence.worstSetup && (
            <div className="bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">Worst Setup</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-rose-600/70 dark:text-rose-400/70">Session</span>
                  <span className="text-sm font-bold text-rose-800 dark:text-rose-300">{intelligence.worstSetup.session}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-rose-600/70 dark:text-rose-400/70">Win Rate</span>
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400">{intelligence.worstSetup.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-rose-600/70 dark:text-rose-400/70">Trades</span>
                  <span className="text-sm font-bold text-rose-800 dark:text-rose-300">{intelligence.worstSetup.totalTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-rose-600/70 dark:text-rose-400/70">Avg R</span>
                  <span className="text-sm font-bold text-rose-800 dark:text-rose-300">
                    {intelligence.worstSetup.avgR >= 0 ? '+' : ''}{intelligence.worstSetup.avgR.toFixed(2)}R
                  </span>
                </div>
                
                {/* Confluence Details */}
                {intelligence.worstSetup.confluenceDetails && (
                  <div className="mt-4 pt-3 border-t border-rose-200/50 dark:border-rose-500/20">
                    <div className="text-xs font-black text-rose-700 dark:text-rose-400 mb-2">Confluence Analysis</div>
                    <div className="space-y-1">
                      {intelligence.worstSetup.confluenceDetails.rulesViolated.length > 0 && (
                        <div>
                          <span className="text-[10px] font-medium text-rose-600/70">Rules Often Violated:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {intelligence.worstSetup.confluenceDetails.rulesViolated.map((rule, idx) => (
                              <span key={idx} className="text-[9px] bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full">
                                {rule}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {intelligence.worstSetup.confluenceDetails.keyFactors.length > 0 && (
                        <div>
                          <span className="text-[10px] font-medium text-rose-600/70">Key Factors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {intelligence.worstSetup.confluenceDetails.keyFactors.map((factor, idx) => (
                              <span key={idx} className="text-[9px] bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Analysis */}
      {Object.keys(intelligence.sessionAnalysis).length > 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Session Breakdown</span>
          </div>
          <div className="space-y-3">
            {Object.entries(intelligence.sessionAnalysis)
              .sort((a, b) => b[1].winRate - a[1].winRate)
              .map(([session, data]) => (
                <div key={session} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-bold text-gray-600 dark:text-gray-400">{session}</div>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getScoreGradient(data.winRate)} transition-all duration-500`}
                      style={{ width: `${data.winRate}%` }}
                    />
                  </div>
                  <div className={`w-16 text-right text-sm font-black ${getScoreColor(data.winRate)}`}>
                    {data.winRate.toFixed(0)}%
                  </div>
                  <div className="w-20 text-right text-xs text-gray-400 dark:text-gray-600">
                    {data.trades} trades
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Diagnosis */}
      {intelligence.diagnosis.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-2xl border border-cyan-100 dark:border-cyan-500/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-black text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">AI Diagnosis</span>
          </div>
          <ul className="space-y-3">
            {intelligence.diagnosis.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                <p className="text-sm font-medium text-cyan-800 dark:text-cyan-300 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {intelligence.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Recommendations</span>
          </div>
          <ul className="space-y-3">
            {intelligence.recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-lg bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">{idx + 1}</span>
                </div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          Based on {systemTrades.length} trades • Human review recommended
        </p>
      </div>
    </div>
  );
};
