'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Copy,
  UserCheck,
  Target,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  Star,
  BarChart3,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface CopyTrader {
  id: string;
  user_id: string;
  display_name: string;
  description: string;
  total_followers: number;
  total_copied_trades: number;
  success_rate: number;
  total_profit: number;
  min_copy_amount: number;
  max_copy_amount: number;
  copy_fee_percentage: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  performance: {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    total_profit: number;
    success_rate: number;
  };
}

interface CreateTraderForm {
  user_id: string;
  display_name: string;
  description: string;
  min_copy_amount: number;
  max_copy_amount: number;
  copy_fee_percentage: number;
  is_verified: boolean;
  is_active: boolean;
}

export default function AdminCopyTradingPage() {
  const [traders, setTraders] = useState<CopyTrader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<CopyTrader | null>(null);
  const [createForm, setCreateForm] = useState<CreateTraderForm>({
    user_id: '',
    display_name: '',
    description: '',
    min_copy_amount: 10,
    max_copy_amount: 10000,
    copy_fee_percentage: 5,
    is_verified: false,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTraders();
  }, []);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/copy-trading/traders');
      if (response.ok) {
        const data = await response.json();
        setTraders(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch copy traders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching traders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch copy traders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrader = async () => {
    try {
      const response = await fetch('/api/admin/copy-trading/traders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Copy trader created successfully!",
        });
        setShowCreateModal(false);
        setCreateForm({
          user_id: '',
          display_name: '',
          description: '',
          min_copy_amount: 10,
          max_copy_amount: 10000,
          copy_fee_percentage: 5,
          is_verified: false,
          is_active: true,
        });
        fetchTraders();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create copy trader",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating trader:', error);
      toast({
        title: "Error",
        description: "Failed to create copy trader",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTrader = async (traderId: string, updateData: Partial<CopyTrader>) => {
    try {
      const response = await fetch(`/api/admin/copy-trading/traders/${traderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Copy trader updated successfully!",
        });
        setShowEditModal(false);
        setSelectedTrader(null);
        fetchTraders();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update copy trader",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating trader:', error);
      toast({
        title: "Error",
        description: "Failed to update copy trader",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTrader = async (traderId: string) => {
    if (!confirm('Are you sure you want to delete this copy trader? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/copy-trading/traders/${traderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Copy trader deleted successfully!",
        });
        fetchTraders();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete copy trader",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting trader:', error);
      toast({
        title: "Error",
        description: "Failed to delete copy trader",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (traderId: string, isActive: boolean) => {
    await handleUpdateTrader(traderId, { is_active: isActive });
  };

  const handleToggleVerification = async (traderId: string, isVerified: boolean) => {
    await handleUpdateTrader(traderId, { is_verified: isVerified });
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

  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trader.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trader.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && trader.is_active) ||
                         (filterStatus === 'inactive' && !trader.is_active) ||
                         (filterStatus === 'verified' && trader.is_verified);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalTraders: traders.length,
    activeTraders: traders.filter(t => t.is_active).length,
    verifiedTraders: traders.filter(t => t.is_verified).length,
    totalFollowers: traders.reduce((sum, t) => sum + t.total_followers, 0),
    totalProfit: traders.reduce((sum, t) => sum + t.total_profit, 0),
    avgSuccessRate: traders.length > 0 
      ? Math.round(traders.reduce((sum, t) => sum + t.success_rate, 0) / traders.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading copy traders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Copy Trading Management</h1>
          <p className="text-gray-600">Manage copy traders and their settings</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Copy Trader
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Traders</p>
                <p className="text-2xl font-bold">{stats.totalTraders}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.activeTraders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{stats.verifiedTraders}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalFollowers)}</p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold">{stats.avgSuccessRate}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search traders by name, email, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Traders</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="verified">Verified Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Traders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Copy Traders ({filteredTraders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trader</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Settings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTraders.map((trader) => (
                <TableRow key={trader.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={trader.users?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {trader.users?.first_name?.[0] || 'T'}{trader.users?.last_name?.[0] || 'D'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{trader.display_name}</p>
                          {trader.is_verified && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{trader.users?.email}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{trader.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{trader.success_rate}%</span>
                        <span className="text-xs text-gray-500">Success Rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{formatCurrency(trader.total_profit)}</span>
                        <span className="text-xs text-gray-500">Total Profit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{formatNumber(trader.total_copied_trades)}</span>
                        <span className="text-xs text-gray-500">Trades</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-semibold">{formatNumber(trader.total_followers)}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div>Fee: {trader.copy_fee_percentage}%</div>
                      <div>Min: {formatCurrency(trader.min_copy_amount)}</div>
                      <div>Max: {formatCurrency(trader.max_copy_amount)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={trader.is_active}
                        onCheckedChange={(checked) => handleToggleStatus(trader.id, checked)}
                      />
                      <Badge variant={trader.is_active ? "default" : "secondary"}>
                        {trader.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedTrader(trader);
                          setShowEditModal(true);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVerification(trader.id, !trader.is_verified)}>
                          {trader.is_verified ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verify
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTrader(trader.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTraders.length === 0 && (
            <div className="text-center py-12">
              <Copy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Copy Traders Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Copy Trader</DialogTitle>
            <DialogDescription>
              Create a new copy trader account. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User ID</Label>
              <Input
                id="user_id"
                value={createForm.user_id}
                onChange={(e) => setCreateForm({...createForm, user_id: e.target.value})}
                placeholder="Enter user ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={createForm.display_name}
                onChange={(e) => setCreateForm({...createForm, display_name: e.target.value})}
                placeholder="Enter display name"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                placeholder="Enter trader description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_copy_amount">Minimum Copy Amount</Label>
              <Input
                id="min_copy_amount"
                type="number"
                value={createForm.min_copy_amount}
                onChange={(e) => setCreateForm({...createForm, min_copy_amount: Number(e.target.value)})}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_copy_amount">Maximum Copy Amount</Label>
              <Input
                id="max_copy_amount"
                type="number"
                value={createForm.max_copy_amount}
                onChange={(e) => setCreateForm({...createForm, max_copy_amount: Number(e.target.value)})}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copy_fee_percentage">Copy Fee (%)</Label>
              <Input
                id="copy_fee_percentage"
                type="number"
                value={createForm.copy_fee_percentage}
                onChange={(e) => setCreateForm({...createForm, copy_fee_percentage: Number(e.target.value)})}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_verified">Verified</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_verified"
                  checked={createForm.is_verified}
                  onCheckedChange={(checked) => setCreateForm({...createForm, is_verified: checked})}
                />
                <Label htmlFor="is_verified">Mark as verified</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Active</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={createForm.is_active}
                  onCheckedChange={(checked) => setCreateForm({...createForm, is_active: checked})}
                />
                <Label htmlFor="is_active">Mark as active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrader}>
              Create Trader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Copy Trader</DialogTitle>
            <DialogDescription>
              Update the copy trader's information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedTrader && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_display_name">Display Name</Label>
                <Input
                  id="edit_display_name"
                  value={selectedTrader.display_name}
                  onChange={(e) => setSelectedTrader({...selectedTrader, display_name: e.target.value})}
                  placeholder="Enter display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_copy_fee_percentage">Copy Fee (%)</Label>
                <Input
                  id="edit_copy_fee_percentage"
                  type="number"
                  value={selectedTrader.copy_fee_percentage}
                  onChange={(e) => setSelectedTrader({...selectedTrader, copy_fee_percentage: Number(e.target.value)})}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={selectedTrader.description}
                  onChange={(e) => setSelectedTrader({...selectedTrader, description: e.target.value})}
                  placeholder="Enter trader description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_min_copy_amount">Minimum Copy Amount</Label>
                <Input
                  id="edit_min_copy_amount"
                  type="number"
                  value={selectedTrader.min_copy_amount}
                  onChange={(e) => setSelectedTrader({...selectedTrader, min_copy_amount: Number(e.target.value)})}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_max_copy_amount">Maximum Copy Amount</Label>
                <Input
                  id="edit_max_copy_amount"
                  type="number"
                  value={selectedTrader.max_copy_amount}
                  onChange={(e) => setSelectedTrader({...selectedTrader, max_copy_amount: Number(e.target.value)})}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_is_verified">Verified</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_verified"
                    checked={selectedTrader.is_verified}
                    onCheckedChange={(checked) => setSelectedTrader({...selectedTrader, is_verified: checked})}
                  />
                  <Label htmlFor="edit_is_verified">Mark as verified</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_is_active">Active</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit_is_active"
                    checked={selectedTrader.is_active}
                    onCheckedChange={(checked) => setSelectedTrader({...selectedTrader, is_active: checked})}
                  />
                  <Label htmlFor="edit_is_active">Mark as active</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedTrader && handleUpdateTrader(selectedTrader.id, selectedTrader)}>
              Update Trader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
