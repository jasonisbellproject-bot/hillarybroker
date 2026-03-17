"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Wallet, Bitcoin, CheckCircle, Clock, AlertCircle, AlertTriangle, Info, DollarSign, Shield } from "lucide-react"

const withdrawalMethods = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: Bitcoin,
    minAmount: 100,
    maxAmount: 50000,
    processingTime: "24-48 hours",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: Wallet,
    minAmount: 100,
    maxAmount: 50000,
    processingTime: "24-48 hours",
  },
  {
    id: "usdt",
    name: "USDT (TRC20)",
    icon: Wallet,
    minAmount: 100,
    maxAmount: 50000,
    processingTime: "24-48 hours",
  },
]

interface PlatformSettings {
  min_withdrawal: number;
  max_withdrawal: number;
  daily_withdrawal_limit: number;
  withdrawal_fee: number;
  withdrawal_fee_percentage: number;
  maintenance_mode: boolean;
}

export default function WithdrawPage() {
  const { user, loading: authLoading } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [availableBalance, setAvailableBalance] = useState(0)
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [withdrawalsError, setWithdrawalsError] = useState<string | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null);
  const [dailyWithdrawn, setDailyWithdrawn] = useState(0);

  // Calculate withdrawal fee based on percentage of user balance
  const calculateWithdrawalFee = (amount: number) => {
    if (!platformSettings || !amount) return 0;
    const feePercentage = platformSettings.withdrawal_fee_percentage || 30.00;
    return (amount * feePercentage) / 100;
  };

  // Net amount shown to user should not subtract the fee (fee is informational only)
  const calculateNetAmount = (amount: number) => {
    return amount;
  };

  // Fetch user balance, withdrawals, and platform settings from API on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setWithdrawalsLoading(true);
      setWithdrawalsError(null);
      
      try {
        // Fetch user stats including wallet balance
        const statsRes = await fetch('/api/dashboard/stats', { credentials: 'include' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setAvailableBalance(statsData.totalBalance || 0);
        } else {
          console.error('Failed to fetch user stats');
          // Fallback to user data if available
          setAvailableBalance(user?.wallet_balance || 0);
        }

        // Fetch withdrawals history
        const withdrawalsRes = await fetch('/api/withdrawals/history', { credentials: 'include' });
        if (!withdrawalsRes.ok) {
          const data = await withdrawalsRes.json().catch(() => ({}));
          setWithdrawalsError(data.error || 'Failed to fetch withdrawals');
          setRecentWithdrawals([]);
        } else {
          const data = await withdrawalsRes.json();
          // Normalize date field if needed
          setRecentWithdrawals(
            (Array.isArray(data) ? data : []).map(w => ({
              ...w,
              date: w.created_at ? new Date(w.created_at).toLocaleDateString() : '',
            }))
          );
        }

        // Fetch platform settings
        const settingsRes = await fetch('/api/public/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setPlatformSettings(settingsData);
        } else {
          // Use default settings if API fails
          setPlatformSettings({
            min_withdrawal: 100,
            max_withdrawal: 25000,
            daily_withdrawal_limit: 10000,
            withdrawal_fee: 5,
            withdrawal_fee_percentage: 30.00,
            maintenance_mode: false
          });
        }

        // Calculate daily withdrawn amount
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const withdrawalsRes2 = await fetch('/api/withdrawals/history', { credentials: 'include' });
        if (withdrawalsRes2.ok) {
          const withdrawalsData = await withdrawalsRes2.json();
          const todayWithdrawals = (Array.isArray(withdrawalsData) ? withdrawalsData : [])
            .filter(w => {
              const withdrawalDate = new Date(w.created_at);
              return withdrawalDate >= today && ['approved', 'completed'].includes(w.status);
            });
          const dailyTotal = todayWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);
          setDailyWithdrawn(dailyTotal);
        }

      } catch (e) {
        console.error('Error fetching user data:', e);
        setWithdrawalsError('Network error while loading data');
        setRecentWithdrawals([]);
        // Fallback to user data if available
        setAvailableBalance(user?.wallet_balance || 0);
      } finally {
        setWithdrawalsLoading(false);
      }
    };
    
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      const statsRes = await fetch('/api/dashboard/stats', { credentials: 'include' });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAvailableBalance(statsData.totalBalance || 0);
      }
    } catch (e) {
      console.error('Error refreshing user data:', e);
    }
  };

  const handleWithdraw = async () => {
    setProcessing(true);
    setError('');
    setSuccess('');

    // Validation
    if (!selectedMethod || !amount || !walletAddress) {
      setError('Please fill in all fields.');
      setProcessing(false);
      return;
    }

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount.');
      setProcessing(false);
      return;
    }

    // Check platform settings
    if (platformSettings) {
      if (amt < platformSettings.min_withdrawal) {
        setError(`Minimum withdrawal amount is $${platformSettings.min_withdrawal}.`);
        setProcessing(false);
        return;
      }
      if (amt > platformSettings.max_withdrawal) {
        setError(`Maximum withdrawal amount is $${platformSettings.max_withdrawal}.`);
        setProcessing(false);
        return;
      }
      if (amt > availableBalance) {
        setError('Insufficient balance.');
        setProcessing(false);
        return;
      }
      if (amt > (platformSettings.daily_withdrawal_limit - dailyWithdrawn)) {
        setError(`Daily withdrawal limit exceeded. You can withdraw up to $${(platformSettings.daily_withdrawal_limit - dailyWithdrawn).toFixed(2)} today.`);
        setProcessing(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/withdrawals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: amt,
          method: selectedMethod,
          address: walletAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Withdrawal failed.');
      } else {
        setSuccess('Withdrawal request submitted successfully! Please wait for admin approval.');
        setAmount('');
        setWalletAddress('');
        setSelectedMethod('');
        // Refresh user data to update balance
        await refreshUserData();
        // Refresh withdrawals list
        const withdrawalsRes = await fetch('/api/withdrawals/history', { credentials: 'include' });
        if (withdrawalsRes.ok) {
          const withdrawalsData = await withdrawalsRes.json();
          setRecentWithdrawals(
            (Array.isArray(withdrawalsData) ? withdrawalsData : []).map(w => ({
              ...w,
              date: w.created_at ? new Date(w.created_at).toLocaleDateString() : '',
            }))
          );
        }
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access the withdrawal page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Withdraw Funds</h1>
          <p className="text-tertiary">Withdraw your earnings to your preferred wallet or bank account.</p>
        </div>

        {/* Platform Settings Info */}
        {platformSettings && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Info className="w-5 h-5 mr-2" />
                Withdrawal Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-tertiary">Min: ${platformSettings.min_withdrawal}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-red-400" />
                  <span className="text-tertiary">Max: ${platformSettings.max_withdrawal}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-tertiary">Daily Limit: ${platformSettings.daily_withdrawal_limit}</span>
                </div>

              </div>
              {dailyWithdrawn > 0 && (
                <div className="mt-3 p-2 bg-blue-900/20 border border-blue-700 rounded">
                  <span className="text-blue-300 text-sm">
                    Today's withdrawals: ${dailyWithdrawn.toFixed(2)} / ${platformSettings.daily_withdrawal_limit}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-primary">Create Withdrawal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Balance */}
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 text-sm">Available Balance</span>
                  <span className="text-green-400 font-bold text-lg">${availableBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-700 bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">{success}</AlertDescription>
                </Alert>
              )}

              {/* Withdrawal Method Selection */}
              <div className="space-y-3">
                <Label className="text-primary">Withdrawal Method</Label>
                <div className="grid grid-cols-1 gap-3">
                  {withdrawalMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <method.icon className="w-6 h-6 text-blue-400" />
                          <div>
                            <div className="font-medium text-white">{method.name}</div>
                            <div className="text-sm text-gray-400">
                              {method.processingTime}
                            </div>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min={platformSettings?.min_withdrawal || 100}
                  max={platformSettings?.max_withdrawal || 25000}
                />
                {platformSettings && (
                  <div className="text-xs text-gray-400">
                    Min: ${platformSettings.min_withdrawal} • Max: ${platformSettings.max_withdrawal}
                  </div>
                )}
              </div>

              {/* Fee Display (informational) */}
              {amount && platformSettings && parseFloat(amount) > 0 && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 text-sm">Withdrawal Amount</span>
                      <span className="text-white font-medium">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 text-sm">Fee ({platformSettings.withdrawal_fee_percentage}%)</span>
                      <span className="text-red-400 font-medium">${calculateWithdrawalFee(parseFloat(amount)).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-yellow-700 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-300 text-sm font-medium">You'll Receive</span>
                        <span className="text-green-400 font-bold">${calculateNetAmount(parseFloat(amount)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Address Input */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Wallet Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleWithdraw}
                disabled={processing || !selectedMethod || !amount || !walletAddress}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {processing ? 'Processing...' : 'Submit Withdrawal'}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Withdrawals */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : withdrawalsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{withdrawalsError}</AlertDescription>
                </Alert>
              ) : recentWithdrawals.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No withdrawals yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentWithdrawals.slice(0, 5).map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(withdrawal.status)}
                        <div>
                          <div className="font-medium text-white">
                            ${parseFloat(withdrawal.amount).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {withdrawal.method} • {withdrawal.date}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
