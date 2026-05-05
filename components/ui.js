'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'

export function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerSection({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children }) {
  return (
    <p className="flex items-center gap-3 text-[9px] tracking-[0.28em] uppercase text-gold font-light mb-4">
      <span className="w-6 h-px bg-gold inline-block" />
      {children}
    </p>
  )
}

export function SectionHeading({ children, className = '', light = false }) {
  return (
    <h2 className={`font-serif font-light leading-[1.05] tracking-[-0.01em] ${light ? 'text-cream' : 'text-charcoal'} ${className}`}>
      {children}
    </h2>
  )
}
