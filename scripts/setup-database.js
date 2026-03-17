const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...')

    // Test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Database connection error:', error)
      console.log('💡 You may need to run the SQL setup script in your Supabase dashboard')
      console.log('📄 Check the supabase-schema.sql file for the setup commands')
      return
    }

    console.log('✅ Database connection successful!')
    console.log('🎉 Your database is ready to use!')
    console.log('📝 You can now create an account at: http://localhost:3000/signup')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
  }
}

setupDatabase() 