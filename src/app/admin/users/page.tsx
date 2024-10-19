"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// User type definition
type User = {
  id_user: number;
  nama_user: string;
  foto: string;
  email: string;
  role: "admin" | "resepsionis";
};

export default function AdminHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user`);
    if (response.data.success) {
      setUsers(response.data.data);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in newUser) {
      if (newUser[key]) {
        formData.append(key, newUser[key]);
      }
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/user/register`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.success) {
      toast.success("User created successfully");
      setNewUser({});
      setIsCreateSidebarOpen(false);
      fetchUsers();
    }
  };

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

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC.baseURL}/user/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.success) {
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`${process.env.NEXT_PUBLIC.baseURL}/user/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg transform ${
          isCreateSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="nama_user">Name</Label>
              <Input
                id="nama_user"
                value={newUser.nama_user || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, nama_user: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) =>
                  setNewUser({
                    ...newUser,
                    role: value as "admin" | "resepsionis",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="resepsionis">Resepsionis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400" htmlFor="foto">Profile Picture</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setNewUser({ ...newUser, foto: e.target.files[0] });
                  }
                }}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
              Create User
            </Button>
          </form>
        </div>
      </div>

      <div className="flex-1 p-10 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => setIsCreateSidebarOpen(!isCreateSidebarOpen)} className="bg-blue-600 hover:bg-blue-500">
            <UserPlus className="mr-2 h-4 w-4" />{" "}
            {isCreateSidebarOpen ? "Close" : "Add User"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id_user} className="bg-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{user.nama_user}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={user.foto}
                    alt={user.nama_user}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-sm font-medium text-gray-400">{user.role}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div>
                          <Label htmlFor="edit_nama_user">Name</Label>
                          <Input
                            id="edit_nama_user"
                            value={editingUser?.nama_user || ""}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, nama_user: e.target.value } : null
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_email">Email</Label>
                          <Input
                            id="edit_email"
                            type="email"
                            value={editingUser?.email || ""}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, email: e.target.value } : null
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit_role">Role</Label>
                          <Select
                            onValueChange={(value) =>
                              setEditingUser((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      role: value as "admin" | "resepsionis",
                                    }
                                  : null
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={editingUser?.role || "Select role"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="resepsionis">Resepsionis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-400" htmlFor="edit_foto">Profile Picture</Label>
                          <Input
                            id="edit_foto"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files) {
                                setEditingUser((prev) =>
                                  prev ? { ...prev, foto: e.target.files[0] } : null
                                );
                              }
                            }}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                          Update User
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id_user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}