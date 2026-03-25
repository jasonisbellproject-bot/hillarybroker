'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Target,
  Activity,
  Wallet,
  LineChart,
  Flame,
  Eye
} from 'lucide-react';

// Dynamically import TradingView widgets to avoid SSR issues
const TradingViewWidget = dynamic(() => import('../../components/TradingViewWidget'), { ssr: false });
const TradingViewTickerTape = dynamic(() => import('../../components/TradingViewTickerTape'), { ssr: false });
const TradingViewMarketOverview = dynamic(() => import('../../components/TradingViewMarketOverview'), { ssr: false });
const TradingViewHotlist = dynamic(() => import('../../components/TradingViewHotlist'), { ssr: false });

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
  const [activeChartTab, setActiveChartTab] = useState<'chart' | 'overview' | 'hotlist'>('chart');

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
      {/* Live Ticker Tape - Scrolling crypto prices at the top */}
      <div className="w-full border-b border-border/30 bg-black/20 backdrop-blur-sm">
        <TradingViewTickerTape />
      </div>

      <div className="max-w-7xl mx-auto pt-4 sm:pt-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
              <span className="inline-flex items-center gap-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-500" />
                Trading Dashboard
              </span>
            </h1>
            <p className="text-tertiary text-sm sm:text-base">Real-time market data &amp; portfolio overview</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Live</span>
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
        </div>

        {/* Portfolio Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Balance - Highlighted */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300 col-span-2 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Total Balance</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                </div>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalBalance)}</p>
              <div className="flex items-center mt-1 text-green-400 text-xs">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>+2.5%</span>
              </div>
            </div>
          </div>

          {/* Total Staked */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Total Staked</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{formatCurrency(stats.totalStaked)}</p>
              <div className="flex items-center mt-1 text-emerald-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                <span>+15.2%</span>
              </div>
            </div>
          </div>

          {/* Total Earned */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Total Earned</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                </div>
              </div>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{formatCurrency(stats.totalEarned)}</p>
              <div className="flex items-center mt-1 text-teal-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                <span>+8.7%</span>
              </div>
            </div>
          </div>

          {/* Active Stakes */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Active Stakes</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                </div>
              </div>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{stats.activeStakes}</p>
              <div className="flex items-center mt-1 text-cyan-400 text-xs">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                <span>+3</span>
              </div>
            </div>
          </div>

          {/* Total Deposits */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Total Deposits</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                </div>
              </div>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{formatCurrency(stats.totalDeposits)}</p>
              <div className="flex items-center mt-1 text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Total Withdrawals */}
          <div className="glass-card p-3 sm:p-4 lg:p-5 relative overflow-hidden group hover:border-red-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-tertiary text-xs sm:text-sm">Withdrawals</p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </div>
              </div>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{formatCurrency(stats.totalWithdrawals)}</p>
              <div className="flex items-center mt-1 text-red-400 text-xs">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        {userProfile && (
          <div className="glass-card p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
            <div className="relative">
              <h2 className="text-base sm:text-lg font-bold text-primary mb-2 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />Your Referral Link
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg text-xs sm:text-sm select-all font-mono">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${userProfile.referralCode}`}
                </span>
                <button
                  className="btn-gradient px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:scale-105 transition-transform duration-200"
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
            <div className="relative flex flex-col gap-2 md:items-end">
              <div className="text-primary text-sm">
                <span className="font-semibold">Successful Referrals:</span> {stats.referralCount !== undefined ? stats.referralCount : 0}
              </div>
              <div className="text-green-400 text-sm">
                <span className="font-semibold">Total Referral Earnings:</span> {formatCurrency(stats.referralEarnings)}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <Link href="/dashboard/staking" className="glass-card p-3 sm:p-4 lg:p-5 group hover:border-green-500/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Stake Now</h3>
                <p className="text-tertiary text-xs sm:text-sm">Earn up to 25% APY</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/rewards" className="glass-card p-3 sm:p-4 lg:p-5 group hover:border-amber-500/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Claim Rewards</h3>
                <p className="text-tertiary text-xs sm:text-sm">Daily bonuses available</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/referrals" className="glass-card p-3 sm:p-4 lg:p-5 group hover:border-blue-500/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Invite Friends</h3>
                <p className="text-tertiary text-xs sm:text-sm">Earn referral bonuses</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/withdraw" className="glass-card p-3 sm:p-4 lg:p-5 group hover:border-purple-500/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">Withdraw</h3>
                <p className="text-tertiary text-xs sm:text-sm">Instant withdrawals</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
            </div>
          </Link>
        </div>

        {/* ===== TRADING SECTION ===== */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {/* Section Header with Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary flex items-center gap-2">
              <LineChart className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              Live Markets
            </h2>
            <div className="flex items-center bg-background/50 border border-border/50 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveChartTab('chart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeChartTab === 'chart'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-tertiary hover:text-primary'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Chart
              </button>
              <button
                onClick={() => setActiveChartTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeChartTab === 'overview'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-tertiary hover:text-primary'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Overview
              </button>
              <button
                onClick={() => setActiveChartTab('hotlist')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeChartTab === 'hotlist'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-tertiary hover:text-primary'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Hot
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="glass-card p-0 overflow-hidden h-[420px] sm:h-[500px] lg:h-[600px] relative">
            {/* Subtle glow effect on border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-green-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <div className={`h-full w-full transition-opacity duration-300 ${activeChartTab === 'chart' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <TradingViewWidget />
            </div>
            <div className={`h-full w-full transition-opacity duration-300 ${activeChartTab === 'overview' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <TradingViewMarketOverview />
            </div>
            <div className={`h-full w-full transition-opacity duration-300 ${activeChartTab === 'hotlist' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
              <TradingViewHotlist />
            </div>
          </div>
        </div>

        {/* Staking Pools */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary flex items-center gap-2">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              Staking Pools
            </h2>
            <Link href="/dashboard/staking" className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm lg:text-base font-medium">
              View All
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {stakingPools.slice(0, 3).map((pool) => (
              <div key={pool.id} className="glass-card p-3 sm:p-4 lg:p-6 group hover:border-green-500/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{pool.name}</h3>
                    <span className={`badge text-xs ${getPoolStatusColor(pool.status)}`}>
                      {pool.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-tertiary text-xs sm:text-sm">APY</span>
                      <span className="text-green-400 font-semibold text-xs sm:text-sm">{formatPercentage(pool.apy)}</span>
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
                        <span className="text-green-400 text-xs sm:text-sm">{formatCurrency(pool.userStake.amount)}</span>
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/dashboard/staking/${pool.id}`}
                    className="btn-gradient w-full mt-3 sm:mt-4 py-2 rounded-lg text-center block text-xs sm:text-sm lg:text-base hover:scale-[1.02] transition-transform duration-200"
                  >
                    {pool.userStake ? 'Manage Stake' : 'Stake Now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout: Active Stakes + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          {/* Active Stakes */}
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                Active Stakes
              </h2>
              <Link href="/dashboard/staking" className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm font-medium">
                View All
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="glass-card overflow-hidden">
              {userStakes.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <Coins className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-primary font-semibold text-sm mb-1">No Active Stakes</h3>
                  <p className="text-tertiary text-xs">Start staking to earn rewards</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {userStakes.slice(0, 4).map((stake) => (
                    <div key={stake.id} className="p-3 sm:p-4 hover:bg-white/5 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Coins className="w-3.5 h-3.5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-primary font-medium text-xs sm:text-sm">{stake.poolName}</p>
                            <p className="text-tertiary text-xs">{formatPercentage(stake.apy)} APY</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-semibold text-xs sm:text-sm">{formatCurrency(stake.amount)}</p>
                          <span className={`badge text-xs ${getStakeStatusColor(stake.status)}`}>
                            {stake.status}
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-tertiary mb-1">
                          <span>Rewards: {formatCurrency(stake.rewardsEarned)}</span>
                          <span>{stake.progress}%</span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div
                            className="progress-fill rounded-full"
                            style={{ width: `${Math.min(stake.progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                Recent Activity
              </h2>
              <Link href="/dashboard/transactions" className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-xs sm:text-sm font-medium">
                View All
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="glass-card overflow-hidden">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-primary font-semibold text-sm mb-1">No Recent Activity</h3>
                  <p className="text-tertiary text-xs">Your transaction history will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTransactionBgColor(transaction.color)}`}>
                          {getTransactionIcon(transaction.icon)}
                        </div>
                        <div>
                          <p className="text-primary font-medium text-xs sm:text-sm">{transaction.title}</p>
                          <p className="text-tertiary text-xs">{formatTimeAgo(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-xs sm:text-sm ${getTransactionColor(transaction.color)}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-tertiary text-xs capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
