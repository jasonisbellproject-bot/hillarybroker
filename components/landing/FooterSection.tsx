"use client";
import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gradient mb-4">Fidelity Assured</h3>
          <p className="text-muted-foreground mb-6">
            The future of decentralized finance is here
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-yellow-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-yellow-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-yellow-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 