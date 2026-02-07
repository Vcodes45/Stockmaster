import api from './api';

export const productService = {
  // Get all products
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response;
  },

  // Get product by ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
  },

  // Create product with initial stock
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response;
  },

  // Update product
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response;
  },

  // Get product stock quantities
  getStock: async (id) => {
    const response = await api.get(`/products/${id}/stock`);
    return response;
  },

  // Get low stock products
  getLowStock: async () => {
    const response = await api.get('/products/low-stock');
    return response;
  },
};
