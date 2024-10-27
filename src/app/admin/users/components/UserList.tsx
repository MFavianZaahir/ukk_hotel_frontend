'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UserActions from './UserActions'
import { toast } from "sonner"

interface User {
  id_user: number;
  nama_user: string;
  email: string;
  role: string;
  foto?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user`)
      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        toast.error("Failed to fetch users")
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error("An error occurred while fetching users")
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleUserUpdated = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.id_user} className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">{user.nama_user}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={user.foto || '/placeholder.svg?height=64&width=64'}
                alt={user.nama_user}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm font-medium text-gray-400">{user.role}</p>
              </div>
            </div>
            <UserActions user={user} onUserUpdated={handleUserUpdated} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}