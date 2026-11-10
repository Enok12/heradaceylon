'use client'
import { useState, useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView, useReducedMotion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { SectionLabel } from '@/components/ui'
import FilterPanel, { PRICE_MIN, PRICE_MAX, isInStock } from '@/components/FilterPanel'
import { useNavScroll } from '@/hooks/useNavScroll'
import products from '@/data/products.json'
import { inCategory } from '@/lib/categories'

const EASE = [0.16, 1, 0.3, 1]
const PANEL_WIDTH = 300

const CATEGORIES = ['All', 'Sarees', 'Contemporary', 'Accessories']

// The Women section (reached from the homepage's Women tile) has its own tabs, all within
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

// Grid sizes offered per screen width. `fallback` is used until the visitor picks one.
const gridFor = (width) => {
  if (width < 768) return { options: [1, 2], fallback: 2 }
  if (width < 1280) return { options: [2, 3, 4], fallback: width < 1024 ? 3 : 4 }
  return { options: [2, 3, 4, 5], fallback: 4 }
}

const EMPTY_FILTERS = { sizes: [], availability: [], price: [PRICE_MIN, PRICE_MAX] }

// The visitor's view lives in the address (?sizes=M,L&max=300&sort=asc&cols=2...), so going
// back to the page, reloading or sharing the link all restore it exactly. Anything missing
// or invalid in the address falls back to the default.
const SORT_VALUES = SORT_OPTIONS.map(o => o.value)
const KNOWN_SIZES = new Set(products.flatMap(p => p.sizes))
const parseView = (params, defaultTab) => {
  const list = (key) => params.get(key)?.split(',').filter(Boolean) ?? []
  const num = (key, fallback) => {
    const n = Number(params.get(key))
    return params.has(key) && Number.isFinite(n) ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, n)) : fallback
  }
  const min = num('min', PRICE_MIN)
  const sort = params.get('sort')
  const cols = Number(params.get('cols'))
  return {
    tab: params.get('tab') || defaultTab,
    filters: {
      sizes: list('sizes').filter(s => KNOWN_SIZES.has(s)),
      availability: list('stock').filter(v => v === 'in' || v === 'out'),
      price: [min, Math.max(min, num('max', PRICE_MAX))],
    },
    sort: SORT_VALUES.includes(sort) ? sort : 'new',
    picked: cols >= 1 && cols <= 5 ? cols : null,
    panel: params.get('panel') === '1',
  }
}

// Where to return to from a product page (see the product page's breadcrumb)
const LISTING_KEY = 'hc-listing'
const RETURN_KEY = 'hc-listing-return'
const store = {
  get: (k) => { try { return sessionStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem(k, v) } catch {} },
  remove: (k) => { try { sessionStorage.removeItem(k) } catch {} },
}

// Back/forward navigation, so the saved scroll position is only used when returning
let lastPopState = 0
if (typeof window !== 'undefined') window.addEventListener('popstate', () => { lastPopState = Date.now() })

// The clip overshoots the tile by 5% each way, so when fully open it can't cut off the card's
// hover lift
const CLIP_HIDDEN = 'polygon(-5% -5%, 105% -5%, 105% -5%, -5% -5%)'
const CLIP_SHOWN = 'polygon(-5% -5%, 105% -5%, 105% 105%, -5% 105%)'

// Entrance for one product: uncovered from the top down (photo, then name and price) while
// rising slightly, once it scrolls into view. forwardRef: AnimatePresence's popLayout needs
// the child's ref.
const ProductTile = forwardRef(function ProductTile({ delay, children }, outerRef) {
  const ref = useRef(null)
  useImperativeHandle(outerRef, () => ref.current)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const reduceMotion = useReducedMotion()
  const hidden = { opacity: 0, y: 36, clipPath: CLIP_HIDDEN }
  const shown = { opacity: 1, y: 0, clipPath: CLIP_SHOWN }

  return (
    <motion.div
      ref={ref}
      layout="position"
      initial={hidden}
      animate={reduceMotion || inView ? shown : hidden}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: EASE, delay }}
      // Any onUpdate keeps framer-motion from using browser-run animations here: as those end
      // it cancels them a tick before writing the final value, leaving a one-frame opacity of 0
      onUpdate={() => {}}
    >
      {children}
    </motion.div>
  )
})

export default function CollectionsPage() {
  const searchParams = useSearchParams()
  const initCat = searchParams.get('category') || 'all'
  const initFilter = searchParams.get('filter') || ''

  const isWomen = initCat === 'women'
  const urlCategory = isWomen ? WOMEN_DEFAULT : initCat !== 'all' ? initCat.charAt(0).toUpperCase() + initCat.slice(1) : 'All'
  const allTab = isWomen ? WOMEN_DEFAULT : 'All'
  const [initialView] = useState(() => parseView(searchParams, urlCategory))
  const [activeCategory, setActiveCategory] = useState(initialView.tab)
  // Categories reached by link that aren't standard tabs (Men, Bags) get a tab of their own
  const tabs = isWomen
    ? WOMEN_TABS.map(t => t.label)
    : CATEGORIES.includes(urlCategory) ? CATEGORIES : [...CATEGORIES, urlCategory]
  const [sort, setSort] = useState(initialView.sort)
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef(null)
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })
  const { hidden: navHidden } = useNavScroll()

  const [filterOpen, setFilterOpen] = useState(initialView.panel)
  const [filters, setFilters] = useState(initialView.filters)
  const [picked, setPicked] = useState(initialView.picked) // grid size chosen by the visitor
  const [width, setWidth] = useState(null)   // null until measured, so the server render matches

  useEffect(() => {
    const measure = () => setWidth(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Changing the filter, sort or grid size brings a visitor who has scrolled down back up to
  // the start of the results, only ever upwards. The results' current height is held until
  // that glide ends: otherwise fewer results shorten the page at once, and the browser jumps
  // to the new bottom (the footer) before the glide begins.
  const toolbarRef = useRef(null)
  const resultsRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const glide = useRef({ timer: null, frame: null })
  useEffect(() => () => {
    clearTimeout(glide.current.timer)
    cancelAnimationFrame(glide.current.frame)
  }, [])

  const changeView = (apply, delay = 0) => {
    const results = resultsRef.current
    const g = glide.current
    if (results && !results.style.minHeight) results.style.minHeight = `${results.offsetHeight}px`
    clearTimeout(g.timer)
    cancelAnimationFrame(g.frame)
    apply()
    g.timer = setTimeout(() => {
      if (!results || !toolbarRef.current) return
      // Scrolling up brings the 72px navbar back, with the toolbar sitting just under it
      const top = results.getBoundingClientRect().top + window.scrollY - toolbarRef.current.offsetHeight - 72
      if (window.scrollY > top + 1) window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' })
      // Let go of the height once the page has stopped moving and the old tiles have left
      const started = performance.now()
      let lastY = window.scrollY
      let still = 0
      const watch = () => {
        still = window.scrollY === lastY ? still + 1 : 0
        lastY = window.scrollY
        if (still > 10 && performance.now() - started > 400) {
          results.style.minHeight = ''
          return
        }
        g.frame = requestAnimationFrame(watch)
      }
      g.frame = requestAnimationFrame(watch)
    }, delay)
  }

  const grid = width === null ? null : gridFor(width)
  const columns = grid && (grid.options.includes(picked) ? picked : grid.fallback)
  const isDesktop = width !== null && width >= 1024 // side panel; a drawer below this

  // Keep the address in step with the view. Short pause, as a dragged slider changes it many
  // times a second. replaceState: this updates the current history entry, adding none.
  const addressRef = useRef(searchParams.toString())
  useEffect(() => {
    if (width === null) return
    const params = new URLSearchParams()
    if (initCat !== 'all') params.set('category', initCat)
    if (initFilter) params.set('filter', initFilter)
    if (activeCategory !== urlCategory) params.set('tab', activeCategory)
    if (filters.sizes.length) params.set('sizes', filters.sizes.join(','))
    if (filters.availability.length) params.set('stock', filters.availability.join(','))
    if (filters.price[0] !== PRICE_MIN) params.set('min', filters.price[0])
    if (filters.price[1] !== PRICE_MAX) params.set('max', filters.price[1])
    if (sort !== 'new') params.set('sort', sort)
    if (picked) params.set('cols', picked)
    if (filterOpen && isDesktop) params.set('panel', '1')
    const next = params.toString()
    if (next === addressRef.current) return
    const t = setTimeout(() => {
      addressRef.current = next
      window.history.replaceState(null, '', next ? `${window.location.pathname}?${next}` : window.location.pathname)
    }, 120)
    return () => clearTimeout(t)
  }, [width, isDesktop, initCat, initFilter, urlCategory, activeCategory, filters, sort, picked, filterOpen])

  // An address we didn't write means a link was followed while this page stayed mounted
  // (e.g. the menu's Collections link): show what that address describes
  const address = searchParams.toString()
  useEffect(() => {
    if (address === addressRef.current) return
    addressRef.current = address
    const view = parseView(new URLSearchParams(address), urlCategory)
    setActiveCategory(view.tab)
    setFilters(view.filters)
    setSort(view.sort)
    setPicked(view.picked)
    setFilterOpen(view.panel)
  }, [address, urlCategory])

  // The filter panel is only remembered as open on large screens, never as a phone's drawer
  useEffect(() => {
    if (width !== null && !isDesktop && initialView.panel) setFilterOpen(false)
  }, [width, isDesktop, initialView])

  // Returning from a product: back to where the visitor was on the page. Once the grid has
  // its real columns, since the page isn't its full height before that.
  const scrollRestored = useRef(false)
  useEffect(() => {
    if (width === null || scrollRestored.current) return
    scrollRestored.current = true
    const flagged = store.get(RETURN_KEY)
    store.remove(RETURN_KEY)
    if (!flagged && Date.now() - lastPopState > 3000) return
    let saved = null
    try { saved = JSON.parse(store.get(LISTING_KEY)) } catch {}
    if (!saved || saved.url !== window.location.pathname + window.location.search) return
    requestAnimationFrame(() => window.scrollTo({ top: saved.y, behavior: 'instant' }))
  }, [width])

  // Opening a product remembers this view and position
  const rememberListing = (e) => {
    if (!e.target.closest('a[href^="/product/"]')) return
    store.set(LISTING_KEY, JSON.stringify({ url: window.location.pathname + window.location.search, y: Math.round(window.scrollY) }))
  }

  // Sort menu closes on an outside click
  useEffect(() => {
    if (!sortOpen) return
    const onDown = (e) => { if (!sortRef.current?.contains(e.target)) setSortOpen(false) }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [sortOpen])

  // Drawer: Escape closes it, and the page behind it doesn't scroll
  useEffect(() => {
    if (!filterOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setFilterOpen(false) }
    window.addEventListener('keydown', onKey)
    if (!isDesktop) document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [filterOpen, isDesktop])

  // Products in the current tab, before the filter panel applies
  const inTab = useMemo(() => {
    if (isWomen) {
      const tab = WOMEN_TABS.find(t => t.label === activeCategory) ?? WOMEN_TABS[1]
      return products.filter(p => p.gender === 'women' && tab.matches(p))
    }
    let list = [...products]
    if (initFilter === 'new') list = list.filter(p => p.newArrival || p.badge === 'New')
    if (activeCategory !== 'All') list = list.filter(p => inCategory(p, activeCategory.toLowerCase()))
    return list
  }, [activeCategory, initFilter, isWomen])

  const filtered = useMemo(() => {
    const { sizes, availability, price: [lo, hi] } = filters
    const list = inTab.filter(p =>
      (!sizes.length || p.sizes.some(s => sizes.includes(s))) &&
      (!availability.length || availability.includes(isInStock(p) ? 'in' : 'out')) &&
      p.price >= lo && p.price <= hi
    )
    if (sort === 'asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [inTab, filters, sort])

  const activeFilterCount = filters.sizes.length + filters.availability.length +
    (filters.price[0] !== PRICE_MIN || filters.price[1] !== PRICE_MAX ? 1 : 0)
  const clearFilters = () => changeView(() => setFilters(EMPTY_FILTERS))
  // A pause for price only, so a dragged slider doesn't move the page mid-drag
  const changeFilters = (next) => changeView(() => setFilters(next), next.price !== filters.price ? 150 : 0)
  const panel = (
    <FilterPanel
      products={inTab}
      filters={filters}
      onChange={changeFilters}
      onClear={clearFilters}
      activeCount={activeFilterCount}
    />
  )

  return (
    <div className="min-h-screen bg-white pt-[72px]">
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
            transition={{ duration: 0.9, ease: EASE }}
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

      {/* Category Tabs */}
      <div className="px-4 md:px-8 pt-5 flex gap-1 flex-wrap">
        {tabs.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[11px] tracking-[0.14em] uppercase px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-charcoal text-cream'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Toolbar: moves up into the navbar's space while the navbar is hidden */}
      <div ref={toolbarRef} className={`sticky z-40 bg-white/95 backdrop-blur-sm px-4 md:px-8 py-3 transition-[top] duration-200 ${navHidden ? 'top-0' : 'top-[72px]'}`}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            onClick={() => setFilterOpen(o => !o)}
            aria-expanded={filterOpen}
            className={`flex items-center gap-2 h-11 px-6 rounded-xl border text-[14px] font-medium transition-colors duration-300 ${
              filterOpen ? 'bg-charcoal border-charcoal text-white' : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h18l-7 8.5V19l-4 2v-8.5L3 4z" />
            </svg>
            Filter
            <AnimatePresence initial={false}>
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[12px] tabular-nums overflow-hidden"
                >
                  ({activeFilterCount})
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Sort sits last on larger screens, and beside Filter on phones */}
          <div ref={sortRef} className="relative order-none md:order-last ml-auto md:ml-0">
            <button
              onClick={() => setSortOpen(o => !o)}
              aria-expanded={sortOpen}
              className="flex items-center gap-3 h-11 px-4 rounded-xl border border-charcoal text-[14px] text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h11M4 17h7" />
              </svg>
              Sort by
              <span className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 9l7 7 7-7" />
                </svg>
              </span>
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute right-0 top-full mt-2 bg-white border border-sand rounded-xl overflow-hidden shadow-lg min-w-[200px] z-50"
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortOpen(false)
                        if (opt.value !== sort) changeView(() => setSort(opt.value))
                      }}
                      className={`block w-full text-left px-5 py-3 text-[13px] transition-colors duration-200 ${
                        sort === opt.value ? 'text-charcoal font-medium bg-linen' : 'text-muted hover:text-charcoal hover:bg-linen'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Count + grid size: their own line on phones */}
          <div className="w-full md:w-auto md:ml-auto flex items-center justify-between md:justify-end gap-5">
            <span className="text-[14px] font-semibold text-charcoal tabular-nums">
              {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
            </span>
            {grid && (
              <div className="flex items-center" role="group" aria-label="Products per row">
                {grid.options.map(n => (
                  <button
                    key={n}
                    onClick={() => { if (n !== columns) changeView(() => setPicked(n)) }}
                    aria-label={`${n} per row`}
                    aria-pressed={columns === n}
                    className="group/grid flex items-center gap-[3px] h-8 px-3 border-l border-sand first:border-l-0 last:border-r"
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-[3px] h-4 transition-colors duration-200 ${
                          columns === n ? 'bg-charcoal' : 'bg-charcoal/30 group-hover/grid:bg-charcoal/60'
                        }`}
                      />
                    ))}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Near-full-width grid: a slim 8px margin at the screen edges, narrow gaps between */}
      {/* The minimum height keeps the footer below the screen on arrival, even for few results */}
      <div ref={resultsRef} onClickCapture={rememberListing} className="flex items-start px-2 pt-3 pb-8 min-h-[calc(100svh-120px)]">
        {/* Side panel (large screens): opens by growing, pushing the products across */}
        <AnimatePresence initial={false}>
          {filterOpen && isDesktop && (
            <motion.aside
              key="filter-side"
              initial={{ width: 0, marginRight: 0, opacity: 0 }}
              animate={{ width: PANEL_WIDTH, marginRight: 12, opacity: 1 }}
              exit={{ width: 0, marginRight: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              // Follows the page below the toolbar, and scrolls inside itself if it's too tall
              className={`sticky flex-shrink-0 overflow-hidden transition-[top] duration-200 ${navHidden ? 'top-[78px]' : 'top-[150px]'}`}
            >
              <div
                style={{ width: PANEL_WIDTH }}
                className={`overflow-y-auto overscroll-contain no-scrollbar bg-white border border-sand rounded-2xl ${navHidden ? 'max-h-[calc(100vh-94px)]' : 'max-h-[calc(100vh-166px)]'}`}
              >
                {panel}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              // Not the measured column count: the first measurement mustn't restart the entrance
              key={activeCategory + sort + (picked ?? '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`grid gap-x-1.5 gap-y-8 ${columns ? '' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
              style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <ProductTile key={product.id} delay={(i % (columns ?? 4)) * 0.1}>
                    <ProductCard product={product} priority={i < 4} infoClassName="px-3 md:px-4" />
                  </ProductTile>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-[12px] tracking-[0.2em] uppercase text-muted font-medium mb-3">No pieces found</p>
              <button
                onClick={() => { clearFilters(); setActiveCategory(allTab) }}
                className="text-[11px] tracking-[0.18em] uppercase text-charcoal border-b border-charcoal pb-0.5 hover:text-gold hover:border-gold transition-colors duration-300 font-medium"
              >
                View all collections
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer (phones and tablets): slides in from the left over a blurred page */}
      <AnimatePresence>
        {filterOpen && width !== null && !isDesktop && (
          <motion.div
            key="filter-backdrop"
            aria-hidden="true"
            onClick={() => setFilterOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[230] bg-black/40 backdrop-blur-sm"
          />
        )}
        {filterOpen && width !== null && !isDesktop && (
          <motion.div
            key="filter-drawer"
            role="dialog"
            aria-label="Filter products"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed left-0 top-0 bottom-0 z-[231] w-[min(88vw,380px)] bg-white flex flex-col"
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 h-[60px] border-b border-sand">
              <span className="text-[15px] font-medium text-charcoal">Filter</span>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="w-9 h-9 -mr-2 flex items-center justify-center text-charcoal">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">{panel}</div>
            <div className="flex-shrink-0 p-4 border-t border-sand">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full h-12 rounded-xl bg-charcoal text-white text-[14px] font-medium"
              >
                Show {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
