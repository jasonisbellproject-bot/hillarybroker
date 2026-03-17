-- Enhanced Supabase Schema for Bitsparetron
-- Staking, Rewards, Referrals, and Withdrawal System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  total_earned DECIMAL(15,2) DEFAULT 0,
  total_staked DECIMAL(15,2) DEFAULT 0,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staking Pools
CREATE TABLE IF NOT EXISTS staking_pools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  min_stake DECIMAL(15,2) NOT NULL,
  max_stake DECIMAL(15,2) NOT NULL,
  apy DECIMAL(5,2) NOT NULL,
  lock_period INTEGER NOT NULL, -- in days
  total_staked DECIMAL(15,2) DEFAULT 0,
  max_capacity DECIMAL(15,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'coming_soon', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Stakes
CREATE TABLE IF NOT EXISTS user_stakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pool_id INTEGER REFERENCES staking_pools(id),
  amount DECIMAL(15,2) NOT NULL,
  apy DECIMAL(5,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lock_period INTEGER NOT NULL,
  total_rewards DECIMAL(15,2) DEFAULT 0,
  claimed_rewards DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards System
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('daily', 'staking', 'referral', 'achievement', 'bonus')),
  amount DECIMAL(15,2) NOT NULL,
  source TEXT, -- 'login', 'stake_id', 'referral_id', etc.
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral System
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5), -- 1, 2, 3, 4, 5
  commission_earned DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL CHECK (method IN ('crypto', 'bank', 'paypal', 'card')),
  wallet_address TEXT,
  bank_details JSONB, -- For bank transfers
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  processed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions (for deposits, withdrawals, rewards)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'reward', 'stake', 'unstake')),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  method TEXT,
  reference TEXT, -- External reference
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB, -- Additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment Plans (for future investment features)
CREATE TABLE IF NOT EXISTS investment_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  min_amount DECIMAL(15,2) NOT NULL,
  max_amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL, -- in days
  total_return DECIMAL(5,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments
CREATE TABLE IF NOT EXISTS investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES investment_plans(id),
  amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(15,2) NOT NULL,
  total_return DECIMAL(15,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_staking_pools_status ON staking_pools(status);
CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_status ON user_stakes(status);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Staking pools policies (public read, admin write)
CREATE POLICY "Anyone can view active staking pools" ON staking_pools
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage staking pools" ON staking_pools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- User stakes policies
CREATE POLICY "Users can view own stakes" ON user_stakes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON user_stakes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stakes" ON user_stakes
  FOR UPDATE USING (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Users can view own rewards" ON rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards" ON rewards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert rewards" ON rewards
  FOR INSERT WITH CHECK (true);

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals" ON withdrawals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage withdrawals" ON withdrawals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON transactions
  FOR INSERT WITH CHECK (true);

-- Investment plans policies (public read, admin write)
CREATE POLICY "Anyone can view active investment plans" ON investment_plans
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage investment plans" ON investment_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Investments policies
CREATE POLICY "Users can view own investments" ON investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Functions for automatic updates

-- Function to update user totals when stakes change
CREATE OR REPLACE FUNCTION update_user_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET total_staked = total_staked + NEW.amount
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE users 
    SET total_staked = total_staked - OLD.amount + NEW.amount
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users 
    SET total_staked = total_staked - OLD.amount
    WHERE id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for user stakes
CREATE TRIGGER update_user_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_stakes
  FOR EACH ROW EXECUTE FUNCTION update_user_totals();

-- Function to update pool totals when stakes change
CREATE OR REPLACE FUNCTION update_pool_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE staking_pools 
    SET total_staked = total_staked + NEW.amount
    WHERE id = NEW.pool_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE staking_pools 
    SET total_staked = total_staked - OLD.amount + NEW.amount
    WHERE id = NEW.pool_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE staking_pools 
    SET total_staked = total_staked - OLD.amount
    WHERE id = OLD.pool_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for staking pools
CREATE TRIGGER update_pool_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_stakes
  FOR EACH ROW EXECUTE FUNCTION update_pool_totals();

-- Function to update user earned totals when rewards change
CREATE OR REPLACE FUNCTION update_user_earned()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET total_earned = total_earned + NEW.amount
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'claimed' AND OLD.status != 'claimed' THEN
    UPDATE users 
    SET total_earned = total_earned + NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for rewards
CREATE TRIGGER update_user_earned_trigger
  AFTER INSERT OR UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_user_earned();

-- Insert sample data

-- Sample staking pools
INSERT INTO staking_pools (name, description, min_stake, max_stake, apy, lock_period, max_capacity, status) VALUES
('High Yield', 'Premium staking pool with maximum returns', 100, 10000, 25.0, 30, 5000000, 'active'),
('Flexible', 'Flexible staking with daily rewards', 50, 5000, 15.0, 7, 3000000, 'active'),
('Premium', 'Exclusive high-yield pool for large stakes', 500, 50000, 35.0, 90, 2000000, 'active'),
('Starter', 'Perfect for beginners', 25, 1000, 10.0, 1, 1500000, 'full'),
('VIP', 'Exclusive VIP pool with maximum returns', 1000, 100000, 50.0, 180, 1000000, 'coming_soon');

-- Sample investment plans
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_return, duration, total_return) VALUES
('Basic Plan', 'Entry-level investment plan', 100, 1000, 2.0, 30, 60.0),
('Standard Plan', 'Balanced risk and return', 500, 5000, 3.5, 60, 210.0),
('Premium Plan', 'High-yield investment option', 1000, 10000, 5.0, 90, 450.0);

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate staking rewards
CREATE OR REPLACE FUNCTION calculate_staking_rewards()
RETURNS void AS $$
DECLARE
  stake_record RECORD;
  days_elapsed INTEGER;
  daily_reward DECIMAL(15,2);
BEGIN
  FOR stake_record IN 
    SELECT * FROM user_stakes 
    WHERE status = 'active' AND end_date > NOW()
  LOOP
    -- Calculate days elapsed
    days_elapsed := EXTRACT(EPOCH FROM (NOW() - stake_record.start_date)) / 86400;
    
    -- Calculate daily reward
    daily_reward := stake_record.amount * (stake_record.apy / 100) / 365;
    
    -- Update total rewards
    UPDATE user_stakes 
    SET total_rewards = daily_reward * days_elapsed
    WHERE id = stake_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql; 