//app/admin/tipe-kamar/page.tsx
"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { Edit, Trash2, Plus, X } from 'lucide-react';

type RoomType = {
  id_tipe_kamar: number;
  nama_tipe_kamar: string;
  harga: number;
  deskripsi: string;
  foto: string;
};

export default function RoomTypeManagement() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newRoomType, setNewRoomType] = useState<Partial<RoomType>>({});
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [isCreateRoomTypeSidebarOpen, setIsCreateRoomTypeSidebarOpen] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/room-type`);
      if (response.data.data) {
        setRoomTypes(response.data.data);
      } else {
        toast.error("Failed to fetch room types");
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast.error("Error fetching room types");
    }
  };

  const handleCreateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newRoomType).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/room-type`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success("Room Type created successfully");
        setNewRoomType({});
        setIsCreateRoomTypeSidebarOpen(false);
        fetchRoomTypes();
      } else {
        toast.error(response.data.message || "Failed to create room type");
      }
    } catch (error) {
      console.error("Error creating room type:", error);
      toast.error("Error creating room type");
    }
  };

  const handleUpdateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoomType) return;
    const formData = new FormData();
    Object.entries(editingRoomType).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_baseURL}/room-type`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success("Room Type updated successfully");
        setEditingRoomType(null);
        fetchRoomTypes();
      } else {
        toast.error(response.data.message || "Failed to update room type");
      }
    } catch (error) {
      console.error("Error updating room type:", error);
      toast.error("Error updating room type");
    }
  };

  const handleDeleteRoomType = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room type?")) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/room-type/${id}`);
        if (response.data.success) {
          toast.success("Room Type deleted successfully");
          fetchRoomTypes();
        } else {
          toast.error(response.data.message || "Failed to delete room type");
        }
      } catch (error) {
        console.error("Error deleting room type:", error);
        toast.error("Error deleting room type");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar for creating new room type */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg transform ${isCreateRoomTypeSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create New Room Type</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsCreateRoomTypeSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleCreateRoomType} className="space-y-3">
            <div>
              <Label htmlFor="nama_tipe_kamar">Room Type Name</Label>
              <Input
                id="nama_tipe_kamar"
                value={newRoomType.nama_tipe_kamar || ''}
                onChange={(e) => setNewRoomType({...newRoomType, nama_tipe_kamar: e.target.value})}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="harga">Price</Label>
              <Input
                id="harga"
                type="number"
                value={newRoomType.harga || ''}
                onChange={(e) => setNewRoomType({...newRoomType, harga: Number(e.target.value)})}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="deskripsi">Description</Label>
              <Textarea
                id="deskripsi"
                value={newRoomType.deskripsi || ''}
                onChange={(e) => setNewRoomType({...newRoomType, deskripsi: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="foto">Photo</Label>
              <Input
                id="foto"
                type="file"
                onChange={(e) => setNewRoomType({...newRoomType, foto: e.target.files?.[0] || null})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full">Create Room Type</Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Room Type Management</h1>
          <Button onClick={() => setIsCreateRoomTypeSidebarOpen(!isCreateRoomTypeSidebarOpen)}>
            <Plus className="mr-2 h-4 w-4" /> Add Room Type
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {roomTypes.map((roomType) => (
              <Card key={roomType.id_tipe_kamar} className="bg-gray-800 border-gray-700">
                <CardHeader className="p-3">
                  <CardTitle className="text-lg text-gray-300">{roomType.nama_tipe_kamar}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={roomType.foto}
                      alt={roomType.nama_tipe_kamar}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">Price: Rp. {roomType.harga}</p>
                      <p className="text-xs text-gray-400">{roomType.deskripsi}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setEditingRoomType(roomType)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 text-white">
                              <DialogHeader>
                                <DialogTitle>Edit Room Type</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateRoomType} className="space-y-3">
                                <div>
                                  <Label htmlFor="edit_nama_tipe_kamar">Room Type Name</Label>
                                  <Input
                                    id="edit_nama_tipe_kamar"
                                    value={editingRoomType?.nama_tipe_kamar || ''}
                                    onChange={(e) => setEditingRoomType(prev => prev ? {...prev, nama_tipe_kamar: e.target.value} : null)}
                                    required
                                    className="bg-gray-700 border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_harga">Price</Label>
                                  <Input
                                    id="edit_harga"
                                    type="number"
                                    value={editingRoomType?.harga || ''}
                                    onChange={(e) => setEditingRoomType(prev => prev ? {...prev, harga: Number(e.target.value)} : null)}
                                    required
                                    className="bg-gray-700 border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_deskripsi">Description</Label>
                                  <Textarea
                                    id="edit_deskripsi"
                                    value={editingRoomType?.deskripsi || ''}
                                    onChange={(e) => setEditingRoomType(prev => prev ? {...prev, deskripsi: e.target.value} : null)}
                                    className="bg-gray-700 border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_foto">Photo</Label>
                                  <Input
                                    id="edit_foto"
                                    type="file"
                                    onChange={(e) => setEditingRoomType(prev => prev ? {...prev, foto: e.target.files?.[0] || null} : null)}
                                    className="bg-gray-700 border-gray-600"
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button type="button" className="text-black" variant="outline" onClick={() => setEditingRoomType(null)}>Cancel</Button>
                                  <Button type="submit">Update</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Room Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDeleteRoomType(roomType.id_tipe_kamar)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Room Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}