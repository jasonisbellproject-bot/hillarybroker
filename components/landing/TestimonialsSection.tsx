"use client";
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

const testimonials = [
  {
    name: "Parada",
    role: "Active user",
    content: "I'm very glad to invest and promote the successful company, I'm in the Agricultural plan.",
    rating: 5
  },
  {
    name: "Sarah Mpena",
    role: "Head of Finance, PCID Corp.",
    content: "Passion, knowledge and a genuine interest in achieving the best for clients is what makes a truly professional Financial Adviser. Your team had this and more. Your dedication to clients, business excellence and education sets you apart and I would highly recommend you to anyone wanting to achieve better financial outcomes.",
    rating: 5
  },
  {
    name: "Emma Peterson",
    role: "CFO, iStep Ltd.",
    content: "I am absolutely delighted with your service. It is really refreshing to work with a financial adviser who is truly interested in their client's needs, circumstances and preferences. What really impressed me was the way you took the time to get a feeling for where I was at, your depth of knowledge, lateral thinking and your common sense approach.",
    rating: 5
  },
  {
    name: "Grace Noman",
    role: "Investor",
    content: "Good platform for investments and returns",
    rating: 5
  },
  {
    name: "Maggie Pengs",
    role: "Business Owner",
    content: "I must thank and appreciate the management for their great work, Since I joined this platform it has been earning multiple profits and Huge profits.",
    rating: 5
  },
  {
    name: "Kimbo Yin",
    role: "Investor",
    content: "Success is not about been the only successful one, Success is making a lot of people successful because for me that's my Success. I introduced my loved ones to this platform and they are making it big now.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-red-900/20 to-orange-900/20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-pink-400 mb-4">
            <Heart className="w-6 h-6" />
            <span className="text-lg font-semibold">Real results from real clients</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See how we've helped our clients <span className="text-gradient">succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            More than 45k+ investors using Fidelity Assured
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 card-hover"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-semibold">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-gradient mb-2">10+</div>
                <div className="text-muted-foreground">Years of experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gradient mb-2">45k+</div>
                <div className="text-muted-foreground">Happy customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gradient mb-2">4.8/5.0</div>
                <div className="text-muted-foreground">Reviewed by 365 users</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
