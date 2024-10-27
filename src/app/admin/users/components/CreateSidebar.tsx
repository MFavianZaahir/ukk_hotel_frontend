'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"

export default function CreateSidebar({ children }) {
  const [activeTab, setActiveTab] = useState('users')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target)
      const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/user/register`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        toast.success("User created successfully")
        e.target.reset()
      } else {
        toast.error("Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user. Please try again.")
    }
  }

  const handleCreateCustomer = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target)
      const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/customer`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        toast.success("Customer created successfully")
        e.target.reset()
      } else {
        toast.error("Failed to create customer")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      toast.error("Failed to create customer. Please try again.")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="bg-gray-800 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Create New {activeTab === "users" ? "User" : "Customer"}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 mb-4">
          <Button
            onClick={() => setActiveTab('users')}
            className={`mr-2 ${activeTab === 'users' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveTab('customers')}
            className={`${activeTab === 'customers' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Customers
          </Button>
        </div>
        {activeTab === "users" ? (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="nama_user" className="text-white">Name</Label>
              <Input
                id="nama_user"
                name="nama_user"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-white">Role</Label>
              <Select name="role">
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="resepsionis">Resepsionis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400" htmlFor="foto">
                Profile Picture
              </Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
            >
              Create User
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div>
              <Label htmlFor="nama" className="text-white">Name</Label>
              <Input
                id="nama"
                name="nama"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400" htmlFor="foto">
                Profile Picture
              </Label>
              <Input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
            >
              Create Customer
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}