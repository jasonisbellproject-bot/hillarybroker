import { supabase } from './supabase'
import type { Database } from './supabase'

type InvestmentPlan = Database['public']['Tables']['investment_plans']['Row']
type Investment = Database['public']['Tables']['investments']['Row']
type Deposit = Database['public']['Tables']['deposits']['Row']

// Get all investment plans
export const getInvestmentPlans = async (): Promise<InvestmentPlan[]> => {
  const { data, error } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('status', 'active')
    .order('min_amount', { ascending: true })

  if (error) throw error
  return data || []
}

// Get user's active investments
export const getUserInvestments = async (userId: string): Promise<Investment[]> => {
  const { data, error } = await supabase
    .from('investments')
    .select(`
      *,
      investment_plans (
        name,
        daily_return,
        duration
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Create new investment
export const createInvestment = async (
  userId: string,
  planId: number,
  amount: number
): Promise<Investment> => {
  // Get the investment plan
  const { data: plan, error: planError } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError) throw planError
  if (!plan) throw new Error('Investment plan not found')

  // Validate amount
  if (amount < plan.min_amount || amount > plan.max_amount) {
    throw new Error(`Amount must be between $${plan.min_amount} and $${plan.max_amount}`)
  }

  // Calculate returns
  const dailyReturn = (amount * plan.daily_return) / 100
  const totalReturn = (amount * plan.total_return) / 100
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + plan.duration)

  const { data, error } = await supabase
    .from('investments')
    .insert({
      user_id: userId,
      plan_id: planId,
      amount,
      daily_return: dailyReturn,
      total_return: totalReturn,
      end_date: endDate.toISOString(),
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user's deposits
export const getUserDeposits = async (userId: string): Promise<Deposit[]> => {
  const { data, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Create new deposit
export const createDeposit = async (
  userId: string,
  amount: number,
  paymentMethod: string,
  transactionHash?: string
): Promise<Deposit> => {
  const { data, error } = await supabase
    .from('deposits')
    .insert({
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      transaction_hash: transactionHash,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get user's total balance
export const getUserBalance = async (userId: string): Promise<number> => {
  // Get total deposits
  const { data: deposits, error: depositsError } = await supabase
    .from('deposits')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (depositsError) throw depositsError

  // Get total withdrawals
  const { data: withdrawals, error: withdrawalsError } = await supabase
    .from('withdrawals')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (withdrawalsError) throw withdrawalsError

  const totalDeposits = deposits?.reduce((sum, deposit) => sum + Number(deposit.amount), 0) || 0
  const totalWithdrawals = withdrawals?.reduce((sum, withdrawal) => sum + Number(withdrawal.amount), 0) || 0

  return totalDeposits - totalWithdrawals
}

// Get user's total earnings from investments
export const getUserEarnings = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('investments')
    .select('total_return')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw error

  return data?.reduce((sum, investment) => sum + Number(investment.total_return), 0) || 0
}

// Get user's daily returns
export const getUserDailyReturns = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('investments')
    .select('daily_return')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (error) throw error

  return data?.reduce((sum, investment) => sum + Number(investment.daily_return), 0) || 0
} 