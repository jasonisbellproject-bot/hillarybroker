import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  Users,
  FileText,
  Wallet,
  TrendingDown,
  ChevronRight,
  BarChart3,
  Calendar,
  Layers,
  CircleDollarSign,
  Download,
  ArrowUpDown,
  UserCheck,
  Trophy,
} from "lucide-react"

export default function Component() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700">
        <div className="p-4">
          {/* Navigation Menu */}
          <nav className="space-y-2">
            {/* Dashboard - Active */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-white">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>

            {/* Investment */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <TrendingDown className="w-5 h-5" />
              <span className="font-medium">Investment</span>
            </div>

            {/* Schedule Investment */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Schedule Investment</span>
            </div>

            {/* Staking */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <Layers className="w-5 h-5" />
              <span className="font-medium">Staking</span>
            </div>

            {/* Pool */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <CircleDollarSign className="w-5 h-5" />
              <span className="font-medium">Pool</span>
            </div>

            {/* Deposit */}
            <div className="flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Deposit</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Withdraw */}
            <div className="flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <span className="font-medium">Withdraw</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>

            {/* Transactions */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <ArrowUpDown className="w-5 h-5" />
              <span className="font-medium">Transactions</span>
            </div>

            {/* Referrals */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Referrals</span>
            </div>

            {/* Ranking */}
            <div className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Ranking</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">Daniel David</div>
              <div className="text-slate-400 text-sm">danielomosuyio@gmail.com</div>
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-slate-700 text-white">DD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Cards */}
          <div className="space-y-4">
            {/* Empty Balance Alert */}
            <Card className="bg-slate-800 border-red-500/50 border-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Empty Balance</h3>
                    <p className="text-slate-400 text-sm italic">
                      Your balance is empty. Please make deposit for your next investment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2FA Authentication */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">2FA Authentication</h3>
                    <p className="text-slate-400 text-sm italic">
                      To keep safe your account, Please enable 2FA security. It will make secure your account and
                      balance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Verification */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">KYC Verification Required</h3>
                    <p className="text-slate-400 text-sm italic mb-2">
                      Please submit the required KYC information to verify yourself. Otherwise, you couldn't make any
                      withdrawal requests to the system.
                    </p>
                    <p className="text-slate-400 text-sm italic underline cursor-pointer hover:text-slate-300">
                      Click here to submit KYC information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Deposit Balance */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm mb-1">Total Deposit Balance</h3>
                    <p className="text-white text-2xl font-bold">0.00 USD</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Withdraw */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm mb-1">Total Withdraw</h3>
                    <p className="text-white text-2xl font-bold">0.00 USD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
