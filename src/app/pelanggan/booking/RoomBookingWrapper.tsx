'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import SkeletonLoader from './SkeletonLoader'
import { RoomType } from "@/interfaces/pelanggan"

const RoomBookingClient = dynamic(() => import('./RoomBookingClient'), {
  loading: () => <SkeletonLoader />,
  ssr: false
})

export default function RoomBookingWrapper({ initialRoomTypes }: { initialRoomTypes: RoomType[] }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <SkeletonLoader />
  }

  return <RoomBookingClient initialRoomTypes={initialRoomTypes} />
}