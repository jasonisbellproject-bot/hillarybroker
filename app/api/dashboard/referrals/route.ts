import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth-helpers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const userId = auth.user.id;

    // Get all referrals where the current user is the referrer
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('referred_id, created_at, commission_earned')
      .eq('referrer_id', userId)
      .eq('status', 'active');

    if (referralsError) {
      return NextResponse.json([], { status: 200 });
    }

    if (!referrals || referrals.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Get user info and reward for each referred user
    const referredIds = referrals.map(r => r.referred_id);
    if (referredIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch user info including names and join dates
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .in('id', referredIds);

    if (usersError) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch rewards for these referrals (optional, not strictly required since we use commission_earned)
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('user_id, amount, source')
      .eq('type', 'referral')
      .eq('user_id', userId);

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
    }

    // Map referred users to their info and reward
    const referredUsers = users.map(user => {
      // Find the referral record for join date and commission
      const referral = referrals.find(r => r.referred_id === user.id);
      
      // Find the corresponding reward for this referral
      const rewardRecord = rewards?.find(r => r.source === `referral_${user.id}`);
      
      // Use reward amount if available, otherwise fall back to commission_earned
      const reward = rewardRecord ? Number(rewardRecord.amount) : 
                    (referral?.commission_earned ? Number(referral.commission_earned) : 0);
      
      // Create display name (first_name + last_name, or email if no name)
      const displayName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`
        : user.email;
        
      return {
        name: displayName,
        email: user.email,
        joinedAt: referral?.created_at || user.created_at,
        reward,
      };
    });

    return NextResponse.json(referredUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
} 