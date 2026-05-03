"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      if (response.data.success || response.data.token) {
        localStorage.setItem('token', response.data.token || response.data.payload?.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data.payload?.user));
        window.location.href = '/';
      }
    } catch (error) {
      alert("Login gagal, periksa email dan password Anda.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 text-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-orange-200">
            🐱
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
          <p className="text-gray-500 text-sm mt-1">Masuk untuk mulai mengadopsi.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-sm">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors" 
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
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all mt-4">
            Log In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Belum punya akun? <Link href="/register" className="text-orange-500 font-bold hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}