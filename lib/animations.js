export const EASE_SILK = [0.43, 0.13, 0.23, 0.96]
export const EASE_REVEAL = [0.16, 1, 0.3, 1]
export const EASE_LUXURY = [0.25, 0.1, 0.25, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: EASE_REVEAL, delay }
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_LUXURY, delay }
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  },
}

export const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: EASE_REVEAL }
  },
}

export const slideInRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.65, ease: EASE_REVEAL }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.5, ease: EASE_LUXURY }
  },
}
