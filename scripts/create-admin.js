const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

  try {
    console.log('🔐 Creating Admin User for NorthStarRock\n')

    const email = await question('Enter admin email: ')
    const password = await question('Enter admin password: ')
    const firstName = await question('Enter first name: ')
    const lastName = await question('Enter last name: ')

    console.log('\n⏳ Creating admin user...')

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    // Create user profile with admin privileges
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName,
        last_name: lastName,
        kyc_verified: true,
        two_factor_enabled: false,
        is_admin: true,
      })

    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`)
    }

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Name: ${firstName} ${lastName}`)
    console.log(`🔑 Role: Administrator`)
    console.log('\n🎉 You can now sign in at http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  } finally {
    rl.close()
  }
}

createAdminUser() 