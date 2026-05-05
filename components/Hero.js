'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden flex items-end">
      {/* Background */}
      <div
        className="absolute inset-0 hero-zoom bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=85')`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 pb-20 max-w-2xl">
        <p className="hero-fade-up flex items-center gap-3 text-[9px] tracking-[0.28em] uppercase text-sand/80 font-light mb-6">
          <span className="w-9 h-px bg-sand/60 inline-block" />
          New Collection 2025
        </p>
        <h1 className="hero-fade-up-2 font-serif font-light text-[#F9F5F0] leading-[0.93] tracking-[-0.01em] mb-8"
          style={{ fontSize: 'clamp(60px, 9vw, 108px)' }}>
          Woven from<br />
          <em className="italic">Ceylon's</em><br />
          Soul
        </h1>
        <p className="hero-fade-up text-[11px] tracking-[0.14em] uppercase text-cream/60 font-light mb-10 max-w-xs leading-loose"
          style={{ animationDelay: '0.9s' }}>
          Heritage textiles, reimagined for the modern woman. Handcrafted in Sri Lanka.
        </p>
        <Link
          href="/collections"
          className="hero-fade-up inline-flex items-center gap-4 text-[10px] tracking-[0.22em] uppercase text-cream border border-cream/40 px-9 py-4 hover:border-cream/90 hover:bg-cream/10 transition-all duration-500 group"
          style={{ animationDelay: '1.1s' }}
        >
          Discover Collection
          <span className="relative inline-block w-6 h-px bg-current transition-all duration-500 group-hover:w-10">
            <span className="absolute -right-px -top-[3px] w-[6px] h-[6px] border-r border-t border-current rotate-45" />
          </span>
        </Link>
      </div>

      {/* Scroll hint */}
      <div className="absolute right-10 bottom-20 z-10 hidden md:flex flex-col items-center gap-4">
        <span
          className="[writing-mode:vertical-rl] text-[8px] tracking-[0.26em] uppercase text-cream/40 font-light hero-fade-up"
          style={{ animationDelay: '1.4s' }}
        >
          Scroll to explore
        </span>
        <span className="w-px h-12 bg-cream/20" />
      </div>
    </section>
  )
}
