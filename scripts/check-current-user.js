const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCurrentUser() {
  try {
    console.log('🔍 Checking current user details...')
    
    // Get all users to see who's currently active
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching users:', error)
      return
    }
    
    console.log(`\n📊 Total Users: ${allUsers.length}`)
    console.log('='.repeat(50))
    
    console.log('\n👥 All Users List:')
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.first_name} ${user.last_name}`)
      console.log(`   Admin: ${user.is_admin ? '✅ Yes' : '❌ No'}`)
      console.log(`   KYC Verified: ${user.kyc_verified ? '✅ Yes' : '❌ No'}`)
      console.log(`   2FA Enabled: ${user.two_factor_enabled ? '✅ Yes' : '❌ No'}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
    })
    
    // Find the admin user
    const adminUser = allUsers.find(user => user.is_admin)
    if (adminUser) {
      console.log('\n👑 Admin User Details:')
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Name: ${adminUser.first_name} ${adminUser.last_name}`)
      console.log(`   Password: (you'll need to reset this in Supabase dashboard)`)
    }
    
    console.log('\n💡 To access admin dashboard:')
    console.log('1. Log in with the admin email: ' + (adminUser?.email || 'N/A'))
    console.log('2. Or make your current user an admin by running:')
    console.log('   node scripts/make-user-admin.js "your-email@example.com"')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the check
checkCurrentUser() 