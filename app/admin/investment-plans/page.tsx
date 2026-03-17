"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, TrendingUp, DollarSign, Calendar, Users } from "lucide-react"

interface InvestmentPlan {
  id: number
  name: string
  description: string
  min_amount: number
  max_amount: number
  daily_return: number
  duration: number
  total_return: number
  status: 'active' | 'inactive' | 'limited'
  features?: string[]
  created_at: string
  updated_at: string
}

export default function AdminInvestmentPlansPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minInvestment: "",
    maxInvestment: "",
    dailyReturn: "",
    duration: "",
    status: "active"
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/investment-plans')
      
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || data)
      } else {
        console.error('Failed to fetch plans:', response.status)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async () => {
    try {
      const response = await fetch('/api/admin/investment-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          minInvestment: parseFloat(formData.minInvestment),
          maxInvestment: parseFloat(formData.maxInvestment),
          dailyReturn: parseFloat(formData.dailyReturn),
          duration: parseInt(formData.duration),
          status: formData.status
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setFormData({
          name: "",
          description: "",
          minInvestment: "",
          maxInvestment: "",
          dailyReturn: "",
          duration: "",
          status: "active"
        })
        fetchPlans()
      } else {
        console.error('Failed to create plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  const handleEditPlan = async () => {
    if (!editingPlan) return

    try {
      const response = await fetch(`/api/admin/investment-plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          minInvestment: parseFloat(formData.minInvestment),
          maxInvestment: parseFloat(formData.maxInvestment),
          dailyReturn: parseFloat(formData.dailyReturn),
          duration: parseInt(formData.duration),
          status: formData.status
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setEditingPlan(null)
        setFormData({
          name: "",
          description: "",
          minInvestment: "",
          maxInvestment: "",
          dailyReturn: "",
          duration: "",
          status: "active"
        })
        fetchPlans()
      } else {
        console.error('Failed to update plan')
      }
    } catch (error) {
      console.error('Error updating plan:', error)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`/api/admin/investment-plans/${planId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPlans()
      } else {
        console.error('Failed to delete plan')
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }

  const openEditDialog = (plan: InvestmentPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      minInvestment: plan.min_amount.toString(),
      maxInvestment: plan.max_amount.toString(),
      dailyReturn: plan.daily_return.toString(),
      duration: plan.duration.toString(),
      status: plan.status
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-500/20 text-green-400" 
      : "bg-red-500/20 text-red-400"
  }

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading investment plans...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Plans Management</h1>
          <p className="text-slate-400">Create and manage investment plans for users</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-600">
            <DialogHeader>
              <DialogTitle className="text-white">Create Investment Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Starter Plan"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Plan description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minInvestment" className="text-white">Min Investment ($)</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => setFormData({...formData, minInvestment: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="maxInvestment" className="text-white">Max Investment ($)</Label>
                  <Input
                    id="maxInvestment"
                    type="number"
                    value={formData.maxInvestment}
                    onChange={(e) => setFormData({...formData, maxInvestment: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dailyReturn" className="text-white">Daily Return (%)</Label>
                  <Input
                    id="dailyReturn"
                    type="number"
                    step="0.01"
                    value={formData.dailyReturn}
                    onChange={(e) => setFormData({...formData, dailyReturn: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-white">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status" className="text-white">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreatePlan} className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                  Create Plan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 border-slate-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-600">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search plans..."
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
                <option value="inactive">Inactive</option>
                <option value="limited">Limited</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="bg-slate-800 border-slate-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(plan)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">{plan.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Investment Range</span>
                  <span className="text-white text-sm">${plan.min_amount.toLocaleString()} - ${plan.max_amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Daily Return</span>
                  <span className="text-green-400 text-sm font-semibold">{plan.daily_return}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Duration</span>
                  <span className="text-white text-sm">{plan.duration} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Total Return</span>
                  <span className="text-blue-400 text-sm font-semibold">{plan.total_return}%</span>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Features</span>
                    <span className="text-yellow-400 text-sm">{plan.features.join(', ')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-600">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Investment Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-white">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Starter Plan"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-white">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Plan description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-minInvestment" className="text-white">Min Investment ($)</Label>
                <Input
                  id="edit-minInvestment"
                  type="number"
                  value={formData.minInvestment}
                  onChange={(e) => setFormData({...formData, minInvestment: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="edit-maxInvestment" className="text-white">Max Investment ($)</Label>
                <Input
                  id="edit-maxInvestment"
                  type="number"
                  value={formData.maxInvestment}
                  onChange={(e) => setFormData({...formData, maxInvestment: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dailyReturn" className="text-white">Daily Return (%)</Label>
                <Input
                  id="edit-dailyReturn"
                  type="number"
                  step="0.01"
                  value={formData.dailyReturn}
                  onChange={(e) => setFormData({...formData, dailyReturn: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="2.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-duration" className="text-white">Duration (days)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-status" className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditPlan} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
                Update Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 border-slate-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 