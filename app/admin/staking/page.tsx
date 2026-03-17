'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Plus,
  Trash2,
  Settings,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Upload,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { Tabs } from '@/components/ui/tabs'; // If you have a tabs component, otherwise use state

interface StakingPool {
  id: string;
  name: string;
  description: string;
  apy: number;
  min_stake: number;
  max_stake: number;
  lock_period: number;
  total_staked: number;
  total_users: number;
  status: 'active' | 'inactive' | 'paused';
  created_at: string;
  updated_at: string;
  features: string[];
  rewards_distributed: number;
  total_rewards: number;
}

export default function StakingPoolManagement() {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pools' | 'stakes'>('pools');
  const [userStakes, setUserStakes] = useState<any[]>([]);
  const [stakesLoading, setStakesLoading] = useState(false);
  const [stakeSearch, setStakeSearch] = useState('');
  const [stakePoolFilter, setStakePoolFilter] = useState('all');
  const [stakeStatusFilter, setStakeStatusFilter] = useState('all');
  const [editStake, setEditStake] = useState<any | null>(null);
  const [editStakeModal, setEditStakeModal] = useState(false);
  const [editStakeForm, setEditStakeForm] = useState({ amount: '', status: '', end_date: '' });
  const [editStakeLoading, setEditStakeLoading] = useState(false);
  const [editStakeError, setEditStakeError] = useState('');
  const [editStakeSuccess, setEditStakeSuccess] = useState('');
  const [editPool, setEditPool] = useState<StakingPool | null>(null);
  const [editPoolModal, setEditPoolModal] = useState(false);
  const [editPoolForm, setEditPoolForm] = useState({
    id: '',
    name: '',
    description: '',
    apy: '',
    min_stake: '',
    max_stake: '',
    lock_period: '',
    features: '',
    status: 'active',
  });
  const [editPoolLoading, setEditPoolLoading] = useState(false);
  const [editPoolError, setEditPoolError] = useState('');
  const [editPoolSuccess, setEditPoolSuccess] = useState('');
  const [createPoolForm, setCreatePoolForm] = useState({
    name: '',
    description: '',
    apy: '',
    min_stake: '',
    max_stake: '',
    lock_period: '',
    features: '',
    status: 'active',
  });
  const [createPoolLoading, setCreatePoolLoading] = useState(false);
  const [createPoolError, setCreatePoolError] = useState('');
  const [createPoolSuccess, setCreatePoolSuccess] = useState('');
  const [deletePoolId, setDeletePoolId] = useState<string | null>(null);
  const [deletePoolLoading, setDeletePoolLoading] = useState(false);
  const [deletePoolError, setDeletePoolError] = useState('');

  useEffect(() => {
    fetchPools();
    fetchUserStakes();
  }, []);

  const fetchPools = async () => {
    try {
      const response = await fetch('/api/admin/staking');
      if (response.ok) {
        const data = await response.json();
        setPools(data);
      }
    } catch (error) {
      console.error('Error fetching staking pools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStakes = async () => {
    setStakesLoading(true);
    try {
      const response = await fetch('/api/admin/staking/user-stakes');
      if (response.ok) {
        setUserStakes(await response.json());
      }
    } catch (error) {
      console.error('Error fetching user stakes:', error);
    } finally {
      setStakesLoading(false);
    }
  };

  const handlePoolAction = async (poolId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/staking/${poolId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh pools list
        fetchPools();
      }
    } catch (error) {
      console.error('Error performing pool action:', error);
    }
  };

  // Create Pool handler
  const handleCreatePool = async () => {
    setCreatePoolLoading(true);
    setCreatePoolError('');
    setCreatePoolSuccess('');
    try {
      const res = await fetch('/api/admin/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createPoolForm.name,
          description: createPoolForm.description,
          apy: parseFloat(createPoolForm.apy),
          min_stake: parseFloat(createPoolForm.min_stake),
          max_stake: parseFloat(createPoolForm.max_stake),
          lock_period: parseInt(createPoolForm.lock_period),
          features: createPoolForm.features.split(',').map(f => f.trim()).filter(Boolean),
          status: createPoolForm.status,
        }),
      });
      if (res.ok) {
        setCreatePoolSuccess('Pool created!');
        setShowCreateModal(false);
        setCreatePoolForm({ name: '', description: '', apy: '', min_stake: '', max_stake: '', lock_period: '', features: '', status: 'active' });
        fetchPools();
      } else {
        const data = await res.json();
        setCreatePoolError(data.error || 'Failed to create pool');
      }
    } catch (e) {
      setCreatePoolError('Failed to create pool');
    } finally {
      setCreatePoolLoading(false);
    }
  };

  // Edit Pool handler
  const handleEditPool = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/staking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowEditModal(false);
        fetchPools();
      }
    } catch (error) {
      console.error('Error editing pool:', error);
    }
  };

  // Delete Pool handler
  const handleDeletePool = async () => {
    if (!deletePoolId) return;
    setDeletePoolLoading(true);
    setDeletePoolError('');
    try {
      const res = await fetch('/api/admin/staking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletePoolId }),
      });
      if (res.ok) {
        setDeletePoolId(null);
        fetchPools();
      } else {
        const data = await res.json();
        setDeletePoolError(data.error || 'Failed to delete pool');
      }
    } catch (e) {
      setDeletePoolError('Failed to delete pool');
    } finally {
      setDeletePoolLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-error';
      case 'paused':
        return 'badge-warning';
      default:
        return 'badge-warning';
    }
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pool.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalStaked = pools.reduce((sum, pool) => sum + pool.total_staked, 0);
  const totalUsers = pools.reduce((sum, pool) => sum + pool.total_users, 0);
  const activePools = pools.filter(pool => pool.status === 'active').length;

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

  // Open edit modal
  const openEditStakeModal = (stake: any) => {
    setEditStake(stake);
    setEditStakeForm({
      amount: stake.amount,
      status: stake.status,
      end_date: stake.end_date ? stake.end_date.slice(0, 10) : '',
    });
    setEditStakeError('');
    setEditStakeSuccess('');
    setEditStakeModal(true);
  };

  // Save edit
  const handleEditStakeSave = async () => {
    setEditStakeLoading(true);
    setEditStakeError('');
    setEditStakeSuccess('');
    try {
      const res = await fetch('/api/admin/staking/user-stakes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editStake.id,
          amount: parseFloat(editStakeForm.amount),
          status: editStakeForm.status,
          end_date: editStakeForm.end_date ? new Date(editStakeForm.end_date).toISOString() : null,
        }),
      });
      if (res.ok) {
        setEditStakeSuccess('Stake updated!');
        setEditStakeModal(false);
        fetchUserStakes();
      } else {
        const data = await res.json();
        setEditStakeError(data.error || 'Failed to update stake');
      }
    } catch (e) {
      setEditStakeError('Failed to update stake');
    } finally {
      setEditStakeLoading(false);
    }
  };

  // Open edit pool modal
  const openEditPoolModal = (pool: StakingPool) => {
    setEditPool(pool);
    setEditPoolForm({
      id: pool.id,
      name: pool.name,
      description: pool.description,
      apy: pool.apy.toString(),
      min_stake: pool.min_stake.toString(),
      max_stake: pool.max_stake.toString(),
      lock_period: pool.lock_period.toString(),
      features: (pool.features || []).join(','),
      status: pool.status,
    });
    setEditPoolError('');
    setEditPoolSuccess('');
    setEditPoolModal(true);
  };

  // Save edit pool
  const handleEditPoolSave = async () => {
    setEditPoolLoading(true);
    setEditPoolError('');
    setEditPoolSuccess('');
    try {
      const res = await fetch('/api/admin/staking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editPoolForm.id,
          name: editPoolForm.name,
          description: editPoolForm.description,
          apy: parseFloat(editPoolForm.apy),
          min_stake: parseFloat(editPoolForm.min_stake),
          max_stake: parseFloat(editPoolForm.max_stake),
          lock_period: parseInt(editPoolForm.lock_period),
          features: editPoolForm.features.split(',').map(f => f.trim()).filter(Boolean),
          status: editPoolForm.status,
        }),
      });
      if (res.ok) {
        setEditPoolSuccess('Pool updated!');
        setEditPoolModal(false);
        fetchPools();
      } else {
        const data = await res.json();
        setEditPoolError(data.error || 'Failed to update pool');
      }
    } catch (e) {
      setEditPoolError('Failed to update pool');
    } finally {
      setEditPoolLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button onClick={() => setActiveTab('pools')} className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'pools' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black' : 'glass-card text-white'}`}>Pools</button>
          <button onClick={() => setActiveTab('stakes')} className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'stakes' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black' : 'glass-card text-white'}`}>User Stakes</button>
        </div>
        {activeTab === 'pools' && (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Staking Pool Management</h1>
                  <p className="text-gray-300">Create and manage staking pools</p>
                </div>
                <div className="flex gap-4">
                  <button className="glass-card px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors">
                    <Download className="w-5 h-5 mr-2" />
                    Export
                  </button>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-gradient px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Pool
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{pools.length}</div>
                <div className="text-gray-300">Total Pools</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-staking mb-2">{activePools}</div>
                <div className="text-gray-300">Active Pools</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient-reward mb-2">{formatCurrency(totalStaked)}</div>
                <div className="text-gray-300">Total Staked</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{formatNumber(totalUsers)}</div>
                <div className="text-gray-300">Total Users</div>
              </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search Pools</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="glass-input w-full pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="glass-input w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn-gradient-staking px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
                    <Filter className="w-5 h-5 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Pools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredPools.map((pool) => (
                <div key={pool.id} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{pool.name}</h3>
                        <span className={`badge ${getStatusColor(pool.status)}`}>
                          {pool.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPool(pool);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditPoolModal(pool)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{pool.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">APY</span>
                      <span className="text-green-400 font-semibold">{pool.apy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Staked</span>
                      <span className="text-white font-semibold">{formatCurrency(pool.total_staked)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Users</span>
                      <span className="text-white font-semibold">{formatNumber(pool.total_users)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Lock Period</span>
                      <span className="text-white font-semibold">{pool.lock_period} days</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Min Stake</span>
                      <span className="text-white font-semibold">{formatCurrency(pool.min_stake)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Max Stake</span>
                      <span className="text-white font-semibold">{formatCurrency(pool.max_stake)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {pool.status === 'active' ? (
                      <button
                        onClick={() => handlePoolAction(pool.id, 'pause')}
                        className="flex-1 btn-gradient-reward py-2 rounded-lg text-sm font-semibold"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePoolAction(pool.id, 'activate')}
                        className="flex-1 btn-gradient-staking py-2 rounded-lg text-sm font-semibold"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => setDeletePoolId(pool.id)}
                      className="flex-1 glass-card py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPools.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Staking Pools</h3>
                <p className="text-gray-300">No pools match your current filters</p>
              </div>
            )}

            {/* Analytics Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pool Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-staking mb-2">15.2%</div>
                  <div className="text-gray-300">Average APY</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-reward mb-2">$125K</div>
                  <div className="text-gray-300">Total Rewards Distributed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-2">2.5M</div>
                  <div className="text-gray-300">Total Platform Value</div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'stakes' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">All User Stakes</h2>
            <div className="flex gap-4 mb-4">
              <input type="text" value={stakeSearch} onChange={e => setStakeSearch(e.target.value)} placeholder="Search by user email..." className="glass-input" />
              <select value={stakePoolFilter} onChange={e => setStakePoolFilter(e.target.value)} className="glass-input">
                <option value="all">All Pools</option>
                {pools.map(pool => <option key={pool.id} value={pool.id}>{pool.name}</option>)}
              </select>
              <select value={stakeStatusFilter} onChange={e => setStakeStatusFilter(e.target.value)} className="glass-input">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-gray-300">User</th>
                    <th className="text-left p-2 text-gray-300">Pool</th>
                    <th className="text-left p-2 text-gray-300">Amount</th>
                    <th className="text-left p-2 text-gray-300">APY</th>
                    <th className="text-left p-2 text-gray-300">Status</th>
                    <th className="text-left p-2 text-gray-300">Start</th>
                    <th className="text-left p-2 text-gray-300">End</th>
                    <th className="text-left p-2 text-gray-300">Rewards</th>
                    <th className="text-left p-2 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stakesLoading ? (
                    <tr><td colSpan={9} className="text-center text-white p-4">Loading...</td></tr>
                  ) : userStakes.filter(stake => {
                    const matchesUser = stake.users?.email?.toLowerCase().includes(stakeSearch.toLowerCase());
                    const matchesPool = stakePoolFilter === 'all' || String(stake.pool_id) === stakePoolFilter;
                    const matchesStatus = stakeStatusFilter === 'all' || stake.status === stakeStatusFilter;
                    return matchesUser && matchesPool && matchesStatus;
                  }).map(stake => (
                    <tr key={stake.id} className="border-b border-white/10">
                      <td className="p-2 text-white">{stake.users?.email || '-'}</td>
                      <td className="p-2 text-white">{stake.staking_pools?.name || '-'}</td>
                      <td className="p-2 text-white">{formatCurrency(stake.amount)}</td>
                      <td className="p-2 text-white">{stake.apy}%</td>
                      <td className="p-2"><span className={`badge text-xs ${getStatusColor(stake.status)}`}>{stake.status}</span></td>
                      <td className="p-2 text-white">{stake.start_date ? new Date(stake.start_date).toLocaleDateString() : '-'}</td>
                      <td className="p-2 text-white">{stake.end_date ? new Date(stake.end_date).toLocaleDateString() : '-'}</td>
                      <td className="p-2 text-green-400">{formatCurrency(stake.rewards_earned || 0)}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => openEditStakeModal(stake)} className="text-yellow-400 hover:text-yellow-300 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-modal p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Create New Pool</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pool Name</label>
                  <input type="text" className="glass-input w-full" value={createPoolForm.name} onChange={e => setCreatePoolForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea className="glass-input w-full h-20" value={createPoolForm.description} onChange={e => setCreatePoolForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">APY (%)</label>
                    <input type="number" className="glass-input w-full" value={createPoolForm.apy} onChange={e => setCreatePoolForm(f => ({ ...f, apy: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Lock Period (days)</label>
                    <input type="number" className="glass-input w-full" value={createPoolForm.lock_period} onChange={e => setCreatePoolForm(f => ({ ...f, lock_period: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Stake</label>
                    <input type="number" className="glass-input w-full" value={createPoolForm.min_stake} onChange={e => setCreatePoolForm(f => ({ ...f, min_stake: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Stake</label>
                    <input type="number" className="glass-input w-full" value={createPoolForm.max_stake} onChange={e => setCreatePoolForm(f => ({ ...f, max_stake: e.target.value }))} />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={handleCreatePool} className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold" disabled={createPoolLoading}>{createPoolLoading ? 'Creating...' : 'Create'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deletePoolId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-modal p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">Delete Staking Pool</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this pool? This action cannot be undone.</p>
              {deletePoolError && <div className="bg-red-500/80 text-white rounded p-2 mb-2">{deletePoolError}</div>}
              <div className="flex gap-4 mt-6">
                <button onClick={() => setDeletePoolId(null)} className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={handleDeletePool} className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold" disabled={deletePoolLoading}>{deletePoolLoading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Pool Details Modal */}
        {showDetailsModal && selectedPool && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Pool Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{selectedPool.name}</h4>
                    <span className={`badge ${getStatusColor(selectedPool.status)}`}>
                      {selectedPool.status}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <p className="text-gray-300">{selectedPool.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-gray-400 text-sm">APY</p>
                    <p className="text-green-400 font-semibold text-lg">{selectedPool.apy}%</p>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-gray-400 text-sm">Total Staked</p>
                    <p className="text-white font-semibold text-lg">{formatCurrency(selectedPool.total_staked)}</p>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-white font-semibold text-lg">{formatNumber(selectedPool.total_users)}</p>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-gray-400 text-sm">Lock Period</p>
                    <p className="text-white font-semibold text-lg">{selectedPool.lock_period} days</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Stake Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <p className="text-gray-400 text-sm">Minimum Stake</p>
                      <p className="text-white font-semibold">{formatCurrency(selectedPool.min_stake)}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-gray-400 text-sm">Maximum Stake</p>
                      <p className="text-white font-semibold">{formatCurrency(selectedPool.max_stake)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Rewards</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <p className="text-gray-400 text-sm">Total Rewards</p>
                      <p className="text-green-400 font-semibold">{formatCurrency(selectedPool.total_rewards)}</p>
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-gray-400 text-sm">Distributed</p>
                      <p className="text-purple-400 font-semibold">{formatCurrency(selectedPool.rewards_distributed)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPool.features.map((feature, index) => (
                      <span key={index} className="badge badge-staking">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowEditModal(true);
                    }}
                    className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold"
                  >
                    Edit Pool
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editStakeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-modal p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">Edit User Stake</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input type="number" className="glass-input w-full" value={editStakeForm.amount} onChange={e => setEditStakeForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select className="glass-input w-full" value={editStakeForm.status} onChange={e => setEditStakeForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input type="date" className="glass-input w-full" value={editStakeForm.end_date} onChange={e => setEditStakeForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
                {editStakeError && <div className="bg-red-500/80 text-white rounded p-2 mb-2">{editStakeError}</div>}
                {editStakeSuccess && <div className="bg-green-500/80 text-white rounded p-2 mb-2">{editStakeSuccess}</div>}
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setEditStakeModal(false)} className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={handleEditStakeSave} className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold" disabled={editStakeLoading}>{editStakeLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {editPoolModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-modal p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">Edit Staking Pool</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pool Name</label>
                  <input type="text" className="glass-input w-full" value={editPoolForm.name} onChange={e => setEditPoolForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea className="glass-input w-full h-20" value={editPoolForm.description} onChange={e => setEditPoolForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">APY (%)</label>
                    <input type="number" className="glass-input w-full" value={editPoolForm.apy} onChange={e => setEditPoolForm(f => ({ ...f, apy: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Lock Period (days)</label>
                    <input type="number" className="glass-input w-full" value={editPoolForm.lock_period} onChange={e => setEditPoolForm(f => ({ ...f, lock_period: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Stake</label>
                    <input type="number" className="glass-input w-full" value={editPoolForm.min_stake} onChange={e => setEditPoolForm(f => ({ ...f, min_stake: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Stake</label>
                    <input type="number" className="glass-input w-full" value={editPoolForm.max_stake} onChange={e => setEditPoolForm(f => ({ ...f, max_stake: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Features (comma separated)</label>
                  <input type="text" className="glass-input w-full" value={editPoolForm.features} onChange={e => setEditPoolForm(f => ({ ...f, features: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select className="glass-input w-full" value={editPoolForm.status} onChange={e => setEditPoolForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                {editPoolError && <div className="bg-red-500/80 text-white rounded p-2 mb-2">{editPoolError}</div>}
                {editPoolSuccess && <div className="bg-green-500/80 text-white rounded p-2 mb-2">{editPoolSuccess}</div>}
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setEditPoolModal(false)} className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={handleEditPoolSave} className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold" disabled={editPoolLoading}>{editPoolLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 