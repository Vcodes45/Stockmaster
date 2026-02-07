import api from './api';

export const contactService = {
  // Get all contacts
  getAll: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response;
  },

  // Get contact by ID
  getById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response;
  },

  // Create contact
  create: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response;
  },

  // Update contact
  update: async (id, contactData) => {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response;
  },

  // Delete contact
  delete: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response;
  },

  // Get vendors only
  getVendors: async () => {
    const response = await api.get('/contacts?type=VENDOR');
    return response;
  },

  // Get customers only
  getCustomers: async () => {
    const response = await api.get('/contacts?type=CUSTOMER');
    return response;
  },
};
