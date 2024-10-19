//app/admin/kamar/page.tsx
"use client";

import { useState, useEffect, forwardRef } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { Edit, Trash2, Plus, X, Search } from "lucide-react";

const DialogWithRef = forwardRef((props, ref) => (
  <Dialog {...props} ref={ref} />
));

type Room = {
  id_kamar: number;
  nomor_kamar: string;
  id_tipe_kamar: number;
  tipe_kamar: {
    id_tipe_kamar: number;
    nama_tipe_kamar: string;
    harga: number;
    foto: string;
  };
};

type RoomType = {
  id_tipe_kamar: number;
  nama_tipe_kamar: string;
  harga: number;
  foto: string;
};

export default function KamarManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isCreateRoomSidebarOpen, setIsCreateRoomSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, typeFilter]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room`
      );
      if (response.data.data) {
        setRooms(response.data.data);
      } else {
        toast.error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Error fetching rooms");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room-type`
      );
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

  const filterRooms = () => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter((room) => {
        const nomorKamar = typeof room.nomor_kamar === 'string' ? room.nomor_kamar : '';
        const tipeKamar = room.tipe_kamar.nama_tipe_kamar || '';

        return (
          nomorKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tipeKamar.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter(
        (room) => room.tipe_kamar.id_tipe_kamar.toString() === typeFilter
      );
    }

    setFilteredRooms(filtered);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/room`,
        {
          nomor_kamar: newRoom.nomor_kamar,
          id_tipe_kamar: newRoom.tipe_kamar?.id_tipe_kamar,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Room created successfully");
        setNewRoom({});
        setIsCreateRoomSidebarOpen(false);
        fetchRooms();
      } else {
        toast.error(response.data.message || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Error creating room");
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_baseURL}/room/${editingRoom.id_kamar}`,
        {
          nomor_kamar: editingRoom.nomor_kamar,
          id_tipe_kamar: editingRoom.tipe_kamar.id_tipe_kamar,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Room updated successfully");
        setEditingRoom(null);
        fetchRooms();
      } else {
        toast.error(response.data.message || "Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
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
        console.error("Error deleting room:", error);
        toast.error("Error deleting room");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar for creating new room */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg transform ${
          isCreateRoomSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create New Room</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreateRoomSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleCreateRoom} className="space-y-3">
            <div>
              <Label htmlFor="nomor_kamar">Room Number</Label>
              <Input
                id="nomor_kamar"
                value={newRoom.nomor_kamar || ""}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, nomor_kamar: e.target.value })
                }
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="tipe_kamar">Room Type</Label>
              <Select
                onValueChange={(value) => {
                  const selectedType = roomTypes.find(
                    (type) => type.id_tipe_kamar.toString() === value
                  );
                  setNewRoom({
                    ...newRoom,
                    id_tipe_kamar: selectedType
                      ? selectedType.id_tipe_kamar
                      : undefined,
                    tipe_kamar: selectedType,
                  });
                }}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes
                    .filter((type) => type?.id_tipe_kamar)
                    .map((type) => (
                      <SelectItem
                        key={type.id_tipe_kamar}
                        value={type.id_tipe_kamar.toString()}
                      >
                        {type.nama_tipe_kamar}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Create Room
            </Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Room Management</h1>
          <Button
            onClick={() => setIsCreateRoomSidebarOpen(!isCreateRoomSidebarOpen)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </div>

        {/* Filter controls */}
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <Label htmlFor="type-filter">Filter by Type</Label>
            <Select onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
              <SelectTrigger id="type-filter" className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {roomTypes
                  .filter((type) => type?.id_tipe_kamar)
                  .map((type) => (
                    <SelectItem
                      key={type.id_tipe_kamar}
                      value={type.id_tipe_kamar.toString()}
                    >
                      {type.nama_tipe_kamar}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <Card
                key={room.id_kamar}
                className="bg-gray-800 border-gray-700 w-full"
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-lg text-gray-300">
                    Room {room.nomor_kamar}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {room.tipe_kamar && (
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={room.tipe_kamar.foto}
                        alt={room.tipe_kamar.nama_tipe_kamar}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-sm text-white">
                          {room.tipe_kamar.nama_tipe_kamar}
                        </p>
                        <p className="text-xs text-gray-400">
                          Rp. {room.tipe_kamar.harga.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogWithRef>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingRoom(room)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 text-white">
                              <DialogHeader>
                                <DialogTitle>Edit Room</DialogTitle>
                                <DialogDescription>
                                  Update the room details below.
                                </DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={handleUpdateRoom}
                                className="space-y-3"
                              >
                                <div>
                                  <Label htmlFor="edit_nomor_kamar">
                                    Room Number
                                  </Label>
                                  <Input
                                    id="edit_nomor_kamar"
                                    value={editingRoom?.nomor_kamar || ""}
                                    onChange={(e) =>
                                      setEditingRoom((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              nomor_kamar: e.target.value,
                                            }
                                          : null
                                      )
                                    }
                                    required
                                    className="bg-gray-700 border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_tipe_kamar">
                                    Room Type
                                  </Label>
                                  <Select
                                    onValueChange={(value) => {
                                      const  selectedType = roomTypes.find(
                                        (type) =>
                                          type.id_tipe_kamar.toString() ===
                                          value
                                      );
                                      setEditingRoom((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              tipe_kamar: selectedType
                                                ? {
                                                    ...selectedType,
                                                  }
                                                : prev.tipe_kamar,
                                            }
                                          : null
                                      );
                                    }}
                                  >
                                    <SelectTrigger className="bg-gray-700 border-gray-600">
                                      <SelectValue
                                        placeholder={
                                          editingRoom?.tipe_kamar
                                            ?.nama_tipe_kamar ||
                                          "Select room type"
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roomTypes
                                        .filter((type) => type?.id_tipe_kamar)
                                        .map((type) => (
                                          <SelectItem
                                            key={type.id_tipe_kamar}
                                            value={type.id_tipe_kamar.toString()}
                                          >
                                            {type.nama_tipe_kamar}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingRoom(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit">Update</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </DialogWithRef>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Room</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteRoom(room.id_kamar)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Room</p>
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
  );
}