"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface InvestmentPlan {
  id: number
  name: string
  minAmount: number
  maxAmount: number
  dailyReturn: number
  duration: number
  totalReturn: number
  status: string
  description: string
}

interface InvestmentModalProps {
  plan: InvestmentPlan
  onInvestmentCreated: () => void
}

export function InvestmentModal({ plan, onInvestmentCreated }: InvestmentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")

  const handleInvestment = async () => {
    if (!amount) {
      setError("Please enter an investment amount")
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < plan.minAmount || amountNum > plan.maxAmount) {
      setError(`Amount must be between $${plan.minAmount.toLocaleString()} and $${plan.maxAmount.toLocaleString()}`)
      return
    }

    setProcessing(true)
    setError("")

    try {
      const response = await fetch('/api/dashboard/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: amountNum
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Investment created:', data)
        setIsOpen(false)
        setAmount("")
        onInvestmentCreated()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create investment')
      }
    } catch (error) {
      console.error('Error creating investment:', error)
      setError('Failed to create investment')
    } finally {
      setProcessing(false)
    }
  }

  const calculateDailyReturn = (amount: number) => {
    return (amount * plan.dailyReturn) / 100
  }

  const calculateTotalReturn = (amount: number) => {
    return (amount * plan.totalReturn) / 100
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Invest Now
        </Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-md bg-white/10 border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Create Investment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Plan Details */}
          <Card className="backdrop-blur-md bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{plan.name}</h3>
                <Badge className={plan.status === "active" ? "bg-green-500" : "bg-yellow-500"}>
                  {plan.status === "active" ? "Active" : "Limited"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Daily Return</p>
                  <p className="text-yellow-400 font-semibold">{plan.dailyReturn}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Duration</p>
                  <p className="text-white font-semibold">{plan.duration} Days</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Return</p>
                  <p className="text-green-400 font-semibold">{plan.totalReturn}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Min Investment</p>
                  <p className="text-white font-semibold">${plan.minAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Investment Amount ($)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError("")
              }}
              placeholder={`Min: $${plan.minAmount.toLocaleString()}, Max: $${plan.maxAmount.toLocaleString()}`}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-yellow-400"
            />
          </div>

          {/* Calculations Preview */}
          {amount && !isNaN(parseFloat(amount)) && (
            <Card className="backdrop-blur-md bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Investment Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Return:</span>
                    <span className="text-yellow-400">${calculateDailyReturn(parseFloat(amount)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Return:</span>
                    <span className="text-green-400">${calculateTotalReturn(parseFloat(amount)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white">{plan.duration} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
              onClick={handleInvestment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Investment
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 