// src/services/interceptorConfig.js
import api from './api';

api.interceptors.request.use(
    (config) => {
        console.log("LOG DO INTERCEPTOR: O interceptor FOI executado."); // <-- NOVO LOG
        const token = localStorage.getItem('token');
        console.log("LOG DO INTERCEPTOR: Token encontrado no storage:", token); // <-- NOVO LOG

        if (token) {
            console.log("LOG DO INTERCEPTOR: Token existe, anexando header...");
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log("LOG DO INTERCEPTOR: Token está nulo ou vazio. Header NÃO anexado."); // <-- NOVO LOG
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);