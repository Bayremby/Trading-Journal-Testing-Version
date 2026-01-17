
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Plus, Trash2, HelpCircle, ListTodo, Layers, Book, ArrowRight, ArrowLeft, Trash, Check, AlertTriangle, Minus } from 'lucide-react';
import { Trade, Session, UserSettings, TradeOutcome, TradeGrade } from '../types';
import { SESSIONS } from '../constants';

interface TradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Trade) => void;
  onDelete?: () => void;
  settings: UserSettings;
  initialDate?: string;
  editTrade?: Trade;
}

interface InputLabelProps {
  children: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ children }) => (
  <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 dark:text-gray-700 mb-2">{children}</label>
);

export const TradeEntryModal: React.FC<TradeEntryModalProps> = ({ isOpen, onClose, onSave, onDelete, settings, initialDate, editTrade }) => {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSystemId, setSelectedSystemId] = useState(editTrade?.systemId || settings.systems[0]?.id || '');
  
  const activeSystem = settings.systems.find(s => s.id === selectedSystemId) || settings.systems[0];

  const [formData, setFormData] = useState<Partial<Trade>>(editTrade || {
    systemId: selectedSystemId,
    pair: settings.pairs[0],
    date: initialDate || new Date().toISOString().split('T')[0],
    sessions: [],
    riskPercent: settings.defaultRisk,
    riskReward: 2,
    resultR: 0,
    outcome: 'Win',
    grade: 'C',
    screenshots: [],
    rulesFollowed: {},
    customCriteria: {},
    emotions: [],
    ruleRespectScore: 100,
    rulesFollowedCount: 0,
    totalActiveRules: 0,
    reflection: {
      liquidityDraw: '',
      htfNarrative: '',
      mistakes: '',
      whatWentWell: '',
      lesson: ''
    }
  });

  useEffect(() => {
    if (editTrade) return;
    const sys = settings.systems.find(s => s.id === selectedSystemId);
    if (!sys) return;

    const initialRules: Record<string, boolean> = {};
    sys.rules.forEach(r => { if(r.active) initialRules[r.id] = true; });

    const initialCriteria: Record<string, string | string[] | boolean> = {};
    sys.customCriteria.forEach(c => {
      if (c.type === 'Multi-select' || c.type === 'Checklist') initialCriteria[c.id] = [];
      else initialCriteria[c.id] = '';
    });

    setFormData(prev => ({
      ...prev,
      systemId: selectedSystemId,
      rulesFollowed: initialRules,
      customCriteria: initialCriteria
    }));
  }, [selectedSystemId, settings.systems, editTrade]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.pair || !formData.date || !formData.systemId) {
      alert("Required fields missing.");
      return;
    }

    // Calculate Rule Respect Score (RRS)
    const system = settings.systems.find(s => s.id === formData.systemId);
    const activeRules = system?.rules.filter(r => r.active) || [];
    const totalActiveRules = activeRules.length;
    
    let rulesFollowedCount = 0;
    if (formData.rulesFollowed && totalActiveRules > 0) {
      rulesFollowedCount = activeRules.filter(rule => 
        formData.rulesFollowed?.[rule.id] === true
      ).length;
    }

    // RRS = (Rules Followed ÷ Total Active Rules) × 100
    // If no active rules, default to 100%
    const ruleRespectScore = totalActiveRules > 0 
      ? Math.round((rulesFollowedCount / totalActiveRules) * 100)
      : 100;

    onSave({
      id: editTrade?.id || crypto.randomUUID(),
      entryTime: editTrade?.entryTime || '',
      exitTime: editTrade?.exitTime || '',
      rating: editTrade?.rating || 3,
      pois: editTrade?.pois || [],
      outcome: formData.outcome as TradeOutcome,
      emotions: formData.emotions || [],
      ruleRespectScore,
      rulesFollowedCount,
      totalActiveRules,
      ...formData as Trade,
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          screenshots: [...(prev.screenshots || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const setOutcome = (outcome: TradeOutcome) => {
    let resultR = 0;
    if (outcome === 'Loss') resultR = -(formData.riskPercent || 0);
    if (outcome === 'BE') resultR = 0;
    if (outcome === 'Win') resultR = formData.riskReward || 2;
    
    setFormData({ ...formData, outcome, resultR });
  };

  // Automated sync for Realized R when inputs change
  useEffect(() => {
    if (editTrade) return; // Don't auto-update if we are editing an existing log specifically
    
    if (formData.outcome === 'Win') {
      setFormData(prev => ({ ...prev, resultR: prev.riskReward || 0 }));
    } else if (formData.outcome === 'Loss') {
      setFormData(prev => ({ ...prev, resultR: -(prev.riskPercent || 0) }));
    } else if (formData.outcome === 'BE') {
      setFormData(prev => ({ ...prev, resultR: 0 }));
    }
  }, [formData.riskReward, formData.riskPercent, formData.outcome]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-black/5 dark:border-white/5 animate-scale-in">
        <div className="px-8 py-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/[0.01]">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{editTrade ? 'Modify Entry' : 'Journal Entry'}</h2>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">Process & Discipline</p>
          </div>
          <div className="flex gap-2">
            {editTrade && onDelete && (
              <button onClick={() => { if(confirm('Delete permanently?')) {onDelete(); onClose(); } }} className="p-2.5 text-red-300 dark:text-red-900 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <Trash className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2.5 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm">
              <X className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scroll-smooth modal-scroll-container">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= i ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-gray-900'}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
              <div>
                <InputLabel>Instrument</InputLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {settings.pairs.map(p => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, pair: p })}
                      className={`px-4 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-tight transition-all border-2 text-center group active:scale-95 ${
                        formData.pair === p 
                          ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg scale-[1.05]' 
                          : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-700 hover:border-gray-300 dark:hover:border-white/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <InputLabel>Sessions</InputLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {settings.sessions.map(session => {
                    const isSelected = formData.sessions?.includes(session) || false;
                    return (
                      <button
                        key={session}
                        type="button"
                        onClick={() => {
                          const currentSessions = formData.sessions || [];
                          const newSessions = isSelected
                            ? currentSessions.filter(s => s !== session)
                            : [...currentSessions, session];
                          setFormData({ ...formData, sessions: newSessions });
                        }}
                        className={`px-4 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-tight transition-all border-2 text-center group active:scale-95 ${
                          isSelected
                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg scale-[1.05]' 
                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-700 hover:border-gray-300 dark:hover:border-white/30'
                        }`}
                      >
                        {session}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <InputLabel>Trade Outcome</InputLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setOutcome('Win')}
                    className={`py-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-2 active:scale-95 ${
                      formData.outcome === 'Win' 
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20 scale-[1.02]' 
                        : 'bg-emerald-50/20 dark:bg-emerald-500/5 border-transparent text-emerald-600/30 dark:text-emerald-500/20 hover:border-emerald-500/20 hover:text-emerald-500'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${formData.outcome === 'Win' ? 'bg-white/20' : 'bg-emerald-100/50 dark:bg-emerald-900/20'}`}>
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em]">Winner</span>
                  </button>
                  <button
                    onClick={() => setOutcome('BE')}
                    className={`py-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-2 active:scale-95 ${
                      formData.outcome === 'BE' 
                        ? 'bg-slate-500 border-slate-400 text-white shadow-xl shadow-slate-500/20 scale-[1.02]' 
                        : 'bg-slate-50/20 dark:bg-slate-500/5 border-transparent text-slate-600/30 dark:text-slate-500/20 hover:border-slate-500/20 hover:text-slate-500'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${formData.outcome === 'BE' ? 'bg-white/20' : 'bg-slate-100/50 dark:bg-slate-900/20'}`}>
                      <Minus className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em]">Break Even</span>
                  </button>
                  <button
                    onClick={() => setOutcome('Loss')}
                    className={`py-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-2 active:scale-95 ${
                      formData.outcome === 'Loss' 
                        ? 'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/20 scale-[1.02]' 
                        : 'bg-rose-50/20 dark:bg-rose-500/5 border-transparent text-rose-600/30 dark:text-rose-500/20 hover:border-rose-500/20 hover:text-rose-500'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${formData.outcome === 'Loss' ? 'bg-white/20' : 'bg-rose-100/50 dark:bg-rose-900/20'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em]">Loss</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputLabel>Date</InputLabel>
                    <input 
                      type="date"
                      className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-xs font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-black dark:text-white"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <InputLabel>System</InputLabel>
                    <select 
                      className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-xs font-bold focus:ring-1 focus:ring-black dark:focus:ring-white outline-none text-black dark:text-white appearance-none"
                      value={selectedSystemId}
                      onChange={e => setSelectedSystemId(e.target.value)}
                    >
                      {settings.systems.map(sys => (
                        <option key={sys.id} value={sys.id}>{sys.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <InputLabel>Risk %</InputLabel>
                    <input 
                      type="number" step="0.1"
                      className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-xs font-bold outline-none text-black dark:text-white"
                      value={formData.riskPercent}
                      onChange={e => setFormData({ ...formData, riskPercent: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <InputLabel>RR</InputLabel>
                    <input 
                      type="number" step="0.1"
                      className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-xs font-bold outline-none text-black dark:text-white"
                      value={formData.riskReward}
                      onChange={e => setFormData({ ...formData, riskReward: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <InputLabel>Realized R</InputLabel>
                    <input 
                      type="number" step="0.1"
                      className={`w-full border-0 rounded-2xl p-4 text-xs font-black outline-none transition-all duration-300 shadow-lg ${
                        formData.outcome === 'Win' ? 'bg-emerald-500 text-white' : 
                        formData.outcome === 'Loss' ? 'bg-rose-500 text-white' : 
                        'bg-slate-500 text-white'
                      }`}
                      value={formData.resultR}
                      onChange={e => setFormData({ ...formData, resultR: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <InputLabel>Trade Grade</InputLabel>
                    <select
                      className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 text-xs font-bold outline-none text-black dark:text-white focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      value={formData.grade}
                      onChange={e => setFormData({ ...formData, grade: e.target.value as TradeGrade })}
                    >
                      <option value="A+" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">🌟 A+ - Exceptional Performance</option>
                      <option value="A" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">🎯 A - Excellent Execution</option>
                      <option value="B" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300">📈 B - Good Performance</option>
                      <option value="C" className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">⚠️ C - Needs Improvement</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
              <div>
                <InputLabel>Screenshots (Entry/HTF/Result)</InputLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.screenshots?.map((src, idx) => (
                    <div key={idx} className="relative aspect-video rounded-[2rem] overflow-hidden group border-2 border-gray-50 dark:border-white/5 shadow-md">
                      <img src={src} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, screenshots: prev.screenshots?.filter((_, i) => i !== idx) }))}
                          className="p-3 bg-red-500 text-white rounded-2xl shadow-xl transform scale-75 group-hover:scale-100 transition-transform"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white transition-all bg-gray-50/30 dark:bg-white/[0.02] group"
                  >
                    <div className="p-4 rounded-full bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform mb-2">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Frame</span>
                  </button>
                  <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              </div>

              <div>
                <InputLabel>Model Checks</InputLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSystem.rules.filter(r => r.active).map(rule => (
                    <label key={rule.id} className="flex items-center p-5 rounded-2xl border border-gray-50 dark:border-white/5 bg-[#fcfcfc] dark:bg-white/[0.02] hover:border-black/10 dark:hover:border-white/10 transition-all cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          className="w-5 h-5 rounded-lg text-black dark:text-white border-gray-200 dark:border-white/20 focus:ring-black dark:focus:ring-white transition-all"
                          checked={formData.rulesFollowed?.[rule.id] ?? false}
                          onChange={e => setFormData({ ...formData, rulesFollowed: { ...formData.rulesFollowed, [rule.id]: e.target.checked } })}
                        />
                      </div>
                      <span className={`ml-4 text-[12px] font-bold transition-colors ${formData.rulesFollowed?.[rule.id] ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{rule.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {activeSystem.customCriteria.filter(c => c.type === 'Multi-select').length > 0 && (
                <div className="grid grid-cols-1 gap-6">
                  {activeSystem.customCriteria.filter(c => c.type === 'Multi-select').map(criterion => (
                    <div key={criterion.id} className="p-6 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10">
                      <InputLabel>{criterion.name}</InputLabel>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {criterion.options?.map(opt => {
                          const isSelected = (formData.customCriteria?.[criterion.id] as string[] || []).includes(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                const current = (formData.customCriteria?.[criterion.id] as string[]) || [];
                                const updated = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
                                setFormData({ ...formData, customCriteria: { ...formData.customCriteria, [criterion.id]: updated } });
                              }}
                              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border-2 transition-all active:scale-95 ${
                                isSelected ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg' : 'bg-white dark:bg-white/5 border-white dark:border-white/10 text-gray-300 dark:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
              {/* Emotion Tags */}
              <div>
                <InputLabel>How did you feel before entry? (Select all that apply)</InputLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Calm', 'Neutral', 'Impatient', 'Confident', 'Fearful', 'FOMO', 'Overconfident', 'Hesitant'].map(emotion => {
                    const isSelected = formData.emotions?.includes(emotion) || false;
                    return (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => {
                          const currentEmotions = formData.emotions || [];
                          const newEmotions = isSelected
                            ? currentEmotions.filter(e => e !== emotion)
                            : [...currentEmotions, emotion];
                          setFormData({ ...formData, emotions: newEmotions });
                        }}
                        className={`px-4 py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-tight transition-all border-2 text-center group active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg scale-[1.05]' 
                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/30'
                        }`}
                      >
                        {emotion}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <InputLabel>Draw on Liquidity?</InputLabel>
                    <textarea 
                      placeholder="Where was price attracted to?"
                      className="w-full h-32 bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-6 text-xs font-medium outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white resize-none shadow-inner"
                      value={formData.reflection?.liquidityDraw}
                      onChange={e => setFormData({ ...formData, reflection: { ...formData.reflection!, liquidityDraw: e.target.value } })}
                    />
                  </div>
                  <div>
                    <InputLabel>HTF Narrative</InputLabel>
                    <textarea 
                      placeholder="The story behind the setup..."
                      className="w-full h-32 bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-6 text-xs font-medium outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white resize-none shadow-inner"
                      value={formData.reflection?.htfNarrative}
                      onChange={e => setFormData({ ...formData, reflection: { ...formData.reflection!, htfNarrative: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <InputLabel>What went well</InputLabel>
                    <textarea 
                      placeholder="Strengths in execution..."
                      className="w-full h-32 bg-gray-50 dark:bg-white/5 border-0 rounded-3xl p-6 text-xs font-medium outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white resize-none shadow-inner"
                      value={formData.reflection?.whatWentWell}
                      onChange={e => setFormData({ ...formData, reflection: { ...formData.reflection!, whatWentWell: e.target.value } })}
                    />
                  </div>
                  <div>
                    <InputLabel>Lesson learned</InputLabel>
                    <textarea 
                      placeholder="The single biggest takeaway..."
                      className="w-full h-32 bg-black dark:bg-white text-white dark:text-black border-0 rounded-3xl p-6 text-xs font-black outline-none shadow-2xl resize-none placeholder:text-gray-500"
                      value={formData.reflection?.lesson}
                      onChange={e => setFormData({ ...formData, reflection: { ...formData.reflection!, lesson: e.target.value } })}
                    />
                  </div>
                </div>
              </div>

              <div className="animate-in slide-in-from-top-4 duration-700 bg-rose-50/50 dark:bg-rose-500/5 p-8 rounded-[3rem] border-2 border-rose-100 dark:border-rose-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl text-white ${formData.outcome === 'Loss' ? 'bg-rose-500' : 'bg-gray-400 dark:bg-gray-700'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <InputLabel>Mistakes to Correct</InputLabel>
                </div>
                <textarea 
                  placeholder="Identify specific behavioral or tactical flaws..."
                  className="w-full h-28 bg-white dark:bg-black/20 border-0 rounded-2xl p-6 text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500 text-rose-800 dark:text-rose-200 resize-none shadow-sm placeholder:text-rose-300 dark:placeholder:text-rose-900/40"
                  value={formData.reflection?.mistakes}
                  onChange={e => setFormData({ ...formData, reflection: { ...formData.reflection!, mistakes: e.target.value } })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/30 dark:bg-white/[0.01]">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${step === 1 ? 'opacity-0' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white translate-x-0 hover:-translate-x-1'}`}>
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          <button onClick={step < 3 ? () => setStep(s => s + 1) : handleSave} className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:translate-x-1 transition-all">
            {step < 3 ? 'Proceed' : editTrade ? 'Update Entry' : 'Finish Log'} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
