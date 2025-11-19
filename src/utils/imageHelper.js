// src/utils/imageHelper.js

// URL base da api
export const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export const getImageUrl = (path) => {

    console.log(path)
    if (!path) {
        // Retorna uma imagem padrao de user sem foto
        return 'https://via.placeholder.com/150'; //TODO
    }

    // Se o caminho já vier completo (https://...), retorna ele mesmo
    if (path.startsWith('http')) {
        return path;
    }

    // Concatena a base com o relative path da img
    return `${BASE_URL}${path}`;
};