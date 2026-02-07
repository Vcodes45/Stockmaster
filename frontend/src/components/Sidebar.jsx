import React from 'react';
import { LayoutDashboard, Package, Truck, ArrowRightLeft, LogOut, Hexagon, User, Tag, Users, MapPin, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isManager } = useAuth();
  
  // Define all menu items with RBAC roles
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['MANAGER', 'STAFF'] },
    { icon: Package, label: 'Products', path: '/products', roles: ['MANAGER'] },
    { icon: Tag, label: 'Categories', path: '/categories', roles: ['MANAGER'] },
    { icon: Users, label: 'Contacts', path: '/contacts', roles: ['MANAGER', 'STAFF'] },
    { icon: MapPin, label: 'Locations', path: '/locations', roles: ['MANAGER', 'STAFF'] },
    { icon: Truck, label: 'Receipts', path: '/receipts', roles: ['MANAGER', 'STAFF'] },
    { icon: LogOut, label: 'Deliveries', path: '/deliveries', roles: ['MANAGER', 'STAFF'] },
    { icon: ArrowRightLeft, label: 'Transfers', path: '/transfers', roles: ['MANAGER', 'STAFF'] },
    { icon: FileText, label: 'Adjustments', path: '/adjustments', roles: ['MANAGER', 'STAFF'] },
  ];

  // Filter menu based on role
  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = async () => {
    // Navigate first before clearing auth state to prevent
    // ProtectedRoute from redirecting to /login
    navigate('/', { replace: true });
    await logout();
  };

  return (
    <motion.div 
      initial={{ x: -100 }} animate={{ x: 0 }} 
      className="h-screen w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-300"
    >
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-200 dark:shadow-none">
          <img src="/logo.png" alt="StockMaster" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 block">
            StockMaster
          </span>
          <span className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
            {user?.role || 'User'} View
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative group block">
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl" 
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                <item.icon size={22} className={item.label === 'Deliveries' ? 'rotate-180' : ''} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer with Logout Only */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-700 space-y-4 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <User size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;