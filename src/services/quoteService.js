// src/services/quoteService.js
import api from "../api/api";

const quoteService = {
  /**
   * Busca as últimas 10 frases
   * GET /frases/ultimas
   */
  getRecentQuotes: async () => {
    const response = await api.get('/frases/ultimas');
    return response.data;
  },

  /**
   * Busca frases por palavra chave
   * GET /frases/buscar?palavra=...
   */
  searchQuotes: async (query) => {
    if (!query) return [];
    const response = await api.get('/frases/buscar', {
      params: { palavra: query }
    });
    return response.data;
  },

  /**
   * Cria uma nova frase
   * POST /frases
   * Body: { texto, dataExpiracao }
   */
  createQuote: async (texto, minutosParaExpirar) => {
    // Calcula a data futura baseada nos minutos escolhidos
    const dataExpiracao = new Date(Date.now() + minutosParaExpirar * 60000); // obs: 60000ms = 1 min

    const body = {
      texto,
      // Envia no formato ISO ( YYYY-MM-DDTHH:MM:SS.sssZ )
      dataExpiracao: dataExpiracao.toISOString() 
    };

    const response = await api.post('/frases', body);
    return response.data;
  }
};

export default quoteService;