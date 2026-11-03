'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CATS = [
  {
    label: 'Category',
    title: 'Handloom\nSarees',
    href: '/collections?category=sarees',
    cta: 'Explore Sarees',
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85',
  },
  {
    label: 'Category',
    title: 'Contemporary\nWear',
    href: '/collections?category=contemporary',
    cta: 'Explore Wear',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85',
  },
]

export default function CategoryBlocks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section ref={ref} className="bg-cream grid grid-cols-1 md:grid-cols-2 gap-0.5">
      {CATS.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden h-[480px] md:h-[560px] cursor-pointer"
        >
          <Image
            src={cat.img}
            alt={cat.title}
            fill
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.43,0.13,0.23,0.96)] group-hover:scale-[1.04]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-espresso/10 to-espresso/50 group-hover:to-espresso/65 transition-all duration-700" />

          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12">
            <p className="text-[9px] tracking-[0.28em] uppercase text-cream/55 font-normal mb-3">{cat.label}</p>
            <h3 className="font-serif text-[38px] md:text-[48px] font-normal text-cream leading-[1] mb-6 whitespace-pre-line">
              {cat.title}
            </h3>
            <Link
              href={cat.href}
              className="inline-flex items-center gap-3 text-[9px] tracking-[0.22em] uppercase text-cream/75 no-underline font-normal opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-cream"
            >
              {cat.cta}
              <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
