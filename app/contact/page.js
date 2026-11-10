import InfoPage, { Fill, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'Contact Us — Herada Ceylon',
  description: 'Get in touch with the Herada Ceylon team about orders, sizing and returns.',
}

const CHANNELS = [
  { label: 'Email', value: 'hello@heradaceylon.com' },
  { label: 'Phone / WhatsApp', value: '+94 XX XXX XXXX' },
  { label: 'Hours', value: 'Monday to Friday, 9:00am to 5:30pm (Sri Lanka time)' },
  { label: 'Studio', value: 'Street address, Colombo, Sri Lanka' },
]

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Contact Us"
      intro="Questions about an order, sizing or a piece you've had your eye on? We'd love to hear from you."
    >
      <dl className="grid sm:grid-cols-2 gap-px bg-sand border border-sand rounded-2xl overflow-hidden mb-12">
        {CHANNELS.map(({ label, value }) => (
          <div key={label} className="bg-white p-6">
            <dt className="text-[11px] tracking-[0.2em] uppercase text-muted font-medium mb-2">{label}</dt>
            <dd className="text-[15px] leading-relaxed text-charcoal"><Fill>{value}</Fill></dd>
          </div>
        ))}
      </dl>

      <Section title="To help us reply quickly">
        <P>
          Please include your order number (it starts with HC-) and, for anything about a delivered piece,
          a photo if you can. We aim to reply within <Fill>2 business days</Fill>.
        </P>
      </Section>

      <Section title="You may find your answer here">
        <P>
          Many common questions are covered in our <TextLink href="/faqs">FAQs</TextLink>, along with our <TextLink href="/shipping">Shipping Policy</TextLink> and <TextLink href="/returns">Return Policy</TextLink>.
        </P>
      </Section>
    </InfoPage>
  )
}
