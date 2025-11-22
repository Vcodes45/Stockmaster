import React from 'react';
import { LayoutDashboard, Package, Truck, ArrowRightLeft, LogOut, Hexagon, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ userRole, onLogout }) => {
  const location = useLocation();
  
  // Define all menu items with RBAC roles
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['manager', 'staff'] },
    { icon: Package, label: 'Products', path: '/products', roles: ['manager'] }, // Manager Only
    { icon: Truck, label: 'Receipts', path: '/receipts', roles: ['manager', 'staff'] },
    { icon: LogOut, label: 'Deliveries', path: '/deliveries', roles: ['manager', 'staff'] },
    { icon: ArrowRightLeft, label: 'Transfers', path: '/transfers', roles: ['manager', 'staff'] },
  ];

  // Filter menu based on role
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.div 
      initial={{ x: -100 }} animate={{ x: 0 }} 
      className="h-screen w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-300"
    >
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
          <Hexagon className="text-white fill-white" size={24} />
        </div>
        <div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 block">
            StockMaster
          </span>
          <span className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
            {userRole} View
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
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
        >
          <User size={16} /> Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;