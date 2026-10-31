'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=85',
    eyebrow: 'New Collection 2025',
    title: ['Woven from', "Ceylon's", 'Soul'],
    copy: 'Heritage textiles, reimagined for the modern woman. Handcrafted in Sri Lanka.',
    href: '/collections',
    cta: 'Discover Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1800&q=85',
    eyebrow: 'The Saree Edit',
    title: ['Draped in', 'Timeless', 'Grace'],
    copy: 'Handloom sarees woven by artisans across the island, thread by thread.',
    href: '/collections?category=sarees',
    cta: 'Shop Sarees',
  },
  {
    image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1800&q=85',
    eyebrow: 'Contemporary',
    title: ['Heritage,', 'Made', 'Modern'],
    copy: 'Clean silhouettes cut from traditional cloth for everyday elegance.',
    href: '/collections?category=contemporary',
    cta: 'Explore Contemporary',
  },
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800&q=85',
    eyebrow: 'Just Arrived',
    title: ['Colours of', 'the', 'Island'],
    copy: 'Fresh pieces inspired by monsoon skies, spice markets and tea country.',
    href: '/collections?filter=new',
    cta: 'View New Arrivals',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=85',
    eyebrow: 'Our Story',
    title: ['Crafted', 'with', 'Intention'],
    copy: 'Slow fashion rooted in community, craft and the hands that make it.',
    href: '#story',
    cta: 'Read Our Story',
  },
]

const AUTOPLAY_MS = 6500
const EASE = [0.16, 1, 0.3, 1]

// Image: incoming slides in from the travel side while fading and settling from a zoom;
// outgoing drifts the opposite way, fading out underneath
const imageVariants = {
  enter: (dir) => ({ x: dir > 0 ? '12%' : '-12%', opacity: 0, scale: 1.12, zIndex: 2 }),
  center: { x: '0%', opacity: 1, scale: 1, zIndex: 2 },
  exit: (dir) => ({ x: dir > 0 ? '-8%' : '8%', opacity: 0, scale: 1.04, zIndex: 1 }),
}

const textVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export default function Hero() {
  const [[index, dir], setSlide] = useState([0, 1])
  const slide = SLIDES[index]

  const go = useCallback((next, d) => {
    setSlide(([cur]) => {
      const target = typeof next === 'function' ? next(cur) : next
      return [(target + SLIDES.length) % SLIDES.length, d ?? (target > cur ? 1 : -1)]
    })
  }, [])

  const nextSlide = useCallback(() => go((i) => i + 1, 1), [go])
  const prevSlide = useCallback(() => go((i) => i - 1, -1), [go])

  // Restarts on every slide change, so manual navigation resets the timer
  useEffect(() => {
    const t = setTimeout(nextSlide, AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, nextSlide])

  return (
    <section className="relative h-screen overflow-hidden flex items-end bg-espresso">
      {/* Background slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.3, ease: EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.x < -80 || velocity.x < -500) nextSlide()
            else if (offset.x > 80 || velocity.x > 500) prevSlide()
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-grab active:cursor-grabbing"
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 pb-28 max-w-2xl pointer-events-none">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <p className="flex items-center gap-3 text-[9px] tracking-[0.28em] uppercase text-sand/80 font-light mb-6">
              <span className="w-9 h-px bg-sand/60 inline-block" />
              {slide.eyebrow}
            </p>
            <h1
              className="font-serif font-light text-[#F9F5F0] leading-[0.93] tracking-[-0.01em] mb-8"
              style={{ fontSize: 'clamp(60px, 9vw, 108px)' }}
            >
              {slide.title[0]}<br />
              <em className="italic">{slide.title[1]}</em><br />
              {slide.title[2]}
            </h1>
            <p className="text-[11px] tracking-[0.14em] uppercase text-cream/60 font-light mb-10 max-w-xs leading-loose">
              {slide.copy}
            </p>
            <Link
              href={slide.href}
              className="pointer-events-auto inline-flex items-center gap-4 text-[10px] tracking-[0.22em] uppercase text-cream border border-cream/40 px-9 py-4 hover:border-cream/90 hover:bg-cream/10 transition-all duration-500 group"
            >
              {slide.cta}
              <span className="relative inline-block w-6 h-px bg-current transition-all duration-500 group-hover:w-10">
                <span className="absolute -right-px -top-[3px] w-[6px] h-[6px] border-r border-t border-current rotate-45" />
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress + controls */}
      <div className="absolute left-8 right-8 md:left-16 md:right-16 bottom-10 z-10 flex items-center gap-6">
        <span className="font-serif text-cream text-[15px] tabular-nums">
          {String(index + 1).padStart(2, '0')}
          <span className="text-cream/40"> / {String(SLIDES.length).padStart(2, '0')}</span>
        </span>

        <div className="flex flex-1 gap-2 max-w-sm">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex-1 h-[2px] bg-cream/25 overflow-hidden py-0"
            >
              {i === index && (
                <motion.span
                  key={index}
                  className="absolute inset-y-0 left-0 bg-cream"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-cream/70" />}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-3">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 border border-cream/40 text-cream flex items-center justify-center hover:bg-cream/10 hover:border-cream/90 transition-all duration-300"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 border border-cream/40 text-cream flex items-center justify-center hover:bg-cream/10 hover:border-cream/90 transition-all duration-300"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
