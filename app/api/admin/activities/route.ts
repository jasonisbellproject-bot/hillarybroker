import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock data if database is not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json([
        {
          id: "1",
          type: "deposit",
          user: "john.doe@email.com",
          amount: 5000,
          status: "completed",
          time: "2 minutes ago",
        },
        {
          id: "2",
          type: "withdrawal",
          user: "jane.smith@email.com",
          amount: 2500,
          status: "pending",
          time: "5 minutes ago",
        },
        {
          id: "3",
          type: "kyc",
          user: "mike.wilson@email.com",
          amount: 0,
          status: "pending",
          time: "10 minutes ago",
        },
        {
          id: "4",
          type: "investment",
          user: "sarah.jones@email.com",
          amount: 10000,
          status: "completed",
          time: "15 minutes ago",
        },
      ])
    }

    // Fetch recent deposits
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select(`
        id,
        amount,
        status,
        created_at,
        users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (depositsError) {
      console.error('Error fetching deposits:', depositsError)
      return NextResponse.json({ error: 'Failed to fetch deposits' }, { status: 500 })
    }

    // Fetch recent withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select(`
        id,
        amount,
        status,
        created_at,
        users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError)
      return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 })
    }

    // Fetch recent KYC submissions
    const { data: kycDocuments, error: kycError } = await supabase
      .from('kyc_documents')
      .select(`
        id,
        status,
        created_at,
        users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (kycError) {
      console.error('Error fetching KYC documents:', kycError)
      return NextResponse.json({ error: 'Failed to fetch KYC documents' }, { status: 500 })
    }

    // Fetch recent investments
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        id,
        amount,
        status,
        created_at,
        users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError)
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    }

    // Combine and format activities
    const activities = [
      ...deposits?.map(d => ({
        id: d.id,
        type: 'deposit',
        user: d.users.email,
        amount: d.amount,
        status: d.status,
        time: d.created_at,
      })) || [],
      ...withdrawals?.map(w => ({
        id: w.id,
        type: 'withdrawal',
        user: w.users.email,
        amount: w.amount,
        status: w.status,
        time: w.created_at,
      })) || [],
      ...kycDocuments?.map(k => ({
        id: k.id,
        type: 'kyc',
        user: k.users.email,
        amount: 0,
        status: k.status,
        time: k.created_at,
      })) || [],
      ...investments?.map(i => ({
        id: i.id,
        type: 'investment',
        user: i.users.email,
        amount: i.amount,
        status: i.status,
        time: i.created_at,
      })) || [],
    ]

    // Sort by time and take the most recent 10
    const recentActivities = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
      .map(activity => ({
        ...activity,
        time: formatTimeAgo(activity.time),
      }))

    return NextResponse.json(recentActivities)
  } catch (error) {
    console.error('Admin activities error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString()
} 