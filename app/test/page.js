import LogoIntro from '@/components/test/LogoIntro'
import CategoryTiles from '@/components/test/CategoryTiles'
import SectionSnap from '@/components/test/SectionSnap'
import Hero from '@/components/Hero'

// Alternate homepage under review by the client. If approved it replaces app/page.js.
export const metadata = {
  title: 'Herada Ceylon — Test Page',
}

export default function TestPage() {
  return (
    <>
      <SectionSnap />
      <div data-snap-section><LogoIntro /></div>
      <div data-snap-section data-snap-transition="fade"><CategoryTiles /></div>
      <div data-snap-section><Hero /></div>
    </>
  )
}
