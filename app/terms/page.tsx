import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Fidelity Assured</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
              <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
              <Link href="/services" className="text-slate-300 hover:text-white">Services</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-white hover:bg-slate-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-green-600 text-white px-4 py-2">
              Legal Information
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Terms of{" "}
              <span className="text-green-400">Service</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Please read these terms carefully before using our trading platform. 
              By using our services, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Introduction */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold">1. Introduction</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    These Terms of Service ("Terms") govern your use of the Fidelity Assured trading platform 
                    and services. By accessing or using our platform, you agree to be bound by these Terms 
                    and all applicable laws and regulations.
                  </p>
                  <p>
                    If you do not agree with any of these terms, you are prohibited from using or accessing 
                    our services. The materials contained in this platform are protected by applicable 
                    copyright and trademark law.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Registration */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold">2. Account Registration</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    To use our trading services, you must register for an account. You agree to provide 
                    accurate, current, and complete information during registration and to update such 
                    information to keep it accurate, current, and complete.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>You must be at least 18 years old to create an account</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>You are responsible for maintaining the security of your account</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>You must provide valid identification documents for verification</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Services */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">3. Trading Services</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Our platform provides access to various financial instruments including cryptocurrencies, 
                    forex, stocks, and binary options. Trading involves substantial risk of loss and is 
                    not suitable for all investors.
                  </p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Risk Warning</h4>
                        <p className="text-sm text-yellow-200">
                          Past performance does not guarantee future results. You can lose some or all of 
                          your invested capital. Never invest more than you can afford to lose.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fees and Charges */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">4. Fees and Charges</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We charge various fees for our services, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Trading fees and spreads</li>
                    <li>Withdrawal and deposit fees</li>
                    <li>Inactivity fees</li>
                    <li>Premium service fees</li>
                  </ul>
                  <p>
                    All fees are clearly displayed on our platform and may be updated from time to time. 
                    You agree to pay all applicable fees for services you use.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">5. Prohibited Activities</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    You agree not to engage in any of the following activities:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Using our services for illegal purposes</li>
                    <li>Attempting to manipulate markets or prices</li>
                    <li>Creating multiple accounts to circumvent limits</li>
                    <li>Sharing account credentials with others</li>
                    <li>Using automated trading bots without permission</li>
                    <li>Engaging in money laundering or terrorist financing</li>
                  </ul>
                  <p>
                    Violation of these terms may result in account suspension or termination.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">6. Privacy and Data Protection</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We are committed to protecting your privacy and personal data. Our collection, use, 
                    and protection of your information is governed by our Privacy Policy.
                  </p>
                  <p>
                    By using our services, you consent to the collection and use of your information 
                    as described in our Privacy Policy, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personal identification information</li>
                    <li>Financial information and trading history</li>
                    <li>Device and usage information</li>
                    <li>Communication records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">7. Limitation of Liability</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    To the maximum extent permitted by law, Fidelity Assured shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, including but 
                    not limited to loss of profits, data, or use.
                  </p>
                  <p>
                    Our total liability to you for any claims arising from the use of our services 
                    shall not exceed the amount you paid to us in the 12 months preceding the claim.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">8. Termination</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    You may terminate your account at any time by contacting our support team. 
                    We may terminate or suspend your account immediately, without prior notice, 
                    for conduct that we believe violates these Terms or is harmful to other users 
                    or our platform.
                  </p>
                  <p>
                    Upon termination, your right to use our services will cease immediately. 
                    All provisions of these Terms which by their nature should survive termination 
                    shall survive termination.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">9. Changes to Terms</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users 
                    of any material changes by posting the new Terms on our platform and updating 
                    the "Last Updated" date.
                  </p>
                  <p>
                    Your continued use of our services after any changes constitutes acceptance 
                    of the new Terms. If you do not agree to the new Terms, you must stop using 
                    our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">10. Contact Information</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@clearwaycapital.com</p>
                    <p><strong>Address:</strong> 300 Carnegie Center Dr, Princeton, NJ 08540, United States</p>
                    <p><strong>Phone:</strong> +12346004595</p>
                  </div>
                  <p className="text-sm text-slate-400 mt-6">
                    <strong>Last Updated:</strong> January 15, 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of successful traders and start your investment journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Fidelity Assured</span>
              </div>
              <p className="text-slate-400">
                Leading the future of digital investment with secure, transparent, 
                and user-friendly trading solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white">Trading</Link></li>
                <li><Link href="#" className="hover:text-white">Analytics</Link></li>
                <li><Link href="#" className="hover:text-white">Portfolio</Link></li>
                <li><Link href="#" className="hover:text-white">Education</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Risk Disclosure</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Fidelity Assured. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 