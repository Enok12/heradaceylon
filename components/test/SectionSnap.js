'use client'
import { useEffect } from 'react'
import { animate } from 'framer-motion'

// Snap between the page's [data-snap-section] blocks. Each block has a start (its top) and
// an end (where its last screen is in view; the same as the start for one-screen blocks,
// later for pinned ones like the categories). The stretch between one block's end and the
// next block's start is a snap zone: any scroll inside it glides to that zone's edge in the
// scroll direction. Everywhere else (inside a pinned block, after the last block) the page
// scrolls normally. JS rather than CSS scroll-snap, which fights the pinned section and the
// footer.
export default function SectionSnap() {
  useEffect(() => {
    let animating = false
    let touchStartY = null

    const zones = () => {
      const vh = window.innerHeight
      const blocks = [...document.querySelectorAll('[data-snap-section]')].map((el) => {
        const start = el.getBoundingClientRect().top + window.scrollY
        return { start, end: start + Math.max(0, el.offsetHeight - vh) }
      })
      const out = []
      for (let i = 0; i < blocks.length - 1; i++) {
        if (blocks[i + 1].start - blocks[i].end > 2) out.push([blocks[i].end, blocks[i + 1].start])
      }
      return out
    }

    // Snap target for a scroll in `direction` from the current position, or null
    const target = (direction) => {
      const y = window.scrollY
      for (const [from, to] of zones()) {
        if (direction > 0 && y >= from - 2 && y < to - 2) return to
        if (direction < 0 && y > from + 2 && y <= to + 2) return from
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

    // A free wheel step that would carry past a zone's edge stops exactly on it instead, so
    // a pinned section always finishes cleanly before the next scroll snaps onward
    const edgeCrossed = (delta) => {
      const y = window.scrollY
      for (const [from, to] of zones()) {
        if (delta > 0 && y < from - 2 && y + delta > from) return from
        if (delta < 0 && y > to + 2 && y + delta < to) return to
      }
      return null
    }

    const onWheel = (e) => {
      if (animating) { e.preventDefault(); return }
      const t = target(Math.sign(e.deltaY))
      if (t !== null) { e.preventDefault(); glideTo(t); return }
      const edge = edgeCrossed(e.deltaY)
      if (edge !== null) { e.preventDefault(); window.scrollTo({ top: edge, behavior: 'smooth' }) }
    }
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (touchStartY === null) return
      const dy = touchStartY - e.touches[0].clientY
      if (Math.abs(dy) < 8) return
      if (animating) { e.preventDefault(); return }
      const t = target(Math.sign(dy))
      if (t !== null) { e.preventDefault(); touchStartY = null; glideTo(t) }
    }
    const KEYS = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }
    const onKey = (e) => {
      const dir = KEYS[e.key]
      if (!dir || e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const t = target(e.shiftKey && e.key === ' ' ? -1 : dir)
      if (t !== null) { e.preventDefault(); if (!animating) glideTo(t) }
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
