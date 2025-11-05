import api from "./api";

const authService = {
    // Envia email e senha para a rota de login do backend
    login: async (email, senha) => {
        try {
            const response = await api.post('/auth/login', { email, senha });

            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao tentar fazer login');
        }
    },

    // Envia dados cadastrais para a rota de register do backend
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            return response.data
        } catch (error) {
            console.log(error)
            throw error.response?.data || new Error('Erro ao tentar fazer login');
        }
    }

}

export default authService;