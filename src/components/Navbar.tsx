import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, Search, TrendingUp, LogOut, User, BarChart2 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart2 },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
  ];

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-brand-dark/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6 justify-between">
      <Link to="/" className="flex items-center gap-2 text-brand-primary">
        <Music size={28} />
        <span className="text-xl font-display font-bold text-white">MusicTrend</span>
      </Link>

      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              location.pathname === item.path ? 'text-brand-primary' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <User size={18} />
          <span className="text-sm">{user.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
