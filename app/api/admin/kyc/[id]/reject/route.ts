import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Check admin authentication
    const auth = await requireAuth(request)
    const adminUserId = auth.user.id
    
    // Update KYC document status to rejected
    const { data: kycDoc, error: updateError } = await supabase
      .from('kyc_documents')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating KYC document:', updateError)
      return NextResponse.json({ error: 'Failed to reject KYC document' }, { status: 500 })
    }

    if (!kycDoc) {
      return NextResponse.json({ error: 'KYC document not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'KYC document rejected successfully',
      document: kycDoc
    })

  } catch (error) {
    console.error('KYC rejection error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 