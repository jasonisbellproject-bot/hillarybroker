const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function populateSampleData() {
  try {
    console.log('Starting to populate sample data...')

    // Create sample users
    const users = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        kyc_verified: true,
        two_factor_enabled: true,
        is_admin: false,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        kyc_verified: true,
        two_factor_enabled: false,
        is_admin: false,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'mike.wilson@example.com',
        first_name: 'Mike',
        last_name: 'Wilson',
        kyc_verified: false,
        two_factor_enabled: false,
        is_admin: false,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'sarah.jones@example.com',
        first_name: 'Sarah',
        last_name: 'Jones',
        kyc_verified: true,
        two_factor_enabled: true,
        is_admin: false,
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        kyc_verified: true,
        two_factor_enabled: true,
        is_admin: true,
      },
    ]

    // Insert users
    for (const user of users) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' })
      
      if (error) {
        console.error(`Error inserting user ${user.email}:`, error)
      } else {
        console.log(`✓ Inserted user: ${user.email}`)
      }
    }

    // Create sample deposits
    const deposits = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        amount: 5000,
        currency: 'USD',
        payment_method: 'bank_transfer',
        status: 'completed',
        transaction_hash: 'tx_hash_1',
      },
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        amount: 3000,
        currency: 'USD',
        payment_method: 'credit_card',
        status: 'completed',
        transaction_hash: 'tx_hash_2',
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        amount: 7500,
        currency: 'USD',
        payment_method: 'crypto',
        status: 'completed',
        transaction_hash: 'tx_hash_3',
      },
      {
        user_id: '33333333-3333-3333-3333-333333333333',
        amount: 2000,
        currency: 'USD',
        payment_method: 'bank_transfer',
        status: 'pending',
        transaction_hash: null,
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        amount: 10000,
        currency: 'USD',
        payment_method: 'credit_card',
        status: 'completed',
        transaction_hash: 'tx_hash_4',
      },
    ]

    // Insert deposits
    for (const deposit of deposits) {
      const { error } = await supabase
        .from('deposits')
        .insert(deposit)
      
      if (error) {
        console.error('Error inserting deposit:', error)
      } else {
        console.log(`✓ Inserted deposit: $${deposit.amount} for user ${deposit.user_id}`)
      }
    }

    // Create sample withdrawals
    const withdrawals = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        amount: 1500,
        currency: 'USD',
        wallet_address: '0x1234567890abcdef',
        status: 'completed',
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        amount: 3000,
        currency: 'USD',
        wallet_address: '0xabcdef1234567890',
        status: 'pending',
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        amount: 5000,
        currency: 'USD',
        wallet_address: '0x9876543210fedcba',
        status: 'completed',
      },
    ]

    // Insert withdrawals
    for (const withdrawal of withdrawals) {
      const { error } = await supabase
        .from('withdrawals')
        .insert(withdrawal)
      
      if (error) {
        console.error('Error inserting withdrawal:', error)
      } else {
        console.log(`✓ Inserted withdrawal: $${withdrawal.amount} for user ${withdrawal.user_id}`)
      }
    }

    // Create sample investments
    const investments = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        plan_id: 1,
        amount: 5000,
        daily_return: 125,
        total_return: 8750,
        start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        plan_id: 2,
        amount: 7500,
        daily_return: 262.5,
        total_return: 19275,
        start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        plan_id: 3,
        amount: 10000,
        daily_return: 450,
        total_return: 37000,
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        plan_id: 1,
        amount: 3000,
        daily_return: 75,
        total_return: 5250,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now()).toISOString(),
        status: 'completed',
      },
    ]

    // Insert investments
    for (const investment of investments) {
      const { error } = await supabase
        .from('investments')
        .insert(investment)
      
      if (error) {
        console.error('Error inserting investment:', error)
      } else {
        console.log(`✓ Inserted investment: $${investment.amount} for user ${investment.user_id}`)
      }
    }

    // Create sample KYC documents
    const kycDocuments = [
      {
        user_id: '33333333-3333-3333-3333-333333333333',
        document_type: 'passport',
        document_url: 'https://example.com/passport.jpg',
        status: 'pending',
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        document_type: 'drivers_license',
        document_url: 'https://example.com/license.jpg',
        status: 'approved',
      },
    ]

    // Insert KYC documents
    for (const kycDoc of kycDocuments) {
      const { error } = await supabase
        .from('kyc_documents')
        .insert(kycDoc)
      
      if (error) {
        console.error('Error inserting KYC document:', error)
      } else {
        console.log(`✓ Inserted KYC document for user ${kycDoc.user_id}`)
      }
    }

    console.log('✓ Sample data population completed successfully!')
  } catch (error) {
    console.error('Error populating sample data:', error)
  }
}

populateSampleData() 