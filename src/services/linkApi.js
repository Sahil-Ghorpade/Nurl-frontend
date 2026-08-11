import api from './api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const linkApi = {
  async getDashboard() {
    const response = await api.get('/dashboard');
    return response.data;
  },

  async getLinks(page = 0, size = 10, sort = 'createdAt,desc') {
    const response = await api.get(`/links?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  },

  async createLink(payload) {
    // payload: { originalUrl, alias?, expiresAt? }
    const response = await api.post('/link', payload);
    return response.data;
  },

  async createPublicLink(originalUrl) {
    const response = await api.post('/link/public', { originalUrl });
    return response.data;
  },

  async getLink(id) {
    const response = await api.get(`/link/${id}`);
    return response.data;
  },

  async getDeletedLinks(page = 0, size = 10) {
    const response = await api.get(`/links/deleted?page=${page}&size=${size}&sort=deletedAt,desc`);
    return response.data;
  },

  async deleteLink(id) {
    const response = await api.delete(`/link/${id}`);
    return response.data;
  },

  async deleteLinkPermanently(id) {
    const response = await api.delete(`/link/delete/${id}`);
    return response.data;
  },

  async restoreLink(id, payload = {}) {
    const response = await api.patch(`/link/restore/${id}`, payload);
    return response.data;
  },

  async updateLink(id, payload) {
    const response = await api.patch(`/link/${id}`, payload);
    return response.data;
  },

  getQrCodeUrl(id) {
    return `${BASE_URL}/link/qr/${id}`;
  },
};

export default linkApi;
