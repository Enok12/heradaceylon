import InfoPage, { Fill, List, P, Section, TextLink } from '@/components/info/InfoPage'

export const metadata = {
  title: 'Privacy Policy — Herada Ceylon',
  description: 'How Herada Ceylon collects, uses and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains what personal information Herada Ceylon collects when you use our website or place an order, how we use it, and the choices you have."
      updated={<Fill>Add date</Fill>}
    >
      <Section title="Who we are">
        <P>
          This website is operated by <Fill>registered company name and number</Fill>, based in Colombo,
          Sri Lanka ("Herada Ceylon", "we", "us"). You can reach us about privacy
          at <Fill>privacy email address</Fill>.
        </P>
      </Section>

      <Section title="Information we collect">
        <P>We collect the information you give us, including:</P>
        <List items={[
          'Contact details: your name, email address and phone number',
          'Delivery and billing addresses',
          'Order details: the items you buy, sizes and order history',
          'Payment details, which are handled by our payment providers',
          'Your email address if you join our mailing list',
          'Anything you send us when you contact our team',
        ]} />
        <P>
          We also collect limited technical information when you browse, such as your device and browser
          type. <Fill>Update this section if analytics or advertising tools are added.</Fill>
        </P>
      </Section>

      <Section title="How we use your information">
        <List items={[
          'To process, deliver and support your orders',
          'To respond to your questions, returns and requests',
          'To send order and delivery updates',
          'To send marketing emails, if you have opted in',
          'To keep our website secure and improve how it works',
          'To meet our legal, tax and accounting obligations',
        ]} />
      </Section>

      <Section title="Who we share it with">
        <P>We don't sell your personal information. We share it only where needed, with:</P>
        <List items={[
          <>Payment providers such as <Fill>card processor and PayPal</Fill></>,
          <>Delivery and courier companies such as <Fill>courier names</Fill></>,
          <>Service providers that help us run our website and send email: <Fill>hosting and email providers</Fill></>,
          'Authorities, where the law requires it',
        ]} />
        <P>
          As we ship internationally and use service providers, your information may be processed outside
          the country you live in. We take reasonable steps to keep it protected when that happens.
        </P>
      </Section>

      <Section title="Cookies and local storage">
        <P>
          We use your browser's storage for essential site functions, for example to remember that you've
          already seen our welcome screen during a visit. <Fill>List any cookies added later, such as for analytics or advertising.</Fill>
        </P>
      </Section>

      <Section title="How long we keep it">
        <P>
          We keep your information only as long as needed for the purposes above, including order records
          for <Fill>the period required by tax and accounting law</Fill>. Marketing data is kept until you unsubscribe.
        </P>
      </Section>

      <Section title="Your rights">
        <P>
          Subject to the law that applies to you, including Sri Lanka's Personal Data Protection Act
          No. 9 of 2022, you may ask to:
        </P>
        <List items={[
          'Access the personal information we hold about you',
          'Correct information that is inaccurate',
          'Have your information deleted, where we have no legal need to keep it',
          'Object to or withdraw consent for certain uses, including marketing',
        ]} />
        <P>To make a request, <TextLink href="/contact">contact us</TextLink>. You can unsubscribe from marketing at any time using the link in our emails.</P>
      </Section>

      <Section title="Security">
        <P>We use reasonable technical and organisational measures to protect your information, though no method of transmission over the internet is completely secure.</P>
      </Section>

      <Section title="Children">
        <P>Our website isn't directed at children, and we don't knowingly collect personal information from them.</P>
      </Section>

      <Section title="Changes to this policy">
        <P>We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated.</P>
      </Section>
    </InfoPage>
  )
}
