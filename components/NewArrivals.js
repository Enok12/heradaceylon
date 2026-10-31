'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { SectionLabel, SectionHeading } from './ui'

const AUTOPLAY_MS = 4500
const GAP = 24
const EASE = [0.16, 1, 0.3, 1]

function ArrivalCard({ product, active }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product, product.sizes[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      draggable={false}
      className={`group block no-underline transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-sand mb-5">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          draggable={false}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.43,0.13,0.23,0.96)] group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 45vw, 25vw"
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            draggable={false}
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            sizes="(max-width: 768px) 80vw, (max-width: 1280px) 45vw, 25vw"
          />
        )}
        {product.badge && (
          <span className="absolute top-4 left-4 text-[9px] tracking-[0.18em] uppercase bg-cream text-charcoal px-3 py-1 font-medium z-10">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-4 left-4 right-4 py-3 text-[10px] tracking-[0.2em] uppercase bg-charcoal text-cream font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-espresso z-10"
        >
          {added ? '✓ Added' : 'Add to Bag'}
        </button>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.18em] uppercase text-muted font-normal mb-1">{product.subcategory}</p>
          <h3 className="font-serif text-[22px] font-medium text-charcoal leading-snug">{product.name}</h3>
        </div>
        <p className="text-[13px] tracking-[0.06em] text-charcoal font-medium whitespace-nowrap pt-5">
          USD {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}

export default function NewArrivals({ products }) {
  const newProducts = products.filter(p => p.newArrival).slice(0, 10)
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const dragged = useRef(false)
  const inView = useInView(sectionRef, { once: true, margin: '0px 0px -80px 0px' })

  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(4)
  const [cardWidth, setCardWidth] = useState(0)
  const [paused, setPaused] = useState(false)

  // Cards visible per breakpoint; card width derived from the viewport
  useEffect(() => {
    const measure = () => {
      const w = viewportRef.current?.offsetWidth || 0
      const pv = window.innerWidth < 768 ? 1.25 : window.innerWidth < 1280 ? 2.2 : 3.4
      setPerView(pv)
      setCardWidth((w - GAP * (Math.ceil(pv) - 1)) / pv)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const maxIndex = Math.max(0, newProducts.length - Math.floor(perView))
  const clampedIndex = Math.min(index, maxIndex)

  const go = useCallback((i) => setIndex(Math.max(0, Math.min(i, maxIndex))), [maxIndex])
  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex])
  const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex])

  useEffect(() => {
    if (paused || !inView) return
    const t = setTimeout(next, AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [clampedIndex, paused, inView, next])

  if (!newProducts.length) return null

  return (
    <section ref={sectionRef} className="bg-white py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
        className="px-8 md:px-16"
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Just In</SectionLabel>
            <SectionHeading className="text-[clamp(36px,4.5vw,56px)] !font-normal">
              New <em className="italic">Arrivals</em>
            </SectionHeading>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/collections?filter=new" className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-charcoal no-underline font-medium hover:gap-4 transition-all duration-300 group">
              See All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous products"
                className="w-11 h-11 border border-charcoal/30 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300"
              >
                ←
              </button>
              <button
                onClick={next}
                aria-label="Next products"
                className="w-11 h-11 border border-charcoal/30 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={viewportRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{ gap: GAP }}
            animate={{ x: -clampedIndex * (cardWidth + GAP) }}
            transition={{ duration: 0.8, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onClickCapture={(e) => {
              // Swallow the click that ends a drag so it doesn't open a product
              if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false }
            }}
            onDragStart={() => { dragged.current = true }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -60 || velocity.x < -400) go(clampedIndex + 1)
              else if (offset.x > 60 || velocity.x > 400) go(clampedIndex - 1)
            }}
          >
            {newProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0"
                style={{ width: cardWidth || undefined }}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: EASE }}
              >
                <ArrivalCard
                  product={product}
                  active={i >= clampedIndex && i < clampedIndex + Math.ceil(perView - 0.3)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-6 mt-12">
          <span className="text-[11px] tracking-[0.16em] text-charcoal font-medium tabular-nums">
            {String(clampedIndex + 1).padStart(2, '0')}
            <span className="text-muted"> / {String(maxIndex + 1).padStart(2, '0')}</span>
          </span>
          <div className="relative flex-1 h-[2px] bg-charcoal/10">
            <motion.span
              className="absolute inset-y-0 left-0 bg-charcoal"
              animate={{ width: `${((clampedIndex + 1) / (maxIndex + 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
