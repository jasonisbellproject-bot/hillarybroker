"use client"

import { useEffect, useState } from "react"

export default function TestCookiesPage() {
  const [cookies, setCookies] = useState<string>('')
  
  useEffect(() => {
    console.log('🔍 Checking browser cookies...')
    const allCookies = document.cookie
    console.log('🔍 All cookies:', allCookies)
    setCookies(allCookies)
  }, [])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookies Test Page</h1>
      <div className="space-y-4">
        <div>
          <strong>All Cookies:</strong>
          <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>
        <div>
          <strong>Has sb-access-token:</strong> {cookies.includes('sb-access-token') ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Has sb-lcsjasppmrofkuimtpqv-auth-token:</strong> {cookies.includes('sb-lcsjasppmrofkuimtpqv-auth-token') ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
} 