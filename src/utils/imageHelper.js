// src/utils/imageHelper.js

// URL base da api
export const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

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