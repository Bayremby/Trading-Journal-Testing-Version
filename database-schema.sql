-- ============================================
-- TRADING JOURNAL DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  default_risk DECIMAL(5,2) DEFAULT 0.5,
  pairs TEXT[] DEFAULT ARRAY['EURUSD', 'GBPUSD', 'NASDAQ', 'ES', 'GOLD', 'USDJPY'],
  sessions TEXT[] DEFAULT ARRAY['London', 'New York', 'Pre-NY', 'Asia'],
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRADING SYSTEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trading_systems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SYSTEM RULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  system_id UUID REFERENCES trading_systems(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SYSTEM CRITERIA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_criteria (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  system_id UUID REFERENCES trading_systems(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Question', 'Checklist', 'Multi-select')),
  title TEXT NOT NULL,
  response TEXT,
  options TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRADES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  system_id UUID REFERENCES trading_systems(id) ON DELETE SET NULL,
  pair TEXT NOT NULL,
  date DATE NOT NULL,
  entry_time TEXT,
  exit_time TEXT,
  sessions TEXT[],
  risk_percent DECIMAL(5,2),
  risk_reward DECIMAL(5,2),
  result_r DECIMAL(10,2),
  outcome TEXT CHECK (outcome IN ('Win', 'Loss', 'BE')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  grade TEXT CHECK (grade IN ('A+', 'A', 'B', 'C')),
  screenshots TEXT[],
  rules_followed JSONB DEFAULT '{}',
  custom_criteria JSONB DEFAULT '{}',
  rule_respect_score DECIMAL(5,2) DEFAULT 100,
  rules_followed_count INTEGER DEFAULT 0,
  total_active_rules INTEGER DEFAULT 0,
  emotions TEXT[],
  reflection JSONB DEFAULT '{"liquidityDraw": "", "htfNarrative": "", "mistakes": "", "whatWentWell": "", "lesson": ""}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- User Settings Policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Trading Systems Policies
CREATE POLICY "Users can view own systems" ON trading_systems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own systems" ON trading_systems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own systems" ON trading_systems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own systems" ON trading_systems
  FOR DELETE USING (auth.uid() = user_id);

-- System Rules Policies
CREATE POLICY "Users can view own system rules" ON system_rules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_rules.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own system rules" ON system_rules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_rules.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own system rules" ON system_rules
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_rules.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own system rules" ON system_rules
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_rules.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

-- System Criteria Policies
CREATE POLICY "Users can view own system criteria" ON system_criteria
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_criteria.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own system criteria" ON system_criteria
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_criteria.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own system criteria" ON system_criteria
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_criteria.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own system criteria" ON system_criteria
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM trading_systems 
      WHERE trading_systems.id = system_criteria.system_id 
      AND trading_systems.user_id = auth.uid()
    )
  );

-- Trades Policies
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);
CREATE INDEX IF NOT EXISTS idx_trades_system_id ON trades(system_id);
CREATE INDEX IF NOT EXISTS idx_trading_systems_user_id ON trading_systems(user_id);
CREATE INDEX IF NOT EXISTS idx_system_rules_system_id ON system_rules(system_id);
CREATE INDEX IF NOT EXISTS idx_system_criteria_system_id ON system_criteria(system_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_systems_updated_at
  BEFORE UPDATE ON trading_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
