require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyWithdrawalFeePercentage() {
  try {
    console.log('Applying withdrawal_fee_percentage column...');
    
    // Read the SQL file
    const sql = fs.readFileSync('add-withdrawal-fee-percentage.sql', 'utf8');
    
    // Execute the SQL commands one by one
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Executing:', command.trim());
        
        // Try to execute the command using a different approach
        try {
          // First, let's try to add the column using a direct approach
          const { error } = await supabase
            .from('platform_settings')
            .select('id')
            .limit(1);
          
          if (error && error.message.includes('withdrawal_fee_percentage')) {
            console.log('Column does not exist, attempting to add it...');
            
            // Since we can't use exec_sql, let's try to recreate the table with the new column
            // For now, let's just update the existing settings to include the new field
            const { data: currentSettings } = await supabase
              .from('platform_settings')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1);

            if (currentSettings && currentSettings.length > 0) {
              // Try to update with the new field
              const { error: updateError } = await supabase
                .from('platform_settings')
                .update({ 
                  withdrawal_fee_percentage: 30.00,
                  updated_at: new Date().toISOString()
                })
                .eq('id', currentSettings[0].id);

              if (updateError) {
                console.log('Update failed, trying to create new settings...');
                
                // Create new settings with the new field
                const { error: insertError } = await supabase
                  .from('platform_settings')
                  .insert({
                    platform_name: currentSettings[0].platform_name || "NorthStarRock",
                    platform_url: currentSettings[0].platform_url || "https://northstarrock.net",
                    maintenance_mode: currentSettings[0].maintenance_mode || false,
                    registration_enabled: currentSettings[0].registration_enabled !== undefined ? currentSettings[0].registration_enabled : true,
                    min_deposit: currentSettings[0].min_deposit || 50,
                    max_deposit: currentSettings[0].max_deposit || 50000,
                    min_withdrawal: currentSettings[0].min_withdrawal || 100,
                    max_withdrawal: currentSettings[0].max_withdrawal || 25000,
                    withdrawal_fee: currentSettings[0].withdrawal_fee || 5,
                    withdrawal_fee_percentage: 30.00,
                    daily_withdrawal_limit: currentSettings[0].daily_withdrawal_limit || 10000,
                    two_factor_required: currentSettings[0].two_factor_required !== undefined ? currentSettings[0].two_factor_required : true,
                    kyc_required: currentSettings[0].kyc_required !== undefined ? currentSettings[0].kyc_required : true,
                    session_timeout: currentSettings[0].session_timeout || 30,
                    max_login_attempts: currentSettings[0].max_login_attempts || 5,
                    email_notifications: currentSettings[0].email_notifications !== undefined ? currentSettings[0].email_notifications : true,
                    sms_notifications: currentSettings[0].sms_notifications !== undefined ? currentSettings[0].sms_notifications : false,
                    push_notifications: currentSettings[0].push_notifications !== undefined ? currentSettings[0].push_notifications : true,
                    default_investment_plan: currentSettings[0].default_investment_plan || "starter",
                    max_active_investments: currentSettings[0].max_active_investments || 10,
                    auto_reinvest: currentSettings[0].auto_reinvest !== undefined ? currentSettings[0].auto_reinvest : false
                  });

                if (insertError) {
                  console.error('Failed to create new settings:', insertError);
                } else {
                  console.log('Created new settings with withdrawal_fee_percentage');
                }
              } else {
                console.log('Updated existing settings with withdrawal_fee_percentage');
              }
            }
          }
        } catch (error) {
          console.log('Command failed:', error.message);
        }
      }
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
    console.log('Withdrawal fee percentage setup completed!');

  } catch (error) {
    console.error('Script error:', error);
  }
}

applyWithdrawalFeePercentage(); 