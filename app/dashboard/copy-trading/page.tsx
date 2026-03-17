'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Star,
  Copy,
  UserCheck,
  Target,
  BarChart3,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ClientOnly } from '@/components/ui/client-only';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface CopyTrader {
  id: string;
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
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
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

export default function CopyTradingPage() {
  const [traders, setTraders] = useState<CopyTrader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('total_followers');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterVerified, setFilterVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTraders();
  }, [sortBy, sortOrder, filterVerified]);

  // Handle search with debouncing to prevent hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchTraders();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        limit: '50'
      });

      const response = await fetch(`/api/copy-trading/traders?${params}`);
      if (response.ok) {
        const data = await response.json();
        let filteredData = data;

        // Apply search filter
        if (searchTerm) {
          filteredData = data.filter((trader: CopyTrader) =>
            trader.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trader.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply verified filter
        if (filterVerified) {
          filteredData = filteredData.filter((trader: CopyTrader) => trader.is_verified);
        }

        setTraders(filteredData);
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

  const handleSubscribe = async (traderId: string) => {
    try {
      const response = await fetch('/api/copy-trading/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trader_id: traderId,
          copy_percentage: 100,
          auto_copy: true
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Successfully subscribed to copy trader!",
        });
        // Refresh traders list
        fetchTraders();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to subscribe",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to copy trader",
        variant: "destructive",
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <ClientOnly>
        <div className="min-h-screen animated-bg p-6" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto" suppressHydrationWarning>
            <div className="glass-card p-8 text-center" suppressHydrationWarning>
              <div className="loading-spinner w-8 h-8 mx-auto mb-4" suppressHydrationWarning></div>
              <p className="text-gray-900">Loading copy traders...</p>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ErrorBoundary>
      <ClientOnly>
        <div className="min-h-screen animated-bg p-6" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Copy Trading</h1>
              <p className="text-gray-600">Follow successful traders and copy their trades automatically</p>
            </div>
            <div className="flex gap-4">
              <Button className="btn-gradient">
                <Copy className="w-5 h-5 mr-2" />
                My Subscriptions
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Traders</p>
                                     <p className="text-2xl font-bold text-white">{formatNumber(traders.filter(t => t.users).length)}</p>
                </div>
                <div className="text-blue-400">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Followers</p>
                                     <p className="text-2xl font-bold text-white">
                     {formatNumber(traders.filter(t => t.users).reduce((sum, trader) => sum + trader.total_followers, 0))}
                   </p>
                </div>
                <div className="text-green-400">
                  <UserCheck className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Profit</p>
                                     <p className="text-2xl font-bold text-white">
                     {formatCurrency(traders.filter(t => t.users).reduce((sum, trader) => sum + trader.total_profit, 0))}
                   </p>
                </div>
                <div className="text-purple-400">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Success Rate</p>
                                     <p className="text-2xl font-bold text-white">
                     {(() => {
                       const validTraders = traders.filter(t => t.users);
                       return validTraders.length > 0 
                         ? Math.round(validTraders.reduce((sum, trader) => sum + trader.success_rate, 0) / validTraders.length)
                         : 0;
                     })()}%
                   </p>
                </div>
                <div className="text-yellow-400">
                  <Target className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search traders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterVerified ? "default" : "outline"}
                    onClick={() => setFilterVerified(!filterVerified)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verified Only
                  </Button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/10 border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="total_followers">Most Followers</option>
                    <option value="success_rate">Best Success Rate</option>
                    <option value="total_profit">Highest Profit</option>
                    <option value="created_at">Newest</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center gap-2"
                  >
                    {sortOrder === 'desc' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

                 {/* Traders Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {traders.filter(trader => trader.users).map((trader) => (
            <Card key={trader.id} className="glass-card hover:bg-white/5 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                         <Avatar className="w-12 h-12">
                       <AvatarImage src={trader.users?.avatar_url} />
                       <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                         {trader.users?.first_name?.[0] || 'T'}{trader.users?.last_name?.[0] || 'D'}
                       </AvatarFallback>
                     </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{trader.display_name}</h3>
                        {trader.is_verified && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                                             <p className="text-gray-400 text-sm">
                         {trader.users?.first_name || 'Trader'} {trader.users?.last_name || 'User'}
                       </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-2">{trader.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{trader.success_rate}%</p>
                    <p className="text-gray-400 text-xs">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatCurrency(trader.total_profit)}</p>
                    <p className="text-gray-400 text-xs">Total Profit</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(trader.total_followers)} followers</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Copy className="w-4 h-4" />
                    <span>{formatNumber(trader.total_copied_trades)} trades</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Copy Fee: {trader.copy_fee_percentage}%</p>
                    <p className="text-gray-400">Min: {formatCurrency(trader.min_copy_amount)}</p>
                  </div>
                  <Button
                    onClick={() => handleSubscribe(trader.id)}
                    className="btn-gradient"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {traders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Copy Traders Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
    </ClientOnly>
    </ErrorBoundary>
  );
}
