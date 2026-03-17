"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"

import {
  BarChart3,
  TrendingDown,
  Calendar,
  Layers,
  CircleDollarSign,
  Wallet,
  Download,
  ArrowUpDown,
  UserCheck,
  Trophy,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Shield,
  Rocket,
  FileText,
  User,
  Gift,
  Copy,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Investment", href: "/dashboard/investment", icon: TrendingDown },
  { name: "Staking", href: "/dashboard/staking", icon: Layers },
  { name: "Copy Trading", href: "/dashboard/copy-trading", icon: Copy },
  { name: "Deposit", href: "/dashboard/deposit", icon: Wallet, hasArrow: true },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: Download, hasArrow: true },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowUpDown },
  { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
  { name: "KYC Verification", href: "/dashboard/kyc", icon: FileText },
  { name: "Referrals", href: "/dashboard/referrals", icon: UserCheck },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted to-background overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 backdrop-blur-md bg-card/80 border-r border-border/50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">Menu</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <nav className="space-y-1 sm:space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/80 backdrop-blur-sm"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.hasArrow && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-border/50 backdrop-blur-md bg-card/80">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground lg:hidden transition-colors">
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-2xl font-semibold text-foreground">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Dashboard Link - Only show for admin users */}
            {user?.is_admin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg text-xs sm:text-sm"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">Admin Panel</span>
              </Link>
            )}
            {/* Profile Button */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-1 px-2 py-1 bg-accent hover:bg-accent/80 rounded-lg transition-colors text-xs sm:text-sm"
              title="Profile"
            >
              <Avatar className="w-7 h-7 border border-border">
                <AvatarImage src={user?.avatar_url || "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-xs">
                  {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-foreground font-medium">Profile</span>
            </Link>
            
            <div className="text-right hidden sm:block">
              <div className="text-foreground font-medium text-sm">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.email?.split('@')[0] || 'User'
                }
              </div>
              <div className="text-muted-foreground text-xs">{user?.email}</div>
            </div>
            <Avatar className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-border">
              <AvatarImage src={user?.avatar_url || "/placeholder.svg?height=48&width=48"} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-xs sm:text-sm">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name[0]}${user.last_name[0]}`
                  : user?.email?.[0]?.toUpperCase() || 'U'
                }
              </AvatarFallback>
            </Avatar>

            <button
              onClick={signOut}
              className="p-1 sm:p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-accent rounded-lg"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-3 sm:p-6 w-full">{children}</div>
      </div>
    </div>
  )
}
