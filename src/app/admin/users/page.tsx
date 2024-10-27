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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Customer (Pelanggan) type definition
type Customer = {
  id_pelanggan: number;
  nama: string;
  foto: string;
  email: string;
  slug: string;
};

export default function AdminHome() {
  const [users, setUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchCustomers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error("Failed to fetch users:", response.data.message);
        toast.error("Failed to fetch users. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/customer`);
      if (response.data.data) {
        setCustomers(response.data.data);
      } else {
        console.error("Failed to fetch customers:", response.data.message);
        toast.error("Failed to fetch customers. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers. Please check your network connection.");
    } finally {
      setIsLoading(false);
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

    try {
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
      } else {
        toast.error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in newCustomer) {
      if (newCustomer[key]) {
        formData.append(key, newCustomer[key]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/customer`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Customer created successfully");
        setNewCustomer({});
        setIsCreateSidebarOpen(false);
        fetchCustomers();
      } else {
        toast.error(response.data.message || "Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer. Please try again.");
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

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/user`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

// ... (previous imports and code remain the same)

const handleUpdateCustomer = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingCustomer) return;

  const formData = new FormData();
  formData.append("id_pelanggan", editingCustomer.id_pelanggan.toString());
  formData.append("nama", editingCustomer.nama);
  formData.append("email", editingCustomer.email);

  if (editingCustomer.foto instanceof File) {
    formData.append("foto", editingCustomer.foto);
  }

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_baseURL}/customer`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.success) {
      toast.success("Customer updated successfully");
      setEditingCustomer(null);
      fetchCustomers();
    } else {
      toast.error(response.data.message || "Failed to update customer");
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    toast.error("Failed to update customer. Please try again.");
  }
};

// ... (rest of the component code remains the same)

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/user/${id}`);
        if (response.data.success) {
          toast.success("User deleted successfully");
          fetchUsers();
        } else {
          toast.error(response.data.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/customer/${id}`);
        if (response.data.success) {
          toast.success("Customer deleted successfully");
          fetchCustomers();
        } else {
          toast.error(response.data.message || "Failed to delete customer");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer. Please try again.");
      }
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
          <h2 className="text-2xl font-semibold mb-6">Create New {activeTab === "users" ? "User" : "Customer"}</h2>
          {activeTab === "users" ? (
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
                  className="bg-gray-700 border-gray-600 text-white"
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
                  className="bg-gray-700 border-gray-600 text-white"
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
                  className="bg-gray-700 border-gray-600 text-white"
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
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setNewUser({ ...newUser, foto: e.target.files[0] });
                    }
                  }}
                  required
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
                <Label htmlFor="nama">Name</Label>
                <Input
                  id="nama"
                  value={newCustomer.nama || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, nama: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, password: e.target.value })
                  }
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
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setNewCustomer({ ...newCustomer, foto: e.target.files[0] });
                    }
                  }}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500"
              >
                Create  Customer
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="flex-1 p-10 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User and Customer Management</h1>
          <Button
            onClick={() => setIsCreateSidebarOpen(!isCreateSidebarOpen)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />{" "}
            {isCreateSidebarOpen ? "Close" : `Add ${activeTab === "users" ? "User" : "Customer"}`}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            {isLoading ? (
              <div className="text-center">Loading users...</div>
            ) : (
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
                          <DialogContent className="bg-gray-800 text-white">
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
                                  className="bg-gray-700 border-gray-600 text-white"
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
                                  className="bg-gray-700 border-gray-600 text-white"
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
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder={editingUser?.role || "Select role"} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="resepsionis">Resepsionis</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-gray-400" htmlFor="edit_foto">
                                  Profile Picture
                                </Label>
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
                          onClick={() => handleDeleteUser(user.id_user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="customers">
            {isLoading ? (
              <div className="text-center">Loading customers...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <Card key={customer.id_pelanggan} className="bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">{customer.nama}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <img
                          src={customer.foto}
                          alt={customer.nama}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm text-gray-400">{customer.email}</p>
                          <p className="text-sm font-medium text-gray-400">
                            Customer
                          </p>
                        </div>
                      </div>
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
                                  value={editingCustomer?.nama || ""}
                                  onChange={(e) =>
                                    setEditingCustomer((prev) =>
                                      prev ? { ...prev, nama: e.target.value } : null
                                    )
                                  }
                                  required
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_email">Email</Label>
                                <Input
                                  id="edit_email"
                                  type="email"
                                  value={editingCustomer?.email || ""}
                                  onChange={(e) =>
                                    setEditingCustomer((prev) =>
                                      prev ? { ...prev, email: e.target.value } : null
                                    )
                                  }
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
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      setEditingCustomer((prev) =>
                                        prev ? { ...prev, foto: e.target.files[0] } : null
                                      );
                                    }
                                  }}
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
                          onClick={() => handleDeleteCustomer(customer.id_pelanggan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}