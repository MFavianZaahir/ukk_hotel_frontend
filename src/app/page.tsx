"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CreditCard, User, Play, Star, Quote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { mockReviews } from "./data/mockReview"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import hotelz from "@/public/hotel.jpg"

type RoomType = {
  id_tipe_kamar: number
  nama_tipe_kamar: string
  harga: number
  deskripsi: string
  foto: string
}

export default function Home() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    fetchRoomTypes()
    getUserRole()
  }, [])

  const fetchRoomTypes = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/room-type`)
      if (response.data.data) {
        setRoomTypes(response.data.data)
      } else {
        toast.error("Failed to fetch room types")
      }
    } catch (error) {
      console.error("Error fetching room types:", error)
      toast.error("Error fetching room types")
    } finally {
      setIsLoading(false)
    }
  }

  const getUserRole = async () => {
    try {
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/auth/role`, {
      //   withCredentials: true,
      // })
      // setUserRole(response.data.role)
    } catch (error) {
      console.error("Error fetching user role:", error)
    }
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin/dashboard"
      case "resepsionis":
        return "/resepsionis/dashboard"
      case "pelanggan":
        return "/pelanggan/dashboard"
      default:
        return "/auth/login"
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <Hero />
      <Facilities />
      <Rooms roomTypes={roomTypes} isLoading={isLoading} />
      <Testimonies reviews={mockReviews} />
      <DashboardSection userRole={userRole} getDashboardLink={getDashboardLink} />
    </div>
  )
}

function Hero() {
  return (
    <section className="mb-16 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        style={{
          backgroundImage: `url(${hotelz.src}?height=600&width=1200)`,
          backgroundSize: "cover",
          filter: "brightness(0.6)",
        }}
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-20">
        <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Wikusama Hotel
          </motion.h1>
          <motion.p 
            className="text-xl mb-6 text-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience luxury and comfort in the heart of the city.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/pelanggan/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2 text-black">
              <Play className="w-4 h-4 text-black" /> Take a Tour
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DashboardSection({ userRole, getDashboardLink }: { userRole: string | null, getDashboardLink: () => string }) {
  return (
    <section className="my-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-lg text-gray-200 mb-6 text-center">
              {userRole 
                = `Welcome back! Access your ${userRole} dashboard to manage your hotel experience.`}
            </p>
            <Link href={getDashboardLink()}>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-300 font-semibold py-2 px-6 rounded-full flex items-center group">
                {userRole = "Go to Your Dashboard"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

function Facilities() {
  const facilities = [
    { icon: <Calendar className="w-8 h-8 text-blue-400" />, title: "Flexible Booking" },
    { icon: <Clock className="w-8 h-8 text-blue-400" />, title: "24/7 Service" },
    { icon: <CreditCard className="w-8 h-8 text-blue-400" />, title: "Easy Payment" },
    { icon: <User className="w-8 h-8 text-blue-400" />, title: "Personal Concierge" },
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Facilities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {facilities.map((facility, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-300">
              <CardHeader className="flex flex-col items-center">
                {facility.icon}
                <CardTitle className="mt-4 text-blue-400">{facility.title}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Rooms({ roomTypes, isLoading }: { roomTypes: RoomType[], isLoading: boolean }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Rooms</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : roomTypes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {roomTypes.map((room, index) => (
              <motion.div
                key={room.id_tipe_kamar}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 overflow-hidden group">
                  <div className="relative">
                    <Image
                      src={room.foto || `url(${hotelz.src}?height=600&width=1200)`}
                      alt={room.nama_tipe_kamar}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/pelanggan/dashboard`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-blue-400">{room.nama_tipe_kamar}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{room.deskripsi}</p>
                    <p className="text-lg font-bold text-green-400">Rp. {room.harga.toLocaleString()} / night</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center text-gray-400">No rooms available at the moment.</div>
      )}
    </section>
  )
}

function Testimonies({ reviews }: { reviews: typeof mockReviews }) {
  return (
    <section className="pb-12">
      <h2 className="text-3xl font-bold mb-8 text-center">What Our Guests Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-400">{format(new Date(review.date), 'MMMM d, yyyy')}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <Quote className="w-8 h-8 text-blue-500 mb-2" />
                <p className="mb-4 text-gray-300">{review.testimony}</p>
                <p className="font-bold text-blue-400">{review.guestName}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

