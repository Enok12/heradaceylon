'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import products from '@/data/products.json'

const EASE = [0.16, 1, 0.3, 1]
const SIZES_SHOWN = 5
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'One Size']

// Slider limits, from the whole catalogue so they don't jump around between tabs
export const PRICE_MIN = Math.min(...products.map(p => p.price))
export const PRICE_MAX = Math.max(...products.map(p => p.price))

// A product with no stock data counts as available; it's out only if every size is at 0
export const isInStock = (p) => p.sizes.some(s => p.stock?.[s] !== 0)

const clampPrice = (n) => Math.min(PRICE_MAX, Math.max(PRICE_MIN, n))
const toggle = (list, value) => (list.includes(value) ? list.filter(v => v !== value) : [...list, value])

// Each block slides in as the panel opens
function Block({ index, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.1 + index * 0.08 }}
      className="py-5 border-b border-sand last:border-b-0"
    >
      {children}
    </motion.div>
  )
}

function Option({ label, count, checked, onChange }) {
  return (
    <label className={`flex items-center gap-3 py-1.5 ${count === 0 && !checked ? 'opacity-40' : 'cursor-pointer group'}`}>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={count === 0 && !checked} onChange={onChange} />
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${checked ? 'border-charcoal' : 'border-charcoal/30 group-hover:border-charcoal'}`}>
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="block w-2.5 h-2.5 rounded-full bg-charcoal"
        />
      </span>
      <span className="flex-1 text-[14px] font-medium text-charcoal">{label}</span>
      <span className="text-[14px] text-muted tabular-nums">({count})</span>
    </label>
  )
}

function PriceInput({ label, value, onCommit }) {
  // What's typed only applies on leaving the box or pressing Enter, so half-typed numbers
  // don't empty the grid
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])
  const commit = () => {
    const n = Number(draft)
    if (draft === '' || Number.isNaN(n)) setDraft(String(value))
    else onCommit(n)
  }
  return (
    <label className="flex-1 min-w-0">
      <span className="block text-[11px] tracking-[0.08em] uppercase font-medium text-charcoal mb-1.5">{label}</span>
      <span className="flex items-center gap-1.5 h-10 px-2.5 rounded-lg border border-charcoal/30 focus-within:border-charcoal transition-colors duration-200">
        <span className="text-[12px] text-muted">USD</span>
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={e => setDraft(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
          aria-label={`${label} price`}
          className="w-full min-w-0 bg-transparent text-[14px] text-charcoal outline-none tabular-nums"
        />
      </span>
    </label>
  )
}

export default function FilterPanel({ products: list, filters, onChange, onClear, activeCount }) {
  const [showAllSizes, setShowAllSizes] = useState(false)

  const sizes = SIZE_ORDER
    .map(size => ({ size, count: list.filter(p => p.sizes.includes(size)).length }))
    .filter(({ size, count }) => count > 0 || filters.sizes.includes(size))
  const firstSizes = sizes.slice(0, SIZES_SHOWN)
  const moreSizes = sizes.slice(SIZES_SHOWN)

  const inStock = list.filter(isInStock).length
  const [lo, hi] = filters.price
  const span = PRICE_MAX - PRICE_MIN || 1
  const setPrice = (price) => onChange({ ...filters, price })
  const toggleSize = (size) => onChange({ ...filters, sizes: toggle(filters.sizes, size) })
  const toggleStock = (v) => onChange({ ...filters, availability: toggle(filters.availability, v) })

  const sizeOption = ({ size, count }) => (
    <Option key={size} label={size} count={count} checked={filters.sizes.includes(size)} onChange={() => toggleSize(size)} />
  )

  return (
    <div className="px-6">
      <Block index={0}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] text-charcoal/80">Size</h3>
          <AnimatePresence initial={false}>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClear}
                className="text-[12px] font-medium text-charcoal underline underline-offset-4 hover:text-gold transition-colors duration-200"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {firstSizes.map(sizeOption)}
        <AnimatePresence initial={false}>
          {showAllSizes && moreSizes.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              {moreSizes.map(sizeOption)}
            </motion.div>
          )}
        </AnimatePresence>
        {moreSizes.length > 0 && (
          <button
            onClick={() => setShowAllSizes(s => !s)}
            aria-expanded={showAllSizes}
            className="flex items-center gap-2 mt-2 text-[13px] font-medium text-charcoal hover:text-gold transition-colors duration-200"
          >
            <span className={`text-[18px] leading-none transition-transform duration-300 ${showAllSizes ? 'rotate-45' : ''}`}>+</span>
            {showAllSizes ? 'Show Less' : 'Show More'}
          </button>
        )}
      </Block>

      <Block index={1}>
        <h3 className="text-[15px] text-charcoal/80 mb-2">Availability</h3>
        <Option label="In Stock" count={inStock} checked={filters.availability.includes('in')} onChange={() => toggleStock('in')} />
        <Option label="Out Of Stock" count={list.length - inStock} checked={filters.availability.includes('out')} onChange={() => toggleStock('out')} />
      </Block>

      <Block index={2}>
        <h3 className="text-[15px] text-charcoal/80 mb-4">Price</h3>
        {/* Two sliders share one track; only their thumbs take the pointer (globals.css) */}
        <div className="relative h-5 mb-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-charcoal/15" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-charcoal"
            style={{ left: `${((lo - PRICE_MIN) / span) * 100}%`, right: `${((PRICE_MAX - hi) / span) * 100}%` }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={lo}
            onChange={e => setPrice([Math.min(Number(e.target.value), hi), hi])}
            aria-label="Minimum price"
            className="price-range"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={hi}
            onChange={e => setPrice([lo, Math.max(Number(e.target.value), lo)])}
            aria-label="Maximum price"
            className="price-range"
          />
        </div>
        <div className="flex gap-2.5">
          <PriceInput label="From" value={lo} onCommit={n => setPrice([Math.min(clampPrice(n), hi), hi])} />
          <PriceInput label="To" value={hi} onCommit={n => setPrice([lo, Math.max(clampPrice(n), lo)])} />
        </div>
      </Block>
    </div>
  )
}
