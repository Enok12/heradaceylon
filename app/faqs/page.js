import InfoPage, { Fill, P, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'FAQs — Herada Ceylon',
  description: 'Answers to common questions about Herada Ceylon orders, delivery, sizing and care.',
}

const GROUPS = [
  {
    title: 'Orders & payment',
    items: [
      {
        q: 'How do I place an order?',
        a: <>Choose your piece, select a size and quantity, then add it to your bag. At checkout, enter your details and delivery address, choose a delivery option and pay. You'll see an order number starting with HC- once it's confirmed.</>,
      },
      {
        q: 'Which payment methods do you accept?',
        a: <>You can pay by <Fill>credit or debit card, or PayPal</Fill>. All prices are shown in US dollars.</>,
      },
      {
        q: 'Can I change or cancel my order?',
        a: <>Contact us as soon as you can. We can usually change or cancel an order until it has been dispatched. See our <TextLink href="/contact">contact details</TextLink>.</>,
      },
    ],
  },
  {
    title: 'Delivery',
    items: [
      {
        q: 'How long will delivery take?',
        a: <>Standard delivery takes 7–14 business days and express takes 3–5 business days. Read more in our <TextLink href="/shipping">Shipping Policy</TextLink>.</>,
      },
      {
        q: 'Is shipping free?',
        a: <>Standard shipping is complimentary on orders over USD 300. Express delivery is available at checkout for an additional charge.</>,
      },
      {
        q: 'Do you ship internationally?',
        a: <>Yes, we deliver from Sri Lanka to <Fill>the United Kingdom, United States, Australia, Canada, Germany, France, the UAE, Singapore and India</Fill>, as well as within Sri Lanka. Import duties may apply in your country.</>,
      },
    ],
  },
  {
    title: 'Returns',
    items: [
      {
        q: 'Can I return something?',
        a: <>Yes. Unworn items in their original condition can be returned within <Fill>14 days</Fill> of delivery. Some items, such as limited editions and made-to-order pieces, are final sale. See our <TextLink href="/returns">Return Policy</TextLink>.</>,
      },
      {
        q: 'What if my item arrives damaged?',
        a: <>Please contact us within <Fill>7 days</Fill> of delivery with your order number and photos, and we'll put it right.</>,
      },
    ],
  },
  {
    title: 'Sizing & care',
    items: [
      {
        q: 'How do I find my size?',
        a: <>Available sizes are shown on each product page. If you're between sizes or unsure, <TextLink href="/contact">ask our team</TextLink> and we'll help you choose.</>,
      },
      {
        q: 'How should I care for handwoven pieces?',
        a: <>Each product page lists the fabric and care instructions for that piece, so please follow those first. As a general guide, wash handloom cotton and linen cold and gently, keep silk for dry cleaning, and dry away from direct sun to protect natural dyes.</>,
      },
      {
        q: 'Why do handwoven pieces vary slightly?',
        a: <>Small differences in weave and colour are a natural part of hand-made cloth and natural dyes. They aren't defects; they're what makes each piece its own.</>,
      },
    ],
  },
]

const SERIF = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

export default function FaqsPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="FAQs"
      intro="Quick answers to the questions we hear most. Can't find what you need? Our team is happy to help."
    >
      {GROUPS.map(({ title, items }) => (
        <section key={title} className="mb-10">
          <h2 style={SERIF} className="text-[clamp(24px,2.4vw,30px)] font-medium text-charcoal mb-3">{title}</h2>
          <div className="border-t border-sand">
            {items.map(({ q, a }) => (
              <details key={q} className="group border-b border-sand">
                <summary className="flex items-center justify-between gap-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[15px] font-medium text-charcoal hover:text-gold transition-colors duration-200">
                  {q}
                  <span aria-hidden="true" className="text-[20px] leading-none text-charcoal/50 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div className="pb-2 pr-8"><P>{a}</P></div>
              </details>
            ))}
          </div>
        </section>
      ))}
      <P>Still have a question? <TextLink href="/contact">Contact us</TextLink>.</P>
    </InfoPage>
  )
}
