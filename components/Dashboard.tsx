
import React, { useState, useMemo, memo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Trade, UserSettings } from '../types';
import { calculateMetrics } from '../utils/math';
import { Wallet, Info, TrendingUp, Search, Calendar, ArrowUpRight, ArrowDownRight, Clock, Eye, X, Target } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
  settings: UserSettings;
  onOpenReview: (trade: Trade) => void;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  index: number;
}

const StatCard = memo<StatCardProps>(({ label, value, icon: Icon, trend, index }) => (
  <div className={`bg-[#fcfcfc] dark:bg-[#111] p-6 rounded-3xl border border-gray-50 dark:border-white/[0.03] flex flex-col justify-between group hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg transition-all animate-slide-up stagger-${index}`}>
    <div className="flex items-center justify-between mb-8">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-[#0a0a0a] text-gray-400 dark:text-gray-600 transition-colors group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black`}>
        <Icon className="w-5 h-5" />
      </div>
      <button className="text-gray-200 dark:text-gray-800 hover:text-gray-400 dark:hover:text-gray-600"><Info className="w-4 h-4" /></button>
    </div>
    
    <div>
      <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
        {value}
        {trend && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">↑ {trend}%</span>}
      </div>
    </div>
  </div>
));

interface TradeRowProps {
  trade: Trade;
  systemName?: string;
  index: number;
  onOpenReview: (trade: Trade) => void;
}

const TradeRow = memo<TradeRowProps>(({ trade, systemName, index, onOpenReview }) => (
  <div 
    onClick={() => onOpenReview(trade)}
    className={`bg-[#fcfcfc] dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/[0.03] group hover:border-black/20 dark:hover:border-white/10 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between animate-slide-up stagger-${(index % 3) + 1}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        trade.resultR > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black'
      }`}>
        {trade.resultR > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-black dark:text-white leading-none mb-1">{trade.pair}</h3>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-600 font-medium">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trade.date}</span>
          <span className="uppercase tracking-widest">{trade.sessions.join(', ')}</span>
          {systemName && <span className="text-black dark:text-gray-400 font-bold uppercase tracking-tight">{systemName}</span>}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-8">
      <div className="text-right">
        <div className={`text-xl font-black transition-colors ${trade.resultR >= 0 ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-700'}`}>
          {trade.resultR >= 0 ? '+' : ''}{trade.resultR}R
        </div>
      </div>
      <Eye className="w-4 h-4 text-gray-200 dark:text-gray-800 group-hover:text-black dark:group-hover:text-white transition-all group-hover:scale-110" />
    </div>
  </div>
));

export const Dashboard: React.FC<DashboardProps> = ({ trades, settings, onOpenReview }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const metrics = useMemo(() => calculateMetrics(trades), [trades]);

  const filteredTrades = useMemo(() => {
    return [...trades]
      .filter(t => {
        const matchesSearch = t.pair.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStart = !startDate || t.date >= startDate;
        const matchesEnd = !endDate || t.date <= endDate;
        return matchesSearch && matchesStart && matchesEnd;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [trades, startDate, endDate, searchQuery]);

  return (
    <div className="space-y-10">
      <header className="animate-slide-up">
        <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Overview</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          index={1}
          label="Total Equity" 
          value={`${metrics.equityCurve.length > 0 ? metrics.equityCurve[metrics.equityCurve.length - 1].balance.toFixed(1) : 0}R`} 
          icon={Wallet}
          trend={metrics.winRate.toFixed(0)}
        />
        <StatCard 
          index={2}
          label="Win Rate" 
          value={`${metrics.winRate.toFixed(1)}%`} 
          icon={TrendingUp}
        />
        <StatCard 
          index={3}
          label="Rule Respect (30 Days)" 
          value={`${metrics.avgRRS30Days.toFixed(0)}%`} 
          icon={Target}
          subtitle="Avg. last 30 days"
        />
      </div>

      {/* Performance by Emotion */}
      {Object.keys(metrics.emotionPerformance).length > 0 && (
        <div className="bg-[#fcfcfc] dark:bg-[#111] p-6 rounded-3xl border border-gray-50 dark:border-white/[0.03] animate-fade-in">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Performance by Emotion (Last 30 Days)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.emotionPerformance)
              .sort((a, b) => b[1].winRate - a[1].winRate)
              .slice(0, 8)
              .map(([emotion, stats]) => (
                <div key={emotion} className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">{emotion}</div>
                  <div className="text-xl font-black text-black dark:text-white mb-1">{stats.winRate.toFixed(0)}%</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                    {stats.wins}/{stats.total} wins • {stats.avgR >= 0 ? '+' : ''}{stats.avgR.toFixed(1)}R avg
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="bg-[#fcfcfc] dark:bg-[#111] p-8 rounded-3xl border border-gray-50 dark:border-white/[0.03] animate-fade-in stagger-3">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-black dark:text-white">Performance Activity</h3>
          <div className="flex bg-gray-100 dark:bg-[#0a0a0a] p-1 rounded-lg">
            <button className="px-3 py-1 bg-white dark:bg-[#222] dark:text-white rounded-md text-[10px] font-bold shadow-sm transition-all active:scale-95">Weekly</button>
            <button className="px-3 py-1 text-gray-400 dark:text-gray-600 text-[10px] font-bold hover:text-black dark:hover:text-gray-300 transition-colors">Monthly</button>
          </div>
        </div>
        <div className="h-[280px] w-full">
          {metrics.equityCurve.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.equityCurve}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBalanceDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="currentColor" className="text-gray-50 dark:text-white/[0.02]" />
                <XAxis dataKey="date" hide={true} />
                <YAxis 
                  stroke="currentColor" 
                  className="text-gray-300 dark:text-gray-800"
                  fontSize={10} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val}R`}
                />
                <Tooltip 
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    padding: '12px', 
                    fontSize: '10px',
                    backgroundColor: settings.theme === 'dark' ? '#1a1a1a' : '#fff',
                    color: settings.theme === 'dark' ? '#fff' : '#000'
                  }}
                  itemStyle={{ color: 'inherit' }}
                  animationDuration={150}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="currentColor" 
                  className="text-black dark:text-white"
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#${settings.theme === 'dark' ? 'colorBalanceDark' : 'colorBalance'})`}
                  animationBegin={0}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-700 text-sm font-medium italic animate-fade-in">
              Record some trades to see your progress
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-6 pt-10 border-t border-gray-50 dark:border-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-black dark:text-white">Recent Activity</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
              <input 
                type="text" 
                placeholder="Search Pair..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-black dark:text-white w-32 md:w-40 transition-all"
              />
            </div>
            
            <div className="flex items-center bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-xl px-2 py-1 gap-1">
              <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-600 mx-1" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-0 text-[10px] font-bold text-black dark:text-white outline-none focus:ring-0 p-0 w-24"
              />
              <span className="text-gray-300 dark:text-gray-800">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-0 text-[10px] font-bold text-black dark:text-white outline-none focus:ring-0 p-0 w-24"
              />
              {(startDate || endDate || searchQuery) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg ml-1 text-gray-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 animate-fade-in">
          {filteredTrades.length > 0 ? (
            filteredTrades.map((trade, index) => (
              <TradeRow
                key={trade.id}
                trade={trade}
                systemName={settings.systems.find(s => s.id === trade.systemId)?.name}
                index={index}
                onOpenReview={onOpenReview}
              />
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 dark:text-gray-700 text-xs font-bold uppercase tracking-widest bg-gray-50/50 dark:bg-white/[0.02] rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/[0.03] animate-fade-in">
              No matching activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
