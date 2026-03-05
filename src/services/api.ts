import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const musicApi = {
  getTrending: () => api.get('/music/trending').then(res => res.data),
  search: (q: string) => api.get(`/music/search?q=${q}`).then(res => res.data),
  getTrack: (id: string) => api.get(`/music/track/${id}`).then(res => res.data),
  getArtist: (id: string) => api.get(`/music/artist/${id}`).then(res => res.data),
};

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials).then(res => res.data),
  register: (credentials: any) => api.post('/auth/register', credentials).then(res => res.data),
};

export default api;
