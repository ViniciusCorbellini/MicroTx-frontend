import api from "../api/api";

const postService = {
    /**
     * Busca o feed de recomendações (Paginado)
     */
    getFeed: async (page = 0, size = 10) => {
        const response = await api.get('/recommendations/posts', {
            params: { page, size }
        });
        // Retorna o objeto completo da Page (content, totalPages, etc)
        return response.data;
    },

    /**
     * Busca posts por palavra chave (Array simples)
     */
    searchPosts: async (query) => {
        if (!query) return [];
        const response = await api.get('/posts/buscar', {
            params: { palavra: query }
        });
        return response.data;
    },

    /**
     * Cria um novo post
     * POST /posts?texto=...
     */
    createPost: async (texto) => {
        // Passamos null no body, e o texto via params
        const response = await api.post('/posts', null, {
            params: { texto }
        });
        return response.data;
    },

    /**
     * Busca posts de um usuário específico (paginado)
     * GET /usuario/{id}/paginado?page=0&size=10
     */
    getUserPostsPaginated: async (userId, page = 0, size = 10) => {
        const response = await api.get(`/posts/usuario/${userId}/paginado`, {
            params: { page, size }
        });
        return response.data; // Retorna o objeto Page (content, totalPages, etc)
    },

    /**
     * Atualiza um post
     * PUT /posts/{id}?novoTexto=...
     */
    updatePost: async (id, novoTexto) => {
        const response = await api.put(`/posts/${id}`, null, {
            params: { novoTexto }
        });
        return response.data;
    },

    /**
     * Deleta um post
     * DELETE /posts/{id}
     */
    deletePost: async (id) => {
        await api.delete(`/posts/${id}`);
        // Não retorna nada 204
    }
};

export default postService;