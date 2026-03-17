const fs = require('fs')
const path = require('path')

console.log('🔧 Environment Setup Helper')
console.log('==========================')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (envExists) {
  console.log('✅ .env.local file found')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check for required variables
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL')
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY')
  
  console.log(`Supabase URL: ${hasSupabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`Supabase Anon Key: ${hasSupabaseKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`Service Role Key: ${hasServiceKey ? '✅ Set' : '❌ Missing'}`)
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('\n❌ Missing required environment variables')
    console.log('Please add the following to your .env.local file:')
    console.log('')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
    console.log('')
    console.log('You can get these from your Supabase project dashboard.')
  } else {
    console.log('\n✅ Environment variables appear to be configured')
    console.log('Try running the development server: npm run dev')
  }
} else {
  console.log('❌ .env.local file not found')
  console.log('')
  console.log('Please create a .env.local file with the following content:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.log('')
  console.log('You can get these from your Supabase project dashboard.')
  console.log('')
  console.log('Steps to get your Supabase credentials:')
  console.log('1. Go to https://supabase.com')
  console.log('2. Create a new project or use existing one')
  console.log('3. Go to Settings > API')
  console.log('4. Copy the Project URL and anon/public key')
  console.log('5. Add them to your .env.local file')
}

console.log('\n📝 Quick Test Instructions:')
console.log('1. Set up your .env.local file with Supabase credentials')
console.log('2. Run: npm run dev')
console.log('3. Visit: http://localhost:3000/login')
console.log('4. Use test credentials: test@example.com / password123')
console.log('5. If no test user exists, create one with: node scripts/create-test-user.js') 