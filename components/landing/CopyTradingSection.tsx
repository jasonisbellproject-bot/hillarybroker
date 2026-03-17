"use client";
import { motion } from 'framer-motion';
import { Copy, TrendingUp, Users, Target, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const copyTradingFeatures = [
  {
    icon: <Copy className="w-8 h-8" />,
    title: "Automated Copy Trading",
    description: "Automatically copy successful traders' strategies with just one click",
    color: "text-blue-400"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Proven Track Records",
    description: "Follow traders with verified performance histories and success rates",
    color: "text-green-400"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Traders",
    description: "Access to a curated network of professional and verified traders",
    color: "text-purple-400"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Risk Management",
    description: "Set your own risk parameters and copy percentages",
    color: "text-orange-400"
  }
];

const stats = [
  { number: "500+", label: "Active Traders" },
  { number: "95%", label: "Success Rate" },
  { number: "$2.5M+", label: "Total Profits" },
  { number: "10K+", label: "Happy Followers" }
];

export default function CopyTradingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Copy className="w-4 h-4" />
            Copy Trading Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Copy the <span className="text-gradient">Best Traders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of investors who are already earning by copying successful traders. 
            No experience needed - just follow the experts and let them trade for you.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {copyTradingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center card-hover group"
            >
              <div className={`mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 text-foreground">How Copy Trading Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with copy trading in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Choose a Trader</h4>
              <p className="text-muted-foreground text-sm">
                Browse our verified traders and select one based on their performance, success rate, and trading style.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Set Your Budget</h4>
              <p className="text-muted-foreground text-sm">
                Decide how much you want to invest and what percentage of the trader's positions you want to copy.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Start Earning</h4>
              <p className="text-muted-foreground text-sm">
                Sit back and watch your portfolio grow as the expert trader makes profitable trades for you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-card p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Join 10,000+ Successful Investors</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Start Copy Trading?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create your account today and start copying the best traders in the market. 
              No trading experience required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="btn-gradient px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                Start Copy Trading
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/dashboard/copy-trading"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-white/20 inline-flex items-center gap-2"
              >
                Browse Traders
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
