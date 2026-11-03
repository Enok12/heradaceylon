'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import products from '@/data/products.json'
import { CATEGORIES } from '@/lib/categories'

const EASE = [0.16, 1, 0.3, 1]
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

// Tile widths in the horizontal track. Desktop: a unit is a quarter of the frame (less
// gaps), New Arrivals spans two, so New Arrivals + Women + Men exactly fill the first
// screen. Phones: New Arrivals fills the frame and the rest follow at 72%.
const UNIT = 'w-[72%] md:w-[calc((100%-48px)/4)]'
const WIDTHS = { new: 'w-full md:w-[calc((100%-48px)/2+16px)]' }

// Rendered image width per tile. Tiles are full-height, so photos are sized by height:
// the wide (~16:9) cover photos in narrow tiles render far wider than the tile itself.
const IMAGE_SIZES = {
  new: '(max-width: 768px) 200vw, 80vw',
  women: '(max-width: 768px) 260vw, 110vw',
  men: '(max-width: 768px) 260vw, 110vw',
}

// A tile counts as in view once it is 8% of the screen width inside the right edge, so
// incoming tiles visibly reveal rather than finishing before they are seen
const VIEWPORT = { once: true, margin: '0px -8% 0px 0px' }
const FIRST_SCREEN = 3
const delayFor = (index) => (index < FIRST_SCREEN ? index * 0.09 : 0)

const MotionLink = motion(Link)

// Fits a wide photo into a tile of any shape: centres crop.subject and keeps the visible
// window inside crop.safe (clear of printed lettering). If the tile is too wide for the
// safe band, it zooms in just enough. Returns styles for the <Image>; null until measured.
function useSmartCrop(ref, crop) {
  const [style, setStyle] = useState(null)
  useLayoutEffect(() => {
    if (!crop || !ref.current) return
    const el = ref.current
    const update = () => {
      const tileAspect = el.offsetWidth / el.offsetHeight
      const f = Math.min(1, tileAspect / crop.aspect) // visible fraction of photo width
      if (f >= 1) return setStyle(null)
      const [lo, hi] = crop.safe
      const s = Math.max(1, f / (hi - lo)) // zoom so the window fits the safe band
      const fv = f / s // final visible fraction
      const c = (crop.subject[0] + crop.subject[1]) / 2
      const W = Math.min(Math.max(c - fv / 2, lo), hi - fv) // final window's left edge
      const L = Math.min(Math.max(W - (f - fv) / 2, 0), 1 - f) // pre-zoom window's left edge
      const o = s > 1 ? (W - L) / (f * (1 - 1 / s)) : 0.5 // zoom origin across the tile
      setStyle({
        objectPosition: `${(L / (1 - f)) * 100}% center`,
        transform: s > 1 ? `scale(${s})` : undefined,
        transformOrigin: `${o * 100}% 50%`,
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, crop])
  return style
}

function Tile({ category, index }) {
  const count = products.filter(category.matches).length
  const photoRef = useRef(null)
  const cropStyle = useSmartCrop(photoRef, category.crop)

  // Pointer-driven 3D tilt, springed so it eases in and settles back
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { px.set(0); py.set(0) }

  return (
    <MotionLink
      href={category.href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      // Entrance: uncovered bottom-to-top. The first screen staggers in together; later
      // tiles reveal one by one as the horizontal scroll brings them in from the right.
      initial={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
      whileInView={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay: delayFor(index) }}
      className={`group relative block flex-shrink-0 h-full overflow-hidden rounded-2xl no-underline ${WIDTHS[category.slug] ?? UNIT} ${
        category.image ? 'bg-sand' : 'bg-charcoal'
      }`}
    >
      {category.image ? (
        <>
          {/* Photo settles up into place on entrance, then pans upward on hover */}
          <motion.div
            // Extra height above and below so neither the entrance settle (8%) nor the hover
            // pan (-5%) ever exposes the tile background
            ref={photoRef}
            className="absolute inset-x-0 -top-[10%] h-[125%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[5%]"
            initial={{ y: '8%' }}
            whileInView={{ y: '0%' }}
            viewport={VIEWPORT}
            transition={{ duration: 1.4, ease: EASE, delay: delayFor(index) }}
          >
            <Image
              src={category.image}
              alt=""
              fill
              className="object-cover"
              style={cropStyle ?? { objectPosition: category.focus }}
              sizes={IMAGE_SIZES[category.slug] ?? '(max-width: 768px) 150vw, 40vw'}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
        </>
      ) : (
        // No photography yet: a typographic tile
        <span
          aria-hidden="true"
          style={SERIF}
          className="absolute inset-0 flex items-center justify-center text-[clamp(56px,7vw,110px)] font-medium tracking-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(247,243,238,0.35)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
        >
          {category.label.toUpperCase()}
        </span>
      )}

      {/* Inset frame that draws itself on hover */}
      <span className="pointer-events-none absolute inset-3 md:inset-4">
        <span className="absolute top-0 left-0 h-px w-full bg-white/80 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        <span className="absolute bottom-0 right-0 h-px w-full bg-white/80 origin-right scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
        <span className="absolute top-0 right-0 w-px h-full bg-white/80 origin-top scale-y-0 transition-transform duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
        <span className="absolute bottom-0 left-0 w-px h-full bg-white/80 origin-bottom scale-y-0 transition-transform duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
      </span>

      {/* Label */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 p-5 md:p-7 text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, ease: EASE, delay: 0.35 + delayFor(index) }}
      >
        <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:-translate-y-2">
          <p className="text-[11px] tracking-[0.22em] uppercase font-medium text-white/75 mb-1.5">
            {count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : 'Coming soon'}
          </p>
          <h3 style={SERIF} className={`${category.slug === 'new' ? 'text-[clamp(36px,4.5vw,64px)]' : 'text-[clamp(26px,2.6vw,38px)]'} font-medium leading-none`}>
            {category.label}
          </h3>
          <span className="mt-3 block overflow-hidden">
            <span className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-medium transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-full md:group-hover:translate-y-0">
              Explore
              <span className="inline-block w-6 h-px bg-current transition-all duration-700 group-hover:w-10" />
            </span>
          </span>
        </div>
      </motion.div>
    </MotionLink>
  )
}

export default function CategoryTiles() {
  const outerRef = useRef(null)
  const frameRef = useRef(null)
  const trackRef = useRef(null)
  const [overflow, setOverflow] = useState(0)

  // How far the track extends past the frame's right edge = how far it slides
  useLayoutEffect(() => {
    const measure = () => {
      if (!frameRef.current || !trackRef.current) return
      setOverflow(Math.max(0, trackRef.current.scrollWidth - frameRef.current.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(frameRef.current)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  // Pinned horizontal scroll: the outer box is one screen tall plus `overflow`, the frame
  // inside is sticky, and vertical page scroll through the outer box slides the track left
  // 1:1, bringing the remaining categories in from the right. A spring on top of the
  // scroll-linked value smooths out stepped mouse-wheel input.
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -overflow])
  const x = useSpring(rawX, { stiffness: 140, damping: 28, mass: 0.5 })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5 })

  // Keep the navbar tucked away while pinned, so it can't cover the heading on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const r = outerRef.current?.getBoundingClientRect()
      const pinned = r && r.top <= 1 && r.bottom >= window.innerHeight - 1
      if (pinned) document.body.dataset.navHidden = 'true'
      else delete document.body.dataset.navHidden
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      delete document.body.dataset.navHidden
    }
  }, [])

  return (
    <section ref={outerRef} className="relative bg-cream" style={{ height: `calc(100svh + ${overflow}px)` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col px-4 md:px-12 pt-6 md:pt-7 pb-4 md:pb-5">
        <motion.div
          className="flex-shrink-0 flex items-end justify-between h-[84px] md:h-[110px] mb-4 md:mb-6 px-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div>
            <p className="flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-gold font-medium mb-4">
              <span className="w-6 h-px bg-gold inline-block" />
              Shop by Category
            </p>
            <h2 style={SERIF} className="text-[clamp(38px,5vw,64px)] font-medium text-charcoal leading-[1.02]">
              Find your <em className="italic">piece</em>
            </h2>
          </div>
          <div className="flex items-center gap-6 pb-2">
            {/* Horizontal progress through the categories */}
            <span className="hidden sm:block relative w-24 md:w-32 h-px bg-charcoal/15 overflow-hidden">
              <motion.span className="absolute inset-0 bg-charcoal origin-left" style={{ scaleX: progress }} />
            </span>
            <Link href="/collections" className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal no-underline font-medium hover:gap-4 transition-all duration-300">
              View All <span>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Visible frame: tiles are full frame height in one horizontal row */}
        <div ref={frameRef} className="relative flex-1 min-h-0 overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex h-full gap-3 md:gap-4 [perspective:1400px]">
            {CATEGORIES.map((category, i) => (
              <Tile key={category.slug} category={category} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
