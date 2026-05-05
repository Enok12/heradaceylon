'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavScroll } from '@/hooks/useNavScroll'
import { useCart } from '@/context/CartContext'

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'New Arrivals', href: '/collections?filter=new' },
  { label: 'Sarees', href: '/collections?category=sarees' },
  { label: 'Contemporary', href: '/collections?category=contemporary' },
  { label: 'Our Story', href: '#story' },
]

export default function Navbar() {
  const { scrolled, hidden } = useNavScroll()
  const { count, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
        style={{ height: 72 }}
      >
        <div className="flex items-center justify-between h-full px-8 md:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-[19px] font-light tracking-[0.22em] uppercase text-charcoal no-underline z-10"
          >
            Herada Ceylon
          </Link>

          {/* Center Nav */}
          <ul className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="link-underline text-[10px] tracking-[0.18em] uppercase font-light text-charcoal">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-6 z-10">
            <button
              onClick={() => setIsOpen(true)}
              className="hidden md:flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase font-light text-charcoal hover:opacity-60 transition-opacity duration-300"
            >
              Bag
              <span className="inline-flex items-center justify-center w-4 h-4 bg-charcoal text-cream text-[9px] rounded-full ml-1">
                {count}
              </span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex md:hidden flex-col gap-[5px] cursor-pointer"
              aria-label="Open menu"
            >
              <span className="w-[22px] h-px bg-charcoal block" />
              <span className="w-[22px] h-px bg-charcoal block" />
              <span className="w-[14px] h-px bg-charcoal block" />
            </button>

            {/* Mobile cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex md:hidden items-center text-[10px] tracking-[0.18em] uppercase font-light text-charcoal"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 bg-charcoal text-cream text-[9px] rounded-full">
                {count}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-cream z-[200] flex flex-col px-8 py-20"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-8 text-2xl font-light text-charcoal"
              aria-label="Close menu"
            >
              ✕
            </button>
            <ul className="list-none space-y-1 mt-4">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-[40px] font-light text-charcoal no-underline leading-tight hover:text-gold transition-colors duration-300 block"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto text-[9px] tracking-[0.2em] uppercase text-muted font-light">
              Herada Ceylon · Sri Lanka
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
