'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import products from '@/data/products.json'
import { CATEGORIES } from '@/lib/categories'

const EASE = [0.16, 1, 0.3, 1]
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

// Categories shown for now. The rest (Sarees, Contemporary, Accessories, Bags) stay in
// lib/categories.js. Adding slugs here brings back the sideways scroll on desktop: the
// section measures its own overflow and pins itself. Below lg would also need the stacked
// layout (grid classes on the track, col-span-2 and w-full below) back to a sideways row.
const VISIBLE = ['new', 'women', 'men']
const TILES = CATEGORIES.filter((c) => VISIBLE.includes(c.slug))

// Tile widths in the track. Desktop: a unit is a quarter of the frame (less gaps), New
// Arrivals spans two, so the three tiles exactly fill the screen. Phones and tablets: New
// Arrivals across the top, the other two side by side beneath it.
const UNIT = 'w-full lg:w-[calc((100%-48px)/4)]'
const WIDTHS = { new: 'col-span-2 w-full lg:w-[calc((100%-48px)/2+16px)]' }

// Rendered image width per tile. Tiles are full-height, so photos are sized by height:
// the wide (~16:9) cover photos in narrow tiles render far wider than the tile itself.
const IMAGE_SIZES = {
  new: '(max-width: 1023px) 200vw, 80vw',
  women: '(max-width: 1023px) 260vw, 110vw',
  men: '(max-width: 1023px) 260vw, 110vw',
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

  // Coming-soon tiles aren't links and skip the hover effects (tilt, photo pan, frame,
  // Explore)
  const soon = !!category.comingSoon
  const TileTag = soon ? motion.div : MotionLink
  const linkProps = soon
    ? { 'aria-disabled': true, title: `${category.label}: coming soon` }
    : { href: category.href, onMouseMove: onMove, onMouseLeave: onLeave, style: { rotateX, rotateY, transformPerspective: 1100 } }

  return (
    <TileTag
      {...linkProps}
      // Entrance: uncovered bottom-to-top. The first screen staggers in together; later
      // tiles reveal one by one as the horizontal scroll brings them in from the right.
      initial={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
      whileInView={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay: delayFor(index) }}
      className={`${soon ? 'cursor-default' : 'group'} relative block flex-shrink-0 h-full overflow-hidden rounded-2xl no-underline ${WIDTHS[category.slug] ?? UNIT} ${
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
      <span className={`pointer-events-none absolute inset-3 md:inset-4 ${soon ? 'hidden' : ''}`}>
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
            {soon || count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'piece' : 'pieces'}`}
          </p>
          <h3 style={SERIF} className={`${category.slug === 'new' ? 'text-[clamp(36px,4.5vw,64px)]' : 'text-[clamp(26px,2.6vw,38px)]'} font-medium leading-none`}>
            {category.label}
          </h3>
          <span className={`mt-3 overflow-hidden ${soon ? 'hidden' : 'block'}`}>
            <span className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-medium transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-full md:group-hover:translate-y-0">
              Explore
              <span className="inline-block w-6 h-px bg-current transition-all duration-700 group-hover:w-10" />
            </span>
          </span>
        </div>
      </motion.div>
    </TileTag>
  )
}

const BRAND_LOGO = '/images/logo/embossed-brand-name.png'

// Header entrance, as one timeline: the logo wipes on from the left, the gold rules
// draw away from the tagline, its two phrases meet at the centre, then View All arrives.
const headerStep = (hidden, show, delay, duration = 1) => ({
  hidden,
  show: { ...show, transition: { duration, ease: EASE, delay } },
})
const HEADER = {
  logo: headerStep(
    { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', x: -16 },
    { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', x: 0 },
    0, 1.2,
  ),
  rule: headerStep({ scaleX: 0 }, { scaleX: 1 }, 0.3, 1.2),
  wordsLeft: headerStep({ opacity: 0, x: -28 }, { opacity: 1, x: 0 }, 0.45),
  wordsRight: headerStep({ opacity: 0, x: 28 }, { opacity: 1, x: 0 }, 0.45),
  dot: headerStep({ opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.85, 0.6),
  viewLine: headerStep({ scaleX: 0 }, { scaleX: 1 }, 0.6),
  viewAll: headerStep({ opacity: 0, x: 24 }, { opacity: 1, x: 0 }, 0.7, 0.9),
}

export default function CategoryTiles() {
  const outerRef = useRef(null)
  const frameRef = useRef(null)
  const trackRef = useRef(null)
  const [overflow, setOverflow] = useState(0)
  const [headerIn, setHeaderIn] = useState(false)

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

  // Start the header's entrance as the section lands, not as it first enters the screen
  useEffect(() => {
    const onScroll = () => {
      const r = outerRef.current?.getBoundingClientRect()
      if (r && r.top <= window.innerHeight * 0.15) setHeaderIn(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={outerRef} className="relative bg-cream" style={{ height: `calc(100svh + ${overflow}px)` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col px-4 md:px-12 pt-[88px] md:pt-[92px] pb-4 md:pb-5">
        {/* Silk background, anchored to the top so its waves sit behind the header row */}
        <Image
          src="/images/backgrounds/ivory-silk-waves.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-top"
        />

        {/* Equal side columns keep the tagline centred on the page; it needs the width of a
            1340px screen to fit between the logo and View All, so narrower screens drop it */}
        <motion.div
          initial="hidden"
          animate={headerIn ? 'show' : 'hidden'}
          className="flex-shrink-0 flex items-end justify-between min-[1340px]:grid min-[1340px]:grid-cols-[minmax(381px,1fr)_minmax(0,720px)_minmax(381px,1fr)] min-[1340px]:gap-6 h-[84px] md:h-[110px] mb-4 md:mb-6 px-2"
        >
          {/* Brand name artwork, the full height of the heading row */}
          <motion.div variants={HEADER.logo} className="relative h-full aspect-[974/281] justify-self-start">
            <Image
              src={BRAND_LOGO}
              alt="Herada Ceylon"
              fill
              priority
              sizes="(max-width: 768px) 291px, 381px"
              className="object-contain object-left"
            />
          </motion.div>

          <div className="hidden min-[1340px]:flex items-center justify-center gap-5 self-center">
            <motion.span variants={HEADER.rule} className="hidden min-[1400px]:block flex-1 max-w-[160px] h-px bg-gold/70 origin-right" />
            <p className="text-[10px] min-[1536px]:text-[12px] tracking-[0.24em] uppercase text-charcoal/80 font-medium whitespace-nowrap">
              <motion.span variants={HEADER.wordsLeft} className="inline-block">Timeless Elegance</motion.span>
              <motion.span variants={HEADER.dot} className="inline-block mx-3 text-charcoal">•</motion.span>
              <motion.span variants={HEADER.wordsRight} className="inline-block">Sri Lankan Craftsmanship</motion.span>
            </p>
            <motion.span variants={HEADER.rule} className="hidden min-[1400px]:block flex-1 max-w-[160px] h-px bg-gold/70 origin-left" />
          </div>

          <div className="flex items-center justify-end gap-6 pb-2">
            {/* Faint line by View All; it fills to show progress when the tiles scroll sideways */}
            <motion.span variants={HEADER.viewLine} className="hidden md:block relative w-24 md:w-32 h-px bg-charcoal/15 overflow-hidden origin-right">
              {overflow > 0 && (
                <motion.span className="absolute inset-0 bg-charcoal origin-left" style={{ scaleX: progress }} />
              )}
            </motion.span>
            <motion.div variants={HEADER.viewAll}>
              <Link href="/collections" className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal no-underline font-medium hover:gap-4 transition-all duration-300">
                View All <span>→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Visible frame: desktop tiles are full frame height in one row */}
        <div ref={frameRef} className="relative flex-1 min-h-0 overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="grid grid-cols-2 grid-rows-2 lg:flex h-full gap-3 md:gap-4 [perspective:1400px]">
            {TILES.map((category, i) => (
              <Tile key={category.slug} category={category} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
