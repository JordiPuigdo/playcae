'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="h-16 sticky top-0 z-50 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
        aria-label="Cerrar sesión"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
