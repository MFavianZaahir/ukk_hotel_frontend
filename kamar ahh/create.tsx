import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CreateKamarPage = () => {
  const [nomorKamar, setNomorKamar] = useState('');
  const [idTipeKamar, setIdTipeKamar] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/hotel/room/', {
        nomor_kamar: nomorKamar,
        id_tipe_kamar: idTipeKamar,
      });
      router.push('/kamar');
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  return (
    <div>
      <h1>Create Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nomorKamar}
          onChange={(e) => setNomorKamar(e.target.value)}
          placeholder="Room Number"
          required
        />
        <select
          value={idTipeKamar}
          onChange={(e) => setIdTipeKamar(e.target.value)}
          required
        >
          {/* Populate with room types */}
          {tipeKamar.map((type) => (
            <option key={type.id_tipe_kamar} value={type.id_tipe_kamar}>
              {type.nama_tipe_kamar}
            </option>
          ))}
        </select>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateKamarPage;
