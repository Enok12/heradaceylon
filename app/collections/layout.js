'use client'
import { Suspense } from 'react'
import CollectionsPageContent from './page'

export default function CollectionsWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-muted font-light">Loading…</span>
      </div>
    }>
      <CollectionsPageContent />
    </Suspense>
  )
}
