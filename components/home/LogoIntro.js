'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const LOGO = '/images/logo/embossed-symbol.png'
const SLOGAN = 'Wear to Dominate'
// Set directly: Tailwind's font-serif points at a --font-cormorant variable that isn't defined
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

export default function LogoIntro() {
  const ref = useRef(null)
  const [start, setStart] = useState(false)

  // Hold the entrance until (1) the logo file is downloaded and decoded, so it's ready to
  // paint on the first frame, and (2) the site Loader, which covers every full page load,
  // has left, so the fade-in isn't hidden behind it
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

  // Logo drifts up and fades if the visitor drags the scrollbar on to the categories
  // (wheel, touch and keys crossfade between the sections instead, see SectionSnap)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    // Column layout: the logo takes the free space and the scroll cue sits below it in flow,
    // so on short screens the cue is pushed down rather than overlapping the logo
    <section ref={ref} className="relative h-[100svh] min-h-[560px] bg-white overflow-hidden flex flex-col pt-[72px]">
      <motion.div style={{ y, opacity }} className="relative flex-1 flex flex-col items-center justify-center text-center text-charcoal px-6">
        <h1 className="sr-only">Herada Ceylon</h1>

        {/* Sized by the smaller of screen height and width, so the seal and slogan fit any screen */}
        <motion.div
          className="relative w-[min(52svh,78vw)] aspect-[635/641]"
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <Image src={LOGO} alt="" fill priority unoptimized className="object-contain" />
        </motion.div>

        {/* Slogan: as the seal settles, the letters come into focus one by one, spreading
            outward from the middle of the line to both ends */}
        <p
          // The negative margin cancels the letter spacing after the final letter, so the
          // line is optically centred under the seal
          style={{ ...SERIF, marginRight: '-0.22em' }}
          aria-label={SLOGAN}
          className="mt-[clamp(18px,3.5svh,40px)] whitespace-pre text-[clamp(20px,min(2.6vw,4svh),36px)] font-medium uppercase tracking-[0.22em] text-charcoal leading-none"
        >
          {SLOGAN.split('').map((char, i, all) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="inline-block"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={start ? { opacity: 1, filter: 'blur(0px)' } : {}}
              transition={{
                duration: 1.1,
                ease: 'easeOut',
                delay: 1 + Math.abs(i - (all.length - 1) / 2) * 0.06,
              }}
            >
              {char}
            </motion.span>
          ))}
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="flex flex-col items-center gap-3 pb-8 pt-4"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2.4 }}
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
