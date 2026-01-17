
import React, { useState, useRef, useEffect } from 'react';
import { UserSettings, Rule, Criterion, TradingSystemModel, Trade } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, HelpCircle, ListTodo, Layers, X, Edit3, ArrowRight, AlertCircle, BookOpen, Cpu } from 'lucide-react';
import { AISystemIntelligence } from './AISystemIntelligence';

interface TradingSystemProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  trades: Trade[];
}

export const TradingSystem: React.FC<TradingSystemProps> = ({ settings, onSave, trades }) => {
  const [activeSystemId, setActiveSystemId] = useState(settings.systems[0]?.id || '');
  const [newRule, setNewRule] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIIntelligence, setShowAIIntelligence] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isCreatingNewSystem, setIsCreatingNewSystem] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  
  // Builder state for properties
  const [builderType, setBuilderType] = useState<Criterion['type']>('Checklist');
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderResponse, setBuilderResponse] = useState('');
  const [builderOptions, setBuilderOptions] = useState<string[]>(['']);
  const [builderError, setBuilderError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCreatingNewSystem && settings.systems.length > 0 && !settings.systems.find(s => s.id === activeSystemId)) {
      setActiveSystemId(settings.systems[0].id);
    }
  }, [settings.systems, activeSystemId, isCreatingNewSystem]);

  const activeSystem = settings.systems.find(s => s.id === activeSystemId) || settings.systems[0];

  const updateActiveSystem = (updates: Partial<TradingSystemModel>) => {
    if (!activeSystem) return;
    const updatedSystems = settings.systems.map(s => s.id === activeSystem.id ? { ...s, ...updates } : s);
    onSave({ ...settings, systems: updatedSystems });
  };

  const handleCreateSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSystemName.trim()) return;

    const newSys: TradingSystemModel = { 
      id: crypto.randomUUID?.() || Date.now().toString(), 
      name: newSystemName.trim(), 
      rules: [], 
      customCriteria: [], 
      samples: [] 
    };
    onSave({ ...settings, systems: [...settings.systems, newSys] });
    setActiveSystemId(newSys.id);
    setNewSystemName('');
    setIsCreatingNewSystem(false);
  };

  const handleAddCriterion = (e: React.MouseEvent) => {
    e.preventDefault();
    setBuilderError(null);

    if (!builderTitle.trim()) {
      setBuilderError("Property title is required.");
      return;
    }

    if ((builderType === 'Checklist' || builderType === 'Multi-select')) {
      const validOptions = builderOptions.filter(o => o.trim() !== '');
      if (validOptions.length === 0) {
        setBuilderError("At least one option is required.");
        return;
      }
    }

    if (!activeSystem) return;
    
    const newCriterion: Criterion = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: builderTitle.trim(),
      type: builderType,
      options: (builderType === 'Checklist' || builderType === 'Multi-select') 
        ? builderOptions.filter(o => o.trim() !== '') 
        : undefined
    };

    updateActiveSystem({ 
      customCriteria: [...activeSystem.customCriteria, newCriterion] 
    });
    
    // Reset builder
    setBuilderTitle('');
    setBuilderResponse('');
    setBuilderOptions(['']);
    setShowBuilder(false);
    setBuilderError(null);
  };

  return (
    <div className="flex gap-10">
      {/* Sidebar - Strategies List */}
      <aside className="w-56 space-y-4 shrink-0 animate-fade-in">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">Strategies</h3>
          <button 
            onClick={() => setIsCreatingNewSystem(true)} 
            className={`p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg transition-all active:scale-90 ${isCreatingNewSystem ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-400 dark:text-gray-600'}`}
            title="Create New Strategy"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {settings.systems.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSystemId(s.id);
                setIsCreatingNewSystem(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all animate-slide-right stagger-${index + 1} group ${
                activeSystemId === s.id && !isCreatingNewSystem ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg translate-x-1' : 'text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="truncate">{s.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 space-y-12 pb-20 animate-fade-in">
        {isCreatingNewSystem ? (
          <div className="max-w-xl animate-scale-in py-10">
            <div className="mb-10">
              <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-transform hover:scale-110">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight mb-2">Build a New Model</h2>
              <p className="text-sm text-gray-400 dark:text-gray-600 font-medium">Define a new mechanical system for your journal.</p>
            </div>

            <form onSubmit={handleCreateSystem} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-gray-700">Strategy Name</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. Silver Bullet, 2022 Model..."
                  className="w-full bg-gray-50 dark:bg-white/5 border-0 rounded-[1.5rem] px-8 py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700"
                  value={newSystemName}
                  onChange={e => setNewSystemName(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  disabled={!newSystemName.trim()}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-[1.25rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  Create Strategy <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreatingNewSystem(false)}
                  className="px-8 bg-white dark:bg-transparent border border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-600 rounded-[1.25rem] font-black uppercase text-[10px] tracking-widest hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : activeSystem ? (
          <div className="animate-fade-in space-y-12">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                {/* AI Intelligence Toggle Button */}
                <button
                  onClick={() => setShowAIIntelligence(!showAIIntelligence)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    showAIIntelligence
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  AI Intelligence
                </button>
              </div>
              <div className="flex items-center gap-3 group">
                {isEditingName ? (
                  <input 
                    autoFocus
                    className="text-3xl font-bold text-black dark:text-white bg-transparent border-b border-gray-200 dark:border-white/10 outline-none"
                    value={activeSystem.name}
                    onChange={e => updateActiveSystem({ name: e.target.value })}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-black dark:text-white flex items-center gap-2 tracking-tight transition-transform group-hover:translate-x-1">
                    {activeSystem.name}
                    <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 dark:text-gray-700 hover:text-black dark:hover:text-white transition-opacity">
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </h2>
                )}
              </div>
              {settings.systems.length > 1 && (
                <button 
                  onClick={() => {
                    if(confirm(`Delete strategy "${activeSystem.name}"?`)) {
                      onSave({ ...settings, systems: settings.systems.filter(s => s.id !== activeSystem.id) });
                    }
                  }}
                  className="text-[10px] font-black uppercase text-red-300 dark:text-red-900 hover:text-red-500 dark:hover:text-red-400 tracking-widest transition-all hover:scale-105"
                >
                  Delete Model
                </button>
              )}
            </header>

            {/* AI System Intelligence Panel */}
            {showAIIntelligence && (
              <div className="animate-fade-in">
                <AISystemIntelligence trades={trades} system={activeSystem} />
              </div>
            )}

            {/* Strategy Rules Section */}
            <section className="space-y-4 animate-slide-up stagger-1">
              <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">Hard Rules</h3>
              <div className="bg-[#fcfcfc] dark:bg-white/[0.02] rounded-3xl border border-gray-50 dark:border-white/5 p-6 space-y-2 shadow-sm">
                {activeSystem.rules.map((rule, idx) => (
                  <div key={rule.id} className={`flex items-center justify-between p-3.5 bg-white dark:bg-white/5 rounded-xl group border border-gray-100/50 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all animate-fade-in stagger-${(idx % 3) + 1}`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateActiveSystem({ rules: activeSystem.rules.map(r => r.id === rule.id ? { ...r, active: !r.active } : r) })} className="text-gray-300 dark:text-gray-700 transition-transform active:scale-75">
                        {rule.active ? <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <span className={`text-xs font-semibold transition-all duration-500 ${rule.active ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-700 line-through'}`}>{rule.text}</span>
                    </div>
                    <button onClick={() => updateActiveSystem({ rules: activeSystem.rules.filter(r => r.id !== rule.id) })} className="opacity-0 group-hover:opacity-100 text-gray-200 dark:text-gray-800 hover:text-red-400 dark:hover:text-red-500 transition-all hover:scale-110">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input 
                    type="text"
                    placeholder="Type a new rule and hit enter..."
                    className="flex-1 bg-gray-50 dark:bg-white/5 border-0 rounded-xl px-5 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    value={newRule}
                    onChange={e => setNewRule(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newRule.trim()) {
                        updateActiveSystem({ rules: [...activeSystem.rules, { id: crypto.randomUUID?.() || Date.now().toString(), text: newRule.trim(), active: true }] });
                        setNewRule('');
                      }
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Confluence Properties Section */}
            <section className="space-y-4 animate-slide-up stagger-2">
              <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">Confluence Spec</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSystem.customCriteria.map((criterion, idx) => (
                  <div key={criterion.id} className={`bg-[#fcfcfc] dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-50 dark:border-white/5 shadow-sm relative group hover:border-black/10 dark:hover:border-white/10 transition-all animate-scale-in stagger-${(idx % 4) + 1}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 transition-transform group-hover:rotate-6">
                        {criterion.type === 'Question' && <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-600" />}
                        {criterion.type === 'Checklist' && <ListTodo className="w-4 h-4 text-gray-400 dark:text-gray-600" />}
                        {criterion.type === 'Multi-select' && <Layers className="w-4 h-4 text-gray-400 dark:text-gray-600" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-black dark:text-white text-[10px] uppercase tracking-wider">{criterion.name}</h4>
                        <p className="text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-tight">{criterion.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateActiveSystem({ customCriteria: activeSystem.customCriteria.filter(c => c.id !== criterion.id) })} 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-200 dark:text-gray-800 hover:text-red-400 dark:hover:text-red-500 transition-all hover:scale-110"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                
                {!showBuilder ? (
                  <button 
                    onClick={() => setShowBuilder(true)} 
                    className="border-2 border-dashed border-gray-100 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white transition-all bg-gray-50/20 dark:bg-white/[0.01] group h-32 active:scale-95"
                  >
                    <Plus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add System Property</span>
                  </button>
                ) : (
                  <div className="col-span-full bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 animate-scale-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Layers className="w-32 h-32" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <h4 className="text-xl font-bold tracking-tight">Property Builder</h4>
                      <button onClick={() => { setShowBuilder(false); setBuilderError(null); }} className="p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-xl transition-all active:scale-90"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-6 relative z-10">
                      {/* Type Selector */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: 'Checklist', icon: ListTodo, label: 'Checklist' },
                          { id: 'Multi-select', icon: Layers, label: 'Selection List' }
                        ].map(t => (
                          <button 
                            key={t.id}
                            type="button"
                            onClick={() => { setBuilderType(t.id as Criterion['type']); setBuilderError(null); }}
                            className={`flex flex-col items-center gap-2 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                              builderType === t.id ? 'bg-white dark:bg-black text-black dark:text-white border-white dark:border-black shadow-xl scale-[1.02]' : 'bg-white/5 dark:bg-black/5 border-white/10 dark:border-black/10 text-white/40 dark:text-black/40 hover:bg-white/10 dark:hover:bg-black/10'
                            }`}
                          >
                            <t.icon className="w-5 h-5" />
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Title Input */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 dark:text-black/30 mb-2">Title / Description</label>
                          <input 
                            type="text" 
                            autoFocus
                            className={`w-full bg-white/5 dark:bg-black/5 border-0 rounded-2xl px-5 py-3.5 text-xs font-bold text-white dark:text-black outline-none focus:ring-1 focus:ring-white/20 dark:focus:ring-black/20 transition-all ${builderError && !builderTitle.trim() ? 'ring-1 ring-red-400' : ''}`}
                            placeholder="e.g. Daily Bias established?"
                            value={builderTitle}
                            onChange={e => setBuilderTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-3 animate-fade-in">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 dark:text-black/30">Defined Options</label>
                          <div className="grid grid-cols-1 gap-2">
                            {builderOptions.map((opt, i) => (
                              <div key={`opt-${i}`} className="flex gap-2 animate-slide-right">
                                <input 
                                  type="text" 
                                  className="flex-1 bg-white/5 dark:bg-black/5 border-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white dark:text-black outline-none focus:ring-1 focus:ring-white/20 dark:focus:ring-black/20 transition-all"
                                  placeholder={`Label ${i + 1}`}
                                  value={opt}
                                  onChange={e => {
                                    const updated = [...builderOptions];
                                    updated[i] = e.target.value;
                                    setBuilderOptions(updated);
                                  }}
                                />
                                {builderOptions.length > 1 && (
                                  <button 
                                    onClick={() => setBuilderOptions(builderOptions.filter((_, idx) => idx !== i))}
                                    className="p-2 text-white/20 dark:text-black/20 hover:text-red-400 transition-all active:scale-75"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <button 
                            type="button"
                            onClick={() => setBuilderOptions([...builderOptions, ''])}
                            className="text-[9px] font-black uppercase tracking-widest text-white/40 dark:text-black/40 hover:text-white dark:hover:text-black flex items-center gap-2 mt-2 transition-all hover:translate-x-1"
                          >
                            <Plus className="w-3 h-3" /> Add Item
                          </button>
                        </div>
                      </div>

                      {builderError && (
                        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold bg-red-400/10 p-3 rounded-xl animate-scale-in">
                          <AlertCircle className="w-3 h-3" /> {builderError}
                        </div>
                      )}

                      <div className="pt-4 flex justify-end gap-3">
                        <button 
                          onClick={() => { setShowBuilder(false); setBuilderError(null); }} 
                          className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 dark:text-black/40 hover:text-white dark:hover:text-black transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddCriterion} 
                          className="bg-white dark:bg-black text-black dark:text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all"
                        >
                          Save Property <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-fade-in">
             <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 transition-transform hover:rotate-12">
                <BookOpen className="w-10 h-10 text-gray-200 dark:text-gray-800" />
             </div>
             <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">No Strategies Defined</h3>
             <p className="text-sm text-gray-300 dark:text-gray-700 mb-8 max-w-xs">You haven't defined any mechanical models yet. Start by creating your first strategy.</p>
             <button 
               onClick={() => setIsCreatingNewSystem(true)}
               className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:translate-y-[-2px] transition-all active:scale-95"
             >
               Build First Model
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
