'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { SectionLabel, SectionHeading } from './ui'

function FeaturedCard({ product, large = false, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const { addItem } = useCart()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden bg-sand cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className={`relative overflow-hidden ${large ? 'h-[680px]' : 'h-[338px]'}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.43,0.13,0.23,0.96)] group-hover:scale-[1.05]"
            sizes={large ? '45vw' : '30vw'}
          />
          {/* Hover image */}
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              sizes={large ? '45vw' : '30vw'}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-transparent" />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-5 left-5 text-[8px] tracking-[0.2em] uppercase bg-charcoal text-cream px-3 py-1 z-10 font-normal">
              {product.badge}
            </span>
          )}

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <p className="text-[9px] tracking-[0.2em] uppercase text-cream/60 mb-1.5 font-normal">{product.subcategory}</p>
            <h3 className="font-serif text-[22px] font-normal text-cream leading-tight mb-1">{product.name}</h3>
            <p className="text-[12px] tracking-[0.08em] text-cream/75 font-normal">USD {product.price}</p>
          </div>
        </div>
      </Link>

      {/* Quick add */}
      <button
        onClick={() => addItem(product, product.sizes[0])}
        className="absolute bottom-6 right-6 text-[8px] tracking-[0.2em] uppercase bg-cream text-charcoal px-4 py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-charcoal hover:text-cream z-10 font-normal"
      >
        Add
      </button>
    </motion.div>
  )
}

export default function FeaturedCollection({ products }) {
  const featured = products.filter(p => p.featured).slice(0, 3)
  const [main, ...rest] = featured

  return (
    <section className="bg-mist px-8 md:px-16 py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-14">
        <div>
          <SectionLabel>Featured</SectionLabel>
          <SectionHeading className="text-[clamp(34px,4vw,52px)]">
            The <em className="italic">Monsoon</em><br />Collection
          </SectionHeading>
          <p className="flex items-center gap-2 text-[9px] tracking-[0.14em] uppercase text-muted font-normal mt-2">
            <span className="w-4 h-px bg-warm inline-block" />
            {products.filter(p => p.featured).length + 9} Pieces
          </p>
        </div>
        <Link
          href="/collections"
          className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-charcoal font-normal no-underline hover:gap-5 transition-all duration-500 group"
        >
          View All
          <span className="text-base group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
        {/* Large card */}
        {main && (
          <div className="md:row-span-2">
            <FeaturedCard product={main} large delay={0} />
          </div>
        )}
        {/* Two smaller cards */}
        {rest.map((p, i) => (
          <FeaturedCard key={p.id} product={p} delay={0.1 + i * 0.1} />
        ))}
      </div>
    </section>
  )
}
