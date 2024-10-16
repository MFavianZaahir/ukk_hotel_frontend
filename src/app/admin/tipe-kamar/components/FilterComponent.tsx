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
      });

      if (response.data.kamar) {
        onFilterApplied(response.data.kamar);
      } else {
        toast.error("Failed to filter rooms");
      }
    } catch (error) {
      console.error("Error filtering rooms:", error);
      toast.error("Error filtering rooms");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-4">Filter Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="room-type">Room Type</Label>
          <Select onValueChange={setSelectedRoomType}>
            <SelectTrigger className="bg-gray-700 border-gray-600">
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
          <Label htmlFor="check-in">Check-in Date</Label>
          <DatePicker selected={checkInDate} onSelect={setCheckInDate} />
        </div>
        <div>
          <Label htmlFor="check-out">Check-out Date</Label>
          <DatePicker selected={checkOutDate} onSelect={setCheckOutDate} />
        </div>
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>
      <Button onClick={handleFilter} className="mt-4">Apply Filter</Button>
    </div>
  );
}