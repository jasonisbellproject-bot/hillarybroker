-- Copy Trading Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create copy_traders table (traders who can be copied)
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

-- 2. Create copy_trader_performance table (track trader performance)
CREATE TABLE IF NOT EXISTS public.copy_trader_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    total_profit DECIMAL(15,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create copy_trader_trades table (trades made by copy traders)
CREATE TABLE IF NOT EXISTS public.copy_trader_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    trade_type VARCHAR(20) NOT NULL, -- 'buy', 'sell', 'stake', 'unstake'
    asset_type VARCHAR(50) NOT NULL, -- 'crypto', 'stock', 'forex', 'investment'
    asset_symbol VARCHAR(20),
    asset_name VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    price DECIMAL(15,2),
    total_value DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'executed', 'cancelled', 'failed'
    profit_loss DECIMAL(15,2) DEFAULT 0.00,
    trade_notes TEXT,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create copy_trading_subscriptions table (users following traders)
CREATE TABLE IF NOT EXISTS public.copy_trading_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    trader_id UUID REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    copy_percentage DECIMAL(5,2) DEFAULT 100.00, -- percentage of trader's trades to copy
    max_amount_per_trade DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    auto_copy BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, trader_id)
);

-- 5. Create copied_trades table (trades copied by followers)
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

-- 6. Create copy_trading_analytics table (analytics and reporting)
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

-- 7. Create copy_trading_settings table (platform settings)
CREATE TABLE IF NOT EXISTS public.copy_trading_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.copy_trading_settings (setting_key, setting_value, description) VALUES
('min_trader_balance', '1000', 'Minimum balance required to become a copy trader'),
('max_followers_per_trader', '1000', 'Maximum number of followers per trader'),
('default_copy_fee', '5.00', 'Default copy trading fee percentage'),
('min_copy_amount', '10.00', 'Minimum amount for copy trading'),
('max_copy_amount', '10000.00', 'Maximum amount for copy trading'),
('auto_copy_delay', '30', 'Delay in seconds before auto-copying trades'),
('profit_sharing_enabled', 'true', 'Enable profit sharing with copy traders'),
('risk_management_enabled', 'true', 'Enable risk management features');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_copy_traders_user_id ON public.copy_traders(user_id);
CREATE INDEX IF NOT EXISTS idx_copy_traders_active ON public.copy_traders(is_active);
CREATE INDEX IF NOT EXISTS idx_copy_trader_trades_trader_id ON public.copy_trader_trades(trader_id);
CREATE INDEX IF NOT EXISTS idx_copy_trader_trades_status ON public.copy_trader_trades(status);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_follower ON public.copy_trading_subscriptions(follower_id);
CREATE INDEX IF NOT EXISTS idx_copy_trading_subscriptions_trader ON public.copy_trading_subscriptions(trader_id);
CREATE INDEX IF NOT EXISTS idx_copied_trades_follower ON public.copied_trades(follower_id);
CREATE INDEX IF NOT EXISTS idx_copied_trades_trader ON public.copied_trades(trader_id);

-- Enable RLS
ALTER TABLE public.copy_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trader_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trader_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copied_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trading_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Copy traders are viewable by everyone" ON public.copy_traders
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own copy trader profile" ON public.copy_traders
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Copy trader performance is viewable by everyone" ON public.copy_trader_performance
    FOR SELECT USING (true);

CREATE POLICY "Copy trader trades are viewable by everyone" ON public.copy_trader_trades
    FOR SELECT USING (status != 'pending');

CREATE POLICY "Traders can manage their own trades" ON public.copy_trader_trades
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.copy_traders WHERE id = trader_id));

CREATE POLICY "Users can view their own subscriptions" ON public.copy_trading_subscriptions
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can manage their own subscriptions" ON public.copy_trading_subscriptions
    FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Users can view their own copied trades" ON public.copied_trades
    FOR SELECT USING (auth.uid() = follower_id);

CREATE POLICY "Users can manage their own copied trades" ON public.copied_trades
    FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Copy trading analytics are viewable by users" ON public.copy_trading_analytics
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() IN (SELECT user_id FROM public.copy_traders WHERE id = trader_id));

CREATE POLICY "Copy trading settings are viewable by everyone" ON public.copy_trading_settings
    FOR SELECT USING (true);

-- Create functions for copy trading logic
CREATE OR REPLACE FUNCTION update_trader_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update trader's total followers count
    UPDATE public.copy_traders 
    SET total_followers = (
        SELECT COUNT(*) 
        FROM public.copy_trading_subscriptions 
        WHERE trader_id = NEW.trader_id AND is_active = true
    )
    WHERE id = NEW.trader_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating trader stats
CREATE TRIGGER update_trader_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.copy_trading_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_trader_stats();

-- Function to calculate trader success rate
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

-- Function to auto-copy trades
CREATE OR REPLACE FUNCTION auto_copy_trade()
RETURNS TRIGGER AS $$
DECLARE
    subscription_record RECORD;
    copied_amount DECIMAL(15,2);
    copy_fee DECIMAL(10,2);
BEGIN
    -- Only auto-copy if the trade is executed
    IF NEW.status = 'executed' THEN
        -- Get all active subscriptions for this trader
        FOR subscription_record IN 
            SELECT * FROM public.copy_trading_subscriptions 
            WHERE trader_id = NEW.trader_id AND is_active = true AND auto_copy = true
        LOOP
            -- Calculate copied amount based on percentage
            copied_amount := NEW.amount * (subscription_record.copy_percentage / 100);
            
            -- Apply max amount limit if set
            IF subscription_record.max_amount_per_trade IS NOT NULL AND copied_amount > subscription_record.max_amount_per_trade THEN
                copied_amount := subscription_record.max_amount_per_trade;
            END IF;
            
            -- Calculate copy fee
            SELECT copy_fee_percentage INTO copy_fee FROM public.copy_traders WHERE id = NEW.trader_id;
            copy_fee := copied_amount * (copy_fee / 100);
            
            -- Insert copied trade
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

-- Create trigger for auto-copying trades
CREATE TRIGGER auto_copy_trade_trigger
    AFTER INSERT OR UPDATE ON public.copy_trader_trades
    FOR EACH ROW
    EXECUTE FUNCTION auto_copy_trade();

-- Success message
SELECT 'Copy trading schema created successfully!' as status;
