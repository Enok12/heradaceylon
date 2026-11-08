import InfoPage, { Fill, List, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'Terms & Conditions — Herada Ceylon',
  description: 'The terms that apply when you use the Herada Ceylon website and place an order.',
}

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="These terms apply when you use the Herada Ceylon website or buy from us. Please read them before placing an order."
      updated={<Fill>Add date</Fill>}
    >
      <Section title="About us">
        <P>
          This website is operated by <Fill>registered company name and number</Fill>, based in Colombo,
          Sri Lanka ("Herada Ceylon", "we", "us"). You can reach us through our <TextLink href="/contact">contact page</TextLink>.
        </P>
      </Section>

      <Section title="Using our website">
        <P>By using this website, you agree to these terms. You agree to give accurate information and not to misuse the website or interfere with how it works.</P>
      </Section>

      <Section title="Products">
        <P>
          Our pieces are often handwoven and coloured with natural dyes, so slight variations in weave,
          colour and finish are a natural part of each one. We try to show products accurately, but colours
          may look different depending on your screen.
        </P>
        <P>Limited-edition and small-batch pieces are subject to availability.</P>
      </Section>

      <Section title="Prices and payment">
        <P>
          Prices are shown in US dollars. Shipping charges and any applicable taxes are shown at checkout before
          you pay. Payment is taken at the time of your order. We may correct pricing errors and, if an
          error affects your order, we'll contact you before going ahead.
        </P>
      </Section>

      <Section title="Your order">
        <P>
          Your order is an offer to buy. It's accepted once we confirm it or dispatch your items. We may
          decline or cancel an order, for example if an item is unavailable or there's a pricing error or
          suspected fraud. If so, we'll refund anything you've paid.
        </P>
      </Section>

      <Section title="Delivery">
        <P>Delivery options, times and charges are explained in our <TextLink href="/shipping">Shipping Policy</TextLink>. Delivery estimates aren't guaranteed, as carriers and customs can cause delays.</P>
      </Section>

      <Section title="Returns and refunds">
        <P>Returns, exchanges and refunds are covered by our <TextLink href="/returns">Return Policy</TextLink>.</P>
      </Section>

      <Section title="Intellectual property">
        <P>
          The Herada Ceylon name, logos, designs, photographs and website content belong to us or our
          licensors. Please don't copy or reuse them without our written permission.
        </P>
      </Section>

      <Section title="Your information">
        <P>We handle your personal information as described in our <TextLink href="/privacy">Privacy Policy</TextLink>.</P>
      </Section>

      <Section title="Our liability">
        <List items={[
          'We are responsible for losses that are a foreseeable result of our breaking these terms.',
          'We aren\'t responsible for indirect losses, or for delays or failures caused by events outside our reasonable control.',
          'Nothing in these terms limits any liability or consumer rights that cannot legally be limited.',
        ]} />
      </Section>

      <Section title="Changes to these terms">
        <P>We may update these terms from time to time. The version on this page when you place your order is the one that applies to it.</P>
      </Section>

      <Section title="Governing law">
        <P>These terms are governed by the laws of <Fill>Sri Lanka</Fill>, and disputes will be handled by its courts. If you buy as a consumer abroad, you may also have rights under the laws of your own country.</P>
      </Section>
    </InfoPage>
  )
}
