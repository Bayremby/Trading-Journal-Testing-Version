import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trade, TradingSystemModel } from '../types';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Shield, Target, Zap, MessageCircle, Info } from 'lucide-react';
import { analyzePsychology, PsychologyInsight } from '../services/aiMentor';

interface AIMindCoachProps {
  trades: Trade[];
  systems: TradingSystemModel[];
}

export const AIMindCoach: React.FC<AIMindCoachProps> = ({ trades, systems }) => {
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement>>({});
  const insights: PsychologyInsight = useMemo(() => {
    return analyzePsychology(trades, systems);
  }, [trades, systems]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-rose-500 to-red-500';
  };

  const handleExplanationClick = (key: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    if (showExplanation === key) {
      setShowExplanation(null);
      setTooltipPosition(null);
    } else {
      setShowExplanation(key);
      setTooltipPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      });
    }
  };

  const scoreCategories = [
    { label: 'Rule Adherence', value: insights.score.ruleAdherence, icon: Shield, weight: '40%', key: 'ruleAdherence' },
    { label: 'Emotional Stability', value: insights.score.emotionalStability, icon: Brain, weight: '30%', key: 'emotionalStability' },
    { label: 'Trading Discipline', value: insights.score.tradingDiscipline, icon: Target, weight: '20%', key: 'tradingDiscipline' },
    { label: 'Consistency', value: insights.score.consistency, icon: Zap, weight: '10%', key: 'consistency' },
  ];

  if (trades.length < 5) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">Not Enough Data</h3>
        <p className="text-sm text-gray-300 dark:text-gray-700 max-w-xs mx-auto">
          Log at least 5 trades to unlock AI-powered psychology coaching insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">AI Mind Coach</h1>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mt-0.5">
              Psychology Intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Main Score Card */}
      <div className={`relative overflow-hidden rounded-3xl border ${getScoreBgColor(insights.score.overall)} p-8`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(insights.score.overall)} p-1`}>
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-black ${getScoreColor(insights.score.overall)}`}>
                    {insights.score.overall}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                    Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {scoreCategories.map((cat) => (
              <div key={cat.label} className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <cat.icon className={`w-4 h-4 ${getScoreColor(cat.value)}`} />
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">{cat.label}</span>
                  </div>
                  <button
                    onClick={(e) => handleExplanationClick(cat.key, e)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Show formula explanation"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${getScoreColor(cat.value)}`}>{cat.value}</span>
                  <span className="text-[9px] font-medium text-gray-400 dark:text-gray-600">({cat.weight})</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getScoreGradient(cat.value)} transition-all duration-500`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
                
                {/* Explanation Tooltip */}
                {showExplanation === cat.key && tooltipPosition && (
                  <div className="fixed z-[99999] p-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg max-w-sm" 
                       style={{
                         top: `${tooltipPosition.top}px`,
                         left: `${tooltipPosition.left}px`,
                         transform: 'translateX(-50%)'
                       }}>
                    <div className="text-xs space-y-1">
                      <div className="font-black text-gray-700 dark:text-gray-300">Formula:</div>
                      <div className="text-gray-600 dark:text-gray-400">{insights.scoreExplanations[cat.key as keyof typeof insights.scoreExplanations].formula}</div>
                      <div className="font-black text-gray-700 dark:text-gray-300 mt-2">Calculation:</div>
                      <div className="text-gray-600 dark:text-gray-400">{insights.scoreExplanations[cat.key as keyof typeof insights.scoreExplanations].calculation}</div>
                      <div className="font-black text-gray-700 dark:text-gray-300 mt-2">What this means:</div>
                      <div className="text-gray-600 dark:text-gray-400">{insights.scoreExplanations[cat.key as keyof typeof insights.scoreExplanations].description}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coaching Message */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider mb-2">
              AI Coaching Insight
            </h3>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
              {insights.coachingMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100 dark:border-emerald-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Strengths
            </h3>
          </div>
          {insights.strengths.length > 0 ? (
            <ul className="space-y-3">
              {insights.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {strength}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-600/60 dark:text-emerald-400/60 italic">
              Keep trading consistently to identify your strengths.
            </p>
          )}
        </div>

        {/* Risks */}
        <div className="bg-rose-50/50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Areas to Improve
            </h3>
          </div>
          {insights.risks.length > 0 ? (
            <ul className="space-y-3">
              {insights.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-300 leading-relaxed">
                    {risk}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-rose-600/60 dark:text-rose-400/60 italic">
              No significant risks detected. Keep up the good work!
            </p>
          )}
        </div>
      </div>

      {/* Warnings */}
      {insights.warnings.length > 0 && (
        <div className="bg-amber-50/50 dark:bg-amber-500/5 rounded-3xl border border-amber-100 dark:border-amber-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Warnings & Guardrails
            </h3>
          </div>
          <ul className="space-y-3">
            {insights.warnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
                  {warning}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          AI insights are based on your trading data • Human review recommended
        </p>
      </div>
    </div>
  );
};
