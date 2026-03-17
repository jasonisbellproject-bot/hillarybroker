"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Award,
  Globe,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Rocket,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react"

// Values data from landing page
const values = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Innovation-driven",
    description: "Welcome to the forefront of innovation-driven investment. We are dedicated to pioneering new pathways in the investment landscape.",
    color: "text-blue-400"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Transparent approach",
    description: "We believe in fostering trust through clear communication and open access to information.",
    color: "text-green-400"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Long-Term Investment Time Horizon",
    description: "Unlock your financial potential with a long-term investment strategy. We believe in maximizing returns over time, ensuring your financial goals are met and exceeded.",
    color: "text-purple-400"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Teamwork",
    description: "Collaborative teamwork is at the heart of everything we do. Our diverse team of experts works seamlessly together, pooling their knowledge and experience to unlock the full potential of every investment opportunity.",
    color: "text-orange-400"
  }
];

// Team members data from landing page
const teamMembers = [
  {
    name: "Craig-Cornelius",
    role: "Chairman, President and Chief Executive Officer",
    company: "Clearway Capital, Inc.",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784567/Craig-Cornelius_clearway-energy_uneip8.jpg"
  },
  {
    name: "Steve-Ryder",
    role: "President and Chief Executive Officer",
    company: "Clearway Capital Resources, LLC",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784567/Steve-Ryder_clearway-energy_tqfx5z.jpg"
  },
  {
    name: "Jennifer-Hein",
    role: "Executive Vice President Chief Risk Officer",
    company: "Clearway Capital, Inc.",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784566/Jennifer-Hein_clearway-energy_j3dxzw.jpg"
  }
];

// FAQ data from landing page
const faqs = [
  {
    question: "What happens to my data once the account is closed?",
    answer: "Please be assured that we maintain this information with the same level of security as an active account and are not permitted to use it for any purpose other than meeting our legal record-keeping obligations. After the 5-year retention period, your data will be automatically deleted from our systems."
  },
  {
    question: "Who are you? And how are you backed?",
    answer: "We're a global crypto finance company on a mission to make it possible for anyone, anywhere to help change the global economy. Our company was founded because we believed money should work like the internet — open, secure, free, everywhere. Today, we offer four products. We make it easy to invest in crypto even if you've never invested in crypto. With Us, you can print your own money like a paper — across the table or the ocean. Our OTC crypto desk moves over $0.99B each month. And our addition team players in poloniex welcomes one of the world's largest exchanges."
  },
  {
    question: "What are the Payment Methods for investments/withdrawal?",
    answer: "We offer a variety of payment methods using cryptocurrencies (Bitcoin, Ethereum and USDT)"
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        className="w-full py-4 text-left flex items-center justify-between text-white hover:text-green-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4"
        >
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="relative z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold">Clearway Capital</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="text-white font-medium">About</Link>
              <Link href="/services" className="text-slate-300 hover:text-white transition-colors">Services</Link>
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
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-4 py-2 backdrop-blur-sm font-semibold">
              About Clearway Capital
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Leading the Future of{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Digital Investment
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're a global crypto finance company on a mission to make it possible for anyone, anywhere to help change the global economy. 
              Our company was founded because we believed money should work like the internet — open, secure, free, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`${value.color} flex-shrink-0`}>
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-slate-300 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Energizing the world through <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">financial innovation</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Welcome to Clearway Capital, where we're dedicated to revolutionizing the way the world approaches finance. 
              With a relentless focus on innovation and a commitment to empowering individuals and businesses alike, 
              we strive to energize the global economy through cutting-edge financial solutions. 
              Join us as we pave the way for a brighter, more inclusive financial future for all.
            </p>
          </div>

          {/* Our Goal */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-16">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Goal:</h3>
              <p className="text-xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent font-semibold">
                "Join the Investment Revolution: Empowering Investors, Every Step of the Way."
              </p>
            </CardContent>
          </Card>

          {/* Who we are */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-center">Who we are</h3>
              <p className="text-slate-300 text-lg leading-relaxed max-w-4xl mx-auto">
                Clearway Capital is a Fortune 200 company shaping the future of finance through innovation and investments 
                in disruptive technologies throughout North America. With our roots tracing back nearly 100 years, 
                Clearway Capital has been a trailblazer in the financial industry since our inception. 
                From servicing 76,000 customers to now providing innovative, secure, and reliable financial services 
                to more than 12 million people, our business has undergone a remarkable evolution. 
                Since our humble beginnings nearly a century ago, Clearway Capital has been pioneering new technologies, 
                each marking crucial achievements in the financial landscape.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Clearway Capital?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the difference with our cutting-edge features and unparalleled service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                  <h3 className="text-xl font-semibold">Secure Trading</h3>
                </div>
                <p className="text-slate-300">
                  Bank-level security with advanced encryption and multi-factor authentication 
                  to protect your investments and personal data.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-black" />
                </div>
                  <h3 className="text-xl font-semibold">Lightning Fast</h3>
                </div>
                <p className="text-slate-300">
                  Execute trades in milliseconds with our high-performance infrastructure 
                  and optimized trading engine.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-black" />
                </div>
                  <h3 className="text-xl font-semibold">Expert Support</h3>
                </div>
                <p className="text-slate-300">
                  Get help anytime with our 24/7 customer support team of trading experts 
                  and financial professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The experienced professionals leading Clearway Capital's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-md bg-white/10 border-white/20 text-center hover:border-white/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name.replace('-', ' ')}</h3>
                    <p className="text-green-400 mb-2 font-medium">{member.role}</p>
                    <p className="text-slate-400 text-sm">{member.company}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300">
              Get answers to common questions about our platform
            </p>
          </div>
          
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-8">
              <div className="space-y-0">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of investors who trust Clearway Capital for their financial future
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg px-8 py-4 backdrop-blur-sm text-black font-semibold">
                  <Link href="/signup">
                    <Rocket className="w-5 h-5 mr-2" />
                    Get Started Today
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 backdrop-blur-sm">
                  <Link href="/contact">
                    <Globe className="w-5 h-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}