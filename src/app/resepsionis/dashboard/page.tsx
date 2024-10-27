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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon, BedDoubleIcon, CreditCardIcon } from 'lucide-react'

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
    harga: number
  }
  status_pemesanan: string
}

const statusOptions = ['baru', 'check_in', 'check_out']

export default function ReceptionistBookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const url = `${process.env.NEXT_PUBLIC_baseURL}/booking`;
    try {
      const response = await axios.get(url);
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
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'baru':
        return 'bg-green-500 text-white'
      case 'check_in':
        return 'bg-yellow-500 text-black'
      case 'check_out':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleStatusChange = async (id_pemesanan: number, newStatus: string) => {
    const url = `${process.env.NEXT_PUBLIC_baseURL}/booking/${id_pemesanan}`
    try {
      const response = await axios.put(url, { status_pemesanan: newStatus });
      if (response.status === 200) {
        toast.success('Status updated successfully');
        fetchBookings();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  }

  const calculateTotalPrice = (booking: Booking) => {
    const checkInDate = new Date(booking.tgl_check_in)
    const checkOutDate = new Date(booking.tgl_check_out)
    const totalDays = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
    const totalHarga = booking.tipe_kamar.harga * booking.jumlah_kamar * totalDays
    return totalHarga
  }

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-blue-400"
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
        <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-700 rounded-t-lg">
            <CardTitle className="text-2xl text-white flex items-center">
              <CalendarIcon className="mr-2" /> Filter Bookings
            </CardTitle>
            <CardDescription className="text-gray-300">Filter bookings by check-in date range</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholderText="Start Date"
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholderText="End Date"
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <Button onClick={handleDateFilter} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
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
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="bg-gray-700 rounded-t-lg">
            <CardTitle className="text-2xl text-white flex items-center">
              <BedDoubleIcon className="mr-2" /> Booking List
            </CardTitle>
            <CardDescription className="text-gray-300">
              Showing {indexOfFirstBooking + 1} - {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of all bookings</TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-700">
                    <TableHead className="text-gray-300">Customer ID</TableHead>
                    <TableHead className="text-gray-300">Booking Number</TableHead>
                    <TableHead className="text-gray-300">Guest Name</TableHead>
                    <TableHead className="text-gray-300">Check-in Date</TableHead>
                    <TableHead className="text-gray-300">Check-out Date</TableHead>
                    <TableHead className="text-gray-300">Room Type</TableHead>
                    <TableHead className="text-gray-300">Number of Rooms</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBookings.map((booking) => (
                    <TableRow key={booking.id_pemesanan} className="hover:bg-gray-700 transition-colors duration-200">
                      <TableCell className="font-medium text-gray-300">{booking.id_pelanggan}</TableCell>
                      <TableCell className="text-gray-300">{booking.nomor_pemesanan}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4" />
                          {booking.nama_tamu}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{format(new Date(booking.tgl_check_in), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-gray-300">{format(new Date(booking.tgl_check_out), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-gray-300">{booking.tipe_kamar.nama_tipe_kamar}</TableCell>
                      <TableCell className="text-gray-300">{booking.jumlah_kamar}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center">
                          <CreditCardIcon className="mr-2 h-4 w-4" />
                          {calculateTotalPrice(booking).toLocaleString('en-US', { style: 'currency', currency: 'IDR' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(booking.status_pemesanan)} px-2 py-1 rounded-full text-xs font-semibold`}>
                          {booking.status_pemesanan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => handleStatusChange(booking.id_pemesanan, value)}
                          defaultValue={booking.status_pemesanan}
                        >
                          <SelectTrigger className="w-[120px] bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border-gray-700">
                            {statusOptions.map(option => (
                              <SelectItem key={option} value={option} className="hover:bg-gray-700">
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)}
                      className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} text-white hover:bg-gray-700`}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        onClick={() => paginate(index + 1)}
                        isActive={currentPage === index + 1}
                        className={`${currentPage === index + 1 ? 'bg-blue-600' : 'text-white hover:bg-gray-700'}`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)}
                      className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} text-white hover:bg-gray-700`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}