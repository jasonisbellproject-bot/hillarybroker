"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle, Clock, Settings, DollarSign, Shield, Info } from "lucide-react"

interface PlatformSettings {
  min_withdrawal: number;
  max_withdrawal: number;
  daily_withdrawal_limit: number;
  withdrawal_fee: number;
  maintenance_mode: boolean;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setSettingsLoading(true)
      setError(null)
      
      try {
        // Fetch withdrawals
        const withdrawalsRes = await fetch("/api/admin/withdrawals", { credentials: "include" })
        if (!withdrawalsRes.ok) {
          const data = await withdrawalsRes.json().catch(() => ({}))
          setError(data.error || "Failed to fetch withdrawals")
          setWithdrawals([])
        } else {
          const data = await withdrawalsRes.json()
          setWithdrawals(data.withdrawals || [])
        }

        // Fetch platform settings
        const settingsRes = await fetch("/api/public/settings")
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setPlatformSettings(settingsData)
        } else {
          // Use default settings if API fails
          setPlatformSettings({
            min_withdrawal: 100,
            max_withdrawal: 25000,
            daily_withdrawal_limit: 10000,
            withdrawal_fee: 5,
            maintenance_mode: false
          })
        }
      } catch (e) {
        setError("Network error while loading data")
        setWithdrawals([])
      } finally {
        setLoading(false)
        setSettingsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    setActionLoading(withdrawalId)
    setSuccessMessage(null)
    
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Failed to ${action} withdrawal`)
      } else {
        setSuccessMessage(`Withdrawal ${action}d successfully`)
        // Refresh withdrawals list
        const refreshRes = await fetch("/api/admin/withdrawals", { credentials: "include" })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          setWithdrawals(data.withdrawals || [])
        }
      }
    } catch (e) {
      setError(`Network error while ${action}ing withdrawal`)
    } finally {
      setActionLoading(null)
    }
  }

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
        return <XCircle className="w-4 h-4 text-red-500" />
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending')
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved')
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed')
  const totalWithdrawn = withdrawals
    .filter(w => ['approved', 'completed'].includes(w.status))
    .reduce((sum, w) => sum + parseFloat(w.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Admin: Withdrawals</h1>
        <p className="text-gray-300 text-sm">Manage user withdrawal requests and settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-700 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Platform Settings */}
      {platformSettings && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Settings className="w-5 h-5 mr-2" />
              Withdrawal Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-gray-300">Min: ${platformSettings.min_withdrawal}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-red-400" />
                <span className="text-gray-300">Max: ${platformSettings.max_withdrawal}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">Daily Limit: ${platformSettings.daily_withdrawal_limit}</span>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Withdrawals</p>
                <p className="text-white font-bold text-lg">{withdrawals.length}</p>
              </div>
              <div className="text-blue-400">
                <Info className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-yellow-400 font-bold text-lg">{pendingWithdrawals.length}</p>
              </div>
              <div className="text-yellow-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-blue-400 font-bold text-lg">{approvedWithdrawals.length}</p>
              </div>
              <div className="text-blue-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-green-400 font-bold text-lg">${totalWithdrawn.toFixed(2)}</p>
              </div>
              <div className="text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawals Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-white">Loading withdrawals...</div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center text-gray-400">No withdrawals found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Method</th>
                    <th className="px-3 py-2 text-left">Address</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Reference</th>
                    <th className="px-3 py-2 text-left">Created</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(w => (
                    <tr key={w.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-3 py-2">
                        <div className="text-xs">
                          <div className="font-medium text-white">
                            {w.users?.first_name && w.users?.last_name 
                              ? `${w.users.first_name} ${w.users.last_name}`
                              : w.users?.email || 'Unknown User'
                            }
                          </div>
                          <div className="text-gray-400">{w.users?.email || 'No email'}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 font-medium">${parseFloat(w.amount).toFixed(2)}</td>
                      <td className="px-3 py-2">{w.method || w.payment_method}</td>
                      <td className="px-3 py-2" title={w.wallet_address || w.address}>
                        <div className="max-w-32 truncate">
                          {(w.wallet_address || w.address || '').substring(0, 20)}...
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(w.status)}
                          <Badge className={`text-xs ${getStatusColor(w.status)}`}>
                            {w.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs font-mono">{w.reference || 'N/A'}</td>
                      <td className="px-3 py-2 text-xs">
                        {w.created_at ? new Date(w.created_at).toLocaleString() : ''}
                      </td>
                      <td className="px-3 py-2">
                        {w.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleAction(w.id, 'approve')}
                              disabled={actionLoading === w.id}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              {actionLoading === w.id ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(w.id, 'reject')}
                              disabled={actionLoading === w.id}
                              className="text-xs"
                            >
                              {actionLoading === w.id ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 