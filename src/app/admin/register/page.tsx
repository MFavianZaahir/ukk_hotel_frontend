      'use client'

      import { useState } from 'react'
      import axios from 'axios'
      import { useRouter } from 'next/navigation'
      import { Button } from "@/components/ui/button"
      import { Input } from "@/components/ui/input"
      import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
      import { Label } from "@/components/ui/label"
      import { AlertCircle } from "lucide-react"
      import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

      export default function RegisterPage() {
      const [nama, setNama] = useState('')
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [role, setRole] = useState('pelanggan')
      const [foto, setFoto] = useState<File | null>(null) // For profile picture
      const [error, setError] = useState('')
      const router = useRouter()

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
            setFoto(e.target.files[0])
      }
      }

      const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      const formData = new FormData()
      formData.append('nama', nama)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('role', role)
      if (foto) {
            formData.append('foto', foto)
      }

      try {
            const res = await axios.post('http://localhost:8000/user/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (res.data.success) {
            router.push('/') // Redirect after successful registration
            } else {
            setError(res.data.message)
            }
      } catch (err) {
            console.error(err)
            setError('Registration failed. Please try again.')
      }
      }

      return (
      <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[350px]">
            <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Fill in your details to create an account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            <CardContent className="space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="nama">Name</Label>
                  <Input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Name"
                  required
                  />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-500"
                  >
                  <option value="pelanggan">Pelanggan</option>
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  </select>
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="foto">Profile Picture</Label>
                  <Input
                  id="foto"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  />
                  </div>
            </CardContent>
            <CardFooter>
                  <Button type="submit" className="w-full">Register</Button>
            </CardFooter>
            </form>
            {error && (
            <Alert variant="destructive" className="mt-4 mx-4 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}
            </Card>
      </div>
      )
      }
