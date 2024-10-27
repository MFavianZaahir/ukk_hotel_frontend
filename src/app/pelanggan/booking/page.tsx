import RoomBookingClient from './RoomBookingClient'
import { getRoomTypes } from '@/lib/pelangganApi'

export default async function RoomBookingPage() {
  const roomTypes = await getRoomTypes()

  return <RoomBookingClient initialRoomTypes={roomTypes} />
}