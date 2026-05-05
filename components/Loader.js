'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
  const seen = sessionStorage.getItem('hc-loaded')
  if (seen) {
    // Returning visitor — hide instantly, no animation
    setVisible(false)
    return
  }
  // First visit — show the loader, then fade out after 2.4s
  const timer = setTimeout(() => {
    setVisible(false)
    sessionStorage.setItem('hc-loaded', '1')
  }, 2400)
  return () => clearTimeout(timer)
}, [])



  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.1 },
          }}
          className="fixed inset-0 z-[9999] bg-espresso flex flex-col items-center justify-center gap-6 pointer-events-none"
        >
          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-5"
          >
            <span
              className="font-serif text-[26px] font-light tracking-[0.32em] uppercase text-cream"
            >
              Herada Ceylon
            </span>

            {/* Animated line */}
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="block h-px bg-gold"
              style={{ display: 'block' }}
            />

            {/* Subline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
              className="text-[9px] tracking-[0.32em] uppercase text-cream/35 font-light"
            >
              Sri Lanka · Est. 2018
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
