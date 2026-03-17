const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminSimple() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

  try {
    console.log('🔐 Creating Admin User (Simple Method)\n')

    const email = await question('Enter admin email: ')
    const firstName = await question('Enter first name: ')
    const lastName = await question('Enter last name: ')

    console.log('\n⏳ Creating admin user profile...')

    // Create user profile directly (bypassing auth)
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: `admin-${Date.now()}`, // Generate a unique ID
        email: email,
        first_name: firstName,
        last_name: lastName,
        kyc_verified: true,
        two_factor_enabled: false,
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Admin user profile created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Name: ${firstName} ${lastName}`)
    console.log(`🔑 Role: Administrator`)
    console.log(`🆔 User ID: ${data[0].id}`)
    console.log('\n📝 Next steps:')
    console.log('1. Go to Supabase Dashboard > Authentication > Users')
    console.log('2. Click "Add User"')
    console.log(`3. Enter email: ${email}`)
    console.log('4. Set a password')
    console.log('5. Save the user')
    console.log('\n🎉 Then you can sign in at http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

createAdminSimple() 