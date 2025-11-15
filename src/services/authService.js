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
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response?.data || new Error('Erro ao tentar fazer login');
        }
    },


    validate: async () => {
        try {
            // LEIA O TOKEN AQUI PRIMEIRO
            const token = localStorage.getItem('token');

            // Se não há token, não há nada para validar.
            // Retorne 'false' silenciosamente ou lance um erro específico.
            if (!token) {
                console.log("AuthService: Sem token no storage, validação cancelada.");
                return false;
            }

            // Só agora, com um token, faça a chamada
            console.log("AuthService: Token encontrado, enviando para /auth/validate");
            const response = await api.get('/auth/validate'); // O interceptor agora vai funcionar

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
    }

}

export default authService;