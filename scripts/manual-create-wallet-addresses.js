const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createWalletAddressesTable() {
  try {
    console.log('🔧 Creating wallet addresses table manually...')

    // First, let's try to create the table using the SQL editor approach
    console.log('📋 Creating table structure...')
    
    // We'll use the Supabase client to insert data directly
    // If the table doesn't exist, it will fail, but we can handle that
    console.log('💰 Adding sample wallet addresses...')
    
    const sampleData = [
      {
        name: 'Bitcoin Wallet',
        type: 'bitcoin',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        network: 'Bitcoin',
        fee: 0,
        min_amount: 50,
        max_amount: 50000,
        processing_time: 'Instant',
        status: 'active',
        description: 'Deposit with Bitcoin',
        icon: 'bitcoin'
      },
      {
        name: 'Ethereum Wallet',
        type: 'ethereum',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        network: 'Ethereum',
        fee: 0,
        min_amount: 50,
        max_amount: 50000,
        processing_time: 'Instant',
        status: 'active',
        description: 'Deposit with Ethereum',
        icon: 'ethereum'
      },
      {
        name: 'USDT TRC20',
        type: 'usdt',
        address: 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK',
        network: 'TRC20',
        fee: 0,
        min_amount: 50,
        max_amount: 50000,
        processing_time: 'Instant',
        status: 'active',
        description: 'Deposit with USDT (TRC20)',
        icon: 'credit-card'
      },
      {
        name: 'Bank Transfer',
        type: 'bank',
        address: 'Account: 1234567890, Bank: Example Bank',
        network: 'Bank Transfer',
        fee: 0,
        min_amount: 100,
        max_amount: 100000,
        processing_time: '1-3 business days',
        status: 'active',
        description: 'Direct bank transfer',
        icon: 'credit-card'
      },
      {
        name: 'PayPal',
        type: 'paypal',
        address: 'payments@bitsparetron.com',
        network: 'PayPal',
        fee: 2.5,
        min_amount: 10,
        max_amount: 10000,
        processing_time: 'Instant',
        status: 'active',
        description: 'PayPal payment',
        icon: 'credit-card'
      }
    ]

    const { data, error } = await supabase
      .from('wallet_addresses')
      .insert(sampleData)
      .select()

    if (error) {
      console.error('❌ Error inserting wallet addresses:', error)
      console.log('\n📋 Manual Setup Required:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run the following SQL:')
      console.log(`
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);

-- Enable RLS
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Anyone can view wallet addresses" ON public.wallet_addresses
    FOR SELECT USING (true);

-- Insert sample data
INSERT INTO public.wallet_addresses (name, type, address, network, fee, min_amount, max_amount, processing_time, status, description, icon) VALUES
('Bitcoin Wallet', 'bitcoin', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Bitcoin', 0, 50, 50000, 'Instant', 'active', 'Deposit with Bitcoin', 'bitcoin'),
('Ethereum Wallet', 'ethereum', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Ethereum', 0, 50, 50000, 'Instant', 'active', 'Deposit with Ethereum', 'ethereum'),
('USDT TRC20', 'usdt', 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK', 'TRC20', 0, 50, 50000, 'Instant', 'active', 'Deposit with USDT (TRC20)', 'credit-card'),
('Bank Transfer', 'bank', 'Account: 1234567890, Bank: Example Bank', 'Bank Transfer', 0, 100, 100000, '1-3 business days', 'active', 'Direct bank transfer', 'credit-card'),
('PayPal', 'paypal', 'payments@bitsparetron.com', 'PayPal', 2.5, 10, 10000, 'Instant', 'active', 'PayPal payment', 'credit-card');
      `)
      console.log('\n4. After running the SQL, try this script again')
    } else {
      console.log('✅ Sample wallet addresses added successfully!')
      console.log('   - Bitcoin Wallet')
      console.log('   - Ethereum Wallet')
      console.log('   - USDT TRC20')
      console.log('   - Bank Transfer')
      console.log('   - PayPal')
      console.log('\n🎉 Wallet addresses are now ready for use!')
    }

  } catch (error) {
    console.error('❌ Error creating wallet addresses:', error)
  }
}

createWalletAddressesTable() 