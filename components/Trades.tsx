import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Trade, UserSettings, TradeGrade } from '../types';
import { Clock, Table as TableIcon, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Plus, Eye, Download, FileText, FileJson, X, ArrowUpRight, ArrowDownRight, Maximize2, Minimize2 } from 'lucide-react';
import { storage } from '../services/storage';
import { exportTradesToCSVFile, exportTradesToJSONFile } from '../utils/export';
import { getGradeColor, getGradeBgColor } from '../services/aiMentor';

interface TradesProps {
  trades: Trade[];
  onOpenReview: (trade: Trade) => void;
  onOpenEntry: (date?: string, tradeToEdit?: Trade) => void;
}

type ViewMode = 'table' | 'calendar';
type DayDisplayOptions = {
  dot: boolean;
  net: boolean;
  count: boolean;
  pairs: boolean;
  grades: boolean;
};

export const Trades: React.FC<TradesProps> = ({ trades, onOpenReview, onOpenEntry }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const [exportMenuPosition, setExportMenuPosition] = useState<{ top: number; right?: number; left?: number } | null>(null);
  const [displayMenuPosition, setDisplayMenuPosition] = useState<{ top: number; right?: number; left?: number } | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDayTrades, setSelectedDayTrades] = useState<Trade[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const exportButtonRef = React.useRef<HTMLButtonElement>(null);
  const showButtonRef = React.useRef<HTMLButtonElement>(null);
  const monthDropdownRef = React.useRef<HTMLDivElement>(null);
  const yearDropdownRef = React.useRef<HTMLDivElement>(null);
  const STORAGE_KEY = 'silence_journal_calendar_display_v2';

  const [displayOptions, setDisplayOptions] = useState<DayDisplayOptions>({ dot: false, net: true, count: true, pairs: false, grades: false });
  const settings = useMemo(() => storage.getSettings(), []);

  // load persisted display options on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DayDisplayOptions;
        setDisplayOptions(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate dropdown position to prevent overflow
  const calculateDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement>, menuWidth: number = 180) => {
    if (!buttonRef.current) return null;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const buttonRight = rect.right;
    const buttonLeft = rect.left;
    
    // Check if dropdown would overflow on the right
    const wouldOverflowRight = buttonRight + menuWidth > viewportWidth;
    
    // Position dropdown to stay within viewport
    if (wouldOverflowRight) {
      // Align right edge of dropdown with right edge of button
      return {
        top: rect.bottom + 8,
        right: viewportWidth - buttonRight
      };
    } else {
      // Position dropdown to the right of button
      return {
        top: rect.bottom + 8,
        left: buttonLeft
      };
    }
  };

  // persist display options whenever they change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(displayOptions)); } catch (e) { }
  }, [displayOptions]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu) setShowExportMenu(false);
      if (showDisplayMenu) setShowDisplayMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showExportMenu, showDisplayMenu]);

  const sortedTrades = useMemo(() =>
    [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [trades]
  );

  const TableView = () => (
    <div className="bg-[#fcfcfc] dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/[0.03] overflow-hidden animate-fade-in">
      <table className="w-full text-[10px] text-left">
        <thead className="bg-gray-50/50 dark:bg-[#0a0a0a] text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Instrument</th>
            <th className="px-6 py-4">System</th>
            <th className="px-6 py-4">RRS %</th>
            <th className="px-6 py-4">Result</th>
            <th className="px-6 py-4">Grade</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02] text-xs">
          {sortedTrades.map((trade, index) => {
            const system = settings.systems.find(s => s.id === trade.systemId);
            const grade = trade.grade || 'C';
            return (
              <tr
                key={trade.id}
                className={`hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group animate-fade-in stagger-${(index % 5) + 1}`}
                onClick={() => onOpenReview(trade)}
              >
                <td className="px-6 py-4 font-medium text-gray-400 dark:text-gray-600">{trade.date}</td>
                <td className="px-6 py-4 font-bold text-black dark:text-white">{trade.pair}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-500 font-medium">{system?.name || 'N/A'}</td>
                <td className={`px-6 py-4 font-black ${(trade.ruleRespectScore || 100) >= 85 ? 'text-slate-600 dark:text-slate-400' :
                  (trade.ruleRespectScore || 100) >= 70 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                  {trade.ruleRespectScore?.toFixed(0) || 100}%
                </td>
                <td className={`px-6 py-4 font-black ${trade.resultR >= 0 ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-700'}`}>
                  {trade.resultR > 0 ? '+' : ''}{trade.resultR}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold border ${getGradeBgColor(grade)} ${getGradeColor(grade)}`}>
                    {grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Eye className="w-3.5 h-3.5 text-gray-200 dark:text-gray-800 group-hover:text-black dark:group-hover:text-white ml-auto transition-transform group-hover:scale-110" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const CalendarView = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date().toISOString().split('T')[0];

    const handleDayClick = (dateStr: string) => {
      const dayTrades = trades.filter((t) => t.date === dateStr);
      setSelectedDay(dateStr);
      setSelectedDayTrades(dayTrades);
      setIsModalOpen(true);
    };

    const handlePreviousMonth = () => {
      setCurrentMonth(new Date(year, month - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1));
    };

    const handleToday = () => {
      setCurrentMonth(new Date());
    };

    const handleMonthChange = (newMonth: number) => {
      setCurrentMonth(new Date(year, newMonth));
    };

    const handleYearChange = (newYear: number) => {
      setCurrentMonth(new Date(newYear, month));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Generate year options (current year ± 10)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    // Calendar cell size - permanently expanded
    const cellClass = 'min-h-[120px] p-3 rounded-2xl';

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className={`${cellClass} border border-gray-100 dark:border-white/[0.03] bg-white dark:bg-[#111] opacity-50`} 
        />
      );
    }

    // Determine text styling based on trade outcome
    const getNetOutcomeStyle = (sumR: number) => {
      if (sumR > 5) return 'text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent';
      if (sumR > 0) return 'text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent';
      if (sumR < -5) return 'text-sm font-semibold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent';
      if (sumR < 0) return 'text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent';
      return 'text-sm font-semibold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent';
    };

    // Determine background style for net outcome text
    const getNetOutcomeBackground = (sumR: number) => {
      if (sumR > 5) return 'bg-emerald-50/30 dark:bg-emerald-500/10 px-2 py-1 rounded-lg';
      if (sumR > 0) return 'bg-green-50/30 dark:bg-green-500/10 px-2 py-1 rounded-lg';
      if (sumR < -5) return 'bg-rose-50/30 dark:bg-rose-500/10 px-2 py-1 rounded-lg';
      if (sumR < 0) return 'bg-red-50/30 dark:bg-red-500/10 px-2 py-1 rounded-lg';
      return 'bg-gray-50/30 dark:bg-gray-500/10 px-2 py-1 rounded-lg';
    };

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTrades = trades.filter((t) => t.date === dateStr);
      const isToday = today === dateStr;
      const sumR = dayTrades.reduce((s, t) => s + (t.resultR || 0), 0);
      const hasTrades = dayTrades.length > 0;

      days.push(
        <div
          key={d}
          onClick={() => handleDayClick(dateStr)}
          title={dayTrades.length > 0 ? `${dayTrades.length} trade(s) — Net ${sumR >= 0 ? '+' : ''}${sumR}R` : 'No trades'}
          className={`${cellClass} border border-gray-100 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer group relative ${
            isToday 
              ? 'ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-500/10' 
              : 'hover:shadow-sm bg-white dark:bg-[#111]'
          }`}
        >
          <div className="flex flex-col h-full relative">
            {/* Date number - top left */}
            <div className={`text-xs font-medium transition-colors ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-600'}`}>
              {d}
            </div>

            {/* Centered display indicators */}
            {dayTrades.length > 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-1">
                <div className="flex flex-col items-center gap-1 w-full">
                  {/* Net Outcome */}
                  {displayOptions.net && (
                    <div className={getNetOutcomeBackground(sumR)}>
                      <span className={getNetOutcomeStyle(sumR)}>
                        {sumR >= 0 ? `+${sumR}` : sumR}R
                      </span>
                    </div>
                  )}
                  
                  {/* Secondary indicators row */}
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* Average Grade */}
                    {displayOptions.grades && dayTrades.length > 0 && (() => {
                      // For single trade, just show that trade's grade
                      if (dayTrades.length === 1) {
                        const tradeGrade = dayTrades[0].grade || 'C';
                        return (
                          <span className={`text-[8px] font-bold px-2 py-1 rounded-lg border ${getGradeBgColor(tradeGrade as any)} ${getGradeColor(tradeGrade as any)}`}>
                            {tradeGrade}
                          </span>
                        );
                      }
                      
                      // For multiple trades, calculate average
                      const avgGrade = dayTrades.reduce((acc, trade) => {
                        const grade = trade.grade || 'C';
                        const gradeValue = grade === 'A+' ? 4 : grade === 'A' ? 3 : grade === 'B' ? 2 : grade === 'C' ? 1 : 0;
                        return acc + gradeValue;
                      }, 0) / dayTrades.length;
                      
                      const avgGradeLetter = avgGrade >= 3.5 ? 'A+' : avgGrade >= 2.5 ? 'A' : avgGrade >= 1.5 ? 'B' : 'C';
                      
                      return (
                        <span className={`text-[8px] font-bold px-2 py-1 rounded-lg border ${getGradeBgColor(avgGradeLetter as any)} ${getGradeColor(avgGradeLetter as any)}`}>
                          {avgGradeLetter}
                        </span>
                      );
                    })()}
                    
                    {/* Pairs */}
                    {displayOptions.pairs && dayTrades.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 max-w-[60px]">
                        {[...new Set(dayTrades.map(t => t.pair))].slice(0, 1).map((pair, idx) => (
                          <span key={idx} className={`text-[8px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded`}>
                            {pair}
                          </span>
                        ))}
                        {[...new Set(dayTrades.map(t => t.pair))].length > 1 && (
                          <span className={`text-[8px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded`}>
                            +{[...new Set(dayTrades.map(t => t.pair))].length - 1}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Dot indicator */}
                    {displayOptions.dot && (
                      <div className="flex gap-1">
                        {sumR > 0 && <div className={`w-2 h-2 rounded-full bg-emerald-500`} title="Positive day"></div>}
                        {sumR < 0 && <div className={`w-2 h-2 rounded-full bg-rose-500`} title="Negative day"></div>}
                        {sumR === 0 && dayTrades.length > 0 && <div className={`w-2 h-2 rounded-full bg-gray-400`} title="Breakeven day"></div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Trade Count - bottom right */}
            {displayOptions.count && dayTrades.length > 0 && (
              <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
                <span className={`text-[8px] font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded`}>
                  {dayTrades.length}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#fcfcfc] dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/[0.03] overflow-hidden shadow-sm">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a] border-b border-gray-200 dark:border-white/[0.05] p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousMonth}
              className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all hover:scale-105 active:scale-95"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {/* Month Dropdown */}
                <div className="relative" ref={monthDropdownRef}>
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="px-4 py-2 pl-10 text-lg font-semibold bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.1] rounded-lg text-gray-800 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {monthNames[month]}
                    <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showMonthDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setShowMonthDropdown(false)}
                      />
                      <div className="absolute top-full mt-2 left-0 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-xl z-[9999] overflow-hidden animate-scale-in min-w-[150px]">
                        <div className="max-h-64 overflow-y-auto">
                          {monthNames.map((name, index) => (
                            <button
                              key={name}
                              onClick={() => {
                                handleMonthChange(index);
                                setShowMonthDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.05] ${
                                index === month 
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Year Dropdown */}
                <div className="relative" ref={yearDropdownRef}>
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="px-4 py-2 pl-10 text-lg font-semibold bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.1] rounded-lg text-gray-800 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {year}
                    <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showYearDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setShowYearDropdown(false)}
                      />
                      <div className="absolute top-full mt-2 left-0 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.1] rounded-xl shadow-xl z-[9999] overflow-hidden animate-scale-in min-w-[100px]">
                        <div className="max-h-64 overflow-y-auto">
                          {yearOptions.map((yearOption) => (
                            <button
                              key={yearOption}
                              onClick={() => {
                                handleYearChange(yearOption);
                                setShowYearDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.05] ${
                                yearOption === year 
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {yearOption}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleToday}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Today
              </button>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all hover:scale-105 active:scale-95"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-3 rounded-lg ${
                  index === 0 || index === 6 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10' 
                    : 'bg-gray-50/50 dark:bg-white/[0.02]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3 p-4">
          {days}
        </div>
      </div>
    );
  };

  // Move closeModal to the top level of Trades component
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
    setSelectedDayTrades(null);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Activity</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          {trades.length > 0 && (
            <div className="relative">
              <button
                ref={exportButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  const position = calculateDropdownPosition(exportButtonRef, 180);
                  setExportMenuPosition(position);
                  setShowExportMenu(!showExportMenu);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              {showExportMenu && exportMenuPosition && ReactDOM.createPortal(
                <>
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div 
                    className="fixed bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-xl shadow-xl z-[9999] min-w-[180px] animate-scale-in"
                    style={{
                      top: `${exportMenuPosition.top}px`,
                      ...(exportMenuPosition.right !== undefined ? { right: `${exportMenuPosition.right}px` } : { left: `${exportMenuPosition.left}px` })
                    }}
                  >
                    <button
                      onClick={() => {
                        exportTradesToCSVFile(trades);
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors first:rounded-t-xl"
                    >
                      <FileText className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        exportTradesToJSONFile(trades);
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors last:rounded-b-xl border-t border-gray-100 dark:border-white/5"
                    >
                      <FileJson className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                      <span>Export as JSON</span>
                    </button>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}

          <div className="flex items-center bg-gray-100 dark:bg-[#0a0a0a] p-1 rounded-xl shadow-inner border dark:border-white/[0.03]">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 ${viewMode === 'calendar' ? 'bg-white dark:bg-[#222] shadow-sm text-black dark:text-white' : 'text-gray-400 dark:text-gray-700 hover:text-gray-600 dark:hover:text-gray-400'}`}
            >
              <CalendarIcon className="w-3 h-3" /> Calendar
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 ${viewMode === 'table' ? 'bg-white dark:bg-[#222] shadow-sm text-black dark:text-white' : 'text-gray-400 dark:text-gray-700 hover:text-gray-600 dark:hover:text-gray-400'}`}
            >
              <TableIcon className="w-3 h-3" /> Table
            </button>
          </div>
          {/* Display options dropdown */}
          <div className="relative">
            <button
              ref={showButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                const position = calculateDropdownPosition(showButtonRef, 200);
                setDisplayMenuPosition(position);
                setShowDisplayMenu((v) => !v);
              }}
              className="ml-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              Show
            </button>

            {showDisplayMenu && displayMenuPosition && ReactDOM.createPortal(
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setShowDisplayMenu(false)}
                />
                <div
                  className="fixed bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-xl shadow-xl z-[9999] p-4 min-w-[200px]"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    top: `${displayMenuPosition.top}px`,
                    ...(displayMenuPosition.right !== undefined ? { right: `${displayMenuPosition.right}px` } : { left: `${displayMenuPosition.left}px` })
                  }}
                >
                  <div className="flex flex-col gap-3 text-sm">
                    {([
                      { key: 'net', label: 'Net Outcome' },
                      { key: 'count', label: 'Trade Count' },
                      { key: 'pairs', label: 'Pairs' },
                      { key: 'grades', label: 'Grades' },
                      { key: 'dot', label: 'Dot' },
                    ] as { key: keyof DayDisplayOptions; label: string }[]).map(opt => (
                      <label key={opt.key} className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={displayOptions[opt.key]}
                          onChange={() => {
                            setDisplayOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key] }));
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-black dark:text-white font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </header>

      <div className="relative">
        {viewMode === 'calendar' && <CalendarView />}
        {viewMode === 'table' && <TableView />}
      </div>

      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={closeModal}>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">
                {selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">
                <X className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </button>
            </div>

            {selectedDayTrades && selectedDayTrades.length > 0 ? (
              <>
                <button
                  onClick={() => {
                    onOpenEntry(selectedDay!);
                    closeModal();
                  }}
                  className="w-full mb-4 px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Trade
                </button>

                <div className="space-y-3">
                  {selectedDayTrades.map((trade, index) => {
                    const system = settings.systems.find(s => s.id === trade.systemId);
                    return (
                      <div
                        key={trade.id}
                        onClick={() => {
                          onOpenReview(trade);
                          closeModal();
                        }}
                        className={`bg-[#fcfcfc] dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/[0.03] group hover:border-black/20 dark:hover:border-white/10 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between animate-slide-up stagger-${(index % 3) + 1}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${trade.resultR > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black'
                            }`}>
                            {trade.resultR > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-black dark:text-white leading-none mb-1">{trade.pair}</h3>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trade.date}</span>
                              <span className="uppercase tracking-widest">{trade.sessions.join(', ')}</span>
                              {system && <span className="text-black dark:text-gray-400 font-bold uppercase tracking-tight">{system.name}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <div className={`text-xl font-black transition-colors ${trade.resultR >= 0 ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-700'}`}>
                              {trade.resultR >= 0 ? '+' : ''}{trade.resultR}R
                            </div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold border ${getGradeBgColor(trade.grade || 'C')} ${getGradeColor(trade.grade || 'C')}`}>
                                {trade.grade || 'C'}
                              </span>
                            </div>
                          </div>
                          <Eye className="w-4 h-4 text-gray-200 dark:text-gray-800 group-hover:text-black dark:group-hover:text-white transition-all group-hover:scale-110" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">No trades yet</h3>
                <p className="text-sm text-gray-400 dark:text-gray-600 mb-6">Start tracking your trading journey</p>
                <button
                  onClick={() => {
                    onOpenEntry(selectedDay!);
                    closeModal();
                  }}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Trade
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
