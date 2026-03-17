const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testApp() {
  console.log('🧪 Testing Application Features...\n')

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...')
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (userError) {
      throw new Error(`Database connection failed: ${userError.message}`)
    }
    console.log('✅ Database connection successful')

    // Test 2: Check Admin Users
    console.log('\n2️⃣ Checking Admin Users...')
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('email, is_admin, kyc_verified')
      .eq('is_admin', true)
    
    if (adminError) {
      throw new Error(`Admin query failed: ${adminError.message}`)
    }
    
    if (admins && admins.length > 0) {
      console.log(`✅ Found ${admins.length} admin user(s):`)
      admins.forEach(admin => {
        console.log(`   👤 ${admin.email} (KYC: ${admin.kyc_verified ? '✅' : '❌'})`)
      })
    } else {
      console.log('⚠️  No admin users found')
    }

    // Test 3: Check Tables Exist
    console.log('\n3️⃣ Checking Database Tables...')
    const tables = ['users', 'deposits', 'withdrawals', 'investments', 'investment_plans', 'kyc_documents']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': OK`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`)
      }
    }

    // Test 4: Environment Variables
    console.log('\n4️⃣ Checking Environment Variables...')
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]
    
    const optionalVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY', 
      'CLOUDINARY_API_SECRET'
    ]
    
    console.log('Required variables:')
    requiredVars.forEach(varName => {
      const value = process.env[varName]
      if (value) {
        console.log(`✅ ${varName}: Set`)
      } else {
        console.log(`❌ ${varName}: Missing`)
      }
    })
    
    console.log('\nOptional variables:')
    optionalVars.forEach(varName => {
      const value = process.env[varName]
      if (value) {
        console.log(`✅ ${varName}: Set`)
      } else {
        console.log(`⚠️  ${varName}: Not set (optional)`)
      }
    })

    console.log('\n🎉 Application test completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Visit http://localhost:3000 to see the landing page')
    console.log('2. Go to http://localhost:3000/login to sign in')
    console.log('3. Access http://localhost:3000/dashboard for user dashboard')
    console.log('4. Visit http://localhost:3000/admin for admin panel')
    console.log('5. Test signup at http://localhost:3000/signup')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testApp() 