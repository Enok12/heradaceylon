'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Desktop: every image stacked vertically so the page scrolls through them while the
// product info column stays sticky. Mobile: a single swipeable image with dots.
export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0)
  const imageRefs = useRef([])

  // Highlight the thumbnail of whichever stacked image is mostly in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    imageRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [images])

  const scrollTo = (i) => {
    imageRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Desktop: sticky thumbnails + stacked images */}
      <div className="hidden md:flex gap-4">
        <div className="sticky top-[96px] self-start flex flex-col gap-3 w-[100px] flex-shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-[100px] h-[125px] rounded-lg overflow-hidden bg-sand transition-all duration-300 ${
                active === i
                  ? 'ring-1 ring-charcoal ring-offset-2 ring-offset-white'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => (imageRefs.current[i] = el)}
              data-index={i}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand scroll-mt-[96px]"
            >
              <Image
                src={src}
                alt={`${name} ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 1280px) 50vw, 45vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: single swipeable image */}
      <div className="md:hidden relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            drag={images.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -50) setActive((active + 1) % images.length)
              else if (offset.x > 50) setActive((active - 1 + images.length) % images.length)
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${name} ${active + 1}`}
              fill
              priority={active === 0}
              draggable={false}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                active === i ? 'bg-charcoal' : 'bg-charcoal/30'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
