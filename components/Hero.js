'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// focus / focusMd: object-position on portrait phones / portrait tablets, where only a
// narrow slice of each ~16:9 photo shows. Each keeps the model in frame and the printed
// lettering fully out of frame rather than half-cut. Landscape screens stay centred.
const SLIDES = [
  { image: '/images/hero/cover-1.jpg', focus: '18%', focusMd: '0%', alt: 'Model in a black suit standing beside the Herada Ceylon wordmark' },
  { image: '/images/hero/cover-2.jpg', focus: '85%', focusMd: '100%', alt: 'Model in a black blazer and skirt seated on a wooden stool' },
  { image: '/images/hero/cover-4.jpg', focus: '27%', focusMd: '10%', alt: 'Model in a black overcoat walking beside the words December Drop' },
]

const AUTOPLAY_MS = 6500
const EASE = [0.16, 1, 0.3, 1]

const WIPE_EASE = [0.77, 0, 0.175, 1]

// Curtain wipe: the incoming slide is uncovered by an edge sweeping in from the travel
// side, while the outgoing slide underneath drifts the opposite way (parallax).
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
const slideVariants = {
  enter: (dir) => ({
    clipPath: dir > 0
      ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
      : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    x: '0%',
    zIndex: 2,
  }),
  center: { clipPath: FULL, x: '0%', zIndex: 2 },
  exit: (dir) => ({ clipPath: FULL, x: dir > 0 ? '-18%' : '18%', zIndex: 1 }),
}

// The photo inside the incoming curtain trails the edge slightly, so it glides into place
const photoVariants = {
  enter: (dir) => ({ x: dir > 0 ? '22%' : '-22%' }),
  center: { x: '0%' },
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
    <section className="relative h-screen overflow-hidden bg-[#F4F1EC]">
      {/* Background slides */}
      <AnimatePresence custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.25, ease: WIPE_EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.x < -80 || velocity.x < -500) nextSlide()
            else if (offset.x > 80 || velocity.x > 500) prevSlide()
          }}
          className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <motion.div
            custom={dir}
            variants={photoVariants}
            transition={{ duration: 1.25, ease: WIPE_EASE }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              // Portrait screens crop a ~16:9 photo to a narrow slice, so it renders ~4x the viewport width
              sizes="(orientation: portrait) 400vw, 100vw"
              quality={90}
              draggable={false}
              className="object-cover select-none object-[var(--focus)] md:portrait:object-[var(--focus-md)] landscape:object-center"
              style={{ '--focus': `${slide.focus} center`, '--focus-md': `${slide.focusMd} center` }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Soft top shade so the white navbar stays legible over the light photos */}
      <div className="absolute inset-x-0 top-0 h-40 z-[3] pointer-events-none bg-gradient-to-b from-black/35 to-transparent" />

      {/* Shop Now, bottom centre */}
      <div className="absolute inset-x-0 bottom-20 lg:bottom-12 z-10 flex justify-center pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          >
            <Link
              href="/collections"
              className="pointer-events-auto inline-flex items-center gap-4 bg-charcoal text-white text-[11px] tracking-[0.24em] uppercase font-medium px-10 py-4 hover:bg-white hover:text-charcoal border border-charcoal transition-all duration-500 group"
            >
              Shop Now
              <span className="relative inline-block w-6 h-px bg-current transition-all duration-500 group-hover:w-10">
                <span className="absolute -right-px -top-[3px] w-[6px] h-[6px] border-r border-t border-current rotate-45" />
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress, bottom-right corner */}
      <div className="absolute right-6 md:right-8 bottom-5 z-10 flex items-center gap-4">
        <span className="text-[11px] tracking-[0.16em] text-charcoal font-medium tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex gap-2 w-40 md:w-56">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex-1 h-[2px] bg-charcoal/20 overflow-hidden"
            >
              {i === index && (
                <motion.span
                  key={index}
                  className="absolute inset-y-0 left-0 bg-charcoal"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-charcoal/70" />}
            </button>
          ))}
        </div>
        <span className="text-[11px] tracking-[0.16em] text-charcoal/50 font-medium tabular-nums">
          {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Side arrows: below the large mid-height lettering, where every photo is open wall */}
      {[
        { label: 'Previous slide', onClick: prevSlide, side: 'left-8', arrow: '←' },
        { label: 'Next slide', onClick: nextSlide, side: 'right-8', arrow: '→' },
      ].map(({ label, onClick, side, arrow }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className={`hidden md:flex absolute top-[64%] ${side} z-10 w-11 h-11 items-center justify-center border border-charcoal/30 text-charcoal bg-white/40 backdrop-blur-sm hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300`}
        >
          {arrow}
        </button>
      ))}
    </section>
  )
}
