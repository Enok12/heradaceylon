import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: 'Herada Ceylon — Luxury Sri Lankan Fashion',
  description: 'Heritage textiles, reimagined for the modern woman. Handcrafted in Sri Lanka.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {/* Intro loader — plays once per session */}
          <Loader />

          {/* Persistent across all routes */}
          <Navbar />
          <CartDrawer />

          {/* Page-level fade+up transition */}
          <PageTransition>
            <main>{children}</main>
          </PageTransition>

          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
