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
    }

    /**
     *  Para buscar dados do perfil do usuário logado.
     */
    //   getMyProfile: async () => {
    //     try {
    //       const response = await api.get('/users/me'); // TODO
    //       return response.data;
    //     } catch (error) {
    //       throw error.response?.data || new Error('Erro ao buscar perfil');
    //     }
    //   },

    // TODO outras funções (seguir usuário, atualizar perfil...)
};

export default userService;