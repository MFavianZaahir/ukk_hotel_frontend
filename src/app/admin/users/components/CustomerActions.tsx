'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CustomerActions({ customer }) {
  const [editingCustomer, setEditingCustomer] = useState(null)

  const handleUpdateCustomer = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target)
      const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/customer`, {
        method: 'PUT',
        body: formData
      })
      if (response.ok) {
        toast.success("Customer updated successfully")
        setEditingCustomer(null)
      } else {
        toast.error("Failed to update customer")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("Failed to update customer. Please try again.")
    }
  }

  const handleDeleteCustomer = async () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/customer/${customer?.id_pelanggan}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          toast.success("Customer deleted successfully")
        } else {
          toast.error("Failed to delete customer")
        }
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast.error("Failed to delete customer. Please try again.")
      }
    }
  }

  return (
    <div className="flex justify-end mt-4 space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingCustomer(customer)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCustomer} className="space-y-4">
            <div>
              <Label htmlFor="edit_nama">Name</Label>
              <Input
                id="edit_nama"
                name="nama"
                defaultValue={customer?.nama ?? ''}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                defaultValue={customer?.email ?? ''}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400" htmlFor="edit_foto">
                Profile Picture
              </Label>
              <Input
                id="edit_foto"
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
              Update Customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDeleteCustomer}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}