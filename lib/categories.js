// Shop categories for the Test Page tiles. `matches` mirrors the collections page filter
// so each tile's piece count agrees with what clicking through shows.
export const CATEGORIES = [
  {
    slug: 'new',
    label: 'New Arrivals',
    href: '/collections?filter=new',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=85',
    focus: 'center',
    matches: (p) => p.newArrival || p.badge === 'New',
  },
  {
    slug: 'women',
    label: 'Women',
    href: '/collections?category=women',
    image: '/images/hero/cover-2.jpg',
    focus: '90% center', // first paint, before the tile is measured
    // Smart crop (horizontal fractions of the photo): keep `subject` centred and the
    // window inside `safe`, which excludes the printed wordmark. See useSmartCrop.
    crop: { aspect: 2752 / 1536, subject: [0.66, 0.86], safe: [0.62, 1] },
    matches: (p) => p.gender === 'women',
  },
  {
    slug: 'men',
    label: 'Men',
    comingSoon: true, // tile shows "Coming soon" and isn't clickable
    href: '/collections?category=men',
    image: '/images/hero/cover-1.jpg',
    focus: '8% center',
    crop: { aspect: 2752 / 1536, subject: [0.18, 0.33], safe: [0, 0.39] },
    matches: (p) => p.gender === 'men',
  },
  {
    slug: 'sarees',
    label: 'Sarees',
    href: '/collections?category=sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85',
    focus: 'center',
    matches: (p) => p.category === 'sarees',
  },
  {
    slug: 'contemporary',
    label: 'Contemporary',
    href: '/collections?category=contemporary',
    image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=900&q=85',
    focus: 'center 30%',
    matches: (p) => p.category === 'contemporary',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    href: '/collections?category=accessories',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
    focus: 'center',
    matches: (p) => p.category === 'accessories',
  },
  {
    slug: 'bags',
    label: 'Bags',
    href: '/collections?category=bags',
    image: null, // no bag photography yet; the tile renders typographically
    matches: (p) => p.category === 'bags',
  },
]

// Collections page: a product belongs to a category slug by category or by gender
export const inCategory = (product, slug) => product.category === slug || product.gender === slug
