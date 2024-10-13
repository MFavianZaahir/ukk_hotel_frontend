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

// Types for Room and Room Type
type Room = {
  id_kamar: number;
  nama_kamar: string;
  tipe_kamar: string;
  harga: number;
};

type RoomType = {
  id_tipe: number;
  nama_tipe: string;
};

export default function KamarManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreateRoomSidebarOpen, setIsCreateRoomSidebarOpen] = useState(false);

  // Fetch Rooms and Room Types
  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room`
      );

      // console.log(response.data.data);

      if (response.data.data) {
        setRooms(response.data.data);
      } else {
        toast.error("Failed to fetch rooms");
        console.error(
          "Failed to fetch rooms:",
          response.data?.message || "No message provided"
        );
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error fetching rooms:",
          error.response?.data || error.message
        );
      } else {
        console.error("General error fetching rooms:", error);
      }
      toast.error("Error fetching rooms");
    }
  };

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
        // Axios-specific error handling
        console.error(
          "Axios error fetching room types:",
          error.response?.data || error.message
        );
      } else {
        // General error handling
        console.error("General error fetching room types:", error);
      }
      toast.error("Error fetching room types");
    }
  };

  // CRUD for Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/room`,
        newRoom
      );
      if (response.data.success) {
        toast.success("Room created successfully");
        setNewRoom({});
        setIsCreateRoomSidebarOpen(false);
        fetchRooms();
      } else {
        toast.error(response.data.message || "Failed to create room");
      }
    } catch (error) {
      toast.error("Error creating room");
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/room/${editingRoom.id_kamar}`,
        editingRoom
      );
      if (response.data.success) {
        toast.success("Room updated successfully");
        setEditingRoom(null);
        fetchRooms();
      } else {
        toast.error(response.data.message || "Failed to update room");
      }
    } catch (error) {
      toast.error("Error updating room");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_baseURL}/room/${id}`
        );
        if (response.data.success) {
          toast.success("Room deleted successfully");
          fetchRooms();
        } else {
          toast.error(response.data.message || "Failed to delete room");
        }
      } catch (error) {
        toast.error("Error deleting room");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Room CRUD UI */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <Button
          onClick={() => setIsCreateRoomSidebarOpen(!isCreateRoomSidebarOpen)}
        >
          Add Room
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id_kamar}>
              <CardHeader>
                <CardTitle>{room.nama_kamar}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Room Type:{" "}
                  {room.tipe_kamar && (
                    <div>
                      <img
                        src={room.tipe_kamar.foto}
                        alt={room.tipe_kamar.nama_tipe_kamar}
                        className="w-16 h-16 object-cover"
                      />
                      <span>{room.tipe_kamar.nama_tipe_kamar}</span>
                    </div>
                  )}
                </p>
                <p>Price: Rp.{room.tipe_kamar.harga}</p>
                <div className="flex justify-end mt-4 space-x-2">
                  {/* Add Room Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Room</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Room</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateRoom}>
                        <Label>Room Name</Label>
                        <Input
                          type="text"
                          value={newRoom.nama_kamar || ""}
                          onChange={(e) =>
                            setNewRoom({
                              ...newRoom,
                              nama_kamar: e.target.value,
                            })
                          }
                        />
                        <Label>Room Type</Label>
                        <Input
                          type="text"
                          value={newRoom.tipe_kamar || ""}
                          onChange={(e) =>
                            setNewRoom({
                              ...newRoom,
                              tipe_kamar: e.target.value,
                            })
                          }
                        />
                        <Button type="submit">Create Room</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Room Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingRoom(room)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateRoom}>
                        <Label>Room Name</Label>
                        <Input
                          type="text"
                          value={editingRoom?.nama_kamar || ""}
                          onChange={(e) =>
                            setEditingRoom((prev) =>
                              prev
                                ? { ...prev, nama_kamar: e.target.value }
                                : null
                            )
                          }
                        />
                        <Label>Room Type</Label>
                        <Input
                          type="text"
                          value={editingRoom?.tipe_kamar || ""}
                          onChange={(e) =>
                            setEditingRoom((prev) =>
                              prev
                                ? { ...prev, tipe_kamar: e.target.value }
                                : null
                            )
                          }
                        />
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={editingRoom?.harga || 0}
                          onChange={(e) =>
                            setEditingRoom((prev) =>
                              prev
                                ? { ...prev, harga: parseInt(e.target.value) }
                                : null
                            )
                          }
                        />
                        <Button type="submit">Update Room</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRoom(room.id_kamar)}
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
