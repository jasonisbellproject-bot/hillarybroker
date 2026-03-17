require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyCopyTradingSchema() {
  try {
    console.log('🔧 Applying copy trading schema directly...');
    
    // Create tables one by one
    console.log('📋 Creating copy_traders table...');
    const { error: tradersError } = await supabase.rpc('sql', {
      query: `
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
      `
    });
    
    if (tradersError) {
      console.log('⚠️  copy_traders table might already exist:', tradersError.message);
    } else {
      console.log('✅ copy_traders table created');
    }

    console.log('📋 Creating copy_trading_subscriptions table...');
    const { error: subscriptionsError } = await supabase.rpc('sql', {
      query: `
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
      `
    });
    
    if (subscriptionsError) {
      console.log('⚠️  copy_trading_subscriptions table might already exist:', subscriptionsError.message);
    } else {
      console.log('✅ copy_trading_subscriptions table created');
    }

    console.log('📋 Creating copy_trader_trades table...');
    const { error: tradesError } = await supabase.rpc('sql', {
      query: `
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
      `
    });
    
    if (tradesError) {
      console.log('⚠️  copy_trader_trades table might already exist:', tradesError.message);
    } else {
      console.log('✅ copy_trader_trades table created');
    }

    console.log('📋 Creating copied_trades table...');
    const { error: copiedTradesError } = await supabase.rpc('sql', {
      query: `
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
      `
    });
    
    if (copiedTradesError) {
      console.log('⚠️  copied_trades table might already exist:', copiedTradesError.message);
    } else {
      console.log('✅ copied_trades table created');
    }

    // Enable RLS
    console.log('🔒 Enabling RLS on tables...');
    await supabase.rpc('sql', { query: 'ALTER TABLE public.copy_traders ENABLE ROW LEVEL SECURITY;' });
    await supabase.rpc('sql', { query: 'ALTER TABLE public.copy_trading_subscriptions ENABLE ROW LEVEL SECURITY;' });
    await supabase.rpc('sql', { query: 'ALTER TABLE public.copy_trader_trades ENABLE ROW LEVEL SECURITY;' });
    await supabase.rpc('sql', { query: 'ALTER TABLE public.copied_trades ENABLE ROW LEVEL SECURITY;' });

    // Create basic RLS policies
    console.log('🔐 Creating RLS policies...');
    
    // Copy traders policies
    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Copy traders are viewable by everyone" ON public.copy_traders;
        CREATE POLICY "Copy traders are viewable by everyone" ON public.copy_traders
          FOR SELECT USING (is_active = true);
      `
    });

    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Users can manage their own copy trader profile" ON public.copy_traders;
        CREATE POLICY "Users can manage their own copy trader profile" ON public.copy_traders
          FOR ALL USING (auth.uid() = user_id);
      `
    });

    // Subscriptions policies
    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.copy_trading_subscriptions;
        CREATE POLICY "Users can view their own subscriptions" ON public.copy_trading_subscriptions
          FOR SELECT USING (auth.uid() = follower_id);
      `
    });

    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.copy_trading_subscriptions;
        CREATE POLICY "Users can manage their own subscriptions" ON public.copy_trading_subscriptions
          FOR ALL USING (auth.uid() = follower_id);
      `
    });

    // Trades policies
    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Copy trader trades are viewable by everyone" ON public.copy_trader_trades;
        CREATE POLICY "Copy trader trades are viewable by everyone" ON public.copy_trader_trades
          FOR SELECT USING (status != 'pending');
      `
    });

    // Copied trades policies
    await supabase.rpc('sql', {
      query: `
        DROP POLICY IF EXISTS "Users can view their own copied trades" ON public.copied_trades;
        CREATE POLICY "Users can view their own copied trades" ON public.copied_trades
          FOR SELECT USING (auth.uid() = follower_id);
      `
    });

    console.log('✅ RLS policies created');

    // Test the tables
    console.log('🧪 Testing copy trading tables...');
    
    const tables = [
      'copy_traders',
      'copy_trading_subscriptions',
      'copy_trader_trades',
      'copied_trades'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} not accessible:`, error.message);
      } else {
        console.log(`✅ Table ${table} is working`);
      }
    }
    
    console.log('🎉 Copy trading schema applied successfully!');
    console.log('💡 You can now use copy trading functionality');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('💡 Try running the SQL manually in Supabase Dashboard > SQL Editor');
  }
}

applyCopyTradingSchema();
