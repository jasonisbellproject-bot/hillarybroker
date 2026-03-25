import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Preloader } from '@/components/preloader'

export const metadata: Metadata = {
  title: 'Fidelity Assured - Earn More with Staking & Rewards',
  description: 'Join the future of decentralized finance. Stake, earn rewards, and grow your wealth with our advanced platform.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Smartsupp Live Chat script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '3616b79e6d279db1042c845de1f26f0d1dd9e197';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `
          }}
        />
        <noscript>
          Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <Preloader />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
