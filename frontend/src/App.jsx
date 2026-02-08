import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';


import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';


import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import Categories from './pages/Categories';
import Contacts from './pages/Contacts';
import Locations from './pages/Locations';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Adjustments from './pages/Adjustments';
import Transfers from './pages/Transfers';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={<LandingPage theme={theme} toggleTheme={toggleTheme} />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex w-full">
                <Sidebar />
                <main className="flex-1 ml-72 p-8 h-screen overflow-y-auto scrollbar-hide relative">
                  {/* Top Right Theme Toggle */}
                  <div className="fixed top-6 right-6 z-50">
                    <button
                      onClick={toggleTheme}
                      className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/30 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
                      title="Toggle Theme"
                    >
                      {theme === 'dark' ? (
                        <Moon size={20} className="text-indigo-400" />
                      ) : (
                        <Sun size={20} className="text-orange-400" />
                      )}
                    </button>
                  </div>

                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/products"
                      element={
                        <ProtectedRoute requiredRole="MANAGER">
                          <ProductList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/products/add"
                      element={
                        <ProtectedRoute requiredRole="MANAGER">
                          <AddProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/categories"
                      element={
                        <ProtectedRoute requiredRole="MANAGER">
                          <Categories />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/receipts" element={<Receipts />} />
                    <Route path="/deliveries" element={<Deliveries />} />
                    <Route path="/transfers" element={<Transfers />} />
                    <Route path="/adjustments" element={<Adjustments />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
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