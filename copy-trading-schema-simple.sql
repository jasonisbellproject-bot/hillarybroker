-- Copy Trading Schema - Simplified Version
-- Run this in your Supabase SQL Editor

-- 1. Create copy_traders table
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

-- 2. Create copy_trading_subscriptions table
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

-- 3. Create copy_trader_trades table
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

-- 4. Create copied_trades table
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

-- Enable RLS
ALTER TABLE public.copy_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trader_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copied_trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Copy traders are viewable by everyone" ON public.copy_traders;
CREATE POLICY "Copy traders are viewable by everyone" ON public.copy_traders
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can manage their own copy trader profile" ON public.copy_traders;
CREATE POLICY "Users can manage their own copy trader profile" ON public.copy_traders
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.copy_trading_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.copy_trading_subscriptions
    FOR SELECT USING (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.copy_trading_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON public.copy_trading_subscriptions
    FOR ALL USING (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Copy trader trades are viewable by everyone" ON public.copy_trader_trades;
CREATE POLICY "Copy trader trades are viewable by everyone" ON public.copy_trader_trades
    FOR SELECT USING (status != 'pending');

DROP POLICY IF EXISTS "Users can view their own copied trades" ON public.copied_trades;
CREATE POLICY "Users can view their own copied trades" ON public.copied_trades
    FOR SELECT USING (auth.uid() = follower_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_copy_traders_user_id ON public.copy_traders(user_id);
CREATE INDEX IF NOT EXISTS idx_copy_traders_active ON public.copy_traders(is_active);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_follower ON public.copy_trading_subscriptions(follower_id);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_trader ON public.copy_trading_subscriptions(trader_id);
CREATE INDEX IF NOT EXISTS idx_copy_trader_trades_trader_id ON public.copy_trader_trades(trader_id);
CREATE INDEX IF NOT EXISTS idx_copied_trades_follower ON public.copied_trades(follower_id);

-- Success message
SELECT 'Copy trading schema created successfully!' as status;
