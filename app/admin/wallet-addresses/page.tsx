"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Copy, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface WalletAddress {
  id: number
  name: string
  type: string
  address: string
  network: string
  fee: number
  min_amount: number
  max_amount: number
  processing_time: string
  status: string
  description: string
  icon: string
  created_at: string
}

export default function WalletAddressesPage() {
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState<WalletAddress | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    network: '',
    fee: 0,
    min_amount: 0,
    max_amount: 999999,
    processing_time: 'Instant',
    description: '',
    icon: 'wallet'
  })

  useEffect(() => {
    fetchWalletAddresses()
  }, [])

  const fetchWalletAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/wallet-addresses', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet addresses')
      }
      
      const data = await response.json()
      setWalletAddresses(data)
    } catch (err) {
      setError('Failed to load wallet addresses')
      console.error('Error fetching wallet addresses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWalletAddress = async () => {
    try {
      const response = await fetch('/api/admin/wallet-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create wallet address')
      }

      setShowAddDialog(false)
      setFormData({
        name: '',
        type: '',
        address: '',
        network: '',
        fee: 0,
        min_amount: 0,
        max_amount: 999999,
        processing_time: 'Instant',
        description: '',
        icon: 'wallet'
      })
      fetchWalletAddresses()
    } catch (err) {
      setError('Failed to create wallet address')
      console.error('Error creating wallet address:', err)
    }
  }

  const handleEditWalletAddress = async () => {
    if (!editingAddress) return

    try {
      const response = await fetch(`/api/admin/wallet-addresses/${editingAddress.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update wallet address')
      }

      setShowEditDialog(false)
      setEditingAddress(null)
      setFormData({
        name: '',
        type: '',
        address: '',
        network: '',
        fee: 0,
        min_amount: 0,
        max_amount: 999999,
        processing_time: 'Instant',
        description: '',
        icon: 'wallet'
      })
      fetchWalletAddresses()
    } catch (err) {
      setError('Failed to update wallet address')
      console.error('Error updating wallet address:', err)
    }
  }

  const handleDeleteWalletAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this wallet address?')) return

    try {
      const response = await fetch(`/api/admin/wallet-addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete wallet address')
      }

      fetchWalletAddresses()
    } catch (err) {
      setError('Failed to delete wallet address')
      console.error('Error deleting wallet address:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success'
      case 'inactive':
        return 'badge-error'
      case 'maintenance':
        return 'badge-warning'
      default:
        return 'badge-success'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Wallet Addresses</h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet Address
          </Button>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-white">Loading wallet addresses...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet Addresses</h1>
          <p className="text-gray-300">Manage deposit wallet addresses</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Wallet Address
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-modal max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-white">Add New Wallet Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 modal-scroll" style={{ maxHeight: '400px' }}>
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input"
                  placeholder="Bitcoin Wallet"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-white">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
      <SelectItem value="ethereum">Ethereum</SelectItem>
      <SelectItem value="usdt">USDT</SelectItem>
      <SelectItem value="cardano">Cardano</SelectItem>
      <SelectItem value="solana">Solana</SelectItem>
      <SelectItem value="ripple">Ripple</SelectItem>
      <SelectItem value="dogecoin">Dogecoin</SelectItem>
      <SelectItem value="binancecoin">Binance Coin</SelectItem>
      <SelectItem value="polkadot">Polkadot</SelectItem>
      <SelectItem value="bank">Bank Transfer</SelectItem>
      <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="glass-input"
                  placeholder="Wallet address or account details"
                />
              </div>
              <div>
                <Label htmlFor="network" className="text-white">Network</Label>
                <Input
                  id="network"
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="glass-input"
                  placeholder="Bitcoin, Ethereum, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fee" className="text-white">Fee (%)</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <Label htmlFor="processing_time" className="text-white">Processing Time</Label>
                  <Input
                    id="processing_time"
                    value={formData.processing_time}
                    onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
                    className="glass-input"
                    placeholder="Instant"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_amount" className="text-white">Min Amount</Label>
                  <Input
                    id="min_amount"
                    type="number"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) || 0 })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <Label htmlFor="max_amount" className="text-white">Max Amount</Label>
                  <Input
                    id="max_amount"
                    type="number"
                    value={formData.max_amount}
                    onChange={(e) => setFormData({ ...formData, max_amount: parseFloat(e.target.value) || 999999 })}
                    className="glass-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-input"
                  placeholder="Description of this deposit method"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWalletAddress}>
                  Add Wallet Address
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Wallet Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {walletAddresses.map((address) => (
          <Card key={address.id} className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{address.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(address.status)}
                  <Badge className={getStatusColor(address.status)}>
                    {address.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Type</p>
                <p className="text-white font-medium">{address.type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Network</p>
                <p className="text-white font-medium">{address.network}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-mono text-sm truncate">{address.address}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(address.address)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Fee</p>
                  <p className="text-white">{address.fee}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Processing</p>
                  <p className="text-white">{address.processing_time}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Min Amount</p>
                  <p className="text-white">${address.min_amount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Amount</p>
                  <p className="text-white">${address.max_amount}</p>
                </div>
              </div>
              {address.description && (
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white text-sm">{address.description}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <p className="text-gray-400 text-xs">
                  Created: {new Date(address.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingAddress(address)
                      setFormData({
                        name: address.name,
                        type: address.type,
                        address: address.address,
                        network: address.network,
                        fee: address.fee,
                        min_amount: address.min_amount,
                        max_amount: address.max_amount,
                        processing_time: address.processing_time,
                        description: address.description,
                        icon: address.icon
                      })
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteWalletAddress(address.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-modal max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-white">Edit Wallet Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 modal-scroll" style={{ maxHeight: '400px' }}>
            <div>
              <Label htmlFor="edit-name" className="text-white">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input"
              />
            </div>
            <div>
              <Label htmlFor="edit-type" className="text-white">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-address" className="text-white">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="glass-input"
              />
            </div>
            <div>
              <Label htmlFor="edit-network" className="text-white">Network</Label>
              <Input
                id="edit-network"
                value={formData.network}
                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                className="glass-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fee" className="text-white">Fee (%)</Label>
                <Input
                  id="edit-fee"
                  type="number"
                  step="0.01"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                  className="glass-input"
                />
              </div>
              <div>
                <Label htmlFor="edit-processing-time" className="text-white">Processing Time</Label>
                <Input
                  id="edit-processing-time"
                  value={formData.processing_time}
                  onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
                  className="glass-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-min-amount" className="text-white">Min Amount</Label>
                <Input
                  id="edit-min-amount"
                  type="number"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) || 0 })}
                  className="glass-input"
                />
              </div>
              <div>
                <Label htmlFor="edit-max-amount" className="text-white">Max Amount</Label>
                <Input
                  id="edit-max-amount"
                  type="number"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({ ...formData, max_amount: parseFloat(e.target.value) || 999999 })}
                  className="glass-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-white">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-input"
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Test Section 1</Label>
              <div className="h-32 bg-gray-700/50 rounded p-2 text-white text-sm">
                This is test content to make the modal longer and test scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Test Section 2</Label>
              <div className="h-32 bg-gray-700/50 rounded p-2 text-white text-sm">
                More test content to ensure the modal is long enough to scroll. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Test Section 3</Label>
              <div className="h-32 bg-gray-700/50 rounded p-2 text-white text-sm">
                Additional content to test scrolling functionality. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Test Section 4</Label>
              <div className="h-32 bg-gray-700/50 rounded p-2 text-white text-sm">
                Even more content to ensure scrolling is definitely needed. Duis aute irure dolor in reprehenderit in voluptate.
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Test Section 5</Label>
              <div className="h-32 bg-gray-700/50 rounded p-2 text-white text-sm">
                Final test section to guarantee the modal content exceeds the container height.
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditWalletAddress}>
                Update Wallet Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}