import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 KYC API - Starting request...')
    
    // Create Supabase client
    let supabase
    try {
      supabase = await createClient()
      console.log('✅ Supabase client created successfully')
    } catch (clientError) {
      console.error('❌ Failed to create Supabase client:', clientError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: clientError instanceof Error ? clientError.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Check authentication
    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
      if (!authUser) {
        console.log('❌ No authenticated user')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError) {
      console.error('❌ Auth getUser error:', authError)
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: authError instanceof Error ? authError.message : 'Unknown error'
      }, { status: 401 })
    }

    console.log('🔍 KYC API - User ID:', user.id)

    // Fetch user's KYC applications
    let applications
    try {
      const { data: kycData, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching KYC applications:', error)
        
        // Check if table doesn't exist
        if (error.code === '42P01') {
          console.log('📝 KYC documents table does not exist')
          return NextResponse.json({ 
            applications: [],
            message: 'KYC system not yet configured'
          })
        }
        
        return NextResponse.json({ 
          error: 'Failed to fetch applications',
          details: error.message 
        }, { status: 500 })
      }

      applications = kycData
      console.log('✅ KYC applications fetched successfully:', applications?.length || 0)
    } catch (dbError) {
      console.error('❌ Database query error:', dbError)
      return NextResponse.json({ 
        error: 'Database query failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      applications: applications || []
    })

  } catch (error) {
    console.error('❌ KYC fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 