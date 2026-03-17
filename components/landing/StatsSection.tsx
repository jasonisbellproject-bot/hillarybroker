"use client";
import { motion } from 'framer-motion';

const stats = [
  { value: "$50M+", label: "Total Value Locked", className: "text-gradient" },
  { value: "25%", label: "Max APY", className: "text-gradient-staking" },
  { value: "10K+", label: "Active Users", className: "text-gradient-reward" },
  { value: "$2M+", label: "Total Rewards Paid", className: "text-gradient" },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center"
            >
              <div className={`text-3xl font-bold ${stat.className} mb-2`}>{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 