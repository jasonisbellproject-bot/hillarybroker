"use client";
import { motion } from 'framer-motion';
import { Lightbulb, Target, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const processSteps = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Ideation",
    description: "Identify innovations that disrupt established industries or norms",
    color: "text-yellow-400"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Sizing The Opportunity",
    description: "Describe the potential scope or range of possibilities",
    color: "text-blue-400"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Portfolio And Risk Management",
    description: "Oversee confidence levels and fluctuations in market activity",
    color: "text-green-400"
  }
];

export default function InvestmentProcessSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Invest in Your <span className="text-gradient">Tomorrow Today</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the Investment Revolution: Empowering Investors, Every Step of the Way.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center card-hover group"
            >
              <div className={`mx-auto mb-6 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-lg">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Contact our team for more information
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to start your investment journey? Our expert team is here to guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="btn-gradient px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                Let's chat
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/signup"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-white/20 inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
