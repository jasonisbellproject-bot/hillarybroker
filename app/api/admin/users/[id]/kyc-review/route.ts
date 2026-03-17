import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Admin KYC Review API - Starting request...')
    
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (adminError || !adminUser?.is_admin) {
      console.log('❌ Admin access denied')
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ Admin access verified')

    const userId = params.id;
    const { status, notes } = await request.json();

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid KYC status' }, { status: 400 });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, kyc_verified')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user KYC status
    const updateData: any = {
      kyc_verified: status === 'approved',
      updated_at: new Date().toISOString()
    };

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating KYC status:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update KYC status',
        details: updateError.message 
      }, { status: 500 });
    }

    // Create KYC review record
    const { error: kycReviewError } = await supabase
      .from('kyc_reviews')
      .insert({
        user_id: userId,
        admin_id: adminUserId,
        status: status,
        notes: notes || '',
        reviewed_at: new Date().toISOString()
      });

    if (kycReviewError) {
      console.error('⚠️ Warning: Could not create KYC review record:', kycReviewError)
      // Don't fail the entire request, just log the warning
    }

    console.log('✅ KYC review completed successfully:', userId)

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `KYC status updated to ${status}`
    });

  } catch (error) {
    console.error('❌ Error in admin KYC review API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
