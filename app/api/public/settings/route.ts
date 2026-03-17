import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Create service client to bypass RLS for platform settings
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get platform settings
    const { data: platformSettings, error: settingsError } = await serviceSupabase
      .from('platform_settings')
      .select('min_withdrawal, max_withdrawal, daily_withdrawal_limit, withdrawal_fee, withdrawal_fee_percentage, maintenance_mode, min_deposit, max_deposit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Error fetching platform settings:', settingsError);
      // Return default settings if no settings found
      return NextResponse.json({
        min_withdrawal: 100,
        max_withdrawal: 25000,
        daily_withdrawal_limit: 10000,
        withdrawal_fee: 5,
        withdrawal_fee_percentage: 30.00,
        maintenance_mode: false,
        min_deposit: 50,
        max_deposit: 50000
      });
    }

    return NextResponse.json(platformSettings);
  } catch (error) {
    console.error('Error in public settings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 