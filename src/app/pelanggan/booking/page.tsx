import { Suspense } from 'react'
import { getRoomTypes } from '@/lib/pelangganApi'
import SkeletonLoader from './RoomBookingWrapper'
import RoomBookingWrapper from './RoomBookingWrapper'

export const revalidate = 0 // This enables on-demand revalidation

export default async function RoomBookingPage() {
  const roomTypes = await getRoomTypes()

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <RoomBookingWrapper initialRoomTypes={roomTypes} />
    </Suspense>
  )
}