"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, Clock } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - CTA */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Let's talk about your <span className="text-gradient">investment goals</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Ready to start your investment journey? Our expert team is here to guide you through every step of the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link 
                  href="/signup" 
                  className="btn-gradient px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                  aria-label="Sign up to start earning with Fidelity Assured"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-white/10 hover:bg-white/20 text-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-white/20 inline-flex items-center gap-2"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right side - Contact Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-foreground font-semibold">Call on:</p>
                    <p className="text-muted-foreground">+12346004595</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-foreground font-semibold">Email:</p>
                    <p className="text-muted-foreground">support@clearwaycapital.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-foreground font-semibold">Time:</p>
                    <p className="text-muted-foreground">9am to 5pm (Sunday close)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-muted-foreground text-sm">
                  <strong>Address:</strong> 300 Carnegie Center Dr, Princeton, NJ 08540, United States
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 