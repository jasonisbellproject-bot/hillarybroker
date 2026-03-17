import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Shield,
  Eye,
  Lock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function PrivacyPage() {
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
              <span className="text-xl font-bold">Clearway Capital</span>
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
              Privacy & Security
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Privacy{" "}
              <span className="text-green-400">Policy</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal data. 
              This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Introduction */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold">1. Introduction</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    At Clearway Capital, we take your privacy seriously. This Privacy Policy explains how we 
                    collect, use, disclose, and safeguard your information when you use our trading platform 
                    and services.
                  </p>
                  <p>
                    By using our services, you consent to the data practices described in this policy. 
                    If you do not agree with our policies and practices, please do not use our services.
                  </p>
                  <p>
                    <strong>Last Updated:</strong> January 15, 2024
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Eye className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We collect several types of information from and about users of our platform:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Name, email address, and phone number</li>
                        <li>Date of birth and nationality</li>
                        <li>Government-issued identification documents</li>
                        <li>Proof of address and financial information</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Trading Information</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Trading history and transaction records</li>
                        <li>Account balances and positions</li>
                        <li>Risk preferences and trading strategies</li>
                        <li>Communication with our support team</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Technical Information</h3>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>IP address and device information</li>
                        <li>Browser type and operating system</li>
                        <li>Usage patterns and platform interactions</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">3. How We Use Your Information</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We use the information we collect for various purposes, including:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Providing and maintaining our trading services</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Processing transactions and managing your account</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Complying with legal and regulatory requirements</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Preventing fraud and ensuring platform security</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Improving our services and user experience</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Communicating with you about your account and services</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">4. Information Sharing and Disclosure</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    except in the following circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Legal Requirements</h3>
                      <p>
                        We may disclose your information when required by law, regulation, or legal process, 
                        or to protect our rights and safety.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Service Providers</h3>
                      <p>
                        We may share information with trusted third-party service providers who assist us 
                        in operating our platform, such as payment processors and security providers.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Business Transfers</h3>
                      <p>
                        In the event of a merger, acquisition, or sale of assets, your information may 
                        be transferred as part of the business transaction.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">With Your Consent</h3>
                      <p>
                        We may share your information with third parties when you have given us explicit 
                        consent to do so.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold">5. Data Security</h2>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We implement appropriate technical and organizational security measures to protect 
                    your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>SSL encryption for all data transmission</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Multi-factor authentication for account access</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Regular security audits and penetration testing</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Secure data centers with 24/7 monitoring</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                      <span>Employee training on data protection practices</span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Security Notice</h4>
                        <p className="text-sm text-yellow-200">
                          While we strive to protect your information, no method of transmission over the 
                          internet is 100% secure. We cannot guarantee absolute security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">6. Your Rights and Choices</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    You have certain rights regarding your personal information:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Access and Portability</h3>
                      <p>
                        You can request access to your personal information and receive a copy of your data 
                        in a portable format.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Correction and Update</h3>
                      <p>
                        You can request correction of inaccurate or incomplete personal information.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Deletion</h3>
                      <p>
                        You can request deletion of your personal information, subject to legal and 
                        regulatory requirements.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Opt-out</h3>
                      <p>
                        You can opt out of certain communications and marketing materials.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Data Portability</h3>
                      <p>
                        You can request transfer of your data to another service provider.
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-6">
                    To exercise these rights, please contact us at privacy@clearwaycapital.com
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">7. Cookies and Tracking Technologies</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on our platform:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                      <p>
                        Required for basic platform functionality, security, and authentication.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Analytics Cookies</h3>
                      <p>
                        Help us understand how users interact with our platform to improve our services.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Marketing Cookies</h3>
                      <p>
                        Used to deliver relevant advertisements and measure campaign effectiveness.
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-6">
                    You can control cookie settings through your browser preferences, though disabling 
                    certain cookies may affect platform functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">8. International Data Transfers</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data during such transfers.
                  </p>
                  <p>
                    For users in the European Union, we rely on adequacy decisions, standard contractual 
                    clauses, and other approved transfer mechanisms to ensure adequate protection of your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">9. Children's Privacy</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Our services are not intended for children under 18 years of age. We do not knowingly 
                    collect personal information from children under 18.
                  </p>
                  <p>
                    If we become aware that we have collected personal information from a child under 18, 
                    we will take steps to delete such information promptly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">10. Changes to This Policy</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices 
                    or for other operational, legal, or regulatory reasons.
                  </p>
                  <p>
                    We will notify you of any material changes by posting the updated policy on our platform 
                    and updating the "Last Updated" date. Your continued use of our services after such 
                    changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">11. Contact Us</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@clearwaycapital.com</p>
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
                <span className="text-xl font-bold">Clearway Capital</span>
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
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Risk Disclosure</Link></li>
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