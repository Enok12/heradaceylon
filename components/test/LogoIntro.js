'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]
const LOGO = '/images/logo/embossed-symbol.png'

// Shapes the sheen to the seal's own lines, using the logo's transparency
const LOGO_MASK = {
  WebkitMaskImage: `url(${LOGO})`,
  maskImage: `url(${LOGO})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
}

export default function LogoIntro() {
  const ref = useRef(null)
  const [start, setStart] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // Hold the entrance until (1) the logo file is downloaded and decoded, so the seal and the
  // sheen's mask (the same file) are ready to paint on the first frame, and (2) the site
  // Loader, which covers every full page load, has left, so the seal isn't revealed behind it
  useEffect(() => {
    let cancelled = false
    let poll
    const img = new window.Image()
    img.src = LOGO
    img.decode().catch(() => {}).then(() => {
      if (cancelled) return
      poll = setInterval(() => {
        if (document.querySelector('[data-loader]')) return
        clearInterval(poll)
        setStart(true)
      }, 50)
    })
    return () => { cancelled = true; clearInterval(poll) }
  }, [])

  // Logo drifts up and fades as the visitor scrolls on to the categories
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    // Column layout: the logo takes the free space and the scroll cue sits below it in flow,
    // so on short screens the cue is pushed down rather than overlapping the tagline
    <section ref={ref} className="relative h-[100svh] min-h-[560px] bg-white overflow-hidden flex flex-col pt-[72px]">
      <motion.div style={{ y, opacity }} className="relative flex-1 flex flex-col items-center justify-center text-center text-charcoal px-6">
        <h1 className="sr-only">Herada Ceylon</h1>

        {/* Sized by the smaller of screen height and width, so the seal fits any screen */}
        <div className="relative w-[min(60svh,84vw)] aspect-[635/641]">
          {/* Entrance: the seal opens outward from its centre, turning into place and sharpening */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'circle(0% at 50% 50%)', rotate: -24, opacity: 0, filter: 'blur(10px)' }}
            animate={start ? { clipPath: 'circle(75% at 50% 50%)', rotate: 0, opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.2, ease: EASE }}
            onAnimationComplete={() => { if (start) setRevealed(true) }}
          >
            {/* unoptimized: served as the original file, the same one the sheen's mask uses,
                so it downloads once and both are ready together */}
            <Image src={LOGO} alt="" fill priority unoptimized className="object-contain" />
          </motion.div>

          {/* Then a band of light sweeps once across the gold, matching the brand-name sheen in
              the categories section. The masked layer is mounted from the start so its mask is
              already applied when the sweep begins (a freshly mounted mask paints nothing for a
              moment, which made the band appear mid-way). It's outside the blurred layer and
              only moves once the seal has fully opened, so no light shows while it comes in. */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={LOGO_MASK}>
            <motion.span
              // left-0 matters: without it the band's start follows the section's text-center
              // and sits mid-seal, so the sweep looked like it began in the middle
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFE9A8] to-transparent"
              initial={{ x: '-110%' }}
              animate={revealed ? { x: '320%' } : {}}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="flex flex-col items-center gap-3 pb-8 pt-4"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/60 font-medium">Explore</span>
        <span className="relative w-px h-12 bg-charcoal/15 overflow-hidden">
          <motion.span
            className="absolute left-0 top-0 w-px h-4 bg-charcoal"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
