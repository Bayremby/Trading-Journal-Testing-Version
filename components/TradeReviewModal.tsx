
import React, { useState } from 'react';
import { X, Maximize2, Edit3, Trash2, CheckCircle2, AlertCircle, Quote, Layout, MessageSquare, TrendingUp, Calendar, Clock, Star, Globe, AlertTriangle } from 'lucide-react';
import { Trade, UserSettings } from '../types';

interface TradeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  trade: Trade;
  settings: UserSettings;
}

export const TradeReviewModal: React.FC<TradeReviewModalProps> = ({ isOpen, onClose, onEdit, onDelete, trade, settings }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const activeSystem = settings.systems.find(s => s.id === trade.systemId);
  const isWin = trade.resultR > 0;
  const isLoss = trade.resultR < 0;
  
  const accentColor = isWin ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400';
  const accentBg = isWin ? 'bg-emerald-500' : isLoss ? 'bg-rose-500' : 'bg-slate-500 dark:bg-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col h-[90vh] overflow-hidden border border-white/20 dark:border-white/5 animate-scale-in relative">
        
        {/* Floating Actions Bar */}
        <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
          <button 
            onClick={() => onEdit(trade)} 
            className="px-4 py-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-2xl transition-all text-gray-400 dark:text-gray-500 shadow-sm border border-gray-100 dark:border-white/10 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button 
            onClick={() => { if(confirm('Permanently delete this entry?')) { onDelete(trade.id); onClose(); } }} 
            className="p-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all text-gray-300 dark:text-gray-600 hover:text-rose-500 shadow-sm border border-gray-100 dark:border-white/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200/50 dark:bg-white/10 mx-1" />
          <button onClick={onClose} className="p-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-white/20 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-white/10">
            <X className="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>

        {/* Full Page Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth modal-scroll-container">
          
          {/* Integrated Header Section */}
          <div className="relative bg-white dark:bg-[#0a0a0a] pt-20 pb-14 px-12 border-b border-gray-50/50 dark:border-white/5">
            <div className="relative z-10 space-y-12">
              {/* Identity Row */}
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-5">
                    <div className={`w-1.5 h-14 ${accentBg} rounded-full transition-colors duration-500`} />
                    <div>
                      <h2 className="text-7xl font-black text-black dark:text-white tracking-tighter leading-none">{trade.pair}</h2>
                      <div className="flex items-center gap-3 mt-4">
                         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300 dark:text-gray-700">{activeSystem?.name || 'Manual Execution'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refined Metrics Bar - Boxless & Elegant */}
              <div className="flex flex-wrap items-center gap-x-12 gap-y-10">
                
                {/* Metric: Outcome */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-2">Net Outcome</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${accentColor}`}>
                      {trade.resultR > 0 ? '+' : ''}{trade.resultR}
                    </span>
                    <span className={`text-xs font-black ${accentColor} opacity-50`}>R</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-white/5" />

                {/* Metric: Risk */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-2">Allocated Risk</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black dark:text-white">{trade.riskPercent}</span>
                    <span className="text-xs font-black text-gray-300 dark:text-gray-700">%</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-white/5" />

                {/* Metric: RR */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-2">Risk:Reward</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-black text-gray-300 dark:text-gray-700 mr-1.5">1:</span>
                    <span className="text-4xl font-black text-black dark:text-white">{trade.riskReward}</span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-white/5" />

                {/* Metric: Session */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-2">Trading Session</span>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-200 dark:text-gray-800" />
                    <span className="text-xl font-black text-black dark:text-white uppercase tracking-tight">
                      {trade.sessions.length > 0 ? trade.sessions.join(' / ') : 'Outside Killzone'}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-white/5" />

                {/* Metric: Timestamp */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-2">Timestamp</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-gray-200 dark:text-gray-800" />
                      {trade.date}
                    </div>
                    {trade.entryTime && (
                      <div className="flex items-center gap-2 text-[11px] font-black text-black dark:text-white uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-gray-200 dark:text-gray-800" />
                        {trade.entryTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metric: Rating */}
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-3">Psych Quality</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < trade.rating ? 'fill-black dark:fill-white text-black dark:text-white' : 'fill-transparent text-gray-100 dark:text-gray-900'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-gray-50/10 dark:from-white/5 to-transparent pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8 p-12 pt-16 space-y-20">
              {/* Evidence Section */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-700 flex items-center gap-3">
                    <Layout className="w-5 h-5" /> Logical Anchors
                  </h3>
                  <div className="h-px flex-1 bg-gray-50/50 dark:bg-white/5 mx-8" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 italic uppercase">4K Frame Analysis</span>
                </div>
                {trade.screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {trade.screenshots.map((src, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setExpandedImage(src)}
                        className="group relative aspect-video rounded-[3.5rem] overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 cursor-zoom-in hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:hover:shadow-white/[0.02] transition-all duration-700"
                      >
                        <img src={src} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[4px]">
                          <div className="bg-white/10 p-5 rounded-full backdrop-blur-2xl border border-white/20 transform scale-75 group-hover:scale-100 transition-all duration-500">
                            <Maximize2 className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-50/50 dark:bg-white/[0.02] rounded-[3.5rem] flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 border-2 border-dashed border-gray-100 dark:border-white/5 italic text-sm">
                    No visual logs recorded for this event.
                  </div>
                )}
              </section>

              {/* Reflection Pane */}
              <section className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-12">
                    <div className="relative">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-6 flex items-center gap-3">
                        <MessageSquare className="w-5 h-5" /> HTF Narrative & Draw
                      </h3>
                      <div className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400 bg-gray-50/40 dark:bg-white/[0.02] p-10 rounded-[2.5rem] border border-gray-100/50 dark:border-white/10 relative overflow-hidden space-y-4">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-200 dark:bg-gray-800" />
                        <div>
                           <span className="text-[9px] font-black uppercase text-gray-300 dark:text-gray-700 block mb-1">Draw on Liquidity</span>
                           {trade.reflection.liquidityDraw || 'No draw defined.'}
                        </div>
                        <div>
                           <span className="text-[9px] font-black uppercase text-gray-300 dark:text-gray-700 block mb-1">HTF Context</span>
                           {trade.reflection.htfNarrative || 'No context logged.'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700 mb-6 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5" /> Execution Quality
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-500 px-6 italic border-l-2 border-gray-100 dark:border-white/10 ml-2">
                        {trade.reflection.whatWentWell || 'Standard procedural execution.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black dark:bg-white text-white dark:text-black p-14 rounded-[4.5rem] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.5)] dark:shadow-white/5 relative overflow-hidden group self-start">
                    <Quote className="absolute -top-12 -left-12 w-48 h-48 text-white/5 dark:text-black/5 group-hover:rotate-12 transition-transform duration-1000" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 dark:text-black/20 mb-12 relative z-10">The Internal Anchor</h3>
                    <p className="text-3xl font-bold leading-tight relative z-10 tracking-tight">
                      "{trade.reflection.lesson || 'True silence precedes the highest probability move.'}"
                    </p>
                    <div className="mt-14 pt-10 border-t border-white/10 dark:border-black/10 relative z-10 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 dark:text-black/20">Behavioral Standard</span>
                      <div className="w-12 h-1.5 bg-white/20 dark:bg-black/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Mistakes Section (Permanent) */}
                <div className="animate-in fade-in duration-700 bg-rose-50/10 dark:bg-rose-500/[0.02] p-12 rounded-[3.5rem] border border-rose-100/50 dark:border-rose-500/10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-2xl">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-rose-500/60 dark:text-rose-500/40">Behavioral & Tactical Mistakes</h3>
                   </div>
                   <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400 italic">
                      {trade.reflection.mistakes || 'No specific mistakes recorded for this entry.'}
                   </p>
                </div>
              </section>
            </div>

            {/* Sidebar Specifications */}
            <div className="lg:col-span-4 bg-[#fcfcfc] dark:bg-[#0d0d0d] border-l border-gray-50 dark:border-white/5 p-12 pt-16 space-y-20">
              {/* Rules Compliance */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">Hard Protocol</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-200 dark:text-gray-800">Verified</span>
                </div>
                <div className="space-y-6">
                  {activeSystem?.rules.map(rule => {
                    const followed = trade.rulesFollowed[rule.id];
                    return (
                      <div key={rule.id} className="flex items-start justify-between gap-5 group/rule">
                        <span className={`text-[12px] font-bold leading-relaxed transition-all duration-300 ${followed ? 'text-gray-600 dark:text-gray-300' : 'text-gray-200 dark:text-gray-800 line-through'}`}>
                          {rule.text}
                        </span>
                        <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-all duration-500 ${followed ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-transparent'}`}>
                          {followed && <CheckCircle2 className="w-3.5 h-3.5 text-white dark:text-black" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Model Specifications */}
              <section className="space-y-12">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600">System Specs</h3>
                <div className="space-y-12">
                  {Object.entries(trade.customCriteria).map(([id, value]) => {
                    const crit = activeSystem?.customCriteria.find(c => c.id === id);
                    if (!crit) return null;
                    return (
                      <div key={id} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${value ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-gray-900'}`} />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-gray-700">{crit.name}</span>
                        </div>
                        <div className="pl-5">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-2.5">
                              {value.map(v => (
                                <span key={v} className="px-4 py-2 bg-white dark:bg-white/5 shadow-sm rounded-xl text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-gray-100/50 dark:border-white/10">{v}</span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[14px] font-bold text-black dark:text-white flex items-center gap-3">
                              {typeof value === 'boolean' ? (
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all ${value ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'text-rose-300 dark:text-rose-900 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40'}`}>
                                  {value ? 'Confirmed' : 'Not Present'}
                                </span>
                              ) : (
                                <span className="bg-white dark:bg-white/5 px-5 py-3 rounded-2xl border border-gray-50 dark:border-white/10 shadow-sm text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                                  {value}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/98 flex items-center justify-center cursor-zoom-out p-16 animate-in fade-in duration-500 backdrop-blur-3xl"
          onClick={() => setExpandedImage(null)}
        >
          <button className="absolute top-12 right-12 p-5 bg-white/5 text-white rounded-full hover:bg-white/10 transition-all border border-white/10 group">
            <X className="w-10 h-10 transform group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <img 
            src={expandedImage} 
            alt="Deep Detail View" 
            className="max-w-full max-h-full object-contain rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] border border-white/10"
          />
        </div>
      )}
    </div>
  );
};
