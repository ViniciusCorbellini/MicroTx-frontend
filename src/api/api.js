// Instancia do axios que serve como base para configuração do serviço de fetch
import axios from 'axios';

// Definindo a url do back
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const api = axios.create({
    baseURL: API_URL,
})

export default api;