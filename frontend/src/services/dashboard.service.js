import api from './api';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
    return response;
  },

  // Get stock movements for charts
  getStockMovements: async (period = '7days') => {
    const response = await api.get(`/dashboard/stock-movements?period=${period}`);
    return response;
  },
};
