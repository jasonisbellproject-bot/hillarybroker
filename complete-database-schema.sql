-- Complete Database Schema for NorthStarRock Investment Platform
-- This file contains all tables, indexes, RLS policies, triggers, and sample data
-- Run this in Supabase SQL Editor to set up the complete database

-- =====================================================
-- ENABLE EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE ALL TABLES
-- =====================================================

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
    type TEXT NOT NULL CHECK (type IN ('staking', 'referral', 'bonus', 'promotion', 'daily', 'achievement')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    description TEXT,
    source TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    commission_earned DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Platform Settings
    platform_name TEXT NOT NULL DEFAULT 'NorthStarRock',
    platform_url TEXT NOT NULL DEFAULT 'https://northstarrock.net',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    registration_enabled BOOLEAN DEFAULT TRUE,
    
    -- Financial Settings
    min_deposit DECIMAL(15,2) DEFAULT 50.00,
    max_deposit DECIMAL(15,2) DEFAULT 50000.00,
    min_withdrawal DECIMAL(15,2) DEFAULT 100.00,
    max_withdrawal DECIMAL(15,2) DEFAULT 25000.00,
    withdrawal_fee DECIMAL(15,2) DEFAULT 5.00,
    withdrawal_fee_percentage DECIMAL(5,2) DEFAULT 30.00,
    daily_withdrawal_limit DECIMAL(15,2) DEFAULT 10000.00,
    
    -- Security Settings
    two_factor_required BOOLEAN DEFAULT TRUE,
    kyc_required BOOLEAN DEFAULT TRUE,
    session_timeout INTEGER DEFAULT 30,
    max_login_attempts INTEGER DEFAULT 5,
    
    -- Notification Settings
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    -- Investment Settings
    default_investment_plan TEXT DEFAULT 'starter',
    max_active_investments INTEGER DEFAULT 10,
    auto_reinvest BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_stats table to store calculated user financial data
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

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- Staking indexes
CREATE INDEX IF NOT EXISTS idx_staking_pools_status ON public.staking_pools(status);
CREATE INDEX IF NOT EXISTS idx_staking_pools_apy ON public.staking_pools(apy);
CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON public.user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id ON public.user_stakes(pool_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_status ON public.user_stakes(status);

-- Financial indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_reference ON public.deposits(reference);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_reference ON public.withdrawals(reference);

-- Investment indexes
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);
CREATE INDEX IF NOT EXISTS idx_investment_plans_status ON public.investment_plans(status);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Reward indexes
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON public.rewards(type);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON public.rewards(status);

-- Referral indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- KYC indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON public.kyc_documents(status);

-- Wallet addresses indexes
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);

-- Financial stats indexes
CREATE INDEX IF NOT EXISTS idx_financial_stats_user_id ON public.financial_stats(user_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Staking pools policies
CREATE POLICY "Anyone can view staking pools" ON public.staking_pools
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage staking pools" ON public.staking_pools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- User stakes policies
CREATE POLICY "Users can view own stakes" ON public.user_stakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON public.user_stakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all stakes" ON public.user_stakes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Deposits policies
CREATE POLICY "Users can view own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits" ON public.deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits" ON public.deposits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update deposits" ON public.deposits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Withdrawals policies
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update withdrawals" ON public.withdrawals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Investments policies
CREATE POLICY "Users can view own investments" ON public.investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON public.investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all investments" ON public.investments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Investment plans policies
CREATE POLICY "Anyone can view investment plans" ON public.investment_plans
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage investment plans" ON public.investment_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Rewards policies
CREATE POLICY "Users can view own rewards" ON public.rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards" ON public.rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all rewards" ON public.rewards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update rewards" ON public.rewards
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert own referrals" ON public.referrals
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals" ON public.referrals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- KYC documents policies
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC documents" ON public.kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC documents" ON public.kyc_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update KYC documents" ON public.kyc_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Wallet addresses policies
CREATE POLICY "Anyone can view wallet addresses" ON public.wallet_addresses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage wallet addresses" ON public.wallet_addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Platform settings policies
CREATE POLICY "Admins can view platform settings" ON public.platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

CREATE POLICY "Admins can update platform settings" ON public.platform_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

CREATE POLICY "Admins can insert platform settings" ON public.platform_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = TRUE
        )
    );

-- Financial stats policies
CREATE POLICY "Users can view own financial stats" ON public.financial_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all financial stats" ON public.financial_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update financial stats" ON public.financial_stats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- =====================================================
-- CREATE TRIGGERS AND FUNCTIONS
-- =====================================================

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

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_stats_updated_at BEFORE UPDATE ON public.financial_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert default investment plans
INSERT INTO public.investment_plans (name, description, min_amount, max_amount, daily_return, duration, total_return, status, features) VALUES
('Starter Plan', 'Perfect for beginners with low risk and steady returns', 100, 999, 2.5, 30, 175, 'active', ARRAY['Low Risk', 'Daily Payouts', '30-Day Duration']),
('Professional Plan', 'Balanced risk and reward for experienced investors', 1000, 4999, 3.5, 45, 257.5, 'active', ARRAY['Medium Risk', 'Weekly Payouts', '45-Day Duration']),
('Premium Plan', 'High returns for serious investors', 5000, 19999, 4.5, 60, 370, 'active', ARRAY['High Returns', 'Compound Interest', '60-Day Duration']),
('VIP Plan', 'Maximum returns for VIP members', 20000, 50000, 6.0, 90, 640, 'limited', ARRAY['Maximum Returns', 'Priority Support', '90-Day Duration'])
ON CONFLICT DO NOTHING;

-- Insert sample staking pools
INSERT INTO public.staking_pools (name, description, apy, min_stake, max_stake, lock_period, status, features) VALUES
('Flexible Staking', 'Stake and unstake anytime with competitive returns', 8.5, 100, 10000, 0, 'active', ARRAY['Flexible', 'No Lock Period', 'Daily Rewards']),
('30-Day Lock', 'Higher returns with 30-day commitment', 12.0, 500, 25000, 30, 'active', ARRAY['Fixed Term', 'Higher APY', 'Monthly Rewards']),
('90-Day Lock', 'Maximum returns with 90-day commitment', 18.0, 1000, 50000, 90, 'active', ARRAY['Long Term', 'Maximum APY', 'Quarterly Rewards'])
ON CONFLICT DO NOTHING;

-- Insert sample wallet addresses
INSERT INTO public.wallet_addresses (name, type, address, network, fee, min_amount, max_amount, processing_time, status, description, icon) VALUES
('Bitcoin Wallet', 'bitcoin', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Bitcoin', 0, 50, 50000, 'Instant', 'active', 'Deposit with Bitcoin', 'bitcoin'),
('Ethereum Wallet', 'ethereum', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Ethereum', 0, 50, 50000, 'Instant', 'active', 'Deposit with Ethereum', 'ethereum'),
('USDT TRC20', 'usdt', 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK', 'TRC20', 0, 50, 50000, 'Instant', 'active', 'Deposit with USDT (TRC20)', 'credit-card'),
('Bank Transfer', 'bank', 'Account: 1234567890, Bank: Example Bank', 'Bank Transfer', 0, 100, 100000, '1-3 business days', 'active', 'Direct bank transfer', 'credit-card'),
('PayPal', 'paypal', 'payments@northstarrock.net', 'PayPal', 2.5, 10, 10000, 'Instant', 'active', 'PayPal payment', 'credit-card')
ON CONFLICT DO NOTHING;

-- Insert default platform settings
INSERT INTO public.platform_settings (
    platform_name,
    platform_url,
    maintenance_mode,
    registration_enabled,
    min_deposit,
    max_deposit,
    min_withdrawal,
    max_withdrawal,
    withdrawal_fee,
    withdrawal_fee_percentage,
    daily_withdrawal_limit,
    two_factor_required,
    kyc_required,
    session_timeout,
    max_login_attempts,
    email_notifications,
    sms_notifications,
    push_notifications,
    default_investment_plan,
    max_active_investments,
    auto_reinvest
) VALUES (
    'NorthStarRock',
    'https://northstarrock.net',
    FALSE,
    TRUE,
    50.00,
    50000.00,
    100.00,
    25000.00,
    5.00,
    30.00,
    10000.00,
    TRUE,
    TRUE,
    30,
    5,
    TRUE,
    FALSE,
    TRUE,
    'starter',
    10,
    FALSE
) ON CONFLICT DO NOTHING;

-- =====================================================
-- ADD MISSING COLUMNS (FOR EXISTING DATABASES)
-- =====================================================

-- Add source column to rewards table if it doesn't exist
ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS source TEXT;

-- Add withdrawal_fee_percentage to platform_settings if it doesn't exist
ALTER TABLE public.platform_settings 
ADD COLUMN IF NOT EXISTS withdrawal_fee_percentage DECIMAL(5,2) DEFAULT 30.00;

-- Update existing records to have a default percentage if withdrawal_fee_percentage is NULL
UPDATE public.platform_settings 
SET withdrawal_fee_percentage = 30.00 
WHERE withdrawal_fee_percentage IS NULL;

-- Add comment to explain the new column
COMMENT ON COLUMN public.platform_settings.withdrawal_fee_percentage IS 'Withdrawal fee as percentage of user balance (e.g., 30.00 for 30%)';

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

-- This schema creates a complete investment platform database with:
-- - User management with KYC and admin roles
-- - Investment plans and user investments
-- - Staking pools and user stakes
-- - Deposit and withdrawal systems
-- - Transaction tracking
-- - Reward system with referral bonuses
-- - KYC document management
-- - Wallet address management for deposits
-- - Platform settings for admin configuration
-- - Financial statistics tracking
-- - Comprehensive RLS policies for security
-- - Automatic timestamp updates
-- - Sample data for immediate testing

-- The database is now ready for the NorthStarRock investment platform!
