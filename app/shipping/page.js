import InfoPage, { Fill, List, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'Shipping Policy — Herada Ceylon',
  description: 'Delivery times, charges and destinations for Herada Ceylon orders.',
}

const METHODS = [
  { name: 'Standard Delivery', time: '7–14 business days', cost: <>Complimentary on orders over USD 300; <Fill>USD XX</Fill> on smaller orders</> },
  { name: 'Express Delivery', time: '3–5 business days', cost: 'USD 35' },
]

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Shipping Policy"
      intro="Every Herada Ceylon piece is inspected and carefully wrapped by our team in Colombo before it begins its journey to you."
      updated={<Fill>Add date</Fill>}
    >
      <Section title="Delivery options">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-[14px] border-collapse">
            <thead>
              <tr className="border-b border-charcoal/20">
                {['Method', 'Delivery time', 'Cost'].map((h) => (
                  <th key={h} className="py-3 pr-4 text-[11px] tracking-[0.16em] uppercase font-medium text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METHODS.map(({ name, time, cost }) => (
                <tr key={name} className="border-b border-sand align-top">
                  <td className="py-4 pr-4 font-medium text-charcoal">{name}</td>
                  <td className="py-4 pr-4 text-charcoal/80">{time}</td>
                  <td className="py-4 text-charcoal/80">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Delivery times are estimates that begin once your order has been dispatched. Limited-edition
          pieces ship with complimentary express delivery worldwide, where stated on the product page.
        </P>
      </Section>

      <Section title="Processing time">
        <P>
          Orders are usually prepared and dispatched within <Fill>1–3 business days</Fill>. Business days
          are Monday to Friday, excluding Sri Lankan public holidays.
        </P>
      </Section>

      <Section title="Where we deliver">
        <P>We currently deliver to:</P>
        <List items={[<Fill key="c">Sri Lanka, the United Kingdom, the United States, Australia, Canada, Germany, France, the UAE, Singapore and India</Fill>]} />
        <P>If your country isn't listed, please <TextLink href="/contact">contact us</TextLink> and we'll see what we can do.</P>
      </Section>

      <Section title="Tracking">
        <P>
          Once your order is dispatched, we'll send you tracking information by email so you can follow
          its progress.
        </P>
      </Section>

      <Section title="Customs and import duties">
        <P>
          International orders may be subject to import duties and taxes charged by the destination
          country. <Fill>These charges are the customer's responsibility</Fill> and aren't included in your
          order total unless stated at checkout.
        </P>
      </Section>

      <Section title="Delays and lost parcels">
        <P>
          Carrier and customs delays are occasionally outside our control. If your parcel appears to be
          lost or significantly late, <TextLink href="/contact">contact us</TextLink> and we'll work with the
          carrier to resolve it.
        </P>
        <P>Please check your delivery address carefully at checkout, as we can't guarantee redirecting a parcel once it has shipped.</P>
      </Section>
    </InfoPage>
  )
}
