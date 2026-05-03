import './globals.css';
import Navbar from './Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#fdfbf7] text-gray-800 font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-8 pb-12">{children}</main>
        
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
          <p>© 2026 AdoptPet. Bantu Mochi dan teman-temannya menemukan rumah.</p>
        </footer>
      </body>
    </html>
  );
}