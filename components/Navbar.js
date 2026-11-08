'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

const EASE = [0.16, 1, 0.3, 1]
const BRAND_LOGO = '/images/logo/embossed-brand-name.png'

// Menu contents. href: null is a placeholder that does nothing when clicked: fill in the
// social links once the accounts are confirmed. comingSoon: shown but not clickable.
const MAIN_LINKS = [
  { label: 'New Arrivals', href: '/collections?filter=new' },
  { label: 'Collections', href: '/collections' },
  { label: 'Mens', comingSoon: true },
  { label: 'Womens', href: '/collections?category=women' },
]
const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
]
const SOCIALS = [
  { label: 'Facebook', href: null, icon: <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
  { label: 'Instagram', href: null, icon: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
    </g>
  ) },
  { label: 'TikTok', href: null, icon: <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /> },
]

// Site navbar: hidden on the homepage's welcome section, otherwise
// the brand-name logo centred, an animated hamburger on the left and the bag on the right.
export default function Navbar() {
  const pathname = usePathname()
  const { count, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(pathname !== '/')

  // Never on the homepage's welcome section (its first snap section). Past it: shown on
  // arrival from the welcome section. Everywhere: hidden on scroll down, shown on scroll up
  // and at the top of the page. Re-evaluated on each page change, as this stays mounted.
  useEffect(() => {
    const welcomeEnd = () => {
      const intro = document.querySelector('[data-snap-section]')
      return intro ? intro.offsetHeight - 2 : 0
    }
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const end = welcomeEnd()
      if (y < end) setVisible(false)
      else if (lastY < end || y <= 0) setVisible(true)
      else if (y > lastY) setVisible(false)
      else if (y < lastY) setVisible(true)
      lastY = y
    }
    setVisible(window.scrollY >= welcomeEnd())
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

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
          menuOpen ? 'bg-white shadow-[0_1px_0_rgba(0,0,0,0.1)]' : 'bg-white/90 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
        } ${visible || menuOpen ? '' : 'pointer-events-none'}`}
      >
        <div className="relative flex items-center justify-between h-full px-6 md:px-12">
          {/* Left: the hamburger */}
          <div className="flex items-center gap-2">
            <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
            <span className={`text-[13px] tracking-[0.1em] uppercase font-medium text-charcoal transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}>
              Menu
            </span>
          </div>

          {/* Brand name logo, centred. Stays with the menu open, except on phones where it would
              run into the MENU label */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-label="Herada Ceylon home"
            className={`absolute left-1/2 -translate-x-1/2 h-[42px] md:h-[50px] aspect-[974/281] transition-opacity duration-300 ${menuOpen ? 'max-sm:opacity-0 max-sm:pointer-events-none' : ''}`}
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

      {/* Side panel below the bar, sliding in from the left where the hamburger is. The rest
          of the page is blurred behind it; clicking there closes the menu. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-0 top-[72px] bottom-0 z-[195] bg-black/40 backdrop-blur-md"
          />
        )}
        {menuOpen && (
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%', transition: { duration: 0.4, ease: [0.77, 0, 0.175, 1], delay: 0.1 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-[72px] bottom-0 z-[200] w-full sm:w-[440px] lg:w-[36vw] lg:min-w-[480px] lg:max-w-[600px] bg-white flex flex-col"
          >
            {/* Scrolls by itself on short screens; the social row stays at the bottom */}
            <div data-menu-scroll className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar px-6 md:px-8 py-7">
              <ul className="list-none space-y-2">
                {MAIN_LINKS.map(({ label, href, comingSoon }, i) => (
                  <MenuItem key={label} index={i}>
                    {comingSoon ? (
                      <span aria-disabled="true" className="flex items-baseline gap-3 text-[clamp(26px,2.2vw,32px)] leading-tight uppercase text-charcoal/35 cursor-default">
                        {label}
                        <span className="text-[10px] tracking-[0.2em] font-medium text-charcoal/60">Coming soon</span>
                      </span>
                    ) : (
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="block text-[clamp(26px,2.2vw,32px)] leading-tight uppercase text-charcoal no-underline hover:text-gold transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </ul>

              <MenuItem as="div" index={MAIN_LINKS.length} className="h-px bg-charcoal/10 my-7" />

              <ul className="list-none space-y-3.5">
                {INFO_LINKS.map(({ label, href }, i) => (
                  <MenuItem key={label} index={MAIN_LINKS.length + 1 + i * 0.5}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="inline-block text-[13px] tracking-[0.06em] uppercase font-medium text-charcoal no-underline hover:text-gold transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </MenuItem>
                ))}
              </ul>
            </div>

            {/* Social icons, spread evenly across the panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex-shrink-0 flex items-center justify-between border-t border-charcoal/10 px-6 md:px-8 py-4"
            >
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  {...placeholderOr(href)}
                  aria-label={label}
                  className="text-charcoal hover:text-gold transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">{icon}</svg>
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// A real link when there's a destination; otherwise a placeholder that stays put when clicked
const placeholderOr = (href) => (href ? { href } : { href: '#', onClick: (e) => e.preventDefault() })

// One line of the menu, sliding in from the left in turn
function MenuItem({ index, as = 'li', className, children }) {
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ delay: 0.25 + index * 0.06, duration: 0.6, ease: EASE }}
    >
      {children}
    </Tag>
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
