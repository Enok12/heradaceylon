'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

const SHOP = ['New Arrivals', 'Sarees', 'Handloom', 'Contemporary', 'Accessories', 'Gift Cards']
const INFO  = ['Our Story', 'Artisans', 'Sustainability', 'Editorial', 'Press', 'Stockists']
const CARE  = ['Shipping & Returns', 'Size Guide', 'Care Instructions', 'Custom Orders', 'Contact Us', 'FAQ']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  const handleSub = (e) => {
    e.preventDefault()
    if (email.includes('@')) { setSubbed(true); setEmail('') }
  }

  return (
    <footer className="bg-espresso text-cream/70">
      {/* Newsletter Strip */}
      <div className="border-b border-cream/10 px-8 md:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="text-[9px] tracking-[0.28em] uppercase text-gold mb-3 font-light">Private Access</p>
          <h3 className="font-serif text-[32px] font-light leading-tight text-cream">
            Join the <em className="italic text-gold-light">Inner Circle</em>
          </h3>
        </div>
        {subbed ? (
          <p className="text-[11px] tracking-[0.14em] uppercase text-gold font-light">
            ✓ Welcome to the inner circle
          </p>
        ) : (
          <form onSubmit={handleSub} className="flex w-full max-w-sm border border-warm/50">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-transparent text-[11px] tracking-[0.06em] text-cream placeholder:text-cream/30 outline-none font-light"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gold text-espresso text-[9px] tracking-[0.22em] uppercase font-light hover:bg-gold-light transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Main Grid */}
      <div className="px-8 md:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-14 border-b border-cream/10 mb-10">
          {/* Brand */}
          <div>
            <span className="block font-serif text-[22px] font-light text-cream tracking-[0.2em] uppercase mb-4">
              Herada Ceylon
            </span>
            <p className="text-[11px] leading-relaxed text-cream/40 font-light tracking-[0.04em] mb-7 max-w-[200px]">
              Luxury fashion born from Sri Lanka's rich textile heritage. Handwoven by artisan families across the island.
            </p>
            <div className="flex gap-3">
              {['In', 'Fb', 'Pt', 'X'].map(s => (
                <a key={s} href="#" className="w-8 h-8 border border-cream/20 flex items-center justify-center text-[10px] text-cream/40 hover:border-gold hover:text-gold transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[['Shop', SHOP], ['Information', INFO], ['Customer Care', CARE]].map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[9px] tracking-[0.24em] uppercase text-cream/30 font-light mb-5">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-[11px] text-cream/50 font-light tracking-[0.04em] hover:text-cream transition-colors duration-300 no-underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <span className="text-[10px] tracking-[0.1em] text-cream/20 font-light">
            © 2025 Herada Ceylon. All rights reserved. Colombo, Sri Lanka.
          </span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(l => (
              <Link key={l} href="#" className="text-[10px] text-cream/20 hover:text-cream/50 transition-colors duration-300 no-underline font-light tracking-[0.06em]">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
