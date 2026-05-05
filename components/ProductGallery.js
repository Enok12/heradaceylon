'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-3 w-[72px] flex-shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative w-[72px] h-[90px] overflow-hidden bg-sand transition-all duration-300 ${
              active === i
                ? 'ring-[0.5px] ring-charcoal ring-offset-1'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image
              src={src}
              alt={`${name} view ${i + 1}`}
              fill
              className="object-cover"
              sizes="72px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-sand">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${name} ${active + 1}`}
              fill
              priority={active === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                active === i ? 'bg-charcoal' : 'bg-charcoal/30'
              }`}
            />
          ))}
        </div>

        {/* Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((active - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream/80 flex items-center justify-center text-charcoal opacity-0 group-hover:opacity-100 hover:bg-cream transition-all duration-300 text-sm"
            >
              ←
            </button>
            <button
              onClick={() => setActive((active + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-cream/80 flex items-center justify-center text-charcoal opacity-0 group-hover:opacity-100 hover:bg-cream transition-all duration-300 text-sm"
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
