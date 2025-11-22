import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally verify token with backend
          // const response = await authService.getCurrentUser();
          // setUser(response.data);
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      toast.success(`Welcome back, ${userData.fullname || userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please check your email to verify your account.');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.message || 'Registration failed';
      console.log(error);
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated: !!user,
    isManager: user?.role === 'MANAGER',
    isStaff: user?.role === 'STAFF',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
