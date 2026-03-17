import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const traderId = params.id;
    const updateData = await request.json();

    // Check if trader exists
    const { data: existingTrader, error: traderCheckError } = await supabase
      .from('copy_traders')
      .select('id')
      .eq('id', traderId)
      .single();

    if (traderCheckError || !existingTrader) {
      return NextResponse.json({ error: 'Copy trader not found' }, { status: 404 });
    }

    // Prepare update data
    const updateFields: any = {
      updated_at: new Date().toISOString()
    };

    if (updateData.display_name !== undefined) updateFields.display_name = updateData.display_name;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.min_copy_amount !== undefined) updateFields.min_copy_amount = updateData.min_copy_amount;
    if (updateData.max_copy_amount !== undefined) updateFields.max_copy_amount = updateData.max_copy_amount;
    if (updateData.copy_fee_percentage !== undefined) updateFields.copy_fee_percentage = updateData.copy_fee_percentage;
    if (updateData.is_verified !== undefined) updateFields.is_verified = updateData.is_verified;
    if (updateData.is_active !== undefined) updateFields.is_active = updateData.is_active;

    // Update copy trader
    const { data: updatedTrader, error: updateError } = await supabase
      .from('copy_traders')
      .update(updateFields)
      .eq('id', traderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating copy trader:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update copy trader',
        details: updateError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      trader: updatedTrader
    });

  } catch (error) {
    console.error('Error in admin update copy trader API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let adminUserId: string;
    try {
      const auth = await requireAuth(request);
      adminUserId = auth.user.id;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminUserId)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const traderId = params.id;

    // Check if trader exists
    const { data: existingTrader, error: traderCheckError } = await supabase
      .from('copy_traders')
      .select('id, user_id')
      .eq('id', traderId)
      .single();

    if (traderCheckError || !existingTrader) {
      return NextResponse.json({ error: 'Copy trader not found' }, { status: 404 });
    }

    // Check if trader has any subscriptions (without status check)
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('copy_trading_subscriptions')
      .select('id')
      .eq('trader_id', traderId);

    if (subscriptionsError) {
      console.error('Error checking subscriptions:', subscriptionsError);
    }

    if (subscriptions && subscriptions.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete trader with existing subscriptions. Please remove subscriptions first.' 
      }, { status: 400 });
    }

    // Delete copy trader
    const { error: deleteError } = await supabase
      .from('copy_traders')
      .delete()
      .eq('id', traderId);

    if (deleteError) {
      console.error('Error deleting copy trader:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete copy trader',
        details: deleteError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Copy trader deleted successfully'
    });

  } catch (error) {
    console.error('Error in admin delete copy trader API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
