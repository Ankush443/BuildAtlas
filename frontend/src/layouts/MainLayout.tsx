import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Search, Bell, Plus, User, LogOut, Settings, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Notification } from '../types';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count');
        setUnreadCount(data.data.count);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-atlas-700">
                <div className="w-8 h-8 bg-atlas-600 rounded-lg flex items-center justify-center text-white text-sm">B</div>
                BuildAtlas
              </Link>
              <Link to="/discover" className="hidden md:block text-gray-600 hover:text-gray-900 font-medium">Discover</Link>
              {user && (
                <form onSubmit={handleSearch} className="hidden md:flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-atlas-500 w-64" />
                  </div>
                </form>
              )}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/projects/new" className="hidden md:flex items-center gap-1.5 btn-primary text-sm">
                    <Plus className="w-4 h-4" /> New Project
                  </Link>
                  <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-atlas-100 text-atlas-700 rounded-full flex items-center justify-center font-medium text-sm">{user.name[0]}</div>}
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 hidden group-hover:block">
                      <div className="px-4 py-2 border-b border-gray-100"><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-gray-500">@{user.username}</p></div>
                      <Link to={`/u/${user.username}`} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><User className="w-4 h-4" /> Profile</Link>
                      <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><Settings className="w-4 h-4" /> Settings</Link>
                      {user.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"><Shield className="w-4 h-4" /> Admin</Link>}
                      <button onClick={async () => { await logout(); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left text-red-600"><LogOut className="w-4 h-4" /> Logout</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log in</Link>
                  <Link to="/register" className="btn-primary text-sm">Sign up</Link>
                </div>
              )}
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-4 space-y-2">
            <Link to="/discover" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
            {user && <Link to="/projects/new" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>New Project</Link>}
            {!user && <Link to="/login" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>}
          </div>
        )}
      </nav>
      <main><Outlet /></main>
    </div>
  );
}
