'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { num: '47', label: 'Artisan Families' },
  { num: '7', label: 'Years of Craft' },
  { num: '100%', label: 'Handwoven' },
]

export default function BrandStory() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <section ref={ref} className="bg-charcoal grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
      {/* Image */}
      <div className="relative overflow-hidden min-h-[360px] md:min-h-0">
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80"
          alt="Sri Lankan weavers"
          fill
          className="object-cover opacity-70"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent md:hidden" />
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-20"
      >
        <p className="flex items-center gap-3 text-[9px] tracking-[0.28em] uppercase text-gold font-normal mb-6">
          <span className="w-5 h-px bg-gold" />
          Our Heritage
        </p>
        <h2 className="font-serif text-[clamp(36px,4vw,58px)] font-normal text-cream leading-[1.05] mb-7">
          Born from the<br />
          <em className="italic text-gold-light">Island's</em><br />
          Memory
        </h2>
        <p className="text-[12px] leading-loose text-cream/55 font-normal mb-10 max-w-md tracking-[0.02em]">
          Herada Ceylon is rooted in the ancient textile traditions of Sri Lanka — handloom weaving
          techniques passed down through generations of artisan families. We collaborate directly
          with master weavers across the Kandy, Galle, and Jaffna districts, honouring their craft
          while shaping its future.
        </p>
        <Link
          href="#story"
          className="inline-flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-cream border border-cream/25 px-7 py-3.5 hover:border-cream/70 hover:bg-cream/5 transition-all duration-500 no-underline font-normal self-start mb-14 group"
        >
          Discover Our Story
          <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm">→</span>
        </Link>

        {/* Stats */}
        <div className="flex gap-10 pt-10 border-t border-cream/10">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <p className="font-serif text-[36px] font-normal text-gold-light leading-none mb-2">{num}</p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-cream/35 font-normal">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
