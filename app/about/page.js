import Image from 'next/image'
import InfoPage, { Fill, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'About Us — Herada Ceylon',
  description: 'Heritage textiles from Sri Lanka, reimagined for the modern wardrobe.',
}

const STATS = [
  { num: '2018', label: 'Established' },
  { num: '47', label: 'Artisan families' },
  { num: '3', label: 'Weaving districts' },
]

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Our Story"
      title="Wear to Dominate"
      intro="Herada Ceylon is a Sri Lankan fashion house built on a simple belief: what you wear should carry weight. Every piece begins with the island's textile heritage and ends with a garment made to be worn with confidence."
    >
      <div className="relative w-40 md:w-52 aspect-[635/641] mx-auto mb-14">
        <Image src="/images/logo/embossed-symbol.png" alt="The Herada Ceylon seal" fill unoptimized className="object-contain" />
      </div>

      <Section title="Rooted in the island">
        <P>
          Sri Lanka has been weaving for centuries. Handloom techniques have been handed down through
          families, each generation adding its own hand to the craft. Herada Ceylon was founded in
          Colombo in <Fill>2018</Fill> to carry that knowledge forward, not as a museum piece but as
          clothing for how people live today.
        </P>
        <P>
          We work directly with master weavers across the <Fill>Kandy, Galle and Jaffna</Fill> districts,
          partnering with <Fill>47</Fill> artisan families who bring decades of skill to every length of cloth.
        </P>
      </Section>

      <div className="grid grid-cols-3 gap-4 border-y border-sand py-8 mb-11">
        {STATS.map(({ num, label }) => (
          <div key={label} className="text-center">
            <p className="text-[clamp(26px,4vw,40px)] font-medium text-gold leading-none mb-2">{num}</p>
            <p className="text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-muted font-medium">{label}</p>
          </div>
        ))}
      </div>

      <Section title="What we stand for">
        <P>
          <strong className="font-medium text-charcoal">Craft first.</strong> We favour the slower way of
          making things: natural fibres, hand finishing and careful inspection before anything leaves our hands.
        </P>
        <P>
          <strong className="font-medium text-charcoal">Presence.</strong> "Wear to Dominate" is not about
          being the loudest in the room. It's the quiet authority of clothing that fits well, is made well
          and means something.
        </P>
        <P>
          <strong className="font-medium text-charcoal">Fair partnership.</strong> Working directly with
          weavers keeps their skill visible and their craft alive for the generations that follow.
        </P>
      </Section>

      <Section title="Explore">
        <P>
          See the latest pieces in our <TextLink href="/collections?filter=new">New Arrivals</TextLink>, browse
          the full <TextLink href="/collections">Collections</TextLink>, or <TextLink href="/contact">get in touch</TextLink> with
          our team.
        </P>
      </Section>
    </InfoPage>
  )
}
