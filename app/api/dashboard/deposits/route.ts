import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const auth = await requireAuth(request)
    const userId = auth.user.id

    console.log('Fetching deposits for user:', userId)

    // Use the server-side supabase client with session/cookies
    const supabase = await createClient()

    // Fetch user deposits
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError)
      return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 })
    }

    // Calculate statistics
    const totalDeposits = deposits
      ?.filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + Number(d.amount), 0) || 0

    const successfulDeposits = deposits
      ?.filter(d => d.status === 'completed').length || 0

    const pendingDeposits = deposits
      ?.filter(d => d.status === 'pending').length || 0

    const stats = {
      totalDeposits,
      successfulDeposits,
      pendingDeposits,
    }

    return NextResponse.json({
      deposits: deposits || [],
      stats
    })
  } catch (error) {
    console.error('Dashboard deposits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 