require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addWithdrawalFeePercentage() {
  try {
    console.log('Checking current platform settings...');
    
    // First, let's check the current settings
    const { data: currentSettings, error: selectError } = await supabase
      .from('platform_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError) {
      console.error('Error fetching current settings:', selectError);
      return;
    }

    console.log('Current settings:', currentSettings);

    if (currentSettings && currentSettings.length > 0) {
      // Update existing settings to include withdrawal_fee_percentage
      const { error: updateError } = await supabase
        .from('platform_settings')
        .update({ withdrawal_fee_percentage: 30.00 })
        .eq('id', currentSettings[0].id);

      if (updateError) {
        console.error('Error updating settings:', updateError);
        return;
      }

      console.log('Updated existing settings with withdrawal_fee_percentage');
    } else {
      // Create new settings with the new field
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
        console.error('Error inserting settings:', insertError);
        return;
      }

      console.log('Created new settings with withdrawal_fee_percentage');
    }

    // Verify the settings
    const { data: verifySettings, error: verifyError } = await supabase
      .from('platform_settings')
      .select('withdrawal_fee_percentage')
      .order('created_at', { ascending: false })
      .limit(1);

    if (verifyError) {
      console.error('Error verifying settings:', verifyError);
      return;
    }

    console.log('Verification successful:', verifySettings);
    console.log('Withdrawal fee percentage added successfully!');

  } catch (error) {
    console.error('Script error:', error);
  }
}

addWithdrawalFeePercentage(); 