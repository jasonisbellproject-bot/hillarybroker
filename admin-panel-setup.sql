-- Complete Admin Panel Setup for BitSpareTron Platform
-- Run this in Supabase SQL Editor

-- =====================================================
-- CREATE MISSING TABLES
-- =====================================================

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

-- =====================================================
-- UPDATE EXISTING TABLES
-- =====================================================

-- Update users table with missing columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_staked DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE;

-- Update withdrawals table with missing columns
ALTER TABLE public.withdrawals 
ADD COLUMN IF NOT EXISTS method TEXT CHECK (method IN ('bank', 'crypto', 'paypal', 'card')),
ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS bank_details JSONB,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS processed_by TEXT;

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_staking_pools_status ON public.staking_pools(status);
CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON public.user_stakes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id ON public.user_stakes(pool_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Staking pools are public for reading
CREATE POLICY "Anyone can view staking pools" ON public.staking_pools
    FOR SELECT USING (true);

-- User stakes policies
CREATE POLICY "Users can view own stakes" ON public.user_stakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stakes" ON public.user_stakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert sample staking pools
INSERT INTO public.staking_pools (name, description, apy, min_stake, max_stake, lock_period, status, features) VALUES
('Flexible Staking', 'Earn rewards with no lock period', 8.5, 100, 10000, 0, 'active', ARRAY['No Lock Period', 'Daily Rewards', 'Flexible Withdrawal']),
('Fixed Staking', 'Higher returns with 30-day lock', 12.0, 500, 50000, 30, 'active', ARRAY['30-Day Lock', 'Higher APY', 'Compound Interest']),
('Premium Staking', 'Maximum returns with 90-day lock', 18.0, 1000, 100000, 90, 'active', ARRAY['90-Day Lock', 'Maximum APY', 'VIP Benefits']),
('Trial Pool', 'Low minimum for new users', 5.0, 50, 500, 0, 'active', ARRAY['Low Minimum', 'Perfect for Beginners', 'No Lock Period'])
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (you'll need to replace these with actual user IDs from your auth.users table)
-- First, let's get some actual user IDs
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    user4_id UUID;
    user5_id UUID;
BEGIN
    -- Get existing user IDs or create placeholder ones
    SELECT id INTO user1_id FROM auth.users LIMIT 1;
    IF user1_id IS NULL THEN
        user1_id := gen_random_uuid();
    END IF;
    
    -- Create additional sample users if needed
    user2_id := gen_random_uuid();
    user3_id := gen_random_uuid();
    user4_id := gen_random_uuid();
    user5_id := gen_random_uuid();

    -- Insert sample users into public.users
    INSERT INTO public.users (id, email, first_name, last_name, status, wallet_balance, total_earned, total_staked, referral_code) VALUES
    (user1_id, 'john.doe@example.com', 'John', 'Doe', 'active', 2500.00, 1250.00, 5000.00, 'JOHN001'),
    (user2_id, 'jane.smith@example.com', 'Jane', 'Smith', 'active', 1800.00, 900.00, 3000.00, 'JANE002'),
    (user3_id, 'mike.wilson@example.com', 'Mike', 'Wilson', 'active', 3200.00, 1600.00, 7500.00, 'MIKE003'),
    (user4_id, 'sarah.jones@example.com', 'Sarah', 'Jones', 'pending', 500.00, 250.00, 1000.00, 'SARAH004'),
    (user5_id, 'david.brown@example.com', 'David', 'Brown', 'suspended', 0.00, 0.00, 0.00, 'DAVID005')
    ON CONFLICT (id) DO NOTHING;

    -- Insert sample user stakes
    INSERT INTO public.user_stakes (user_id, pool_id, amount, apy, lock_period, status, rewards_earned) VALUES
    (user1_id, 1, 2000.00, 8.5, 0, 'active', 85.00),
    (user1_id, 2, 3000.00, 12.0, 30, 'active', 180.00),
    (user2_id, 1, 1500.00, 8.5, 0, 'active', 63.75),
    (user3_id, 3, 5000.00, 18.0, 90, 'active', 450.00),
    (user4_id, 4, 500.00, 5.0, 0, 'active', 12.50)
    ON CONFLICT DO NOTHING;

    -- Insert sample withdrawals
    INSERT INTO public.withdrawals (user_id, amount, currency, method, status, reference, wallet_address) VALUES
    (user1_id, 500.00, 'USD', 'bank', 'pending', 'WD001', NULL),
    (user2_id, 300.00, 'USD', 'crypto', 'processing', 'WD002', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'),
    (user3_id, 1000.00, 'USD', 'paypal', 'approved', 'WD003', NULL),
    (user4_id, 200.00, 'USD', 'bank', 'rejected', 'WD004', NULL),
    (user5_id, 150.00, 'USD', 'crypto', 'pending', 'WD005', '0x1234567890abcdef1234567890abcdef12345678')
    ON CONFLICT DO NOTHING;

    -- Insert sample investments
    INSERT INTO public.investments (user_id, plan_id, amount, daily_return, total_return, end_date, status) VALUES
    (user1_id, 1, 1000.00, 25.00, 175.00, NOW() + INTERVAL '30 days', 'active'),
    (user2_id, 2, 2500.00, 87.50, 393.75, NOW() + INTERVAL '45 days', 'active'),
    (user3_id, 3, 5000.00, 225.00, 1350.00, NOW() + INTERVAL '60 days', 'active'),
    (user4_id, 1, 500.00, 12.50, 87.50, NOW() + INTERVAL '30 days', 'active')
    ON CONFLICT DO NOTHING;

    -- Insert sample transactions
    INSERT INTO public.transactions (user_id, type, amount, currency, method, reference, status) VALUES
    (user1_id, 'deposit', 1000.00, 'USD', 'bank', 'TXN001', 'completed'),
    (user1_id, 'reward', 85.00, 'USD', 'staking', 'TXN002', 'completed'),
    (user2_id, 'withdrawal', 300.00, 'USD', 'crypto', 'TXN003', 'processing'),
    (user3_id, 'investment', 5000.00, 'USD', 'wallet', 'TXN004', 'completed'),
    (user4_id, 'deposit', 500.00, 'USD', 'card', 'TXN005', 'completed')
    ON CONFLICT DO NOTHING;

    -- Insert sample rewards
    INSERT INTO public.rewards (user_id, type, amount, currency, description, status) VALUES
    (user1_id, 'staking', 85.00, 'USD', 'Flexible staking rewards', 'claimed'),
    (user2_id, 'referral', 50.00, 'USD', 'Referral bonus for new user', 'pending'),
    (user3_id, 'bonus', 100.00, 'USD', 'Welcome bonus', 'claimed'),
    (user4_id, 'promotion', 25.00, 'USD', 'First deposit bonus', 'pending'),
    (user5_id, 'staking', 0.00, 'USD', 'No rewards - suspended account', 'expired')
    ON CONFLICT DO NOTHING;

    -- Insert sample notifications
    INSERT INTO public.notifications (user_id, title, message, type) VALUES
    (user1_id, 'Staking Rewards', 'You earned $85.00 in staking rewards!', 'success'),
    (user2_id, 'Withdrawal Processing', 'Your withdrawal of $300.00 is being processed.', 'info'),
    (user3_id, 'Investment Active', 'Your $5000 investment is now active and earning.', 'success'),
    (user4_id, 'KYC Required', 'Please complete your KYC verification to continue.', 'warning'),
    (user5_id, 'Account Suspended', 'Your account has been suspended due to policy violation.', 'error')
    ON CONFLICT DO NOTHING;

END $$;

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
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
CREATE TRIGGER update_staking_pools_updated_at BEFORE UPDATE ON public.staking_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stakes_updated_at BEFORE UPDATE ON public.user_stakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 'Tables created successfully!' as status;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'staking_pools' as table_name, COUNT(*) as count FROM public.staking_pools
UNION ALL
SELECT 'user_stakes' as table_name, COUNT(*) as count FROM public.user_stakes
UNION ALL
SELECT 'withdrawals' as table_name, COUNT(*) as count FROM public.withdrawals
UNION ALL
SELECT 'investments' as table_name, COUNT(*) as count FROM public.investments
UNION ALL
SELECT 'transactions' as table_name, COUNT(*) as count FROM public.transactions
UNION ALL
SELECT 'rewards' as table_name, COUNT(*) as count FROM public.rewards
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as count FROM public.notifications; 