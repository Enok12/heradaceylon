'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { SectionLabel } from '@/components/ui'
import products from '@/data/products.json'
import { inCategory } from '@/lib/categories'

const CATEGORIES = ['All', 'Sarees', 'Contemporary', 'Accessories']

// The Women section (reached from the Test Page's Women tile) has its own tabs, all within
// women's pieces. Matched on the product's subcategory; no skirts exist in the data yet.
const WOMEN_TABS = [
  { label: 'New Arrivals', matches: (p) => p.newArrival || p.badge === 'New' },
  { label: 'Collections', matches: () => true },
  { label: 'Dresses', matches: (p) => p.subcategory === 'dresses' },
  { label: 'Tops', matches: (p) => p.subcategory === 'tops' },
  { label: 'Skirts', matches: (p) => p.subcategory === 'skirts' },
]
const WOMEN_DEFAULT = 'Collections'
const SORT_OPTIONS = [
  { label: 'New In', value: 'new' },
  { label: 'Price: Low to High', value: 'asc' },
  { label: 'Price: High to Low', value: 'desc' },
]

export default function CollectionsPage() {
  const searchParams = useSearchParams()
  const initCat = searchParams.get('category') || 'all'
  const initFilter = searchParams.get('filter') || ''

  const isWomen = initCat === 'women'
  const urlCategory = isWomen ? WOMEN_DEFAULT : initCat !== 'all' ? initCat.charAt(0).toUpperCase() + initCat.slice(1) : 'All'
  const allTab = isWomen ? WOMEN_DEFAULT : 'All'
  const [activeCategory, setActiveCategory] = useState(urlCategory)
  // The page stays mounted when only the query string changes (e.g. navbar Sarees → Contemporary)
  useEffect(() => setActiveCategory(urlCategory), [urlCategory])
  // Categories reached by link that aren't standard tabs (Men, Bags) get a tab of their own
  const tabs = isWomen
    ? WOMEN_TABS.map(t => t.label)
    : CATEGORIES.includes(urlCategory) ? CATEGORIES : [...CATEGORIES, urlCategory]
  const [sort, setSort] = useState('new')
  const [sortOpen, setSortOpen] = useState(false)
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })

  const filtered = useMemo(() => {
    let list = [...products]
    if (isWomen) {
      const tab = WOMEN_TABS.find(t => t.label === activeCategory) ?? WOMEN_TABS[1]
      list = list.filter(p => p.gender === 'women' && tab.matches(p))
    } else {
      if (initFilter === 'new') list = list.filter(p => p.newArrival || p.badge === 'New')
      if (activeCategory !== 'All') list = list.filter(p => inCategory(p, activeCategory.toLowerCase()))
    }
    if (sort === 'asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [activeCategory, sort, initFilter, isWomen])

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Hero Banner */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden flex items-end bg-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80')` }}
        />
        <div className="relative z-10 px-8 md:px-16 pb-14">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel>
              <span className="text-gold-light">
                {isWomen ? 'Shop' : initFilter === 'new' ? 'Just Arrived' : 'All Collections'}
              </span>
            </SectionLabel>
            <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-normal text-cream leading-[1]">
              {isWomen ? <em className="italic">Women</em> : initFilter === 'new' ? 'New Arrivals' : <><em className="italic">Herada</em> Collections</>}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[72px] z-40 bg-cream/95 backdrop-blur-sm border-b border-sand px-8 md:px-16 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Category Tabs */}
          <div className="flex gap-1 flex-wrap">
            {tabs.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] tracking-[0.18em] uppercase px-4 py-2 font-normal transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-charcoal text-cream'
                    : 'text-muted hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count + Sort */}
          <div className="flex items-center gap-6">
            <span className="text-[9px] tracking-[0.14em] uppercase text-muted font-normal">
              {filtered.length} pieces
            </span>
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-2 text-[9px] tracking-[0.18em] uppercase text-charcoal font-normal hover:text-gold transition-colors duration-300"
              >
                Sort: {SORT_OPTIONS.find(s => s.value === sort)?.label}
                <span className={`text-[8px] transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 bg-cream border border-sand shadow-sm min-w-[180px] z-50"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false) }}
                        className={`block w-full text-left px-5 py-3 text-[9px] tracking-[0.16em] uppercase font-normal transition-colors duration-200 ${
                          sort === opt.value ? 'text-charcoal bg-linen' : 'text-muted hover:text-charcoal hover:bg-linen'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {/* Near-full-width grid: a slim 8px margin at the screen edges, narrow gaps between */}
      <div className="px-2 py-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + sort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1.5 gap-y-8"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} infoClassName="px-3 md:px-4" />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-normal mb-3">No pieces found</p>
            <button
              onClick={() => setActiveCategory(allTab)}
              className="text-[9px] tracking-[0.18em] uppercase text-charcoal border-b border-charcoal pb-0.5 hover:text-gold hover:border-gold transition-colors duration-300 font-normal"
            >
              View all collections
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
