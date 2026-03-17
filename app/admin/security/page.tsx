"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, AlertTriangle, CheckCircle, X, Eye, Ban, Unlock } from "lucide-react"

interface SecurityEvent {
  id: string
  type: string
  user: string
  ip: string
  location: string
  timestamp: string
  severity: string
  description: string
}

interface SecurityStats {
  totalEvents: number
  highSeverity: number
  mediumSeverity: number
  lowSeverity: number
  blockedIPs: number
  lockedAccounts: number
}

interface RecentLogin {
  id: string
  user: string
  ip: string
  location: string
  timestamp: string
  status: string
}

interface BlockedIP {
  ip: string
  reason: string
  blockedAt: string
  location: string
}

export default function AdminSecurityPage() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null)
  const [recentLogins, setRecentLogins] = useState<RecentLogin[]>([])
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/security')
        
        if (response.ok) {
          const data = await response.json()
          setSecurityEvents(data.securityEvents)
          setSecurityStats(data.securityStats)
          setRecentLogins(data.recentLogins)
          setBlockedIPs(data.blockedIPs)
        } else {
          console.error('Failed to fetch security data')
        }
      } catch (error) {
        console.error('Error fetching security data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityData()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "low":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "failed_login":
        return <X className="w-4 h-4 text-red-500" />
      case "suspicious_activity":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "account_locked":
        return <Ban className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  const handleUnblockIP = (ip: string) => {
    console.log("Unblocking IP:", ip)
    // In real app, this would call an API to unblock the IP
  }

  const handleUnlockAccount = (user: string) => {
    console.log("Unlocking account:", user)
    // In real app, this would call an API to unlock the account
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading security data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {securityStats?.totalEvents || 0}
              </div>
              <div className="text-slate-400">Total Events</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {securityStats?.highSeverity || 0}
              </div>
              <div className="text-slate-400">High Severity</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {securityStats?.blockedIPs || 0}
              </div>
              <div className="text-slate-400">Blocked IPs</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {securityStats?.lockedAccounts || 0}
              </div>
              <div className="text-slate-400">Locked Accounts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <div className="text-white font-medium">{event.user}</div>
                      <div className="text-slate-400 text-sm">{event.description}</div>
                      <div className="text-slate-500 text-xs">{event.ip} • {event.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                    <div className="text-slate-400 text-xs mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logins */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recent Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogins.map((login) => (
                <div key={login.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{login.user}</div>
                    <div className="text-slate-400 text-sm">{login.ip} • {login.location}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(login.status)}>{login.status}</Badge>
                    <div className="text-slate-400 text-xs mt-1">
                      {new Date(login.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked IPs */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Ban className="w-5 h-5" />
            Blocked IP Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blockedIPs.map((blockedIP, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">{blockedIP.ip}</div>
                  <div className="text-slate-400 text-sm">{blockedIP.reason}</div>
                  <div className="text-slate-500 text-xs">{blockedIP.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">
                      Blocked: {new Date(blockedIP.blockedAt).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnblockIP(blockedIP.ip)}
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    <Unlock className="w-4 h-4 mr-1" />
                    Unblock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Shield className="w-4 h-4 mr-2" />
              Enable 2FA for All Users
            </Button>
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Suspicious Activity
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Eye className="w-4 h-4 mr-2" />
              Generate Security Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 