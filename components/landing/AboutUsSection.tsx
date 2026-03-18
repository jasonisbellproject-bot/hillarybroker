"use client";
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, Award, Clock, Shield } from 'lucide-react';
import { useState } from 'react';

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

const teamMembers = [
  {
    name: "Craig-Cornelius",
    role: "Chairman, President and Chief Executive Officer",
    company: "Fidelity Assured, Inc.",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784567/Craig-Cornelius_clearway-energy_uneip8.jpg"
  },
  {
    name: "Steve-Ryder",
    role: "President and Chief Executive Officer",
    company: "Fidelity Assured Resources, LLC",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784567/Steve-Ryder_clearway-energy_tqfx5z.jpg"
  },
  {
    name: "Jennifer-Hein",
    role: "Executive Vice President Chief Risk Officer",
    company: "Fidelity Assured, Inc.",
    image: "https://res.cloudinary.com/dxufnlb6q/image/upload/v1755784566/Jennifer-Hein_clearway-energy_j3dxzw.jpg"
  }
];

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
  },
  {
    question: "How long does it take for my deposit to be added to my account?",
    answer: "Your account will be updated as fast, as you deposit."
  },
  {
    question: "Where can i find the status of my investments/withdrawal?",
    answer: "You can find full details on your transactions by following the steps below. Go to 'Dashboard'. Click on the Investments. Click on the Investment summary. Find the relevant transaction."
  },
  {
    question: "How do i Fund my Trading Wallet",
    answer: "1. Click on the Top Up on the sidebar\n2. Click on add deposit\n3. Enter the amount you wish to fund\n4. Choose your mode of payment\n5. Click on Process Deposit\n6. On the next page you will see the payment address of your selected payment method\n7. You can copy the address or scan the QR code to get the address\n8. After successful payment click on the Upload Payment Proof\n9. Upload a copy of your payment receipt for confirmation\n10. After confirmation your account will be funded"
  },
  {
    question: "How do i place an Investment",
    answer: "1. To invest click on \"Investments\" on the sidebar\n2. Click on New Investments\n3. All our plans will be displayed on the screen\n4. Choose you preferred plan by clicking on \"choose plan\" button of the respective plan\n5. Enter your investment amount\n6. Choose your investment contract\n7. Enter your investment description and click on Invest Now\n8. And that's all you need to do to invest. Your profits will now begin to accumulate based on your selected plan."
  },
  {
    question: "How do i request for Withdrawal",
    answer: "To withdraw your profits, please follow the steps below:\n\n1. Click on Withdraw from the sidebar\n2. On the form provided, enter your wallet address\n3. Choose your payment method, either BTC, USDT or ETH\n4. Enter the amount you wish to withdraw\n5. The last step is to enter a withdrawal description\n6. Click on Request withdrawal\n\nYour withdrawal will be reviewed and approved after 3 confirmations from the blockchain network."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        className="w-full py-4 text-left flex items-center justify-between text-foreground hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function AboutUsSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            🤩 What Drives Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Energizing the world through <span className="text-gradient">financial innovation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Welcome to Fidelity Assured, where we're dedicated to revolutionizing the way the world approaches finance. 
            With a relentless focus on innovation and a commitment to empowering individuals and businesses alike, 
            we strive to energize the global economy through cutting-edge financial solutions. 
            Join us as we pave the way for a brighter, more inclusive financial future for all.
          </p>
        </motion.div>

        {/* Our Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Our Goal:</h3>
            <p className="text-xl text-gradient font-semibold">
              "Join the Investment Revolution: Empowering Investors, Every Step of the Way."
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 card-hover"
              >
                <div className={`mb-4 ${value.color}`}>
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Who we are */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="glass-card p-8">
            <h3 className="text-3xl font-bold mb-6 text-center text-foreground">Who we are</h3>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              Fidelity Assured is a Fortune 200 company shaping the future of finance through innovation and investments 
              in disruptive technologies throughout North America. With our roots tracing back nearly 100 years, 
              Fidelity Assured has been a trailblazer in the financial industry since our inception. 
              From servicing 76,000 customers to now providing innovative, secure, and reliable financial services 
              to more than 12 million people, our business has undergone a remarkable evolution. 
              Since our humble beginnings nearly a century ago, Fidelity Assured has been pioneering new technologies, 
              each marking crucial achievements in the financial landscape.
            </p>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-foreground">A squad of talented members</h3>
            <p className="text-xl text-muted-foreground">
              We are a close-knit squad of exceptionally talented individuals who are passionate about your investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center card-hover"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-green-500/30">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h4>
                <p className="text-muted-foreground text-sm mb-1">{member.role}</p>
                <p className="text-muted-foreground text-xs">{member.company}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-foreground">You have questions we have answers</h3>
            <p className="text-xl text-muted-foreground">
              3000+ Users rated us 4.85 out of 5.
            </p>
          </div>
          
          <div className="glass-card p-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
