// src/interfaces/pelanggan.ts

export type RoomType = {
      id_tipe_kamar: number;
      nama_tipe_kamar: string;
      harga: number;
      deskripsi: string;
      foto: string;
    }
    
    export type BookingData = {
      tgl_check_in: Date | null;
      tgl_check_out: Date | null;
      nama_tamu: string;
      jumlah_kamar: number;
      id_tipe_kamar: number;
      email_pemesanan: string;
      status_pemesanan: string;
    }
    
    export type BookingConfirmation = {
      nomor_pemesanan: string;
      id: number;
      nama_tamu: string;
      tgl_check_in: string;
      tgl_check_out: string;
      jumlah_kamar: number;
      tipe_kamar: string;
      total_harga: number;
    }
    