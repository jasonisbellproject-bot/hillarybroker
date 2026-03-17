const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.log('Make sure you have:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdminUsers() {
  try {
    console.log('🔍 Checking admin users in database...')
    
    // Query all admin users
    const { data: adminUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', true)
    
    if (error) {
      console.error('❌ Error fetching admin users:', error)
      return
    }
    
    console.log(`\n📊 Admin Users Found: ${adminUsers.length}`)
    console.log('='.repeat(50))
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in the database')
      console.log('\n💡 To create an admin user:')
      console.log('1. Use the admin setup script: node scripts/create-admin.js')
      console.log('2. Or manually update a user in Supabase dashboard')
      console.log('3. Or run SQL: UPDATE users SET is_admin = true WHERE email = "your-email@example.com"')
    } else {
      console.log('\n👥 Admin Users List:')
      adminUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user.id}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Name: ${user.first_name} ${user.last_name}`)
        console.log(`   KYC Verified: ${user.kyc_verified ? '✅ Yes' : '❌ No'}`)
        console.log(`   2FA Enabled: ${user.two_factor_enabled ? '✅ Yes' : '❌ No'}`)
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
        console.log(`   Updated: ${new Date(user.updated_at).toLocaleString()}`)
      })
    }
    
    // Also check total users for comparison
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, is_admin')
    
    if (!allUsersError) {
      const totalUsers = allUsers.length
      const regularUsers = allUsers.filter(user => !user.is_admin).length
      
      console.log('\n📈 Database Statistics:')
      console.log(`   Total Users: ${totalUsers}`)
      console.log(`   Admin Users: ${adminUsers.length}`)
      console.log(`   Regular Users: ${regularUsers}`)
      console.log(`   Admin Percentage: ${((adminUsers.length / totalUsers) * 100).toFixed(1)}%`)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the check
checkAdminUsers() 