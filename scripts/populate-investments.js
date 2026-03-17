const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateInvestmentPlans() {
  console.log('Populating investment plans...')
  
  const plans = [
    {
      name: 'Starter Plan',
      min_amount: 100,
      max_amount: 999,
      daily_return: 2.5,
      duration: 30,
      total_return: 175,
      status: 'active'
    },
    {
      name: 'Professional Plan',
      min_amount: 1000,
      max_amount: 4999,
      daily_return: 3.5,
      duration: 45,
      total_return: 257.5,
      status: 'active'
    },
    {
      name: 'Premium Plan',
      min_amount: 5000,
      max_amount: 19999,
      daily_return: 4.5,
      duration: 60,
      total_return: 370,
      status: 'active'
    },
    {
      name: 'VIP Plan',
      min_amount: 20000,
      max_amount: 50000,
      daily_return: 6.0,
      duration: 90,
      total_return: 640,
      status: 'limited'
    }
  ]

  for (const plan of plans) {
    const { data, error } = await supabase
      .from('investment_plans')
      .upsert(plan, { onConflict: 'name' })
    
    if (error) {
      console.error('Error inserting plan:', plan.name, error)
    } else {
      console.log('✓ Inserted plan:', plan.name)
    }
  }
}

async function createSampleInvestments() {
  console.log('\nCreating sample investments...')
  
  // Get a test user
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .limit(1)
  
  if (userError || !users || users.length === 0) {
    console.error('No users found for sample investments')
    return
  }
  
  const userId = users[0].id
  
  // Get investment plans
  const { data: plans, error: planError } = await supabase
    .from('investment_plans')
    .select('*')
  
  if (planError || !plans) {
    console.error('No investment plans found')
    return
  }
  
  const sampleInvestments = [
    {
      user_id: userId,
      plan_id: plans[1].id, // Professional Plan
      amount: 2500,
      daily_return: 87.5, // 2500 * 3.5% / 100
      total_return: 6437.5, // 2500 * 257.5% / 100
      start_date: new Date('2024-01-15').toISOString(),
      end_date: new Date('2024-03-01').toISOString(),
      status: 'active'
    },
    {
      user_id: userId,
      plan_id: plans[0].id, // Starter Plan
      amount: 500,
      daily_return: 12.5, // 500 * 2.5% / 100
      total_return: 875, // 500 * 175% / 100
      start_date: new Date('2024-01-20').toISOString(),
      end_date: new Date('2024-02-19').toISOString(),
      status: 'active'
    },
    {
      user_id: userId,
      plan_id: plans[2].id, // Premium Plan
      amount: 10000,
      daily_return: 450, // 10000 * 4.5% / 100
      total_return: 37000, // 10000 * 370% / 100
      start_date: new Date('2024-01-10').toISOString(),
      end_date: new Date('2024-03-11').toISOString(),
      status: 'active'
    }
  ]
  
  for (const investment of sampleInvestments) {
    const { data, error } = await supabase
      .from('investments')
      .insert(investment)
    
    if (error) {
      console.error('Error inserting investment:', error)
    } else {
      console.log('✓ Created investment: $' + investment.amount.toLocaleString())
    }
  }
}

async function main() {
  try {
    await populateInvestmentPlans()
    await createSampleInvestments()
    console.log('\n✅ Investment data populated successfully!')
  } catch (error) {
    console.error('Error populating investment data:', error)
  }
}

main() 