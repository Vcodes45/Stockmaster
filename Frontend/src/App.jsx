import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

// Component Imports
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

// Page Imports
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Adjustments from './pages/Adjustments';
import Transfers from './pages/transfers';

function App() {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // Auth State: 'manager' | 'staff' | null
  const [userRole, setUserRole] = useState(null); 

  // Handle Dark Mode Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // If not logged in, show Login Page
  if (!userRole) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Login onLogin={(role) => setUserRole(role)} />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex bg-[#F8FAFC] dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Pass role to Sidebar to filter menu items */}
        <Sidebar 
          userRole={userRole} 
          onLogout={() => setUserRole(null)} 
        />

        <main className="flex-1 ml-72 p-8 h-screen overflow-y-auto scrollbar-hide relative">
          
          {/* Top Right Theme Toggle */}
          <div className="fixed top-6 right-6 z-50">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-orange-400" />}
            </button>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard userRole={userRole} />} />
            
            {/* Protected Route: Only Managers can see Add Product */}
            <Route 
              path="/products" 
              element={userRole === 'manager' ? <AddProduct /> : <Navigate to="/" replace />} 
            />
            
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/adjustments" element={<Adjustments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 dark:text-slate-600">
    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse mb-4"></div>
    <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400">{title}</h2>
    <p>This module is coming soon.</p>
  </div>
);

export default App;