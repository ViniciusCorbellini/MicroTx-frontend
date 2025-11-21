// src/services/userService.js
import api from "../api/api";

const userService = {
    /**
     * Busca a lista de posts recomendados para o usuário logado.
     */
    getPostRecommendations: async () => {
        try {
            const response = await api.get('/recommendations/posts');
            console.log(response.data)
            return response.data.content;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao buscar recomendações');
        }
    },

    /**
     * Busca a lista de usuários recomendados para o usuário logado.
     */
    getUserRecommendations: async () => {
        try {
            const response = await api.get('/recommendations/users');
            console.log(response.data)
            return response.data.content;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao buscar recomendações');
        }
    },

    /**
     * Atualiza o perfil do usuário (Texto + Imagem)
     */
    updateProfile: async (data, file) => {
        const formData = new FormData();

        // Parte do JSON 
        // (diz ao spring que essa parte da req tem o tipo application/json)
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('usuario', jsonBlob);

        // Parte da Imagem 
        // (a chave dessa parte da req é 'imagem')
        if (file) {
            formData.append('imagem', file);
        }

        try {
            // O Axios define o Content-Type como multipart/form-data automaticamente, 
            // assim como na requisição de register
            const response = await api.put('/usuarios/me', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao atualizar perfil');
        }
    },

    /**
     * Segue um usuário
     * Retorna os dados atualizados da relação de seguidor
     */
    followUser: async (seguidoId) => {
        try {
            // null para o body
            const response = await api.post(`/seguidores/seguir`, null, {
                params: { seguidoId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao seguir usuário');
        }
    },

    /**
     * Segue um usuário
     * Retorna os dados atualizados da relação de seguidor
     */
    unfollowUser: async (seguidoId) => {
        try {
            const response = await api.delete(`/seguidores/deixar-de-seguir`, {
                params: { seguidoId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao seguir usuário');
        }
    },

    /**
     * Verifica se o usuário logado segue um determinado usuário.
     */
    isFollowing: async (seguidoId) => {
        try {
            const response = await api.get('/seguidores/is-seguindo', {
                params: { seguidoId }
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao verificar status de seguidor para id ${seguidoId}`, error);
            return false; // Em caso de erro, assumirei que o user não segue
        }
    },

    /**
     * Busca os dados públicos de um usuário pelo ID
     */
    getUserById: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },

    /**
     * Busca os posts de um usuário específico
     */
    getUserPosts: async (id) => {
        // /posts/usuario/{usuarioId}/paginado
        const response = await api.get(`/posts/usuario/${id}/paginado`);

        return response.data.content;
    },

    /**
     * Busca usuários por nome
     */
    searchUsers: async (name) => {
        if (!name) return [];
        const response = await api.get('/usuarios/nome', {
            params: { nome: name }
        });
        return response.data;
    },
};

export default userService;