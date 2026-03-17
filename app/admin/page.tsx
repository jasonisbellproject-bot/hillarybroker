'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Settings,
  Shield,
  Activity,
  PieChart,
  Calendar,
  Target,
  Zap,
  Wallet,
  CreditCard,
  Bitcoin
} from 'lucide-react';
import Link from 'next/link';
import { getAuthHeaders } from '@/lib/client-auth';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalStaked: number;
  totalInvested: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'stake_created' | 'investment_made' | 'withdrawal_requested' | 'reward_claimed';
  user: string;
  amount?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalStaked: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin statistics
      const statsResponse = await fetch('/api/admin/stats');
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        console.log('Stats loaded:', statsData);
      } else {
        console.error('Failed to fetch stats:', statsResponse.status, statsResponse.statusText);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity');
      
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
        console.log('Activity loaded:', activityData);
      } else {
        console.error('Failed to fetch activity:', activityResponse.status, activityResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <Users className="w-4 h-4" />;
      case 'stake_created':
        return <TrendingUp className="w-4 h-4" />;
      case 'investment_made':
        return <Target className="w-4 h-4" />;
      case 'withdrawal_requested':
        return <Wallet className="w-4 h-4" />;
      case 'reward_claimed':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'text-blue-400';
      case 'stake_created':
        return 'text-purple-400';
      case 'investment_made':
        return 'text-green-400';
      case 'withdrawal_requested':
        return 'text-orange-400';
      case 'reward_claimed':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
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
            <p className="text-white">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your platform and monitor performance</p>
            </div>
            <div className="flex gap-4">
              <button className="btn-gradient px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              <button className="glass-card px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </button>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.totalUsers)}</p>
                <p className="text-green-400 text-sm">+{stats.monthlyGrowth}% this month</p>
              </div>
              <div className="text-blue-400">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Staked</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalStaked)}</p>
                <p className="text-purple-400 text-sm">Active investments</p>
              </div>
              <div className="text-purple-400">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-green-400 text-sm">Platform earnings</p>
              </div>
              <div className="text-green-400">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.pendingWithdrawals)}</p>
                <p className="text-orange-400 text-sm">Require approval</p>
              </div>
              <div className="text-orange-400">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/users" className="glass-card p-6 card-hover">
              <div className="text-blue-400 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">User Management</h3>
              <p className="text-gray-300 text-sm mb-4">Manage users, KYC, and account status</p>
              <div className="flex items-center text-yellow-400 text-sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                Manage Users
              </div>
            </Link>

            <Link href="/admin/staking" className="glass-card p-6 card-hover">
              <div className="text-purple-400 mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Staking Pools</h3>
              <p className="text-gray-300 text-sm mb-4">Create and manage staking pools</p>
              <div className="flex items-center text-yellow-400 text-sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                Manage Pools
              </div>
            </Link>

            <Link href="/admin/investments" className="glass-card p-6 card-hover">
              <div className="text-green-400 mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Investment Plans</h3>
              <p className="text-gray-300 text-sm mb-4">Configure investment plans and returns</p>
              <div className="flex items-center text-yellow-400 text-sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                Manage Plans
              </div>
            </Link>

            <Link href="/admin/withdrawals" className="glass-card p-6 card-hover">
              <div className="text-orange-400 mb-4">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Withdrawals</h3>
              <p className="text-gray-300 text-sm mb-4">Approve and process withdrawals</p>
              <div className="flex items-center text-yellow-400 text-sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                Process Requests
              </div>
            </Link>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Overview */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Platform Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Users</span>
                <span className="text-white font-semibold">{formatNumber(stats.activeUsers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Invested</span>
                <span className="text-white font-semibold">{formatCurrency(stats.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Withdrawn</span>
                <span className="text-white font-semibold">{formatCurrency(stats.totalWithdrawn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Growth</span>
                <span className="text-green-400 font-semibold">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 glass-card rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={getActivityColor(activity.type)}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white text-sm">{activity.user}</p>
                      <p className="text-gray-400 text-xs">
                        {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {activity.amount && ` - ${formatCurrency(activity.amount)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$2.5M+</div>
            <div className="text-gray-300">Total Platform Value</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">15.2%</div>
            <div className="text-gray-300">Average APY</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">98.5%</div>
            <div className="text-gray-300">User Satisfaction</div>
          </div>
        </div>

        {/* Admin Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/analytics" className="glass-card p-6 card-hover">
              <div className="text-blue-400 mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-gray-300 text-sm">Detailed platform analytics and reports</p>
            </Link>

            <Link href="/admin/security" className="glass-card p-6 card-hover">
              <div className="text-red-400 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Security</h3>
              <p className="text-gray-300 text-sm">Security settings and monitoring</p>
            </Link>

            <Link href="/admin/settings" className="glass-card p-6 card-hover">
              <div className="text-gray-400 mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-white font-semibold mb-2">Settings</h3>
              <p className="text-gray-300 text-sm">Platform configuration and preferences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
