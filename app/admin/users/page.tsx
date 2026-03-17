'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Plus,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  kyc_verified: boolean;
  two_factor_enabled: boolean;
  is_admin: boolean;
  status: 'active' | 'suspended' | 'pending';
  total_earned: number;
  total_staked: number;
  wallet_balance: number;
  total_deposits?: number;
  total_withdrawals?: number;
  referral_earnings?: number;
  referral_count?: number;
  created_at: string;
  last_sign_in_at?: string;
  referral_code: string;
  referred_by?: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycReviewData, setKycReviewData] = useState({
    status: 'pending',
    notes: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    wallet_balance: 0,
    total_earned: 0,
    total_deposits: 0,
    total_withdrawals: 0,
    referral_earnings: 0,
    referral_count: 0,
    kyc_verified: false,
    two_factor_enabled: false,
    is_admin: false,
    status: 'active',
    referral_code: '',
    referred_by: ''
  });

  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    is_admin: false,
    kyc_verified: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Request a higher limit to show more users
      const response = await fetch('/api/admin/users?limit=100');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users API response:', data);
        
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Invalid users data format:', data);
          setUsers([]);
        }
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh users list
        fetchUsers();
        
        toast({
          title: "Success",
          description: data.message || `${action} completed successfully`,
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to perform user action:', response.status, errorData);
        
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${action} user`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      wallet_balance: user.wallet_balance,
      total_earned: user.total_earned,
      total_deposits: user.total_deposits || 0,
      total_withdrawals: user.total_withdrawals || 0,
      referral_earnings: user.referral_earnings || 0,
      referral_count: user.referral_count || 0,
      kyc_verified: user.kyc_verified,
      two_factor_enabled: user.two_factor_enabled,
      is_admin: user.is_admin,
      status: user.status,
      referral_code: user.referral_code,
      referred_by: user.referred_by || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setShowEditModal(false);
        fetchUsers(); // Refresh the user list
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to update user:', response.status, errorData);
        
        toast({
          title: "Error",
          description: errorData.error || "Failed to update user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleKycReview = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/kyc-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kycReviewData),
      });

      if (response.ok) {
        const data = await response.json();
        setShowKycModal(false);
        fetchUsers(); // Refresh the user list
        
        toast({
          title: "Success",
          description: data.message || "KYC review completed",
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to update KYC status:', response.status, errorData);
        
        toast({
          title: "Error",
          description: errorData.error || "Failed to update KYC status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        const data = await response.json();
        setShowCreateModal(false);
        setCreateForm({
          first_name: '',
          last_name: '',
          email: '',
          is_admin: false,
          kyc_verified: false
        });
        fetchUsers(); // Refresh the user list
        
        toast({
          title: "Success",
          description: `User created successfully. Temporary password: TemporaryPassword123!`,
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create user:', response.status, errorData);
        
        toast({
          title: "Error",
          description: errorData.error || "Failed to create user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'suspended':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-warning';
    }
  };

  const getKycStatusColor = (verified: boolean) => {
    return verified ? 'badge-success' : 'badge-warning';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = kycFilter === "all" || 
                      (kycFilter === 'verified' && user.kyc_verified) ||
                      (kycFilter === 'unverified' && !user.kyc_verified);

    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading users...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-300">Manage platform users and their accounts</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={fetchUsers}
                className="glass-card px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
              <button className="glass-card px-6 py-3 rounded-lg text-white hover:bg-white/10 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-gradient px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">{users.length}</div>
            <div className="text-gray-300">Total Users</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">
              {users.filter(u => u.kyc_verified).length}
            </div>
            <div className="text-gray-300">KYC Verified</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <div className="text-gray-300">Suspended</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email or name..."
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
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">KYC Status</label>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="glass-input w-full"
              >
                <option value="all">All KYC</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
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

        {/* Users Table */}
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-300 font-medium pb-4">User</th>
                  <th className="text-left text-gray-300 font-medium pb-4">Status</th>
                  <th className="text-left text-gray-300 font-medium pb-4">KYC</th>
                  <th className="text-left text-gray-300 font-medium pb-4">Balance</th>
                  <th className="text-left text-gray-300 font-medium pb-4">Earned</th>
                  <th className="text-left text-gray-300 font-medium pb-4">Joined</th>
                  <th className="text-left text-gray-300 font-medium pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700/50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`badge ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`badge ${getKycStatusColor(user.kyc_verified)}`}>
                        {user.kyc_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-medium">{formatCurrency(user.wallet_balance)}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-green-400 font-medium">{formatCurrency(user.total_earned)}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-300">{formatDate(user.created_at)}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Users Found</h3>
              <p className="text-gray-300">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-300">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex space-x-2">
            <button className="glass-card px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              Previous
            </button>
            <button className="glass-card px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedUser.first_name.charAt(0)}{selectedUser.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h4>
                  <p className="text-gray-300">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-gray-400 text-sm">Wallet Balance</p>
                  <p className="text-white font-semibold">{formatCurrency(selectedUser.wallet_balance)}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-gray-400 text-sm">Total Earned</p>
                  <p className="text-green-400 font-semibold">{formatCurrency(selectedUser.total_earned)}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-gray-400 text-sm">Total Staked</p>
                  <p className="text-purple-400 font-semibold">{formatCurrency(selectedUser.total_staked)}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-gray-400 text-sm">Referral Code</p>
                  <p className="text-white font-semibold">{selectedUser.referral_code}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Account Status</span>
                  <span className={`badge ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">KYC Verification</span>
                  <span className={`badge ${getKycStatusColor(selectedUser.kyc_verified)}`}>
                    {selectedUser.kyc_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Two-Factor Auth</span>
                  <span className={`badge ${selectedUser.two_factor_enabled ? 'badge-success' : 'badge-warning'}`}>
                    {selectedUser.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Admin Access</span>
                  <span className={`badge ${selectedUser.is_admin ? 'badge-success' : 'badge-warning'}`}>
                    {selectedUser.is_admin ? 'Admin' : 'User'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-white">{formatDate(selectedUser.created_at)}</span>
                </div>
                {selectedUser.last_sign_in_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last Sign In</span>
                    <span className="text-white">{formatDate(selectedUser.last_sign_in_at)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowKycModal(true);
                  }}
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold"
                >
                  Review KYC
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KYC Review Modal */}
      {showKycModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">KYC Review</h3>
              <button
                onClick={() => setShowKycModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">Reviewing KYC for:</p>
                <p className="text-white font-semibold">{selectedUser.first_name} {selectedUser.last_name}</p>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Status</label>
                <select 
                  value={kycReviewData.status}
                  onChange={(e) => setKycReviewData({...kycReviewData, status: e.target.value})}
                  className="glass-input w-full"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Notes</label>
                <textarea
                  value={kycReviewData.notes}
                  onChange={(e) => setKycReviewData({...kycReviewData, notes: e.target.value})}
                  className="glass-input w-full h-24"
                  placeholder="Add notes about the KYC review..."
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowKycModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleKycReview}
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit User: {selectedUser.email}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.wallet_balance}
                    onChange={(e) => setEditForm({...editForm, wallet_balance: parseFloat(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Earned</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_earned}
                    onChange={(e) => setEditForm({...editForm, total_earned: parseFloat(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Deposits</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_deposits}
                    onChange={(e) => setEditForm({...editForm, total_deposits: parseFloat(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Withdrawals</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_withdrawals}
                    onChange={(e) => setEditForm({...editForm, total_withdrawals: parseFloat(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referral Earnings</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.referral_earnings}
                    onChange={(e) => setEditForm({...editForm, referral_earnings: parseFloat(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referral Count</label>
                  <input
                    type="number"
                    value={editForm.referral_count}
                    onChange={(e) => setEditForm({...editForm, referral_count: parseInt(e.target.value) || 0})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="glass-input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                  <select
                    value={editForm.is_admin ? 'admin' : 'user'}
                    onChange={(e) => setEditForm({...editForm, is_admin: e.target.value === 'admin'})}
                    className="glass-input w-full"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">KYC Verification</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.kyc_verified}
                      onChange={(e) => setEditForm({...editForm, kyc_verified: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Two-Factor Auth</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.two_factor_enabled}
                      onChange={(e) => setEditForm({...editForm, two_factor_enabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referral Code</label>
                  <input
                    type="text"
                    value={editForm.referral_code}
                    onChange={(e) => setEditForm({...editForm, referral_code: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referred By</label>
                  <input
                    type="text"
                    value={editForm.referred_by || ''}
                    onChange={(e) => setEditForm({...editForm, referred_by: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                  <p className="text-white">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 btn-gradient py-3 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={createForm.first_name}
                    onChange={(e) => setCreateForm({...createForm, first_name: e.target.value})}
                    className="glass-input w-full"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={createForm.last_name}
                    onChange={(e) => setCreateForm({...createForm, last_name: e.target.value})}
                    className="glass-input w-full"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  className="glass-input w-full"
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                  <select
                    value={createForm.is_admin ? 'admin' : 'user'}
                    onChange={(e) => setCreateForm({...createForm, is_admin: e.target.value === 'admin'})}
                    className="glass-input w-full"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">KYC Status</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.kyc_verified}
                      onChange={(e) => setCreateForm({...createForm, kyc_verified: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-4">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> A temporary password will be generated automatically. 
                  The user will need to change it on their first login.
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={!createForm.first_name || !createForm.last_name || !createForm.email}
                  className="flex-1 btn-gradient py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
