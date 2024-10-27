"use client"

import { useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Users, Home, Mail, Printer, Download } from 'lucide-react'
import { motion } from "framer-motion"
import { DatePicker } from "@/components/ui/date-picker"
import { RoomType, BookingData, BookingConfirmation } from "@/interfaces/pelanggan";

export default function RoomBookingClient({ initialRoomTypes }: { initialRoomTypes: RoomType[] }) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    tgl_check_in: null,
    tgl_check_out: null,
    nama_tamu: "",
    jumlah_kamar: 1,
    id_tipe_kamar: 0,
    email_pemesanan: "",
    status_pemesanan: "pending",
  })
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (field: 'tgl_check_in' | 'tgl_check_out', date: Date | null) => {
    setBookingData((prev) => ({ ...prev, [field]: date }))
  }

  const handleRoomTypeSelect = (id: string) => {
    const selected = roomTypes.find((type) => type.id_tipe_kamar.toString() === id)
    setSelectedRoomType(selected || null)
    setBookingData((prev) => ({ ...prev, id_tipe_kamar: parseInt(id) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formattedData = {
        ...bookingData,
        jumlah_kamar: Number(bookingData.jumlah_kamar),
        tgl_check_in: bookingData.tgl_check_in ? format(bookingData.tgl_check_in, "yyyy-MM-dd") : null,
        tgl_check_out: bookingData.tgl_check_out ? format(bookingData.tgl_check_out, "yyyy-MM-dd") : null,
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/booking`,
        formattedData,
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      )
      if (response.data.success) {
        toast.success("Booking successful!")
        const bookingDetails = await fetchBookingDetails(response.data.data.id)
        setBookingConfirmation(bookingDetails)
        setIsReceiptModalOpen(true)
      } else {
        toast.error(response.data.message || "Booking failed")
      }
    } catch (error) {
      toast.error("Failed to submit booking")
    }
  }

  const fetchBookingDetails = async (id: number): Promise<BookingConfirmation> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/booking/${id}`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` }
    })
    return response.data.data
  }

  const calculateTotalPrice = () => {
    if (!selectedRoomType || !bookingData.tgl_check_in || !bookingData.tgl_check_out)
      return 0
    const nights = Math.ceil((bookingData.tgl_check_out.getTime() - bookingData.tgl_check_in.getTime()) / (1000 * 3600 * 24))
    return selectedRoomType.harga * bookingData.jumlah_kamar * nights
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    if (!bookingConfirmation) return

    const bookingData = JSON.stringify(bookingConfirmation, null, 2)
    const blob = new Blob([bookingData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `booking_${bookingConfirmation.nomor_pemesanan}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return ( 
      <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
        {/* Main Heading */}
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hotel Room Booking
        </motion.h1>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Room Types Display */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {roomTypes.map((roomType) => (
              <Card key={roomType.id_tipe_kamar} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow duration-300 h-[500px] overflow-auto">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-400">{roomType.nama_tipe_kamar}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Price per night: Rp. {roomType.harga.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={roomType.foto}
                    alt={roomType.nama_tipe_kamar}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <p className="text-sm text-gray-300">{roomType.deskripsi}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
    
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Book a Room</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details to make a reservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="tgl_check_in" className="text-gray-300">Check-in Date</Label>
                    <DatePicker
                      selected={bookingData.tgl_check_in}
                      onSelect={(date) => handleDateChange('tgl_check_in', date)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tgl_check_out" className="text-gray-300">Check-out Date</Label>
                    <DatePicker
                      selected={bookingData.tgl_check_out}
                      onSelect={(date) => handleDateChange('tgl_check_out', date)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nama_tamu" className="text-gray-300">Guest Name</Label>
                    <div className="relative">
                      <Input
                        id="nama_tamu"
                        name="nama_tamu"
                        value={bookingData.nama_tamu}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="jumlah_kamar" className="text-gray-300">Number of Rooms</Label>
                    <div className="relative">
                      <Input
                        id="jumlah_kamar"
                        name="jumlah_kamar"
                        type="number"
                        min="1"
                        value={bookingData.jumlah_kamar}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                      />
                      <Home className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="id_tipe_kamar" className="text-gray-300">Room Type</Label>
                    <Select onValueChange={handleRoomTypeSelect}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem
                            key={type.id_tipe_kamar}
                            value={type.id_tipe_kamar.toString()}
                          >
                            {type.nama_tipe_kamar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email_pemesanan" className="text-gray-300">Email</Label>
                    <div className="relative">
                      <Input
                        id="email_pemesanan"
                        name="email_pemesanan"
                        type="email"
                        value={bookingData.email_pemesanan}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  {selectedRoomType && (
                    <motion.div 
                      className="mt-6 p-4 bg-gray-700 rounded-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-blue-400 mb-2">Booking Summary</h3>
                      <p className="text-gray-300">Room Type: {selectedRoomType.nama_tipe_kamar}</p>
                      <p className="text-gray-300">Number of Rooms: {bookingData.jumlah_kamar}</p>
                      <p className="text-gray-300">
                        Total Nights: {
                          bookingData.tgl_check_in && bookingData.tgl_check_out
                            ? Math.ceil((bookingData.tgl_check_out.getTime() - bookingData.tgl_check_in.getTime()) / (1000 * 3600 * 24))
                            : 0
                        }
                      </p>
                      <p className="text-xl font-bold mt-2">
                        Total Price: Rp. {calculateTotalPrice().toLocaleString()}
                      </p>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Book Now
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
    
        {/* Booking Confirmation Dialog */}
        <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Booking Confirmation</DialogTitle>
              <DialogDescription>Your booking has been confirmed.</DialogDescription>
            </DialogHeader>
            {bookingConfirmation && (
              <div className="space-y-4">
                <p><strong>Booking Number:</strong> {bookingConfirmation.nomor_pemesanan}</p>
                <p><strong>Guest Name:</strong> {bookingConfirmation.nama_tamu}</p>
                <p><strong>Check-in Date:</strong> {new Date(bookingConfirmation.tgl_check_in).toLocaleDateString()}</p>
                <p><strong>Check-out Date:</strong> {new Date(bookingConfirmation.tgl_check_out).toLocaleDateString()}</p>
                <p><strong>Room Type:</strong> {bookingConfirmation.tipe_kamar}</p>
                <p><strong>Number of Rooms:</strong> {bookingConfirmation.jumlah_kamar}</p>
                <p className="text-white"><strong>Total Price:</strong> Rp. {bookingConfirmation.total_harga.toLocaleString()}</p>
                <div className="flex justify-between mt-6">
                  <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" /> Save Receipt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
}