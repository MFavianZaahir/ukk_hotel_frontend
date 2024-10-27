'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface User {
  id_user: number;
  nama_user: string;
  email: string;
  role: string;
  foto?: string | File;
  password?: string;
}

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
}

export default function UserActions({ user, onUserUpdated }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser || !e.target.files) return;
    setEditingUser({ ...editingUser, foto: e.target.files[0] });
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData();
    formData.append("id_user", editingUser.id_user.toString());
    formData.append("nama_user", editingUser.nama_user);
    formData.append("email", editingUser.email);
    formData.append("role", editingUser.role);
    if (editingUser.password) formData.append("password", editingUser.password);

    if (editingUser.foto instanceof File) {
      formData.append("foto", editingUser.foto);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/user`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        setIsOpen(false);
        setEditingUser(null);
        onUserUpdated();
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  }

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/user/${user.id_user}`);
        if (response.data.success) {
          toast.success("User deleted successfully");
          onUserUpdated();
        } else {
          toast.error(response.data.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  }

  return (
    <div className="flex justify-end mt-4 space-x-2">
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setEditingUser({ ...user });
      }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <Label htmlFor="edit_nama_user">Name</Label>
              <Input
                id="edit_nama_user"
                name="nama_user"
                value={editingUser?.nama_user || ''}
                onChange={handleInputChange}
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
                value={editingUser?.email || ''}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit_role">Role</Label>
              <Select name="role" value={editingUser?.role || ''} onValueChange={(value) => handleInputChange({ target: { name: 'role', value } } as any)}>
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
              <Label htmlFor="edit_password">New Password (optional)</Label>
              <Input
                id="edit_password"
                name="password"
                type="password"
                value={editingUser?.password || ''}
                onChange={handleInputChange}
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
                onChange={handleFileChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
            >
              Update User
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDeleteUser}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}