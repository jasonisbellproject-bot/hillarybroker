import { supabase } from './supabase'
import { Database } from './supabase'

export type User = Database['public']['Tables']['users']['Row']

// Sign up with email and password
export const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) throw error

  // Create user profile in our users table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        first_name: firstName,
        last_name: lastName,
        kyc_verified: false,
        two_factor_enabled: false,
        is_admin: false, // Default to regular user
      })

    if (profileError) throw profileError
  }

  return data
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Handle email confirmation error
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and click the confirmation link before signing in.')
    }
    throw error
  }
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Create admin user (for first-time setup)
export const createAdminUser = async (email: string, password: string, firstName: string, lastName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) throw error

  // Create admin user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        first_name: firstName,
        last_name: lastName,
        kyc_verified: true, // Admin is pre-verified
        two_factor_enabled: false,
        is_admin: true, // Mark as admin
      })

    if (profileError) throw profileError
  }

  return data
}

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId)
    return profile.is_admin || false
  } catch (error) {
    return false
  }
}

// Get all users (admin only)
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Update user admin status (admin only)
export const updateUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_admin: isAdmin })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Reset password
export const resetPassword = async (email: string) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '') || '').replace(/\/$/, '')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) throw error
}

// Update password
export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw error
} 