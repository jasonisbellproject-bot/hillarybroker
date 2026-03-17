"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user info from the API
        const response = await fetch('/api/auth/me', { 
          credentials: 'include' 
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null)
      
      // Call the API route for server-side logout
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sign out')
      }
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Even if there's an error, redirect to home page
      router.push('/')
    }
  }

  return {
    user,
    loading,
    signOut,
  }
} 