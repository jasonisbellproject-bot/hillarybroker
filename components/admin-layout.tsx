"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import ClientOnly from "@/components/client-only"

import {
  BarChart3,
  Users,
  DollarSign,
  Eye,
  Settings,
  TrendingUp,
  FileText,
  Shield,
  Bell,
  Menu,
  X,
  LogOut,
  Wallet,
  Copy,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: DollarSign },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: DollarSign },
  { name: "KYC Reviews", href: "/admin/kyc", icon: Eye },
  { name: "Investments", href: "/admin/investments", icon: TrendingUp },
  { name: "Investment Plans", href: "/admin/investment-plans", icon: TrendingUp },
  { name: "Copy Trading", href: "/admin/copy-trading", icon: Copy },
  { name: "Wallet Addresses", href: "/admin/wallet-addresses", icon: Wallet },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, signOut } = useAdminAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  // Check if user is admin
  useEffect(() => {
    console.log('🔍 AdminLayout - User state:', user)
    console.log('🔍 AdminLayout - Loading state:', loading)
    
    if (!loading) {
      if (!user) {
        console.log('🔍 AdminLayout - No user, redirecting to admin login')
        router.push('/admin-login')
        return
      }

      console.log('🔍 AdminLayout - Admin user confirmed')
      setIsAdmin(true)
    }
  }, [user, loading, router])

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 items-center justify-center">
        <div className="text-gray-900 text-lg">Loading admin panel...</div>
      </div>
    )
  }

  // Don't render admin content if not admin
  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted to-background" suppressHydrationWarning>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 backdrop-blur-md bg-card/90 border-r border-border/50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-xl font-bold text-foreground">Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex items-center gap-2 p-6 border-b border-border/50" suppressHydrationWarning>
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center" suppressHydrationWarning>
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Admin Panel</span>
        </div>

        <div className="p-4" suppressHydrationWarning>
          <nav className="space-y-2" suppressHydrationWarning>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4" suppressHydrationWarning>
          <button
            onClick={async () => {
              try {
                await fetch('/api/admin/logout', { method: 'POST' });
                router.push('/admin-login');
              } catch (error) {
                console.error('Admin logout error:', error);
                router.push('/admin-login');
              }
            }}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Admin Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0" suppressHydrationWarning>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 backdrop-blur-md bg-card/80" suppressHydrationWarning>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-foreground">
              {navigation.find((item) => item.href === pathname)?.name || "Admin Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4" suppressHydrationWarning>

            <button className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="flex items-center gap-4" suppressHydrationWarning>
              <div className="text-right hidden sm:block" suppressHydrationWarning>
                <div className="text-foreground font-medium">Admin User</div>
                <div className="text-muted-foreground text-sm">admin@northstarrock.net</div>
              </div>
              <Avatar className="w-12 h-12 border-2 border-border">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6" suppressHydrationWarning>
          <ClientOnly fallback={<div className="text-foreground">Loading...</div>}>
            {children}
          </ClientOnly>
        </div>
      </div>
    </div>
  )
}
