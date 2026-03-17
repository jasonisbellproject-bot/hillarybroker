import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create browser client with proper cookie handling
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Debug function to check client configuration
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase client created with URL:', supabaseUrl ? 'Set' : 'Not set')
  console.log('🔍 Supabase client created with Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          kyc_verified: boolean
          two_factor_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          kyc_verified?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          kyc_verified?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      deposits: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status: 'pending' | 'completed' | 'failed'
          transaction_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status?: 'pending' | 'completed' | 'failed'
          transaction_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          status?: 'pending' | 'completed' | 'failed'
          transaction_hash?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          wallet_address: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency: string
          wallet_address: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          wallet_address?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          plan_id: number
          amount: number
          daily_return: number
          total_return: number
          start_date: string
          end_date: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: number
          amount: number
          daily_return: number
          total_return: number
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: number
          amount?: number
          daily_return?: number
          total_return?: number
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      investment_plans: {
        Row: {
          id: number
          name: string
          min_amount: number
          max_amount: number
          daily_return: number
          duration: number
          total_return: number
          status: 'active' | 'inactive' | 'limited'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          min_amount: number
          max_amount: number
          daily_return: number
          duration: number
          total_return: number
          status?: 'active' | 'inactive' | 'limited'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          min_amount?: number
          max_amount?: number
          daily_return?: number
          duration?: number
          total_return?: number
          status?: 'active' | 'inactive' | 'limited'
          created_at?: string
          updated_at?: string
        }
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string
          document_type: 'passport' | 'drivers_license' | 'national_id'
          document_url: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type: 'passport' | 'drivers_license' | 'national_id'
          document_url: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: 'passport' | 'drivers_license' | 'national_id'
          document_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 