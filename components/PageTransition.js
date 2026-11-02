'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Enter-only transition. An AnimatePresence exit (mode="wait") gets stuck with the
// App Router: the new route renders inside the exiting wrapper and stays at opacity 0.
const variants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="initial"
      animate="enter"
    >
      {children}
    </motion.div>
  )
}
