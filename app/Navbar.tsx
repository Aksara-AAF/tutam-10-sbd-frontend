"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-[#fdfbf7] border-b-2 border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-2xl shadow-sm border border-orange-300">
              🐱
            </div>
            <span className="text-2xl font-extrabold text-orange-500 tracking-tight">Adopt<span className="text-gray-800">Pet</span></span>
          </Link>

          <ul className="hidden md:flex space-x-8 font-semibold text-gray-500">
            <li>
              <Link href="/" className="hover:text-orange-500 transition-colors duration-200">Beranda</Link>
            </li>
            <li>
              <Link href="/pets" className="hover:text-orange-500 transition-colors duration-200">Katalog Hewan</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="hidden md:block font-semibold text-gray-600 hover:text-orange-500 transition-colors duration-200 px-4">
                Profil Saya
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-50 text-red-500 px-5 py-2.5 rounded-full hover:bg-red-100 transition-all duration-200 text-sm font-bold border border-red-100 active:scale-95"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-6 py-2.5 text-orange-500 font-bold border-2 border-orange-500 rounded-full hover:bg-orange-50 hover:shadow-sm active:scale-95 transition-all duration-200">
                Log In
              </Link>
              
              <Link href="/register" className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200">
                Daftar
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}