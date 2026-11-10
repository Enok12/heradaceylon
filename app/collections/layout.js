'use client'
import { Suspense } from 'react'
import CollectionsPageContent from './page'

export default function CollectionsWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-muted font-normal">Loading…</span>
      </div>
    }>
      <CollectionsPageContent />
    </Suspense>
  )
}
