"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreatePetPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Kucing');
  const [age, setAge] = useState('');
  const [health, setHealth] = useState('');
  const [image, setImage] = useState('');
  
  const router = useRouter();
  
  // State untuk mencegah form muncul sekejap sebelum diredirect
  const [isAuthorized, setIsAuthorized] = useState(false);

  // === PROTEKSI HALAMAN ===
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Silakan Log In terlebih dahulu untuk membuka form Open Adopsi.");
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pets`, { name, species, age, health_notes: health, image_url: image }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hewan berhasil didaftarkan untuk adopsi!');
      router.push('/pets');
    } catch (error) {
      console.error(error);
      alert('Gagal mendaftarkan hewan. Coba lagi.');
    }
  };

  // Tampilkan layar kosong/loading saat sistem sedang mengecek token
  if (!isAuthorized) return <div className="text-center mt-32 text-orange-500 font-bold text-xl animate-pulse">Memeriksa akses... 🐾</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-md p-8 md:p-10 border border-orange-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Open Adopsi 🏡</h2>
        <p className="text-gray-500 text-center mb-8">Bantu mereka menemukan keluarga baru yang penuh kasih sayang.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
          <div>
            <label className="block font-semibold mb-1">Nama Hewan</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors" placeholder="Misal: Mochi" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Spesies</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 bg-white">
                <option value="Kucing">Kucing 🐱</option>
                <option value="Anjing">Anjing 🐶</option>
                <option value="Lainnya">Lainnya 🐰</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Umur (Bulan/Tahun)</label>
              <input type="text" required value={age} onChange={(e) => setAge(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400" placeholder="Misal: 3 Bulan" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Catatan Kesehatan</label>
            <textarea required value={health} onChange={(e) => setHealth(e.target.value)} rows={3} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400" placeholder="Misal: Sudah vaksin pertama, sehat, lincah, tapi agak pemalu." />
          </div>

          <div>
            <label className="block font-semibold mb-1">URL Foto (Link Gambar)</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400" placeholder="https://..." />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all mt-6">
            Posting untuk Adopsi
          </button>
        </form>
      </div>
    </div>
  );
}