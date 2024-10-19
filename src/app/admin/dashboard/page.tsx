"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Bed, Users, Home, Book, Hotel } from "lucide-react"
import Link from "next/link"

// Add your base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_baseURL

export default function AdminDashboard() {
  // State to store the stats
  const [totalBookings, setTotalBookings] = useState<string>("Loading...")
  const [availableRooms, setAvailableRooms] = useState<string>("Loading...")

  // Fetch data for Total Bookings and Available Rooms
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch total bookings
        const bookingsRes = await fetch(`${BASE_URL}/booking`)
        const bookingsData = await bookingsRes.json()
        const totalBookings = bookingsData.data ? bookingsData.data.length : 0
        setTotalBookings(totalBookings.toString())

        // Fetch available rooms with a POST request
        const roomsRes = await fetch(`${BASE_URL}/filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tgl_check_in: null, // Set to null to avoid empty string issue
            tgl_check_out: null, // Set to null to avoid empty string issue
          }),
        })

        // If the API expects an empty body for fetching all available rooms, we can send an empty object
        // const roomsRes = await fetch(`${BASE_URL}/filter`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({}),
        // });

        const roomsData = await roomsRes.json()

        // Ensure roomsData.kamar exists and is an array before using reduce
        const availableRoomCount = roomsData.kamar
          ? roomsData.kamar.reduce(
              (acc: number, roomType: any) => acc + roomType.kamar.length,
              0
            )
          : 0

        setAvailableRooms(availableRoomCount.toString())
      } catch (error) {
        // Handle error by setting fallback values
        setTotalBookings("Error")
        setAvailableRooms("Error")
        console.error("Error fetching stats:", error)
      }
    }

    fetchData()
  }, [])

  const pages = [
    { name: "Rooms", icon: Bed, href: "/admin/kamar" },
    { name: "Room Types", icon: Home, href: "/admin/tipe-kamar" },
    { name: "Users", icon: Users, href: "/admin/users" },
  ]

  const stats = [
    { name: "Total Bookings", icon: Book, value: totalBookings },
    { name: "Available Rooms", icon: Hotel, value: availableRooms },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <motion.div
            key={page.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-white">{page.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={page.href}>
                  <Button className="w-full h-24 text-lg" variant="outline">
                    <page.icon className="mr-2 h-8 w-8" />
                    Go to {page.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
