import LogoIntro from '@/components/home/LogoIntro'
import CategoryTiles from '@/components/home/CategoryTiles'
import SectionSnap from '@/components/home/SectionSnap'
import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <>
      <SectionSnap />
      <div data-snap-section><LogoIntro /></div>
      <div data-snap-section data-snap-transition="fade"><CategoryTiles /></div>
      <div data-snap-section><Hero /></div>
    </>
  )
}
