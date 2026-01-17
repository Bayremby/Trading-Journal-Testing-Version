import { supabase } from './supabase';
import { Trade, UserSettings, TradingSystemModel } from '../types';
import { storage } from './storage';

// ============================================
// DATA SYNC SERVICE
// Syncs data between localStorage and Supabase
// ============================================

export const dataSync = {
  // Sync user settings to Supabase
  async syncSettings(userId: string, settings: UserSettings): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          default_risk: settings.defaultRisk,
          pairs: settings.pairs,
          sessions: settings.sessions,
          theme: settings.theme,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error syncing settings:', error);
      }
    } catch (err) {
      console.error('Error syncing settings:', err);
    }
  },

  // Load settings from Supabase
  async loadSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        systems: [], // Systems are loaded separately
        defaultRisk: data.default_risk,
        pairs: data.pairs,
        sessions: data.sessions,
        theme: data.theme,
      };
    } catch (err) {
      console.error('Error loading settings:', err);
      return null;
    }
  },

  // Sync trading systems to Supabase
  async syncSystems(userId: string, systems: TradingSystemModel[]): Promise<void> {
    try {
      for (const system of systems) {
        // Upsert system
        const { error: systemError } = await supabase
          .from('trading_systems')
          .upsert({
            id: system.id,
            user_id: userId,
            name: system.name,
          }, {
            onConflict: 'id'
          });

        if (systemError) {
          console.error('Error syncing system:', systemError);
          continue;
        }

        // Sync rules
        for (const rule of system.rules) {
          await supabase
            .from('system_rules')
            .upsert({
              id: rule.id,
              system_id: system.id,
              text: rule.text,
              active: rule.active,
            }, {
              onConflict: 'id'
            });
        }

        // Sync criteria
        for (const criterion of system.customCriteria) {
          await supabase
            .from('system_criteria')
            .upsert({
              id: criterion.id,
              system_id: system.id,
              type: criterion.type,
              title: criterion.name,
              response: criterion.response,
              options: criterion.options,
            }, {
              onConflict: 'id'
            });
        }
      }
    } catch (err) {
      console.error('Error syncing systems:', err);
    }
  },

  // Load trading systems from Supabase
  async loadSystems(userId: string): Promise<TradingSystemModel[]> {
    try {
      const { data: systems, error } = await supabase
        .from('trading_systems')
        .select('*')
        .eq('user_id', userId);

      if (error || !systems) {
        return [];
      }

      const fullSystems: TradingSystemModel[] = [];

      for (const system of systems) {
        // Load rules
        const { data: rules } = await supabase
          .from('system_rules')
          .select('*')
          .eq('system_id', system.id);

        // Load criteria
        const { data: criteria } = await supabase
          .from('system_criteria')
          .select('*')
          .eq('system_id', system.id);

        fullSystems.push({
          id: system.id,
          name: system.name,
          rules: (rules || []).map(r => ({
            id: r.id,
            text: r.text,
            active: r.active,
          })),
          customCriteria: (criteria || []).map(c => ({
            id: c.id,
            name: c.title,
            type: c.type,
            response: c.response,
            options: c.options,
          })),
          samples: [],
        });
      }

      return fullSystems;
    } catch (err) {
      console.error('Error loading systems:', err);
      return [];
    }
  },

  // Sync trades to Supabase
  async syncTrades(userId: string, trades: Trade[]): Promise<void> {
    try {
      for (const trade of trades) {
        const { error } = await supabase
          .from('trades')
          .upsert({
            id: trade.id,
            user_id: userId,
            system_id: trade.systemId,
            pair: trade.pair,
            date: trade.date,
            entry_time: trade.entryTime,
            exit_time: trade.exitTime,
            sessions: trade.sessions,
            risk_percent: trade.riskPercent,
            risk_reward: trade.riskReward,
            result_r: trade.resultR,
            outcome: trade.outcome,
            rating: trade.rating,
            grade: trade.grade,
            screenshots: trade.screenshots,
            rules_followed: trade.rulesFollowed,
            custom_criteria: trade.customCriteria,
            rule_respect_score: trade.ruleRespectScore,
            rules_followed_count: trade.rulesFollowedCount,
            total_active_rules: trade.totalActiveRules,
            emotions: trade.emotions,
            reflection: trade.reflection,
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error('Error syncing trade:', error);
        }
      }
    } catch (err) {
      console.error('Error syncing trades:', err);
    }
  },

  // Load trades from Supabase
  async loadTrades(userId: string): Promise<Trade[]> {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map(t => ({
        id: t.id,
        systemId: t.system_id,
        pair: t.pair,
        date: t.date,
        entryTime: t.entry_time || '',
        exitTime: t.exit_time || '',
        sessions: t.sessions || [],
        pois: [] as any[], // POIs stored separately or not used
        riskPercent: t.risk_percent,
        riskReward: t.risk_reward,
        resultR: t.result_r,
        outcome: t.outcome,
        rating: t.rating || 3,
        grade: t.grade,
        screenshots: t.screenshots || [],
        rulesFollowed: t.rules_followed || {},
        customCriteria: t.custom_criteria || {},
        ruleRespectScore: t.rule_respect_score || 100,
        rulesFollowedCount: t.rules_followed_count || 0,
        totalActiveRules: t.total_active_rules || 0,
        emotions: t.emotions || [],
        reflection: t.reflection || {
          liquidityDraw: '',
          htfNarrative: '',
          mistakes: '',
        },
      }));
    } catch (err) {
      console.error('Error loading trades:', err);
      return [];
    }
  },

  // Full sync: Upload all local data to Supabase
  async uploadAllData(userId: string): Promise<void> {
    const settings = storage.getSettings();
    const trades = storage.getTrades();

    await this.syncSettings(userId, settings);
    await this.syncSystems(userId, settings.systems);
    await this.syncTrades(userId, trades);
  },

  // Full sync: Download all data from Supabase to localStorage
  async downloadAllData(userId: string): Promise<{ settings: UserSettings; trades: Trade[] } | null> {
    try {
      const [cloudSettings, systems, trades] = await Promise.all([
        this.loadSettings(userId),
        this.loadSystems(userId),
        this.loadTrades(userId),
      ]);

      if (cloudSettings) {
        const fullSettings: UserSettings = {
          ...cloudSettings,
          systems: systems,
        };

        // Save to localStorage
        storage.saveSettings(fullSettings);
        storage.saveTrades(trades);

        return { settings: fullSettings, trades };
      }

      return null;
    } catch (err) {
      console.error('Error downloading data:', err);
      return null;
    }
  },

  // Delete a trade from Supabase
  async deleteTrade(tradeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId);

      if (error) {
        console.error('Error deleting trade:', error);
      }
    } catch (err) {
      console.error('Error deleting trade:', err);
    }
  },

  // Delete a system from Supabase
  async deleteSystem(systemId: string): Promise<void> {
    try {
      // Rules and criteria will be cascade deleted
      const { error } = await supabase
        .from('trading_systems')
        .delete()
        .eq('id', systemId);

      if (error) {
        console.error('Error deleting system:', error);
      }
    } catch (err) {
      console.error('Error deleting system:', err);
    }
  },
};
