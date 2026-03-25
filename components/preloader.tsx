'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Artificial minimum delay for premium feel
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    // Ensure it goes away if page fully loads (though Next.js hydrate handles this mostly)
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 500)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Ambient background glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2] 
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-10 rounded-full bg-primary/20 blur-3xl pointer-events-none"
            />
            
            {/* Spinning/pulsing icon container */}
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-primary/30 bg-background/60 backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.15)]">
              {/* Spinning border effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-primary border-t-transparent border-r-transparent"
              />
              
              {/* Pulsing icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </motion.div>
            </div>

            {/* Brand text and loading bar */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-col items-center"
            >
              <h2 className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-foreground uppercase relative text-center">
                Fidelity <span className="text-primary">Assured</span>
              </h2>
              
              {/* Premium sleek progress line */}
              <div className="mt-5 h-[2px] w-48 sm:w-64 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "easeInOut" 
                  }}
                  className="h-full w-1/2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
