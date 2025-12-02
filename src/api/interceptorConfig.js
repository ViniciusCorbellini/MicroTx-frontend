// src/services/interceptorConfig.js
import api from './api';

api.interceptors.request.use(
    /**
     * Interceptador de requisições HTTP.
     *
     * Antes de cada requisição ser enviada, verifica se existe um token JWT
     * armazenado no localStorage e o injeta no cabeçalho 'Authorization'.
     *
     * @param {import('axios').InternalAxiosRequestConfig} config - Configuração da requisição atual.
     * @returns {import('axios').InternalAxiosRequestConfig} A configuração modificada com o token (se existir).
     */
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },

    /**
     * Tratamento de erro no envio da requisição.
     *
     * @param {any} error - O erro ocorrido antes da requisição chegar ao servidor.
     * @returns {Promise<never>} Rejeita a promessa com o erro original.
     */  
    (error) => {
        return Promise.reject(error);
    }
);