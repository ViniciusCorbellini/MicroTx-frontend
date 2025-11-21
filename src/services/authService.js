import api from "../api/api";

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
    register: async (formData) => {
        try {
            const response = await api.post('/auth/register', formData);
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response?.data || new Error('Erro ao tentar fazer cadastro');
        }
    },


    validate: async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("AuthService: Sem token no storage, validação cancelada.");
                return false;
            }
            const response = await api.get('/auth/validate');
            return response.status === 200;
        } catch (error) {
            console.log(error);
            // Se o erro for 403 ou 401, o token é inválido
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("AuthService: Validação falhou (token inválido ou expirado).");
                return false; // Retorna false em vez de lançar um erro
            }
            throw error.response?.data || new Error('Erro ao validar token jwt');
        }
    },
}

export default authService;