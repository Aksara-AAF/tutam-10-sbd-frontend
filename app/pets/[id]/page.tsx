"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pets/${params.id}`);
        setPet(response.data.data || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetail();
  }, [params.id]);

  const handleAdopt = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Silakan Log In terlebih dahulu untuk mengajukan adopsi.");
      router.push('/login');
      return;
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/requests`, { pet_id: params.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Terima kasih! Permintaan adopsi untuk ${pet.name} telah dikirim ke pemiliknya.`);
      router.push('/pets');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim permintaan adopsi. Coba lagi nanti.');
    }
  };

  if (loading) return <div className="text-center mt-32 text-orange-500 font-bold text-xl animate-pulse">Mengendus jejak... 🐾</div>;
  
  if (!pet) return (
    <div className="text-center py-32">
      <h1 className="text-4xl mb-4">😿</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hewan tidak ditemukan</h2>
      <Link href="/pets" className="text-orange-500 hover:underline">Kembali ke Katalog</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Tombol Kembali */}
      <Link href="/pets" className="inline-flex items-center text-gray-500 hover:text-orange-500 font-semibold mb-6 transition-colors">
        <span className="mr-2">←</span> Kembali ke Katalog
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden flex flex-col md:flex-row">
        {/* Bagian Kiri: Gambar */}
        <div className="md:w-1/2 h-80 md:h-auto bg-gray-200">
          <img src={pet.image_url || pet.image} alt={pet.name} className="w-full h-full object-cover" />
        </div>

        {/* Bagian Kanan: Detail Informasi */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-800">{pet.name}</h1>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${pet.status === 'Tersedia' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {pet.status}
              </span>
            </div>
            
            <div className="space-y-4 mb-8 text-gray-600">
              <p className="flex items-center gap-2"><span className="text-xl">🐾</span> <strong>Spesies:</strong> {pet.species}</p>
              <p className="flex items-center gap-2"><span className="text-xl">🎂</span> <strong>Umur:</strong> {pet.age}</p>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-4">
                <p className="font-bold text-orange-800 mb-1 flex items-center gap-2"><span>🩺</span> Catatan Kesehatan:</p>
                <p className="text-orange-700 text-sm leading-relaxed">{pet.health_notes || pet.health}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <p className="text-sm text-gray-500">Diposting oleh:</p>
              <p className="font-semibold text-gray-800">{pet.uploader}</p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <button 
            onClick={handleAdopt}
            disabled={pet.status !== 'Tersedia'}
            className={`w-full font-bold py-4 rounded-xl shadow-md transition-all ${
              pet.status === 'Tersedia' 
              ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {pet.status === 'Tersedia' ? 'Ajukan Adopsi Sekarang 🏡' : 'Sedang Diproses'}
          </button>
        </div>
      </div>
    </div>
  );
}