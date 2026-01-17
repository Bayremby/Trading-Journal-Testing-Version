// Copy and paste this entire script into the browser console
// Then press Enter to add 10 sample trades and 1 sample system

(function() {
  const sampleTrades = [
    {
      id: 'trade-001',
      systemId: 'system-001',
      pair: 'EURUSD',
      date: '2026-01-15T09:30:00.000Z',
      entryTime: '09:30',
      exitTime: '10:45',
      sessions: ['London', 'New York'],
      pois: ['FVG'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: 2.1,
      outcome: 'Win',
      rating: 4,
      grade: 'B',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': false
      },
      ruleRespectScore: 66.7,
      rulesFollowedCount: 2,
      totalActiveRules: 3,
      emotions: ['Confident', 'Patient'],
      reflection: {
        liquidityDraw: 'Clean sweep at London open',
        htfNarrative: 'Bullish momentum confirmed',
        mistakes: 'Exited too early on first target',
        whatWentWell: 'Entry timing was perfect',
        lesson: 'Let winners run to full target'
      }
    },
    {
      id: 'trade-002',
      systemId: 'system-001',
      pair: 'GBPUSD',
      date: '2026-01-15T10:15:00.000Z',
      entryTime: '10:15',
      exitTime: '11:20',
      sessions: ['London', 'New York'],
      pois: ['Order Block'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: -1.8,
      outcome: 'Loss',
      rating: 2,
      grade: 'D+',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': false,
        'rule-003': true
      },
      ruleRespectScore: 66.7,
      rulesFollowedCount: 2,
      totalActiveRules: 3,
      emotions: ['Impatient', 'Frustrated'],
      reflection: {
        liquidityDraw: 'Failed to sweep liquidity',
        htfNarrative: 'Bearish momentum',
        mistakes: 'Entered too early',
        whatWentWell: 'Stop loss was respected',
        lesson: 'Wait for confirmation before entry'
      }
    },
    {
      id: 'trade-003',
      systemId: 'system-001',
      pair: 'EURUSD',
      date: '2026-01-15T14:30:00.000Z',
      entryTime: '14:30',
      exitTime: '15:45',
      sessions: ['New York'],
      pois: ['Breaker'],
      riskPercent: 1.5,
      riskReward: 2.5,
      resultR: 3.2,
      outcome: 'Win',
      rating: 5,
      grade: 'A+',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': true
      },
      ruleRespectScore: 100,
      rulesFollowedCount: 3,
      totalActiveRules: 3,
      emotions: ['Confident', 'Focused'],
      reflection: {
        liquidityDraw: 'Perfect breaker sweep',
        htfNarrative: 'Strong bullish structure',
        mistakes: 'None',
        whatWentWell: 'Followed all rules perfectly',
        lesson: 'Patience pays off'
      }
    },
    {
      id: 'trade-004',
      systemId: 'system-001',
      pair: 'USDJPY',
      date: '2026-01-16T02:45:00.000Z',
      entryTime: '02:45',
      exitTime: '04:00',
      sessions: ['Asian'],
      pois: ['Liquidity Sweep'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: -1.5,
      outcome: 'Loss',
      rating: 2,
      grade: 'D',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': false,
        'rule-002': true,
        'rule-003': true
      },
      ruleRespectScore: 66.7,
      rulesFollowedCount: 2,
      totalActiveRules: 3,
      emotions: ['Tired', 'Overconfident'],
      reflection: {
        liquidityDraw: 'Partial sweep only',
        htfNarrative: 'Range-bound market',
        mistakes: 'Ignored rule 001',
        whatWentWell: 'Quick exit',
        lesson: 'Dont trade when tired'
      }
    },
    {
      id: 'trade-005',
      systemId: 'system-001',
      pair: 'EURUSD',
      date: '2026-01-16T08:30:00.000Z',
      entryTime: '08:30',
      exitTime: '09:30',
      sessions: ['London'],
      pois: ['FVG'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: 2.0,
      outcome: 'Win',
      rating: 4,
      grade: 'B',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': true
      },
      ruleRespectScore: 100,
      rulesFollowedCount: 3,
      totalActiveRules: 3,
      emotions: ['Patient', 'Disciplined'],
      reflection: {
        liquidityDraw: 'Clean FVG fill',
        htfNarrative: 'Bullish continuation',
        mistakes: 'None',
        whatWentWell: 'Perfect execution',
        lesson: 'London session is strongest'
      }
    },
    {
      id: 'trade-006',
      systemId: 'system-001',
      pair: 'GBPUSD',
      date: '2026-01-16T11:45:00.000Z',
      entryTime: '11:45',
      exitTime: '12:30',
      sessions: ['London', 'New York'],
      pois: ['Order Block'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: -2.0,
      outcome: 'Loss',
      rating: 1,
      grade: 'F',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': false,
        'rule-002': false,
        'rule-003': true
      },
      ruleRespectScore: 33.3,
      rulesFollowedCount: 1,
      totalActiveRules: 3,
      emotions: ['Revenge', 'Impatient'],
      reflection: {
        liquidityDraw: 'No liquidity sweep',
        htfNarrative: 'Choppy market',
        mistakes: 'Revenge trading after loss',
        whatWentWell: 'None',
        lesson: 'Take break after losses'
      }
    },
    {
      id: 'trade-007',
      systemId: 'system-001',
      pair: 'EURUSD',
      date: '2026-01-16T15:00:00.000Z',
      entryTime: '15:00',
      exitTime: '16:15',
      sessions: ['New York'],
      pois: ['Breaker'],
      riskPercent: 1.5,
      riskReward: 2.5,
      resultR: 2.8,
      outcome: 'Win',
      rating: 4,
      grade: 'B+',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': true
      },
      ruleRespectScore: 100,
      rulesFollowedCount: 3,
      totalActiveRules: 3,
      emotions: ['Focused', 'Confident'],
      reflection: {
        liquidityDraw: 'Excellent breaker formation',
        htfNarrative: 'Strong momentum',
        mistakes: 'None',
        whatWentWell: 'All rules followed',
        lesson: 'NY session breakout strategy works'
      }
    },
    {
      id: 'trade-008',
      systemId: 'system-001',
      pair: 'USDJPY',
      date: '2026-01-17T01:30:00.000Z',
      entryTime: '01:30',
      exitTime: '02:45',
      sessions: ['Asian'],
      pois: ['Liquidity Sweep'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: 1.9,
      outcome: 'Win',
      rating: 4,
      grade: 'B-',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': false
      },
      ruleRespectScore: 66.7,
      rulesFollowedCount: 2,
      totalActiveRules: 3,
      emotions: ['Calm', 'Analytical'],
      reflection: {
        liquidityDraw: 'Good sweep execution',
        htfNarrative: 'Range breakout',
        mistakes: 'Minor timing issue',
        whatWentWell: 'Good risk management',
        lesson: 'Asian session can be profitable'
      }
    },
    {
      id: 'trade-009',
      systemId: 'system-001',
      pair: 'EURUSD',
      date: '2026-01-17T09:00:00.000Z',
      entryTime: '09:00',
      exitTime: '10:15',
      sessions: ['London'],
      pois: ['FVG'],
      riskPercent: 1.5,
      riskReward: 2.0,
      resultR: -1.6,
      outcome: 'Loss',
      rating: 2,
      grade: 'D-',
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': false,
        'rule-003': true
      },
      ruleRespectScore: 66.7,
      rulesFollowedCount: 2,
      totalActiveRules: 3,
      emotions: ['Anxious', 'Impatient'],
      reflection: {
        liquidityDraw: 'Partial fill only',
        htfNarrative: 'Unclear direction',
        mistakes: 'Entered too early',
        whatWentWell: 'Stop loss respected',
        lesson: 'Wait for clear signals'
      }
    },
    {
      id: 'trade-010',
      systemId: 'system-001',
      pair: 'GBPUSD',
      date: '2026-01-17T13:30:00.000Z',
      entryTime: '13:30',
      exitTime: '14:45',
      sessions: ['London', 'New York'],
      pois: ['Breaker'],
      riskPercent: 1.5,
      riskReward: 2.5,
      resultR: 3.5,
      outcome: 'Win',
      rating: 5,
      screenshots: [],
      customCriteria: {},
      rulesFollowed: {
        'rule-001': true,
        'rule-002': true,
        'rule-003': true
      },
      ruleRespectScore: 100,
      rulesFollowedCount: 3,
      totalActiveRules: 3,
      emotions: ['Confident', 'Disciplined'],
      reflection: {
        liquidityDraw: 'Perfect breaker sweep',
        htfNarrative: 'Strong bullish structure',
        mistakes: 'None',
        whatWentWell: 'Maximum profit taken',
        lesson: 'Patience and discipline pay off'
      }
    }
  ];

  const sampleSystem = {
    id: 'system-001',
    name: 'Momentum Breakout System',
    rules: [
      { id: 'rule-001', text: 'Wait for FVG or breaker confirmation', active: true },
      { id: 'rule-002', text: 'Trade only during London or NY session', active: true },
      { id: 'rule-003', text: 'Minimum 2:1 risk/reward ratio', active: true }
    ],
    customCriteria: [],
    samples: []
  };

  // Add trades
  const currentTrades = JSON.parse(localStorage.getItem('silence_journal_trades') || '[]');
  const updatedTrades = [...currentTrades, ...sampleTrades];
  localStorage.setItem('silence_journal_trades', JSON.stringify(updatedTrades));

  // Add system
  const currentSettings = JSON.parse(localStorage.getItem('silence_journal_settings') || '{}');
  const systems = currentSettings.systems || [];
  const updatedSettings = {
    ...currentSettings,
    systems: [...systems, sampleSystem]
  };
  localStorage.setItem('silence_journal_settings', JSON.stringify(updatedSettings));

  console.log('✅ Added 10 sample trades and 1 sample system');
  console.log('📊 Total trades:', updatedTrades.length);
  console.log('🎯 Total systems:', updatedSettings.systems.length);
  console.log('🔄 Reloading page...');
  
  setTimeout(() => location.reload(), 1000);
})();
