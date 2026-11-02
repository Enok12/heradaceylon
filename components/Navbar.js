'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { count, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  // White text only at the top of the home page; black on white once scrolled.
  // The theme is frozen while the nav is hidden so it doesn't flash as it slides away.
  const [onHero, setOnHero] = useState(pathname === '/')
  useEffect(() => {
    if (!hidden) setOnHero(pathname === '/' && !scrolled)
  }, [hidden, scrolled, pathname])
  const text = onHero ? 'text-white' : 'text-charcoal'
  const bar = onHero ? 'bg-white' : 'bg-charcoal'
  const badge = onHero ? 'bg-white text-charcoal' : 'bg-charcoal text-white'

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          onHero
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.08)]'
        }`}
        style={{ height: 72 }}
      >
        <div className="relative flex items-center justify-between h-full px-6 md:px-12">
          {/* Hamburger (tablet + mobile), left */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex xl:hidden flex-col gap-[5px] cursor-pointer z-10 py-2"
            aria-label="Open menu"
          >
            <span className={`w-[22px] h-[1.5px] block transition-colors duration-200 ${bar}`} />
            <span className={`w-[22px] h-[1.5px] block transition-colors duration-200 ${bar}`} />
            <span className={`w-[14px] h-[1.5px] block transition-colors duration-200 ${bar}`} />
          </button>

          {/* Logo: centered on tablet + mobile, left on desktop */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0 font-serif text-[17px] md:text-[19px] font-semibold tracking-[0.22em] uppercase no-underline whitespace-nowrap z-10 transition-colors duration-200 ${text}`}
          >
            Herada Ceylon
          </Link>

          {/* Center Nav (desktop only) */}
          <ul className="hidden xl:flex gap-8 absolute left-1/2 -translate-x-1/2 list-none">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={`link-underline text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-200 ${text}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-6 z-10">
            <button
              onClick={() => setIsOpen(true)}
              className={`hidden xl:flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase font-medium hover:opacity-60 transition-all duration-200 ${text}`}
            >
              Bag
              <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-medium rounded-full ml-1 transition-colors duration-200 ${badge}`}>
                {count}
              </span>
            </button>

            {/* Tablet + mobile cart */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open bag"
              className={`flex xl:hidden items-center text-[11px] tracking-[0.18em] uppercase font-medium ${text}`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 text-[9px] font-medium rounded-full transition-colors duration-200 ${badge}`}>
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
              className="absolute top-6 right-8 text-2xl font-normal text-charcoal"
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
                    className="font-serif text-[40px] font-medium text-charcoal no-underline leading-tight hover:text-gold transition-colors duration-300 block"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto text-[9px] tracking-[0.2em] uppercase text-muted font-normal">
              Herada Ceylon · Sri Lanka
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
