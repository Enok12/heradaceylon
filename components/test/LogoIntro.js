'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

// One word, revealed letter by letter through a mask. `from` sets the travel direction:
// the top word rises from below, the bottom word drops from above, so they meet at the rule.
function MaskedWord({ word, from, start }) {
  return (
    <span className="flex justify-center" aria-hidden="true">
      {word.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
          <motion.span
            className="inline-block"
            initial={{ y: from === 'below' ? '110%' : '-110%', opacity: 0, filter: 'blur(8px)' }}
            animate={start ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: i * 0.07 }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function LogoIntro() {
  const ref = useRef(null)
  const [start, setStart] = useState(false)

  // The site Loader covers the first visit of a session for ~2.4s; wait for it to clear
  useEffect(() => {
    let seen = true
    try { seen = !!sessionStorage.getItem('hc-loaded') } catch {}
    const t = setTimeout(() => setStart(true), seen ? 150 : 2900)
    return () => clearTimeout(t)
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

        <div style={SERIF} className="text-[clamp(56px,min(15vw,19vh),220px)] leading-[0.9] font-medium tracking-[0.04em]">
          <MaskedWord word="HERADA" from="below" start={start} />
        </div>

        {/* Gold rule drawn outward from the centre between the two words */}
        <div className="relative h-px my-[clamp(10px,2vw,22px)] mx-auto w-full max-w-[min(90vw,1100px)]">
          <motion.span
            className="absolute inset-0 bg-gold origin-center"
            initial={{ scaleX: 0 }}
            animate={start ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
          />
        </div>

        <div style={SERIF} className="text-[clamp(56px,min(15vw,19vh),220px)] leading-[0.9] font-medium tracking-[0.04em]">
          <MaskedWord word="CEYLON" from="above" start={start} />
        </div>

        <motion.p
          className="mt-[clamp(20px,3vw,36px)] text-[12px] md:text-[13px] uppercase text-charcoal/70 font-medium"
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={start ? { opacity: 1, letterSpacing: '0.35em' } : {}}
          transition={{ duration: 1.6, ease: EASE, delay: 1.1 }}
        >
          Heritage Textiles · Sri Lanka
        </motion.p>
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
