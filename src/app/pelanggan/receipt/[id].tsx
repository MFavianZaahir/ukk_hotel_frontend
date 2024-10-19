"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Cookies from "js-cookie"

type BookingReceipt = {
  id_pemesanan: number
  nama_tamu: string
  tgl_check_in: string
  tgl_check_out: string
  jumlah_kamar: number
  total_harga: number
  email_pemesanan: string
  room_type: {
    nama_tipe_kamar: string
    harga: number
  }
}

export default function Receipt() {
  const [bookingData, setBookingData] = useState<BookingReceipt | null>(null)
  const router = useRouter()
  const { id } = router.query // Get the booking ID from the URL

  useEffect(() => {
    if (id) {
      fetchBookingData(id as string)
    }
  }, [id])

  const fetchBookingData = async (bookingId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      })
      if (response.data.success) {
        setBookingData(response.data.data)
      } else {
        console.error("Failed to fetch booking data")
      }
    } catch (error) {
      console.error("Error fetching booking data", error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Booking Receipt</h1>

      {bookingData ? (
        <div className="bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
          <p><strong>Guest Name:</strong> {bookingData.nama_tamu}</p>
          <p><strong>Email:</strong> {bookingData.email_pemesanan}</p>
          <p><strong>Room Type:</strong> {bookingData.room_type.nama_tipe_kamar}</p>
          <p><strong>Check-in Date:</strong> {format(new Date(bookingData.tgl_check_in), "yyyy-MM-dd")}</p>
          <p><strong>Check-out Date:</strong> {format(new Date(bookingData.tgl_check_out), "yyyy-MM-dd")}</p>
          <p><strong>Number of Rooms:</strong> {bookingData.jumlah_kamar}</p>
          <p><strong>Total Price:</strong> Rp. {bookingData.total_harga.toLocaleString()}</p>

          <div className="mt-6">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              Print Receipt
            </Button>
          </div>
        </div>
      ) : (
        <p>Loading booking data...</p>
      )}
    </div>
  )
}
