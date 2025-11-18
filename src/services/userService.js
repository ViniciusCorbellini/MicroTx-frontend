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