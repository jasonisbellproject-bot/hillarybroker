'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  Zap,
  Gift,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface InvestmentPlan {
  id: number;
  name: string;
  description?: string;
  min_amount: number;
  max_amount: number;
  daily_return: number;
  duration: number;
  total_return: number;
  status: string;
  features?: string[];
}

interface UserInvestment {
  id: string;
  planName: string;
  planDescription?: string;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  earnedSoFar: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
}

interface InvestmentStats {
  totalInvested: number;
  activeInvestments: number;
  totalEarnings: number;
  averageReturn: number;
}

export default function InvestmentPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [stats, setStats] = useState<InvestmentStats>({
    totalInvested: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    averageReturn: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [investmentType, setInvestmentType] = useState<'immediate' | 'scheduled'>('immediate');

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      // Fetch investment plans
      const plansResponse = await fetch('/api/investment/plans', {
        credentials: 'include'
      });
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(plansData);
      }

      // Fetch user investments
      const investmentsResponse = await fetch('/api/investment/user-investments', {
        credentials: 'include'
      });
      if (investmentsResponse.ok) {
        const investmentsData = await investmentsResponse.json();
        setInvestments(investmentsData.investments || []);
        setStats(investmentsData.stats || {
          totalInvested: 0,
          activeInvestments: 0,
          totalEarnings: 0,
          averageReturn: 0
        });
      }
    } catch (error) {
      console.error('Error fetching investment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!selectedPlan || !investmentAmount) return;

    // Validate scheduled date if scheduling
    if (investmentType === 'scheduled' && !scheduledDate) {
      alert('Please select a scheduled date');
      return;
    }

    // Validate scheduled date is in the future
    if (investmentType === 'scheduled' && new Date(scheduledDate) <= new Date()) {
      alert('Scheduled date must be in the future');
      return;
    }

    try {
      const response = await fetch('/api/investment/user-investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: parseFloat(investmentAmount),
          scheduledDate: investmentType === 'scheduled' ? scheduledDate : null,
          investmentType: investmentType
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(investmentType === 'scheduled' ? 'Investment scheduled successfully!' : 'Investment created successfully!');
        setShowInvestmentModal(false);
        setSelectedPlan(null);
        setInvestmentAmount('');
        setScheduledDate('');
        setInvestmentType('immediate');
        fetchInvestmentData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create investment');
      }
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Failed to create investment');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'completed':
        return 'badge-staking';
      case 'cancelled':
        return 'badge-error';
      case 'scheduled':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-primary">Loading investments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">Investment</h1>
          <p className="text-tertiary text-sm sm:text-base">Grow your wealth with our investment plans.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Invested</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalInvested)}</p>
              </div>
              <div className="text-blue-400">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-blue-400 text-xs sm:text-sm">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +12.5%
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Active Investments</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{stats.activeInvestments}</p>
              </div>
              <div className="text-green-400">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-green-400 text-xs sm:text-sm">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +3
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Earnings</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="text-orange-400">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-orange-400 text-xs sm:text-sm">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +8.7%
            </div>
          </div>

          <div className="glass-card p-2 sm:p-3 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Avg Return</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-primary">{formatPercentage(stats.averageReturn)}</p>
              </div>
              <div className="text-purple-400">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 text-purple-400 text-xs sm:text-sm">
              <ArrowUpRight className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1" />
              +2.1%
            </div>
          </div>
        </div>

        {/* Investment Plans */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Investment Plans</h2>
            <button 
              onClick={() => setShowInvestmentModal(true)}
              className="btn-gradient px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base"
            >
              New Investment
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="glass-card p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-primary font-semibold text-xs sm:text-sm lg:text-base">{plan.name}</h3>
                  <span className="badge badge-success text-xs">Active</span>
                </div>
                <div className="space-y-1 sm:space-y-2 lg:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Daily Return</span>
                    <span className="text-green-400 font-semibold text-xs sm:text-sm">{formatPercentage(plan.daily_return)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Total Return</span>
                    <span className="text-purple-400 font-semibold text-xs sm:text-sm">{formatPercentage(plan.total_return)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Duration</span>
                    <span className="text-primary text-xs sm:text-sm">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Min Amount</span>
                    <span className="text-primary text-xs sm:text-sm">{formatCurrency(plan.min_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary text-xs sm:text-sm">Max Amount</span>
                    <span className="text-primary text-xs sm:text-sm">{formatCurrency(plan.max_amount)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowInvestmentModal(true);
                  }}
                  className="btn-gradient w-full mt-3 sm:mt-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base"
                >
                  Invest Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Investments */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">Active Investments</h2>
          <div className="glass-table overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Plan</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Amount</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Daily Return</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">Start Date</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">End Date</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Earned</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Progress</th>
                  <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="text-primary font-medium text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{investment.planName}</td>
                    <td className="text-primary text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(investment.amount)}</td>
                    <td className="text-green-400 font-semibold text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(investment.dailyReturn)}</td>
                    <td className="text-tertiary text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{new Date(investment.startDate).toLocaleDateString()}</td>
                    <td className="text-tertiary text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{new Date(investment.endDate).toLocaleDateString()}</td>
                    <td className="text-orange-400 text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(investment.earnedSoFar)}</td>
                    <td className="p-1 sm:p-2 lg:p-3">
                      <div className="w-full bg-gray-700 rounded-full h-1 sm:h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full"
                          style={{ width: `${investment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-tertiary">{investment.progress}%</span>
                    </td>
                    <td className="p-1 sm:p-2 lg:p-3">
                      <span className={`badge text-xs ${getStatusColor(investment.status)}`}>
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Investments */}
        {investments.filter(inv => inv.status === 'scheduled').length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3 sm:mb-4 lg:mb-6">Scheduled Investments</h2>
            <div className="glass-table overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Plan</th>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Amount</th>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Daily Return</th>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">Scheduled Date</th>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm hidden sm:table-cell">End Date</th>
                    <th className="text-left p-1 sm:p-2 lg:p-3 text-xs sm:text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.filter(inv => inv.status === 'scheduled').map((investment) => (
                    <tr key={investment.id}>
                      <td className="text-primary font-medium text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{investment.planName}</td>
                      <td className="text-primary text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(investment.amount)}</td>
                      <td className="text-green-400 font-semibold text-xs sm:text-sm p-1 sm:p-2 lg:p-3">{formatCurrency(investment.dailyReturn)}</td>
                      <td className="text-gray-300 text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{new Date(investment.startDate).toLocaleDateString()}</td>
                      <td className="text-gray-300 text-xs sm:text-sm p-1 sm:p-2 lg:p-3 hidden sm:table-cell">{new Date(investment.endDate).toLocaleDateString()}</td>
                      <td className="p-1 sm:p-2 lg:p-3">
                        <span className="badge badge-warning text-xs">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Investment Modal */}
        {showInvestmentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card p-4 sm:p-6 lg:p-8 max-w-md w-full">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Invest in {selectedPlan.name}</h3>
              <div className="space-y-3 sm:space-y-4">
                {/* Investment Type Selection */}
                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm mb-2">Investment Type</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setInvestmentType('immediate')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm transition-colors ${
                        investmentType === 'immediate'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-primary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Immediate
                    </button>
                    <button
                      onClick={() => setInvestmentType('scheduled')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm transition-colors ${
                        investmentType === 'scheduled'
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-primary'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Scheduled
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-xs sm:text-sm mb-1">Investment Amount</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min: ${formatCurrency(selectedPlan.min_amount)}`}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-primary text-xs sm:text-sm"
                  />
                </div>

                {/* Scheduled Date Input */}
                {investmentType === 'scheduled' && (
                  <div>
                    <label className="block text-tertiary text-xs sm:text-sm mb-1">Schedule Date</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-primary text-xs sm:text-sm"
                    />
                    <p className="text-xs text-tertiary mt-1">
                      Investment will start automatically on the scheduled date
                    </p>
                  </div>
                )}

                <div className="text-xs sm:text-sm text-tertiary">
                  <p>Daily Return: {formatPercentage(selectedPlan.daily_return)}</p>
                  <p>Total Return: {formatPercentage(selectedPlan.total_return)}</p>
                  <p>Duration: {selectedPlan.duration} days</p>
                  {investmentType === 'scheduled' && scheduledDate && (
                    <p className="text-green-400">
                      Scheduled for: {new Date(scheduledDate).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    onClick={() => {
                      setShowInvestmentModal(false);
                      setSelectedPlan(null);
                      setInvestmentAmount('');
                      setScheduledDate('');
                      setInvestmentType('immediate');
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-primary px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvest}
                    className="flex-1 btn-gradient px-3 py-2 rounded-lg text-xs sm:text-sm"
                  >
                    {investmentType === 'scheduled' ? 'Schedule Investment' : 'Invest Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
