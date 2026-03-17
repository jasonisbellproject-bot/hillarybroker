"use client";
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Gift } from 'lucide-react';

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up and complete your KYC verification",
    icon: <Shield className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500"
  },
  {
    step: "02",
    title: "Start Staking",
    description: "Choose from our flexible or locked staking pools",
    icon: <TrendingUp className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500"
  },
  {
    step: "03",
    title: "Earn Rewards",
    description: "Watch your earnings grow with daily rewards",
    icon: <Gift className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in just 3 simple steps
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {step.step}
                </div>
              </div>
              <div className="text-gradient mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 