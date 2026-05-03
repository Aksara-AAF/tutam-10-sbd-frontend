"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>({ name: 'Akbar Anvasa Faraby', email: 'akbar@example.com' }); // Mock User
  const [myPets, setMyPets] = useState<any[]>([]);

  useEffect(() => {
    // Mock Data Hewan Milik User
    setMyPets([
      { id: 1, name: 'Mochi', species: 'Kucing', status: 'Tersedia' }
    ]);
  }, []);

  const handleDelete = (id: number) => {
    if(confirm("Apakah kamu yakin ingin menghapus data hewan ini?")) {
      // axios.delete(...)
      setMyPets(myPets.filter(pet => pet.id !== id));
      alert("Data berhasil dihapus!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Kartu Info User */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">Postingan Adopsi Saya</h3>
      
      {/* Tabel CRUD Minimalis */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {myPets.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Kamu belum memposting hewan untuk diadopsi.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50 text-gray-600 border-b border-orange-100">
                <th className="p-4 font-semibold">Nama Hewan</th>
                <th className="p-4 font-semibold">Spesies</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {myPets.map((pet) => (
                <tr key={pet.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{pet.name}</td>
                  <td className="p-4 text-gray-600">{pet.species}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">{pet.status}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Link href={`/pets/edit/${pet.id}`} className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors block text-center">
                    Edit
                    </Link>
                    <button onClick={() => handleDelete(pet.id)} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}