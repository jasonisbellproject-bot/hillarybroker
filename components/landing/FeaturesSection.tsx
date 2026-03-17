"use client";
import { motion } from 'framer-motion';
import { TrendingUp, Gift, Users, Coins, Copy } from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="w-8 h-8" />, 
    title: "Cryptocurrency",
    description: "Focus on cryptocurrencies designed to enhance user privacy and anonymity, offering secure and confidential transactions",
    color: "text-green-400"
  },
  {
    icon: <Copy className="w-8 h-8" />, 
    title: "Copy Trading",
    description: "Superior execution and trading conditions, providing deep liquidity with a range of account types and platforms",
    color: "text-blue-400"
  },
  {
    icon: <Gift className="w-8 h-8" />, 
    title: "Technology",
    description: "Investing in cutting-edge technology companies driving innovation and disruption across industries",
    color: "text-green-400"
  },
  {
    icon: <Users className="w-8 h-8" />, 
    title: "Healthcare",
    description: "Supporting advancements in healthcare services, pharmaceuticals, biotechnology, and medical devices",
    color: "text-green-400"
  },
  {
    icon: <Coins className="w-8 h-8" />, 
    title: "Renewable Energy",
    description: "Contributing to the transition towards sustainable energy sources such as solar, wind, and hydroelectric power",
    color: "text-gradient"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />, 
    title: "Real Estate",
    description: "Participating in property development, management, and investment opportunities across residential and commercial sectors",
    color: "text-green-400"
  },
  {
    icon: <Copy className="w-8 h-8" />, 
    title: "Finance Technology",
    description: "Investing in financial institutions, fintech startups, and emerging markets to drive economic growth",
    color: "text-purple-400"
  },
  {
    icon: <Users className="w-8 h-8" />, 
    title: "Blockchain Infrastructure",
    description: "Support the backbone of blockchain technology by investing in scalable, secure, and interoperable networks",
    color: "text-green-400"
  }
];

export default function FeaturesSection() {
  const currentFeature = 0; // No animation for now, can add if needed
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We specialize in the following <span className="text-green-400">Investment Strategies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            🚀 Innovative solutions, Measurable results
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-6 text-center card-hover ${currentFeature === index ? 'pulse-glow' : ''}`}
            >
              <div className={`mx-auto mb-4 ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}