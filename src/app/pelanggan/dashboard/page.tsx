"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CreditCard, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import Cookies from "js-cookie"

type UserInfo = {
  name: string
  email: string
}

type BookingSummary = {
  total: number
  upcoming: number
}

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({ total: 0, upcoming: 0 })

  useEffect(() => {
    fetchUserInfo()
    fetchBookingSummary()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/customer`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      })
      if (response.data.data) {
        setUserInfo(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const fetchBookingSummary = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/booking`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      })
      if (response.data.data) {
        setBookingSummary(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching booking summary:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-8 text-center">
        <Image
          src="/logo.png"
          alt="Wikusama Hotel Logo"
          width={200}
          height={100}
          className="mx-auto mb-4"
        />
        <motion.h1 
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Your Dashboard
        </motion.h1>
        {userInfo && (
          <p className="text-xl text-gray-300">{userInfo.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{bookingSummary.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Upcoming Stays</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{bookingSummary.upcoming}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Loyalty Points</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,500</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Member Status</CardTitle>
            <User className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Gold</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/pelanggan/booking" passHref>
          <Button className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700">
            Make a New Booking
          </Button>
        </Link>
        <Link href="profile/transactions" passHref>
          <Button className="w-full h-20 text-lg bg-green-600 hover:bg-green-700">
            View Transaction  History
          </Button>
        </Link>
      </div>
    </div>
  )
}