"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function PetsCatalog() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State baru untuk menyimpan filter yang sedang aktif
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pets`);
        setPets(response.data.data || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Logika Filter: Jika "Semua" tampilkan original, jika tidak, saring berdasarkan spesies
  const filteredPets = activeFilter === 'Semua' 
    ? pets 
    : pets.filter(pet => pet.species === activeFilter);

  // Daftar kategori untuk tombol filter
  const categories = ['Semua', 'Kucing', 'Anjing', 'Lainnya'];

  if (loading) return <div className="text-center mt-20 text-orange-500 font-bold text-xl animate-pulse">Menunggu Mochi... 🐾</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 border-b-2 border-orange-200 pb-4 inline-block">Teman yang Tersedia</h2>
      </div>

      {/* --- UI Tombol Filter --- */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
              activeFilter === category
                ? 'bg-orange-500 text-white shadow-md transform scale-105' // Style saat aktif
                : 'bg-white text-orange-500 border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50' // Style saat tidak aktif
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* --- UI Grid Hewan (Menggunakan filteredPets, bukan pets) --- */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">😿</div>
          <p className="text-gray-500 text-lg font-semibold">Yah, belum ada {activeFilter.toLowerCase()} yang tersedia untuk diadopsi saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 w-full bg-gray-200 overflow-hidden">
                <img src={pet.image_url || pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      pet.status === 'Tersedia' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {pet.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">🐾 {pet.species}</p>
                  <p className="text-gray-500 text-sm mb-4">🎂 Umur: {pet.age}</p>
                </div>
                <Link href={`/pets/${pet.id}`} className="block text-center w-full bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-600 font-semibold py-2 rounded-xl transition-colors duration-200">
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}