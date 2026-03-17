import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPlatformSettingsRLS() {
  console.log('🔧 Fixing Platform Settings RLS Policies...\n');

  try {
    console.log('📋 Testing current platform settings access...');
    
    // Test current access
    const { data: currentSettings, error: currentError } = await supabase
      .from('platform_settings')
      .select('min_deposit, max_deposit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (currentError) {
      console.log('❌ Current access test failed:', currentError.message);
      console.log('This confirms the RLS policy issue.');
    } else {
      console.log('✅ Current access test successful (using service role)');
      console.log(`- Min Deposit: $${currentSettings.min_deposit}`);
      console.log(`- Max Deposit: $${currentSettings.max_deposit}`);
    }

    console.log('\n📋 Manual Fix Required:');
    console.log('The issue is that RLS policies are too restrictive for platform_settings.');
    console.log('Only admins can read platform settings, but deposit validation needs access.');
    console.log('\nTo fix this, run the following SQL in your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log('-- Drop existing restrictive policy');
    console.log('DROP POLICY IF EXISTS "Admins can view platform settings" ON public.platform_settings;');
    console.log('');
    console.log('-- Create new policy that allows all authenticated users to read');
    console.log('CREATE POLICY "Authenticated users can view platform settings" ON public.platform_settings');
    console.log('    FOR SELECT USING (auth.uid() IS NOT NULL);');
    console.log('='.repeat(60));
    
    console.log('\n📋 After applying the SQL fix:');
    console.log('1. The deposit page should work correctly');
    console.log('2. Users will be able to read platform settings for validation');
    console.log('3. Only admins can still update/insert settings');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixPlatformSettingsRLS(); 