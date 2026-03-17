"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Bitcoin, 
  Ethereum,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  Users,
  Globe,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Clock,
  Lock,
  Rocket,
  Cpu,
  Heart,
  Leaf,
  Building,
  CreditCard,
  Blocks
} from "lucide-react";

const features = [
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    description: "Invest in the future of digital currency with our comprehensive crypto portfolio management and trading solutions.",
    color: "from-orange-500 to-green-500"
  },
  {
    icon: Users,
    title: "Copy Trading",
    description: "Follow and automatically copy the trades of successful investors to maximize your returns with proven strategies.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Leverage cutting-edge AI and machine learning algorithms for intelligent investment decisions and market analysis.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Invest in the rapidly growing healthcare sector with our curated selection of medical and biotech opportunities.",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: Leaf,
    title: "Renewable Energy",
    description: "Support sustainable future while generating returns through our green energy and environmental investment options.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Building,
    title: "Real Estate",
    description: "Diversify your portfolio with real estate investments including REITs, commercial properties, and residential markets.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: CreditCard,
    title: "Finance Technology",
    description: "Capitalize on the fintech revolution with investments in digital banking, payment systems, and financial innovation.",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: Blocks,
    title: "Blockchain Infrastructure",
    description: "Invest in the backbone of Web3 with blockchain infrastructure, DeFi protocols, and decentralized applications.",
    color: "from-violet-500 to-purple-500"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Rocket className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Clearway Capital
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link href="/services" className="text-white font-medium">Services</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 backdrop-blur-sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 backdrop-blur-sm text-black font-semibold">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-4 py-2 backdrop-blur-sm font-semibold">
              Investment Strategies
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Investment{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Investment Solutions
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Explore our comprehensive range of investment strategies designed to maximize 
              your portfolio growth across multiple sectors and asset classes.
            </p>
          </div>
        </div>
      </section>

      {/* Investment Strategies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment Strategies</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Diversify your portfolio across multiple sectors and asset classes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-semibold">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Advanced tools and features to enhance your trading experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="backdrop-blur-md bg-white/10 border-white/20 text-center hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                <p className="text-slate-300 text-sm">
                  Bank-level security with encryption and multi-factor authentication
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20 text-center hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-slate-300 text-sm">
                  Round-the-clock customer support via live chat and email
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20 text-center hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Access</h3>
                <p className="text-slate-300 text-sm">
                  Trade from anywhere with our mobile and web platforms
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20 text-center hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cold Storage</h3>
                <p className="text-slate-300 text-sm">
                  Your funds are stored in secure cold wallets for maximum safety
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Choose your preferred trading service and start your investment journey today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-8 py-4 backdrop-blur-sm text-black font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Trading Now
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 backdrop-blur-sm">
                  <Globe className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Rocket className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Clearway Capital
                </span>
              </div>
              <p className="text-slate-400">
                Leading the future of digital investment with secure, transparent, 
                and user-friendly trading solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Trading</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Education</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Clearway Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}