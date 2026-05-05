'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'

function CheckmarkAnim() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 rounded-full border border-gold/40 bg-gold/8 flex items-center justify-center"
      >
        <motion.svg
          width="32" height="32" viewBox="0 0 32 32" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        >
          <motion.path
            d="M6 16 L13 23 L26 9"
            stroke="#B5935A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </motion.div>

      {/* Ring pulse */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full border border-gold/30"
      />
    </div>
  )
}

function ConfettiDot({ delay }) {
  const x = (Math.random() - 0.5) * 300
  const y = -(Math.random() * 200 + 100)
  const colors = ['#B5935A', '#D4AE78', '#CDB99E', '#1A1A1A', '#F7F3EE']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = Math.random() * 6 + 3

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ x, y, opacity: 0, rotate: Math.random() * 360, scale: 0 }}
      transition={{ duration: 1.4 + Math.random() * 0.6, delay, ease: 'easeOut' }}
      className="absolute top-1/2 left-1/2 rounded-sm pointer-events-none"
      style={{ width: size, height: size, background: color }}
    />
  )
}

const WHAT_NEXT = [
  {
    icon: '📧',
    title: 'Confirmation email',
    desc: 'A detailed receipt has been sent to your email address.',
  },
  {
    icon: '🧵',
    title: 'Artisan preparation',
    desc: 'Your piece is being carefully inspected and wrapped by our team in Colombo.',
  },
  {
    icon: '✈',
    title: 'Shipping notification',
    desc: "You'll receive tracking information once your order is dispatched.",
  },
]

export default function ConfirmationPage() {
  const { items, total, setIsOpen, clearCart } = useCart()
  const [orderNum] = useState(() => 'HC-' + Math.random().toString(36).slice(2, 8).toUpperCase())
  const [dots] = useState(() => Array.from({ length: 24 }, (_, i) => i))
  const [confirmedItems, setConfirmedItems] = useState([])
  const [confirmedTotal, setConfirmedTotal] = useState(0)

  useEffect(() => {
    setIsOpen(false)
    setConfirmedItems(items)
    setConfirmedTotal(total)
    const t = setTimeout(() => clearCart(), 200)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      <div className="max-w-[680px] mx-auto px-6 py-16 md:py-24">

        {/* Logo */}
        <div className="text-center mb-16">
          <Link href="/" className="font-serif text-[20px] font-light tracking-[0.22em] uppercase text-charcoal no-underline">
            Herada Ceylon
          </Link>
        </div>

        {/* Confirmation card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative"
        >
          {/* Confetti */}
          <div className="relative inline-block">
            {dots.map(i => <ConfettiDot key={i} delay={i * 0.04} />)}
            <CheckmarkAnim />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[9px] tracking-[0.28em] uppercase text-gold font-light mb-3 flex items-center justify-center gap-3">
              <span className="w-5 h-px bg-gold" />
              Order Confirmed
              <span className="w-5 h-px bg-gold" />
            </p>
            <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-light text-charcoal leading-[1.05] mb-4">
              Thank you,<br />
              <em className="italic text-gold">your order is placed</em>
            </h1>
            <p className="text-[12px] tracking-[0.06em] text-muted font-light leading-loose max-w-md mx-auto mb-6">
              Your piece will be carefully wrapped and dispatched from our atelier in Colombo.
              A confirmation has been sent to your email.
            </p>
            <div className="inline-flex items-center gap-3 border border-sand bg-linen px-6 py-3">
              <span className="text-[9px] tracking-[0.18em] uppercase text-muted font-light">Order</span>
              <span className="font-serif text-[18px] font-light text-charcoal tracking-wider">{orderNum}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[9px] tracking-[0.24em] uppercase text-muted font-light text-center mb-8">
            What happens next
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand">
            {WHAT_NEXT.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-cream px-6 py-7 text-center"
              >
                <div className="text-2xl mb-4 opacity-60">{step.icon}</div>
                <p className="text-[10px] tracking-[0.16em] uppercase text-charcoal font-light mb-2">{step.title}</p>
                <p className="text-[10px] tracking-[0.04em] text-muted font-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order summary */}
        {confirmedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="border border-sand mb-14"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-sand">
              <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal font-light">Your Items</span>
              <span className="font-serif text-[18px] font-light text-charcoal">USD {confirmedTotal.toLocaleString()}</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              {confirmedItems.map(item => (
                <div key={item.key} className="flex justify-between items-center">
                  <div>
                    <p className="font-serif text-[15px] font-light text-charcoal">{item.product.name}</p>
                    <p className="text-[9px] tracking-[0.14em] uppercase text-muted font-light">
                      {item.product.subcategory} · Size {item.size} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="text-[12px] text-charcoal font-light">
                    USD {(item.product.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/"
            className="flex-1 py-4 bg-charcoal text-cream text-[10px] tracking-[0.24em] uppercase font-light text-center hover:bg-espresso transition-all duration-400 no-underline"
          >
            Continue Shopping
          </Link>
          <Link
            href="/collections"
            className="flex-1 py-4 border border-warm text-charcoal text-[10px] tracking-[0.24em] uppercase font-light text-center hover:border-charcoal transition-all duration-400 no-underline"
          >
            View Collections
          </Link>
        </motion.div>

        {/* Brand line */}
        <div className="text-center mt-16 pt-10 border-t border-sand">
          <p className="font-serif text-[14px] font-light text-muted italic">
            "Each thread is a conversation with the land."
          </p>
          <p className="text-[9px] tracking-[0.24ex] uppercase text-muted/50 font-light mt-2">
            Herada Ceylon · Colombo, Sri Lanka
          </p>
        </div>
      </div>
    </div>
  )
}
