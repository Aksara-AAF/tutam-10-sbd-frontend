"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { name, email, password });
      alert("Pendaftaran berhasil! Silakan Log In.");
      router.push('/login');
    } catch (error) {
      alert("Pendaftaran gagal. Pastikan form diisi dengan benar.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 text-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
          <p className="text-gray-500 text-sm mt-1">Bergabunglah dengan komunitas AdoptPet.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-sm">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors" 
              placeholder="Misal: Akbar Anvasa Faraby" 
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors" 
              placeholder="nama@email.com" 
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors" 
              placeholder="Minimal 8 karakter" 
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all mt-6">
            Daftar Sekarang
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-orange-500 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}