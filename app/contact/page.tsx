"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Star,
  Rocket
} from "lucide-react";

export default function ContactPage() {
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Fidelity Assured
                </span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-white font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to start your investment journey? Our expert team is here to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Send className="w-6 h-6 mr-3 text-green-400" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <Input 
                      placeholder="John" 
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <Input 
                      placeholder="Doe" 
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567" 
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Investment Interest
                  </label>
                  <select className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white focus:border-green-500 focus:outline-none">
                    <option value="" className="bg-gray-900">Select an option</option>
                    <option value="stocks" className="bg-gray-900">Stock Trading</option>
                    <option value="crypto" className="bg-gray-900">Cryptocurrency</option>
                    <option value="forex" className="bg-gray-900">Forex Trading</option>
                    <option value="portfolio" className="bg-gray-900">Portfolio Management</option>
                    <option value="other" className="bg-gray-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us about your investment goals and how we can help you..." 
                    rows={4}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-green-400" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2">Speak directly with our investment advisors</p>
                  <p className="text-white font-semibold text-lg">+12346004595</p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    Monday - Friday, 9:00 AM - 6:00 PM EST
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-green-400" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2">Get detailed responses to your questions</p>
                  <p className="text-white font-semibold">support@clearwaycapital.com</p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    Response within 24 hours
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-green-400" />
                    Office Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2">Visit us for in-person consultations</p>
                  <p className="text-white font-semibold">
                  300 Carnegie Center Dr, Princeton, NJ 08540, United States
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    By appointment only
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Quick answers to common questions about our services
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                  What is the minimum investment amount?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our minimum investment starts at $1,000 for most portfolios. However, we offer flexible options for different investment goals and risk tolerances.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                  How do I get started with investing?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Simply create an account, complete our risk assessment questionnaire, and fund your account. Our team will help you build a personalized investment strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                  What fees do you charge?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We charge a transparent management fee of 0.75% annually on assets under management. No hidden fees, no commission charges on trades.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                  Is my money safe and insured?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes, all client funds are held in FDIC-insured accounts and segregated from company assets. We also carry additional SIPC insurance for added protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Start Your Investment Journey?
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Join thousands of investors who trust Fidelity Assured with their financial future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    <Star className="w-5 h-5 mr-2" />
                    Start Investing
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}