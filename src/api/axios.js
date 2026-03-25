import axios from 'axios';

const API = axios.create({
    baseURL: 'ashwdesk-ai-backend-production.up.railway.app'
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (
        token && 
        !config.url.includes("/auth/login") &&
        !config.url.includes("/auth/register")
     )
     {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;