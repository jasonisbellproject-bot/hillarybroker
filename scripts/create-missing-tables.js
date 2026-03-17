const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMissingTables() {
  try {
    console.log('🚀 Creating missing tables for admin panel...');

    // Create staking_pools table
    console.log('🏦 Creating staking_pools table...');
    const { error: poolsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    if (poolsError) console.log('⚠️  staking_pools table issue:', poolsError.message);
    else console.log('✅ Created staking_pools table');

    // Create user_stakes table
    console.log('🔒 Creating user_stakes table...');
    const { error: stakesError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    if (stakesError) console.log('⚠️  user_stakes table issue:', stakesError.message);
    else console.log('✅ Created user_stakes table');

    // Create transactions table
    console.log('💳 Creating transactions table...');
    const { error: transactionsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    if (transactionsError) console.log('⚠️  transactions table issue:', transactionsError.message);
    else console.log('✅ Created transactions table');

    // Create rewards table
    console.log('🎁 Creating rewards table...');
    const { error: rewardsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    if (rewardsError) console.log('⚠️  rewards table issue:', rewardsError.message);
    else console.log('✅ Created rewards table');

    // Create notifications table
    console.log('🔔 Creating notifications table...');
    const { error: notificationsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    if (notificationsError) console.log('⚠️  notifications table issue:', notificationsError.message);
    else console.log('✅ Created notifications table');

    // Update users table with missing columns
    console.log('👥 Updating users table...');
    const { error: usersUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
        ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(15,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_earned DECIMAL(15,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_staked DECIMAL(15,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS referred_by TEXT,
        ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE;
      `
    });
    if (usersUpdateError) console.log('⚠️  users table update issue:', usersUpdateError.message);
    else console.log('✅ Updated users table');

    // Update withdrawals table with missing columns
    console.log('💸 Updating withdrawals table...');
    const { error: withdrawalsUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.withdrawals 
        ADD COLUMN IF NOT EXISTS method TEXT CHECK (method IN ('bank', 'crypto', 'paypal', 'card')),
        ADD COLUMN IF NOT EXISTS reference TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS wallet_address TEXT,
        ADD COLUMN IF NOT EXISTS bank_details JSONB,
        ADD COLUMN IF NOT EXISTS admin_notes TEXT,
        ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS processed_by TEXT;
      `
    });
    if (withdrawalsUpdateError) console.log('⚠️  withdrawals table update issue:', withdrawalsUpdateError.message);
    else console.log('✅ Updated withdrawals table');

    // Create indexes
    console.log('📊 Creating indexes...');
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_staking_pools_status ON public.staking_pools(status);
        CREATE INDEX IF NOT EXISTS idx_user_stakes_user_id ON public.user_stakes(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_stakes_pool_id ON public.user_stakes(pool_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
        CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
      `
    });
    if (indexesError) console.log('⚠️  indexes issue:', indexesError.message);
    else console.log('✅ Created indexes');

    console.log('🎉 All tables created successfully!');
    console.log('📊 Database is now ready for admin panel data');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

createMissingTables(); 