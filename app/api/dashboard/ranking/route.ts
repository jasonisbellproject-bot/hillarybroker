import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all users with their referral counts
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email');

    if (usersError || !users) {
      return NextResponse.json([], { status: 200 });
    }

    // Get all active referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('referrer_id')
      .eq('status', 'active');

    // Get all referral rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('user_id, amount, type')
      .eq('type', 'referral');

    // Calculate referral count and earnings for each user
    const userStats = users.map(user => {
      const referralCount = referrals ? referrals.filter(r => r.referrer_id === user.id).length : 0;
      const referralEarnings = rewards
        ? rewards.filter(rw => rw.user_id === user.id).reduce((sum, rw) => sum + rw.amount, 0)
        : 0;
      return {
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
        email: user.email,
        referralCount,
        referralEarnings,
      };
    });

    // Sort by referralCount desc, then referralEarnings desc
    userStats.sort((a, b) => {
      if (b.referralCount !== a.referralCount) {
        return b.referralCount - a.referralCount;
      }
      return b.referralEarnings - a.referralEarnings;
    });

    // Add rank and limit to top 50
    const leaderboard = userStats.slice(0, 50).map((user, idx) => ({
      rank: idx + 1,
      ...user,
    }));

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
} 