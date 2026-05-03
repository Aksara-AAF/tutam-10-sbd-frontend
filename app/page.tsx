"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <div className="bg-orange-100 rounded-3xl p-10 md:p-20 text-center shadow-sm border border-orange-200 mt-6 flex flex-col items-center">
        <div className="text-6xl mb-6">🐾</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Beri Mereka Rumah, <br className="hidden md:block" />
          <span className="text-orange-500">Temukan Sahabat Baru</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Ribuan hewan peliharaan yang lucu dan setia sedang menunggu uluran tanganmu. Adopsi sekarang atau bantu temukan rumah baru untuk mereka.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pets" className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Cari Sahabat 🐱
          </Link>
          <Link href="/pets/create" className="bg-white text-orange-500 font-bold py-3 px-8 rounded-full shadow border-2 border-orange-200 hover:bg-orange-50 hover:-translate-y-1 transition-all duration-300">
            Open Adopsi 📢
          </Link>
        </div>
      </div>
    </div>
  );
}