"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, TrendingUp, Users, DollarSign, Eye } from "lucide-react"

interface ReportsData {
  monthlyData: Array<{
    month: string
    deposits: number
    withdrawals: number
    investments: number
    users: number
  }>
  investmentPlansData: Array<{
    name: string
    value: number
    color: string
  }>
  topCountries: Array<{
    country: string
    users: number
    percentage: number
  }>
  summary: {
    totalRevenue: number
    totalUsers: number
    totalVolume: number
    avgMonthlyGrowth: number
  }
}

export default function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/reports')
        
        if (response.ok) {
          const data = await response.json()
          setReportsData(data)
        } else {
          console.error('Failed to fetch reports data')
        }
      } catch (error) {
        console.error('Error fetching reports data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReportsData()
  }, [])

  if (loading || !reportsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading reports...</div>
      </div>
    )
  }

  const { monthlyData, investmentPlansData, topCountries, summary } = reportsData
  const { totalRevenue, totalUsers, totalVolume, avgMonthlyGrowth } = summary

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-slate-400">Platform performance and user insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-1">Total Revenue</h3>
                <p className="text-white text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-green-400 text-sm">+{avgMonthlyGrowth}% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-1">Total Users</h3>
                <p className="text-white text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-blue-400 text-sm">+8.2% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-1">Total Volume</h3>
                <p className="text-white text-2xl font-bold">${(totalVolume / 1000000).toFixed(1)}M</p>
                <p className="text-purple-400 text-sm">+15.3% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-400 text-sm mb-1">Avg Session</h3>
                <p className="text-white text-2xl font-bold">24m</p>
                <p className="text-yellow-400 text-sm">+2.1% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="deposits" fill="#10b981" name="Deposits" />
                <Bar dataKey="withdrawals" fill="#ef4444" name="Withdrawals" />
                <Bar dataKey="investments" fill="#3b82f6" name="Investments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={3} name="Total Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Plans Distribution */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Investment Plans Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={investmentPlansData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {investmentPlansData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {investmentPlansData.map((plan, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-slate-300 text-sm">{plan.name}</span>
                  <span className="text-white font-semibold">{plan.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Users by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{country.country}</div>
                      <div className="text-slate-400 text-sm">{country.users.toLocaleString()} users</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-700 text-white">{country.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
              <div className="text-slate-400">Success Rate</div>
              <div className="text-slate-500 text-sm">Transaction success rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2.4h</div>
              <div className="text-slate-400">Avg Processing</div>
              <div className="text-slate-500 text-sm">Average processing time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">98.7%</div>
              <div className="text-slate-400">Uptime</div>
              <div className="text-slate-500 text-sm">Platform availability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
