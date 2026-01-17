import { Trade } from '../types';
import { storage } from '../services/storage';

/**
 * Convert trades array to CSV format
 */
export const exportTradesToCSV = (trades: Trade[]): string => {
  if (trades.length === 0) {
    return 'No trades to export';
  }

  const settings = storage.getSettings();
  
  // CSV Headers
  const headers = [
    'Date',
    'Instrument',
    'System',
    'Sessions',
    'Outcome',
    'Risk %',
    'RR',
    'Realized R',
    'Rating',
    'Entry Time',
    'Exit Time',
    'POIs',
    'Liquidity Draw',
    'HTF Narrative',
    'What Went Well',
    'Mistakes',
    'Lesson Learned',
    'Rules Followed',
    'Rules Violated',
    'Custom Criteria'
  ];

  // Convert trades to CSV rows
  const rows = trades.map(trade => {
    const system = settings.systems.find(s => s.id === trade.systemId);
    const systemName = system?.name || 'N/A';
    
    // Get active rules for this system
    const activeRules = system?.rules.filter(r => r.active) || [];
    const rulesFollowed = activeRules
      .filter(r => trade.rulesFollowed[r.id] === true)
      .map(r => r.text)
      .join('; ');
    const rulesViolated = activeRules
      .filter(r => trade.rulesFollowed[r.id] === false)
      .map(r => r.text)
      .join('; ');

    // Format custom criteria
    const customCriteria = Object.entries(trade.customCriteria || {})
      .map(([key, value]) => {
        const criterion = system?.customCriteria.find(c => c.id === key);
        const name = criterion?.name || key;
        const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
        return `${name}: ${formattedValue}`;
      })
      .join('; ');

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value: string | number | undefined | null): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escapeCSV(trade.date),
      escapeCSV(trade.pair),
      escapeCSV(systemName),
      escapeCSV(trade.sessions.join(', ')),
      escapeCSV(trade.outcome),
      escapeCSV(trade.riskPercent),
      escapeCSV(trade.riskReward),
      escapeCSV(trade.resultR),
      escapeCSV(trade.rating),
      escapeCSV(trade.entryTime),
      escapeCSV(trade.exitTime),
      escapeCSV(trade.pois.join(', ')),
      escapeCSV(trade.reflection?.liquidityDraw),
      escapeCSV(trade.reflection?.htfNarrative),
      escapeCSV(trade.reflection?.whatWentWell),
      escapeCSV(trade.reflection?.mistakes),
      escapeCSV(trade.reflection?.lesson),
      escapeCSV(rulesFollowed),
      escapeCSV(rulesViolated),
      escapeCSV(customCriteria)
    ].join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Convert trades array to JSON format
 */
export const exportTradesToJSON = (trades: Trade[]): string => {
  const settings = storage.getSettings();
  
  // Enrich trades with system names for better readability
  const enrichedTrades = trades.map(trade => {
    const system = settings.systems.find(s => s.id === trade.systemId);
    
    // Get rules information
    const activeRules = system?.rules.filter(r => r.active) || [];
    const rulesStatus = activeRules.map(rule => ({
      ruleId: rule.id,
      ruleText: rule.text,
      followed: trade.rulesFollowed[rule.id] === true
    }));

    return {
      ...trade,
      systemName: system?.name || 'N/A',
      rulesStatus,
      // Flatten reflection for easier reading
      liquidityDraw: trade.reflection?.liquidityDraw || '',
      htfNarrative: trade.reflection?.htfNarrative || '',
      whatWentWell: trade.reflection?.whatWentWell || '',
      mistakes: trade.reflection?.mistakes || '',
      lesson: trade.reflection?.lesson || '',
      // Remove base64 screenshots to reduce file size (optional - can be included)
      screenshots: trade.screenshots?.length || 0, // Just count, not full data
      // Include metadata
      exportDate: new Date().toISOString(),
      exportVersion: '1.0'
    };
  });

  return JSON.stringify({
    exportInfo: {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      totalTrades: enrichedTrades.length,
      dateRange: trades.length > 0 ? {
        from: trades.reduce((earliest, t) => t.date < earliest ? t.date : earliest, trades[0].date),
        to: trades.reduce((latest, t) => t.date > latest ? t.date : latest, trades[0].date)
      } : null
    },
    trades: enrichedTrades
  }, null, 2);
};

/**
 * Download file with given content and filename
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export trades to CSV file
 */
export const exportTradesToCSVFile = (trades: Trade[]): void => {
  const csvContent = exportTradesToCSV(trades);
  const filename = `silence-journal-trades-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export trades to JSON file
 */
export const exportTradesToJSONFile = (trades: Trade[]): void => {
  const jsonContent = exportTradesToJSON(trades);
  const filename = `silence-journal-trades-${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};
