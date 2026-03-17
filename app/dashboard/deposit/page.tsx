"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Wallet, Bitcoin, Copy, CheckCircle, Clock, AlertCircle, DollarSign, ExternalLink } from "lucide-react"
import { type ComponentType } from "react"

type PaymentMethod = {
  id: string
  name: string
  icon: ComponentType<any>
  fee: string
  minAmount: number
  maxAmount: number
  processingTime: string
  status: string
  description?: string
  walletAddress?: string
}

export default function DepositPage() {
  const { user, loading: authLoading } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [amount, setAmount] = useState("")
  const [transactionHash, setTransactionHash] = useState("")
  const [paymentProof, setPaymentProof] = useState("")
  const [deposits, setDeposits] = useState<any[]>([])
  const [depositStats, setDepositStats] = useState({
    totalDeposits: 0,
    successfulDeposits: 0,
    pendingDeposits: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositLoading, setDepositLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [walletAddresses, setWalletAddresses] = useState<any[]>([])
  const [walletAddressesLoading, setWalletAddressesLoading] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const fetchWalletAddresses = async () => {
    try {
      setWalletAddressesLoading(true)
      const response = await fetch('/api/wallet-addresses', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 Wallet addresses data:', data)
        setWalletAddresses(data)
      } else {
        console.error('Failed to fetch wallet addresses')
      }
    } catch (err) {
      console.error('Error fetching wallet addresses:', err)
    } finally {
      setWalletAddressesLoading(false)
    }
  }

  const fetchDeposits = async () => {
    try {
      setLoading(true)
      setUnauthorized(false)
      setError(null)
      const response = await fetch('/api/dashboard/deposits', {
        credentials: 'include'
      })
      
      if (response.status === 401 || response.status === 403) {
        setUnauthorized(true)
        setDeposits([])
        setDepositStats({
          totalDeposits: 0,
          successfulDeposits: 0,
          pendingDeposits: 0,
        })
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setDeposits(data.deposits || [])
        setDepositStats(data.stats || {
          totalDeposits: 0,
          successfulDeposits: 0,
          pendingDeposits: 0,
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch deposits:', errorData)
        setError('Failed to load deposit data')
      }
    } catch (error) {
      console.error('Error fetching deposits:', error)
      setError('Network error while loading deposits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeposits()
    fetchWalletAddresses()
  }, [])

  // Add a fallback for when API fails
  useEffect(() => {
    if (!loading && deposits.length === 0 && !error) {
      setDepositStats({
        totalDeposits: 0,
        successfulDeposits: 0,
        pendingDeposits: 0,
      })
    }
  }, [loading, deposits, error])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDeposit = (method: PaymentMethod) => {
    console.log('🔍 handleDeposit - Method data:', method)
    console.log('🔍 handleDeposit - Wallet address:', method.walletAddress)
    setSelectedMethod(method)
    setShowDepositModal(true)
    setError(null)
    setSuccess(null)
    setAmount("")
    setTransactionHash("")
    setPaymentProof("")
  }

  const handleCreateDeposit = async () => {
    if (!selectedMethod || !amount || !transactionHash) {
      setError('Please fill in all required fields')
      return
    }
    
    setDepositLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/deposits/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          method: selectedMethod.id,
          amount: parseFloat(amount),
          transactionHash: transactionHash,
          paymentProof: paymentProof,
          walletAddress: selectedMethod.walletAddress
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Deposit submitted successfully! Please wait for approval.')
        setAmount('')
        setTransactionHash('')
        setPaymentProof('')
        setShowDepositModal(false)
        setSelectedMethod(null)
        // Refresh deposits
        fetchDeposits()
      } else {
        setError(data.error || 'Failed to submit deposit')
      }
    } catch (error) {
      setError('Failed to submit deposit')
    } finally {
      setDepositLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const recentDeposits = deposits.slice(0, 5).map(deposit => ({
    id: deposit.id,
    amount: deposit.amount,
    method: deposit.payment_method || deposit.method,
    status: deposit.status,
    date: new Date(deposit.created_at).toLocaleDateString(),
    hash: deposit.tx_hash || deposit.reference || 'N/A'
  }))

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-primary">Loading deposits...</p>
          </div>
        </div>
      </div>
    )
  }

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

  if (unauthorized || !user) {
    return (
      <div className="min-h-screen animated-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="text-primary mb-4">Please log in to view deposits</div>
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">Deposit</h1>
            <p className="text-tertiary text-sm sm:text-base">Add funds to your account to start investing</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="glass-card mb-4 sm:mb-6">
            <CardContent className="p-4">
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-4">
                {error}
              </div>
            </CardContent>
          </div>
        )}
        {success && (
          <div className="glass-card mb-4 sm:mb-6">
            <CardContent className="p-4">
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg p-4">
                {success}
              </div>
            </CardContent>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Deposits</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${depositStats.totalDeposits.toLocaleString()}</p>
              </div>
              <div className="text-green-400">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Successful</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{depositStats.successfulDeposits}</p>
              </div>
              <div className="text-green-400">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{depositStats.pendingDeposits}</p>
              </div>
              <div className="text-yellow-400">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Methods */}
        {walletAddressesLoading ? (
          <div className="glass-card mb-4 sm:mb-6 lg:mb-8">
            <CardContent className="p-6 text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-white">Loading payment methods...</p>
            </CardContent>
          </div>
        ) : walletAddresses.length === 0 ? (
          <div className="glass-card mb-4 sm:mb-6 lg:mb-8">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <DollarSign className="w-12 h-12 mx-auto mb-2" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No Payment Methods</h3>
              <p className="text-gray-300 text-sm">No payment methods are currently available</p>
            </CardContent>
          </div>
        ) : (
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Payment Methods</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {walletAddresses.map((method) => {
                const IconComponent = method.type === 'bitcoin' ? Bitcoin : 
                                     method.type === 'ethereum' ? Wallet : CreditCard
                
                return (
                  <div key={method.id} className="glass-card hover:bg-white/10 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                            <IconComponent />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm sm:text-base">{method.name}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">{method.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={method.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {method.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-gray-400">Min Amount</p>
                            <p className="text-white font-semibold">${method.min_amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Max Amount</p>
                            <p className="text-white font-semibold">${method.max_amount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-gray-400">Fee</p>
                            <p className="text-white font-semibold">{method.fee}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Processing</p>
                            <p className="text-white font-semibold">{method.processing_time}</p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleDeposit({
                            id: method.type,
                            name: method.name,
                            icon: IconComponent,
                            fee: `${method.fee}%`,
                            minAmount: method.min_amount,
                            maxAmount: method.max_amount,
                            processingTime: method.processing_time,
                            status: method.status,
                            description: method.description,
                            walletAddress: method.wallet_address
                          })}
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-600 hover:to-amber-600"
                        >
                          Deposit with {method.name}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Deposits */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Recent Deposits</h2>
          
          {recentDeposits.length === 0 ? (
            <div className="glass-card">
              <CardContent className="p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <DollarSign className="w-12 h-12 mx-auto mb-2" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No Recent Deposits</h3>
                <p className="text-gray-300 text-sm">Your deposit history will appear here</p>
              </CardContent>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentDeposits.map((deposit) => (
                <div key={deposit.id} className="glass-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <h3 className="text-white font-semibold text-sm sm:text-base">
                              {deposit.method} Deposit
                            </h3>
                            <Badge 
                              variant={deposit.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {deposit.status}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-xs sm:text-sm">ID: {deposit.id}</p>
                          <p className="text-gray-500 text-xs">{deposit.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-green-400 font-semibold text-sm sm:text-base">
                          +${deposit.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">{deposit.hash}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deposit Instructions */}
        <div className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl">How to Deposit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-400 font-bold text-sm sm:text-base">1</span>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Select Method</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Choose your preferred payment method</p>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-400 font-bold text-sm sm:text-base">2</span>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Copy Address</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Copy the wallet address provided</p>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400 font-bold text-sm sm:text-base">3</span>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Make Payment</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Send payment to the provided address</p>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400 font-bold text-sm sm:text-base">4</span>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Submit Proof</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Submit transaction hash and wait for approval</p>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && selectedMethod && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDepositModal(false)
              setSelectedMethod(null)
              setAmount('')
              setTransactionHash('')
              setPaymentProof('')
              setError(null)
              setSuccess(null)
            }}
          >
            <div 
              className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">
                  Deposit with {selectedMethod.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg p-3 text-sm">
                    {success}
                  </div>
                )}

                {/* Wallet Address Section */}
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-sm">Wallet Address</h3>
                    <Button
                      onClick={() => copyToClipboard(selectedMethod.walletAddress || '')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {copiedAddress ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedAddress ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-black/20 rounded p-3">
                    <p className="text-white text-xs break-all font-mono">
                      {selectedMethod.walletAddress || 'No wallet address available'}
                    </p>
                  </div>
                  {!selectedMethod.walletAddress && (
                    <p className="text-red-400 text-xs">
                      Warning: No wallet address found for this payment method
                    </p>
                  )}
                  <p className="text-gray-400 text-xs">
                    Send exactly the amount you want to deposit to this address. 
                    Make sure to include the correct network fees.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="amount" className="text-white text-sm">
                      Amount Sent (USD)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`$${selectedMethod.minAmount} - $${selectedMethod.maxAmount.toLocaleString()}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                      min={selectedMethod.minAmount}
                      max={selectedMethod.maxAmount}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transactionHash" className="text-white text-sm">
                      Transaction Hash <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="transactionHash"
                      type="text"
                      placeholder="Enter transaction hash from your wallet"
                      value={transactionHash}
                      onChange={(e) => setTransactionHash(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentProof" className="text-white text-sm">
                      Additional Proof (Optional)
                    </Label>
                    <Textarea
                      id="paymentProof"
                      placeholder="Any additional proof, screenshots, or notes..."
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white font-semibold">{selectedMethod.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fee:</span>
                      <span className="text-green-400 font-semibold">{selectedMethod.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processing:</span>
                      <span className="text-white font-semibold">{selectedMethod.processingTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowDepositModal(false)
                        setSelectedMethod(null)
                        setAmount('')
                        setTransactionHash('')
                        setPaymentProof('')
                        setError(null)
                        setSuccess(null)
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={depositLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDeposit}
                      disabled={depositLoading || !amount || !transactionHash}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-600 hover:to-amber-600"
                    >
                      {depositLoading ? "Submitting..." : "Submit Deposit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
