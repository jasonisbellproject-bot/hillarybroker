"use client";
import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CopyTradingSection from '@/components/landing/CopyTradingSection';
import InvestmentProcessSection from '@/components/landing/InvestmentProcessSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import AboutUsSection from '@/components/landing/AboutUsSection';
import StatsSection from '@/components/landing/StatsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import AwardsSection from '@/components/landing/AwardsSection';
import AdvantagesSection from '@/components/landing/AdvantagesSection';
import GallerySection from '@/components/landing/GallerySection';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useRef } from 'react';

export default function LandingPage() {
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dummy data for notifications
  const actions = [
    { type: 'Deposit', color: 'from-green-400 to-green-600', icon: '💸' },
    { type: 'Withdraw', color: 'from-red-400 to-red-600', icon: '🏦' },
    { type: 'Stake', color: 'from-green-500 to-emerald-500', icon: '🚀' },
  ];
  const users = [
    { name: 'Alice', country: 'USA' },
    { name: 'Carlos', country: 'Brazil' },
    { name: 'Fatima', country: 'UAE' },
    { name: 'Yuki', country: 'Japan' },
    { name: 'Liam', country: 'UK' },
    { name: 'Ivan', country: 'Russia' },
    { name: 'Priya', country: 'India' },
    { name: 'Chen', country: 'China' },
    { name: 'Marta', country: 'Spain' },
    { name: 'Elena', country: 'Italy' },
    { name: 'Jasper', country: 'Netherlands' },
    { name: 'Leila', country: 'Morocco' },
    { name: 'Hans', country: 'Germany' },
    { name: 'Olga', country: 'Ukraine' },
    { name: 'Santiago', country: 'Argentina' },
    { name: 'Marie', country: 'France' },
    { name: 'Ahmed', country: 'Egypt' },
    { name: 'Anika', country: 'Sweden' },
    { name: 'Mateo', country: 'Colombia' },
    { name: 'Isla', country: 'Australia' },
    { name: 'Sofie', country: 'Denmark' },
    { name: 'Tariq', country: 'Saudi Arabia' },
    { name: 'Zara', country: 'Pakistan' },
    { name: 'Jin', country: 'South Korea' },
    { name: 'Luka', country: 'Croatia' },
    { name: 'Erik', country: 'Norway' },
    { name: 'Maya', country: 'Mexico' },
    { name: 'Lucas', country: 'Canada' },
    { name: 'Kofi', country: 'Ghana' },
    { name: 'Diana', country: 'Romania' }
  ];
  const amounts = [
    1200, 1500, 2000, 2500, 3000, 5000, 10000,
    12000, 15000, 18000, 20000,
    25000, 30000, 35000, 40000, 45000, 50000
  ];
  

  const showRandomToast = useCallback(() => {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    toast({
      title: (
        <div className="flex items-center gap-2">
          <span className={`inline-block text-lg bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>{action.icon}</span>
          <span className="font-bold">{user.name}</span>
          <span className="text-xs text-gray-400">({user.country})</span>
          <span className="ml-2 text-sm font-semibold">{action.type}</span>
        </div>
      ) as any,
      description: (
        <span className="text-gray-700">
          {action.type === 'Deposit' && 'deposited'}
          {action.type === 'Withdraw' && 'withdrew'}
          {action.type === 'Stake' && 'staked'}
          {' '}
          <span className="font-bold">${amount.toLocaleString()}</span>
        </span>
      ) as any,
      className:
        'glass-card border-2 border-transparent bg-gradient-to-br from-green-400/30 via-white/10 to-emerald-600/30 shadow-xl backdrop-blur-xl ' +
        'before:content-[""] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-green-400/60 before:to-emerald-600/60 before:opacity-20',
      style: {
        borderImage: 'linear-gradient(120deg, #22c55e 0%, #10b981 100%) 1',
        background: 'rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(16px)',
      },
    });
  }, [toast]);

  useEffect(() => {
    showRandomToast(); // Show one immediately
    intervalRef.current = setInterval(showRandomToast, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showRandomToast]);

  return (
    <div>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <CopyTradingSection />
      <InvestmentProcessSection />
      <TestimonialsSection />
      <AboutUsSection />
      <GallerySection />
      <StatsSection />
      <HowItWorksSection />
      <AwardsSection />
      <AdvantagesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}