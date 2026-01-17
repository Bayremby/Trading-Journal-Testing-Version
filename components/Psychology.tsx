import React, { useState, useMemo, useEffect } from 'react';
import { Trade, UserSettings } from '../types';
import { Brain, AlertTriangle, Target, Sparkles } from 'lucide-react';
import { AIMindCoach } from './AIMindCoach';

interface PsychologyProps {
  trades: Trade[];
  settings: UserSettings;
}

interface RuleViolationStats {
  ruleId: string;
  ruleText: string;
  violations: number;
  timesActive: number;
  violationRate: number;
}

export const Psychology: React.FC<PsychologyProps> = ({ trades, settings }) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'violations' | 'ai-coach'>('violations');

  // Initialize selected system
  useEffect(() => {
    if (settings.systems.length > 0 && !selectedSystemId) {
      setSelectedSystemId(settings.systems[0].id);
    }
  }, [settings.systems, selectedSystemId]);

  const selectedSystem = settings.systems.find(s => s.id === selectedSystemId);

  // Calculate rule violations for selected system
  const ruleViolations = useMemo(() => {
    if (!selectedSystem || trades.length === 0) return [];

    const systemTrades = trades.filter(t => t.systemId === selectedSystemId);
    const activeRules = selectedSystem.rules.filter(r => r.active);

    const stats: Record<string, RuleViolationStats> = {};

    activeRules.forEach(rule => {
      let violations = 0;
      let timesActive = 0;

      systemTrades.forEach(trade => {
        // Check if this rule was applicable for this trade
        if (rule.id in (trade.rulesFollowed || {})) {
          timesActive++;
          if (trade.rulesFollowed[rule.id] === false) {
            violations++;
          }
        }
      });

      const violationRate = timesActive > 0 ? (violations / timesActive) * 100 : 0;

      stats[rule.id] = {
        ruleId: rule.id,
        ruleText: rule.text,
        violations,
        timesActive,
        violationRate
      };
    });

    // Sort by violation rate descending
    return Object.values(stats).sort((a, b) => b.violationRate - a.violationRate);
  }, [selectedSystem, selectedSystemId, trades]);

  // Get most violated rule for insight banner
  const mostViolatedRule = ruleViolations.length > 0 ? ruleViolations[0] : null;

  // Filter last 30 days for insight
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTrades = trades.filter(t => new Date(t.date) >= thirtyDaysAgo);
  const recentRuleViolations = useMemo(() => {
    if (!selectedSystem || recentTrades.length === 0) return [];

    const systemRecentTrades = recentTrades.filter(t => t.systemId === selectedSystemId);
    const activeRules = selectedSystem.rules.filter(r => r.active);

    const stats: Record<string, RuleViolationStats> = {};

    activeRules.forEach(rule => {
      let violations = 0;
      let timesActive = 0;

      systemRecentTrades.forEach(trade => {
        if (rule.id in (trade.rulesFollowed || {})) {
          timesActive++;
          if (trade.rulesFollowed[rule.id] === false) {
            violations++;
          }
        }
      });

      const violationRate = timesActive > 0 ? (violations / timesActive) * 100 : 0;

      if (timesActive > 0) {
        stats[rule.id] = {
          ruleId: rule.id,
          ruleText: rule.text,
          violations,
          timesActive,
          violationRate
        };
      }
    });

    return Object.values(stats).sort((a, b) => b.violationRate - a.violationRate);
  }, [selectedSystem, selectedSystemId, recentTrades]);

  const mostViolatedRule30Days = recentRuleViolations.length > 0 ? recentRuleViolations[0] : null;

  if (settings.systems.length === 0) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">No Trading Systems</h3>
        <p className="text-sm text-gray-300 dark:text-gray-700 max-w-xs mx-auto">
          Create a trading system first to view rule violation analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('violations')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'violations'
              ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          Rule Violations
        </button>
        <button
          onClick={() => setActiveTab('ai-coach')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'ai-coach'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Mind Coach
        </button>
      </div>

      {/* AI Mind Coach Tab */}
      {activeTab === 'ai-coach' && (
        <AIMindCoach trades={trades} systems={settings.systems} />
      )}

      {/* Rule Violations Tab */}
      {activeTab === 'violations' && (
        <>
          <header className="animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Rule Violations</h1>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mt-1">
                  Behavioral Diagnostics
                </p>
              </div>
            </div>
          </header>

          {/* System Selector */}
          <div className="bg-[#fcfcfc] dark:bg-[#111] p-6 rounded-3xl border border-gray-50 dark:border-white/[0.03] animate-fade-in">
            <label className="block text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest mb-3">
              Select Trading System
            </label>
            <select
              value={selectedSystemId}
              onChange={(e) => setSelectedSystemId(e.target.value)}
              className="w-full md:w-64 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30"
            >
              {settings.systems.map(system => (
                <option key={system.id} value={system.id}>{system.name}</option>
              ))}
            </select>
          </div>

          {/* Insight Banner */}
          {mostViolatedRule30Days && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-200 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-black dark:text-white mb-2 uppercase tracking-wider">
                    Insight (Last 30 Days)
                  </h4>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                    Your most violated rule in the last 30 days is{' '}
                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                      "{mostViolatedRule30Days.ruleText}"
                    </span>
                    {' '}with a {mostViolatedRule30Days.violationRate.toFixed(1)}% violation rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ranked Violations Table */}
          {ruleViolations.length > 0 ? (
            <div className="bg-[#fcfcfc] dark:bg-[#111] rounded-3xl border border-gray-50 dark:border-white/[0.03] overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-gray-50 dark:border-white/[0.03] bg-white dark:bg-[#0a0a0a]">
                <h3 className="text-lg font-bold text-black dark:text-white">Most Violated Rules</h3>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Sorted by violation rate</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50 dark:bg-[#0a0a0a] text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest text-[10px]">
                    <tr>
                      <th className="px-6 py-4 text-left">Rank</th>
                      <th className="px-6 py-4 text-left">Rule</th>
                      <th className="px-6 py-4 text-right">Violations</th>
                      <th className="px-6 py-4 text-right">Times Active</th>
                      <th className="px-6 py-4 text-right">Violation %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                    {ruleViolations.map((violation, index) => (
                      <tr
                        key={violation.ruleId}
                        className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-400 dark:text-gray-600">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 font-bold text-black dark:text-white">
                          {violation.ruleText}
                        </td>
                        <td className="px-6 py-4 text-right font-black text-rose-600 dark:text-rose-400">
                          {violation.violations}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-500 dark:text-gray-500">
                          {violation.timesActive}
                        </td>
                        <td className={`px-6 py-4 text-right font-black ${
                          violation.violationRate >= 30 ? 'text-rose-600 dark:text-rose-400' :
                          violation.violationRate >= 15 ? 'text-amber-600 dark:text-amber-400' :
                          'text-slate-600 dark:text-slate-400'
                        }`}>
                          {violation.violationRate.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[#fcfcfc] dark:bg-[#111] p-12 rounded-3xl border border-gray-50 dark:border-white/[0.03] text-center animate-fade-in">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-400 dark:text-gray-600 mb-2">No Violation Data</h3>
              <p className="text-sm text-gray-300 dark:text-gray-700 max-w-md mx-auto">
                Start journaling trades with this system to see rule violation analytics.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
