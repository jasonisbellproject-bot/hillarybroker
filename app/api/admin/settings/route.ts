import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('Error fetching platform settings:', settingsError);
      // Return default settings if no settings found
      const defaultSettings = {
        // Platform Settings
        platform_name: "NorthStarRock",
        platform_url: "https://northstarrock.net",
        maintenance_mode: false,
        registration_enabled: true,

        // Financial Settings
        min_deposit: 50,
        max_deposit: 50000,
        min_withdrawal: 100,
        max_withdrawal: 25000,
        withdrawal_fee: 5,
        withdrawal_fee_percentage: 30.00,
        daily_withdrawal_limit: 10000,

        // Security Settings
        two_factor_required: true,
        kyc_required: true,
        session_timeout: 30,
        max_login_attempts: 5,

        // Notification Settings
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,

        // Investment Settings
        default_investment_plan: "starter",
        max_active_investments: 10,
        auto_reinvest: false,
      };
      
      return NextResponse.json({
        settings: defaultSettings
      });
    }

    return NextResponse.json({
      settings: platformSettings
    });
  } catch (error) {
    console.error('Error in settings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()

    // Create service client to bypass RLS for platform settings
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validate required fields
    if (!settings.platform_name || !settings.platform_url) {
      return NextResponse.json({ error: 'Platform name and URL are required' }, { status: 400 })
    }

    // Validate numeric fields
    if (settings.min_deposit >= settings.max_deposit) {
      return NextResponse.json({ error: 'Minimum deposit must be less than maximum deposit' }, { status: 400 })
    }

    if (settings.min_withdrawal >= settings.max_withdrawal) {
      return NextResponse.json({ error: 'Minimum withdrawal must be less than maximum withdrawal' }, { status: 400 })
    }

    if (settings.withdrawal_fee < 0) {
      return NextResponse.json({ error: 'Withdrawal fee cannot be negative' }, { status: 400 })
    }

    if (settings.withdrawal_fee_percentage < 0 || settings.withdrawal_fee_percentage > 100) {
      return NextResponse.json({ error: 'Withdrawal fee percentage must be between 0 and 100' }, { status: 400 })
    }

    if (settings.session_timeout < 5) {
      return NextResponse.json({ error: 'Session timeout must be at least 5 minutes' }, { status: 400 })
    }

    if (settings.max_login_attempts < 1) {
      return NextResponse.json({ error: 'Max login attempts must be at least 1' }, { status: 400 })
    }

    // Check if settings exist
    const { data: existingSettings } = await serviceSupabase
      .from('platform_settings')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await serviceSupabase
        .from('platform_settings')
        .update({
          platform_name: settings.platform_name,
          platform_url: settings.platform_url,
          maintenance_mode: settings.maintenance_mode,
          registration_enabled: settings.registration_enabled,
          min_deposit: settings.min_deposit,
          max_deposit: settings.max_deposit,
          min_withdrawal: settings.min_withdrawal,
          max_withdrawal: settings.max_withdrawal,
          withdrawal_fee: settings.withdrawal_fee,
          withdrawal_fee_percentage: settings.withdrawal_fee_percentage,
          daily_withdrawal_limit: settings.daily_withdrawal_limit,
          two_factor_required: settings.two_factor_required,
          kyc_required: settings.kyc_required,
          session_timeout: settings.session_timeout,
          max_login_attempts: settings.max_login_attempts,
          email_notifications: settings.email_notifications,
          sms_notifications: settings.sms_notifications,
          push_notifications: settings.push_notifications,
          default_investment_plan: settings.default_investment_plan,
          max_active_investments: settings.max_active_investments,
          auto_reinvest: settings.auto_reinvest,
        })
        .eq('id', existingSettings.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
      }

      result = data
    } else {
      // Insert new settings
      const { data, error } = await serviceSupabase
        .from('platform_settings')
        .insert({
          platform_name: settings.platform_name,
          platform_url: settings.platform_url,
          maintenance_mode: settings.maintenance_mode,
          registration_enabled: settings.registration_enabled,
          min_deposit: settings.min_deposit,
          max_deposit: settings.max_deposit,
          min_withdrawal: settings.min_withdrawal,
          max_withdrawal: settings.max_withdrawal,
          withdrawal_fee: settings.withdrawal_fee,
          withdrawal_fee_percentage: settings.withdrawal_fee_percentage,
          daily_withdrawal_limit: settings.daily_withdrawal_limit,
          two_factor_required: settings.two_factor_required,
          kyc_required: settings.kyc_required,
          session_timeout: settings.session_timeout,
          max_login_attempts: settings.max_login_attempts,
          email_notifications: settings.email_notifications,
          sms_notifications: settings.sms_notifications,
          push_notifications: settings.push_notifications,
          default_investment_plan: settings.default_investment_plan,
          max_active_investments: settings.max_active_investments,
          auto_reinvest: settings.auto_reinvest,
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting settings:', error)
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
      }

      result = data
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      settings: result
    })

  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 