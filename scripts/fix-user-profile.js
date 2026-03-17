const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixUserProfile() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

  try {
    console.log('🔧 Fixing User Profile\n')

    const email = await question('Enter user email: ')
    const firstName = await question('Enter first name: ')
    const lastName = await question('Enter last name: ')
    const isAdmin = await question('Is admin? (y/n): ')

    console.log('\n⏳ Creating user profile...')

    // Get user from auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    const authUser = users.find(u => u.email === email)
    
    if (!authUser) {
      throw new Error(`User with email ${email} not found in auth`)
    }

    console.log(`✅ Found auth user: ${authUser.id}`)

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Database error: ${checkError.message}`)
    }

    if (existingProfile) {
      console.log('⚠️  User profile already exists, updating...')
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update({
          email: email,
          first_name: firstName,
          last_name: lastName,
          is_admin: isAdmin.toLowerCase() === 'y',
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Update error: ${updateError.message}`)
      }

      console.log('✅ User profile updated successfully!')
      console.log(`📧 Email: ${updatedProfile.email}`)
      console.log(`👤 Name: ${updatedProfile.first_name} ${updatedProfile.last_name}`)
      console.log(`🔑 Role: ${updatedProfile.is_admin ? 'Admin' : 'User'}`)
    } else {
      console.log('📝 Creating new user profile...')
      
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          kyc_verified: isAdmin.toLowerCase() === 'y', // Admin is pre-verified
          two_factor_enabled: false,
          is_admin: isAdmin.toLowerCase() === 'y',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`Insert error: ${insertError.message}`)
      }

      console.log('✅ User profile created successfully!')
      console.log(`📧 Email: ${newProfile.email}`)
      console.log(`👤 Name: ${newProfile.first_name} ${newProfile.last_name}`)
      console.log(`🔑 Role: ${newProfile.is_admin ? 'Admin' : 'User'}`)
    }

    console.log('\n🎉 Profile fix completed!')
    console.log('You can now sign in at http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

fixUserProfile() 