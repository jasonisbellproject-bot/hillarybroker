"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        console.log('🔍 useAdminAuth - Starting admin session check...')
        
        // Get user info from the session
        const response = await fetch('/api/auth/me', { 
          credentials: 'include' 
        })
        
        console.log('🔍 useAdminAuth - Response status:', response.status)
        
        if (response.ok) {
          const userData = await response.json()
          console.log('🔍 useAdminAuth - User data:', userData)
          
          // Check if user is admin
          if (userData.is_admin) {
            console.log('🔍 useAdminAuth - Admin user confirmed')
            setUser(userData)
          } else {
            console.log('🔍 useAdminAuth - User is not admin (is_admin:', userData.is_admin, ')')
            setUser(null)
          }
        } else {
          console.log('🔍 useAdminAuth - Failed to get user data, status:', response.status)
          setUser(null)
        }
      } catch (error) {
        console.error('🔍 useAdminAuth - Error checking admin session:', error)
        setUser(null)
      } finally {
        console.log('🔍 useAdminAuth - Setting loading to false')
        setLoading(false)
      }
    }

    checkAdminSession()
  }, [])

  const signOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin-login')
    } catch (error) {
      console.error('Admin logout error:', error)
      router.push('/admin-login')
    }
  }

  return {
    user,
    loading,
    signOut,
  }
} 