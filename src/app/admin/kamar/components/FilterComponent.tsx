"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import axios from "axios";

type FilterComponentProps = {
  roomTypes: { id_tipe_kamar: number; nama_tipe_kamar: string }[];
  onFilterApplied: (filteredData: any) => void;
};

export default function FilterComponent({ roomTypes, onFilterApplied }: FilterComponentProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFilter = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/filter`, {
        id_tipe_kamar: selectedRoomType,
        tgl_check_in: checkInDate?.toISOString().split('T')[0],
        tgl_check_out: checkOutDate?.toISOString().split('T')[0],
        search: searchTerm
      }, {
        withCredentials: true // Add this line to include credentials
      });

      if (response.data.kamar) {
        onFilterApplied(response.data.kamar);
      } else {
        toast.error("No rooms found matching the criteria");
      }
    } catch (error) {
      console.error("Error filtering rooms:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Unauthorized. Please log in and try again.");
      } else {
        toast.error("Error filtering rooms. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Filter Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="room-type" className="text-white">Room Type</Label>
          <Select onValueChange={setSelectedRoomType}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.id_tipe_kamar} value={type.id_tipe_kamar.toString()}>
                  {type.nama_tipe_kamar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="check-in" className="text-white">Check-in Date</Label>
          <DatePicker selected={checkInDate} onSelect={setCheckInDate} />
        </div>
        <div>
          <Label htmlFor="check-out" className="text-white">Check-out Date</Label>
          <DatePicker selected={checkOutDate} onSelect={setCheckOutDate} />
        </div>
        <div>
          <Label htmlFor="search" className="text-white">Search</Label>
          <Input
            id="search"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <Button onClick={handleFilter} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Apply Filter</Button>
    </div>
  );
}