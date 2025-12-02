// Instancia do axios que serve como base para configuração do serviço de fetch
import axios from 'axios';

// Definindo a url do back
const API_URL = import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:8080';

/**
 * Instância base do Axios configurada para comunicação com o Backend.
 *
 * @description
 * - Define a `baseURL` automaticamente baseada na variável de ambiente `VITE_BACKEND_SERVER_URL`.
 * - Caso a variável não esteja definida, utiliza `http://localhost:8080` como fallback.
 *
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: API_URL,
})

export default api;