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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);

-- Add trigger for updated_at
CREATE TRIGGER update_wallet_addresses_updated_at 
    BEFORE UPDATE ON public.wallet_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample wallet addresses
INSERT INTO public.wallet_addresses (name, type, address, network, fee, min_amount, max_amount, processing_time, status, description, icon) VALUES
('Bitcoin Wallet', 'bitcoin', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Bitcoin', 0, 50, 50000, 'Instant', 'active', 'Deposit with Bitcoin', 'bitcoin'),
('Ethereum Wallet', 'ethereum', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Ethereum', 0, 50, 50000, 'Instant', 'active', 'Deposit with Ethereum', 'ethereum'),
('USDT TRC20', 'usdt', 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK', 'TRC20', 0, 50, 50000, 'Instant', 'active', 'Deposit with USDT (TRC20)', 'credit-card'),
('Bank Transfer', 'bank', 'Account: 1234567890, Bank: Example Bank', 'Bank Transfer', 0, 100, 100000, '1-3 business days', 'active', 'Direct bank transfer', 'credit-card'),
('PayPal', 'paypal', 'payments@bitsparetron.com', 'PayPal', 2.5, 10, 10000, 'Instant', 'active', 'PayPal payment', 'credit-card'); 