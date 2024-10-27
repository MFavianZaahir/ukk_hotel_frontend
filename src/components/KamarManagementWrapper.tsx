'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const KamarManagementClient = dynamic(() => import('./KamarManagementClient'), {
  ssr: false,
})

function SkeletonLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-700 rounded w-1/4"></div>
      <div className="h-10 bg-gray-700 rounded w-full"></div>
      <div className="h-10 bg-gray-700 rounded w-1/3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-48 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
}

export default function KamarManagementWrapper() {
  return (
    <Suspense fallback={<SkeletonLoading />}>
      <KamarManagementClient />
    </Suspense>
  )
}