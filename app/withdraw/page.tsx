'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Bank, 
  Bitcoin, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Plus,
  Minus,
  CreditCard as CardIcon,
  Building2,
  Wallet,
  Zap,
  Shield,
  Send,
  Receipt
} from 'lucide-react';

interface WithdrawalMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
  status: 'active' | 'maintenance' | 'unavailable';
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reference: string;
  created_at: string;
  processed_at?: string;
  admin_notes?: string;
}

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: ''
  });
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [platformLimits, setPlatformLimits] = useState({
    min_withdrawal: 100,
    max_withdrawal: 25000,
    daily_withdrawal_limit: 10000,
    withdrawal_fee: 5
  });

  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const fetchWithdrawalData = async () => {
    try {
      // Fetch withdrawal history
      const historyResponse = await fetch('/api/withdrawals/history', {
        credentials: 'include'
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setWithdrawalHistory(historyData);
      }

      // Fetch wallet balance
      const balanceResponse = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setWalletBalance(balanceData.walletBalance || 0);
      }

      // Fetch platform settings
      const settingsResponse = await fetch('/api/public/settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setPlatformLimits({
          min_withdrawal: settingsData.min_withdrawal || 100,
          max_withdrawal: settingsData.max_withdrawal || 25000,
          daily_withdrawal_limit: settingsData.daily_withdrawal_limit || 10000,
          withdrawal_fee: settingsData.withdrawal_fee || 5
        });
      } else {
        console.warn('Failed to fetch platform settings, using defaults');
        // Use default values if settings fetch fails
        setPlatformLimits({
          min_withdrawal: 100,
          max_withdrawal: 25000,
          daily_withdrawal_limit: 10000,
          withdrawal_fee: 5
        });
      }
    } catch (error) {
      console.error('Error fetching withdrawal data:', error);
      // Use default values if there's an error
      setPlatformLimits({
        min_withdrawal: 100,
        max_withdrawal: 25000,
        daily_withdrawal_limit: 10000,
        withdrawal_fee: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!selectedMethod || !amount) return;

    try {
      const response = await fetch('/api/withdrawals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod.id,
          walletAddress: selectedMethod.id === 'crypto' ? walletAddress : undefined,
          bankDetails: selectedMethod.id === 'bank' ? bankDetails : undefined,
        }),
      });

      if (response.ok) {
        setShowWithdrawalModal(false);
        setSelectedMethod(null);
        setAmount('');
        setWalletAddress('');
        setBankDetails({
          accountName: '',
          accountNumber: '',
          bankName: '',
          routingNumber: ''
        });
        // Refresh data
        fetchWithdrawalData();
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'processing':
        return 'badge-staking';
      case 'pending':
        return 'badge-warning';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Direct bank transfers to your account',
      minAmount: platformLimits.min_withdrawal,
      maxAmount: platformLimits.max_withdrawal,
      fee: 0,
      processingTime: '1-3 business days',
      status: 'active'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Withdraw to Bitcoin, Ethereum, and more',
      minAmount: platformLimits.min_withdrawal,
      maxAmount: platformLimits.max_withdrawal,
      fee: platformLimits.withdrawal_fee,
      processingTime: '10-30 minutes',
      status: 'active'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Fast PayPal withdrawals',
      minAmount: platformLimits.min_withdrawal,
      maxAmount: platformLimits.max_withdrawal,
      fee: platformLimits.withdrawal_fee,
      processingTime: 'Instant',
      status: 'active'
    },
    {
      id: 'card',
      name: 'Card Withdrawal',
      icon: <CardIcon className="w-6 h-6" />,
      description: 'Withdraw to your debit/credit card',
      minAmount: platformLimits.min_withdrawal,
      maxAmount: platformLimits.max_withdrawal,
      fee: platformLimits.withdrawal_fee,
      processingTime: '2-5 business days',
      status: 'maintenance'
    }
  ];

  const calculateFee = (amount: number, method: WithdrawalMethod) => {
    return (amount * method.fee) / 100;
  };

  const calculateNetAmount = (amount: number, _method: WithdrawalMethod) => {
    // Fee is informational only; do not subtract from payout shown
    return amount;
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading withdrawal data...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-gray-300">Withdraw your earnings to your preferred method</p>
        </div>

        {/* Wallet Balance */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Balance</p>
                <p className="text-3xl font-bold text-gradient">{formatCurrency(walletBalance)}</p>
              </div>
              <div className="text-green-400">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$8.5K</div>
            <div className="text-gray-300">Total Withdrawn</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">45</div>
            <div className="text-gray-300">Total Withdrawals</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">$1.2K</div>
            <div className="text-gray-300">This Month</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$189</div>
            <div className="text-gray-300">Average Withdrawal</div>
          </div>
        </div>

        {/* Withdrawal Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Withdrawal Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {withdrawalMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method);
                  setShowWithdrawalModal(true);
                }}
                className={`glass-card p-6 cursor-pointer card-hover ${
                  method.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-purple-400">
                    {method.icon}
                  </div>
                  <span className={`badge ${
                    method.status === 'active' ? 'badge-success' : 
                    method.status === 'maintenance' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {method.status === 'active' ? 'Available' : 
                     method.status === 'maintenance' ? 'Maintenance' : 'Unavailable'}
                  </span>
                </div>

                <h3 className="text-white font-semibold mb-2">{method.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{method.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Min:</span>
                    <span className="text-white">{formatCurrency(method.minAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Max:</span>
                    <span className="text-white">{formatCurrency(method.maxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fee:</span>
                    <span className="text-red-400">{method.fee}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-green-400">{method.processingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Withdrawals</h2>
            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
              View All
            </button>
          </div>

          <div className="glass-table">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalHistory.slice(0, 5).map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="text-white font-semibold">
                      {formatCurrency(withdrawal.amount)}
                    </td>
                    <td className="text-gray-300 capitalize">{withdrawal.method}</td>
                    <td className="text-gray-300 font-mono text-sm">
                      {withdrawal.reference}
                    </td>
                    <td className="text-gray-300">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {withdrawalHistory.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-300">
                Start earning and withdraw your profits when ready!
              </p>
            </div>
          )}
        </div>

        {/* Withdrawal Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Why Withdraw with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-green-400 mb-4">
                <Zap className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-300 text-sm">
                Most withdrawals are processed within 24 hours
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-purple-400 mb-4">
                <Shield className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure</h3>
              <p className="text-gray-300 text-sm">
                Bank-level security with encrypted transactions
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-orange-400 mb-4">
                <Receipt className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Low Fees</h3>
              <p className="text-gray-300 text-sm">
                Competitive fees starting from 0% for bank transfers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">
              Withdraw via {selectedMethod.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input w-full"
                  placeholder={`Min: ${formatCurrency(selectedMethod.minAmount)}`}
                  min={selectedMethod.minAmount}
                  max={Math.min(selectedMethod.maxAmount, walletBalance)}
                />
              </div>

              {selectedMethod.id === 'crypto' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="glass-input w-full"
                    placeholder="Enter your crypto wallet address"
                  />
                </div>
              )}

              {selectedMethod.id === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="glass-input w-full"
                      placeholder="Account holder name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="glass-input w-full"
                      placeholder="Account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      className="glass-input w-full"
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                      className="glass-input w-full"
                      placeholder="Routing number"
                    />
                  </div>
                </div>
              )}

              {amount && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white">{formatCurrency(parseFloat(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fee ({selectedMethod.fee}%):</span>
                    <span className="text-red-400">
                      {formatCurrency(calculateFee(parseFloat(amount) || 0, selectedMethod))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">You'll Receive:</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(calculateNetAmount(parseFloat(amount) || 0, selectedMethod))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Processing Time:</span>
                    <span className="text-blue-400">{selectedMethod.processingTime}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={
                    !amount || 
                    parseFloat(amount) < selectedMethod.minAmount || 
                    parseFloat(amount) > walletBalance ||
                    selectedMethod.status !== 'active' ||
                    (selectedMethod.id === 'crypto' && !walletAddress) ||
                    (selectedMethod.id === 'bank' && (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.routingNumber))
                  }
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedMethod.status === 'active' ? 'Confirm Withdrawal' : 'Method Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 