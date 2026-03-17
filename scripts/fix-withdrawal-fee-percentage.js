require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixWithdrawalFeePercentage() {
  try {
    console.log('Fixing withdrawal_fee_percentage column...');
    
    // First, let's check if the column exists by trying to select it
    const { data: testData, error: testError } = await supabase
      .from('platform_settings')
      .select('withdrawal_fee_percentage')
      .limit(1);

    if (testError && testError.message.includes('withdrawal_fee_percentage')) {
      console.log('Column does not exist. Creating new settings with the column...');
      
      // Get current settings
      const { data: currentSettings } = await supabase
        .from('platform_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (currentSettings && currentSettings.length > 0) {
        const current = currentSettings[0];
        
        // Create new settings with all existing data plus the new column
        const { error: insertError } = await supabase
          .from('platform_settings')
          .insert({
            platform_name: current.platform_name,
            platform_url: current.platform_url,
            maintenance_mode: current.maintenance_mode,
            registration_enabled: current.registration_enabled,
            min_deposit: current.min_deposit,
            max_deposit: current.max_deposit,
            min_withdrawal: current.min_withdrawal,
            max_withdrawal: current.max_withdrawal,
            withdrawal_fee: current.withdrawal_fee,
            withdrawal_fee_percentage: 30.00, // Add the new field
            daily_withdrawal_limit: current.daily_withdrawal_limit,
            two_factor_required: current.two_factor_required,
            kyc_required: current.kyc_required,
            session_timeout: current.session_timeout,
            max_login_attempts: current.max_login_attempts,
            email_notifications: current.email_notifications,
            sms_notifications: current.sms_notifications,
            push_notifications: current.push_notifications,
            default_investment_plan: current.default_investment_plan,
            max_active_investments: current.max_active_investments,
            auto_reinvest: current.auto_reinvest
          });

        if (insertError) {
          console.error('Failed to create new settings:', insertError);
          return;
        }

        console.log('Created new settings with withdrawal_fee_percentage column');
      } else {
        // No existing settings, create default ones
        const { error: insertError } = await supabase
          .from('platform_settings')
          .insert({
            platform_name: "NorthStarRock",
            platform_url: "https://northstarrock.net",
            maintenance_mode: false,
            registration_enabled: true,
            min_deposit: 50,
            max_deposit: 50000,
            min_withdrawal: 100,
            max_withdrawal: 25000,
            withdrawal_fee: 5,
            withdrawal_fee_percentage: 30.00,
            daily_withdrawal_limit: 10000,
            two_factor_required: true,
            kyc_required: true,
            session_timeout: 30,
            max_login_attempts: 5,
            email_notifications: true,
            sms_notifications: false,
            push_notifications: true,
            default_investment_plan: "starter",
            max_active_investments: 10,
            auto_reinvest: false
          });

        if (insertError) {
          console.error('Failed to create default settings:', insertError);
          return;
        }

        console.log('Created default settings with withdrawal_fee_percentage column');
      }
    } else {
      console.log('Column already exists or no error occurred');
    }

    // Verify the settings
    const { data: verifySettings, error: verifyError } = await supabase
      .from('platform_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (verifyError) {
      console.error('Error verifying settings:', verifyError);
      return;
    }

    console.log('Final settings:', verifySettings);
    console.log('Withdrawal fee percentage column setup completed!');

  } catch (error) {
    console.error('Script error:', error);
  }
}

fixWithdrawalFeePercentage(); 