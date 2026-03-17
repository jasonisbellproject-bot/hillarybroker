-- Complete Supabase Schema for BitSpareTron Platform
-- Note: JWT secret is automatically managed by Supabase

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    kyc_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    wallet_balance DECIMAL(15,2) DEFAULT 0,
    total_earned DECIMAL(15,2) DEFAULT 0,
    total_staked DECIMAL(15,2) DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking_pools table
CREATE TABLE IF NOT EXISTS public.staking_pools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    apy DECIMAL(5,2) NOT NULL,
    min_stake DECIMAL(15,2) NOT NULL,
    max_stake DECIMAL(15,2) NOT NULL,
    lock_period INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
    features TEXT[] DEFAULT '{}',
    rewards_distributed DECIMAL(15,2) DEFAULT 0,
    total_rewards DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stakes table
CREATE TABLE IF NOT EXISTS public.user_stakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    pool_id INTEGER REFERENCES public.staking_pools(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    apy DECIMAL(5,2) NOT NULL,
    lock_period INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    rewards_earned DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_hash TEXT,
    reference TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('bank', 'crypto', 'paypal', 'card')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'completed')),
    reference TEXT UNIQUE,
    wallet_address TEXT,
    bank_details JSONB,
    admin_notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investment_plans table
CREATE TABLE IF NOT EXISTS public.investment_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    total_return DECIMAL(5,2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'limited')),
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    plan_id INTEGER REFERENCES public.investment_plans(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(15,2) NOT NULL,
    total_return DECIMAL(15,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'reward', 'withdrawal_approved', 'withdrawal_rejected')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    method TEXT,
    reference TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('staking', 'referral', 'bonus', 'promotion')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kyc_documents table
CREATE TABLE IF NOT EXISTS public.kyc_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
    document_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_addresses table for admin-managed deposit options
CREATE TABLE IF NOT EXISTS public.wallet_addresses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bitcoin', 'ethereum', 'usdt', 'bank', 'paypal')),
    address TEXT NOT NULL,
    network TEXT,
    fee DECIMAL(5,2) DEFAULT 0,
    min_amount DECIMAL(15,2) DEFAULT 0,
    max_amount DECIMAL(15,2) DEFAULT 999999,
    processing_time TEXT DEFAULT 'Instant',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    description TEXT,
    icon TEXT DEFAULT 'wallet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);

CREATE INDEX IF NOT EXISTS idx_staking_pools_status ON public.staking_pools(status);
CREATE INDEX IF NOT EXISTS idx_staking_pools_apy ON public.staking_pools(apy);

CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON public.user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id ON public.user_stakes(pool_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_status ON public.user_stakes(status);

CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_reference ON public.deposits(reference);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_reference ON public.withdrawals(reference);

CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON public.rewards(type);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON public.rewards(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON public.kyc_documents(status);

CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Staking pools are public for reading
CREATE POLICY "Anyone can view staking pools" ON public.staking_pools
    FOR SELECT USING (true);

-- User stakes policies
CREATE POLICY "Users can view own stakes" ON public.user_stakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON public.user_stakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deposits policies
CREATE POLICY "Users can view own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits" ON public.deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments policies
CREATE POLICY "Users can view own investments" ON public.investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON public.investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investment plans are public for reading
CREATE POLICY "Anyone can view investment plans" ON public.investment_plans
    FOR SELECT USING (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Users can view own rewards" ON public.rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards" ON public.rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- KYC documents policies
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC documents" ON public.kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet addresses are public for reading (users need to see available deposit options)
CREATE POLICY "Anyone can view wallet addresses" ON public.wallet_addresses
    FOR SELECT USING (true);

-- Insert default investment plans
INSERT INTO public.investment_plans (name, description, min_amount, max_amount, daily_return, duration, total_return, status, features) VALUES
('Starter Plan', 'Perfect for beginners with low risk and steady returns', 100, 999, 2.5, 30, 175, 'active', ARRAY['Low Risk', 'Daily Payouts', '30-Day Duration']),
('Professional Plan', 'Balanced risk and reward for experienced investors', 1000, 4999, 3.5, 45, 257.5, 'active', ARRAY['Medium Risk', 'Weekly Payouts', '45-Day Duration']),
('Premium Plan', 'High returns for serious investors', 5000, 19999, 4.5, 60, 370, 'active', ARRAY['High Returns', 'Compound Interest', '60-Day Duration']),
('VIP Plan', 'Maximum returns for VIP members', 20000, 50000, 6.0, 90, 640, 'limited', ARRAY['Maximum Returns', 'Priority Support', '90-Day Duration'])
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staking_pools_updated_at BEFORE UPDATE ON public.staking_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stakes_updated_at BEFORE UPDATE ON public.user_stakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at BEFORE UPDATE ON public.deposits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON public.withdrawals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON public.investment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_addresses_updated_at BEFORE UPDATE ON public.wallet_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample wallet addresses
INSERT INTO public.wallet_addresses (name, type, address, network, fee, min_amount, max_amount, processing_time, status, description, icon) VALUES
('Bitcoin Wallet', 'bitcoin', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Bitcoin', 0, 50, 50000, 'Instant', 'active', 'Deposit with Bitcoin', 'bitcoin'),
('Ethereum Wallet', 'ethereum', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Ethereum', 0, 50, 50000, 'Instant', 'active', 'Deposit with Ethereum', 'ethereum'),
('USDT TRC20', 'usdt', 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK', 'TRC20', 0, 50, 50000, 'Instant', 'active', 'Deposit with USDT (TRC20)', 'credit-card'),
('Bank Transfer', 'bank', 'Account: 1234567890, Bank: Example Bank', 'Bank Transfer', 0, 100, 100000, '1-3 business days', 'active', 'Direct bank transfer', 'credit-card'),
('PayPal', 'paypal', 'payments@bitsparetron.com', 'PayPal', 2.5, 10, 10000, 'Instant', 'active', 'PayPal payment', 'credit-card')
ON CONFLICT DO NOTHING; 

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    commission_earned DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_name TEXT NOT NULL DEFAULT 'NorthStarRock',
    platform_url TEXT NOT NULL DEFAULT 'https://northstarrock.net',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    registration_enabled BOOLEAN DEFAULT TRUE,
    min_deposit DECIMAL(15,2) DEFAULT 50.00,
    max_deposit DECIMAL(15,2) DEFAULT 50000.00,
    min_withdrawal DECIMAL(15,2) DEFAULT 100.00,
    max_withdrawal DECIMAL(15,2) DEFAULT 25000.00,
    withdrawal_fee DECIMAL(15,2) DEFAULT 5.00,
    withdrawal_fee_percentage DECIMAL(5,2) DEFAULT 30.00,
    daily_withdrawal_limit DECIMAL(15,2) DEFAULT 10000.00,
    two_factor_required BOOLEAN DEFAULT TRUE,
    kyc_required BOOLEAN DEFAULT TRUE,
    session_timeout INTEGER DEFAULT 30,
    max_login_attempts INTEGER DEFAULT 5,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    default_investment_plan TEXT DEFAULT 'starter',
    max_active_investments INTEGER DEFAULT 10,
    auto_reinvest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    total_deposits DECIMAL(15,2) DEFAULT 0,
    total_withdrawals DECIMAL(15,2) DEFAULT 0,
    total_investments DECIMAL(15,2) DEFAULT 0,
    total_staked DECIMAL(15,2) DEFAULT 0,
    total_referral_earnings DECIMAL(15,2) DEFAULT 0,
    referral_count INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.copy_traders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    total_followers INTEGER DEFAULT 0,
    total_copied_trades INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    min_copy_amount DECIMAL(10,2) DEFAULT 10.00,
    max_copy_amount DECIMAL(10,2) DEFAULT 10000.00,
    copy_fee_percentage DECIMAL(5,2) DEFAULT 5.00,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copy_trader_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copy_trader_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    trade_type VARCHAR(20) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    asset_symbol VARCHAR(20),
    asset_name VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    price DECIMAL(15,2),
    total_value DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    profit_loss DECIMAL(15,2) DEFAULT 0.00,
    trade_notes TEXT,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copy_trading_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    copy_percentage DECIMAL(5,2) DEFAULT 100.00,
    max_amount_per_trade DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    auto_copy BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, trader_id)
);

CREATE TABLE IF NOT EXISTS public.copied_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID REFERENCES public.copy_trading_subscriptions(id) ON DELETE CASCADE,
    original_trade_id UUID REFERENCES public.copy_trader_trades(id) ON DELETE CASCADE,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    trade_type VARCHAR(20) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    asset_symbol VARCHAR(20),
    asset_name VARCHAR(100),
    original_amount DECIMAL(15,2) NOT NULL,
    copied_amount DECIMAL(15,2) NOT NULL,
    copy_percentage DECIMAL(5,2) NOT NULL,
    price DECIMAL(15,2),
    total_value DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    profit_loss DECIMAL(15,2) DEFAULT 0.00,
    copy_fee DECIMAL(10,2) DEFAULT 0.00,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copy_trading_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL,
    total_copied_trades INTEGER DEFAULT 0,
    successful_copies INTEGER DEFAULT 0,
    failed_copies INTEGER DEFAULT 0,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    total_fees_paid DECIMAL(10,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copy_trading_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.copy_trading_settings (setting_key, setting_value, description) VALUES
('min_trader_balance', '1000', 'Minimum balance required to become a copy trader'),
('max_followers_per_trader', '1000', 'Maximum number of followers per trader'),
('default_copy_fee', '5.00', 'Default copy trading fee percentage'),
('min_copy_amount', '10.00', 'Minimum amount for copy trading'),
('max_copy_amount', '10000.00', 'Maximum amount for copy trading'),
('auto_copy_delay', '30', 'Delay in seconds before auto-copying trades'),
('profit_sharing_enabled', 'true', 'Enable profit sharing with copy traders'),
('risk_management_enabled', 'true', 'Enable risk management features')
ON CONFLICT (setting_key) DO NOTHING;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trader_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trader_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copied_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_settings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);

CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);

CREATE INDEX IF NOT EXISTS idx_financial_stats_user_id ON public.financial_stats(user_id);

CREATE INDEX IF NOT EXISTS idx_copy_traders_user_id ON public.copy_traders(user_id);
CREATE INDEX IF NOT EXISTS idx_copy_traders_active ON public.copy_traders(is_active);
CREATE INDEX IF NOT EXISTS idx_copy_trader_trades_trader_id ON public.copy_trader_trades(trader_id);
CREATE INDEX IF NOT EXISTS idx_copy_trader_trades_status ON public.copy_trader_trades(status);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_follower ON public.copy_trading_subscriptions(follower_id);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_trader ON public.copy_trading_subscriptions(trader_id);
CREATE INDEX IF NOT EXISTS idx_copied_trades_follower ON public.copied_trades(follower_id);
CREATE INDEX IF NOT EXISTS idx_copied_trades_trader ON public.copied_trades(trader_id);

ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS source TEXT;

UPDATE public.rewards
SET source = 'signup'
WHERE type = 'bonus' AND source IS NULL;

UPDATE public.rewards
SET source = 'referral_bonus'
WHERE type = 'referral' AND source IS NULL;

ALTER TABLE public.platform_settings
ADD COLUMN IF NOT EXISTS withdrawal_fee_percentage DECIMAL(5,2) DEFAULT 30.00;

UPDATE public.platform_settings
SET withdrawal_fee_percentage = 30.00
WHERE withdrawal_fee_percentage IS NULL;

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.users u
        WHERE u.id = user_id AND u.is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;

CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin can update all users" ON public.users
    FOR UPDATE USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Service role full access" ON public.users
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage staking pools" ON public.staking_pools;
CREATE POLICY "Admins can manage staking pools" ON public.staking_pools
    FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all deposits" ON public.deposits;
DROP POLICY IF EXISTS "Admins can update deposits" ON public.deposits;
CREATE POLICY "Admins can view all deposits" ON public.deposits
    FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can update deposits" ON public.deposits
    FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals
    FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can update withdrawals" ON public.withdrawals
    FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all investments" ON public.investments;
CREATE POLICY "Admins can view all investments" ON public.investments
    FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can update KYC documents" ON public.kyc_documents;
CREATE POLICY "Admins can view all KYC documents" ON public.kyc_documents
    FOR SELECT USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can update KYC documents" ON public.kyc_documents
    FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage wallet addresses" ON public.wallet_addresses;
CREATE POLICY "Admins can manage wallet addresses" ON public.wallet_addresses
    FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can view platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can manage platform settings" ON public.platform_settings;
CREATE POLICY "Authenticated users can view platform settings" ON public.platform_settings
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage platform settings" ON public.platform_settings
    FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Users can view own financial stats" ON public.financial_stats;
DROP POLICY IF EXISTS "Admins can manage financial stats" ON public.financial_stats;
CREATE POLICY "Users can view own financial stats" ON public.financial_stats
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage financial stats" ON public.financial_stats
    FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert own referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can insert own referrals" ON public.referrals
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Copy traders are viewable by everyone" ON public.copy_traders;
DROP POLICY IF EXISTS "Users can manage their own copy trader profile" ON public.copy_traders;
DROP POLICY IF EXISTS "Copy trader performance is viewable by everyone" ON public.copy_trader_performance;
DROP POLICY IF EXISTS "Copy trader trades are viewable by everyone" ON public.copy_trader_trades;
DROP POLICY IF EXISTS "Traders can manage their own trades" ON public.copy_trader_trades;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.copy_trading_subscriptions;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.copy_trading_subscriptions;
DROP POLICY IF EXISTS "Users can view their own copied trades" ON public.copied_trades;
DROP POLICY IF EXISTS "Users can manage their own copied trades" ON public.copied_trades;
DROP POLICY IF EXISTS "Copy trading analytics are viewable by users" ON public.copy_trading_analytics;
DROP POLICY IF EXISTS "Copy trading settings are viewable by everyone" ON public.copy_trading_settings;
DROP POLICY IF EXISTS "Admins can manage copy trading settings" ON public.copy_trading_settings;

CREATE POLICY "Copy traders are viewable by everyone" ON public.copy_traders
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own copy trader profile" ON public.copy_traders
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Copy trader performance is viewable by everyone" ON public.copy_trader_performance
    FOR SELECT USING (true);

CREATE POLICY "Copy trader trades are viewable by everyone" ON public.copy_trader_trades
    FOR SELECT USING (status != 'pending');

CREATE POLICY "Traders can manage their own trades" ON public.copy_trader_trades
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.copy_traders WHERE id = trader_id))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM public.copy_traders WHERE id = trader_id));

CREATE POLICY "Users can view their own subscriptions" ON public.copy_trading_subscriptions
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can manage their own subscriptions" ON public.copy_trading_subscriptions
    FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can view their own copied trades" ON public.copied_trades
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can manage their own copied trades" ON public.copied_trades
    FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Copy trading analytics are viewable by users" ON public.copy_trading_analytics
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() IN (SELECT user_id FROM public.copy_traders WHERE id = trader_id));

CREATE POLICY "Copy trading settings are viewable by everyone" ON public.copy_trading_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage copy trading settings" ON public.copy_trading_settings
    FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

CREATE OR REPLACE FUNCTION update_trader_stats()
RETURNS TRIGGER AS $$
DECLARE
    trader_uuid UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        trader_uuid := OLD.trader_id;
    ELSE
        trader_uuid := NEW.trader_id;
    END IF;

    UPDATE public.copy_traders
    SET total_followers = (
        SELECT COUNT(*)
        FROM public.copy_trading_subscriptions
        WHERE trader_id = trader_uuid AND is_active = true
    )
    WHERE id = trader_uuid;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_trader_success_rate(trader_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_trades INTEGER;
    winning_trades INTEGER;
    success_rate DECIMAL(5,2);
BEGIN
    SELECT COUNT(*), COUNT(CASE WHEN profit_loss > 0 THEN 1 END)
    INTO total_trades, winning_trades
    FROM public.copy_trader_trades
    WHERE trader_id = trader_uuid AND status = 'executed';

    IF total_trades > 0 THEN
        success_rate := (winning_trades::DECIMAL / total_trades::DECIMAL) * 100;
    ELSE
        success_rate := 0;
    END IF;

    RETURN success_rate;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_copy_trade()
RETURNS TRIGGER AS $$
DECLARE
    subscription_record RECORD;
    copied_amount DECIMAL(15,2);
    copy_fee_percentage DECIMAL(10,2);
    copy_fee DECIMAL(10,2);
BEGIN
    IF NEW.status = 'executed' THEN
        FOR subscription_record IN
            SELECT *
            FROM public.copy_trading_subscriptions
            WHERE trader_id = NEW.trader_id AND is_active = true AND auto_copy = true
        LOOP
            copied_amount := NEW.amount * (subscription_record.copy_percentage / 100);

            IF subscription_record.max_amount_per_trade IS NOT NULL
               AND copied_amount > subscription_record.max_amount_per_trade THEN
                copied_amount := subscription_record.max_amount_per_trade;
            END IF;

            SELECT copy_fee_percentage
            INTO copy_fee_percentage
            FROM public.copy_traders
            WHERE id = NEW.trader_id;

            copy_fee := copied_amount * (COALESCE(copy_fee_percentage, 0) / 100);

            INSERT INTO public.copied_trades (
                subscription_id,
                original_trade_id,
                follower_id,
                trader_id,
                trade_type,
                asset_type,
                asset_symbol,
                asset_name,
                original_amount,
                copied_amount,
                copy_percentage,
                price,
                total_value,
                status,
                copy_fee,
                executed_at
            ) VALUES (
                subscription_record.id,
                NEW.id,
                subscription_record.follower_id,
                NEW.trader_id,
                NEW.trade_type,
                NEW.asset_type,
                NEW.asset_symbol,
                NEW.asset_name,
                NEW.amount,
                copied_amount,
                subscription_record.copy_percentage,
                NEW.price,
                copied_amount * COALESCE(NEW.price, 1),
                'executed',
                copy_fee,
                NOW()
            );
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_platform_settings_updated_at ON public.platform_settings;
CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_stats_updated_at ON public.financial_stats;
CREATE TRIGGER update_financial_stats_updated_at BEFORE UPDATE ON public.financial_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trader_stats_trigger ON public.copy_trading_subscriptions;
CREATE TRIGGER update_trader_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.copy_trading_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_trader_stats();

DROP TRIGGER IF EXISTS auto_copy_trade_trigger ON public.copy_trader_trades;
CREATE TRIGGER auto_copy_trade_trigger
    AFTER INSERT OR UPDATE ON public.copy_trader_trades
    FOR EACH ROW
    EXECUTE FUNCTION auto_copy_trade();
