import api from './api';

export const operationService = {
  // Get all operations
  getAll: async (params = {}) => {
    const response = await api.get('/operations', { params });
    return response;
  },

  // Get operation by ID
  getById: async (id) => {
    const response = await api.get(`/operations/${id}`);
    return response;
  },

  // Create operation (DRAFT status)
  create: async (operationData) => {
    const response = await api.post('/operations', operationData);
    return response;
  },

  // Update operation
  update: async (id, operationData) => {
    const response = await api.put(`/operations/${id}`, operationData);
    return response;
  },

  // Delete operation
  delete: async (id) => {
    const response = await api.delete(`/operations/${id}`);
    return response;
  },

  // Validate operation (moves stock)
  validate: async (id) => {
    const response = await api.post(`/operations/${id}/validate`);
    return response;
  },

  // Cancel operation
  cancel: async (id) => {
    const response = await api.post(`/operations/${id}/cancel`);
    return response;
  },

  // Get receipts (RECEIPT type)
  getReceipts: async (params = {}) => {
    const response = await api.get('/operations?type=RECEIPT', { params });
    return response;
  },

  // Get deliveries (DELIVERY type)
  getDeliveries: async (params = {}) => {
    const response = await api.get('/operations?type=DELIVERY', { params });
    return response;
  },

  // Get transfers (INTERNAL_TRANSFER type)
  getTransfers: async (params = {}) => {
    const response = await api.get('/operations?type=INTERNAL_TRANSFER', { params });
    return response;
  },

  // Get adjustments (ADJUSTMENT type)
  getAdjustments: async (params = {}) => {
    const response = await api.get('/operations?type=ADJUSTMENT', { params });
    return response;
  },

  // Get stock ledger
  getStockLedger: async (params = {}) => {
    const response = await api.get('/operations/stock-ledger', { params });
    return response;
  },
};
