"use client";
import { motion } from 'framer-motion';
import { CreditCard, Shield, Globe, Users, BarChart2, MonitorSmartphone, Headphones, RefreshCcw } from 'lucide-react';

const advantages = [
  {
    icon: <CreditCard className="w-8 h-8 text-yellow-400" />, 
    title: "Payment Options",
    description: "We provide various withdrawal methods."
  },
  {
    icon: <Shield className="w-8 h-8 text-yellow-400" />, 
    title: "Strong Security",
    description: "With advanced security systems, we keep your account always protected."
  },
  {
    icon: <Globe className="w-8 h-8 text-yellow-400" />, 
    title: "World Coverage",
    description: "Our platform is used by bitcoin investors worldwide."
  },
  {
    icon: <Users className="w-8 h-8 text-yellow-400" />, 
    title: "Experienced Team",
    description: "Our experienced team helps us build the best product and deliver first class service to our clients."
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-yellow-400" />, 
    title: "Advanced Reporting",
    description: "We provide reports for all investments done using our platform."
  },
  {
    icon: <MonitorSmartphone className="w-8 h-8 text-yellow-400" />, 
    title: "Cross-Platform Trading",
    description: "Our platform can be accessed from various devices such as Phones, Tablets & Pc."
  },
  {
    icon: <Headphones className="w-8 h-8 text-yellow-400" />, 
    title: "Expert Support",
    description: "Our 24/7 support allows us to keep in touch with customers in all time zones and regions."
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-yellow-400" />, 
    title: "Instant Exchange",
    description: "Change your world today and make yourself a great tomorrow, invest with the little money you have and make a great profit at the end."
  },
];

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold text-sm shadow-lg">
            OUR PLATFORM ADVANTAGES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Why Choose Clearway Capital?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the unique benefits that set us apart from the competition.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative glass-card p-8 text-left border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-white/5 to-yellow-600/10 shadow-xl backdrop-blur-xl rounded-2xl"
            >
              <div className="flex items-center gap-4 mb-4">
                {adv.icon}
                <h3 className="text-lg font-bold text-gradient-gold leading-tight">
                  {adv.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-base">
                {adv.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 