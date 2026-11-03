'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { cardReveal } from '@/lib/animations'

export default function ProductCard({ product, priority = false }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    setAdding(true)
    addItem(product, product.sizes[0] || 'M')
    setTimeout(() => setAdding(false), 1200)
  }

  return (
    <motion.div
      variants={cardReveal}
      whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }}
      className="group cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block no-underline">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-sand aspect-[3/4] mb-4">
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover img-swap-primary transition-transform duration-[900ms] ease-[cubic-bezier(0.43,0.13,0.23,0.96)] group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Hover Image */}
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={`${product.name} alternate`}
              fill
              className="object-cover img-swap-secondary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 text-[8px] tracking-[0.2em] uppercase bg-charcoal text-cream px-3 py-1 font-normal z-10">
              {product.badge}
            </span>
          )}

          {/* Quick Add */}
          <motion.button
            onClick={handleAdd}
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 py-3 bg-cream/95 text-charcoal text-[9px] tracking-[0.22em] uppercase font-normal
                       opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                       hover:bg-charcoal hover:text-cream border border-transparent hover:border-charcoal"
          >
            {adding ? '✓ Added' : 'Quick Add'}
          </motion.button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.18em] uppercase text-muted font-normal">
            {product.subcategory}
          </p>
          <h3 className="font-serif text-[18px] font-normal text-charcoal leading-snug">
            {product.name}
          </h3>
          <p className="text-[12px] tracking-[0.08em] text-charcoal font-normal">
            USD {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
