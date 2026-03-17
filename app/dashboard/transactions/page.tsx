"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Calendar } from "lucide-react"

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalEarnings: 0,
    totalInvestments: 0
  })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/dashboard/transactions', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch transactions')
        }
        
        const data = await response.json()
        setTransactions(data.transactions || [])
        setStats(data.stats || {
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalEarnings: 0,
          totalInvestments: 0
        })
      } catch (err: any) {
        console.error('Error fetching transactions:', err)
        setError(err.message || 'Failed to load transactions')
        setTransactions([])
        setStats({
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalEarnings: 0,
          totalInvestments: 0
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTransactions()
    }
  }, [user])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-4 h-4 text-green-500" />
      case "withdrawal":
        return <ArrowUp className="w-4 h-4 text-red-500" />
      case "investment":
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
      case "earning":
        return <ArrowDown className="w-4 h-4 text-green-500" />
      default:
        return <ArrowUpDown className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "claimed":
        return "bg-green-500/20 text-green-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "pending":
        return "bg-green-500/20 text-green-400"
      case "failed":
      case "rejected":
        return "bg-red-500/20 text-red-400"
      case "active":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-500/20 text-green-400"
      case "withdrawal":
        return "bg-red-500/20 text-red-400"
      case "investment":
        return "bg-blue-500/20 text-blue-400"
      case "earning":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.method?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.hash?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  if (authLoading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-primary">Loading authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="text-primary mb-4">Please log in to view transactions</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-primary">Loading transactions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">Transactions</h1>
            <p className="text-tertiary text-sm sm:text-base">View your transaction history and activity</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card mb-4 sm:mb-6">
            <CardContent className="p-4">
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4">
                {error}
              </div>
            </CardContent>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Deposits</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${stats.totalDeposits.toLocaleString()}</p>
              </div>
              <div className="text-green-400">
                <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Withdrawals</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${stats.totalWithdrawals.toLocaleString()}</p>
              </div>
              <div className="text-red-400">
                <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="text-yellow-400">
                <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Active Investments</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${stats.totalInvestments.toLocaleString()}</p>
              </div>
              <div className="text-blue-400">
                <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card mb-4 sm:mb-6 lg:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-primary placeholder-tertiary"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 text-primary rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="investment">Investments</option>
                  <option value="earning">Earnings</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 text-primary rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                  <option value="claimed">Claimed</option>
                  <option value="active">Active</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end mt-4">
              <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-600 hover:to-amber-600">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Transactions */}
        <div className="glass-card">
          <CardHeader>
            <CardTitle className="text-primary text-lg sm:text-xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-primary font-semibold text-sm sm:text-base">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </h3>
                        <Badge 
                          className={`text-xs ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-tertiary text-xs sm:text-sm">{transaction.method}</p>
                      <p className="text-muted text-xs">ID: {transaction.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-right">
                      <p className={`font-semibold text-sm sm:text-base ${
                        transaction.type === 'deposit' || transaction.type === 'earning' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'earning' ? '+' : '-'}
                        ${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-tertiary text-xs">{formatDate(transaction.date)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <ArrowUpDown className="w-12 h-12 mx-auto mb-2" />
                </div>
                <h3 className="text-primary font-semibold text-lg mb-2">No Transactions Found</h3>
                <p className="text-tertiary text-sm">
                  {transactions.length === 0 
                    ? "You haven't made any transactions yet" 
                    : "Try adjusting your filters or search terms"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  )
}
