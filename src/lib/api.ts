import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // ใส่ /v1 ให้ตรงกับ Backend
  withCredentials: true,
});

// Interceptor แนบ Bearer Token อัตโนมัติ
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // ดึงค่า token ไม่ว่าจะเก็บในคีย์ token หรือ accessToken
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});