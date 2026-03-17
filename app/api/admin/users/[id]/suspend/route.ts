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
    console.log('🔍 Admin Suspend User API - Starting request...')
    
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

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, status')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from suspending themselves
    if (userId === adminUserId) {
      return NextResponse.json({ error: 'Cannot suspend your own account' }, { status: 400 });
    }

    // Update user status to suspended
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error suspending user:', updateError)
      return NextResponse.json({ 
        error: 'Failed to suspend user',
        details: updateError.message 
      }, { status: 500 });
    }

    console.log('✅ User suspended successfully:', userId)

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User suspended successfully'
    });

  } catch (error) {
    console.error('❌ Error in admin suspend user API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
