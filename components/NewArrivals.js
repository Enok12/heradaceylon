'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { SectionLabel, SectionHeading } from './ui'

function ArrivalCard({ product, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const { addItem } = useCart()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex-shrink-0 w-[240px] md:w-[260px] scroll-snap-item cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block no-underline">
        <div className="relative w-full h-[320px] overflow-hidden bg-sand mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.43,0.13,0.23,0.96)] group-hover:scale-[1.05]"
            sizes="260px"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              sizes="260px"
            />
          )}
          {product.badge && (
            <span className="absolute top-3 left-3 text-[8px] tracking-[0.18em] uppercase bg-cream text-charcoal px-2.5 py-1 font-light z-10">
              {product.badge}
            </span>
          )}
          <button
            onClick={e => { e.preventDefault(); addItem(product, product.sizes[0]) }}
            className="absolute bottom-3 left-3 text-[8px] tracking-[0.18em] uppercase bg-charcoal text-cream px-3 py-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-light z-10 hover:bg-espresso"
          >
            Add to Bag
          </button>
        </div>
        <p className="text-[9px] tracking-[0.16em] uppercase text-muted font-light mb-1">{product.subcategory}</p>
        <h3 className="font-serif text-[17px] font-light text-charcoal leading-snug mb-1">{product.name}</h3>
        <p className="text-[12px] tracking-[0.06em] text-charcoal font-light">USD {product.price}</p>
      </Link>
    </motion.div>
  )
}

export default function NewArrivals({ products }) {
  const trackRef = useRef(null)
  const newProducts = products.filter(p => p.newArrival)

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="bg-linen py-24 overflow-hidden">
      <div className="px-8 md:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Just In</SectionLabel>
            <SectionHeading className="text-[clamp(32px,4vw,50px)]">
              New <em className="italic">Arrivals</em>
            </SectionHeading>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/collections?filter=new" className="hidden md:flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-charcoal no-underline font-light hover:gap-4 transition-all duration-400 group">
              See All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <div className="flex gap-2">
              {['←', '→'].map((arrow, i) => (
                <button
                  key={arrow}
                  onClick={() => scroll(i === 0 ? -1 : 1)}
                  className="w-10 h-10 border border-warm flex items-center justify-center text-charcoal text-sm hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-300"
                  aria-label={i === 0 ? 'Previous' : 'Next'}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-snap-x pl-8 md:pl-16 pr-8 md:pr-16 pb-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CDB99E #F0EAE0' }}
      >
        {newProducts.map((product, i) => (
          <ArrivalCard key={product.id} product={product} delay={i * 0.07} />
        ))}
      </div>
    </section>
  )
}
