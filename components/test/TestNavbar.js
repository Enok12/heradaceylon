'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

const EASE = [0.16, 1, 0.3, 1]
const BRAND_LOGO = '/images/logo/embossed-brand-name.png'
// Set directly: Tailwind's font-serif points at a --font-cormorant variable that isn't defined
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

// Navbar for the Test Page (the alternate homepage): hidden on the welcome section, then
// the brand-name logo centred, an animated hamburger on the left and the bag on the right.
export default function TestNavbar({ links }) {
  const { count, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // Never on the welcome section (the first snap section). Past it: shown on arrival from
  // the welcome section, hidden on any further scroll down, shown again on scroll up.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const intro = document.querySelector('[data-snap-section]')
      const welcomeEnd = intro ? intro.offsetHeight - 2 : 0
      const y = window.scrollY
      if (y < welcomeEnd) setVisible(false)
      else if (lastY < welcomeEnd) setVisible(true)
      else if (y > lastY) setVisible(false)
      else if (y < lastY) setVisible(true)
      lastY = y
    }
    // Reloading partway down shows it
    const intro = document.querySelector('[data-snap-section]')
    setVisible(!!intro && window.scrollY >= intro.offsetHeight - 2)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // While the menu is open, the page underneath shouldn't scroll or snap
  useEffect(() => {
    if (!menuOpen) return
    document.body.dataset.menuOpen = 'true'
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      delete document.body.dataset.menuOpen
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={false}
        animate={visible || menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`fixed top-0 left-0 right-0 z-[210] h-[72px] transition-colors duration-300 ${
          menuOpen ? 'bg-transparent' : 'bg-white/90 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
        } ${visible || menuOpen ? '' : 'pointer-events-none'}`}
      >
        <div className="relative flex items-center justify-between h-full px-6 md:px-12">
          {/* Left: the hamburger */}
          <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />

          {/* Brand name logo, centred */}
          <Link
            href="/test"
            onClick={() => setMenuOpen(false)}
            aria-label="Herada Ceylon home"
            className="absolute left-1/2 -translate-x-1/2 h-[42px] md:h-[50px] aspect-[974/281]"
          >
            <Image src={BRAND_LOGO} alt="Herada Ceylon" fill sizes="174px" className="object-contain" />
          </Link>

          {/* Right: the bag */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label={`Open bag (${count})`}
            className={`flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-medium text-charcoal hover:opacity-60 transition-opacity duration-200 ${menuOpen ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <span className="hidden md:inline">Bag</span>
            <span className="inline-flex items-center justify-center w-5 h-5 text-[9px] font-medium rounded-full bg-charcoal text-white">
              {count}
            </span>
          </button>
        </div>
      </motion.nav>

      {/* Full-screen menu, sliding in from the left where the hamburger is */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 100% 0% 0%)', transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1], delay: 0.1 } }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[200] bg-cream flex flex-col px-8 md:px-16 pt-28 pb-10"
          >
            <ul className="list-none space-y-1 md:space-y-2">
              {links.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={SERIF}
                    className="text-[clamp(36px,5vw,64px)] font-medium text-charcoal no-underline leading-tight hover:text-gold hover:pl-3 transition-all duration-300 block"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-auto text-[10px] tracking-[0.2em] uppercase text-muted font-medium"
            >
              Herada Ceylon · Sri Lanka
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Three lines; on hover the short bottom line extends, when open the outer two cross into
// an X and the middle one draws away
function Hamburger({ open, onClick }) {
  const line = 'absolute left-0 h-[1.5px] bg-charcoal'
  const t = { duration: 0.45, ease: EASE }
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="group relative w-10 h-10 -ml-2 flex items-center justify-center"
    >
      <span className="relative block w-[26px] h-[16px]">
        <motion.span
          className={`${line} top-0 w-full origin-center`}
          animate={open ? { top: '50%', y: '-50%', rotate: 45 } : { top: '0%', y: '0%', rotate: 0 }}
          transition={t}
        />
        <motion.span
          className={`${line} top-1/2 -translate-y-1/2 w-full origin-left`}
          animate={open ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
          transition={t}
        />
        <motion.span
          className={`${line} bottom-0 origin-center transition-[width] duration-300 ${open ? '' : 'w-[16px] group-hover:w-full'}`}
          animate={open ? { bottom: '50%', y: '50%', rotate: -45, width: '100%' } : { bottom: '0%', y: '0%', rotate: 0 }}
          transition={t}
        />
      </span>
    </button>
  )
}
