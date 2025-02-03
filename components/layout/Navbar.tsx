import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Filtrar navegación según el rol
  const getNavigation = () => {
    const baseNavigation = [
      { name: 'Inicio', href: '/' },
      { name: 'Jugadores', href: '/players' },
      { name: 'Agregar Puntuación', href: '/scoring' },
      { name: 'Tabla de Posiciones', href: '/leaderboard' },
    ];

    // Solo mostrar "Juegos" si es admin
    if (user?.role === 'admin') {
      baseNavigation.splice(1, 0, { name: 'Juegos', href: '/games' });
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  return (
    <nav className="bg-[#003b91] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/logoymmies.png"
                  alt="Yummies Logo"
                  width={220}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.href)
                      ? 'border-b-2 border-[#ffc20e] text-white'
                      : 'text-gray-200 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-white px-3 py-2 rounded-md">
              <UserCircleIcon className="h-6 w-6" />
              <span>{user?.name}</span>
              <span className="text-xs text-gray-300">
                ({user?.role === 'admin' ? 'Administrador' : 'Edecán'})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-200 hover:text-white hover:bg-[#17469e] px-3 py-2 rounded-md text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 
                hover:text-white hover:bg-[#17469e] focus:outline-none focus:ring-2 
                focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive(item.href)
                  ? 'bg-[#17469e] border-l-4 border-[#ffc20e] text-white'
                  : 'text-gray-200 hover:bg-[#17469e] hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* Mobile User Profile & Logout */}
          <div className="border-t border-[#17469e] pt-2">
            <div className="px-4 py-2 text-white flex items-center space-x-2">
              <UserCircleIcon className="h-5 w-5" />
              <span className="text-sm">{user?.name}</span>
              <span className="text-xs text-gray-300">
                ({user?.role === 'admin' ? 'Administrador' : 'Edecán'})
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-200 hover:bg-[#17469e] hover:text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}