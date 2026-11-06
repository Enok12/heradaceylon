'use client'
import { useState, useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useNavScroll } from '@/hooks/useNavScroll'
import ProductGallery from '@/components/ProductGallery'
import Accordion from '@/components/Accordion'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import products from '@/data/products.json'

export default function ProductPage({ params }) {
  const product = products.find(p => p.slug === params.id)
  if (!product) notFound()

  const { addItem } = useCart()

  // Optional per-size stock ({ S: 0, M: 1, ... }): 0 = sold out; a size missing from the
  // map (or no map at all) is treated as available with no count shown
  const stockFor = (size) => product.stock?.[size]
  const isSoldOut = (size) => stockFor(size) === 0
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find(s => !isSoldOut(s)) ?? product.sizes[0]
  )
  const [selectedColor, setSelectedColor] = useState(0)
  const [qty, setQty] = useState(1)
  const sizeStock = stockFor(selectedSize)
  const maxQty = sizeStock ?? 10
  const lowStock = sizeStock > 0 && sizeStock <= 3
  const [added, setAdded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const { hidden: navHidden } = useNavScroll()
  const addBtnRef = useRef(null)
  // Same category first, topped up from other categories so the row is always full (4 on desktop)
  const others = products.filter(p => p.id !== product.id)
  const related = [
    ...others.filter(p => p.category === product.category),
    ...others.filter(p => p.category !== product.category),
  ].slice(0, 4)
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

  const selectSize = (size) => {
    setSelectedSize(size)
    setQty(1)
  }

  const handleAdd = () => {
    if (isSoldOut(selectedSize)) return
    addItem(product, selectedSize, qty)
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
            // Slides up into the navbar's space while the navbar is hidden
            className={`fixed left-0 right-0 z-40 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] border-b border-sand transition-[top] duration-200 ${navHidden ? 'top-0' : 'top-[72px]'}`}
          >
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-16 py-3">
              <div className="relative w-[52px] h-[64px] md:w-[64px] md:h-[80px] flex-shrink-0 rounded-md overflow-hidden bg-sand">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] md:text-[14px] tracking-[0.08em] uppercase font-medium text-charcoal truncate">
                  {product.name}
                </p>
                <p className="text-[11px] md:text-[12px] tracking-[0.08em] uppercase text-muted mt-0.5">
                  <span className="hidden sm:inline">{product.subcategory} / </span>Size {selectedSize}
                </p>
                <p className="text-[12px] md:text-[13px] tracking-[0.06em] font-medium text-charcoal mt-0.5">
                  USD {product.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-shrink-0 px-5 md:px-10 py-3 md:py-3.5 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium border transition-all duration-300 ${
                  added
                    ? 'bg-gold border-gold text-white'
                    : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                }`}
              >
                {added ? '✓ Added' : 'Add to Bag'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="px-8 md:px-16 py-5 flex items-center gap-3 text-[9px] tracking-[0.16em] uppercase text-muted font-normal">
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
          // Stays pinned while the stacked gallery scrolls past; capped to the viewport so
          // a long info column (open accordion) scrolls inside itself instead of the page
          className="md:sticky md:top-[96px] md:self-start md:max-h-[calc(100vh-112px)] md:overflow-y-auto no-scrollbar py-2"
        >
          {/* Name */}
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-[clamp(28px,3vw,36px)] font-normal text-charcoal leading-tight tracking-[0.01em]">
              {product.name}
            </h1>
            {product.badge && (
              <span className="mt-2.5 text-[10px] tracking-[0.16em] uppercase bg-charcoal text-white px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                {product.badge}
              </span>
            )}
          </div>

          {/* SKU */}
          <p className="text-[13px] tracking-[0.06em] text-charcoal font-medium uppercase mb-6">
            {product.sku ?? product.id}
          </p>

          {/* Price */}
          <p className="text-[32px] font-semibold text-charcoal tracking-[0.01em] mb-8">
            USD {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>

          {/* Color */}
          {product.colors?.length > 0 && (
            <div className="mb-7">
              <p className="text-[13px] tracking-[0.12em] uppercase text-charcoal font-normal mb-3">
                Select Color : <span className="font-medium">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    aria-label={color.name}
                    title={color.name}
                    className={`relative w-9 h-9 rounded-full overflow-hidden transition-all duration-200 ${
                      selectedColor === i ? 'ring-1 ring-charcoal ring-offset-2' : 'ring-1 ring-sand hover:ring-charcoal/50'
                    }`}
                    style={color.hex ? { backgroundColor: color.hex } : undefined}
                  >
                    {color.image && <Image src={color.image} alt="" fill className="object-cover" sizes="36px" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="mb-7">
            <p className="text-[13px] tracking-[0.12em] uppercase text-charcoal font-normal mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => {
                const soldOut = isSoldOut(size)
                return (
                  <button
                    key={size}
                    onClick={() => !soldOut && selectSize(size)}
                    disabled={soldOut}
                    aria-label={soldOut ? `${size} (sold out)` : size}
                    className={`relative min-w-[88px] h-11 px-4 rounded-lg overflow-hidden text-[15px] uppercase border transition-all duration-200 ${
                      soldOut
                        ? 'border-sand text-charcoal/30 cursor-not-allowed'
                        : selectedSize === size
                          ? 'border-charcoal bg-charcoal text-white font-medium'
                          : 'border-charcoal/30 text-charcoal hover:border-charcoal'
                    }`}
                  >
                    {size}
                    {soldOut && (
                      // Diagonal strike for sold-out sizes
                      <span className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),rgba(26,26,26,0.25)_50%,transparent_calc(50%+0.5px))]" />
                    )}
                  </button>
                )
              })}
            </div>
            <button className="mt-4 text-[13px] text-charcoal font-medium underline underline-offset-4 hover:text-gold transition-colors duration-200">
              Size Chart
            </button>
          </div>

          {/* Quantity */}
          <div className="mb-7">
            <p className="text-[13px] tracking-[0.12em] uppercase text-charcoal font-normal mb-3">Quantity</p>
            <div className="inline-flex items-center h-11 rounded-full border border-charcoal/30">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="w-12 h-full flex items-center justify-center text-[20px] text-charcoal disabled:text-charcoal/30"
              >
                −
              </button>
              <span className="w-8 text-center text-[15px] text-charcoal font-medium tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty}
                aria-label="Increase quantity"
                className="w-12 h-full flex items-center justify-center text-[20px] text-charcoal disabled:text-charcoal/30"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div ref={addBtnRef} className="space-y-3 mb-10">
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.98 }}
              className={`w-full h-14 rounded-full text-[15px] tracking-[0.04em] uppercase font-medium transition-all duration-300 ${
                added ? 'bg-gold text-white' : 'bg-black text-white hover:bg-espresso'
              }`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </motion.button>

            {lowStock && (
              <div className="pt-1">
                <p className="flex items-center gap-2 text-[15px] text-[#E5432F] font-medium">
                  <span className="inline-flex items-center justify-center w-5 h-5 rotate-45 rounded-[4px] bg-[#E5432F]">
                    <span className="-rotate-45 text-white text-[12px] font-bold leading-none">!</span>
                  </span>
                  Only {sizeStock} {sizeStock === 1 ? 'item' : 'items'} left in stock!
                </p>
                <p className="mt-2 text-[14px] text-charcoal font-medium">
                  Going Fast – Secure Yours Before It&rsquo;s Gone!
                </p>
              </div>
            )}

            <button className="w-full h-12 rounded-full text-[13px] tracking-[0.08em] uppercase font-medium border border-charcoal/30 text-charcoal hover:border-charcoal transition-all duration-300">
              Save to Wishlist
            </button>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-10 pb-10 border-b border-sand">
            {['Handwoven', 'Free Shipping +300', 'Easy Returns'].map(b => (
              <div key={b} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span className="text-[11px] tracking-[0.12em] uppercase text-charcoal/70 font-medium whitespace-nowrap">{b}</span>
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
            <p className="text-[9px] tracking-[0.28ex] uppercase text-gold font-normal mb-3 flex items-center gap-3">
              <span className="w-5 h-px bg-gold" />Continue
            </p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-normal text-charcoal">
              You May Also <em className="italic">Like</em>
            </h2>
          </div>

          {/* Same near-full-width grid as the collections page */}
          <div className="px-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1.5 gap-y-8">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} infoClassName="px-3 md:px-4" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
