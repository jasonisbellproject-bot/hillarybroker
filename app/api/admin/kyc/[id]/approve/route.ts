import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-helpers'
import { emailService } from '@/lib/email'

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
    
    console.log('🔍 Attempting to update KYC document:', id)
    
    // Update KYC document status to approved
    const { data: kycDoc, error: updateError } = await supabase
      .from('kyc_documents')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating KYC document:', updateError)
      return NextResponse.json({ error: 'Failed to approve KYC document', details: updateError }, { status: 500 })
    }

    console.log('✅ KYC document updated successfully:', kycDoc)

    if (!kycDoc) {
      return NextResponse.json({ error: 'KYC document not found' }, { status: 404 })
    }

    // Send KYC approved email
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('email, first_name')
        .eq('id', kycDoc.user_id)
        .single();

      if (userData) {
        await emailService.sendKYCApprovedEmail(
          userData.email,
          userData.first_name
        );
      }
    } catch (emailError) {
      console.error('KYC approved email failed:', emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'KYC document approved successfully',
      document: kycDoc
    })

  } catch (error) {
    console.error('KYC approval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 