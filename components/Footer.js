'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

const SHOP = ['New Arrivals', 'Sarees', 'Handloom', 'Contemporary', 'Accessories', 'Gift Cards']
const INFO  = ['Our Story', 'Artisans', 'Sustainability', 'Editorial', 'Press', 'Stockists']
const CARE  = ['Shipping & Returns', 'Size Guide', 'Care Instructions', 'Custom Orders', 'Contact Us', 'FAQ']
// Footer labels that have a page; the rest are still placeholders
const PAGES = {
  'Our Story': '/about',
  'Shipping & Returns': '/shipping',
  'Contact Us': '/contact',
  'FAQ': '/faqs',
  'Privacy Policy': '/privacy',
  'Terms of Service': '/terms',
}

const EASE = [0.16, 1, 0.3, 1]

// Silk band between the links and the copyright line: the HERADA wordmark sits in the
// fabric as in the artwork. The silk drifts slower than the page (parallax) and the
// wordmark rises out of a blur as the band comes into view.
function SilkBand() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const silkY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-10%', '0%'])
  // Watch the whole strip, not the wordmark: on phones the strip is short, and the
  // wordmark's starting offset leaves too little of it showing to trigger by itself
  const bandIn = useInView(ref, { once: true, amount: 0.4 })
  const wordY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '0%'])

  return (
    // A slim strip, about as tall as the wordmark, which runs the full width of the
    // footer's content like the reference
    <div ref={ref} className="relative overflow-hidden px-8 md:px-16 pt-[5vw] pb-[1.6vw]">
      <motion.div style={{ y: silkY }} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
        >
          <Image src="/images/footer/footer-silk-plain.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_62%]" />
        </motion.div>
      </motion.div>

      {/* Soft white fade over the top edge, so the strip melts into the footer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-white via-white/60 to-transparent" />

      <motion.div style={{ y: wordY }} className="relative w-full aspect-[2400/386]">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={bandIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{ duration: reduce ? 0 : 1.8, ease: EASE, delay: reduce ? 0 : 0.2 }}
          onUpdate={() => {}}
        >
          <Image src="/images/footer/footer-wordmark.png" alt="Herada" fill sizes="100vw" className="object-contain drop-shadow-[0_2px_10px_rgba(40,50,90,0.25)]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  const handleSub = (e) => {
    e.preventDefault()
    if (email.includes('@')) { setSubbed(true); setEmail('') }
  }

  return (
    <footer className="bg-white text-charcoal/80 border-t border-charcoal/10">
      {/* Newsletter Strip */}
      <div className="border-b border-charcoal/10 px-8 md:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="text-[12px] tracking-[0.26em] uppercase text-gold mb-3 font-medium">Private Access</p>
          <h3 className="font-serif text-[36px] md:text-[40px] font-normal leading-tight text-charcoal">
            Join the <em className="italic text-gold">Inner Circle</em>
          </h3>
        </div>
        {subbed ? (
          <p className="text-[13px] tracking-[0.14em] uppercase text-gold font-medium">
            ✓ Welcome to the inner circle
          </p>
        ) : (
          <form onSubmit={handleSub} className="flex w-full max-w-sm border border-charcoal/25">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-transparent text-[14px] tracking-[0.04em] text-charcoal placeholder:text-charcoal/45 outline-none font-normal"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-charcoal text-white text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Main Grid */}
      <div className="px-8 md:px-16 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 md:pb-6">
          {/* Brand, then each link column, fade up in turn */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE, delay: 0 }}>
            <span className="block font-serif text-[26px] font-normal text-charcoal tracking-[0.2em] uppercase mb-4">
              Herada Ceylon
            </span>
            <p className="text-[14px] leading-relaxed text-charcoal/65 font-normal tracking-[0.02em] mb-7 max-w-[280px]">
              Luxury fashion born from Sri Lanka's rich textile heritage. Handwoven by artisan families across the island.
            </p>
            <div className="flex gap-3">
              {['In', 'Fb', 'Pt', 'X'].map(s => (
                <a key={s} href="#" className="w-10 h-10 border border-charcoal/20 flex items-center justify-center text-[13px] text-charcoal/70 hover:border-gold hover:text-gold transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {[['Shop', SHOP], ['Information', INFO], ['Customer Care', CARE]].map(([heading, links], i) => (
            <motion.div key={heading} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.1 }}>
              <h4 className="text-[12px] tracking-[0.22em] uppercase text-charcoal font-semibold mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l}>
                    <Link href={PAGES[l] ?? '#'} className="text-[14px] text-charcoal/70 font-normal tracking-[0.02em] hover:text-charcoal transition-colors duration-300 no-underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>

      <SilkBand />

      <div className="px-8 md:px-16 py-8">
        {/* Bottom Bar: credit on the left, the slogan centred, policies on the right. The two
            outer columns share the spare width equally, so the slogan sits on the page's centre. */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] items-start lg:items-center gap-4 lg:gap-8">
          <p className="text-[13px] tracking-[0.06em] text-charcoal/60 font-normal leading-relaxed">
            © HERADA CEYLON. All rights reserved. <span className="whitespace-nowrap">E-commerce</span> Solution by{' '}
            <a
              href="https://www.enokdilshan.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal underline underline-offset-4 decoration-charcoal/30 hover:decoration-charcoal transition-colors duration-300"
            >
              Enok Dilshan
            </a>
          </p>
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.12em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.32em' }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="text-[13px] uppercase font-semibold text-charcoal whitespace-nowrap lg:text-center"
          >
            Wear to Dominate
          </motion.p>
          <div className="flex gap-6 lg:justify-self-end">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(l => (
              <Link key={l} href={PAGES[l] ?? '#'} className="text-[13px] text-charcoal/60 hover:text-charcoal transition-colors duration-300 no-underline font-normal tracking-[0.06em]">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
