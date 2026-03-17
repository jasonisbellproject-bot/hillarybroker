const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please check your .env file has:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInvestmentPlans() {
  console.log('Testing investment plans...')
  
  // Test fetching investment plans
  const { data: plans, error } = await supabase
    .from('investment_plans')
    .select('*')
  
  if (error) {
    console.error('Error fetching plans:', error)
    return
  }
  
  console.log('✓ Found', plans.length, 'investment plans:')
  plans.forEach(plan => {
    console.log(`  - ${plan.name}: $${plan.min_amount} - $${plan.max_amount} (${plan.daily_return}% daily)`)
  })
}

async function testDatabaseConnection() {
  console.log('\nTesting database connection...')
  
  // Test basic connection
  const { data, error } = await supabase
    .from('investment_plans')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
  
  console.log('✓ Database connection successful')
  return true
}

async function main() {
  try {
    const connected = await testDatabaseConnection()
    if (connected) {
      await testInvestmentPlans()
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

main() 