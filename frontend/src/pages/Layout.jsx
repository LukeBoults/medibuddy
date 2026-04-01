import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Pill,
  Bell,
  ClipboardList,
  Users,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const userNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/user/dashboard' },
  { icon: Pill, label: 'My Medications', path: '/user/medications' },
  { icon: Bell, label: 'Reminders', path: '/user/reminders' },
  { icon: ClipboardList, label: 'Dose Log', path: '/user/dose-log' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: BookOpen, label: 'Medication Catalogue', path: '/admin/catalogue' },
  { icon: MessageSquare, label: 'Notification Templates', path: '/admin/templates' },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = location.pathname.startsWith('/admin');
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2E7D32] text-white rounded-md"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static w-64 h-full bg-[#2E7D32] text-white flex flex-col transition-transform duration-300 z-40`}
      >
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-semibold">MedReminder</h1>
          <p className="text-sm text-white/80 mt-1">{isAdmin ? 'Admin Panel' : 'User Panel'}</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-white/20 font-medium' : 'hover:bg-white/10'}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              onClick={() => {
                navigate(isAdmin ? '/user/dashboard' : '/admin/dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-4 pt-4 border-t border-white/20 hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>{isAdmin ? 'User Panel' : 'Admin Panel'}</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
