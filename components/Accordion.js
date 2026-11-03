'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="border-t border-sand">
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-sand">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-normal text-charcoal group-hover:text-gold transition-colors duration-300">
              {item.title}
            </span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg font-normal text-charcoal/50 group-hover:text-gold transition-colors duration-300 leading-none"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="overflow-hidden"
              >
                <p className="text-[12px] leading-loose text-muted font-normal tracking-[0.03em] pb-6 max-w-md">
                  {item.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
