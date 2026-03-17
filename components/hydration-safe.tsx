"use client"

import { useEffect, useState } from "react"

interface HydrationSafeProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ReactNode
}

export default function HydrationSafe({ 
  children, 
  className = "", 
  fallback = <div className="animate-pulse bg-slate-700 h-8 rounded"></div> 
}: HydrationSafeProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={className}>{fallback}</div>
  }

  return <div className={className} suppressHydrationWarning>{children}</div>
} 