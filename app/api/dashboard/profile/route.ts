import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const userId = auth.user.id;
    const updateData = await request.json();

    // Only allow updating first_name, last_name, avatar_url, email
    const allowedFields = ['first_name', 'last_name', 'avatar_url', 'email'];
    const filteredUpdateData: any = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // If email is being changed, check for conflicts and update in Auth
    if (filteredUpdateData.email) {
      // Check if email is already in use
      const { data: existing, error: existingError } = await supabase
        .from('users')
        .select('id')
        .eq('email', filteredUpdateData.email)
        .neq('id', userId)
        .single();
      if (existing && !existingError) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
      // Update email in Supabase Auth
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email: filteredUpdateData.email
      });
      if (authError) {
        return NextResponse.json({ error: 'Failed to update email in Auth' }, { status: 500 });
      }
    }

    if (Object.keys(filteredUpdateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(filteredUpdateData)
      .eq('id', userId)
      .select('email, first_name, last_name, avatar_url, referral_code')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        avatarUrl: updatedUser.avatar_url,
        referralCode: updatedUser.referral_code,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 