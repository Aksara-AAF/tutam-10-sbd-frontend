"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>({ name: '', email: '' });
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' atau 'requests'

  const [myPets, setMyPets] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Silakan Log In terlebih dahulu.");
      router.push('/login');
      return;
    }
    
    // Ambil data user dari local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.name) {
      setUser(userData);
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [petsRes, incomingRes, outgoingRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pets/me`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/requests/incoming`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/requests/outgoing`, config)
        ]);

        setMyPets(petsRes.data.data || petsRes.data);
        setIncomingRequests(incomingRes.data.data || incomingRes.data);
        setMyRequests(outgoingRes.data.data || outgoingRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [router]);

  const handleDeletePet = async (id: number) => {
    if(confirm("Yakin ingin menghapus postingan hewan ini?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyPets(myPets.filter(pet => pet.id !== id));
        alert("Postingan dihapus!");
      } catch(error) {
        console.error(error);
        alert("Gagal menghapus postingan.");
      }
    }
  };

  const handleRespondRequest = async (reqId: number, response: 'Terima' | 'Tolak') => {
    if(confirm(`Apakah kamu yakin ingin men${response.toLowerCase()} permintaan adopsi ini?`)) {
      try {
        const token = localStorage.getItem('token');
        const newStatus = response === 'Terima' ? 'Diterima' : 'Ditolak';
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/requests/${reqId}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncomingRequests(incomingRequests.map(req => 
          req.id === reqId ? { ...req, status: newStatus } : req
        ));
        alert(`Permintaan adopsi berhasil di${response.toLowerCase()}!`);
      } catch (error) {
        console.error(error);
        alert("Gagal merespons permintaan.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Kartu Info User */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex border-b-2 border-gray-100 mb-6">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`pb-4 px-6 font-bold text-lg transition-colors ${activeTab === 'posts' ? 'border-b-4 border-orange-500 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          📢 Postingan Saya
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`pb-4 px-6 font-bold text-lg transition-colors ${activeTab === 'requests' ? 'border-b-4 border-orange-500 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          💌 Pengajuan Adopsi Saya
        </button>
      </div>

      {/* ================= TAB 1: POSTINGAN SAYA ================= */}
      {activeTab === 'posts' && (
        <div className="space-y-8">
          {/* Sub-bagian 1: Permintaan Masuk (Dari orang yang mau adopsi) */}
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2"><span>🔔</span> Permintaan Adopsi Masuk</h3>
            {incomingRequests.filter(req => req.status === 'Menunggu').length === 0 ? (
              <p className="text-orange-600/70">Belum ada permintaan adopsi baru untuk hewanmu.</p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.filter(req => req.status === 'Menunggu').map(req => (
                  <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-orange-100">
                    <div>
                      <p className="text-gray-800 font-semibold"><span className="text-orange-500">{req.adopterName}</span> ingin mengadopsi <span className="font-bold">{req.petName}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRespondRequest(req.id, 'Terima')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-all">
                        Terima
                      </button>
                      <button onClick={() => handleRespondRequest(req.id, 'Tolak')} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all">
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-bagian 2: Daftar Hewan yang diposting */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Daftar Hewan Saya</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {myPets.length === 0 ? (
                <p className="p-8 text-center text-gray-500">Kamu belum memposting hewan untuk diadopsi.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
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
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${pet.status === 'Tersedia' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {pet.status}
                          </span>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <Link href={`/pets/edit/${pet.id}`} className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                            Edit
                          </Link>
                          <button onClick={() => handleDeletePet(pet.id)} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
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
        </div>
      )}

      {/* ================= TAB 2: PENGAJUAN SAYA ================= */}
      {activeTab === 'requests' && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {myRequests.length === 0 ? (
              <p className="p-8 text-center text-gray-500">Kamu belum mengajukan adopsi hewan apapun.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 border-b border-blue-100">
                    <th className="p-4 font-semibold">Hewan yang Diinginkan</th>
                    <th className="p-4 font-semibold">Pemilik Saat Ini</th>
                    <th className="p-4 font-semibold">Status Pengajuan</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">🐱 {req.petName}</td>
                      <td className="p-4 text-gray-600">{req.ownerName}</td>
                      <td className="p-4">
                        {req.status === 'Menunggu' && <span className="bg-yellow-100 text-yellow-600 text-sm font-bold px-3 py-1 rounded-full">⏳ Menunggu Respon</span>}
                        {req.status === 'Diterima' && <span className="bg-green-100 text-green-600 text-sm font-bold px-3 py-1 rounded-full">🎉 Diterima! Hubungi Pemilik</span>}
                        {req.status === 'Ditolak' && <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">❌ Ditolak</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
}