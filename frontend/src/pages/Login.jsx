import React, { useState } from 'react';
import { User, Lock, UserCheck, Users } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication logic (you can replace with real auth later)
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      onLogin('manager');
    } else if (loginData.username === 'staff' && loginData.password === 'staff') {
      onLogin('staff');
    } else {
      alert('Invalid credentials! Try: admin/admin or staff/staff');
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickLogin = (role) => {
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-100/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">StockMaster</h1>
            <p className="text-indigo-100 text-sm">Inventory Management System</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 text-center">
                Demo Accounts
              </h3>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Manager Demo */}
                <button
                  onClick={() => handleQuickLogin('manager')}
                  className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <UserCheck size={16} className="text-green-500" />
                  Manager
                </button>

                {/* Staff Demo */}
                <button
                  onClick={() => handleQuickLogin('staff')}
                  className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Users size={16} className="text-blue-500" />
                  Staff
                </button>
              </div>
              
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center space-y-1">
                <p><strong>Manager:</strong> admin / admin (Full Access)</p>
                <p><strong>Staff:</strong> staff / staff (Limited Access)</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Secure Inventory Management • Built with React
        </div>
      </div>
    </div>
  );
};

export default Login;
