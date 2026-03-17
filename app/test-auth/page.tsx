"use client"

import { useAuth } from "@/hooks/useAuth"

export default function TestAuthPage() {
  const { user, loading } = useAuth()
  
  console.log('🔍 TestAuthPage - useAuth result:', { user: user?.id, loading })
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'true' : 'false'}
        </div>
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'undefined'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'undefined'}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || 'undefined'}
        </div>
      </div>
    </div>
  )
} 