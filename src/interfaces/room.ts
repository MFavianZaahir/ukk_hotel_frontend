import { TypeRoom } from './typeroom';

export interface Room {
  map(arg0: (a: any, i: any) => JSX.Element): import('react').ReactNode;
  length: number;
  id_kamar: number;
  id_tipe_kamar: number;
  nomor_kamar: string;
  tipe_kamar: TypeRoom[];
}
