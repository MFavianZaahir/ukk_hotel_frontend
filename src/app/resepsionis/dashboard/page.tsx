"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from 'sonner'
import { motion } from "framer-motion"
import { DatePicker } from "@/components/ui/date-picker"

type Booking = {
  id_pemesanan: number
  id_pelanggan: number
  nomor_pemesanan: string
  nama_tamu: string
  tgl_check_in: string
  tgl_check_out: string
  jumlah_kamar: number
  tipe_kamar: {
    nama_tipe_kamar: string
  }
  status_pemesanan: string
}

export default function ReceptionistBookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const url = `${process.env.NEXT_PUBLIC_baseURL}/booking`;
    try {
      const response = await  axios.get(url);
      if (response.data && response.data.data) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      setFilteredBookings(bookings)
      return
    }

    const filtered = bookings.filter(booking => {
      const bookingDate = new Date(booking.tgl_check_in)
      return bookingDate >= startDate && bookingDate <= endDate
    })

    setFilteredBookings(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Booking Management
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Filter Bookings</CardTitle>
            <CardDescription className="text-gray-300">Filter bookings by check-in date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholderText="Start Date"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholderText="End Date"
                />
              </div>
              <Button onClick={handleDateFilter} className="bg-blue-600 hover:bg-blue-700">
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Booking List</CardTitle>
            <CardDescription className="text-gray-300">
              Showing {filteredBookings.length} bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of all bookings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Customer ID</TableHead>
                  <TableHead className="text-gray-300">Booking Number</TableHead>
                  <TableHead className="text-gray-300">Guest Name</TableHead>
                  <TableHead className="text-gray-300">Check-in Date</TableHead>
                  <TableHead className="text-gray-300">Check-out Date</TableHead>
                  <TableHead className="text-gray-300">Room Type</TableHead>
                  <TableHead className="text-gray-300">Number of Rooms</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id_pemesanan} className="hover:bg-gray-700">
                    <TableCell className="font-medium text-gray-300">{booking.id_pelanggan}</TableCell>
                    <TableCell className="text-gray-300">{booking.nomor_pemesanan}</TableCell>
                    <TableCell className="text-gray-300">{booking.nama_tamu}</TableCell>
                    <TableCell className="text-gray-300">{format(new Date(booking.tgl_check_in), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-gray-300">{format(new Date(booking.tgl_check_out), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-gray-300">{booking.tipe_kamar.nama_tipe_kamar}</TableCell>
                    <TableCell className="text-gray-300">{booking.jumlah_kamar}</TableCell>
                    <TableCell className={getStatusColor(booking.status_pemesanan)}>
                      {booking.status_pemesanan}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}