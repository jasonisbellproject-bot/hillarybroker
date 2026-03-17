'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  Gift,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Zap,
  Shield,
  BarChart3,
  Calendar,
  Clock,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalBalance: number;
  totalStaked: number;
  totalEarned: number;
  activeStakes: number;
  totalDeposits: number;
  totalWithdrawals: number;
  referralEarnings: number;
  dailyRewards: number;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    referralCode?: string;
  };
  referralCount?: number;
}

interface StakingPool {
  id: number;
  name: string;
  description?: string;
  apy: number;
  minStake: number;
  maxStake: number;
  lockPeriod: number;
  totalStaked: number;
  uniqueUsers: number;
  status: string;
  features?: string[];
  userStake?: {
    amount: number;
    status: string;
  } | null;
}

interface UserStake {
  id: string;
  poolName: string;
  poolDescription?: string;
  amount: number;
  apy: number;
  lockPeriod: number;
  startDate: string;
  endDate?: string;
  status: string;
  rewardsEarned: number;
  progress: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'reward' | 'stake';
  title: string;
  description: string;
  amount: number;
  status: string;
  date: string;
  reference: string;
  icon: string;
  color: string;
  rewards?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalStaked: 0,
    totalEarned: 0,
    activeStakes: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    referralEarnings: 0,
    dailyRewards: 0
  });
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<DashboardStats['user'] | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        setUserProfile(statsData.user || null);
      }

      // Fetch staking pools
      const poolsResponse = await fetch('/api/staking/pools', {
        credentials: 'include'
      });
      if (poolsResponse.ok) {
        const poolsData = await poolsResponse.json();
        setStakingPools(poolsData);
      }

      // Fetch user stakes
      const stakesResponse = await fetch('/api/staking/user-stakes', {
        credentials: 'include'
      });
      if (stakesResponse.ok) {
        const stakesData = await stakesResponse.json();
        setUserStakes(stakesData);
      }

      // Fetch recent transactions
      const transactionsResponse = await fetch('/api/dashboard/transactions', {
        credentials: 'include'
      });
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getPoolStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-error';
      case 'paused':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  const getStakeStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'completed':
        return 'badge-staking';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-success';
    }
  };

  const getTransactionIcon = (icon: string) => {
    switch (icon) {
      case 'DollarSign':
        return <DollarSign className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      case 'ArrowDownRight':
        return <ArrowDownRight className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      case 'TrendingUp':
        return <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      case 'Users':
        return <Users className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      case 'Gift':
        return <Gift className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      case 'Coins':
        return <Coins className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
      default:
        return <DollarSign className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />;
    }
  };

  const getTransactionColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-400';
      case 'red':
        return 'text-red-400';
      case 'blue':
        return 'text-blue-400';
      case 'orange':
        return 'text-orange-400';
      case 'purple':
        return 'text-purple-400';
      default:
        return 'text-primary';
    }
  };

  const getTransactionBgColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500/20';
      case 'red':
        return 'bg-red-500/20';
      case 'blue':
        return 'bg-blue-500/20';
      case 'orange':
        return 'bg-orange-500/20';
      case 'purple':
        return 'bg-purple-500/20';
      default:
        return 'bg-white/20';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-foreground">Loading dashboard...</p>
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-tertiary text-sm sm:text-base">Welcome back! Here's your financial overview.</p>
          </div>
          {userProfile && (
            <div className="flex items-center gap-3 bg-accent/80 rounded-lg px-3 py-2">
              <img
                src={userProfile.avatarUrl || '/placeholder-user.jpg'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div className="text-right">
                <div className="text-primary font-medium text-sm">
                  {userProfile.firstName || userProfile.lastName
                    ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim()
                    : userProfile.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-tertiary text-xs">{userProfile.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Balance</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalBalance)}</p>
              </div>
              <div className="text-primary">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-primary text-xs sm:text-sm">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +2.5%
            </div>
          </div>

          <div className="glass-card-staking p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Staked</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalStaked)}</p>
              </div>
              <div className="text-primary">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-primary text-xs sm:text-sm">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +15.2%
            </div>
          </div>

          <div className="glass-card-reward p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Earned</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalEarned)}</p>
              </div>
              <div className="text-primary">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-primary text-xs sm:text-sm">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +8.7%
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Active Stakes</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{stats.activeStakes}</p>
              </div>
              <div className="text-green-600">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-green-400 text-xs sm:text-sm">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +3
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Deposits</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalDeposits)}</p>
              </div>
              <div className="text-green-600">
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-green-600 text-xs sm:text-sm">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              Completed
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Withdrawals</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalWithdrawals)}</p>
              </div>
              <div className="text-red-500">
                <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-red-500 text-xs sm:text-sm">
              <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              Completed
            </div>
          </div>
        </div>

        {/* Referral Section */}
        {userProfile && (
          <div className="glass-card p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-primary mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-accent" />Your Referral Link</h2>
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm select-all">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${userProfile.referralCode}`}
                </span>
                <button
                  className="btn-gradient px-3 py-2 rounded-lg text-sm font-semibold"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${userProfile.referralCode}`);
                    }
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-primary text-sm">
                <span className="font-semibold">Successful Referrals:</span> {stats.referralCount !== undefined ? stats.referralCount : 0}
              </div>
              <div className="text-accent text-sm">
                <span className="font-semibold">Total Referral Earnings:</span> {formatCurrency(stats.referralEarnings)}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <Link href="/dashboard/staking" className="glass-card p-2 sm:p-3 lg:p-6 hover:bg-green-50/50 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Stake Now</h3>
                <p className="text-tertiary text-xs sm:text-sm">Earn up to 25% APY</p>
              </div>
              <div className="text-green-600">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/rewards" className="glass-card p-2 sm:p-3 lg:p-6 hover:bg-green-50/50 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Claim Rewards</h3>
                <p className="text-tertiary text-xs sm:text-sm">Daily bonuses available</p>
              </div>
              <div className="text-green-600">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/referrals" className="glass-card p-2 sm:p-3 lg:p-6 hover:bg-green-50/50 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Invite Friends</h3>
                <p className="text-tertiary text-xs sm:text-sm">Earn referral bonuses</p>
              </div>
              <div className="text-green-600">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/withdraw" className="glass-card p-2 sm:p-3 lg:p-6 hover:bg-green-50/50 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Withdraw</h3>
                <p className="text-tertiary text-xs sm:text-sm">Instant withdrawals</p>
              </div>
              <div className="text-green-600">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
          </Link>
        </div>

        {/* Staking Pools */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Staking Pools</h2>
            <Link href="/dashboard/staking" className="text-green-600 hover:text-green-700 transition-colors text-xs sm:text-sm lg:text-base">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {stakingPools.slice(0, 3).map((pool) => (
              <div key={pool.id} className="glass-card-staking p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{pool.name}</h3>
                  <span className={`badge text-xs ${getPoolStatusColor(pool.status)}`}>
                    {pool.status}
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">APY</span>
                    <span className="text-accent font-semibold text-xs sm:text-sm">{formatPercentage(pool.apy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Min Stake</span>
                    <span className="text-primary text-xs sm:text-sm">{formatCurrency(pool.minStake)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Lock Period</span>
                    <span className="text-primary text-xs sm:text-sm">{pool.lockPeriod} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Total Staked</span>
                    <span className="text-primary text-xs sm:text-sm">{formatCurrency(pool.totalStaked)}</span>
                  </div>
                  {pool.userStake && (
                    <div className="flex justify-between">
                      <span className="text-tertiary text-xs sm:text-sm">Your Stake</span>
                      <span className="text-accent text-xs sm:text-sm">{formatCurrency(pool.userStake.amount)}</span>
                    </div>
                  )}
                </div>
                <Link 
                  href={`/dashboard/staking/${pool.id}`}
                  className="btn-gradient-staking w-full mt-3 sm:mt-4 py-1 sm:py-2 rounded-lg text-center block text-xs sm:text-sm lg:text-base"
                >
                  {pool.userStake ? 'Manage Stake' : 'Stake Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Active Stakes */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Active Stakes</h2>
            <Link href="/dashboard/staking" className="text-green-600 hover:text-green-700 transition-colors text-xs sm:text-sm lg:text-base">
              View All
            </Link>
          </div>
          <div className="glass-table overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Pool</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Amount</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">APY</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">Start Date</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">End Date</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Rewards</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {userStakes.slice(0, 5).map((stake) => (
                  <tr key={stake.id}>
                                    <td className="text-primary font-medium text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{stake.poolName}</td>
                <td className="text-primary text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(stake.amount)}</td>
                    <td className="text-green-600 font-semibold text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatPercentage(stake.apy)}</td>
                    <td className="text-tertiary text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{new Date(stake.startDate).toLocaleDateString()}</td>
                    <td className="text-tertiary text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{stake.endDate ? new Date(stake.endDate).toLocaleDateString() : 'Flexible'}</td>
                    <td className="text-green-600 text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(stake.rewardsEarned)}</td>
                    <td className="p-1 sm:p-2 lg:p-3">
                      <span className={`badge text-xs ${getStakeStatusColor(stake.status)}`}>
                        {stake.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">Recent Activity</h2>
          <div className="glass-card p-3 sm:p-4 lg:p-6">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                </div>
                <h3 className="text-primary font-semibold text-lg mb-2">No Recent Activity</h3>
                                  <p className="text-tertiary text-sm">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${getTransactionBgColor(transaction.color)}`}>
                        {getTransactionIcon(transaction.icon)}
                      </div>
                      <div>
                        <p className="text-primary font-medium text-xs sm:text-sm lg:text-base">{transaction.title}</p>
                        <p className="text-tertiary text-xs sm:text-sm">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-primary font-semibold text-xs sm:text-sm lg:text-base ${getTransactionColor(transaction.color)}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-tertiary text-xs sm:text-sm">{formatTimeAgo(transaction.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
