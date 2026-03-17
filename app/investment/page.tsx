'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  Plus,
  Minus,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface InvestmentPlan {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  totalReturn: number;
  status: 'active' | 'paused' | 'closed';
}

interface UserInvestment {
  id: string;
  planName: string;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  earned: number;
}

export default function InvestmentPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

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
        setInvestments(investmentsData);
      }
    } catch (error) {
      console.error('Error fetching investment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = async () => {
    if (!selectedPlan || !investmentAmount) return;

    try {
      const response = await fetch('/api/investment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: parseFloat(investmentAmount),
        }),
      });

      if (response.ok) {
        setShowInvestmentModal(false);
        setSelectedPlan(null);
        setInvestmentAmount('');
        // Refresh investments
        fetchInvestmentData();
      }
    } catch (error) {
      console.error('Error creating investment:', error);
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

  const getPlanStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'paused':
        return 'badge-warning';
      case 'closed':
        return 'badge-error';
      default:
        return 'badge-success';
    }
  };

  const getInvestmentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'completed':
        return 'badge-staking';
      case 'cancelled':
        return 'badge-error';
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
            <p className="text-white">Loading investment data...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Investment Center</h1>
              <p className="text-gray-300">Grow your wealth with our investment plans</p>
            </div>
            <Link 
              href="/investment/portfolio" 
              className="btn-gradient px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              My Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$2.5M+</div>
            <div className="text-gray-300">Total Invested</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-staking mb-2">15.2%</div>
            <div className="text-gray-300">Avg. Daily Return</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-reward mb-2">8.5K+</div>
            <div className="text-gray-300">Active Investors</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient mb-2">$450K+</div>
            <div className="text-gray-300">Total Returns Paid</div>
          </div>
        </div>

        {/* Investment Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Investment Plans</h2>
            <div className="flex gap-2">
              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                All Plans
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Active
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Popular
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="glass-card p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <span className={`badge ${getPlanStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Daily Return</span>
                    <span className="text-green-400 font-semibold">
                      {formatPercentage(plan.dailyReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Return</span>
                    <span className="text-purple-400 font-semibold">
                      {formatPercentage(plan.totalReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration</span>
                    <span className="text-white">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Min Investment</span>
                    <span className="text-white">{formatCurrency(plan.minAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Max Investment</span>
                    <span className="text-white">{formatCurrency(plan.maxAmount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowInvestmentModal(true);
                  }}
                  disabled={plan.status !== 'active'}
                  className="btn-gradient-staking w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {plan.status === 'active' ? 'Invest Now' : 
                   plan.status === 'paused' ? 'Temporarily Paused' : 'Plan Closed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Investments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Active Investments</h2>
            <Link href="/investment/portfolio" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              View All
            </Link>
          </div>

          <div className="glass-table">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Daily Return</th>
                  <th>Progress</th>
                  <th>Earned</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map((investment) => (
                  <tr key={investment.id}>
                    <td className="text-white font-medium">{investment.planName}</td>
                    <td className="text-white">{formatCurrency(investment.amount)}</td>
                    <td className="text-green-400 font-semibold">
                      {formatPercentage(investment.dailyReturn)}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <div className="progress-bar w-20 h-2">
                          <div 
                            className="progress-fill-staking h-full rounded-full"
                            style={{ width: `${investment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-sm">{investment.progress}%</span>
                      </div>
                    </td>
                    <td className="text-green-400">{formatCurrency(investment.earned)}</td>
                    <td className="text-gray-300">
                      {new Date(investment.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${getInvestmentStatusColor(investment.status)}`}>
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {investments.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Active Investments</h3>
              <p className="text-gray-300">
                Start investing in our plans to grow your wealth!
              </p>
            </div>
          )}
        </div>

        {/* Investment Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Why Choose Our Investment Plans?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-green-400 mb-4">
                <TrendingUp className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">High Returns</h3>
              <p className="text-gray-300 text-sm">
                Earn up to 450% total returns with our premium investment plans
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-purple-400 mb-4">
                <Shield className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure</h3>
              <p className="text-gray-300 text-sm">
                Bank-level security with insured investments and transparent operations
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-orange-400 mb-4">
                <Clock className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">Flexible</h3>
              <p className="text-gray-300 text-sm">
                Choose from 30-day to 90-day investment periods
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-modal p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">
              Invest in {selectedPlan.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Amount
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="glass-input w-full"
                  placeholder={`Min: ${formatCurrency(selectedPlan.minAmount)}`}
                  min={selectedPlan.minAmount}
                  max={selectedPlan.maxAmount}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily Return:</span>
                  <span className="text-green-400 font-semibold">
                    {formatPercentage(selectedPlan.dailyReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Return:</span>
                  <span className="text-purple-400 font-semibold">
                    {formatPercentage(selectedPlan.totalReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white">{selectedPlan.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated Daily:</span>
                  <span className="text-green-400">
                    {formatCurrency((parseFloat(investmentAmount) || 0) * (selectedPlan.dailyReturn / 100))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Earnings:</span>
                  <span className="text-purple-400">
                    {formatCurrency((parseFloat(investmentAmount) || 0) * (selectedPlan.totalReturn / 100))}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowInvestmentModal(false)}
                  className="flex-1 glass-card py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvestment}
                  disabled={!investmentAmount || parseFloat(investmentAmount) < selectedPlan.minAmount}
                  className="flex-1 btn-gradient-staking py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 