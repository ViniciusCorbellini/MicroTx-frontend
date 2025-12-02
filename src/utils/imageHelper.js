// src/utils/imageHelper.js

/**
 * URL base do servidor backend, carregada das variáveis de ambiente.
 * @constant {string}
 */
export const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

/**
 * Processa e retorna a URL completa de uma imagem.
 *
 * @description
 * Esta função lida com três cenários:
 * 1. **Sem caminho:** Retorna uma imagem padrão (placeholder) se o path for nulo/vazio.
 * 2. **URL Absoluta:** Retorna o path original se ele já for um link externo (começa com http).
 * 3. **Caminho Relativo:** Concatena a `BASE_URL` com o caminho relativo do backend.
 *
 * @param {string|null|undefined} path - O caminho da imagem (ex: '/uploads/foto.png') ou null.
 * @returns {string} A URL pronta para ser usada no atributo 'src' de uma tag <img>.
 */
export const getImageUrl = (path) => {

    if (!path) {
        // Retorna uma imagem padrao de user sem foto
        return 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
    }

    // Se o caminho já vier completo (https://...), retorna ele mesmo
    if (path.startsWith('http')) {
        return path;
    }

    // Concatena a base com o relative path da img
    return `${BASE_URL}${path}`;
};