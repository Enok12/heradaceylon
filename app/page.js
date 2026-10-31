import products from '@/data/products.json'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import FeaturedCollection from '@/components/FeaturedCollection'
import CategoryBlocks from '@/components/CategoryBlocks'
import NewArrivals from '@/components/NewArrivals'
import EditorialBanner from '@/components/EditorialBanner'
import BrandStory from '@/components/BrandStory'

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals products={products} />
      <Ticker />
      <FeaturedCollection products={products} />
      <CategoryBlocks />
      <EditorialBanner />
      <BrandStory />
    </>
  )
}
