'use client'
import { useEffect } from 'react'
import { animate } from 'framer-motion'

// Snap between the page's [data-snap-section] blocks. Each block has a start (its top) and
// an end (where its last screen is in view; the same as the start for one-screen blocks,
// later for pinned ones like the categories). The stretch between one block's end and the
// next block's start is a snap zone: any scroll inside it glides to that zone's edge in the
// scroll direction. Everywhere else (inside a pinned block, after the last block) the page
// scrolls normally. JS rather than CSS scroll-snap, which fights the pinned section and the
// footer. A block marked data-snap-transition="fade" is reached from the block before it (and
// left back to it) by a crossfade instead of a glide: the current block fades out, the page
// jumps while nothing is showing, and the other block fades in.
export default function SectionSnap() {
  useEffect(() => {
    let animating = false
    let touchStartY = null

    const zones = () => {
      const vh = window.innerHeight
      const blocks = [...document.querySelectorAll('[data-snap-section]')].map((el) => {
        const start = el.getBoundingClientRect().top + window.scrollY
        return { el, start, end: start + Math.max(0, el.offsetHeight - vh) }
      })
      const out = []
      for (let i = 0; i < blocks.length - 1; i++) {
        const a = blocks[i], b = blocks[i + 1]
        if (b.start - a.end > 2) {
          out.push({ from: a.end, to: b.start, before: a.el, after: b.el, fade: b.el.dataset.snapTransition === 'fade' })
        }
      }
      return out
    }

    // Snap for a scroll in `direction` from the current position, or null:
    // { top, zone, direction }
    const target = (direction) => {
      const y = window.scrollY
      for (const zone of zones()) {
        if (direction > 0 && y >= zone.from - 2 && y < zone.to - 2) return { top: zone.to, zone, direction }
        if (direction < 0 && y > zone.from + 2 && y <= zone.to + 2) return { top: zone.from, zone, direction }
      }
      return null
    }

    const glideTo = (top) => {
      animating = true
      animate(window.scrollY, top, {
        duration: 1,
        ease: [0.65, 0, 0.35, 1],
        // 'instant' per frame: html has scroll-behavior: smooth, which would fight each step
        onUpdate: (v) => window.scrollTo({ top: v, behavior: 'instant' }),
        onComplete: () => { animating = false },
      })
    }

    // Crossfade: fade the block being left, jump while it's invisible, fade the new one in
    const fadeTo = ({ top, zone, direction }) => {
      animating = true
      const leaving = direction > 0 ? zone.before : zone.after
      const arriving = direction > 0 ? zone.after : zone.before
      // Web Animations directly: nothing is left on the elements' style afterwards
      const out = leaving.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'ease-in', fill: 'forwards' })
      out.finished.then(() => {
        const fadeIn = arriving.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' })
        window.scrollTo({ top, behavior: 'instant' })
        out.cancel() // the left block is off screen now; drop its held opacity
        fadeIn.finished.then(() => { animating = false })
      })
    }

    const snap = (t) => (t.zone.fade ? fadeTo(t) : glideTo(t.top))

    // A free wheel step that would carry past a zone's edge stops exactly on it instead, so
    // a pinned section always finishes cleanly before the next scroll snaps onward
    const edgeCrossed = (delta) => {
      const y = window.scrollY
      for (const { from, to } of zones()) {
        if (delta > 0 && y < from - 2 && y + delta > from) return from
        if (delta < 0 && y > to + 2 && y + delta < to) return to
      }
      return null
    }

    // The navbar menu covers the page; leave scrolling alone while it's open
    const menuOpen = () => document.body.dataset.menuOpen === 'true'

    const onWheel = (e) => {
      if (menuOpen()) {
        // The page stays put, but a menu too tall for the screen can scroll inside itself
        const list = e.target.closest?.('[data-menu-scroll]')
        if (!list || list.scrollHeight <= list.clientHeight) e.preventDefault()
        return
      }
      if (animating) { e.preventDefault(); return }
      const t = target(Math.sign(e.deltaY))
      if (t !== null) { e.preventDefault(); snap(t); return }
      const edge = edgeCrossed(e.deltaY)
      if (edge !== null) { e.preventDefault(); window.scrollTo({ top: edge, behavior: 'smooth' }) }
    }
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (touchStartY === null || menuOpen()) return
      const dy = touchStartY - e.touches[0].clientY
      if (Math.abs(dy) < 8) return
      if (animating) { e.preventDefault(); return }
      const t = target(Math.sign(dy))
      if (t !== null) { e.preventDefault(); touchStartY = null; snap(t) }
    }
    const KEYS = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }
    const onKey = (e) => {
      const dir = KEYS[e.key]
      if (!dir || menuOpen() || e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const t = target(e.shiftKey && e.key === ' ' ? -1 : dir)
      if (t !== null) { e.preventDefault(); if (!animating) snap(t) }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return null
}
