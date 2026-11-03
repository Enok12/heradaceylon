'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

/* ─── tiny shared input style ─── */
const inputCls =
  'w-full border border-sand bg-cream px-4 py-3 text-[12px] tracking-[0.04em] text-charcoal font-normal placeholder:text-muted/60 outline-none focus:border-charcoal transition-colors duration-300'

const selectCls =
  'w-full border border-sand bg-cream px-4 py-3 text-[12px] tracking-[0.04em] text-charcoal font-normal outline-none focus:border-charcoal transition-colors duration-300 appearance-none cursor-pointer'

/* ─── step labels ─── */
const STEPS = ['Bag', 'Information', 'Shipping', 'Payment']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-normal transition-all duration-500 ${
                  done
                    ? 'bg-gold text-cream'
                    : active
                    ? 'bg-charcoal text-cream'
                    : 'bg-sand text-muted'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-[8px] tracking-[0.16em] uppercase font-normal whitespace-nowrap ${
                  active ? 'text-charcoal' : done ? 'text-gold' : 'text-muted'
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-12 md:w-20 mx-2 mb-4 transition-all duration-700 ${
                  done ? 'bg-gold' : 'bg-sand'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-serif text-[22px] font-normal text-charcoal mb-6 flex items-center gap-3">
      {children}
    </h2>
  )
}

function FormRow({ children, cols = 2 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4 mb-4`}>
      {children}
    </div>
  )
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[9px] tracking-[0.18em] uppercase text-muted font-normal mb-2">
      {children}
      {required && <span className="text-gold ml-0.5">*</span>}
    </label>
  )
}

/* ─── ORDER SUMMARY ─── */
function OrderSummary({ items, total, shipping, collapsed, onToggle }) {
  const tax = Math.round(total * 0.08)
  const grandTotal = total + (shipping === 0 ? 0 : shipping) + tax

  return (
    <div className="bg-linen border border-sand">
      {/* Toggle header (mobile) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 md:cursor-default"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-normal text-charcoal">
          Order Summary
          <span className="ml-2 text-muted">({items.reduce((s, i) => s + i.qty, 0)} items)</span>
        </span>
        <span className="text-[18px] font-normal text-charcoal font-serif">
          USD {(grandTotal).toLocaleString()}
        </span>
      </button>

      {/* Items */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 border-t border-sand">
              <div className="pt-4 space-y-5">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-4">
                    <div className="relative w-16 h-20 flex-shrink-0 bg-sand overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-charcoal text-cream text-[9px] flex items-center justify-center font-normal">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[15px] font-normal text-charcoal leading-snug mb-0.5">
                        {item.product.name}
                      </p>
                      <p className="text-[9px] tracking-[0.14em] uppercase text-muted font-normal mb-1">
                        Size: {item.size}
                      </p>
                      <p className="text-[12px] text-charcoal font-normal">
                        USD {(item.product.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="mt-6 mb-4 flex border border-sand">
                <input
                  type="text"
                  placeholder="Gift card or discount code"
                  className="flex-1 px-4 py-2.5 bg-cream text-[11px] tracking-[0.04em] text-charcoal font-normal placeholder:text-muted/50 outline-none"
                />
                <button className="px-5 py-2.5 text-[9px] tracking-[0.18em] uppercase text-charcoal font-normal border-l border-sand hover:bg-charcoal hover:text-cream transition-all duration-300 whitespace-nowrap">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-2.5 pt-4 border-t border-sand">
                {[
                  ['Subtotal', `USD ${total.toLocaleString()}`],
                  ['Shipping', shipping === 0 ? 'Complimentary' : `USD ${shipping}`],
                  ['Estimated Tax', `USD ${tax.toLocaleString()}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[10px] tracking-[0.1em] uppercase text-muted font-normal">{label}</span>
                    <span className={`text-[11px] font-normal ${val === 'Complimentary' ? 'text-gold' : 'text-charcoal'}`}>{val}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-sand mt-3">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-charcoal font-normal">Total</span>
                  <span className="font-serif text-[20px] font-normal text-charcoal">
                    USD {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── INFORMATION FORM ─── */
function InformationStep({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!data.email) e.email = true
    if (!data.firstName) e.firstName = true
    if (!data.lastName) e.lastName = true
    if (!data.address) e.address = true
    if (!data.city) e.city = true
    if (!data.country) e.country = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Contact */}
      <div className="mb-10">
        <div className="flex justify-between items-baseline mb-5">
          <SectionTitle>Contact</SectionTitle>
          <span className="text-[10px] tracking-[0.12em] text-muted font-normal">
            Already have an account?{' '}
            <Link href="#" className="text-charcoal border-b border-charcoal/30 hover:border-charcoal no-underline transition-all duration-300">
              Log in
            </Link>
          </span>
        </div>
        <div className="mb-4">
          <FieldLabel required>Email address</FieldLabel>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            placeholder="your@email.com"
            className={`${inputCls} ${errors.email ? 'border-red-300' : ''}`}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => onChange('emailOffers', !data.emailOffers)}
            className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer ${
              data.emailOffers ? 'bg-charcoal border-charcoal' : 'border-warm group-hover:border-charcoal'
            }`}
          >
            {data.emailOffers && <span className="text-cream text-[10px] leading-none">✓</span>}
          </div>
          <span className="text-[10px] tracking-[0.06em] text-muted font-normal">
            Email me with new collections, events, and exclusive offers
          </span>
        </label>
      </div>

      {/* Shipping address */}
      <div className="mb-10">
        <SectionTitle>Shipping Address</SectionTitle>
        <div className="mb-4">
          <FieldLabel required>Country / Region</FieldLabel>
          <div className="relative">
            <select
              value={data.country}
              onChange={e => onChange('country', e.target.value)}
              className={`${selectCls} ${errors.country ? 'border-red-300' : ''}`}
            >
              <option value="">Select country</option>
              {['Sri Lanka', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Germany', 'France', 'UAE', 'Singapore', 'India'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[10px] pointer-events-none">▾</span>
          </div>
        </div>
        <FormRow>
          <div>
            <FieldLabel required>First name</FieldLabel>
            <input
              type="text"
              value={data.firstName}
              onChange={e => onChange('firstName', e.target.value)}
              placeholder="Amara"
              className={`${inputCls} ${errors.firstName ? 'border-red-300' : ''}`}
            />
          </div>
          <div>
            <FieldLabel required>Last name</FieldLabel>
            <input
              type="text"
              value={data.lastName}
              onChange={e => onChange('lastName', e.target.value)}
              placeholder="Perera"
              className={`${inputCls} ${errors.lastName ? 'border-red-300' : ''}`}
            />
          </div>
        </FormRow>
        <div className="mb-4">
          <FieldLabel required>Address</FieldLabel>
          <input
            type="text"
            value={data.address}
            onChange={e => onChange('address', e.target.value)}
            placeholder="12 Galle Road"
            className={`${inputCls} ${errors.address ? 'border-red-300' : ''}`}
          />
        </div>
        <div className="mb-4">
          <FieldLabel>Apartment, suite, etc.</FieldLabel>
          <input
            type="text"
            value={data.address2}
            onChange={e => onChange('address2', e.target.value)}
            placeholder="Optional"
            className={inputCls}
          />
        </div>
        <FormRow cols={3}>
          <div>
            <FieldLabel required>City</FieldLabel>
            <input
              type="text"
              value={data.city}
              onChange={e => onChange('city', e.target.value)}
              placeholder="Colombo"
              className={`${inputCls} ${errors.city ? 'border-red-300' : ''}`}
            />
          </div>
          <div>
            <FieldLabel>State / Province</FieldLabel>
            <input
              type="text"
              value={data.state}
              onChange={e => onChange('state', e.target.value)}
              placeholder="Western"
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel>Postal code</FieldLabel>
            <input
              type="text"
              value={data.zip}
              onChange={e => onChange('zip', e.target.value)}
              placeholder="00300"
              className={inputCls}
            />
          </div>
        </FormRow>
        <div className="mb-4">
          <FieldLabel>Phone (for delivery updates)</FieldLabel>
          <input
            type="tel"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            placeholder="+94 77 000 0000"
            className={inputCls}
          />
        </div>
      </div>

      <button
        onClick={() => validate() && onNext()}
        className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.24em] uppercase font-normal hover:bg-espresso active:scale-[0.99] transition-all duration-400"
      >
        Continue to Shipping
      </button>
    </motion.div>
  )
}

/* ─── SHIPPING STEP ─── */
const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Delivery', sub: '7–14 business days', price: 0, note: 'Complimentary' },
  { id: 'express', label: 'Express Delivery', sub: '3–5 business days', price: 35 },
  { id: 'overnight', label: 'Priority Overnight', sub: '1–2 business days', price: 75 },
]

function ShippingStep({ info, method, onMethod, onNext, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Contact summary */}
      <div className="border border-sand bg-linen/50 px-5 py-4 mb-6 space-y-2">
        {[
          ['Contact', info.email],
          ['Ship to', `${info.address}${info.address2 ? ', ' + info.address2 : ''}, ${info.city}, ${info.country}`],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between items-start gap-4">
            <span className="text-[9px] tracking-[0.16em] uppercase text-muted font-normal w-16 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-[11px] text-charcoal font-normal flex-1 truncate">{val}</span>
            <button
              onClick={onBack}
              className="text-[9px] tracking-[0.12em] uppercase text-gold border-b border-gold/50 hover:border-gold font-normal flex-shrink-0 transition-all duration-200"
            >
              Change
            </button>
          </div>
        ))}
      </div>

      <SectionTitle>Shipping Method</SectionTitle>

      <div className="space-y-2 mb-10">
        {SHIPPING_METHODS.map(m => (
          <label
            key={m.id}
            onClick={() => onMethod(m)}
            className={`flex items-center justify-between px-5 py-4 border cursor-pointer transition-all duration-300 group ${
              method?.id === m.id
                ? 'border-charcoal bg-charcoal/[0.03]'
                : 'border-sand hover:border-warm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                method?.id === m.id ? 'border-charcoal' : 'border-warm group-hover:border-charcoal'
              }`}>
                {method?.id === m.id && <div className="w-2 h-2 rounded-full bg-charcoal" />}
              </div>
              <div>
                <p className="text-[11px] tracking-[0.06em] text-charcoal font-normal">{m.label}</p>
                <p className="text-[9px] tracking-[0.1em] uppercase text-muted font-normal mt-0.5">{m.sub}</p>
              </div>
            </div>
            <span className={`text-[11px] font-normal ${m.price === 0 ? 'text-gold' : 'text-charcoal'}`}>
              {m.note || `USD ${m.price}`}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!method}
        className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.24em] uppercase font-normal hover:bg-espresso active:scale-[0.99] transition-all duration-400 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue to Payment
      </button>
    </motion.div>
  )
}

/* ─── PAYMENT STEP ─── */
function PaymentStep({ info, method, total, onPlace, onBack, placing }) {
  const [card, setCard] = useState({ num: '', name: '', exp: '', cvc: '' })
  const [payMethod, setPayMethod] = useState('card')
  const [errors, setErrors] = useState({})

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  const formatExp = (v) => {
    const d = v.replace(/\D/g, '')
    if (d.length >= 2) return d.slice(0, 2) + '/' + d.slice(2, 4)
    return d
  }

  const validate = () => {
    if (payMethod !== 'card') return true
    const e = {}
    if (card.num.replace(/\s/g, '').length < 16) e.num = true
    if (!card.name) e.name = true
    if (card.exp.length < 5) e.exp = true
    if (card.cvc.length < 3) e.cvc = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const tax = Math.round(total * 0.08)
  const shipping = method?.price || 0
  const grand = total + shipping + tax

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Summary bar */}
      <div className="border border-sand bg-linen/50 px-5 py-4 mb-8 space-y-2">
        {[
          ['Contact', info.email],
          ['Ship to', `${info.address}, ${info.city}, ${info.country}`],
          ['Shipping', method?.label],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between items-start gap-4">
            <span className="text-[9px] tracking-[0.16em] uppercase text-muted font-normal w-16 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-[11px] text-charcoal font-normal flex-1 truncate">{val}</span>
            <button onClick={onBack} className="text-[9px] tracking-[0.12em] uppercase text-gold border-b border-gold/50 hover:border-gold font-normal flex-shrink-0 transition-all duration-200">Change</button>
          </div>
        ))}
      </div>

      <SectionTitle>Payment</SectionTitle>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-7">
        {[
          { id: 'card', label: 'Credit Card' },
          { id: 'paypal', label: 'PayPal' },
          { id: 'bank', label: 'Bank Transfer' },
        ].map(pm => (
          <button
            key={pm.id}
            onClick={() => setPayMethod(pm.id)}
            className={`px-5 py-2.5 text-[9px] tracking-[0.16em] uppercase font-normal border transition-all duration-300 ${
              payMethod === pm.id
                ? 'bg-charcoal text-cream border-charcoal'
                : 'text-muted border-sand hover:border-charcoal hover:text-charcoal'
            }`}
          >
            {pm.label}
          </button>
        ))}
      </div>

      {/* Card form */}
      <AnimatePresence mode="wait">
        {payMethod === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <div className="border border-sand bg-cream overflow-hidden">
              <div className={`border-b ${errors.num ? 'border-red-200' : 'border-sand'} relative`}>
                <input
                  type="text"
                  value={card.num}
                  onChange={e => setCard(c => ({ ...c, num: formatCard(e.target.value) }))}
                  placeholder="Card number"
                  maxLength={19}
                  className="w-full px-4 py-3.5 text-[13px] tracking-[0.12em] text-charcoal font-normal placeholder:text-muted/50 outline-none bg-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px] opacity-30">
                  {card.num.startsWith('4') ? '💳' : card.num.startsWith('5') ? '💳' : '💳'}
                </span>
              </div>
              <div className={`px-4 py-3.5 border-b ${errors.name ? 'border-red-200' : 'border-sand'}`}>
                <input
                  type="text"
                  value={card.name}
                  onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  placeholder="Name on card"
                  className="w-full text-[13px] tracking-[0.06em] text-charcoal font-normal placeholder:text-muted/50 outline-none bg-transparent"
                />
              </div>
              <div className="flex">
                <div className={`flex-1 px-4 py-3.5 border-r ${errors.exp ? 'border-red-200' : 'border-sand'}`}>
                  <input
                    type="text"
                    value={card.exp}
                    onChange={e => setCard(c => ({ ...c, exp: formatExp(e.target.value) }))}
                    placeholder="MM / YY"
                    maxLength={5}
                    className="w-full text-[13px] tracking-[0.08em] text-charcoal font-normal placeholder:text-muted/50 outline-none bg-transparent"
                  />
                </div>
                <div className={`flex-1 px-4 py-3.5 ${errors.cvc ? 'bg-red-50' : ''}`}>
                  <input
                    type="text"
                    value={card.cvc}
                    onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full text-[13px] tracking-[0.08em] text-charcoal font-normal placeholder:text-muted/50 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
            <p className="text-[9px] tracking-[0.08em] text-muted font-normal mt-3 flex items-center gap-2">
              <span className="text-[11px]">🔒</span>
              All transactions are secure and encrypted by SSL.
            </p>
          </motion.div>
        )}

        {payMethod === 'paypal' && (
          <motion.div key="paypal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mb-8 border border-sand p-6 text-center bg-[#ffc439]/10">
            <p className="text-[11px] tracking-[0.06em] text-charcoal font-normal mb-4">
              You will be redirected to PayPal to complete your purchase securely.
            </p>
            <div className="inline-block text-[24px] font-bold text-[#003087]">Pay<span className="text-[#009cde]">Pal</span></div>
          </motion.div>
        )}

        {payMethod === 'bank' && (
          <motion.div key="bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mb-8 border border-sand p-6 bg-linen/60">
            <p className="text-[11px] tracking-[0.06em] text-charcoal font-normal leading-relaxed">
              Bank transfer details will be emailed after order placement. Your order will be held for 48 hours pending payment confirmation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing address */}
      <div className="mb-8">
        <SectionTitle>Billing Address</SectionTitle>
        <label className="flex items-center gap-3 cursor-pointer mb-4 group">
          <div className="w-4 h-4 border border-charcoal flex items-center justify-center flex-shrink-0">
            <span className="text-charcoal text-[10px]">✓</span>
          </div>
          <span className="text-[10px] tracking-[0.06em] text-charcoal font-normal">
            Same as shipping address
          </span>
        </label>
      </div>

      {/* Grand total + Place order */}
      <div className="border-t border-sand pt-6 mb-6">
        <div className="flex justify-between items-baseline mb-5">
          <span className="text-[10px] tracking-[0.18em] uppercase text-muted font-normal">Order Total</span>
          <span className="font-serif text-[24px] font-normal text-charcoal">
            USD {grand.toLocaleString()}
          </span>
        </div>
      </div>

      <motion.button
        onClick={() => validate() && onPlace()}
        whileTap={{ scale: 0.99 }}
        disabled={placing}
        className="w-full py-4 bg-charcoal text-cream text-[10px] tracking-[0.26em] uppercase font-normal hover:bg-espresso transition-all duration-400 disabled:opacity-60 relative overflow-hidden"
      >
        {placing ? (
          <span className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="inline-block w-3 h-3 border border-cream/40 border-t-cream rounded-full"
            />
            Processing…
          </span>
        ) : (
          `Place Order · USD ${grand.toLocaleString()}`
        )}
      </motion.button>

      <p className="text-[9px] tracking-[0.06em] text-muted font-normal text-center mt-4 leading-relaxed">
        By placing your order you agree to our{' '}
        <Link href="#" className="text-charcoal border-b border-charcoal/30 no-underline hover:border-charcoal transition-all duration-200">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="text-charcoal border-b border-charcoal/30 no-underline hover:border-charcoal transition-all duration-200">
          Privacy Policy
        </Link>.
      </p>
    </motion.div>
  )
}

/* ─── MAIN CHECKOUT PAGE ─── */
export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, count } = useCart()
  const [step, setStep] = useState(1)  // 1=info, 2=shipping, 3=payment
  const [summaryOpen, setSummaryOpen] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0])

  const [info, setInfo] = useState({
    email: '', firstName: '', lastName: '',
    address: '', address2: '', city: '', state: '', zip: '',
    country: '', phone: '', emailOffers: false,
  })

  const updateInfo = (key, val) => setInfo(prev => ({ ...prev, [key]: val }))

  // Redirect if cart is empty
  useEffect(() => {
    if (count === 0 && !placing) router.push('/')
  }, [count, placing, router])

  const handlePlaceOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      router.push('/checkout/confirmation')
    }, 2000)
  }

  if (count === 0 && !placing) return null

  const stepMap = { 1: 'Information', 2: 'Shipping', 3: 'Payment' }

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      <div className="max-w-[1100px] mx-auto px-4 py-10 md:py-16">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[20px] font-normal tracking-[0.22em] uppercase text-charcoal no-underline">
            Herada Ceylon
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-10">
          <StepIndicator current={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
          {/* Left: Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <InformationStep
                  key="info"
                  data={info}
                  onChange={updateInfo}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <ShippingStep
                  key="shipping"
                  info={info}
                  method={shippingMethod}
                  onMethod={setShippingMethod}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <PaymentStep
                  key="payment"
                  info={info}
                  method={shippingMethod}
                  total={total}
                  onPlace={handlePlaceOrder}
                  onBack={() => setStep(2)}
                  placing={placing}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:sticky lg:top-[92px]">
            <OrderSummary
              items={items}
              total={total}
              shipping={shippingMethod?.price ?? 0}
              collapsed={!summaryOpen}
              onToggle={() => setSummaryOpen(o => !o)}
            />

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: '🔒', label: 'SSL Secure' },
                { icon: '↩', label: 'Easy Returns' },
                { icon: '✈', label: 'Global Shipping' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-2 py-4 border border-sand bg-linen/40">
                  <span className="text-lg opacity-50">{b.icon}</span>
                  <span className="text-[8px] tracking-[0.16em] uppercase text-muted font-normal text-center">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
