'use client';

import { useState, useEffect } from 'react';
import { 
  Gift, 
  Star, 
  Clock, 
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  Users,
  Target
} from 'lucide-react';

interface Reward {
  id: string;
  type: 'daily' | 'staking' | 'referral' | 'achievement' | 'bonus';
  amount: number;
  source: string;
  description: string;
  status: 'pending' | 'claimed' | 'expired';
  created_at: string;
  claimed_at?: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setError(null);
      // Fetch rewards
      const response = await fetch('/api/rewards', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards || []);
        
        // Update stats from API response
        if (data.stats) {
          setTotalEarned(data.stats.totalRewards || 0);
          setTotalClaimed(data.stats.claimedRewards || 0);
          setPendingRewards(data.stats.pendingRewards || 0);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch rewards:', response.status, errorData);
        setError('Failed to load rewards');
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setError('Network error while loading rewards');
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      setClaimingReward(rewardId);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rewardId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Reward claimed successfully!');
        // Refresh rewards
        await fetchRewards();
      } else {
        setError(data.error || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      setError('Network error while claiming reward');
    } finally {
      setClaimingReward(null);
    }
  };

  const claimAllRewards = async () => {
    try {
      setClaimingAll(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/rewards/claim-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'All rewards claimed successfully!');
        // Refresh rewards
        await fetchRewards();
      } else {
        setError(data.error || 'Failed to claim all rewards');
      }
    } catch (error) {
      console.error('Error claiming all rewards:', error);
      setError('Network error while claiming rewards');
    } finally {
      setClaimingAll(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Clock className="w-5 h-5" />;
      case 'staking':
        return <TrendingUp className="w-5 h-5" />;
      case 'referral':
        return <Users className="w-5 h-5" />;
      case 'achievement':
        return <Target className="w-5 h-5" />;
      case 'bonus':
        return <Gift className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'text-blue-400';
      case 'staking':
        return 'text-purple-400';
      case 'referral':
        return 'text-green-400';
      case 'achievement':
        return 'text-green-400';
      case 'bonus':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'expired':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Rewards Center</h1>
            <p className="text-gray-300 text-sm sm:text-base">Claim your earned rewards and bonuses</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Earned</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(totalEarned)}</p>
              </div>
              <div className="text-green-400">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Claimed</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(totalClaimed)}</p>
              </div>
              <div className="text-blue-400">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Pending Rewards</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(pendingRewards)}</p>
              </div>
              <div className="text-green-400">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-4 sm:p-6">
            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Actions</h2>
              {pendingRewards > 0 && (
                <button
                  onClick={claimAllRewards}
                  disabled={claimingAll}
                  className="btn-gradient-reward px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claimingAll ? 'Claiming...' : 'Claim All Rewards'}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 glass-card-staking rounded-lg">
                <div className="text-purple-400 mb-2">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Daily Login</h3>
                <p className="text-gray-300 text-xs sm:text-sm">$5.00 per day</p>
              </div>

              <div className="text-center p-3 sm:p-4 glass-card-reward rounded-lg">
                <div className="text-green-400 mb-2">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Staking Rewards</h3>
                <p className="text-gray-300 text-xs sm:text-sm">Up to 50% APY</p>
              </div>

              <div className="text-center p-3 sm:p-4 glass-card rounded-lg">
                <div className="text-green-400 mb-2">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Referral Bonus</h3>
                <p className="text-gray-300 text-xs sm:text-sm">$500 per referral</p>
              </div>

              <div className="text-center p-3 sm:p-4 glass-card rounded-lg">
                <div className="text-blue-400 mb-2">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Achievements</h3>
                <p className="text-gray-300 text-xs sm:text-sm">Complete tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Your Rewards</h2>
            <div className="flex gap-2">
              <button className="text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm">
                All
              </button>
              <button className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Pending
              </button>
              <button className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Claimed
              </button>
            </div>
          </div>

          <div className="glass-table overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Type</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Description</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Amount</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">Date</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Status</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center space-x-2">
                        <div className={getRewardTypeColor(reward.type)}>
                          {getRewardTypeIcon(reward.type)}
                        </div>
                        <span className="text-white capitalize text-xs sm:text-sm">{reward.type}</span>
                      </div>
                    </td>
                    <td className="text-gray-300 text-xs sm:text-sm p-2 sm:p-3">{reward.description}</td>
                    <td className="text-green-400 font-semibold text-xs sm:text-sm p-2 sm:p-3">
                      {formatCurrency(reward.amount)}
                    </td>
                    <td className="text-gray-300 text-xs sm:text-sm p-2 sm:p-3 hidden sm:table-cell">
                      {new Date(reward.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className={`badge text-xs ${getStatusColor(reward.status)}`}>
                        {reward.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      {reward.status === 'pending' && (
                        <button
                          onClick={() => claimReward(reward.id)}
                          disabled={claimingReward === reward.id}
                          className="btn-gradient-reward px-3 sm:px-4 py-1 rounded text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {claimingReward === reward.id ? 'Claiming...' : 'Claim'}
                        </button>
                      )}
                      {reward.status === 'claimed' && (
                        <div className="flex items-center text-green-400 text-xs sm:text-sm">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Claimed
                        </div>
                      )}
                      {reward.status === 'expired' && (
                        <div className="flex items-center text-red-400 text-xs sm:text-sm">
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Expired
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rewards.length === 0 && (
            <div className="glass-card p-6 sm:p-8 text-center">
              <Gift className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2 text-lg sm:text-xl">No Rewards Yet</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Start earning rewards by logging in daily, staking, and referring friends!
              </p>
            </div>
          )}
        </div>

        {/* How to Earn */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">How to Earn Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="glass-card p-4 sm:p-6">
              <div className="text-blue-400 mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Daily Login</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Log in every day to earn $5.00 daily bonus. Consistency pays off!
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: $5.00 per day
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6">
              <div className="text-purple-400 mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Staking Rewards</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Stake your funds to earn daily rewards based on your APY rate.
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: Up to 50% APY
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6">
              <div className="text-green-400 mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Referral Program</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Invite friends and earn $500 for each successful referral.
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: $500 per referral
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6">
              <div className="text-green-400 mb-3 sm:mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Achievements</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Complete various tasks and milestones to unlock achievement rewards.
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: Variable rewards
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6">
              <div className="text-green-400 mb-3 sm:mb-4">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Welcome Bonus</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                New users get a welcome bonus when they sign up with a referral code.
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: $50 welcome bonus
              </div>
            </div>

            <div className="glass-card p-4 sm:p-6">
              <div className="text-red-400 mb-3 sm:mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Special Events</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Participate in special events and promotions for extra rewards.
              </p>
              <div className="text-green-400 text-xs sm:text-sm font-semibold">
                Earn: Event-specific rewards
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}