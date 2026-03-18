"use client";
import { Trophy, Star, Award, ShieldCheck, TrendingUp, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const awards = [
  {
    icon: <Award className="w-8 h-8 text-yellow-400" />, 
    title: "Century International Quality Gold ERA Award",
          description: "The prestigious award was given to Fidelity Assured in recognition of our outstanding commitment to Quality and Excellence, particularly in the realm of Customer Satisfaction."
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-400" />, 
    title: "Most innovative binary option platform",
    description: "As Steve Jobs once said, innovation distinguishes between leaders and followers. Our innovative approach makes our product shine—and the evidence is in this beautiful accolade."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-yellow-400" />, 
    title: "Most Reliable Binary Options Broker",
    description: "Our first priority is the security of our client's funds. This was recognized by the experts at MasterForex-V, who awarded Fidelity Assured the title of Most Trusted Binary Options Broker."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-yellow-400" />, 
    title: "The intelligent trading app for binary options",
    description: "The Mobile Star Awards is the largest annual mobile innovations and software awards program in the world. In 2016, the organization honored the Fidelity Assured trading app as the best in its category, praising its efficiency and impeccable design."
  },
  {
    icon: <Trophy className="w-8 h-8 text-yellow-400" />, 
    title: "World's Leading Binary Options Broker",
    description: "At the same MasterForex-V Fidelity Assured was awarded for being the World's Leading Binary Options Broker. The perfection in our service and product was recognized by the experts of the conference in 2014."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-yellow-400" />, 
    title: "Fastest growing binary option brand",
    description: "Global Brands Magazine, Britain's reputable brand observer, awarded Fidelity Assured along with a number of outstanding European brands — an achievement worth working for."
  },
];

export default function AwardsSection() {
  return (
    <section id="awards" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold text-sm shadow-lg">
            OUR AWARD PLATFORM
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Recognized for Excellence & Innovation
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fidelity Assured is proud to be recognized by leading organizations for our commitment to quality, innovation, and customer satisfaction.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative glass-card p-8 text-left border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-white/5 to-yellow-600/10 shadow-xl backdrop-blur-xl rounded-2xl"
            >
              <div className="flex items-center gap-4 mb-4">
                {award.icon}
                <h3 className="text-lg font-bold text-gradient-gold leading-tight">
                  {award.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-base">
                {award.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 