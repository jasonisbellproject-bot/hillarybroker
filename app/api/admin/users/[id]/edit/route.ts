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
    console.log('🔍 Admin Edit User API - Starting request...')
    
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
    const updateData = await request.json();

    console.log('📝 Updating user:', userId)
    console.log('📋 Update data:', updateData)

    // Validate required fields
    if (!updateData.first_name || !updateData.last_name || !updateData.email) {
      return NextResponse.json({ 
        error: 'First name, last name, and email are required' 
      }, { status: 400 });
    }

    // Prepare the update object with all possible fields
    const userUpdateData = {
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      email: updateData.email,
      wallet_balance: updateData.wallet_balance || 0,
      total_earned: updateData.total_earned || 0,
      kyc_verified: updateData.kyc_verified || false,
      two_factor_enabled: updateData.two_factor_enabled || false,
      is_admin: updateData.is_admin || false,
      status: updateData.status || 'active',
      referral_code: updateData.referral_code || '',
      referred_by: updateData.referred_by || null,
      updated_at: new Date().toISOString()
    };

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating user:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update user',
        details: updateError.message 
      }, { status: 500 });
    }

    // If email was changed, update it in auth.users as well
    if (updateData.email && updateData.email !== updatedUser.email) {
      try {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
          userId,
          { email: updateData.email }
        );

        if (authUpdateError) {
          console.error('⚠️ Warning: Could not update email in auth.users:', authUpdateError)
          // Don't fail the entire request, just log the warning
        }
      } catch (authError) {
        console.error('⚠️ Warning: Auth update failed:', authError)
      }
    }

    // Handle calculated fields by updating financial_stats table
    if (updateData.total_deposits !== undefined || updateData.total_withdrawals !== undefined || 
        updateData.referral_earnings !== undefined || updateData.referral_count !== undefined) {
      
      console.log('📊 Financial data updates:', {
        total_deposits: updateData.total_deposits,
        total_withdrawals: updateData.total_withdrawals,
        referral_earnings: updateData.referral_earnings,
        referral_count: updateData.referral_count
      })
      
      // Update or create financial_stats record
      const financialStatsData = {
        user_id: userId,
        total_deposits: updateData.total_deposits,
        total_withdrawals: updateData.total_withdrawals,
        total_referral_earnings: updateData.referral_earnings,
        referral_count: updateData.referral_count,
        last_calculated_at: new Date().toISOString()
      };
      
      // Remove undefined values
      Object.keys(financialStatsData).forEach(key => {
        if (financialStatsData[key] === undefined) {
          delete financialStatsData[key];
        }
      });
      
      // Upsert financial stats
      const { data: financialStats, error: financialStatsError } = await supabase
        .from('financial_stats')
        .upsert(financialStatsData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();
        
      if (financialStatsError) {
        console.error('❌ Error updating financial stats:', financialStatsError);
        // Don't fail the entire request, just log the error
      } else {
        console.log('✅ Financial stats updated successfully');
      }
    }

    console.log('✅ User updated successfully:', updatedUser.id)

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('❌ Error in admin edit user API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
