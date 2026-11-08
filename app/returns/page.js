import InfoPage, { Fill, List, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'Return Policy — Herada Ceylon',
  description: 'How returns, exchanges and refunds work at Herada Ceylon.',
}

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Return Policy"
      intro="We want you to love what you wear. If a piece isn't right, here's how we can help."
      updated={<Fill>Add date</Fill>}
    >
      <Section title="Returning an item">
        <P>You can return an item within <Fill>14 days</Fill> of delivery, as long as it is:</P>
        <List items={[
          'Unworn, unwashed and unaltered',
          'In its original condition, with all tags attached',
          'In its original packaging where possible',
        ]} />
      </Section>

      <Section title="Items we can't accept back">
        <P>Unless they arrive faulty, the following are final sale:</P>
        <List items={[
          <Fill key="a">Limited-edition pieces</Fill>,
          <Fill key="b">Custom and made-to-order pieces</Fill>,
          <Fill key="c">Sale items and gift cards</Fill>,
        ]} />
      </Section>

      <Section title="How to return">
        <List items={[
          <>Email us through our <TextLink href="/contact">contact page</TextLink> with your order number (starting with HC-) and the item you'd like to return.</>,
          "We'll confirm your return and send you the return address and instructions.",
          'Pack the item securely and send it using a tracked service.',
        ]} />
        <P>Please wait for our confirmation before sending anything back.</P>
      </Section>

      <Section title="Return shipping costs">
        <P>
          <Fill>Return shipping is paid by the customer</Fill>, unless the item arrived faulty or we sent
          the wrong piece. Original shipping charges are not refundable.
        </P>
      </Section>

      <Section title="Refunds">
        <P>
          Once we've received and inspected your return, we'll let you know the outcome. Approved refunds
          go back to your original payment method within <Fill>7–10 business days</Fill>. Your bank or
          payment provider may take a little longer to show it.
        </P>
      </Section>

      <Section title="Exchanges">
        <P>
          Need a different size? <TextLink href="/contact">Contact us</TextLink> and we'll check availability.
          As many of our pieces are made in small quantities, an exchange may not always be possible, in which
          case we'll offer a refund.
        </P>
      </Section>

      <Section title="Faulty or incorrect items">
        <P>
          If your item arrives damaged or isn't what you ordered, tell us within <Fill>7 days</Fill> of delivery
          with your order number and photos. We'll arrange a replacement or full refund, including shipping costs.
        </P>
        <P>
          Slight variations in weave and colour are a natural feature of handwoven cloth and natural dyes,
          and aren't considered faults.
        </P>
      </Section>

      <Section title="Your legal rights">
        <P>Nothing in this policy limits any rights you have under the consumer laws that apply to you.</P>
      </Section>
    </InfoPage>
  )
}
