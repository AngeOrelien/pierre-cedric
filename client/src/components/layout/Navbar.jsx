// components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">Pierre-Cedric</div>
            {/* You can use an image instead: 
            <img src="/logo.png" alt="Pierre-Cedric" className="h-8" /> */}
          </Link>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded-r-full hover:bg-blue-700 transition"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <Link to="/account" className="text-gray-600 hover:text-blue-600">
              <UserIcon className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded-r-full hover:bg-blue-700 transition"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}