"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Wallet, Plus, Copy, CheckCircle, AlertCircle, Circle } from "lucide-react"

interface Wallet {
  id: string
  currency: string
  address: string
  network: string
  status: string
  balance: number
  createdAt: string
  updatedAt: string
}

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingWallet, setIsAddingWallet] = useState(false)
  const [newWallet, setNewWallet] = useState({
    currency: "",
    address: "",
    network: "",
  })
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/wallets')
      
      if (response.ok) {
        const data = await response.json()
        setWallets(data.wallets)
      } else {
        console.error('Failed to fetch wallets')
      }
    } catch (error) {
      console.error('Error fetching wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWallet = async () => {
    if (!newWallet.currency || !newWallet.address || !newWallet.network) {
      alert('Please fill in all fields')
      return
    }

    try {
      setIsAddingWallet(true)
      const response = await fetch('/api/admin/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWallet),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Add the new wallet to the list
          setWallets(prev => [...prev, data.wallet])
          setNewWallet({ currency: "", address: "", network: "" })
          alert('Wallet address added successfully!')
        }
      } else {
        console.error('Failed to add wallet')
        alert('Failed to add wallet address')
      }
    } catch (error) {
      console.error('Error adding wallet:', error)
      alert('Error adding wallet address')
    } finally {
      setIsAddingWallet(false)
    }
  }

  const copyToClipboard = async (address: string) => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(address)
        setCopiedAddress(address)
        setTimeout(() => setCopiedAddress(null), 2000)
      }
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const getCurrencyIcon = (currency: string | undefined) => {
    if (!currency) {
      return <Wallet className="w-5 h-5 text-slate-400" />
    }
    
    switch (currency.toLowerCase()) {
      case "bitcoin":
        return <Circle className="w-5 h-5 text-orange-500" />
      case "ethereum":
        return <Circle className="w-5 h-5 text-blue-500" />
      case "usdt":
        return <Circle className="w-5 h-5 text-green-500" />
      case "usdc":
        return <Circle className="w-5 h-5 text-blue-400" />
      case "litecoin":
        return <Circle className="w-5 h-5 text-gray-500" />
      default:
        return <Wallet className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "inactive":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading wallets...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet Management</h1>
          <p className="text-slate-400">Manage deposit wallet addresses for different cryptocurrencies</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Wallet Address
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Wallet Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency" className="text-slate-300">Currency</Label>
                <Select value={newWallet.currency} onValueChange={(value) => setNewWallet(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="Ethereum">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">USDT (TRC20)</SelectItem>
                    <SelectItem value="USDC">USDC (ERC20)</SelectItem>
                    <SelectItem value="Litecoin">Litecoin (LTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="network" className="text-slate-300">Network</Label>
                <Select value={newWallet.network} onValueChange={(value) => setNewWallet(prev => ({ ...prev, network: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="TRC20">TRC20</SelectItem>
                    <SelectItem value="ERC20">ERC20</SelectItem>
                    <SelectItem value="Litecoin">Litecoin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address" className="text-slate-300">Wallet Address</Label>
                <Input
                  id="address"
                  value={newWallet.address}
                  onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter wallet address"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddWallet} 
                  disabled={isAddingWallet}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {isAddingWallet ? "Adding..." : "Add Wallet"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wallet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{wallets.length}</div>
              <div className="text-slate-400">Total Wallets</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {wallets.filter(w => w.status === 'active').length}
              </div>
              <div className="text-slate-400">Active Wallets</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {new Set(wallets.map(w => w.currency)).size}
              </div>
              <div className="text-slate-400">Supported Currencies</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                ${wallets.reduce((sum, w) => sum + w.balance, 0).toFixed(2)}
              </div>
              <div className="text-slate-400">Total Balance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets List */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Deposit Wallet Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getCurrencyIcon(wallet.currency)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{wallet.currency}</span>
                          <Badge className={getStatusColor(wallet.status)}>
                            {wallet.status}
                          </Badge>
                        </div>
                        <div className="text-slate-400 text-sm">{wallet.network}</div>
                        <div className="text-slate-500 text-xs">
                          Added: {new Date(wallet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-slate-400 text-xs mb-1">Balance</div>
                        <div className="text-white font-semibold">
                          {wallet.balance > 0 ? `${wallet.balance} ${wallet.currency}` : '0.00'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-600 px-3 py-1 rounded text-sm text-white font-mono">
                            {wallet.address.slice(0, 20)}...{wallet.address.slice(-8)}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(wallet.address)}
                            className="border-slate-500 text-slate-400 hover:bg-slate-600"
                          >
                            {copiedAddress === wallet.address ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="text-slate-500 text-xs">
                          Click to copy full address
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-slate-300">
            <p>• Only add wallet addresses that you control and have access to</p>
            <p>• Ensure the network matches the currency (e.g., Bitcoin for BTC, Ethereum for ETH)</p>
            <p>• Double-check the address before adding to avoid typos</p>
            <p>• Keep your private keys secure and never share them</p>
            <p>• Monitor wallet balances regularly for incoming deposits</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 