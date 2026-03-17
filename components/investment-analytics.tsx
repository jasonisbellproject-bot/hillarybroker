"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from "lucide-react"

interface InvestmentStats {
  totalInvested: number
  activeInvestments: number
  totalEarnings: number
  averageReturn: number
  activeAmount: number
  completedCount: number
}

interface InvestmentAnalyticsProps {
  stats: InvestmentStats
  investments: any[]
}

export function InvestmentAnalytics({ stats, investments }: InvestmentAnalyticsProps) {
  const calculateTotalValue = () => {
    return stats.totalInvested + stats.totalEarnings
  }

  const calculateROI = () => {
    if (stats.totalInvested === 0) return 0
    return ((stats.totalEarnings / stats.totalInvested) * 100)
  }

  const getTopPerformingInvestment = () => {
    if (!investments || investments.length === 0) return null
    return investments.reduce((best, current) => 
      current.totalEarnings > best.totalEarnings ? current : best
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const topInvestment = getTopPerformingInvestment()

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-white text-xl font-bold">{formatCurrency(calculateTotalValue())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">ROI</p>
                <p className="text-white text-xl font-bold">{formatPercentage(calculateROI())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Investments</p>
                <p className="text-white text-xl font-bold">{stats.activeInvestments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Return</p>
                <p className="text-white text-xl font-bold">{formatPercentage(stats.averageReturn)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Breakdown */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Investment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Invested</span>
                <span className="text-white font-semibold">{formatCurrency(stats.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Earnings</span>
                <span className="text-green-400 font-semibold">{formatCurrency(stats.totalEarnings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Amount</span>
                <span className="text-yellow-400 font-semibold">{formatCurrency(stats.activeAmount)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Portfolio Growth</span>
                <span className="text-white">{formatPercentage(calculateROI())}</span>
              </div>
              <Progress value={Math.min(100, calculateROI())} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-slate-400 text-sm">Active</p>
                <p className="text-white text-xl font-bold">{stats.activeInvestments}</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-white text-xl font-bold">{stats.completedCount}</p>
              </div>
            </div>
            
            {topInvestment && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-slate-400 text-sm mb-2">Top Performing Investment</p>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{topInvestment.planName}</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-400">Amount</p>
                      <p className="text-white">{formatCurrency(topInvestment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Earnings</p>
                      <p className="text-green-400">{formatCurrency(topInvestment.totalEarnings || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {investments.length > 0 && (
        <Card className="backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investments.slice(0, 5).map((investment: any) => (
                <div key={investment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{investment.planName}</p>
                      <p className="text-slate-400 text-sm">{formatCurrency(investment.amount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={investment.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {investment.status}
                    </Badge>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(investment.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 