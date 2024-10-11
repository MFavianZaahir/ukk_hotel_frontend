import { Room } from './room';

export interface TypeRoom {
  map(arg0: (a: any, i: any) => JSX.Element): import('react').ReactNode;
  length: number;
  id_tipe_kamar: number;
  nama_tipe_kamar: string;
  slug: string;
  harga: number;
  deskripsi: string;
  foto: string;
  kamar: Room[];
}
