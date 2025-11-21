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
    }
};

export default postService;