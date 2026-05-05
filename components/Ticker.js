const ITEMS = [
  'New Collection 2025',
  'Handwoven in Sri Lanka',
  'Free Shipping on Orders Over USD 300',
  'Artisan Crafted · Since 2018',
  'Heritage Textiles Reimagined',
]

export default function Ticker() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="bg-charcoal py-3 overflow-hidden select-none">
      <div className="ticker-animate flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-[9px] tracking-[0.24em] uppercase text-sand/70 font-light px-8"
          >
            <span className="text-gold text-[5px]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
