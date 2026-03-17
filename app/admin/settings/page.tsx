"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Save, 
  Globe, 
  DollarSign, 
  Shield, 
  Bell, 
  Database, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Users,
  Activity,
  Zap
} from "lucide-react"

interface PlatformSettings {
  // Platform Settings
  platform_name: string
  platform_url: string
  maintenance_mode: boolean
  registration_enabled: boolean

  // Financial Settings
  min_deposit: number
  max_deposit: number
  min_withdrawal: number
  max_withdrawal: number
  withdrawal_fee: number
  withdrawal_fee_percentage: number
  daily_withdrawal_limit: number

  // Security Settings
  two_factor_required: boolean
  kyc_required: boolean
  session_timeout: number
  max_login_attempts: number

  // Notification Settings
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean

  // Investment Settings
  default_investment_plan: string
  max_active_investments: number
  auto_reinvest: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    // Platform Settings
    platform_name: "NorthStarRock",
    platform_url: "https://northstarrock.net",
    maintenance_mode: false,
    registration_enabled: true,

    // Financial Settings
    min_deposit: 50,
    max_deposit: 50000,
    min_withdrawal: 100,
    max_withdrawal: 25000,
    withdrawal_fee: 5,
    withdrawal_fee_percentage: 30.00,
    daily_withdrawal_limit: 10000,

    // Security Settings
    two_factor_required: true,
    kyc_required: true,
    session_timeout: 30,
    max_login_attempts: 5,

    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,

    // Investment Settings
    default_investment_plan: "starter",
    max_active_investments: 10,
    auto_reinvest: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings | null>(null)
  const [activeTab, setActiveTab] = useState("platform")
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      
      if (response.ok) {
        const data = await response.json()
        // Handle both direct settings object and wrapped in settings property
        const settingsData = data.settings || data
        if (settingsData && typeof settingsData === 'object') {
          setSettings(settingsData)
          setOriginalSettings(settingsData)
        } else {
          console.error('Invalid settings data received:', data)
          toast({
            title: "Error",
            description: "Invalid settings data received",
            variant: "destructive"
          })
        }
      } else {
        console.error('Failed to fetch settings:', response.status)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        const data = await response.json()
        setOriginalSettings(settings)
        setHasChanges(false)
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: keyof PlatformSettings, value: any) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [key]: value,
      }
      
      // Check if there are changes
      if (originalSettings) {
        const hasChangesNow = JSON.stringify(newSettings) !== JSON.stringify(originalSettings)
        setHasChanges(hasChangesNow)
      }
      
      return newSettings
    })
  }

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings)
      setHasChanges(false)
      toast({
        title: "Reset",
        description: "Settings reset to last saved state",
      })
    }
  }

  const validateSettings = () => {
    const errors: string[] = []
    
    // Safety check to prevent undefined errors
    if (!settings) {
      errors.push("Settings not loaded")
      return errors
    }
    
    if (settings.min_deposit >= settings.max_deposit) {
      errors.push("Minimum deposit must be less than maximum deposit")
    }
    
    if (settings.min_withdrawal >= settings.max_withdrawal) {
      errors.push("Minimum withdrawal must be less than maximum withdrawal")
    }
    
    if (settings.withdrawal_fee < 0) {
      errors.push("Withdrawal fee cannot be negative")
    }
    
    if (settings.session_timeout < 5) {
      errors.push("Session timeout must be at least 5 minutes")
    }
    
    if (settings.max_login_attempts < 1) {
      errors.push("Max login attempts must be at least 1")
    }
    
    return errors
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading settings...</div>
        </div>
      </div>
    )
  }

  const validationErrors = validateSettings()

  return (
    <div className="space-y-6">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
          <p className="text-slate-400">Configure platform-wide settings and preferences</p>
        </div>
        
        <div className="flex items-center gap-4">
          {hasChanges && (
            <Alert className="bg-yellow-500/20 border-yellow-500/50">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset
              </Button>
            )}
            
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges || validationErrors.length > 0}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="bg-red-500/20 border-red-500/50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-600">
          <TabsTrigger value="platform" className="data-[state=active]:bg-red-500">
            <Globe className="w-4 h-4 mr-2" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-red-500">
            <DollarSign className="w-4 h-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-500">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-red-500">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="investment" className="data-[state=active]:bg-red-500">
            <Database className="w-4 h-4 mr-2" />
            Investment
          </TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform_name" className="text-slate-300">
                    Platform Name
                  </Label>
                  <Input
                    id="platform_name"
                    value={settings.platform_name}
                    onChange={(e) => handleInputChange("platform_name", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="platform_url" className="text-slate-300">
                    Platform URL
                  </Label>
                  <Input
                    id="platform_url"
                    value={settings.platform_url}
                    onChange={(e) => handleInputChange("platform_url", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Maintenance Mode</Label>
                  <p className="text-slate-400 text-sm">Temporarily disable platform access</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => handleInputChange("maintenance_mode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">User Registration</Label>
                  <p className="text-slate-400 text-sm">Allow new user registrations</p>
                </div>
                <Switch
                  checked={settings.registration_enabled}
                  onCheckedChange={(checked) => handleInputChange("registration_enabled", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Settings */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_deposit" className="text-slate-300">
                    Minimum Deposit ($)
                  </Label>
                  <Input
                    id="min_deposit"
                    type="number"
                    value={settings.min_deposit}
                    onChange={(e) => handleInputChange("min_deposit", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max_deposit" className="text-slate-300">
                    Maximum Deposit ($)
                  </Label>
                  <Input
                    id="max_deposit"
                    type="number"
                    value={settings.max_deposit}
                    onChange={(e) => handleInputChange("max_deposit", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="min_withdrawal" className="text-slate-300">
                    Minimum Withdrawal ($)
                  </Label>
                  <Input
                    id="min_withdrawal"
                    type="number"
                    value={settings.min_withdrawal}
                    onChange={(e) => handleInputChange("min_withdrawal", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max_withdrawal" className="text-slate-300">
                    Maximum Withdrawal ($)
                  </Label>
                  <Input
                    id="max_withdrawal"
                    type="number"
                    value={settings.max_withdrawal}
                    onChange={(e) => handleInputChange("max_withdrawal", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="withdrawal_fee" className="text-slate-300">
                    Withdrawal Fee ($)
                  </Label>
                  <Input
                    id="withdrawal_fee"
                    type="number"
                    value={settings.withdrawal_fee}
                    onChange={(e) => handleInputChange("withdrawal_fee", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="withdrawal_fee_percentage" className="text-slate-300">
                    Withdrawal Fee Percentage (%)
                  </Label>
                  <Input
                    id="withdrawal_fee_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={settings.withdrawal_fee_percentage}
                    onChange={(e) => handleInputChange("withdrawal_fee_percentage", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                  <p className="text-slate-400 text-xs mt-1">Percentage of user balance (e.g., 30.00 for 30%)</p>
                </div>
                <div>
                  <Label htmlFor="daily_withdrawal_limit" className="text-slate-300">
                    Daily Withdrawal Limit ($)
                  </Label>
                  <Input
                    id="daily_withdrawal_limit"
                    type="number"
                    value={settings.daily_withdrawal_limit}
                    onChange={(e) => handleInputChange("daily_withdrawal_limit", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Require 2FA</Label>
                  <p className="text-slate-400 text-sm">Force all users to enable two-factor authentication</p>
                </div>
                <Switch
                  checked={settings.two_factor_required}
                  onCheckedChange={(checked) => handleInputChange("two_factor_required", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Require KYC</Label>
                  <p className="text-slate-400 text-sm">Require KYC verification for withdrawals</p>
                </div>
                <Switch
                  checked={settings.kyc_required}
                  onCheckedChange={(checked) => handleInputChange("kyc_required", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session_timeout" className="text-slate-300">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => handleInputChange("session_timeout", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="max_login_attempts" className="text-slate-300">
                    Max Login Attempts
                  </Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => handleInputChange("max_login_attempts", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Email Notifications</Label>
                  <p className="text-slate-400 text-sm">Send email notifications to users</p>
                </div>
                <Switch
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => handleInputChange("email_notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">SMS Notifications</Label>
                  <p className="text-slate-400 text-sm">Send SMS notifications to users</p>
                </div>
                <Switch
                  checked={settings.sms_notifications}
                  onCheckedChange={(checked) => handleInputChange("sms_notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Push Notifications</Label>
                  <p className="text-slate-400 text-sm">Send push notifications to users</p>
                </div>
                <Switch
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => handleInputChange("push_notifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Settings */}
        <TabsContent value="investment" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Investment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_investment_plan" className="text-slate-300">
                    Default Investment Plan
                  </Label>
                  <select
                    id="default_investment_plan"
                    value={settings.default_investment_plan}
                    onChange={(e) => handleInputChange("default_investment_plan", e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 mt-2 w-full"
                  >
                    <option value="starter">Starter Plan</option>
                    <option value="professional">Professional Plan</option>
                    <option value="premium">Premium Plan</option>
                    <option value="vip">VIP Plan</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="max_active_investments" className="text-slate-300">
                    Max Active Investments
                  </Label>
                  <Input
                    id="max_active_investments"
                    type="number"
                    value={settings.max_active_investments}
                    onChange={(e) => handleInputChange("max_active_investments", Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Auto Reinvest</Label>
                  <p className="text-slate-400 text-sm">Automatically reinvest completed investments</p>
                </div>
                <Switch
                  checked={settings.auto_reinvest}
                  onCheckedChange={(checked) => handleInputChange("auto_reinvest", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
