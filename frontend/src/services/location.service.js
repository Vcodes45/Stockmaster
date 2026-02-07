import api from './api';

export const locationService = {
  // Get all locations
  getAll: async (params = {}) => {
    const response = await api.get('/locations', { params });
    return response;
  },

  // Get location by ID
  getById: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response;
  },

  // Create location
  create: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response;
  },

  // Update location
  update: async (id, locationData) => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response;
  },

  // Delete location
  delete: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response;
  },

  // Get internal locations only
  getInternal: async () => {
    const response = await api.get('/locations?type=INTERNAL');
    return response;
  },

  // Get inventory loss location
  getInventoryLoss: async () => {
    const response = await api.get('/locations?type=INVENTORY_LOSS');
    return response;
  },
};
