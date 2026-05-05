'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

export default function EditorialBanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section ref={ref} className="relative h-[500px] md:h-[580px] overflow-hidden flex items-center justify-center text-center">
      <div className="absolute inset-0 group">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85"
          alt="The Heritage Edit"
          fill
          className="object-cover brightness-50 transition-transform duration-[12000ms] ease-linear group-hover:scale-[1.03]"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 px-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[9px] tracking-[0.3em] uppercase text-gold-light font-light mb-5">
            The Heritage Edit · 2025
          </p>
          <h2 className="font-serif text-[clamp(44px,6vw,80px)] font-light text-cream leading-[1] mb-7">
            Wear the <em className="italic">Stories</em><br />of Ceylon
          </h2>
          <p className="text-[11px] tracking-[0.08em] text-cream/55 max-w-md mx-auto mb-10 leading-loose font-light">
            Each thread is a conversation with the land. An heirloom, not just a garment.
            Explore our editorial on craft, identity, and slow fashion.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-4 text-[10px] tracking-[0.22em] uppercase text-cream border border-cream/40 px-9 py-4 hover:border-cream/90 hover:bg-cream/10 transition-all duration-500 group no-underline font-light"
          >
            Read the Story
            <span className="relative inline-block w-5 h-px bg-current transition-all duration-400 group-hover:w-8">
              <span className="absolute -right-px -top-[3px] w-[5px] h-[5px] border-r border-t border-current rotate-45" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
