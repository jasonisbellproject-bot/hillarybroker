'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CopyTradingRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new copy trading page under dashboard
    router.replace('/dashboard/copy-trading');
  }, [router]);

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to Copy Trading...</p>
      </div>
    </div>
  );
}
