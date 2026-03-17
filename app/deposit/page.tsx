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
  Shield
} from 'lucide-react';

interface PaymentMethod {
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

interface DepositHistory {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  reference: string;
  created_at: string;
  processed_at?: string;
}

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformLimits, setPlatformLimits] = useState({
    min_deposit: 50,
    max_deposit: 50000
  });

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  const fetchDepositHistory = async () => {
    try {
      const response = await fetch('/api/deposits/history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDepositHistory(data);
      }

      // Fetch platform settings
      const settingsResponse = await fetch('/api/public/settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setPlatformLimits({
          min_deposit: settingsData.min_deposit || 50,
          max_deposit: settingsData.max_deposit || 50000
        });
      } else {
        console.warn('Failed to fetch platform settings, using defaults');
        // Use default values if settings fetch fails
        setPlatformLimits({
          min_deposit: 50,
          max_deposit: 50000
        });
      }
    } catch (error) {
      console.error('Error fetching deposit history:', error);
      // Use default values if there's an error
      setPlatformLimits({
        min_deposit: 50,
        max_deposit: 50000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedMethod || !amount) return;

    try {
      // Generate a mock transaction hash for demo purposes
      const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/deposits/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod.id,
          transactionHash: transactionHash,
          paymentProof: '', // For demo purposes
          walletAddress: 'bc1qrppxrw5uz4cfvfkllal905x40azruq4r5jmtkf', // Demo wallet address
        }),
      });

      if (response.ok) {
        setShowDepositModal(false);
        setSelectedMethod(null);
        setAmount('');
        // Refresh history
        fetchDepositHistory();
      } else {
        const errorData = await response.json();
        console.error('Deposit error:', errorData);
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
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
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CardIcon className="w-6 h-6" />,
      description: 'Instant deposits with major cards',
      minAmount: platformLimits.min_deposit,
      maxAmount: platformLimits.max_deposit,
      fee: 2.5,
      processingTime: 'Instant',
      status: 'active'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Direct bank transfers',
      minAmount: platformLimits.min_deposit,
      maxAmount: platformLimits.max_deposit,
      fee: 0,
      processingTime: '1-3 business days',
      status: 'active'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: <Bitcoin className="w-6 h-6" />,
      description: 'Bitcoin, Ethereum, and more',
      minAmount: platformLimits.min_deposit,
      maxAmount: platformLimits.max_deposit,
      fee: 1.0,
      processingTime: '10-30 minutes',
      status: 'active'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Fast and secure PayPal payments',
      minAmount: platformLimits.min_deposit,
      maxAmount: platformLimits.max_deposit,
      fee: 3.0,
      processingTime: 'Instant',
      status: 'maintenance'
    }
  ];

  const calculateFee = (amount: number, method: PaymentMethod) => {
    return (amount * method.fee) / 100;
  };

  const calculateTotal = (amount: number, method: PaymentMethod) => {
    return amount + calculateFee(amount, method);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading deposit data...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
          <p className="text-gray-300">Add funds to your account using any payment method</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$15.2K</div>
            <div className="text-gray-300">Total Deposited</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">127</div>
            <div className="text-gray-300">Total Deposits</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">$2.8K</div>
            <div className="text-gray-300">This Month</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$120</div>
            <div className="text-gray-300">Average Deposit</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Choose Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method);
                  setShowDepositModal(true);
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

        {/* Recent Deposits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Deposits</h2>
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
                {depositHistory.slice(0, 5).map((deposit) => (
                  <tr key={deposit.id}>
                    <td className="text-white font-semibold">
                      {formatCurrency(deposit.amount)}
                    </td>
                    <td className="text-gray-300 capitalize">{deposit.method}</td>
                    <td className="text-gray-300 font-mono text-sm">
                      {deposit.reference}
                    </td>
                    <td className="text-gray-300">
                      {new Date(deposit.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {depositHistory.length === 0 && (
            <div className="glass-card p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Deposits Yet</h3>
              <p className="text-gray-300">
                Make your first deposit to start investing and earning!
              </p>
            </div>
          )}
        </div>

        {/* Deposit Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Why Deposit with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-green-400 mb-4">
                <Zap className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Processing</h3>
              <p className="text-gray-300 text-sm">
                Most deposits are processed instantly and available immediately
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-purple-400 mb-4">
                <Shield className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure</h3>
              <p className="text-gray-300 text-sm">
                Bank-level security with SSL encryption and fraud protection
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-orange-400 mb-4">
                <CreditCard className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Multiple Options</h3>
              <p className="text-gray-300 text-sm">
                Choose from cards, bank transfers, crypto, and more
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">
              Deposit via {selectedMethod.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input w-full"
                  placeholder={`Min: ${formatCurrency(selectedMethod.minAmount)}`}
                  min={selectedMethod.minAmount}
                  max={selectedMethod.maxAmount}
                />
              </div>

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
                    <span className="text-gray-300">Total:</span>
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(calculateTotal(parseFloat(amount) || 0, selectedMethod))}
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
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) < selectedMethod.minAmount || selectedMethod.status !== 'active'}
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedMethod.status === 'active' ? 'Proceed to Payment' : 'Method Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 