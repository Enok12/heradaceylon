import Link from 'next/link'

// Set directly: Tailwind's font-serif points at a --font-cormorant variable that isn't defined
const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

// Highlights details the business still has to confirm. Once every value in these pages has
// been checked, set this to false and the highlighting disappears everywhere.
const SHOW_DRAFT_MARKS = true

export function Fill({ children }) {
  if (!SHOW_DRAFT_MARKS) return children
  return <mark title="To be confirmed" className="bg-gold/25 text-charcoal rounded px-1">{children}</mark>
}

export function P({ children }) {
  return <p className="text-[15px] leading-[1.8] text-charcoal/80 mb-4">{children}</p>
}

export function List({ items }) {
  return (
    <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-gold">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] leading-[1.7] text-charcoal/80">{item}</li>
      ))}
    </ul>
  )
}

export function TextLink({ href, children }) {
  return <Link href={href} className="text-charcoal underline underline-offset-4 hover:text-gold transition-colors duration-200">{children}</Link>
}

export function Section({ title, children }) {
  return (
    <section className="mb-11">
      <h2 style={SERIF} className="text-[clamp(24px,2.4vw,30px)] font-medium text-charcoal leading-tight mb-4">{title}</h2>
      {children}
    </section>
  )
}

// Shared layout for the About, Contact, FAQ and policy pages
export default function InfoPage({ eyebrow, title, intro, updated, children }) {
  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <header className="px-6 md:px-16 pt-14 md:pt-20 pb-10 md:pb-14 border-b border-sand">
        <div className="max-w-3xl mx-auto">
          <p className="hero-fade-up flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-gold font-medium mb-4">
            <span className="w-6 h-px bg-gold inline-block" />
            {eyebrow}
          </p>
          <h1 style={SERIF} className="hero-fade-up-2 text-[clamp(40px,6vw,68px)] font-medium text-charcoal leading-[1.05]">{title}</h1>
          {intro && <p className="hero-fade-up-2 text-[16px] leading-[1.75] text-charcoal/75 mt-5 max-w-2xl">{intro}</p>}
          {updated && <p className="hero-fade-up-2 text-[12px] tracking-[0.06em] text-muted mt-5">Last updated: {updated}</p>}
        </div>
      </header>
      <div className="px-6 md:px-16 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
