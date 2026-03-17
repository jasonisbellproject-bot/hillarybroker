'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users,
  Zap,
  Star,
  ArrowRight,
  Lock,
  Target,
  BarChart3,
  Shield
} from 'lucide-react';

interface StakingPool {
  id: number;
  name: string;
  apy: number;
  minStake: number;
  maxStake: number;
  lockPeriod: number;
  totalStaked: number;
  maxCapacity: number;
  status: 'active' | 'full' | 'coming_soon';
  description?: string;
}

export default function StakingPoolsPage() {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      // Fetch staking pools
      const response = await fetch('/api/staking/pools', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPools(data);
      }
    } catch (error) {
      console.error('Error fetching pools:', error);
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
      case 'full':
        return 'badge-warning';
      case 'coming_soon':
        return 'badge-error';
      default:
        return 'badge-success';
    }
  };

  const getPoolStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Available';
      case 'full':
        return 'Full';
      case 'coming_soon':
        return 'Coming Soon';
      default:
        return 'Available';
    }
  };

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount) return;

    try {
      const response = await fetch('/api/staking/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          poolId: selectedPool.id,
          amount: parseFloat(stakeAmount),
        }),
      });

      if (response.ok) {
        setShowStakeModal(false);
        setSelectedPool(null);
        setStakeAmount('');
        // Refresh pools
        fetchPools();
      }
    } catch (error) {
      console.error('Error creating stake:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading staking pools...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Staking Pools</h1>
              <p className="text-gray-300">Choose from our high-yield staking options</p>
            </div>
            <Link 
              href="/staking/my-stakes" 
              className="btn-gradient px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              My Stakes
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$50M+</div>
            <div className="text-gray-300">Total Value Locked</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">25%</div>
            <div className="text-gray-300">Max APY</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">10K+</div>
            <div className="text-gray-300">Active Stakers</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$2M+</div>
            <div className="text-gray-300">Total Rewards Paid</div>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <div key={pool.id} className="glass-card-staking p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{pool.name}</h3>
                <span className={`badge ${getPoolStatusColor(pool.status)}`}>
                  {getPoolStatusText(pool.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">APY</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {formatPercentage(pool.apy)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Min Stake</span>
                  <span className="text-white font-medium">
                    {formatCurrency(pool.minStake)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Max Stake</span>
                  <span className="text-white font-medium">
                    {formatCurrency(pool.maxStake)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Lock Period</span>
                  <span className="text-white font-medium">
                    {pool.lockPeriod} days
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Capacity</span>
                    <span className="text-white">
                      {formatCurrency(pool.totalStaked)} / {formatCurrency(pool.maxCapacity)}
                    </span>
                  </div>
                  <div className="progress-bar h-2">
                    <div 
                      className="progress-fill-staking h-full rounded-full"
                      style={{ width: `${(pool.totalStaked / pool.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {((pool.totalStaked / pool.maxCapacity) * 100).toFixed(1)}% filled
                  </p>
                </div>

                {pool.description && (
                  <p className="text-gray-300 text-sm">{pool.description}</p>
                )}

                <button
                  onClick={() => {
                    setSelectedPool(pool);
                    setShowStakeModal(true);
                  }}
                  disabled={pool.status !== 'active'}
                  className="btn-gradient-staking w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pool.status === 'active' ? 'Stake Now' : 
                   pool.status === 'full' ? 'Pool Full' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Why Choose Our Staking Pools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-purple-400 mb-4">
                <Zap className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">High APY</h3>
              <p className="text-gray-300 text-sm">
                Earn up to 50% APY with our premium staking pools
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-orange-400 mb-4">
                <Shield className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure</h3>
              <p className="text-gray-300 text-sm">
                Bank-level security with multi-signature technology
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-green-400 mb-4">
                <Clock className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Flexible</h3>
              <p className="text-gray-300 text-sm">
                Choose from 1-day to 180-day lock periods
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">
              Stake in {selectedPool.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Stake
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="glass-input w-full"
                  placeholder={`Min: ${formatCurrency(selectedPool.minStake)}`}
                  min={selectedPool.minStake}
                  max={selectedPool.maxStake}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">APY:</span>
                  <span className="text-purple-400 font-semibold">
                    {formatPercentage(selectedPool.apy)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Lock Period:</span>
                  <span className="text-white">{selectedPool.lockPeriod} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Daily:</span>
                  <span className="text-green-400">
                    {formatCurrency((parseFloat(stakeAmount) || 0) * (selectedPool.apy / 100) / 365)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake}
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 