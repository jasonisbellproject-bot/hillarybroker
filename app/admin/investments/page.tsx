"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, DollarSign, Calendar, Users, Eye } from "lucide-react"

interface Investment {
  id: string
  user: string
  plan: string
  amount: number
  dailyReturn: number
  totalReturn: number
  startDate: string
  endDate: string
  status: string
  progress: number
}

interface InvestmentStats {
  totalInvestments: number
  activeInvestments: number
  totalReturns: number
  averageReturn: number
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [stats, setStats] = useState<InvestmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/investments')
        
        if (response.ok) {
          const data = await response.json()
          setInvestments(data.investments || data) // Handle both new and old response formats
          
          // Calculate stats from the data if not provided
          if (!data.stats) {
            const totalInvestments = data.investments?.length || 0
            const activeInvestments = data.investments?.filter((inv: any) => inv.status === 'active').length || 0
            const totalReturns = data.investments?.reduce((sum: number, inv: any) => sum + (inv.totalReturn || 0), 0) || 0
            const averageReturn = totalInvestments > 0 ? (totalReturns / totalInvestments) : 0
            
            setStats({
              totalInvestments,
              activeInvestments,
              totalReturns,
              averageReturn: Math.round(averageReturn * 100) / 100
            })
          } else {
            setStats(data.stats)
          }
        } else {
          console.error('Failed to fetch investments:', response.status)
        }
      } catch (error) {
        console.error('Error fetching investments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "completed":
        return "bg-blue-500/20 text-blue-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || investment.status === statusFilter
    const matchesPlan = planFilter === "all" || investment.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading investments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Investment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                ${stats?.totalInvestments?.toLocaleString() || 0}
              </div>
              <div className="text-slate-400">Total Investments</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stats?.activeInvestments || 0}
              </div>
              <div className="text-slate-400">Active Investments</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                ${stats?.totalReturns?.toLocaleString() || 0}
              </div>
              <div className="text-slate-400">Total Returns</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {stats?.averageReturn || 0}%
              </div>
              <div className="text-slate-400">Average Return</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-600">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search investments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Plans</option>
                <option value="Starter Plan">Starter Plan</option>
                <option value="Professional Plan">Professional Plan</option>
                <option value="Premium Plan">Premium Plan</option>
                <option value="VIP Plan">VIP Plan</option>
              </select>
            </div>

            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Investments Table */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Investment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{investment.id}</span>
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                        </div>
                        <div className="text-slate-400 text-sm">{investment.user}</div>
                        <div className="text-slate-500 text-xs">{investment.plan}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Amount</div>
                        <div className="text-white font-semibold">${investment.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Daily Return</div>
                        <div className="text-green-400 font-semibold">${investment.dailyReturn}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Total Return</div>
                        <div className="text-blue-400 font-semibold">${investment.totalReturn.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={investment.progress} 
                            className="w-16 h-2"
                          />
                          <span className="text-white text-sm">{investment.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Timeline */}
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">Start: {investment.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">End: {investment.endDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 