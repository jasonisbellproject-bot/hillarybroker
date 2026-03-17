import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupSettings() {
  console.log('Setting up platform_settings table...\n')

  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'create-settings-table.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent })

    if (error) {
      console.error('Error creating settings table:', error)
      return
    }

    console.log('✅ Platform settings table created successfully')

    // Verify the table exists
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'platform_settings')

    if (listError) {
      console.error('Error checking table:', listError)
      return
    }

    if (tables && tables.length > 0) {
      console.log('✅ Settings table verified')
      
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
        console.log('✅ Default settings found')
        console.log('Settings:', JSON.stringify(settings[0], null, 2))
      } else {
        console.log('⚠️ No settings found, you may need to insert default settings')
      }
    } else {
      console.log('❌ Settings table not found')
    }

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

// Run the setup
setupSettings() 