// src/services/userService.js
import api from "../api/api";

const userService = {
  /**
   * Busca a lista de posts recomendados para o usuário logado.
   */
  getRecommendations: async () => {
    try {
      const response = await api.get('/recommendations/posts'); 
      return response.data;
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