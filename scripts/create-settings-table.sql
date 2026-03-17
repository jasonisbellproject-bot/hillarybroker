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

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_platform_settings_updated_at 
    BEFORE UPDATE ON public.platform_settings
    FOR EACH ROW EXECUTE FUNCTION update_platform_settings_updated_at();

-- Insert default settings if table is empty
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