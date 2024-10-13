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
import { toast } from "sonner"; // For toast notifications
import axios from "axios";

// Types for Room Type
type RoomType = {
  id_tipe: number;
  nama_tipe: string;
};

export default function RoomTypeManagement() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newRoomType, setNewRoomType] = useState<Partial<RoomType>>({});
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [isCreateRoomTypeSidebarOpen, setIsCreateRoomTypeSidebarOpen] =
    useState(false);

  // Fetch Room Types
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room-type`
      );
      if (response.data.success) {
        setRoomTypes(response.data.data);
      } else {
        toast.error("Failed to fetch room types");
        console.error("Failed to fetch room types:", response.data.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error fetching room types:",
          error.response?.data || error.message
        );
      } else {
        console.error("General error fetching room types:", error);
      }
      toast.error("Error fetching room types");
    }
  };

  // CRUD for Room Type
  const handleCreateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/room-type`,
        newRoomType
      );
      if (response.data.success) {
        toast.success("Room Type created successfully");
        setNewRoomType({});
        setIsCreateRoomTypeSidebarOpen(false);
        fetchRoomTypes();
      } else {
        toast.error(response.data.message || "Failed to create room type");
      }
    } catch (error) {
      toast.error("Error creating room type");
    }
  };

  const handleUpdateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoomType) return;
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/room-type/${editingRoomType.id_tipe}`,
        editingRoomType
      );
      if (response.data.success) {
        toast.success("Room Type updated successfully");
        setEditingRoomType(null);
        fetchRoomTypes();
      } else {
        toast.error(response.data.message || "Failed to update room type");
      }
    } catch (error) {
      toast.error("Error updating room type");
    }
  };

  const handleDeleteRoomType = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room type?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_baseURL}/room-type/${id}`
        );
        if (response.data.success) {
          toast.success("Room Type deleted successfully");
          fetchRoomTypes();
        } else {
          toast.error(response.data.message || "Failed to delete room type");
        }
      } catch (error) {
        toast.error("Error deleting room type");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Room Type Management</h1>
        <Button
          onClick={() =>
            setIsCreateRoomTypeSidebarOpen(!isCreateRoomTypeSidebarOpen)
          }
        >
          Add Room Type
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((roomType) => (
            <Card key={roomType.id_tipe}>
              <CardHeader>
                <CardTitle>{roomType.nama_tipe}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mt-4 space-x-2">
                  {/* Edit Room Type Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setEditingRoomType(roomType)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Room Type</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateRoomType}>
                        <Label>Room Type Name</Label>
                        <Input
                          type="text"
                          value={editingRoomType?.nama_tipe || ""}
                          onChange={(e) =>
                            setEditingRoomType((prev) =>
                              prev
                                ? { ...prev, nama_tipe: e.target.value }
                                : null
                            )
                          }
                        />
                        <Button type="submit">Update Room Type</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRoomType(roomType.id_tipe)}
                  >
                    Delete
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
