'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQty } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-espresso/40 z-[100] backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-mist z-[101] flex flex-col shadow-[-8px_0_48px_rgba(30,18,8,0.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-sand">
              <span className="text-[10px] tracking-[0.22em] uppercase font-normal text-charcoal">
                Your Selection
                <span className="ml-2 text-muted">({count})</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 border border-warm flex items-center justify-center text-charcoal text-sm hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-300"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 cart-scroll px-8 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <span className="text-4xl opacity-10">◻</span>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-muted font-normal">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 text-[9px] tracking-[0.2em] uppercase border-b border-charcoal pb-0.5 text-charcoal hover:text-gold hover:border-gold transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-5 mb-7 pb-7 border-b border-sand last:border-0"
                    >
                      <div className="relative w-[88px] h-[110px] flex-shrink-0 bg-sand overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="88px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-[16px] font-normal text-charcoal mb-1 leading-snug">
                          {item.product.name}
                        </p>
                        <p className="text-[9px] tracking-[0.14em] uppercase text-muted mb-3 font-normal">
                          Size: {item.size} · {item.product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQty(item.key, -1)}
                              className="w-6 h-6 border border-warm flex items-center justify-center text-charcoal text-sm hover:bg-charcoal hover:text-cream transition-all duration-200"
                            >
                              −
                            </button>
                            <span className="text-[12px] min-w-[16px] text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.key, 1)}
                              className="w-6 h-6 border border-warm flex items-center justify-center text-charcoal text-sm hover:bg-charcoal hover:text-cream transition-all duration-200"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[13px] tracking-[0.06em] text-charcoal">
                            USD {(item.product.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="mt-2 text-[9px] tracking-[0.14em] uppercase text-muted hover:text-charcoal transition-colors duration-300 font-normal"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-8 py-6 border-t border-sand bg-mist"
              >
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-[9px] tracking-[0.18em] uppercase text-muted font-normal">Subtotal</span>
                  <span className="font-serif text-[22px] font-normal text-charcoal">
                    USD {total.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] tracking-[0.04em] text-muted font-normal leading-relaxed mb-5">
                  Complimentary shipping on orders over USD 300. Duties and taxes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.24em] uppercase font-normal hover:bg-espresso active:scale-[0.99] transition-all duration-400"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-3 py-3 border border-warm text-[9px] tracking-[0.2em] uppercase text-charcoal font-normal hover:border-charcoal transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
