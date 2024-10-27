"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

type UserProfile = {
  id_user: number
  nama_user: string
  email: string
  foto: string | File
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const token = Cookies.get("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setProfile(response.data.data)
      } else {
        toast.error("Failed to fetch profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error fetching profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "foto" && files) {
      setProfile(prev => prev ? { ...prev, [name]: files[0] } : null)
    } else {
      setProfile(prev => prev ? { ...prev, [name]: value } : null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    const formData = new FormData()
    formData.append("id_user", profile.id_user.toString())
    formData.append("nama_user", profile.nama_user)
    formData.append("email", profile.email)
    if (profile.foto instanceof File) {
      formData.append("foto", profile.foto)
    }

    try {
      const token = Cookies.get("token")
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        toast.success("Profile updated successfully")
        fetchProfile()
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">No profile data available</div>
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nama_user">Name</Label>
              <Input
                id="nama_user"
                name="nama_user"
                value={profile.nama_user}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="foto">Profile Picture</Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            {typeof profile.foto === 'string' && (
              <div className="mt-4">
                <img src={profile.foto} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
              </div>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}