"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Eye, CheckCircle, X, Trash2 } from "lucide-react"

interface Transaction {
  id: string
  user: string
  type: string
  amount: number
  method: string
  status: string
  date: string
  hash: string
  fee: number
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-4 h-4 text-green-500" />
      case "withdrawal":
        return <ArrowUp className="w-4 h-4 text-red-500" />
      case "investment":
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
      default:
        return <ArrowUpDown className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
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
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.hash?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/transactions')
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || data) // Handle both new and old response formats
      } else {
        console.error('Failed to fetch transactions:', response.status)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
  const pendingTransactions = transactions.filter((t) => t.status === "pending").length
  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const failedTransactions = transactions.filter((t) => t.status === "failed").length

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/transactions/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction approved:', data.message);
        // Refresh transactions list
        fetchTransactions();
      } else {
        console.error('Failed to approve transaction:', response.status);
        alert('Failed to approve transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('Error approving transaction. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/transactions/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction rejected:', data.message);
        // Refresh transactions list
        fetchTransactions();
      } else {
        console.error('Failed to reject transaction:', response.status);
        alert('Failed to reject transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert('Error rejecting transaction. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(id);
      const response = await fetch(`/api/admin/transactions/${id}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction deleted:', data.message);
        // Refresh transactions list
        fetchTransactions();
      } else {
        console.error('Failed to delete transaction:', response.status);
        alert('Failed to delete transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">${totalVolume.toLocaleString()}</div>
              <div className="text-slate-400">Total Volume</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{pendingTransactions}</div>
              <div className="text-slate-400">Pending</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{completedTransactions}</div>
              <div className="text-slate-400">Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{failedTransactions}</div>
              <div className="text-slate-400">Failed</div>
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
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="investment">Investments</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{transaction.id}</span>
                          <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                        </div>
                        <div className="text-slate-400 text-sm">{transaction.user}</div>
                        <div className="text-slate-500 text-xs">{transaction.hash}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Amount</div>
                        <div className="text-white font-bold text-lg">
                          {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-xs">{transaction.method}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Date</div>
                        <div className="text-white text-sm">{transaction.date}</div>
                        {transaction.fee > 0 && <div className="text-slate-400 text-xs">Fee: {transaction.fee}</div>}
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Status</div>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {transaction.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(transaction.id)}
                            disabled={actionLoading === transaction.id}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === transaction.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(transaction.id)}
                            disabled={actionLoading === transaction.id}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionLoading === transaction.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={actionLoading === transaction.id}
                        className="bg-red-800 hover:bg-red-900 disabled:opacity-50"
                      >
                        {actionLoading === transaction.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-slate-400">No transactions found matching your criteria.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
