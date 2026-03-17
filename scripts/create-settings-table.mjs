import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createSettingsTable() {
  console.log('Creating platform_settings table...\n')

  try {
    // First, let's check if the table already exists
    const { data: existingTable, error: checkError } = await supabase
      .from('platform_settings')
      .select('id')
      .limit(1)

    if (checkError && checkError.code === '42P01') {
      console.log('Table does not exist, creating it...')
      
      // Since we can't execute raw SQL, let's try to create the table by inserting a record
      // This will fail but might give us more information
      const { error: insertError } = await supabase
        .from('platform_settings')
        .insert({
          platform_name: 'NorthStarRock',
          platform_url: 'https://northstarrock.net',
          maintenance_mode: false,
          registration_enabled: true,
          min_deposit: 50.00,
          max_deposit: 50000.00,
          min_withdrawal: 100.00,
          max_withdrawal: 25000.00,
          withdrawal_fee: 5.00,
          daily_withdrawal_limit: 10000.00,
          two_factor_required: true,
          kyc_required: true,
          session_timeout: 30,
          max_login_attempts: 5,
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          default_investment_plan: 'starter',
          max_active_investments: 10,
          auto_reinvest: false
        })

      if (insertError) {
        console.error('Error creating table:', insertError)
        console.log('\n📋 Manual Setup Required:')
        console.log('1. Go to your Supabase Dashboard')
        console.log('2. Navigate to SQL Editor')
        console.log('3. Run the following SQL:')
        console.log('\n' + fs.readFileSync('scripts/create-settings-table.sql', 'utf8'))
        return
      }
    } else {
      console.log('✅ Table already exists')
    }

    // Check if settings exist
    const { data: settings, error: settingsError } = await supabase
      .from('platform_settings')
      .select('*')
      .limit(1)

    if (settingsError) {
      console.error('Error checking settings:', settingsError)
      return
    }

    if (settings && settings.length > 0) {
      console.log('✅ Settings found:', settings[0].platform_name)
    } else {
      console.log('📝 Inserting default settings...')
      
      const { data: newSettings, error: insertError } = await supabase
        .from('platform_settings')
        .insert({
          platform_name: 'NorthStarRock',
          platform_url: 'https://northstarrock.net',
          maintenance_mode: false,
          registration_enabled: true,
          min_deposit: 50.00,
          max_deposit: 50000.00,
          min_withdrawal: 100.00,
          max_withdrawal: 25000.00,
          withdrawal_fee: 5.00,
          daily_withdrawal_limit: 10000.00,
          two_factor_required: true,
          kyc_required: true,
          session_timeout: 30,
          max_login_attempts: 5,
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          default_investment_plan: 'starter',
          max_active_investments: 10,
          auto_reinvest: false
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting settings:', insertError)
        return
      }

      console.log('✅ Default settings created:', newSettings.id)
    }

    console.log('\n🎉 Settings setup complete!')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

// Run the setup
createSettingsTable() 