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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_financial_stats_user_id ON public.financial_stats(user_id);

-- Enable RLS
ALTER TABLE public.financial_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_financial_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_financial_stats_updated_at
    BEFORE UPDATE ON public.financial_stats
    FOR EACH ROW EXECUTE FUNCTION update_financial_stats_updated_at(); 