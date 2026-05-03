"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditPetPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Kucing');
  const [age, setAge] = useState('');
  const [health, setHealth] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Tersedia');
  
  const router = useRouter();
  const params = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Silakan Log In terlebih dahulu.");
      router.push('/login');
      return;
    }
    setIsAuthorized(true);

    const fetchPetData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pets/${params.id}`);
        const data = response.data.data || response.data;
        setName(data.name);
        setSpecies(data.species);
        setAge(data.age);
        setHealth(data.health_notes || data.health || '');
        setImage(data.image_url || data.image || '');
        setStatus(data.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetData();
  }, [router, params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pets/${params.id}`, { 
        name, species, age, health_notes: health, image_url: image, status 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Data hewan berhasil diperbarui!');
      router.push('/profile');
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  if (!isAuthorized) return <div className="text-center mt-32 text-orange-500 font-bold text-xl animate-pulse">Memeriksa akses... 🐾</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-md p-8 md:p-10 border border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Edit Data Hewan 📝</h2>
        <p className="text-gray-500 text-center mb-8">Perbarui informasi kesehatan atau status adopsi hewanmu.</p>
        
        <form onSubmit={handleUpdate} className="space-y-5 text-gray-700">
          <div>
            <label className="block font-semibold mb-1">Nama Hewan</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Spesies</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white">
                <option value="Kucing">Kucing 🐱</option>
                <option value="Anjing">Anjing 🐶</option>
                <option value="Lainnya">Lainnya 🐰</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Umur</label>
              <input type="text" required value={age} onChange={(e) => setAge(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Status Adopsi</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 bg-orange-50 font-semibold text-orange-700">
              <option value="Tersedia">🟢 Tersedia</option>
              <option value="Diproses">🟡 Sedang Diproses</option>
              <option value="Sudah Diadopsi">🔴 Sudah Diadopsi</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Ubah status ini jika sudah ada yang mengajukan adopsi.</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Catatan Kesehatan</label>
            <textarea required value={health} onChange={(e) => setHealth(e.target.value)} rows={3} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400" />
          </div>

          <div>
            <label className="block font-semibold mb-1">URL Foto</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => router.push('/profile')} className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all">
              Batal
            </button>
            <button type="submit" className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}