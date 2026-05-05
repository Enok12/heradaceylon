'use client'
import { useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import ProductGallery from '@/components/ProductGallery'
import Accordion from '@/components/Accordion'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import products from '@/data/products.json'

export default function ProductPage({ params }) {
  const product = products.find(p => p.slug === params.id)
  if (!product) notFound()

  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [added, setAdded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const addBtnRef = useRef(null)
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const relatedTrack = useRef(null)
  const infoRef = useRef(null)
  const inView = useInView(infoRef, { once: true })

  useEffect(() => {
    const onScroll = () => {
      const btn = addBtnRef.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        setShowStickyBar(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAdd = () => {
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const accordionItems = [
    { title: 'Description', content: product.description },
    { title: 'Fabric & Care', content: product.fabric },
    { title: 'Shipping & Returns', content: product.shipping },
  ]

  return (
    <div className="bg-cream pt-[72px]">
      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand px-8 md:px-16 py-3 flex items-center justify-between"
          >
            <div>
              <span className="font-serif text-[17px] font-light text-charcoal">{product.name}</span>
              <span className="ml-4 text-[12px] text-muted font-light">USD {product.price}</span>
            </div>
            <button
              onClick={handleAdd}
              className="px-8 py-2.5 bg-charcoal text-cream text-[9px] tracking-[0.22em] uppercase font-light hover:bg-espresso transition-all duration-300"
            >
              Add to Bag — {selectedSize}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="px-8 md:px-16 py-5 flex items-center gap-3 text-[9px] tracking-[0.16em] uppercase text-muted font-light">
        <Link href="/" className="hover:text-charcoal transition-colors duration-200 no-underline">Home</Link>
        <span className="opacity-30">/</span>
        <Link href="/collections" className="hover:text-charcoal transition-colors duration-200 no-underline">Collections</Link>
        <span className="opacity-30">/</span>
        <span className="text-charcoal">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="px-8 md:px-16 pb-20 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Product Info — sticky */}
        <motion.div
          ref={infoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="md:sticky md:top-[92px] md:self-start py-2"
        >
          {/* Category + Badge */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[9px] tracking-[0.2em] uppercase text-muted font-light">{product.subcategory}</p>
            {product.badge && (
              <span className="text-[8px] tracking-[0.18em] uppercase bg-charcoal text-cream px-2.5 py-1 font-light">
                {product.badge}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="font-serif text-[clamp(36px,4vw,52px)] font-light text-charcoal leading-[1.05] mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-[18px] tracking-[0.06em] text-charcoal font-light mb-8">
            USD {product.price.toLocaleString()}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {product.tags.map(tag => (
              <span key={tag} className="text-[8px] tracking-[0.16em] uppercase text-muted font-light border border-sand px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[9px] tracking-[0.2em] uppercase text-charcoal font-light">Size</p>
              <button className="text-[9px] tracking-[0.14em] uppercase text-muted border-b border-muted font-light hover:text-gold hover:border-gold transition-colors duration-300">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-10 px-3 text-[10px] tracking-[0.14em] uppercase font-light border transition-all duration-300 ${
                    selectedSize === size
                      ? 'border-charcoal bg-charcoal text-cream'
                      : 'border-sand text-charcoal hover:border-charcoal'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div ref={addBtnRef} className="space-y-3 mb-10">
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 text-[10px] tracking-[0.24em] uppercase font-light transition-all duration-500 ${
                added
                  ? 'bg-gold text-cream border border-gold'
                  : 'bg-charcoal text-cream hover:bg-espresso'
              }`}
            >
              {added ? '✓ Added to Bag' : `Add to Bag — USD ${product.price.toLocaleString()}`}
            </motion.button>
            <button className="w-full py-4 text-[10px] tracking-[0.24em] uppercase font-light border border-warm text-charcoal hover:border-charcoal transition-all duration-300">
              Save to Wishlist
            </button>
          </div>

          {/* Badges row */}
          <div className="flex gap-5 mb-10 pb-10 border-b border-sand">
            {['Handwoven', 'Free Shipping +300', 'Easy Returns'].map(b => (
              <div key={b} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span className="text-[8px] tracking-[0.14em] uppercase text-muted font-light whitespace-nowrap">{b}</span>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <Accordion items={accordionItems} />
        </motion.div>
      </div>

      {/* You May Also Like */}
      {related.length > 0 && (
        <div className="border-t border-sand py-20 bg-linen">
          <div className="px-8 md:px-16 mb-12">
            <p className="text-[9px] tracking-[0.28ex] uppercase text-gold font-light mb-3 flex items-center gap-3">
              <span className="w-5 h-px bg-gold" />Continue
            </p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-light text-charcoal">
              You May Also <em className="italic">Like</em>
            </h2>
          </div>

          {/* Horizontal scroll */}
          <div
            ref={relatedTrack}
            className="flex gap-5 overflow-x-auto pl-8 md:pl-16 pr-8 scroll-snap-x pb-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#CDB99E #F0EAE0' }}
          >
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[240px] md:w-[280px] scroll-snap-item"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
