// Instancia do axios que serve como base para configuração do serviço de fetch
import axios from 'axios';

// Definindo a url do back
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const api = axios.create({
    baseURL: API_URL,
})

// Integrando auth por token jwt:
// definimos um interceptor que adiciona o token a cada request que o user faz enquanto logado
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;